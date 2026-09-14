import mongoose, { Schema } from "mongoose";

const ApprovalRequestSchema = new Schema(
  {
    userId: { type: String, ref: "User", required: true },
    entityType: { type: String, enum: ["project", "technology", "experience"], required: true },
    entityId: { type: String, required: true },
    action: { type: String, enum: ["publish", "update", "delete"], required: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "expired"],
      default: "pending",
    },
    changes: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const ApprovalRequestModel =
  mongoose.models.ApprovalRequest || mongoose.model("ApprovalRequest", ApprovalRequestSchema);
