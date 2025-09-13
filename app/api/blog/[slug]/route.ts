import { NextResponse } from "next/server";
import clientPromise from "@/app/api/lib/mongodb";

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
