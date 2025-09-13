"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, fetchBlogs } from "@/features/admin/adminSlice";
import type { RootState, AppDispatch } from "@/app/store";
import Upload from "@/components/Admin/Upload";
import RichEditor from "@/components/Admin/RichEditor";
import Modal from "@/components/Admin/Modal";

export default function AdminBlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error } = useSelector((s: RootState) => s.admin);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [metaKeywords, setMetaKeywords] = useState<string>("");
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    await dispatch(
      createBlog({
        title,
        content,
        imageUrl: imageUrl || undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
        category: category || undefined,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || content.slice(0, 160),
        metaKeywords: metaKeywords ? metaKeywords.split(",").map((t) => t.trim()).filter(Boolean) : [],
      }) as any
    );
    setTitle("");
    setContent("");
    setImageUrl(undefined);
    setTags("");
    setCategory("");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setOpenCreate(false);
    dispatch(fetchBlogs());
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Blogs</h1>
        <p className="text-sm text-slate-500">Manage blog posts with SEO fields.</p>
      </div>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <div className="flex items-center justify-end">
        <button onClick={() => setOpenCreate(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Post</button>
      </div>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="New Blog Post" maxWidth="xl">
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Title</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Category</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Content</label>
            <RichEditor value={content} onChange={setContent} placeholder="Write your blog content..." />
          </div>
          <div>
            <label className="mb-1 block text-sm">Tags (comma separated)</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">SEO Title</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">SEO Description</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={2} value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">SEO Keywords (comma separated)</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={metaKeywords} onChange={(e) => setMetaKeywords(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Cover Image</label>
            <Upload value={imageUrl || ""} onChange={(url) => setImageUrl(url)} folder="blogs" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : "Publish post"}</button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm dark:bg-transparent">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td className="px-4 py-3 text-sm" colSpan={3}>Loading...</td></tr>
            )}
            {!loading && blogs.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={3}>No posts</td></tr>
            )}
            {blogs.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-3 text-sm">{b.title}</td>
                <td className="px-4 py-3 text-sm">{b.category ?? "-"}</td>
                <td className="px-4 py-3 text-sm">{b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
