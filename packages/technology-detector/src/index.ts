import { detectFromGitHubLanguages } from "./signals/github-languages";
import { detectFromPackageJson } from "./signals/package-json";
import { detectFromConfigFiles } from "./signals/config-files";
import { detectFromDependencyFiles } from "./signals/dependency-files";
import { detectFromReadme } from "./signals/readme-mentions";
import { mergeTechnologies } from "./merger";

export interface RepositoryContext {
  languages: Record<string, number>;
  packageJson: string | null;
  readme: string | null;
  files: string[]; // List of root files
}

export function detectTechnologies(context: RepositoryContext) {
  const detections = [
    ...detectFromGitHubLanguages(context.languages),
    ...detectFromPackageJson(context.packageJson),
    ...detectFromConfigFiles(context.files),
    ...detectFromDependencyFiles(context.files),
    ...detectFromReadme(context.readme),
  ];

  return mergeTechnologies(detections);
}

export * from "./merger";
