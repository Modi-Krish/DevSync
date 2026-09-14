import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import LinkedInProvider from "next-auth/providers/linkedin";
import { env } from "@devsync/config";
import { connectDB, UserModel } from "@devsync/database";

// Minimal encryption logic for the github access token
import crypto from "crypto";

const ENCRYPTION_KEY = crypto.scryptSync(env.NEXTAUTH_SECRET, "salt", 32);
const IV_LENGTH = 16;

export function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");
  return `${iv.toString("hex")}:${encrypted}:${authTag}`;
}

export function decrypt(text: string) {
  const parts = text.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted text");
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = Buffer.from(parts[1], "hex");
  const authTag = Buffer.from(parts[2], "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: { params: { scope: "read:user user:email repo" } },
      checks: ["state"], // Bypass strict OIDC checking for GitHub
      // @ts-ignore
      issuer: "https://github.com/login/oauth",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      authorization: { params: { scope: "openid profile email" } },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // If sign in, save the encrypted token in the DB or JWT
      if (account) {
        token.accessToken = encrypt(account.access_token as string);
        token.providerAccountId = account.providerAccountId;
        
        // If it's linkedin, save the token and profile info to DB so background workers can fetch posts
        if (account.provider === "linkedin") {
          await connectDB(env.MONGODB_URI);
          await UserModel.findByIdAndUpdate(
            account.providerAccountId,
            { 
              $set: { 
                name: profile?.name || profile?.localizedFirstName, 
                email: profile?.email,
                avatar: profile?.picture,
                linkedinAccessToken: encrypt(account.access_token as string) 
              } 
            },
            { upsert: true }
          );
        }
      }
      return token;
    },
    async session({ session, token }) {
      // NOTE: We do not expose the access token to the client session.
      // We only expose the user ID (providerAccountId).
      // API routes can decrypt the token from the JWT backend side.
      session.user.id = token.providerAccountId as string;
      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  trustHost: true,
});
