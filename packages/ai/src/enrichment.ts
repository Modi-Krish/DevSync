import { gemini, EnrichmentSchema } from "./client";

export interface RepoData {
  name: string;
  description: string;
  readme: string;
  topics: string[];
  technologies: string[];
}

export async function enrichProjectData(repoData: RepoData) {
  const prompt = `
You are a technical profile assistant. Analyze the following GitHub repository and generate professional portfolio metadata.
You must ONLY use information evidenced by the provided data. Do not hallucinate features, business metrics, or revenue.

Repository Name: ${repoData.name}
Description: ${repoData.description || "N/A"}
Topics: ${repoData.topics?.join(", ") || "N/A"}
Detected Technologies: ${repoData.technologies?.join(", ") || "N/A"}

README:
${repoData.readme.substring(0, 4000)} // First 4000 chars
  `;

  const response = await gemini.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: EnrichmentSchema,
      temperature: 0.2, // low temperature for factual extraction
    },
  });

  const rawJson = response.text;
  if (!rawJson) throw new Error("Empty response from AI");
  
  return JSON.parse(rawJson);
}
