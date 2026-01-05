"use client";

import { useState, useRef ,useEffect} from "react";
import QRCode from "qrcode";
import QrScanner from "qr-scanner";

export default function QRTools() {
    const [tab, setTab] = useState("make"); // make | scan
    const [text, setText] = useState("");
    const [qrDataUrl, setQrDataUrl] = useState("");
    const videoRef = useRef(null);
    const scannerRef = useRef(null);

    // Toast System (TOP + White + Green Tick)
    function showToast(msg) {
        const toast = document.createElement("div");

        toast.style.position = "fixed";
        toast.style.top = "20px";
        toast.style.left = "50%";
        toast.style.transform = "translateX(-50%)";
        toast.style.background = "#fff";
        toast.style.color = "#111";
        toast.style.padding = "14px 20px";
        toast.style.borderRadius = "12px";
        toast.style.fontSize = "15px";
        toast.style.display = "flex";
        toast.style.alignItems = "center";
        toast.style.gap = "10px";
        toast.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
        toast.style.opacity = "0";
        toast.style.transition = "opacity .3s ease-out, transform .3s ease-out";
        toast.style.zIndex = "9999";

        // ✔ Green tick icon
        const icon = document.createElement("div");
        icon.innerHTML = "✔";
        icon.style.background = "#22c55e";    // green-500
        icon.style.color = "white";
        icon.style.width = "22px";
        icon.style.height = "22px";
        icon.style.borderRadius = "50%";
        icon.style.display = "flex";
        icon.style.alignItems = "center";
        icon.style.justifyContent = "center";
        icon.style.fontSize = "14px";
        icon.style.fontWeight = "bold";

        const text = document.createElement("span");
        text.innerText = msg;

        toast.append(icon, text);
        document.body.appendChild(toast);

        // Animate In
        setTimeout(() => {
            toast.style.opacity = "1";
            toast.style.transform = "translateX(-50%) translateY(0px)";
        }, 20);

        // Animate Out
        setTimeout(() => {
            toast.style.opacity = "0";
            toast.style.transform = "translateX(-50%) translateY(-10px)";
            setTimeout(() => toast.remove(), 250);
        }, 2200);
    }



    // Generate QR
    const generateQR = async () => {
        if (!text.trim()) return showToast("Write something first 😭");

        const url = await QRCode.toDataURL(text);
        setQrDataUrl(url);
        showToast("QR Code generated!");
    };

    // Start scanning
    const startScan = async () => {
        try {
            scannerRef.current = new QrScanner(
                videoRef.current,
                (result) => {
                    navigator.clipboard.writeText(result.data);
                    showToast("Copied!");
                    stopScan();
                },
                { highlightScanRegion: true }
            );

            await scannerRef.current.start();
            showToast("Scan successful!");
        } catch (err) {
            showToast("Camera error 😭");
        }
    };
    // Auto start/stop when tab changes
    useEffect(() => {
        if (tab === "scan") {
            startScan();
        } else {
            stopScan();
        }
    }, [tab]);


    const stopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.stop();
            scannerRef.current.destroy();
            scannerRef.current = null;
        }
    };

    return (
        <div className="min-h-screen bg-white text-black p-6 flex flex-col items-center">
            <h1 className="text-4xl font-bold my-6 tracking-tight">QR Maker & Scanner</h1>

            {/* Tabs */}
            <div className="flex gap-4 mb-8 bg-gray-100 rounded-full p-2 shadow-sm">
                <button
                    onClick={() => {
                        stopScan();
                        setTab("make");
                    }}
                    className={`px-6 py-2 rounded-full transition ${tab === "make"
                        ? "bg-black text-white shadow"
                        : "text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Make QR
                </button>

                <button
                    onClick={() => {
                        setTab("scan");
                        setQrDataUrl("");
                    }}
                    className={`px-6 py-2 rounded-full transition ${tab === "scan"
                        ? "bg-black text-white shadow"
                        : "text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    Scan QR
                </button>
            </div>

            {/* MAKE QR TAB */}
            {tab === "make" && (
                <div className="w-full max-w-md bg-white border rounded-2xl shadow p-6 transition animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4">Create QR Code</h2>

                    <input
                        className="w-full p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                        placeholder="Type text for QR..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />

                    <button
                        onClick={generateQR}
                        className="w-full mt-4 bg-black text-white py-3 rounded-xl text-lg"
                    >
                        Generate QR
                    </button>

                    {qrDataUrl && (
                        <div className="mt-6 flex justify-center">
                            <img src={qrDataUrl} alt="QR Code" className="w-56 h-56" />
                        </div>
                    )}
                </div>
            )}

            {/* SCAN QR TAB */}
            {tab === "scan" && (
                <div className="w-full max-w-md border border-gray-200 rounded-2xl shadow-lg p-6 bg-white/90 backdrop-blur-sm transition animate-fadeIn">
                    <h2 className="text-xl font-semibold mb-4">Scan QR Code</h2>

                    <div className="w-full h-64 rounded-2xl overflow-hidden border border-gray-300 shadow-inner bg-gray-100">
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                        ></video>
                    </div>

                    <p className="text-center mt-4 text-gray-500 text-sm">
                        Camera is active — point a QR code to scan automatically.
                    </p>
                </div>
            )}


        </div>
    );
}
