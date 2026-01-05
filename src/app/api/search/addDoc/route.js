// app/api/addDoc/route.js
import { connect } from "../../../../../lib/db";
import Doc from "../../../../../models/Doc";
import { GoogleGenAI } from "@google/genai";

export async function POST(req) {
  try {
    await connect();

    const { text } = await req.json();
    if (!text?.trim()) {
      return new Response(JSON.stringify({ error: "Text is required" }), { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const response = await ai.models.embedContent({
      model: "gemini-embedding-001",
      contents: text,
    });

    const embedding = response.embeddings[0].values;

    // 🔒 critical guard
    if (!embedding || embedding.length !== 3072) {
      throw new Error(`Invalid embedding size: ${embedding?.length}`);
    }

    const doc = await Doc.create({ text, embedding });

    return new Response(JSON.stringify(doc), { status: 200 });
  } catch (err) {
    console.error("AddDoc error:", err);
    return new Response(JSON.stringify({ error: "Something went wrong" }), { status: 500 });
  }
}
