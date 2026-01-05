"use client";
import { useState, useRef } from "react";

export default function ApiTester() {
  const [url, setUrl] = useState("");
  const [method, setMethod] = useState("POST");
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto caller
  const [auto, setAuto] = useState(false);
  const [interval, setIntervalValue] = useState(5);
  const intervalRef = useRef(null);

  // Request counter
  const [requestCount, setRequestCount] = useState(0);

  const toggleAutoCall = () => {
    if (auto) {
      clearInterval(intervalRef.current);
      setAuto(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      sendRequest();
    }, interval * 1000);

    setAuto(true);
  };

  const sendRequest = async () => {
    setLoading(true);
    setResponse("");

    try {
      const parsedBody =
        method !== "GET" ? JSON.parse(body || "{}") : undefined;

      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, method, body: parsedBody }),
      });

      const text = await res.text();
      setResponse(text);

      // Increment request counter
      setRequestCount((prev) => prev + 1);
    } catch (err) {
      setResponse("Error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-6 bg-gray-900 text-white rounded-2xl shadow-xl border border-gray-700 mt-10 relative">
      {/* Request Counter */}
      <div className="absolute top-4 right-4 bg-gray-800 px-3 py-1 rounded-full text-sm text-gray-200 font-semibold border border-gray-700">
        Requests: {requestCount}
      </div>

      <h1 className="text-2xl font-bold text-center">API Tester</h1>

      {/* URL */}
      <div className="space-y-2">
        <label className="text-sm">API URL</label>
        <input
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com/api"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      {/* Method + Body */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Method</label>
          <select
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl"
            value={method}
            onChange={(e) => setMethod(e.target.value)}
          >
            <option>GET</option>
            <option>POST</option>
            <option>PUT</option>
            <option>PATCH</option>
            <option>DELETE</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm">Body (JSON)</label>
          <textarea
            className="w-full p-3 bg-gray-800 border border-gray-700 rounded-xl h-32"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      {/* Send Button */}
      <button
        className="w-full bg-blue-600 p-3 rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2"
        onClick={sendRequest}
        disabled={loading}
      >
        {loading ? (
          <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
        ) : (
          "Send Request"
        )}
      </button>

      {/* Response */}
      <div className="space-y-2">
        <label className="text-sm">Response</label>
        <pre className="bg-black p-4 rounded-xl text-green-400 text-sm overflow-auto h-64 border border-gray-700 whitespace-pre-wrap">
          {response || "Waiting..."}
        </pre>
      </div>

      {/* Auto Caller */}
      <div className="space-y-3 bg-gray-800 p-4 rounded-xl border border-gray-700">
        <label className="text-sm font-medium">Auto Call Every (seconds)</label>

        <input
          type="number"
          min="1"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-xl"
          placeholder="e.g., 5"
          value={interval}
          onChange={(e) => setIntervalValue(e.target.value)}
        />

        <button
          className="w-full bg-purple-600 p-3 rounded-xl hover:bg-purple-700 transition"
          onClick={toggleAutoCall}
        >
          {auto ? "Stop Auto Call" : "Start Auto Call"}
        </button>
      </div>
    </div>
  );
}
