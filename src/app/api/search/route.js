import { connect } from "../../../../lib/db";
import Doc from "../../../../models/Doc";
import QueryCache from "../../../../models/QueryCache";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

/* ================= HELPERS ================= */

function cleanQuery(query) {
  return query
    .toLowerCase()
    .replace(/tell me about|what is|who is|explain|define/gi, "")
    .trim();
}

function keywordBoost(query, text) {
  const qWords = query.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  let score = 0;
  for (const w of qWords) {
    if (text.toLowerCase().includes(w)) {
      score += w.length >= 6 ? 2 : 1;
    }
  }
  return score;
}

function extractRelevantSentences(text, query) {
  return text
    .split(/[.?!]/)
    .map(s => s.trim())
    .filter(s => s.length > 25 && keywordBoost(query, s) > 0);
}

function summarize(sentences, max = 3) {
  const unique = [];
  for (const s of sentences) {
    if (!unique.some(u => u.includes(s) || s.includes(u))) {
      unique.push(s);
    }
    if (unique.length >= max) break;
  }
  return unique.length ? unique.join(". ") + "." : null;
}

function chunkText(text, size = 400) {
  const sentences = text.split(/(?<=[.?!])\s+/);
  const chunks = [];
  let current = "";

  for (const s of sentences) {
    if ((current + s).length > size) {
      chunks.push(current.trim());
      current = s;
    } else {
      current += " " + s;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function alreadyExists(text) {
  const found = await Doc.findOne({
    text: { $regex: text.slice(0, 60), $options: "i" },
  });
  return !!found;
}

/* ---------- WIKIPEDIA ---------- */

async function fetchWikipedia(query) {
  const cleaned = cleanQuery(query);

  // 1️⃣ Try direct summary
  let res = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleaned)}`
  );

  if (res.ok) {
    const data = await res.json();
    if (data.extract) return data.extract;
  }

  // 2️⃣ Search fallback
  const searchRes = await fetch(
    `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleaned)}&format=json&origin=*`
  );

  if (!searchRes.ok) return null;

  const searchData = await searchRes.json();
  const title = searchData?.query?.search?.[0]?.title;
  if (!title) return null;

  // 3️⃣ Fetch best match summary
  const finalRes = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  );

  if (!finalRes.ok) return null;

  const finalData = await finalRes.json();
  return finalData.extract || null;
}

/* ================= ROUTE ================= */

export async function POST(req) {
  try {
    const { query, topK = 6 } = await req.json();
    if (!query?.trim()) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    await connect();
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    const cleanedQuery = cleanQuery(query);

    /* ---------- EMBEDDING CACHE ---------- */

    let cached = await QueryCache.findOne({ query: cleanedQuery });
    let queryVector;

    if (cached) {
      queryVector = cached.embedding;
    } else {
      const emb = await ai.models.embedContent({
        model: "gemini-embedding-001",
        contents: cleanedQuery,
      });
      queryVector = emb.embeddings[0].values;
      await QueryCache.create({ query: cleanedQuery, embedding: queryVector });
    }

    /* ---------- VECTOR SEARCH ---------- */

    const results = await Doc.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector,
          numCandidates: 100,
          limit: topK,
        },
      },
      {
        $project: {
          text: 1,
          score: { $meta: "vectorSearchScore" },
        },
      },
    ]);

    /* ---------- RERANK ---------- */

    const sentences = [];
    for (const r of results) {
      if (r.score < 0.6) continue; // 🔥 FIXED
      const sents = extractRelevantSentences(r.text, cleanedQuery);
      for (const s of sents) {
        sentences.push({
          text: s,
          score: r.score + keywordBoost(cleanedQuery, s),
        });
      }
    }

    sentences.sort((a, b) => b.score - a.score);

    let answer = summarize(sentences.map(s => s.text));
    let confidence = answer ? sentences[0].score : 0;
    let source = answer ? "database" : "none";

    /* ---------- WIKIPEDIA FALLBACK + AUTO-LEARN ---------- */

    if (!answer || confidence < 0.7) {
      const wikiText = await fetchWikipedia(cleanedQuery);

      if (wikiText) {
        const chunks = chunkText(wikiText);

        for (const chunk of chunks) {
          if (await alreadyExists(chunk)) continue;

          const emb = await ai.models.embedContent({
            model: "gemini-embedding-001",
            contents: chunk,
          });

          await Doc.create({
            text: chunk,
            embedding: emb.embeddings[0].values,
            source: "wikipedia",
            topic: cleanedQuery,
          });
        }

        answer = wikiText.split(". ").slice(0, 3).join(". ") + ".";
        confidence = 0.95;
        source = "wikipedia";
      }
    }

    return NextResponse.json({
      answer: answer || "I don't have information about this topic yet.",
      confidence: Number(confidence.toFixed(2)),
      source,
    });

  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
