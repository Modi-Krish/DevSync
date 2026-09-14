import { NextRequest, NextResponse } from "next/server";
import { verifyWebhookSignature } from "@devsync/github";
import { env } from "@devsync/config";
import { Client } from "@upstash/qstash";
import { connectDB, SyncEventModel } from "@devsync/database";

const qstash = new Client({ token: env.QSTASH_TOKEN || "mock-token" });

export async function POST(req: NextRequest) {
  const signature = req.headers.get("x-hub-signature-256") || "";
  const event = req.headers.get("x-github-event") || "";
  const deliveryId = req.headers.get("x-github-delivery") || "";

  // Next.js raw body buffer for HMAC verification
  const rawBody = await req.text();

  if (!verifyWebhookSignature(rawBody, signature, env.GITHUB_WEBHOOK_SECRET)) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  // We only care about repositories for now
  if (!["repository", "push"].includes(event)) {
    return new NextResponse("Ignored event type", { status: 200 });
  }

  // Idempotency check
  await connectDB(env.MONGODB_URI);
  
  const existingEvent = await SyncEventModel.findOne({ externalId: deliveryId });
  if (existingEvent) {
    return new NextResponse("Already processed", { status: 200 });
  }

  // Create SyncEvent
  // Assume a dummy user ID for now since we don't have the user mapping logic fully implemented
  // In a real app we'd map payload.sender.id to our local user
  const syncEvent = await SyncEventModel.create({
    userId: "000000000000000000000000", 
    source: "github",
    eventType: event,
    externalId: deliveryId,
    status: "queued",
  });

  // Publish to QStash
  if (env.QSTASH_URL && env.QSTASH_TOKEN) {
    await qstash.publishJSON({
      url: `${env.QSTASH_URL}/api/jobs/repository-sync`,
      body: { syncEventId: syncEvent._id.toString(), payload, eventType: event },
    });
  }

  return NextResponse.json({ success: true, eventId: syncEvent._id });
}
