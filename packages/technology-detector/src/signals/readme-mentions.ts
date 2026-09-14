import { normalizeTechName } from "../normalization/tech-map";

const knownKeywords = [
  "react", "node.js", "mongodb", "next.js", "typescript",
  "javascript", "python", "docker", "redis", "postgresql",
  "mysql", "aws", "openai", "tailwind"
];

export function detectFromReadme(readmeContent: string | null) {
  const detected: { name: string; confidence: number; source: string }[] = [];
  if (!readmeContent) return detected;

  const contentLower = readmeContent.toLowerCase();

  for (const keyword of knownKeywords) {
    // simple word boundary match
    const regex = new RegExp(`\\b${keyword.replace(".", "\\.")}\\b`, "g");
    if (regex.test(contentLower)) {
      detected.push({
        name: normalizeTechName(keyword),
        confidence: 0.75,
        source: "github",
      });
    }
  }

  return detected;
}
