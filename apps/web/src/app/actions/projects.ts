"use server";

import { connectDB, ProjectModel } from "@devsync/database";
import { env } from "@devsync/config";
import { revalidatePath } from "next/cache";

export async function approveProject(projectId: string, userId: string) {
  await connectDB(env.MONGODB_URI);
  
  const project = await ProjectModel.findOneAndUpdate(
    { _id: projectId, userId },
    { $set: { status: "published", published: true } },
    { new: true }
  );

  if (!project) throw new Error("Project not found");

  revalidatePath("/dashboard");
  return { success: true };
}

export async function rejectProject(projectId: string, userId: string) {
  await connectDB(env.MONGODB_URI);
  
  const project = await ProjectModel.findOneAndUpdate(
    { _id: projectId, userId },
    { $set: { status: "rejected" } },
    { new: true }
  );

  if (!project) throw new Error("Project not found");

  revalidatePath("/dashboard");
  return { success: true };
}
