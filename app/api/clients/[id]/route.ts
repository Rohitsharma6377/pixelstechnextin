import { NextResponse } from "next/server";
import clientPromise from "@/app/api/lib/mongodb";

export const runtime = "nodejs";

function toObjectId(id: string) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { ObjectId } = require("mongodb");
  return new ObjectId(id);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    await db.collection("clients").deleteOne({ _id: toObjectId(params.id) });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db();
    await db.collection("clients").updateOne(
      { _id: toObjectId(params.id) },
      { $set: { ...body, updatedAt: new Date() } }
    );
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}
