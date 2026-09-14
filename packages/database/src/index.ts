import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async (uri: string) => {
  if (isConnected) return;
  if (mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }
  await mongoose.connect(uri);
  isConnected = true;
};

export * from "./schemas/user.schema";
export * from "./schemas/project.schema";
export * from "./schemas/technology.schema";
export * from "./schemas/sync-event.schema";
export * from "./schemas/approval-request.schema";
export * from "./schemas/post.schema";
