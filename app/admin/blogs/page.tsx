"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createBlog, fetchBlogs, fetchAuthors, updateBlog } from "@/features/admin/adminSlice";
import type { RootState, AppDispatch } from "@/app/store";
import Upload from "@/components/Admin/Upload";
import RichEditor from "@/components/Admin/RichEditor";
import Modal from "@/components/Admin/Modal";

export default function AdminBlogsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { blogs, loading, error, authors } = useSelector((s: RootState) => s.admin);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [metaTitle, setMetaTitle] = useState<string>("");
  const [metaDescription, setMetaDescription] = useState<string>("");
  const [metaKeywords, setMetaKeywords] = useState<string>("");
  const [authorId, setAuthorId] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [longDescription, setLongDescription] = useState<string>("");
  const [openCreate, setOpenCreate] = useState(false);
  const [published, setPublished] = useState<boolean>(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchBlogs());
    dispatch(fetchAuthors());
  }, [dispatch]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) return;
    if (editingSlug) {
      await dispatch(
        updateBlog({
          slug: editingSlug,
          updates: {
            title,
            content,
            imageUrl: imageUrl || undefined,
            tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            category, // allow empty string
            metaTitle, // allow empty string
            metaDescription, // allow empty string
            metaKeywords: metaKeywords ? metaKeywords.split(",").map((t) => t.trim()).filter(Boolean) : [],
            authorId: authorId || undefined,
            shortDescription: shortDescription !== undefined ? shortDescription : undefined,
            longDescription: longDescription !== undefined ? longDescription : undefined,
            published,
          },
        }) as any
      );
    } else {
      await dispatch(
        createBlog({
          title,
          content,
          imageUrl: imageUrl || undefined,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          category: category || undefined,
          metaTitle: metaTitle !== "" ? metaTitle : title,
          metaDescription: metaDescription !== "" ? metaDescription : content.slice(0, 160),
          metaKeywords: metaKeywords ? metaKeywords.split(",").map((t) => t.trim()).filter(Boolean) : [],
          authorId: authorId || undefined,
          shortDescription: shortDescription !== "" ? shortDescription : undefined,
          longDescription: longDescription !== "" ? longDescription : undefined,
          // published is defaulted on API create
        }) as any
      );
    }
    setTitle("");
    setContent("");
    setImageUrl(undefined);
    setTags("");
    setCategory("");
    setMetaTitle("");
    setMetaDescription("");
    setMetaKeywords("");
    setAuthorId("");
    setShortDescription("");
    setLongDescription("");
    setPublished(true);
    setEditingSlug(null);
    setOpenCreate(false);
    dispatch(fetchBlogs());
  }

  function openEdit(b: any) {
    setEditingSlug(b.slug);
    setTitle(b.title || "");
    setContent((b as any).content || "");
    setImageUrl(b.imageUrl || undefined);
    setTags(Array.isArray(b.tags) ? b.tags.join(", ") : "");
    setCategory(b.category || "");
    setMetaTitle(b.metaTitle || "");
    setMetaDescription(b.metaDescription || "");
    setMetaKeywords(Array.isArray(b.metaKeywords) ? b.metaKeywords.join(", ") : "");
    setAuthorId(b.authorId || "");
    setShortDescription(b.shortDescription || "");
    setLongDescription(b.longDescription || "");
    setPublished(!!b.published);
    setOpenCreate(true);
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

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={editingSlug ? "Edit Blog Post" : "New Blog Post"} maxWidth="xl">
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Title</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Category</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Author</label>
            <select className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={authorId} onChange={(e) => setAuthorId(e.target.value)}>
              <option value="">Select author</option>
              {authors.map((a) => (
                <option key={a._id} value={a._id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Content</label>
            <RichEditor value={content} onChange={setContent} placeholder="Write your blog content..." />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Short Description</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={2} value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Long Description</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={4} value={longDescription} onChange={(e) => setLongDescription(e.target.value)} />
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
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <label htmlFor="published" className="text-sm">Published</label>
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : (editingSlug ? "Save changes" : "Publish post")}</button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm dark:bg-transparent">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Published</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Created</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td className="px-4 py-3 text-sm" colSpan={4}>Loading...</td></tr>
            )}
            {!loading && blogs.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={4}>No posts</td></tr>
            )}
            {blogs.map((b) => (
              <tr key={b._id}>
                <td className="px-4 py-3 text-sm">{b.title}</td>
                <td className="px-4 py-3 text-sm">{b.category ?? "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <label className="inline-flex cursor-pointer items-center gap-2 text-xs">
                    <input type="checkbox" checked={!!(b as any).published} onChange={(e) => dispatch(updateBlog({ slug: (b as any).slug, updates: { published: e.target.checked } }) as any)} />
                    {(b as any).published ? "Yes" : "No"}
                  </label>
                </td>
                <td className="px-4 py-3 text-sm">{(b as any).createdAt ? new Date((b as any).createdAt as any).toLocaleString() : "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    <button onClick={() => openEdit(b)} className="rounded border border-white/10 px-2 py-1 text-xs">Edit</button>
                    {/* Blogs delete endpoint isn't implemented here; add if needed */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

