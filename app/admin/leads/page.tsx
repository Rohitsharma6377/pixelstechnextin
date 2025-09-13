"use client";

import { useEffect, useMemo, useState } from "react";
import Modal from "@/components/Admin/Modal";

export default function AdminLeadsPage() {
  type Lead = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    source?: string; // Website, Referral, Email, Ads, Other
    status: "New" | "Contacted" | "Qualified" | "Won" | "Lost";
    assignee?: string;
    note?: string;
    createdAt: string;
  };

  const [items, setItems] = useState<Lead[]>([]);
  const [open, setOpen] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("Website");
  const [status, setStatus] = useState<Lead["status"]>("New");
  const [assignee, setAssignee] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem("admin_leads");
    if (raw) setItems(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem("admin_leads", JSON.stringify(items));
  }, [items]);

  function addLead(e: React.FormEvent) {
    e.preventDefault();
    const id = Math.random().toString(36).slice(2);
    setItems((cur) => [
      ...cur,
      { id, name, email, phone, source, status, assignee, note, createdAt: new Date().toISOString() },
    ]);
    setOpen(false);
    setName("");
    setEmail("");
    setPhone("");
    setSource("Website");
    setStatus("New");
    setAssignee("");
    setNote("");
  }

  function remove(id: string) {
    setItems((cur) => cur.filter((c) => c.id !== id));
  }

  function updateStatus(id: string, next: Lead["status"]) {
    setItems((cur) => cur.map((l) => (l.id === id ? { ...l, status: next } : l)));
  }

  const counters = useMemo(() => {
    const buckets: Record<Lead["status"], number> = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      Won: 0,
      Lost: 0,
    };
    items.forEach((l) => (buckets[l.status]++));
    return buckets;
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Leads</h1>
          <p className="text-sm text-slate-500">Track leads and status. Data persists locally until API is wired.</p>
        </div>
        <button onClick={() => setOpen(true)} className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500">New Lead</button>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        {(["New","Contacted","Qualified","Won","Lost"] as Lead["status"][]).map((s) => (
          <div key={s} className="rounded-xl border border-white/10 bg-white/5 p-3 dark:bg-transparent">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold">{s}</div>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">{counters[s]}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm dark:bg-transparent">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Source</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Assignee</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.length === 0 && (
              <tr><td className="px-4 py-3 text-sm" colSpan={7}>No leads</td></tr>
            )}
            {items.map((l) => (
              <tr key={l.id}>
                <td className="px-4 py-3 text-sm">{l.name}</td>
                <td className="px-4 py-3 text-sm">{l.email || "-"}</td>
                <td className="px-4 py-3 text-sm">{l.phone || "-"}</td>
                <td className="px-4 py-3 text-sm">{l.source || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <select value={l.status} onChange={(e) => updateStatus(l.id, e.target.value as Lead["status"])} className="rounded border border-white/10 bg-transparent px-2 py-1 text-sm">
                    {(["New","Contacted","Qualified","Won","Lost"] as Lead["status"][]).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-sm">{l.assignee || "-"}</td>
                <td className="px-4 py-3 text-sm">
                  <button onClick={() => remove(l.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Lead" maxWidth="xl">
        <form onSubmit={addLead} className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm">Name</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Email</label>
            <input type="email" className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Phone</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm">Source</label>
            <select className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={source} onChange={(e) => setSource(e.target.value)}>
              {['Website','Referral','Email','Ads','Other'].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm">Status</label>
            <select className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={status} onChange={(e) => setStatus(e.target.value as Lead["status"])}>
              {(["New","Contacted","Qualified","Won","Lost"] as Lead["status"][]).map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm">Assignee</label>
            <input className="w-full rounded border border-white/10 bg-transparent px-3 py-2" value={assignee} onChange={(e) => setAssignee(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm">Note</label>
            <textarea className="w-full rounded border border-white/10 bg-transparent px-3 py-2" rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
          <div className="md:col-span-2 flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)} className="rounded border border-white/10 px-4 py-2 text-sm">Cancel</button>
            <button className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">Add lead</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
