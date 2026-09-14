import { normalizeTechName } from "../normalization/tech-map";

export function detectFromGitHubLanguages(languages: Record<string, number>) {
  const detected: { name: string; confidence: number; source: string }[] = [];
  
  if (!languages) return detected;

  for (const [lang, bytes] of Object.entries(languages)) {
    if (bytes > 0) {
      detected.push({
        name: normalizeTechName(lang),
        confidence: 0.85,
        source: "github",
      });
    }
  }

  return detected;
}
