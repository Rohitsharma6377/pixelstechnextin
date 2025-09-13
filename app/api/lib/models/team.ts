import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export interface SocialLinks {
  twitter?: string;
  linkedin?: string;
  github?: string;
  instagram?: string;
  website?: string;
}

export interface TeamMemberDoc {
  _id?: any;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string | null;
  socials?: SocialLinks;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<TeamMemberDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<TeamMemberDoc>("team_members");
  await col.createIndex({ order: 1, name: 1 });
  await col.createIndex({ name: 1 });
  return col;
}

export async function listTeamMembers() {
  const col = await getCollection();
  return await col.find({}, { projection: { name: 1, role: 1, imageUrl: 1, socials: 1, order: 1 } }).sort({ order: 1, name: 1 }).toArray();
}

export async function createTeamMember(member: Omit<TeamMemberDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: TeamMemberDoc = { createdAt: now, updatedAt: now, ...member };
  const res = await col.insertOne(doc);
  return res.insertedId;
}
