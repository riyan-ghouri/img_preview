// src/app/api/download/[shortId]/route.js
import { connectDB } from "../../../../../lib/db";
import Image from "../../../../../models/Image";

export async function GET(req, context) {
  await connectDB();

  const params = await context.params;
    const { shortId } = params;
  const img = await Image.findOne({ shortId }).lean();

  if (!img) return new Response("Image not found", { status: 404 });

  const res = await fetch(img.url);
  const arrayBuffer = await res.arrayBuffer();

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="image-${shortId}.png"`,
    },
  });
}
