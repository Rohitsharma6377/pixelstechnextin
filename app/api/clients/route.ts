import { NextResponse } from "next/server";
import { createClient, listClients } from "@/app/api/lib/models/client";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

export async function GET() {
  try {
    const items = await listClients();
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
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
    const { name, company, email, phone, website, logoUrl } = body || {};
    if (!name) return NextResponse.json({ error: "Missing name" }, { status: 400 });

    const id = await createClient({ name, company, email, phone, website, logoUrl });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
