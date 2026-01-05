import {connectDB} from "../../../../../lib/db";
import Dataset from "../../../../../models/Dataset";
import { NextResponse } from "next/server";


export async function POST(req) {
  try {
    await connectDB();
    const { prompt, completion, tags } = await req.json();

    if (!prompt || !completion) {
      return NextResponse.json({ error: "Prompt and completion are required" }, { status: 400 });
    }

    const newDataset = await Dataset.create({ prompt, completion, tags });
    return NextResponse.json(newDataset, { status: 201 });
  } catch (err) {
    console.error("POST error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const data = await Dataset.find();
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

