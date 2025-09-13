"use client";

import { useState } from "react";
import CloudinaryUploader from "@/components/Upload/CloudinaryUploader";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";

export default function NewBlogPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading) return null;
  if (!user || user.role !== "ADMIN") {
    return (
      <div className="container py-10">
        <h1 className="mb-4 text-2xl font-bold">New Post</h1>
        <p>You must be an admin to create posts.</p>
      </div>
    );
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to create post");
      router.push(`/blog`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Create a new post</h1>
      <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
        <input
          type="text"
          placeholder="Post title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-transparent dark:text-white"
          required
        />
        <textarea
          placeholder="Write your content..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-transparent dark:text-white"
          required
        />
        <div>
          <p className="mb-2 text-sm text-slate-600 dark:text-slate-300">Featured image (optional)</p>
          <CloudinaryUploader onUploaded={(url) => setImageUrl(url)} />
          {imageUrl && (
            <p className="mt-2 break-all text-xs text-slate-500">Selected: {imageUrl}</p>
          )}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {submitting ? "Publishing..." : "Publish"}
        </button>
      </form>
    </div>
  );
}
