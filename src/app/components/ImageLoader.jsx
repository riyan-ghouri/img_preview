"use client";

export default function ImageLoader() {
  return (
    <div style={{ padding: 40, textAlign: "center", minHeight: "60vh" }}>
      <div
        style={{
          width: 80,
          height: 80,
          border: "8px solid #ccc",
          borderTop: "8px solid #1d4ed8",
          borderRadius: "50%",
          margin: "auto",
          animation: "spin 1s linear infinite",
        }}
      />
      <p>Loading image...</p>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
