import { normalizeTechName } from "../normalization/tech-map";

const configFileMap: Record<string, string> = {
  "Dockerfile": "Docker",
  "docker-compose.yml": "Docker Compose",
  "vite.config.js": "Vite",
  "vite.config.ts": "Vite",
  "next.config.js": "Next.js",
  "next.config.mjs": "Next.js",
  "tailwind.config.js": "Tailwind CSS",
  "tailwind.config.ts": "Tailwind CSS",
  "tsconfig.json": "TypeScript",
  "jest.config.js": "Jest",
  ".eslintrc.js": "ESLint",
  ".eslintrc.json": "ESLint",
  "postcss.config.js": "PostCSS",
};

export function detectFromConfigFiles(files: string[]) {
  const detected: { name: string; confidence: number; source: string }[] = [];
  
  for (const file of files) {
    const tech = configFileMap[file];
    if (tech) {
      detected.push({
        name: normalizeTechName(tech),
        confidence: 0.95,
        source: "github",
      });
    }
  }

  return detected;
}
