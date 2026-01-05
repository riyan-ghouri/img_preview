"use client";
import { useRouter } from "next/navigation";
import DownloadButton from "@/app/components/downloadBtn";

export default function ImageWithDownload({ url, shortId }) {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-900 text-white">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 flex flex-col items-center">
        {/* Image Container */}
        <div className="overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <img
            src={url}
            alt=" "
            className="w-[320px] sm:w-[480px] md:w-[580px] h-[320px] sm:h-[480px] md:h-[580px] object-cover rounded-xl transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Download Button */}
        <div className="mt-6 w-full flex justify-center gap-4">
          <DownloadButton
            shortId={shortId}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          />

          {/* Upload New Button */}
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition"
          >
            Upload New
          </button>
        </div>
      </div>
    </div>
  );
}
