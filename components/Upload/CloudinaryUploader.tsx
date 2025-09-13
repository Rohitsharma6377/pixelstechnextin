"use client";

import { CldUploadWidget } from "next-cloudinary";
import { useState } from "react";

export default function CloudinaryUploader({ onUploaded }: { onUploaded?: (url: string) => void }) {
  const [url, setUrl] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <CldUploadWidget
        signatureEndpoint="/api/upload/sign"
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{ folder: "uploads" }}
        onUpload={(result) => {
          const info = result?.info as any;
          if (info?.secure_url) {
            setUrl(info.secure_url);
            onUploaded?.(info.secure_url);
          }
        }}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500"
          >
            Upload to Cloudinary
          </button>
        )}
      </CldUploadWidget>

      {url && (
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300">Uploaded:</p>
          <img src={url} alt="Upload" width={300} height={200} className="rounded-lg shadow" />
          <p className="mt-2 break-all text-xs text-slate-500">{url}</p>
        </div>
      )}
    </div>
  );
}
