"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/Admin/Modal";
import Upload from "@/components/Admin/Upload";

export default function AdminClientsPage() {
  type Client = { id: string; name: string; company?: string; email?: string; phone?: string; website?: string; logoUrl?: string };
  const [items, setItems] = useState<Client[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [logoUrl, setLogoUrl] = useState<string>("");

  useEffect(() => {
    // Local storage bootstrap (temporary until API is wired)
    const raw = localStorage.getItem("admin_clients");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_clients", JSON.stringify(items));
  }, [items]);

  function addClient(e: React.FormEvent) {
    e.preventDefault();
    const id = Math.random().toString(36).slice(2);
    setItems((cur) => [...cur, { id, name, company, email, phone, website, logoUrl }]);
    setOpen(false);
    setName("");
    setCompany("");
    setEmail("");
    setPhone("");
    setWebsite("");
    setLogoUrl("");
  }

  function remove(id: string) {
    setItems((cur) => cur.filter((c) => c.id !== id));
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
            <button className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Add client</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
