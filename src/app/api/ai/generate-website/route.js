import { NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import Dataset from "../../../../../models/Dataset";

export async function POST(req) {
  try {
    await connectDB();

    const { prompt, tags } = await req.json();
    if (!prompt)
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    // --- FIX TAG HANDLING ---
    let tagsArray = [];
    if (Array.isArray(tags)) {
      tagsArray = tags;
    } else if (typeof tags === "string") {
      tagsArray = tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
    }

    // Call Groq API
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You generate complete, production-ready HTML websites using only Tailwind CSS.

HARD REQUIREMENTS:
- Must return a FULL HTML file with <html>, <head>, <body>.
- Include Tailwind CSS via CDN in <head>.
- Include <meta name='viewport' content='width=device-width, initial-scale=1.0'>.
- Output ONLY valid HTML (no markdown, no partial snippets).
- NO JavaScript.
- NO external CSS besides Tailwind CDN.
- All icons must be inline SVG.
- All images must be **working real images from Unsplash (https://unsplash.com/)**, relevant to the content of each section.
- Website must always include all sections in this order:
  1. HEADER
  2. HERO SECTION
  3. SERVICES SECTION
  4. FEATURES SECTION
  5. ABOUT SECTION
  6. FOOTER
- Each section must be fully responsive and visually polished on mobile, tablet, and desktop.
- Use semantic HTML5 elements (<header>, <main>, <section>, <footer>).

HEADER REQUIREMENTS:
- Clean header with logo/title and nav menu (Home, About, Services, Product, Contact)
- Mobile-friendly collapsible menu (CSS-only)
- Sticky/fixed optional, must not break layout
- Focus on a modern, premium color palette (indigo, slate, blue, purple)
- Navigation links clearly visible with proper hover effects

HERO SECTION REQUIREMENTS:
- Large, visually striking headline with subtext
- Bold CTA button
- Include a relevant Unsplash image with meaningful alt text
- Use gradient backgrounds, subtle textures, or premium colors for high-impact UI

SERVICES & FEATURES & ABOUT REQUIREMENTS:
- At least 3 cards/features per section
- Each card/feature includes title, description, optional inline SVG
- Include **working Unsplash images** that fit the content
- Use responsive grids or modern split layouts
- Hover effects: scale, shadow, color transitions
- Rounded corners, subtle drop shadows, smooth spacing
- Balanced whitespace and clean typography
- Each section should feel visually distinct yet coherent

FOOTER REQUIREMENTS:
- © CURRENT YEAR (manual text)
- Social media placeholders with inline SVG or text
- Contact info placeholders
- Dark background with readable, light text
- Proper spacing, visually balanced

ADDITIONAL DESIGN REQUIREMENTS:
- Carefully choose premium colors for each section to create a cohesive, polished look
- Tailwind spacing utilities (py-20, px-6, mx-auto, container)
- Ensure typography hierarchy is clear (headings, subheadings, CTAs)
- Max-width containers (max-w-6xl / max-w-7xl)
- Fully responsive layouts on all devices
- Avoid repetitive structures; each section should feel unique
- All HTML must be semantic, properly indented, and production-ready
- No missing or mismatched tags

IMAGE REQUIREMENTS:
- Use only **real Unsplash images**
- Images must match content and theme of each section
- Include descriptive alt text
- Ensure images are responsive and proportionate
- Focus on UI impact and aesthetic

OUTPUT STYLE:
- Do NOT include explanations or notes
- Output only full HTML code ready to use
- Ensure a modern, professional, and visually polished website
`,
            },
            { role: "user", content: prompt },
          ],

          temperature: 0.2,
        }),
      }
    );

    if (!response.ok) {
      const errData = await response.json();
      return NextResponse.json(
        { error: errData.error?.message || "AI error" },
        { status: 500 }
      );
    }

    const data = await response.json();
    const completion = data.choices?.[0]?.message?.content?.trim();

    if (!completion) {
      return NextResponse.json(
        { error: "AI returned no content" },
        { status: 500 }
      );
    }

    // Save dataset
    const newDataset = await Dataset.create({
      prompt,
      completion,
      tags: tagsArray, // <-- FIXED
    });

    return NextResponse.json({ success: true, data: newDataset });
  } catch (err) {
    console.error("AI generation error:", err);
    return NextResponse.json(
      { error: "Server error generating website" },
      { status: 500 }
    );
  }
}
