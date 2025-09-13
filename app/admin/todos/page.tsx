"use client";

import { useState } from "react";
import Modal from "@/components/Admin/Modal";
import Kanban, { KanbanColumn } from "@/components/Admin/Kanban";

export default function AdminTodosPage() {
  const [openNew, setOpenNew] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: "todo", title: "Todo", items: [] },
    { id: "doing", title: "In Progress", items: [] },
    { id: "done", title: "Done", items: [] },
  ]);

  function addCard(e: React.FormEvent) {
    e.preventDefault();
    const id = Math.random().toString(36).slice(2);
    const next = columns.map((c) => ({ ...c, items: [...c.items] }));
    next[0].items.push({ id, title, description });
    setColumns(next);
    setOpenNew(false);
    setTitle("");
    setDescription("");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Todos</h1>
          <p className="text-sm text-slate-500">Drag and drop tasks between columns.</p>
        </div>
        <button onClick={() => setOpenNew(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Task</button>
      </div>

      <Kanban initial={columns} onChange={setColumns} />

      <Modal open={openNew} onClose={() => setOpenNew(false)} title="New Task">
        <form onSubmit={addCard} className="space-y-3">
          <div>
            <label className="mb-1 block text-sm">Title</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Description</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpenNew(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Add</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
