// SERVER COMPONENT
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ImageWithDownload from "./ImageWithDownload"; // client component
import ImageLoader from "@/app/components/ImageLoader";

// fetch from API
async function getImage(shortId) {
  const res = await fetch(`https://img-previews.vercel.app/api/${shortId}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

export async function generateMetadata({ params }) {
  const { shortId } = await params;
  const img = await getImage(shortId);
  if (!img) return { title: "Image Not Found" };

  const transformedUrl = img.url; // full Cloudinary URL

  return {
    title: `.`,
    icons: [
      { rel: "icon", url: transformedUrl, type: "image/png" }, // regular favicon
      { rel: "apple-touch-icon", url: transformedUrl },        // apple icon
    ],
    openGraph: {
      images: [transformedUrl],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      images: [transformedUrl],
    },
  };
}



export default async function Page({ params }) {
  const { shortId } = await params;
  const img = await getImage(shortId);
  if (!img) return notFound();

  const transformedUrl = img.url

  return (
    <Suspense fallback={<ImageLoader />}>
      <ImageWithDownload url={transformedUrl} shortId={shortId} />
    </Suspense>
  );
}
