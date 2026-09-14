import Link from "next/link";
import { auth } from "@devsync/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/api/auth/signin");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">DevSync</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/dashboard" className="block px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium dark:bg-blue-900/40 dark:text-blue-300">
            Overview & Approvals
          </Link>
          <Link href="/dashboard/settings" className="block px-4 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 font-medium transition-colors">
            Settings
          </Link>
          <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
            <Link href={`/${session.user?.name}`} target="_blank" className="block px-4 py-2.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30 font-medium transition-colors flex justify-between items-center">
              My Portfolio
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            </Link>
          </div>
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500">
          {session.user?.name || session.user?.email}
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
