"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createTestimonial, deleteTestimonial, fetchTestimonials } from "@/features/admin/adminSlice";
import type { RootState, AppDispatch } from "@/app/store";
import Upload from "@/components/Admin/Upload";
import Modal from "@/components/Admin/Modal";

export default function AdminTestimonialsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { testimonials, loading, error } = useSelector((s: RootState) => s.admin);

  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [published, setPublished] = useState(true);
  const [openCreate, setOpenCreate] = useState(false);

  useEffect(() => {
    dispatch(fetchTestimonials());
  }, [dispatch]);

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !message) return;
    await dispatch(
      createTestimonial({
        name,
        company: company || undefined,
        message,
        rating,
        avatarUrl: avatarUrl || undefined,
        published,
      } as any)
    );
    setName("");
    setCompany("");
    setMessage("");
    setRating(undefined);
    setAvatarUrl(undefined);
    setPublished(true);
    setOpenCreate(false);
    dispatch(fetchTestimonials());
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <p className="text-sm text-slate-500">Manage testimonials and reviews.</p>
      </div>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <div className="flex items-center justify-end">
        <button onClick={() => setOpenCreate(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Testimonial</button>
      </div>

      <Modal open={openCreate} onClose={() => setOpenCreate(false)} title="New Testimonial">
        <form onSubmit={onCreate} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Company</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Message</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={3} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Rating (1-5)</label>
            <input type="number" min={1} max={5} className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={rating ?? ""} onChange={(e) => setRating(e.target.value ? Number(e.target.value) : undefined)} />
          </div>
          <div className="flex items-center gap-2">
            <input id="published" type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
            <label htmlFor="published" className="text-sm">Published</label>
          </div>
          <div>
            <label className="mb-1 block text-sm">Avatar</label>
            <Upload value={avatarUrl || ""} onChange={(url) => setAvatarUrl(url)} folder="testimonials" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpenCreate(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : "Add testimonial"}</button>
          </div>
        </form>
      </Modal>

      <div className="overflow-hidden rounded border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Company</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Rating</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Published</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr><td className="px-4 py-3 text-sm" colSpan={5}>Loading...</td></tr>
            )}
            {!loading && testimonials.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={5}>No testimonials</td></tr>
            )}
            {testimonials.map((t) => (
              <tr key={t._id}>
                <td className="px-4 py-3 text-sm">{t.name}</td>
                <td className="px-4 py-3 text-sm">{t.company ?? "-"}</td>
                <td className="px-4 py-3 text-sm">{t.rating ?? "-"}</td>
                <td className="px-4 py-3 text-sm">{t.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => dispatch(deleteTestimonial(t._id)).then(() => dispatch(fetchTestimonials()))} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
