import mongoose, { Schema } from "mongoose";

const SyncEventSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    source: { type: String, enum: ["github", "linkedin", "manual", "ai"], required: true },
    eventType: { type: String, required: true },
    externalId: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: ["queued", "processing", "analyzed", "skipped", "failed", "completed"],
      default: "queued",
    },
    changes: { type: Schema.Types.Mixed },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

export const SyncEventModel = mongoose.models.SyncEvent || mongoose.model("SyncEvent", SyncEventSchema);
