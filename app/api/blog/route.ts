import { NextResponse } from "next/server";
import clientPromise from "@/app/api/lib/mongodb";
import { jwtVerify } from "jose";

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const posts = await db
      .collection("posts")
      .find({}, { projection: { title: 1, slug: 1, imageUrl: 1, createdAt: 1, category: 1, tags: 1, metaTitle: 1, metaDescription: 1 } })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ posts });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const body = await req.json();
    const { title, content, imageUrl, tags, category, metaTitle, metaDescription, metaKeywords } = body || {};
    if (!title || !content) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const slug =
      (title as string)
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-") + "-" + Math.floor(Math.random() * 10000).toString(36);

    const client = await clientPromise;
    const db = client.db();
    const result = await db.collection("posts").insertOne({
      title,
      content,
      imageUrl: imageUrl || null,
      slug,
      tags: Array.isArray(tags) ? tags : [],
      category: category || null,
      metaTitle: metaTitle || title,
      metaDescription: metaDescription || (content as string).slice(0, 160),
      metaKeywords: Array.isArray(metaKeywords) ? metaKeywords : [],
      authorId: (payload as any).id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ ok: true, id: result.insertedId, slug }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
