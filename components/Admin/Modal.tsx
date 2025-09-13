"use client";

import React, { useEffect } from "react";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
};

export default function Modal({ open, onClose, title, children, maxWidth = "lg" }: Props) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className={clsx(
          "relative mx-4 max-h-[85vh] w-full overflow-auto rounded-2xl border border-white/10 bg-white p-4 shadow-xl dark:bg-slate-900",
          {
            sm: "max-w-sm",
            md: "max-w-md",
            lg: "max-w-lg",
            xl: "max-w-2xl",
          }[maxWidth]
        )}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} aria-label="Close" className="rounded px-2 py-1 text-sm hover:bg-white/10">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
