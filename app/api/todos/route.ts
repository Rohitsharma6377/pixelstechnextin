import { NextResponse } from "next/server";
import { createTodo, listTodos } from "@/app/api/lib/models/todo";
import { jwtVerify } from "jose";

export const runtime = "nodejs";

function getTokenFromRequest(req: Request) {
  const headerCookie = (req.headers as any).get?.("cookie") as string | null;
  const token = headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "";
  return token;
}

export async function GET() {
  try {
    const items = await listTodos();
    return NextResponse.json({ items });
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || "default_secret_change_me");
    await jwtVerify(token, secret, { algorithms: ["HS256"] });

    const body = await req.json();
    const { title, description, status = "todo", order = 0 } = body || {};
    if (!title) return NextResponse.json({ error: "Missing title" }, { status: 400 });

    const id = await createTodo({ title, description, status, order });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
