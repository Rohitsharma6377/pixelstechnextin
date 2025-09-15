"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/app/store";
import { createAuthor, fetchAuthors, updateAuthor, deleteAuthor } from "@/features/admin/adminSlice";
import Upload from "@/components/Admin/Upload";
import Modal from "@/components/Admin/Modal";
import { useSearchParams } from "next/navigation";
import RichEditor from "@/components/Admin/RichEditor";

export default function AdminAuthorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { authors, loading, error } = useSelector((s: RootState) => s.admin);

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [openCreate, setOpenCreate] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAuthors());
  }, [dispatch]);

  const searchParams = useSearchParams();
  useEffect(() => {
    const shouldOpen = searchParams.get("new") === "1";
    if (shouldOpen) setOpenCreate(true);
  }, [searchParams]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name) return;
    setFormError(null);
    try {
      if (editingId) {
        await (dispatch(updateAuthor({ id: editingId, updates: { name, designation, bio, imageUrl: imageUrl || undefined } }) as any) as any).unwrap?.();
      } else {
        await (dispatch(createAuthor({ name, designation, bio, imageUrl: imageUrl || undefined }) as any) as any).unwrap?.();
      }
      setOpenCreate(false);
    } catch (err: any) {
      setFormError(err?.message || "Failed to add author");
    }
    setName("");
    setDesignation("");
    setBio("");
    setImageUrl("");
    setEditingId(null);
    dispatch(fetchAuthors());
  }

  function openEdit(a: any) {
    setEditingId(a._id);
    setName(a.name || "");
    setDesignation(a.designation || "");
    setBio(a.bio || "");
    setImageUrl(a.imageUrl || "");
    setFormError(null);
    setOpenCreate(true);
  }

  async function onDelete(id: string) {
    if (!confirm("Delete this author?")) return;
    await dispatch(deleteAuthor(id) as any);
    dispatch(fetchAuthors());
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">Authors</h1>
          <p className="text-sm text-slate-500">Manage blog authors for attribution.</p>
        </div>
        <button onClick={() => { setEditingId(null); setName(""); setDesignation(""); setBio(""); setImageUrl(""); setFormError(null); setOpenCreate(true); }} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Add Author</button>
      </div>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={editingId ? "Edit Author" : "Add Author"}>
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Designation</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={designation} onChange={(e) => setDesignation(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Bio</label>
            <RichEditor value={bio} onChange={setBio} placeholder="Write author bio..." />
          </div>
          <div>
            <label className="mb-1 block text-sm">Profile Image</label>
            <Upload value={imageUrl} onChange={(url) => setImageUrl(url)} folder="authors" />
          </div>
          {formError && <div className="md:col-span-2 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{formError}</div>}
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : (editingId ? "Save changes" : "Add author")}</button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm dark:bg-transparent">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Designation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td className="px-4 py-3 text-sm" colSpan={2}>Loading...</td></tr>
            )}
            {!loading && authors.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={2}>No authors</td></tr>
            )}
            {authors.map((a) => (
              <tr key={a._id}>
                <td className="px-4 py-3 text-sm">{a.name}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span>{a.designation ?? "-"}</span>
                    <span className="flex gap-2">
                      <button onClick={() => openEdit(a)} className="rounded border border-white/10 px-2 py-1 text-xs">Edit</button>
                      <button onClick={() => onDelete(a._id)} className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-500">Delete</button>
                    </span>
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
