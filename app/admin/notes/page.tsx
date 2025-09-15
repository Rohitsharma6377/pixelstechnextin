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
  const [loading, setLoading] = useState(false);

  // Load from API
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch notes");
        const list = (data.items as any[]).map((n) => ({
          id: String(n._id),
          title: n.title,
          body: n.body,
          tags: n.tags ?? [],
          createdAt: n.createdAt ?? new Date().toISOString(),
        })) as Note[];
        setItems(list);
      } catch {
        // ignore
      }
    })();
  }, []);

  function addNote(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    (async () => {
      try {
        const payload = {
          title,
          body,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        };
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to create note");
        // Refresh
        const listRes = await fetch("/api/notes");
        const listData = await listRes.json();
        if (listRes.ok) {
          const list = (listData.items as any[]).map((n) => ({
            id: String(n._id),
            title: n.title,
            body: n.body,
            tags: n.tags ?? [],
            createdAt: n.createdAt ?? new Date().toISOString(),
          })) as Note[];
          setItems(list);
        }
        setOpen(false);
        setTitle("");
        setBody("");
        setTags("");
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }

  function remove(id: string) {
    (async () => {
      try {
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to delete");
        setItems((cur) => cur.filter((n) => n.id !== id));
      } catch {
        // ignore
      }
    })();
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
          <p className="text-sm text-slate-500">Keep your notes organized with tags. Notes are now saved to the database.</p>
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
          <div
            key={n.id}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/40 to-white/10 p-4 shadow-sm backdrop-blur dark:from-slate-900/50 dark:to-slate-800/30 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-base font-semibold">{n.title}</h3>
              <button onClick={() => remove(n.id)} className="rounded px-2 py-0.5 text-xs text-red-600 hover:bg-red-500/10">Delete</button>
            </div>
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <p className="whitespace-pre-line text-sm">{n.body}</p>
            </div>
            {n.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {n.tags.map((t) => (
                  <span key={t} className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-600 dark:text-indigo-300">#{t}</span>
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
            <button disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : "Save"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

