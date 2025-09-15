import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export type LeadStatus = "New" | "Contacted" | "Qualified" | "Won" | "Lost";

export interface LeadDoc {
  _id?: any;
  name: string;
  email?: string;
  phone?: string;
  source?: string; // Website, Referral, Email, Ads, Other
  status: LeadStatus;
  assignee?: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<LeadDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<LeadDoc>("leads");
  await col.createIndex({ status: 1, createdAt: -1 });
  await col.createIndex({ name: 1 });
  return col;
}

export async function listLeads() {
  const col = await getCollection();
  return await col
    .find({}, { projection: { name: 1, email: 1, phone: 1, source: 1, status: 1, assignee: 1, note: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createLead(lead: Omit<LeadDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: LeadDoc = { createdAt: now, updatedAt: now, ...lead };
  const res = await col.insertOne(doc as any);
  return res.insertedId;
}

export async function updateLead(id: any, updates: Partial<Omit<LeadDoc, "_id" | "createdAt">>) {
  const col = await getCollection();
  await col.updateOne({ _id: id } as any, { $set: { ...updates, updatedAt: new Date() } });
  const doc = await col.findOne({ _id: id } as any);
  return doc as any;
}

export async function deleteLead(id: any) {
  const col = await getCollection();
  await col.deleteOne({ _id: id } as any);
}
