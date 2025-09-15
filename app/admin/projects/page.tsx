"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProject, deleteProject, fetchProjects, updateProject } from "@/features/admin/adminSlice";
import type { RootState, AppDispatch } from "@/app/store";
import Upload from "@/components/Admin/Upload";
import Modal from "@/components/Admin/Modal";

export default function AdminProjectsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { projects, loading, error } = useSelector((s: RootState) => s.admin);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [tags, setTags] = useState<string>("");
  const [url, setUrl] = useState("");
  const [repoUrl, setRepoUrl] = useState("");
  const [featured, setFeatured] = useState(false);
  const [category, setCategory] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [openCreate, setOpenCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;
    if (editingId) {
      await dispatch(
        updateProject({
          id: editingId,
          updates: {
            title,
            description,
            imageUrl: imageUrl || undefined,
            tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
            url, // allow empty string
            repoUrl, // allow empty string
            featured,
            category, // allow empty string
            metaTitle, // allow empty string
            metaDescription, // allow empty string
          },
        }) as any
      );
    } else {
      await dispatch(
        createProject({
          title,
          description,
          imageUrl: imageUrl || undefined,
          tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
          url, // allow empty string
          repoUrl, // allow empty string
          featured,
          category, // allow empty string
          metaTitle, // allow empty string
          metaDescription, // allow empty string
        }) as any
      );
    }
    setTitle("");
    setDescription("");
    setImageUrl(undefined);
    setTags("");
    setUrl("");
    setRepoUrl("");
    setFeatured(false);
    setCategory("");
    setMetaTitle("");
    setMetaDescription("");
    setEditingId(null);
    setOpenCreate(false);
    dispatch(fetchProjects());
  }

  function openEdit(p: any) {
    setEditingId(p._id);
    setTitle(p.title || "");
    setDescription((p as any).description || "");
    setImageUrl(p.imageUrl || undefined);
    setTags((p.tags || []).join(", "));
    setUrl(p.url || "");
    setRepoUrl(p.repoUrl || "");
    setFeatured(!!p.featured);
    setCategory(p.category || "");
    setMetaTitle(p.metaTitle || "");
    setMetaDescription(p.metaDescription || "");
    setOpenCreate(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-sm text-slate-500">Manage portfolio/catalog projects.</p>
      </div>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <div className="flex items-center justify-end">
        <button onClick={() => setOpenCreate(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Project</button>
      </div>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={editingId ? "Edit Project" : "New Project"} maxWidth="xl">
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
            <label className="mb-1 block text-sm">Description</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Website URL</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={url} onChange={(e) => setUrl(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Repository URL</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={repoUrl} onChange={(e) => setRepoUrl(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Tags (comma separated)</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="featured" type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
            <label htmlFor="featured" className="text-sm">Featured</label>
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
            <label className="mb-1 block text-sm">Image</label>
            <Upload value={imageUrl || ""} onChange={(url) => setImageUrl(url)} folder="projects" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : (editingId ? "Save changes" : "Add project")}</button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Title</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Category</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Featured</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td className="px-4 py-3 text-sm" colSpan={4}>Loading...</td></tr>
            )}
            {!loading && projects.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={4}>No projects</td></tr>
            )}
            {projects.map((p) => (
              <tr key={p._id}>
                <td className="px-4 py-3 text-sm">{p.title}</td>
                <td className="px-4 py-3 text-sm">{p.category ?? "-"}</td>
                <td className="px-4 py-3 text-sm">{p.featured ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(p)} className="rounded border border-white/10 px-2 py-1 text-xs">Edit</button>
                    <button onClick={() => dispatch(deleteProject(p._id)).then(() => dispatch(fetchProjects()))} className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-500">Delete</button>
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
