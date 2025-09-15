import { NextResponse } from "next/server";
import clientPromise from "@/app/api/lib/mongodb";
import { ObjectId } from "mongodb";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

async function requireAuth(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  return payload as any;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const _id = new ObjectId(params.id);
    const doc = await db.collection("todos").findOne({ _id });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: doc });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const allowed: any = {};
    if (body.title !== undefined) allowed.title = body.title;
    if (body.description !== undefined) allowed.description = body.description;
    if (body.status !== undefined) allowed.status = body.status;
    if (body.order !== undefined) allowed.order = body.order;
    allowed.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db();
    const _id = new ObjectId(params.id);
    const res = await db.collection("todos").findOneAndUpdate(
      { _id },
      { $set: allowed },
      { returnDocument: "after" }
    );
    if (!res.value) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: res.value });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = await requireAuth(req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const client = await clientPromise;
    const db = client.db();
    const _id = new ObjectId(params.id);
    const res = await db.collection("todos").deleteOne({ _id });
    if (!res.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete" }, { status: 500 });
  }
}
