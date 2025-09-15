import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface AuthorDoc {
  _id?: any;
  name: string;
  designation?: string;
  bio?: string;
  imageUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<AuthorDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<AuthorDoc>("authors");
  await col.createIndex({ name: 1 }, { unique: false });
  return col;
}

export async function listAuthors() {
  const col = await getCollection();
  return await col.find({}, { projection: { name: 1, designation: 1, imageUrl: 1, bio: 1 } }).sort({ name: 1 }).toArray();
}

export async function createAuthor(author: Omit<AuthorDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: AuthorDoc = { createdAt: now, updatedAt: now, ...author };
  const res = await col.insertOne(doc);
  return res.insertedId;
}

export async function deleteAuthor(id: any) {
  const col = await getCollection();
  await col.deleteOne({ _id: id } as any);
}

export async function updateAuthor(id: any, updates: Partial<Omit<AuthorDoc, "_id" | "createdAt">>) {
  const col = await getCollection();
  await col.updateOne({ _id: id } as any, { $set: { ...updates, updatedAt: new Date() } });
}
