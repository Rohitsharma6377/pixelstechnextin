import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface TestimonialDoc {
  _id?: any;
  name: string;
  company?: string;
  message: string;
  rating?: number; // 1-5
  avatarUrl?: string | null;
  published?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<TestimonialDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<TestimonialDoc>("testimonials");
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ published: 1, createdAt: -1 });
  return col;
}

export async function listTestimonials(onlyPublished = true) {
  const col = await getCollection();
  const query = onlyPublished ? { published: { $ne: false } } : {};
  return await col
    .find(query, { projection: { name: 1, company: 1, message: 1, rating: 1, avatarUrl: 1, createdAt: 1 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function createTestimonial(t: Omit<TestimonialDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: TestimonialDoc = { createdAt: now, updatedAt: now, published: true, ...t };
  const res = await col.insertOne(doc);
  return res.insertedId;
}
