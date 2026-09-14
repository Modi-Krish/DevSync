import mongoose, { Schema } from "mongoose";

const TechnologySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    category: { type: String },
    projectsCount: { type: Number, default: 0 },
    confidence: { type: Number, default: 0 },
    sources: [{ type: String, enum: ["github", "linkedin", "manual", "ai"] }],
  },
  { timestamps: true }
);

TechnologySchema.index({ userId: 1, name: 1 }, { unique: true });

export const TechnologyModel = mongoose.models.Technology || mongoose.model("Technology", TechnologySchema);
