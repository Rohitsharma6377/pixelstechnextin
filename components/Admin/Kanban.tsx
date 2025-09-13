"use client";

import React, { useState } from "react";
import clsx from "clsx";

export type KanbanItem = {
  id: string;
  title: string;
  description?: string;
};

export type KanbanColumn = {
  id: string;
  title: string;
  items: KanbanItem[];
};

type Props = {
  initial?: KanbanColumn[];
  onChange?: (columns: KanbanColumn[]) => void;
};

export default function Kanban({ initial, onChange }: Props) {
  const [columns, setColumns] = useState<KanbanColumn[]>(
    initial ?? [
      { id: "todo", title: "Todo", items: [] },
      { id: "doing", title: "In Progress", items: [] },
      { id: "done", title: "Done", items: [] },
    ]
  );
  const [dragId, setDragId] = useState<string | null>(null);

  function emit(next: KanbanColumn[]) {
    setColumns(next);
    onChange?.(next);
  }

  function onDragStart(e: React.DragEvent, itemId: string) {
    setDragId(itemId);
    e.dataTransfer.setData("text/plain", itemId);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e: React.DragEvent, targetColumnId: string) {
    e.preventDefault();
    const itemId = e.dataTransfer.getData("text/plain") || dragId;
    if (!itemId) return;

    // find source column and item
    let srcColIdx = -1;
    let item: KanbanItem | null = null;
    columns.forEach((col, idx) => {
      const found = col.items.find((i) => i.id === itemId);
      if (found) {
        srcColIdx = idx;
        item = found;
      }
    });
    if (!item) return;

    const next = columns.map((c) => ({ ...c, items: [...c.items] }));
    // remove from source
    next[srcColIdx].items = next[srcColIdx].items.filter((i) => i.id !== itemId);
    // add to target
    const tgtIdx = next.findIndex((c) => c.id === targetColumnId);
    if (tgtIdx !== -1) next[tgtIdx].items.push(item);
    emit(next);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {columns.map((col) => (
        <div key={col.id} className="rounded-2xl border border-white/10 bg-white/5 p-3 dark:bg-transparent">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{col.title}</h3>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{col.items.length}</span>
          </div>
          <div
            className={clsx(
              "min-h-[200px] space-y-2 rounded-md border border-dashed border-white/10 p-2",
              "bg-transparent"
            )}
            onDrop={(e) => onDrop(e, col.id)}
            onDragOver={onDragOver}
          >
            {col.items.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => onDragStart(e, item.id)}
                className="cursor-move rounded border border-white/10 bg-white/70 p-2 text-sm shadow hover:bg-white/80 dark:bg-slate-800"
              >
                <div className="font-medium">{item.title}</div>
                {item.description && <div className="text-xs text-slate-500">{item.description}</div>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
