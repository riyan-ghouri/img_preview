"use client"; // must be first line

export default function DownloadButton({ shortId }) {
  const handleDownload = async () => {
    const res = await fetch(`/api/download/${shortId}`);
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `image-${shortId}.png`;
    a.click();

    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleDownload}
      style={{
        padding: "10px 20px",
        backgroundColor: "#1a73e8",
        color: "white",
        borderRadius: 6,
        fontWeight: "bold",
        border: "none",
        cursor: "pointer",
      }}
    >
      Download
    </button>
  );
}
