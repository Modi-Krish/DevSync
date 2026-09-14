import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    platform: { type: String, enum: ["linkedin", "twitter"], default: "linkedin" },
    externalId: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    url: { type: String },
    publishedAt: { type: Date, required: true },
  },
  { timestamps: true }
);

PostSchema.index({ userId: 1, publishedAt: -1 });

export const PostModel = mongoose.models.Post || mongoose.model("Post", PostSchema);
