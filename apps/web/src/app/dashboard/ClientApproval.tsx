"use client";
import { approveProject, rejectProject } from "../actions/projects";
import { useState } from "react";

export function ClientApproval({ projectId, userId }: { projectId: string; userId: string }) {
  const [isPending, setIsPending] = useState(false);

  async function handleApprove() {
    setIsPending(true);
    await approveProject(projectId, userId);
    setIsPending(false);
  }

  async function handleReject() {
    setIsPending(true);
    await rejectProject(projectId, userId);
    setIsPending(false);
  }

  return (
    <div className="flex gap-2 mt-4">
      <button 
        onClick={handleApprove} 
        disabled={isPending}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        Approve
      </button>
      <button 
        onClick={handleReject} 
        disabled={isPending}
        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
      >
        Reject
      </button>
    </div>
  );
}
