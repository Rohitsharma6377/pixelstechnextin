import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { createUser, findUserByEmail } from "@/app/api/lib/models/user";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const existing = await findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 });
    }

    const hashed = await hash(password, 10);

    const id = await createUser({
      name: name || email.split("@")[0],
      email,
      password: hashed,
      role: "USER",
    });

    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e: any) {
    const message = e?.message || "Server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
