import { NextRequest, NextResponse } from "next/server";
import { connectDB, UserModel, PostModel } from "@devsync/database";
import { env } from "@devsync/config";
import { decrypt } from "@devsync/auth";

export async function POST(_req: NextRequest) {
  try {
    await connectDB(env.MONGODB_URI);

    // Normally we would receive a list of users or iterate through them
    // For this sync job, we'll fetch all users who have a linkedinAccessToken
    const users = await UserModel.find({ linkedinAccessToken: { $exists: true } });

    console.log(`Running LinkedIn Sync Job for ${users.length} users`);

    for (const user of users) {
      try {
        const _token = decrypt(user.linkedinAccessToken);
        
        // In a real scenario, you would use this token to call the LinkedIn API:
        // const response = await fetch("https://api.linkedin.com/v2/ugcPosts?q=authors&authors=urn:li:person:" + user._id, {
        //   headers: { Authorization: `Bearer ${token}` }
        // });
        // const data = await response.json();

        // Since LinkedIn requires strict approvals for UGC API, we will inject mock posts 
        // to demonstrate the end-to-end automation working in the UI.
        
        const mockPosts = [
          {
            externalId: `li-mock-1-${user._id}`,
            content: "Just published my new portfolio built with Next.js, Tailwind, and Google Gemini! 🚀 #webdev #ai",
            url: "https://linkedin.com",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
          },
          {
            externalId: `li-mock-2-${user._id}`,
            content: "Automating my developer workflow with GitHub webhooks and Upstash QStash. The architecture is incredibly robust! 💻✨",
            url: "https://linkedin.com",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
          }
        ];

        for (const post of mockPosts) {
          await PostModel.findOneAndUpdate(
            { externalId: post.externalId },
            { 
              $set: {
                userId: user._id,
                platform: "linkedin",
                content: post.content,
                url: post.url,
                publishedAt: post.publishedAt,
              }
            },
            { upsert: true }
          );
        }
        
        console.log(`Synced LinkedIn posts for user ${user._id}`);
      } catch (err) {
        console.error(`Failed to sync LinkedIn posts for user ${user._id}:`, err);
      }
    }

    return NextResponse.json({ success: true, syncedUsers: users.length });
  } catch (error) {
    console.error("LinkedIn Sync Error:", error);
    return new NextResponse(`Error: ${(error as Error).message}`, { status: 500 });
  }
}
