import type { VercelRequest, VercelResponse } from "@vercel/node";

/**
 * Vercel Serverless Function — Yahoo Finance Japan 프록시
 * /api/yahoo-jp/* → https://finance.yahoo.co.jp/*
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // catch-all path 조합
  const pathSegments = req.query.path;
  const pathStr = Array.isArray(pathSegments)
    ? pathSegments.join("/")
    : (pathSegments ?? "");

  // 쿼리스트링 재조립 (path 제외)
  const qs = new URLSearchParams();
  for (const [key, val] of Object.entries(req.query)) {
    if (key === "path") continue;
    if (Array.isArray(val)) val.forEach((v) => qs.append(key, v));
    else if (val) qs.append(key, val);
  }
  const query = qs.toString();
  const targetUrl = `https://finance.yahoo.co.jp/${pathStr}${query ? `?${query}` : ""}`;

  try {
    const response = await fetch(targetUrl, {
      method: req.method ?? "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "Accept-Language": "ja-JP,ja;q=0.9",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    // CORS 헤더
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

    const contentType = response.headers.get("content-type");
    if (contentType) res.setHeader("Content-Type", contentType);

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (err) {
    res.status(502).json({
      error: "Yahoo JP proxy failed",
      detail: String(err),
    });
  }
}
