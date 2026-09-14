export const techNormalizationMap: Record<string, string> = {
  reactjs: "React",
  "react.js": "React",
  react: "React",
  nodejs: "Node.js",
  node: "Node.js",
  "node.js": "Node.js",
  mongodb: "MongoDB",
  mongo: "MongoDB",
  nextjs: "Next.js",
  next: "Next.js",
  typescript: "TypeScript",
  ts: "TypeScript",
  javascript: "JavaScript",
  js: "JavaScript",
  python: "Python",
  py: "Python",
  docker: "Docker",
  tailwindcss: "Tailwind CSS",
  tailwind: "Tailwind CSS",
  express: "Express.js",
  "express.js": "Express.js",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  redis: "Redis",
  openai: "OpenAI API",
};

export function normalizeTechName(rawName: string): string {
  const normalized = rawName.toLowerCase().trim();
  return techNormalizationMap[normalized] || rawName.trim();
}
