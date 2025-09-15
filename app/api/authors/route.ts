import { NextResponse } from "next/server";
import { createAuthor, listAuthors } from "@/app/api/lib/models/author";
import { jwtVerify } from "jose";

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

export async function GET() {
  try {
    const items = await listAuthors();
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch authors" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Require an authenticated user (no ADMIN role needed), consistent with /api/blog
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
    await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const body = await req.json();
    const { name, designation, bio, imageUrl } = body || {};
    if (!name) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const id = await createAuthor({ name, designation, bio, imageUrl });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create author" }, { status: 500 });
  }
}
