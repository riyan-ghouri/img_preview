import Image from "../../../../models/Image";
import { connectDB } from "../../../../lib/db";
import { NextResponse } from "next/server";


export async function GET(req, context) {
  try {
    await connectDB();

    // params is now a Promise
    const params = await context.params;
    const { shortId } = params;

    if (!shortId) {
      return NextResponse.json({ error: "No shortId provided" }, { status: 400 });
    }

    const image = await Image.findOne({ shortId });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({
      shortId: image.shortId,
      url: image.url,
      createdAt: image.createdAt,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


