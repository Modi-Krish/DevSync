import { connectDB, ProjectModel, UserModel, TechnologyModel, PostModel } from "@devsync/database";
import { env } from "@devsync/config";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60; // ISR

export default async function PortfolioPage({ params }: { params: { username: string } }) {
  await connectDB(env.MONGODB_URI);
  
  const user = await UserModel.findOne({ name: params.username });
  if (!user) return notFound();

  const projects = await ProjectModel.find({ userId: user._id, status: "published" }).sort({ score: -1, createdAt: -1 });
  const technologies = await TechnologyModel.find({ userId: user._id }).sort({ projectsCount: -1 }).limit(10);
  const posts = await PostModel.find({ userId: user._id }).sort({ publishedAt: -1 }).limit(5);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500 selection:text-white">
      {/* Hero Section */}
      <header className="py-20 px-4 max-w-5xl mx-auto flex flex-col items-center text-center">
        {user.avatar ? (
          <img src={user.avatar} alt={user.name} className="w-32 h-32 rounded-full shadow-lg mb-6 ring-4 ring-blue-500/20" />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 shadow-lg mb-6 flex items-center justify-center text-4xl text-white font-bold ring-4 ring-blue-500/20">
            {params.username.charAt(0).toUpperCase()}
          </div>
        )}
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          {user.name || params.username}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl leading-relaxed">
          {user.bio || "Software Engineer & Open Source Contributor"}
        </p>
        
        {user.socialLinks && (
          <div className="flex gap-4 mt-8">
            {user.socialLinks.github && (
              <a href={user.socialLinks.github} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium">
                GitHub
              </a>
            )}
            {user.socialLinks.linkedin && (
              <a href={user.socialLinks.linkedin} target="_blank" rel="noreferrer" className="px-6 py-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors font-medium">
                LinkedIn
              </a>
            )}
          </div>
        )}
      </header>

      {/* Technologies */}
      <section className="py-16 px-4 bg-white dark:bg-gray-950 border-y border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center">Technologies</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {technologies.map(tech => (
              <div key={tech._id.toString()} className="px-5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-medium text-gray-800 dark:text-gray-200 hover:scale-105 transition-transform cursor-default shadow-sm">
                {tech.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-10 text-center">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map(project => (
            <Link href={`/${params.username}/projects/${project._id}`} key={project._id.toString()} className="group">
              <div className="h-full bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all border border-gray-200 dark:border-gray-700 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                <h3 className="text-2xl font-bold mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.content?.title || project.github.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-3">
                  {project.content?.shortDescription || project.github.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.technologies.slice(0, 4).map((tech: { name: string }) => (
                    <span key={tech.name} className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {tech.name}
                    </span>
                  ))}
                  {project.technologies.length > 4 && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                      +{project.technologies.length - 4}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        {projects.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No projects published yet.
          </div>
        )}
      </section>

      {/* Recent Updates (LinkedIn Posts) */}
      {posts.length > 0 && (
        <section className="py-20 px-4 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-10 text-center">Recent Updates</h2>
            <div className="space-y-6">
              {posts.map(post => (
                <div key={post._id.toString()} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-xl">
                        in
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">{user.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(post.publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 whitespace-pre-line">
                    {post.content}
                  </p>
                  {post.url && (
                    <a href={post.url} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 font-medium hover:underline text-sm">
                      View on LinkedIn →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      <footer className="py-8 text-center text-gray-500 border-t border-gray-200 dark:border-gray-800 mt-20">
        <p>Powered by DevSync</p>
      </footer>
    </div>
  );
}
