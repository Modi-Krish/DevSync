import { connectDB, UserModel } from "@devsync/database";
import { env } from "@devsync/config";
import { auth } from "@devsync/auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export default async function SettingsPage() {
  const session = await auth();
  if (!session || !session.user) redirect("/api/auth/signin");

  await connectDB(env.MONGODB_URI);
  
  let user = await UserModel.findById(session.user.id);
  if (!user) {
    // For demo purposes if user is not in DB yet
    user = {
      name: session.user.name,
      email: session.user.email,
      preferences: { autoPublishProjects: false, autoSyncTechnologies: true }
    };
  }

  async function saveSettings(formData: FormData) {
    "use server";
    const session = await auth();
    if (!session || !session.user) return;
    
    await connectDB(env.MONGODB_URI);
    const autoPublish = formData.get("autoPublish") === "on";
    const bio = formData.get("bio") as string;
    
    await UserModel.findByIdAndUpdate(session.user.id, {
      $set: {
        bio: bio,
        "preferences.autoPublishProjects": autoPublish,
      }
    }, { upsert: true });

    revalidatePath("/dashboard/settings");
    revalidatePath(`/${session.user.name}`);
  }

  return (
    <div className="p-8 max-w-4xl mx-auto text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <form action={saveSettings} className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Display Name</label>
          <input 
            type="text" 
            disabled 
            value={user.name || ""} 
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Bio</label>
          <textarea 
            name="bio"
            defaultValue={user.bio || ""} 
            rows={4}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        <div>
          <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-750 cursor-pointer transition-colors">
            <input 
              type="checkbox" 
              name="autoPublish" 
              defaultChecked={user.preferences?.autoPublishProjects}
              className="w-5 h-5 rounded text-blue-600 focus:ring-blue-500"
            />
            <div>
              <span className="block font-semibold">Auto-publish projects</span>
              <span className="text-sm text-gray-500">Automatically publish high-confidence projects without manual approval.</span>
            </div>
          </label>
        </div>

        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <button type="submit" className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
