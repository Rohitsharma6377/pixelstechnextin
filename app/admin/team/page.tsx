"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTeam, deleteTeam, fetchTeam, updateTeam } from "@/features/admin/adminSlice";
import type { RootState, AppDispatch } from "@/app/store";
import Upload from "@/components/Admin/Upload";
import Modal from "@/components/Admin/Modal";

export default function AdminTeamPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { team, loading, error } = useSelector((s: RootState) => s.admin);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [bio, setBio] = useState("");
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [order, setOrder] = useState<number | undefined>(undefined);
  const [openCreate, setOpenCreate] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchTeam());
  }, [dispatch]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role) return;
    setFormError(null);
    try {
      if (editingId) {
        await dispatch(updateTeam({ id: editingId, updates: { name, role, bio, imageUrl: imageUrl || undefined, order } }) as any);
      } else {
        await dispatch(createTeam({ name, role, bio, imageUrl: imageUrl || undefined, order } as any));
      }
    } catch (err: any) {
      setFormError(err?.message || "Failed to save member");
    }
    setName("");
    setRole("");
    setBio("");
    setImageUrl(undefined);
    setOrder(undefined);
    setEditingId(null);
    setOpenCreate(false);
    dispatch(fetchTeam());
  };

  function openEdit(m: any) {
    setEditingId(m._id);
    setName(m.name || "");
    setRole(m.role || "");
    setBio(m.bio || "");
    setImageUrl(m.imageUrl || undefined);
    setOrder(m.order ?? undefined);
    setFormError(null);
    setOpenCreate(true);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Team</h1>
        <p className="text-sm text-slate-500">Manage team members.</p>
      </div>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <div className="flex items-center justify-end">
        <button onClick={() => { setEditingId(null); setName(""); setRole(""); setBio(""); setImageUrl(undefined); setOrder(undefined); setFormError(null); setOpenCreate(true); }} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Member</button>
      </div>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title={editingId ? "Edit Team Member" : "New Team Member"}>
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Role</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={role} onChange={(e) => setRole(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Bio</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Order</label>
            <input type="number" className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={order ?? ""} onChange={(e) => setOrder(e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Image</label>
            <Upload value={imageUrl || ""} onChange={(url) => setImageUrl(url)} folder="team" />
          </div>
          {formError && <div className="md:col-span-2 rounded border border-red-300 bg-red-50 p-2 text-sm text-red-700">{formError}</div>}
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : (editingId ? "Save changes" : "Add member")}</button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Role</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Order</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td className="px-4 py-3 text-sm" colSpan={4}>Loading...</td></tr>
            )}
            {!loading && team.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={4}>No members</td></tr>
            )}
            {team.map((m) => (
              <tr key={m._id}>
                <td className="px-4 py-3 text-sm">{m.name}</td>
                <td className="px-4 py-3 text-sm">{m.role}</td>
                <td className="px-4 py-3 text-sm">{m.order ?? "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(m)} className="rounded border border-white/10 px-2 py-1 text-xs">Edit</button>
                    <button onClick={() => dispatch(deleteTeam(m._id)).then(() => dispatch(fetchTeam()))} className="rounded border border-red-500/40 bg-red-500/10 px-2 py-1 text-xs text-red-500">Delete</button>
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
