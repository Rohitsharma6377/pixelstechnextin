"use client";

import CloudinaryUploader from "@/components/Upload/CloudinaryUploader";
import { useAuth } from "@/app/auth-context";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) return null;

  if (!user) {
    return (
      <div className="container py-10">
        <h1 className="mb-4 text-2xl font-bold">Upload</h1>
        <p className="mb-4">You must be signed in to upload files.</p>
        <button onClick={() => router.push("/login")} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500">Sign in</button>
      </div>
    );
  }

  return (
    <div className="container py-10">
      <h1 className="mb-4 text-2xl font-bold">Upload</h1>
      <CloudinaryUploader />
    </div>
  );
}
