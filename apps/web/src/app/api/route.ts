import { NextResponse } from "next/server";
import { env } from "@devsync/config";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
}
