import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    _id: { type: String, required: true }, // NextAuth providerAccountId (e.g. GitHub ID)
    name: { type: String },
    email: { type: String, required: true, unique: true },
    avatar: { type: String },
    bio: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      website: { type: String },
    },
    linkedinAccessToken: { type: String },
    preferences: {
      autoPublishProjects: { type: Boolean, default: false },
      autoSyncTechnologies: { type: Boolean, default: true },
      projectSelectionMode: { type: String, enum: ["topic", "manual", "all"], default: "topic" },
    },
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);
