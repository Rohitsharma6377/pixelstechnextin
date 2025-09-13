"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContacts } from "@/features/admin/adminSlice";
import type { RootState, AppDispatch } from "@/app/store";

export default function AdminContactsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { contacts, loading, error } = useSelector((s: RootState) => s.admin);

  useEffect(() => {
    dispatch(fetchContacts());
  }, [dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Contacts</h1>
        <p className="text-sm text-slate-500">View contact form submissions.</p>
      </div>

      {error && <div className="rounded border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

      <div className="overflow-hidden rounded border border-white/10">
        <table className="min-w-full divide-y divide-white/10">
          <thead className="bg-slate-100 dark:bg-white/5">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-semibold">Name</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Email</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Subject</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-2 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {loading && (
              <tr>
                <td className="px-4 py-3 text-sm" colSpan={5}>Loading...</td>
              </tr>
            )}
            {!loading && contacts.length === 0 && (
              <tr>
                <td className="px-4 py-3 text-sm" colSpan={5}>No messages</td>
              </tr>
            )}
            {contacts.map((c) => (
              <tr key={c._id} className="hover:bg-slate-50/50 dark:hover:bg-white/5">
                <td className="px-4 py-3 text-sm">{c.name}</td>
                <td className="px-4 py-3 text-sm">{c.email}</td>
                <td className="px-4 py-3 text-sm">{c.subject || "-"}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="rounded bg-slate-200 px-2 py-0.5 dark:bg-white/10">{c.status}</span>
                </td>
                <td className="px-4 py-3 text-sm">{new Date(c.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
