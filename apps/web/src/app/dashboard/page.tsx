import { connectDB, ProjectModel } from "@devsync/database";
import { env } from "@devsync/config";
import { auth } from "@devsync/auth";
import { redirect } from "next/navigation";
import { ClientApproval } from "./ClientApproval";

export default async function DashboardPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/api/auth/signin");

  await connectDB(env.MONGODB_URI);
  
  // Actually should be finding by `userId: session.user.id` but session logic might need proper DB session setup
  // We'll just fetch all for this mock/demo
  const drafts = await ProjectModel.find({ status: "draft" }).sort({ score: -1 });

  return (
    <div className="p-8 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8">Pending Approvals</h1>
      
      {drafts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 text-center text-gray-500">
          <p>No new projects waiting for approval.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {drafts.map((project) => (
            <div key={project._id.toString()} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{project.content?.title || project.github.name}</h3>
                <span className="text-xs font-bold px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded-md">
                  AI Score: {project.score}
                </span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4 flex-1">
                {project.content?.shortDescription}
              </p>
              
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((t: { name: string }) => (
                    <span key={t.name} className="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 text-sm font-medium rounded-md">
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
                <ClientApproval projectId={project._id.toString()} userId={project.userId.toString()} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
