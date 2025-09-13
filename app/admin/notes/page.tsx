"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Admin/Modal";

type Note = {
  id: string;
  title: string;
  body: string;
  tags: string[];
  createdAt: string;
};

export default function AdminNotesPage() {
  const [items, setItems] = useState<Note[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [query, setQuery] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("admin_notes");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_notes", JSON.stringify(items));
  }, [items]);

  function addNote(e: React.FormEvent) {
    e.preventDefault();
    const id = Math.random().toString(36).slice(2);
    setItems((cur) => [
      ...cur,
      {
        id,
        title,
        body,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
      },
    ]);
    setOpen(false);
    setTitle("");
    setBody("");
    setTags("");
  }

  function remove(id: string) {
    setItems((cur) => cur.filter((n) => n.id !== id));
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.body.toLowerCase().includes(q) ||
        n.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [items, query]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-sm text-slate-500">Simple notes with tags. Data persists locally until API is wired.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            placeholder="Search notes..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-56 rounded border border-white/10 bg-transparent px-3 py-2 text-sm"
          />
          <button onClick={() => setOpen(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Note</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-500 dark:bg-transparent">No notes</div>
        )}
        {filtered.map((n) => (
          <div key={n.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm dark:bg-transparent">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold">{n.title}</h3>
              <button onClick={() => remove(n.id)} className="text-xs text-red-600">Delete</button>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-sm">{n.body}</p>
            </div>
            {n.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {n.tags.map((t) => (
                  <span key={t} className="rounded-full bg-white/10 px-2 py-0.5 text-xs">#{t}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Note">
        <form onSubmit={addNote} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Title</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Body</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={5} value={body} onChange={(e) => setBody(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Tags (comma separated)</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
