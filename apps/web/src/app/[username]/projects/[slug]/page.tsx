import { connectDB, ProjectModel, UserModel } from "@devsync/database";
import { env } from "@devsync/config";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR

export default async function ProjectPage({ params }: { params: { username: string; slug: string } }) {
  await connectDB(env.MONGODB_URI);
  
  const user = await UserModel.findOne({ name: params.username });
  if (!user) return notFound();

  // Try to find project by ID, if error (invalid ID), return 404
  let project;
  try {
    project = await ProjectModel.findOne({ _id: params.slug, userId: user._id, status: "published" });
  } catch {
    return notFound();
  }

  if (!project) return notFound();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500 selection:text-white pb-20">
      <nav className="py-6 px-4 max-w-4xl mx-auto">
        <Link href={`/${params.username}`} className="text-blue-600 dark:text-blue-400 font-medium hover:underline flex items-center gap-2 w-fit">
          ← Back to Portfolio
        </Link>
      </nav>

      <main className="px-4 max-w-4xl mx-auto mt-8">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          {project.categories?.map((cat: string) => (
            <span key={cat} className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {cat}
            </span>
          ))}
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{project.content?.title || project.github.name}</h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
          {project.content?.shortDescription || project.github.description}
        </p>

        <div className="flex gap-4 mb-12">
          {project.github.url && (
            <a href={project.github.url} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-semibold hover:opacity-90 transition-opacity">
              View Source
            </a>
          )}
          {project.github.homepage && (
            <a href={project.github.homepage} target="_blank" rel="noreferrer" className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
              Live Demo
            </a>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">Technologies</h2>
          <div className="flex flex-wrap gap-3">
            {project.technologies.map((tech: { name: string }) => (
              <span key={tech.name} className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-medium text-gray-800 dark:text-gray-200">
                {tech.name}
              </span>
            ))}
          </div>
        </div>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold mb-6">About this project</h2>
          <p className="whitespace-pre-line text-gray-700 dark:text-gray-300 leading-relaxed mb-10">
            {project.content?.longDescription || "No detailed description available."}
          </p>

          {project.content?.features && project.content.features.length > 0 && (
            <>
              <h2 className="text-2xl font-bold mb-6">Key Features</h2>
              <ul className="space-y-3">
                {project.content.features.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-start">
                    <span className="text-blue-500 mr-3 text-xl leading-none">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
