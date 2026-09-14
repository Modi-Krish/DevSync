import { normalizeTechName } from "../normalization/tech-map";

export function detectFromDependencyFiles(files: string[]) {
  const detected: { name: string; confidence: number; source: string }[] = [];
  
  const rules = [
    { file: "requirements.txt", tech: "Python" },
    { file: "pyproject.toml", tech: "Python" },
    { file: "pom.xml", tech: "Java" },
    { file: "build.gradle", tech: "Java" },
    { file: "go.mod", tech: "Go" },
    { file: "Cargo.toml", tech: "Rust" },
    { file: "composer.json", tech: "PHP" },
    { file: "Gemfile", tech: "Ruby" },
  ];

  for (const file of files) {
    for (const rule of rules) {
      if (file === rule.file) {
        detected.push({
          name: normalizeTechName(rule.tech),
          confidence: 0.90,
          source: "github",
        });
      }
    }
  }

  return detected;
}
