"use client";
import { useState, useEffect } from "react";

export default function Home() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Create a preview URL whenever image changes
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const upload = async () => {
    if (!image) return;
    setLoading(true);

    const form = new FormData();
    form.append("file", image);

    const res = await fetch("/api/upload", { method: "POST", body: form });
    const data = await res.json();

    setLink(data.link);
    setLoading(false);
    setCopied(false);
  };

  const copyLink = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col justify-center items-center px-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Upload & Share</h1>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4 block w-full text-sm text-gray-300
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-lg file:border-0
                     file:text-sm file:font-semibold
                     file:bg-blue-600 file:text-white
                     hover:file:bg-blue-700"
        />

        {/* Image Preview */}
        {preview && (
          <div className="mb-4">
            <img
              src={preview}
              alt="Preview"
              className="mx-auto rounded-lg shadow-lg max-h-64 object-contain"
            />
          </div>
        )}

        <button
          onClick={upload}
          disabled={loading}
          className="w-full bg-blue-600 py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-600"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        {link && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg flex flex-col gap-2">
            <p className="text-sm">Your Share Link:</p>
            <div className="flex items-center justify-between bg-gray-800 px-4 py-2 rounded-lg break-all">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 underline break-all"
              >
                {link}
              </a>
              <button
                onClick={copyLink}
                className="ml-2 p-2 rounded-lg hover:bg-gray-600 transition"
                title="Copy link"
              >
                {copied ? (
                  <span className="text-green-400 font-semibold">✓</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2M8 16h8a2 2 0 002-2v-2a2 2 0 00-2-2H8m0 0V6m0 4h8"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
