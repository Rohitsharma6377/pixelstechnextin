import { NextResponse } from "next/server";
import { createProject, listProjects } from "@/app/api/lib/models/project";
import { jwtVerify } from "jose";

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

export async function GET() {
  try {
    const items = await listProjects();
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    // Require authentication but not ADMIN role
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
    await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const body = await req.json();
    const { title, description, imageUrl, tags, url, repoUrl, featured, category } = body || {};
    if (!title) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // simple slug generator
    const slug = (title as string)
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const id = await createProject({ title, slug, description, imageUrl, tags, url, repoUrl, featured, category });
    return NextResponse.json({ ok: true, id, slug }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
