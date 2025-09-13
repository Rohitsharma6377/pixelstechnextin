"use client";

import React, { useEffect, useRef } from "react";

// Lightweight CKEditor5 Classic wrapper via CDN (no npm dependency)
// Props: value, onChange, placeholder
// Note: Requires internet access to load the CKEditor CDN script.

type Props = {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
};

declare global {
  interface Window {
    ClassicEditor: any;
  }
}

export default function RichEditor({ value, onChange, placeholder }: Props) {
  const holderRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<any>(null);
  const initialValueRef = useRef<string>(value);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (typeof window === "undefined") return;
      if (!(window as any).ClassicEditor) {
        await new Promise<void>((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.ckeditor.com/ckeditor5/39.0.2/classic/ckeditor.js";
          s.async = true;
          s.onload = () => resolve();
          s.onerror = () => reject(new Error("Failed to load CKEditor"));
          document.head.appendChild(s);
        });
      }
      if (cancelled) return;
      if (holderRef.current && window.ClassicEditor) {
        editorRef.current = await window.ClassicEditor.create(holderRef.current, {
          placeholder: placeholder || "Write your content...",
        });
        // Set initial content
        editorRef.current.setData(initialValueRef.current || "");
        // Change handler
        editorRef.current.model.document.on("change:data", () => {
          const data = editorRef.current.getData();
          onChange(data);
        });
      }
    }

    load().catch(() => {
      // ignore for now; a textarea fallback could be added if needed
    });

    return () => {
      cancelled = true;
      if (editorRef.current) {
        editorRef.current.destroy().catch(() => {});
        editorRef.current = null;
      }
    };
  }, [onChange, placeholder]);

  // Keep editor data in sync if value changes externally and editor exists
  useEffect(() => {
    if (editorRef.current) {
      const current = editorRef.current.getData();
      if (current !== value) {
        editorRef.current.setData(value || "");
      }
    } else {
      initialValueRef.current = value;
    }
  }, [value]);

  return (
    <div className="rounded border border-white/10 bg-white/5 p-2 dark:bg-transparent">
      <div ref={holderRef} />
    </div>
  );
}
