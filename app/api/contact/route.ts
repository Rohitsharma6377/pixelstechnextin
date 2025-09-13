import { NextResponse } from "next/server";
import { createContactMessage, listContactMessages } from "@/app/api/lib/models/contact";
import { jwtVerify } from "jose";

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

export async function GET(req: Request) {
  try {
    const admin = await requireAdmin(req);
    if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const items = await listContactMessages();
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch contact messages" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message, subject, phone } = body || {};
    if (!name || !email || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    const id = await createContactMessage({ name, email, message, subject, phone });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to submit message" }, { status: 500 });
  }
}
