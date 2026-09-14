export interface DetectedTechnology {
  name: string;
  confidence: number;
  sources: string[];
}

export function mergeTechnologies(
  rawDetections: { name: string; confidence: number; source: string }[]
): DetectedTechnology[] {
  const techMap = new Map<string, { confidence: number; sources: Set<string> }>();

  for (const det of rawDetections) {
    const existing = techMap.get(det.name);
    if (!existing) {
      techMap.set(det.name, {
        confidence: det.confidence,
        sources: new Set([det.source]),
      });
    } else {
      existing.confidence = Math.max(existing.confidence, det.confidence);
      existing.sources.add(det.source);
    }
  }

  const result: DetectedTechnology[] = [];
  for (const [name, data] of Array.from(techMap.entries())) {
    result.push({
      name,
      confidence: data.confidence,
      sources: Array.from(data.sources),
    });
  }

  return result.sort((a, b) => b.confidence - a.confidence);
}
