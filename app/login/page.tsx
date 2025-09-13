"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { login, user } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await login(email, password);
    setLoading(false);
    if (!res.ok) setError(res.error || "Login failed");
    else {
      try {
        const me = await fetch("/api/auth/me", { cache: "no-store" }).then((r) => r.json());
        const role = me?.user?.role?.toLowerCase?.();
        if (role === "admin") router.push("/admin");
        else router.push("/");
      } catch {
        router.push("/");
      }
    }
  };

  return (
    <div className="container py-10">
      <h1 className="mb-6 text-3xl font-bold">Login</h1>
      <form onSubmit={onSubmit} className="max-w-sm space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-transparent dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-slate-300 bg-white p-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-white/10 dark:bg-transparent dark:text-white"
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
