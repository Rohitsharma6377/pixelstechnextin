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

async function requireAdmin(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
  const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
  if ((payload as any).role !== "ADMIN") return null;
  return payload as any;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const _id = new ObjectId(params.id);
    const doc = await db.collection("projects").findOne({ _id });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ item: doc });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to fetch" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await req.json();
    const allowed: any = {};
    if (body.title !== undefined) allowed.title = body.title;
    if (body.slug !== undefined) allowed.slug = body.slug;
    if (body.description !== undefined) allowed.description = body.description;
    if (body.imageUrl !== undefined) allowed.imageUrl = body.imageUrl;
    if (body.tags !== undefined) allowed.tags = body.tags;
    if (body.url !== undefined) allowed.url = body.url;
    if (body.repoUrl !== undefined) allowed.repoUrl = body.repoUrl;
    if (body.featured !== undefined) allowed.featured = body.featured;
    if (body.category !== undefined) allowed.category = body.category;
    allowed.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db();
    const _id = new ObjectId(params.id);
    const res = await db.collection("projects").findOneAndUpdate(
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
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const client = await clientPromise;
    const db = client.db();
    const _id = new ObjectId(params.id);
    const res = await db.collection("projects").deleteOne({ _id });
    if (!res.deletedCount) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Failed to delete" }, { status: 500 });
  }
}
