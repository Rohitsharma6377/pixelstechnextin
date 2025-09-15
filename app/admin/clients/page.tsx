"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Admin/Modal";
import Upload from "@/components/Admin/Upload";

export default function AdminClientsPage() {
  type Client = { id: string; name: string; company?: string; email?: string; phone?: string; website?: string; logoUrl?: string };
  const [items, setItems] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>("");

  // Load from API on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/clients");
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to fetch clients");
        const list = (data.items as any[]).map((c) => ({
          id: String(c._id),
          name: c.name,
          company: c.company,
          email: c.email,
          phone: c.phone,
          website: c.website,
          logoUrl: c.logoUrl,
        })) as Client[];
        setItems(list);
      } catch {
        // ignore for now
      }
    })();
  }, []);

  function addClient(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    (async () => {
      try {
        const payload = { name, company, email, phone, website, logoUrl };
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to create client");
        // Refresh
        const listRes = await fetch("/api/clients");
        const listData = await listRes.json();
        if (listRes.ok) {
          const list = (listData.items as any[]).map((c) => ({
            id: String(c._id),
            name: c.name,
            company: c.company,
            email: c.email,
            phone: c.phone,
            website: c.website,
            logoUrl: c.logoUrl,
          })) as Client[];
          setItems(list);
        }
        setOpen(false);
        setName("");
        setCompany("");
        setEmail("");
        setPhone("");
        setWebsite("");
        setLogoUrl("");
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
        const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data?.error || "Failed to delete");
        setItems((cur) => cur.filter((c) => c.id !== id));
      } catch {
        // ignore
      }
    })();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clients</h1>
          <p className="text-sm text-slate-500">Manage client records. Data will persist locally until API is wired.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Client</button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm dark:bg-transparent">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Company</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Website</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={6}>No clients</td></tr>
            )}
            {items.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 text-sm">{c.name}</td>
                <td className="px-4 py-3 text-sm">{c.company || "-"}</td>
                <td className="px-4 py-3 text-sm">{c.email || "-"}</td>
                <td className="px-4 py-3 text-sm">{c.phone || "-"}</td>
                <td className="px-4 py-3 text-sm">{c.website || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => remove(c.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Client" maxWidth="xl">
        <form onSubmit={addClient} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Company</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={company} onChange={(e) => setCompany(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input type="email" className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Phone</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Website</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={website} onChange={(e) => setWebsite(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Logo</label>
            <Upload value={logoUrl} onChange={setLogoUrl} folder="clients" />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={loading} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{loading ? "Saving..." : "Add client"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
