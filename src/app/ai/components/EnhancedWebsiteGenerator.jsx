"use client";

import { useState, useRef, useEffect } from "react";

export default function EnhancedWebsiteGenerator() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedHTML, setGeneratedHTML] = useState("");
  const [typedHTML, setTypedHTML] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [typing, setTyping] = useState(false);

  const iframeRef = useRef(null);
  const codeRef = useRef(null);
  const typingRef = useRef(null); // FIX: prevent multiple running intervals

  useEffect(() => {
    fetchHistory();
    return () => clearInterval(typingRef.current);
  }, []);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/ai/dataset");
      const data = await res.json();
      setHistory(Array.isArray(data) ? data.reverse() : []);
    } catch (err) {
      console.error("history error", err);
    }
  }

  // FIXED TYPING SYSTEM — smoother + no UI freeze
  function startTyping(text) {
    clearInterval(typingRef.current);

    setTyping(true);
    setTypedHTML("");

    let i = 0;
    const speed = 3; // characters per interval

    typingRef.current = setInterval(() => {
      i += speed;
      setTypedHTML(text.slice(0, i));

      // Auto-scroll code viewer while typing
      if (codeRef.current) {
        codeRef.current.scrollTop = codeRef.current.scrollHeight;
      }

      if (i >= text.length) {
        clearInterval(typingRef.current);
        setTyping(false);
      }
    }, 10);
  }

  async function handleGenerate() {
    if (!prompt.trim()) return;

    clearInterval(typingRef.current);

    setLoading(true);
    setError("");
    setGeneratedHTML("");
    setTypedHTML("");

    try {
      const res = await fetch("/api/ai/generate-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "AI error");
        setLoading(false);
        return;
      }

      const html = data.data.completion;

      setGeneratedHTML(html);
      startTyping(html);
      fetchHistory();
    } catch (err) {
      console.error(err);
      setError("Failed to generate website");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectHistory(item) {
    clearInterval(typingRef.current);

    setSelectedId(item._id);
    setGeneratedHTML(item.completion);
    startTyping(item.completion);

    setTimeout(() => {
      iframeRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedHTML).catch(() => {});
  }

  function handleDownload() {
    const blob = new Blob([generatedHTML], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "generated-website.html";
    link.click();
  }

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl font-bold">AI Website Builder — Preview & Train</h1>

      {/* INPUT + HISTORY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe the website you want..."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-2">
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
              onClick={handleGenerate}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Website"
              )}
            </button>

            <button
              onClick={() => {
                clearInterval(typingRef.current);
                setPrompt("");
                setGeneratedHTML("");
                setTypedHTML("");
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg"
            >
              Clear
            </button>
          </div>

          {error && <div className="text-red-500">{error}</div>}

          {/* HISTORY */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2">History</h3>

            <div className="space-y-2 max-h-[260px] overflow-auto pr-2">
              {history.length === 0 && (
                <div className="text-sm text-gray-500">No generated sites yet.</div>
              )}

              {history.slice(0, 12).map((item) => (
                <button
                  key={item._id}
                  onClick={() => handleSelectHistory(item)}
                  className={`w-full text-left p-3 rounded-lg border ${
                    selectedId === item._id ? "bg-blue-50 border-blue-400" : "bg-white"
                  } hover:shadow-sm`}
                >
                  <div className="font-medium truncate">{item.prompt}</div>
                  <div className="text-xs text-gray-500">
                    {new Date(item.createdAt).toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="space-y-3">
          <div className="p-4 border rounded-lg space-y-3">
            <div className="text-sm text-gray-600">Actions</div>
            <button onClick={handleCopy} className="w-full px-3 py-2 bg-gray-800 text-white rounded">
              Copy HTML
            </button>
            <button onClick={handleDownload} className="w-full px-3 py-2 bg-green-600 text-white rounded">
              Download HTML
            </button>
            <a href="/app/train" className="block text-center text-sm text-blue-600">
              Go to Dataset & Train UI →
            </a>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="text-sm text-gray-600">Preview status</div>
            <div className="text-xs text-gray-500 mt-1">
              {generatedHTML ? "Ready" : "No preview"}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Typing: {typing ? "running..." : "idle"}
            </div>
          </div>
        </div>
      </div>

      {/* PREVIEW + CODE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* IFRAME PREVIEW */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Live Preview</h2>
            <div className="text-xs text-gray-500">iframe render</div>
          </div>

          <div ref={iframeRef} className="h-[500px] border rounded-lg overflow-hidden">
            {generatedHTML ? (
              <iframe title="preview" srcDoc={generatedHTML} className="w-full h-full" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No preview — generate a website
              </div>
            )}
          </div>
        </div>

        {/* HTML VIEWER */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">HTML (real-time typing)</h2>
            <div className="text-xs text-gray-500">auto-typing</div>
          </div>

          <div
            ref={codeRef}
            className="h-[500px] overflow-auto p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm"
          >
            <pre className="whitespace-pre-wrap break-words">
              {typedHTML || (generatedHTML ? "// Ready to type..." : "// HTML will appear here")}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
