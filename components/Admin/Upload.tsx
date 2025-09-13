"use client";

import React, { useRef, useState } from "react";

type Props = {
  label?: string;
  value?: string | null;
  onChange: (url: string) => void;
  folder?: string;
};

export default function Upload({ label = "Upload image", value, onChange, folder }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME;
  const PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  async function onFileSelected(file: File) {
    if (!CLOUD_NAME || !PRESET) {
      setError("Cloudinary env vars missing: set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET");
      return;
    }
    setError(null);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", PRESET);
      if (folder) form.append("folder", folder);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error?.message || "Upload failed");
      onChange(data.secure_url as string);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      {value && (
        <div className="overflow-hidden rounded border border-white/10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="preview" className="h-40 w-full object-cover" />
        </div>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="rounded bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          {uploading ? "Uploading..." : label}
        </button>
        {value && (
          <button type="button" className="text-sm text-red-600" onClick={() => onChange("")}>Remove</button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFileSelected(f);
        }}
      />
      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
