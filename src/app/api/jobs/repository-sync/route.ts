import { NextRequest, NextResponse } from "next/server";
import { connectDB, SyncEventModel, ProjectModel } from "@devsync/database";
import { env } from "@devsync/config";
import { detectTechnologies } from "@devsync/technology-detector";
import { GitHubClient } from "@devsync/github";
import { Client } from "@upstash/qstash";

const qstash = new Client({ token: env.QSTASH_TOKEN || "mock-token" });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { syncEventId, payload } = body;

    await connectDB(env.MONGODB_URI);

    const syncEvent = await SyncEventModel.findById(syncEventId);
    if (!syncEvent) {
      return new NextResponse("Sync Event not found", { status: 404 });
    }

    syncEvent.status = "processing";
    await syncEvent.save();

    const repoOwner = payload.repository.owner.login;
    const repoName = payload.repository.name;

    // TODO: get user token securely
    // For now, assume a dummy client without auth (rate limited for public repos)
    const github = new GitHubClient("");

    const [languages, packageJson, readme] = await Promise.all([
      github.getRepositoryLanguages(repoOwner, repoName),
      github.getRepositoryFile(repoOwner, repoName, "package.json"),
      github.getRepositoryFile(repoOwner, repoName, "README.md"),
    ]);

    const detections = detectTechnologies({
      languages: languages || {},
      packageJson: packageJson,
      readme: readme,
      files: ["package.json", "README.md"], // mock file list
    });

    console.log(`Detected technologies for ${repoName}:`, detections.map(d => d.name));

    // Upsert project
    const project = await ProjectModel.findOneAndUpdate(
      { userId: syncEvent.userId, "github.repositoryId": payload.repository.id },
      {
        $set: {
          "github.name": payload.repository.name,
          "github.url": payload.repository.html_url,
          "github.homepage": payload.repository.homepage,
          "github.visibility": payload.repository.visibility || "public",
          technologies: detections.map(d => ({ name: d.name, confidence: d.confidence })),
        },
        $setOnInsert: { status: "analyzed", categories: [], score: 0 },
      },
      { upsert: true, new: true }
    );

    syncEvent.status = "analyzed";
    syncEvent.completedAt = new Date();
    await syncEvent.save();

    if (env.QSTASH_URL && env.QSTASH_TOKEN) {
      await qstash.publishJSON({
        url: `${env.QSTASH_URL}/api/jobs/ai-enrichment`,
        body: { projectId: project._id.toString() },
      });
    }

    return NextResponse.json({ success: true, message: "Analyzed" });
  } catch (error) {
    console.error("Job Error", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
