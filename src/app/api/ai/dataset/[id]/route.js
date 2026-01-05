import { connectDB } from "../../../../../../lib/db";
import Dataset from "../../../../../../models/Dataset";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await connectDB();

    // params is now a Promise
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "_id is required" }, { status: 400 });
    }

    const dataset = await Dataset.findById(id);

    if (!dataset) {
      return NextResponse.json({ error: "Dataset not found" }, { status: 404 });
    }

    // Return only HTML
    return new NextResponse(dataset.completion, {
      status: 200,
      headers: { "Content-Type": "text/html" },
    });
  } catch (err) {
    console.error("GET by ID error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
