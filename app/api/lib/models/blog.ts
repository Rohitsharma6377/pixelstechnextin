import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface BlogPostDoc {
  _id?: any;
  title: string;
  slug: string;
  content: string;
  imageUrl?: string | null;
  tags?: string[];
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<BlogPostDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<BlogPostDoc>("posts");
  // Indexes for queries and uniqueness on slug
  await col.createIndex({ slug: 1 }, { unique: true });
  await col.createIndex({ createdAt: -1 });
  await col.createIndex({ authorId: 1 });
  return col;
}

export async function listPosts() {
  const col = await getCollection();
  return await col
    .find({}, { projection: { title: 1, slug: 1, imageUrl: 1, createdAt: 1, category: 1, tags: 1 } })
    .sort({ createdAt: -1 })
    .toArray();
}

export async function getPostBySlug(slug: string) {
  const col = await getCollection();
  return await col.findOne({ slug });
}

export async function createPost(post: Omit<BlogPostDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: BlogPostDoc = { ...post, createdAt: now, updatedAt: now };
  const res = await col.insertOne(doc);
  return res.insertedId;
}
