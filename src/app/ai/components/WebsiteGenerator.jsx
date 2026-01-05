"use client";

import { useState, useRef } from "react";

export default function WebsiteGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [error, setError] = useState("");
  const [showFullPreview, setShowFullPreview] = useState(false);
  const [onlineId, setOnlineId] = useState(""); // store the _id

  const previewRef = useRef(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setGeneratedHTML("");
    setOnlineId("");

    try {
      const res = await fetch("/api/ai/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Something went wrong.");
        return;
      }

      setGeneratedHTML(data.data.completion);
      setOnlineId(data.data._id); // store the returned _id

      // auto-scroll to preview
      setTimeout(() => {
        previewRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      console.error(err);
      setError("Something broke, my friend 😭");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated-website.html";
    link.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedHTML);
  };

  const handleOpenOnline = () => {
    if (!onlineId) return;
    window.open(`https://preview-img.vercel.app/api/ai/dataset/${onlineId}`, "_blank");
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Website Generator ✨
      </h1>

      {/* Prompt Box */}
      <div className="space-y-3">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          placeholder="Describe the website you want…"
          className="w-full p-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Website"}
        </button>
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-500 font-medium animate-pulse">{error}</p>
      )}

      {/* Live Preview */}
      {generatedHTML && (
        <div ref={previewRef} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Live Preview</h2>

            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800"
              >
                Copy HTML
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Download HTML
              </button>

              <button
                onClick={() => setShowFullPreview(!showFullPreview)}
                className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                {showFullPreview ? "Exit Full Preview" : "Fullscreen"}
              </button>

              {onlineId && (
                <button
                  onClick={handleOpenOnline}
                  className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Open Online
                </button>
              )}
            </div>
          </div>

          <div
            className={`border rounded-lg overflow-hidden shadow-lg ${
              showFullPreview ? "fixed inset-0 z-50 bg-white" : "h-[500px]"
            }`}
          >
            <iframe srcDoc={generatedHTML} className="w-full h-full" />
          </div>
        </div>
      )}
    </div>
  );
}
