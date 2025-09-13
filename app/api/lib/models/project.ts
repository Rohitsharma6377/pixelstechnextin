import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface ProjectDoc {
  _id?: any;
  title: string;
  slug: string;
  description?: string;
  imageUrl?: string | null;
  tags?: string[];
  url?: string;
  repoUrl?: string;
  featured?: boolean;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<ProjectDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<ProjectDoc>("projects");
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ featured: 1, createdAt: -1 });
  await col.createIndex({ category: 1 });
  return col;
}

export async function listProjects() {
  const col = await getCollection();
  return await col
    .find({}, { projection: { title: 1, slug: 1, imageUrl: 1, tags: 1, featured: 1, category: 1, createdAt: 1, metaTitle: 1, metaDescription: 1 } })
    .sort({ featured: -1, createdAt: -1 })
    .toArray();
}

export async function createProject(p: Omit<ProjectDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: ProjectDoc = { createdAt: now, updatedAt: now, featured: false, tags: [], ...p };
  const res = await col.insertOne(doc);
  return res.insertedId;
}
