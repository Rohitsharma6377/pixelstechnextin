"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Admin/Modal";
import Kanban, { KanbanColumn } from "@/components/Admin/Kanban";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { createTodo, deleteTodo as deleteTodoThunk, fetchTodos, persistBoard } from "@/features/todos/todosSlice";

export default function AdminTodosPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((s: RootState) => s.todos);
  const [openNew, setOpenNew] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [columns, setColumns] = useState<KanbanColumn[]>([
    { id: "todo", title: "Todo", items: [] },
    { id: "doing", title: "In Progress", items: [] },
    { id: "done", title: "Done", items: [] },
  ]);
  const [trashHover, setTrashHover] = useState(false);

  // Load from API on mount
  useEffect(() => {
    console.log("[Todos] dispatch(fetchTodos)");
    dispatch(fetchTodos());
  }, [dispatch]);

  // Map Redux items -> Kanban columns whenever items change
  useEffect(() => {
    console.log("[Todos] items from store", items);
    const todo = items.filter((i) => i.status === "todo").sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const doing = items.filter((i) => i.status === "doing").sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    const done = items.filter((i) => i.status === "done").sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    console.log("[Todos] derived lists", { todo, doing, done });
    setColumns([
      { id: "todo", title: "Todo", items: todo.map((i) => ({ id: String(i._id), title: i.title, description: i.description })) },
      { id: "doing", title: "In Progress", items: doing.map((i) => ({ id: String(i._id), title: i.title, description: i.description })) },
      { id: "done", title: "Done", items: done.map((i) => ({ id: String(i._id), title: i.title, description: i.description })) },
    ]);
    console.log("[Todos] columns state set");
  }, [items]);

  async function addCard(e: React.FormEvent) {
    e.preventDefault();
    try {
      console.log("[Todos] addCard -> createTodo", { title, description, order: columns[0]?.items?.length ?? 0 });
      await dispatch(
        createTodo({ title, description, status: "todo", order: columns[0].items.length })
      );
      console.log("[Todos] addCard -> fetchTodos");
      await dispatch(fetchTodos());
      setOpenNew(false);
      setTitle("");
      setDescription("");
      console.log("[Todos] addCard -> done");
    } catch {
      // swallow for now; could show a banner
    }
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

      <Kanban
        initial={columns}
        onChange={(next) => {
          setColumns(next);
          console.log("[Todos] Kanban onChange", next);
          const payload = next.map((c) => ({ id: c.id as "todo" | "doing" | "done", items: c.items.map((i) => ({ id: i.id })) }));
          console.log("[Todos] persistBoard payload", payload);
          dispatch(persistBoard(payload));
        }}
      />

      {/* Trash drop zone to delete cards by dragging onto it */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setTrashHover(true);
        }}
        onDragEnter={() => setTrashHover(true)}
        onDragLeave={() => setTrashHover(false)}
        onDrop={async (e) => {
          e.preventDefault();
          const itemId = e.dataTransfer.getData("text/plain");
          setTrashHover(false);
          if (!itemId) return;
          try {
            await dispatch(deleteTodoThunk(itemId));
            await dispatch(fetchTodos());
          } catch {
            // ignore for now
          }
        }}
        title="Drag a task here to delete"
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-red-400/40 shadow transition-all ${
          trashHover ? "bg-red-600 text-white scale-110" : "bg-red-500/90 text-white"
        }`}
        aria-label="Delete task dropzone"
      >
        {/* Trash icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M9 3a1 1 0 0 0-1 1v1H5.5a1 1 0 1 0 0 2H6v11a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V7h.5a1 1 0 1 0 0-2H16V4a1 1 0 0 0-1-1H9zm2 2h2V4h-2v1zM8 7h8v11a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1V7zm2 3a1 1 0 1 0-2 0v7a1 1 0 1 0 2 0v-7zm6 0a1 1 0 1 0-2 0v7a1 1 0 1 0 2 0v-7z"/>
        </svg>
      </div>

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
            <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : "Add"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

