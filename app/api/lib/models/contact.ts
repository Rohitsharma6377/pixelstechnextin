import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export type ContactStatus = "NEW" | "READ" | "ARCHIVED";

export interface ContactMessageDoc {
  _id?: any;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: ContactStatus;
  createdAt: Date;
}

async function getCollection(): Promise<Collection<ContactMessageDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<ContactMessageDoc>("contact_messages");
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ status: 1, createdAt: -1 });
  return col;
}

export async function createContactMessage(input: Omit<ContactMessageDoc, "_id" | "status" | "createdAt">) {
  const col = await getCollection();
  const doc: ContactMessageDoc = {
    ...input,
    status: "NEW",
    createdAt: new Date(),
  };
  const res = await col.insertOne(doc);
  return res.insertedId;
}

export async function listContactMessages(limit = 100) {
  const col = await getCollection();
  return await col
    .find({}, { projection: { name: 1, email: 1, subject: 1, message: 1, status: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}
