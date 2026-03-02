const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Vercel Serverless Function — Yahoo Finance Japan 프록시
 * /api/yahoo-jp/* → https://finance.yahoo.co.jp/*
 */
export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);

  // catch-all path: /api/yahoo-jp/search/?query=... → /search/?query=...
  const pathStr = url.pathname.replace(/^\/api\/yahoo-jp\/?/, "");
  const query = url.search;
  const targetUrl = `https://finance.yahoo.co.jp/${pathStr}${query}`;

  try {
    const response = await fetch(targetUrl, {
      method: request.method,
      headers: {
        "User-Agent": UA,
        "Accept-Language": "ja-JP,ja;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const headers = new Headers(CORS_HEADERS);
    const contentType = response.headers.get("content-type");
    if (contentType) headers.set("Content-Type", contentType);

    return new Response(await response.text(), {
      status: response.status,
      headers,
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: "Yahoo JP proxy failed",
        detail: String(err),
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
}
