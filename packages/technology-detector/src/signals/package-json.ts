import { normalizeTechName } from "../normalization/tech-map";

export function detectFromPackageJson(packageJsonContent: string | null) {
  const detected: { name: string; confidence: number; source: string }[] = [];
  if (!packageJsonContent) return detected;

  try {
    const pkg = JSON.parse(packageJsonContent);
    const deps = {
      ...(pkg.dependencies || {}),
      ...(pkg.devDependencies || {}),
      ...(pkg.peerDependencies || {}),
    };

    for (const dep of Object.keys(deps)) {
      detected.push({
        name: normalizeTechName(dep),
        confidence: 0.98,
        source: "github", // derived from github file
      });
    }
  } catch (error) {
    // Ignore invalid JSON
  }

  return detected;
}
