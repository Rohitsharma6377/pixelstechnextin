import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface NoteDoc {
  _id?: any;
  title: string;
  body: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<NoteDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<NoteDoc>("notes");
  await col.createIndex({ title: 1 });
  await col.createIndex({ tags: 1 });
  return col;
}

export async function listNotes() {
  const col = await getCollection();
  return await col
    .find({}, { projection: { title: 1, body: 1, tags: 1, createdAt: 1, updatedAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createNote(note: Omit<NoteDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: NoteDoc = { createdAt: now, updatedAt: now, ...note };
  const res = await col.insertOne(doc as any);
  return res.insertedId;
}

export async function updateNote(id: any, updates: Partial<Omit<NoteDoc, "_id" | "createdAt">>) {
  const col = await getCollection();
  await col.updateOne({ _id: id } as any, { $set: { ...updates, updatedAt: new Date() } });
  const doc = await col.findOne({ _id: id } as any);
  return doc as any;
}

export async function deleteNote(id: any) {
  const col = await getCollection();
  await col.deleteOne({ _id: id } as any);
}
