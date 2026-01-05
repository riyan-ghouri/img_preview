import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import cloudinary from "../../../../lib/cloudinary";
import { connectDB } from "../../../../lib/db";
import Image from "../../../../models/Image";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Upload to Cloudinary with 1280x1280 square crop
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "uploads",
            transformation: [
              { width: 1280, height: 1280, crop: "fill", gravity: "auto" }, 
              // crop: 'fill' ensures exact 1:1 aspect ratio, gravity:auto centers
            ],
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    const imageUrl = uploadResult.secure_url;
    const shortId = nanoid(7); // e.g., "A7fD9xQ"

    await Image.create({ url: imageUrl, shortId });

    return NextResponse.json({
      url: imageUrl,
      link: `${process.env.NEXT_PUBLIC_BASE_URL}/i/${shortId}`,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


export async function GET(req) {

    await connectDB();
    
    const image = await Image.findOne();

    if (image) {
        return NextResponse.json({ message: "Latest image found", image });
    } else {
        return NextResponse.json({ message: "No images found" });
    }

  return NextResponse.json({ message: "Upload endpoint" });
}