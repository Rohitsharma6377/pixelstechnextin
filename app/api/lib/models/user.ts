import clientPromise from "@/app/api/lib/mongodb";
import type { Collection, WithId } from "mongodb";

export type Role = "USER" | "ADMIN";

export interface UserDoc {
  _id?: any;
  name?: string;
  email: string;
  password?: string; // hashed
  role?: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

async function getCollection(): Promise<Collection<UserDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<UserDoc>("users");
  // Ensure indexes
  await col.createIndex({ email: 1 }, { unique: true });
  await col.createIndex({ role: 1 });
  // Drop legacy username unique index if it exists to avoid E11000 on username:null
  try {
    const indexes = await col.indexes();
    const hasUsernameIdx = indexes.some((i) => i.name === "username_1");
    if (hasUsernameIdx) {
      await col.dropIndex("username_1");
    }
  } catch {
    // ignore
  }
  return col;
}

export async function findUserByEmail(email: string) {
  const col = await getCollection();
  return await col.findOne({ email });
}

export async function createUser(user: Omit<UserDoc, "_id">) {
  const col = await getCollection();
  const now = new Date();
  const doc: UserDoc = { role: "USER", createdAt: now, updatedAt: now, ...user };
  const res = await col.insertOne(doc);
  return res.insertedId;
}

export async function updateUserRole(email: string, role: Role) {
  const col = await getCollection();
  await col.updateOne({ email }, { $set: { role, updatedAt: new Date() } });
}

export async function findUserById(id: any) {
  const col = await getCollection();
  return await col.findOne({ _id: id } as any);
}
