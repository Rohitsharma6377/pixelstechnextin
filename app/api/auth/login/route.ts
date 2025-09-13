import { NextResponse } from "next/server";
import clientPromise from "@/app/api/lib/mongodb";
import { compare } from "bcrypt";
import { signToken } from "@/app/api/lib/jwt";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection("users").findOne({ email });
    if (!user || !user.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const ok = await compare(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = await signToken({ id: user._id.toString(), email: user.email, name: user.name, role: user.role || "USER" });

    const res = NextResponse.json({ ok: true });
    res.cookies.set({ name: "token", value: token, httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" });
    return res;
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
