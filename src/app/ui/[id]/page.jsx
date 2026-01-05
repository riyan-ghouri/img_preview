// app/ui/[id]/page.js
export default async function Page({ params }) {
  const { id } = params;

  try {
    // Call your API route that returns the HTML
    const res = await fetch(`http://localhost:3000/api/ai/dataset/${id}`, {
      cache: "no-store", // always fetch fresh content
    });

    if (!res.ok) {
      return <div>Website not found</div>;
    }

    const html = await res.text(); // <- important: use .text() to get HTML

    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  } catch (err) {
    console.error(err);
    return <div>Error loading website</div>;
  }
}
