export enum ProjectStatus {
  DETECTED = "detected",
  ANALYZED = "analyzed",
  DRAFT = "draft",
  PUBLISHED = "published",
  DEPLOYED = "deployed",
  REJECTED = "rejected",
}

export enum SyncSource {
  GITHUB = "github",
  LINKEDIN = "linkedin",
  MANUAL = "manual",
  AI = "ai",
}

export enum ApprovalStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  EXPIRED = "expired",
}

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  preferences: {
    autoPublishProjects: boolean;
    autoSyncTechnologies: boolean;
    projectSelectionMode: "topic" | "manual" | "all";
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  userId: string;
  github: {
    repositoryId: number;
    name: string;
    url: string;
    homepage?: string;
    visibility: "public" | "private";
  };
  content?: {
    title: string;
    shortDescription: string;
    longDescription: string;
    features: string[];
  };
  technologies: {
    name: string;
    confidence: number;
  }[];
  categories: string[];
  featured: boolean;
  published: boolean;
  status: ProjectStatus;
  score: number;
  userPriorityBoost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Technology {
  id: string;
  userId: string;
  name: string;
  category?: string;
  projectsCount: number;
  confidence: number;
  sources: SyncSource[];
}

export interface SyncEvent {
  id: string;
  userId: string;
  source: SyncSource;
  eventType: string;
  externalId: string;
  status: "queued" | "processing" | "analyzed" | "skipped" | "failed" | "completed";
  changes?: Record<string, any>;
  createdAt: Date;
  completedAt?: Date;
}

export interface ApprovalRequest {
  id: string;
  userId: string;
  entityType: "project" | "technology" | "experience";
  entityId: string;
  action: "publish" | "update" | "delete";
  status: ApprovalStatus;
  changes: Record<string, any>;
  createdAt: Date;
}
