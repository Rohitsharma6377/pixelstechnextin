import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface ClientDoc {
  _id?: any;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  website?: string;
  logoUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<ClientDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<ClientDoc>("clients");
  await col.createIndex({ name: 1 });
  await col.createIndex({ company: 1 });
  return col;
}

export async function listClients() {
  const col = await getCollection();
  return await col
    .find({}, { projection: { name: 1, company: 1, email: 1, phone: 1, website: 1, logoUrl: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createClient(p: Omit<ClientDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: ClientDoc = { createdAt: now, updatedAt: now, ...p };
  const res = await col.insertOne(doc);
  return res.insertedId;
}

export async function deleteClient(id: string) {
  const col = await getCollection();
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ObjectId } = require("mongodb");
  await col.deleteOne({ _id: new ObjectId(id) });
  return true;
}
