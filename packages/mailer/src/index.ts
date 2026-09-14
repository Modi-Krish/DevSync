import nodemailer from "nodemailer";
import { env } from "@devsync/config";

let transporter: nodemailer.Transporter;

async function getTransporter() {
  if (transporter) return transporter;

  // Use Ethereal (fake SMTP) if the user hasn't provided real credentials
  if (env.SMTP_HOST === "smtp.example.com" || env.NODE_ENV === "development") {
    console.log("Generating Ethereal email test account...");
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("Ethereal test account created successfully.");
  } else {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }
  
  return transporter;
}

export const sendMail = async (options: { to: string; subject: string; html: string; text?: string }) => {
  const mailer = await getTransporter();
  
  const info = await mailer.sendMail({
    from: env.SMTP_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text || options.html.replace(/<[^>]*>?/gm, ""), // simple fallback
  });

  if (env.SMTP_HOST === "smtp.example.com" || env.NODE_ENV === "development") {
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  
  return info;
};
