import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const timestamp = Math.round(Date.now() / 1000);
    const params = { timestamp, folder: "uploads" } as Record<string, any>;
    const signature = cloudinary.utils.api_sign_request(params, process.env.CLOUDINARY_API_SECRET as string);
    return NextResponse.json({ timestamp, signature, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY });
  } catch (e) {
    return NextResponse.json({ error: "Unable to generate signature" }, { status: 500 });
  }
}
