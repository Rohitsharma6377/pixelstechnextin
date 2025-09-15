import { NextResponse } from "next/server";
import clientPromise from "@/app/api/lib/mongodb";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params;
    const client = await clientPromise;
    const db = client.db();
    const post = await db.collection("posts").findOne({ slug });
    if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ post });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

export async function PUT(req: Request, { params }: { params: { slug: string } }) {
  try {
    // Require auth like other admin routes
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
    await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const updates = await req.json();
    const allowed: any = {};
    if (updates.title !== undefined) allowed.title = updates.title;
    if (updates.content !== undefined) allowed.content = updates.content;
    if (updates.imageUrl !== undefined) allowed.imageUrl = updates.imageUrl;
    if (updates.tags !== undefined) allowed.tags = updates.tags;
    if (updates.category !== undefined) allowed.category = updates.category;
    if (updates.metaTitle !== undefined) allowed.metaTitle = updates.metaTitle;
    if (updates.metaDescription !== undefined) allowed.metaDescription = updates.metaDescription;
    if (updates.metaKeywords !== undefined) allowed.metaKeywords = updates.metaKeywords;
    if (updates.authorId !== undefined) allowed.authorId = updates.authorId;
    if (updates.shortDescription !== undefined) allowed.shortDescription = updates.shortDescription;
    if (updates.longDescription !== undefined) allowed.longDescription = updates.longDescription;
    if (updates.published !== undefined) allowed.published = updates.published;
    allowed.updatedAt = new Date();

    const client = await clientPromise;
    const db = client.db();
    const res = await db.collection("posts").findOneAndUpdate(
      { slug: params.slug },
      { $set: allowed },
      { returnDocument: "after" }
    );
    if (!res.value) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}
