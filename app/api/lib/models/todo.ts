import clientPromise from "@/app/api/lib/mongodb";
import type { Collection } from "mongodb";

export type TodoStatus = "todo" | "doing" | "done";

export interface TodoDoc {
  _id?: any;
  title: string;
  description?: string;
  status: TodoStatus;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
}

async function getCollection(): Promise<Collection<TodoDoc>> {
  const client = await clientPromise;
  const db = client.db();
  const col = db.collection<TodoDoc>("todos");
  await col.createIndex({ status: 1, order: 1 });
  return col;
}

export async function listTodos() {
  const col = await getCollection();
  const items = await col
    .find({}, { projection: { title: 1, description: 1, status: 1, order: 1 } })
    .sort({ status: 1, order: 1, createdAt: 1 })
    .toArray();
  return items;
}

export async function createTodo(todo: Omit<TodoDoc, "_id" | "createdAt" | "updatedAt">) {
  const col = await getCollection();
  const now = new Date();
  const doc: TodoDoc = { createdAt: now, updatedAt: now, ...todo };
  const res = await col.insertOne(doc as any);
  return res.insertedId;
}

export async function updateTodo(id: any, updates: Partial<Omit<TodoDoc, "_id" | "createdAt">>) {
  const col = await getCollection();
  await col.updateOne(
    { _id: id } as any,
    { $set: { ...updates, updatedAt: new Date() } }
  );
  const doc = await col.findOne({ _id: id } as any);
  return doc as any;
}

export async function deleteTodo(id: any) {
  const col = await getCollection();
  await col.deleteOne({ _id: id } as any);
}
