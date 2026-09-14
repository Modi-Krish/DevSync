import { NextRequest, NextResponse } from "next/server";
import { connectDB, ProjectModel, UserModel } from "@devsync/database";
import { env } from "@devsync/config";
import { enrichProjectData } from "@devsync/ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId } = body;

    await connectDB(env.MONGODB_URI);

    const project = await ProjectModel.findById(projectId);
    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    console.log(`Starting AI Enrichment for project ${project.github.name}`);

    // Mocked GitHub topics for now, ideally fetched during repo sync
    const repoData = {
      name: project.github.name,
      description: project.content?.shortDescription || "",
      readme: project.content?.longDescription || "This is a placeholder README until github.getRepositoryFile works properly.", // Fallback if missing
      topics: project.categories || [],
      technologies: project.technologies.map((t: { name: string }) => t.name),
    };

    const aiMetadata = await enrichProjectData(repoData);

    // Compute basic score
    const score = Math.floor(
      (aiMetadata.confidence * 40) + 
      (project.technologies.length * 10) // mock scoring
    );

    project.content = {
      title: aiMetadata.title,
      shortDescription: aiMetadata.shortDescription,
      longDescription: aiMetadata.longDescription,
      features: aiMetadata.features,
    };
    // Check user preferences for auto-publishing
    const user = await UserModel.findById(project.userId);
    const autoPublish = user?.preferences?.autoPublishProjects === true;

    project.categories = [aiMetadata.category, ...aiMetadata.tags].slice(0, 5);
    project.status = autoPublish ? "published" : "draft";
    if (autoPublish) project.published = true;
    project.score = Math.min(score, 100);

    await project.save();
    console.log(`Project ${project.github.name} updated to draft state`);

    return NextResponse.json({ success: true, aiMetadata });
  } catch (error) {
    console.error("AI Enrichment Error:", error);
    return new NextResponse(`Error: ${(error as Error).message}`, { status: 500 });
  }
}
