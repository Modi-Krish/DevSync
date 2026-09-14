import { GoogleGenAI, Type, Schema } from "@google/genai";
import { env } from "@devsync/config";

// Initialize the Gemini client
export const gemini = new GoogleGenAI({
  apiKey: env.GEMINI_API_KEY,
});

export const EnrichmentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Professional project title" },
    shortDescription: { type: Type.STRING, description: "A one or two sentence summary of the project." },
    longDescription: { type: Type.STRING, description: "A detailed paragraph describing what the project does." },
    features: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "List of 3 to 6 key features based on the evidence.",
    },
    technologies: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Normalized list of technologies used in the project.",
    },
    category: {
      type: Type.STRING,
      description: "One main category like 'Full Stack', 'Frontend', 'AI', 'Backend', 'Mobile'.",
    },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3 to 5 tags for the project.",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence score between 0.0 and 1.0 representing how accurate the generated content is compared to evidence.",
    },
  },
  required: ["title", "shortDescription", "longDescription", "features", "technologies", "category", "tags", "confidence"],
};
