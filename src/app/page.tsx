import Link from "next/link";
import { auth } from "@devsync/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans selection:bg-blue-500 selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl leading-none">D</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            DevSync
          </span>
        </div>
        <div>
          {session ? (
            <Link 
              href="/dashboard" 
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-lg shadow-blue-500/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <Link 
              href="/api/auth/signin" 
              className="px-6 py-2.5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium text-sm mb-8 border border-blue-100 dark:border-blue-800">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          AI-Powered Developer Portfolio Automation
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
          Build it once. <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Keep it automatically updated.
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mb-12 leading-relaxed">
          Connect your GitHub and LinkedIn to let DevSync analyze your footprint. It&apos;s fully automated and secure. Using an AI enrichment layer, it updates your portfolio seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link 
            href="/api/auth/signin" 
            className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-lg transition-all shadow-xl shadow-blue-500/30 hover:scale-105"
          >
            Get Started for Free
          </Link>
          <a 
            href="#features" 
            className="px-8 py-4 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold text-lg transition-all"
          >
            See how it works
          </a>
        </div>
      </main>

      {/* Features Showcase */}
      <section id="features" className="py-24 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-2xl mb-6">🔗</div>
              <h3 className="text-2xl font-bold mb-3">Sync from GitHub</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Push code to GitHub and we instantly detect new repositories, technologies, and changes using advanced webhooks.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-2xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-3">AI Enrichment</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our Gemini AI layer writes professional summaries, extracts key features, and categories your projects automatically.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/50 flex items-center justify-center text-2xl mb-6">✨</div>
              <h3 className="text-2xl font-bold mb-3">Beautiful Portfolios</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Publish a stunning, premium developer portfolio that&apos;s guaranteed to impress recruiters and always up to date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500">
        <p>&copy; {new Date().getFullYear()} DevSync. All rights reserved.</p>
      </footer>
    </div>
  );
}
