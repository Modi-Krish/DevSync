import mongoose, { Schema } from "mongoose";

const ProjectSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    github: {
      repositoryId: { type: Number, required: true },
      name: { type: String, required: true },
      url: { type: String, required: true },
      homepage: { type: String },
      visibility: { type: String, enum: ["public", "private"], required: true },
    },
    content: {
      title: { type: String },
      shortDescription: { type: String },
      longDescription: { type: String },
      features: [{ type: String }],
    },
    technologies: [
      {
        name: { type: String },
        confidence: { type: Number },
      },
    ],
    categories: [{ type: String }],
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["detected", "analyzed", "draft", "published", "deployed", "rejected"],
      default: "detected",
    },
    score: { type: Number, default: 0 },
    userPriorityBoost: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProjectSchema.index({ userId: 1, "github.repositoryId": 1 }, { unique: true });

export const ProjectModel = mongoose.models.Project || mongoose.model("Project", ProjectSchema);
