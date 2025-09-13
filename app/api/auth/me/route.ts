import { NextResponse } from "next/server";
import { verifyToken } from "@/app/api/lib/jwt";

export async function GET(req: Request) {
  try {
    const cookie = (req as any).cookies?.get?.("token")?.value ?? "";
    // For App Router, cookies are not directly on req; use headers
    const headerCookie = (req.headers as any).get?.("cookie") as string | null;
    const token = cookie || (headerCookie?.match(/(?:^|; )token=([^;]+)/)?.[1] ?? "");
    if (!token) return NextResponse.json({ user: null }, { status: 200 });
    const payload = await verifyToken(token);
    return NextResponse.json({ user: { id: payload.id, email: payload.email, name: payload.name, role: payload.role || "USER" } });
  } catch (e) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
