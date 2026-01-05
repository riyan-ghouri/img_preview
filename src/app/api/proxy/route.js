export async function POST(req) {
  try {
    const { url, method, body, headers = {} } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: "URL is required." }),
        { status: 400 }
      );
    }

    // Build request options
    const options = {
      method: method || "GET",
      headers: {
        ...headers,
      },
    };

    // If body exists and method allows body
    const methodsWithBody = ["POST", "PUT", "PATCH", "DELETE"];
    if (methodsWithBody.includes(method)) {
      options.body = JSON.stringify(body ?? {});
      options.headers["Content-Type"] =
        headers["Content-Type"] || "application/json";
    }

    // Actual request to external API
    const res = await fetch(url, options);

    const responseText = await res.text();

    // Detect "Method Not Allowed"
    if (res.status === 405) {
      return new Response(
        JSON.stringify({
          error: "Method Not Allowed",
          message: `The API does not support the '${method}' method.`,
          allowed: res.headers.get("Allow") || "Not provided",
        }),
        {
          status: 405,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Try JSON parse, fallback to text
    const contentType =
      res.headers.get("Content-Type") || "application/json";

    return new Response(responseText, {
      status: res.status,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": contentType,
      },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Proxy Error",
        message: err.message,
      }),
      {
        status: 500,
        headers: { "Access-Control-Allow-Origin": "*" },
      }
    );
  }
}

export function OPTIONS() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
