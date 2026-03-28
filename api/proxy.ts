// Vercel Edge Runtime — Yahoo Finance 프록시
// catch-all 파일명([...path])이 Vite 프리셋에서 작동하지 않아
// 일반 파일명 + vercel.json rewrites 조합으로 라우팅합니다.
export const config = { runtime: "edge" };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

// ─── Module-level crumb / cookie cache (serverless warm instance 동안 유지) ───

let _crumb = "";
let _cookie = "";
let _crumbTs = 0;
const CRUMB_TTL = 5 * 60_000; // 5 min

async function getCrumb(
  force = false,
): Promise<{ crumb: string; cookie: string }> {
  if (!force && _crumb && _cookie && Date.now() - _crumbTs < CRUMB_TTL) {
    return { crumb: _crumb, cookie: _cookie };
  }

  const r1 = await fetch("https://fc.yahoo.com/", {
    redirect: "manual",
    headers: { "User-Agent": UA },
  });
  const parts: string[] = [];
  const raw = r1.headers.get("set-cookie") ?? "";
  for (const piece of raw.split(/,(?=[^ ])/)) {
    const name = piece.trim().split(";")[0];
    if (name) parts.push(name);
  }
  const cookie = parts.join("; ");

  let crumb = "";
  for (let attempt = 0; attempt < 3; attempt++) {
    const r2 = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
      headers: { "User-Agent": UA, Cookie: cookie },
    });
    if (r2.status === 429) {
      await new Promise((resolve) => setTimeout(resolve, 2000 * (attempt + 1)));
      continue;
    }
    if (!r2.ok) throw new Error(`crumb fetch failed: ${r2.status}`);
    crumb = (await r2.text()).trim();
    break;
  }
  if (!crumb) throw new Error("crumb fetch failed: all attempts got 429");

  _crumb = crumb;
  _cookie = cookie;
  _crumbTs = Date.now();
  return { crumb, cookie };
}

// ─── CORS 헤더 ────────────────────────────────────────────────────────────────

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Yahoo Finance 프록시 핸들러
 *
 * vercel.json rewrite:
 *   /api/yahoo/:path* → /api/proxy?__path=:path*
 *
 * `__path` 쿼리 파라미터에서 Yahoo API 경로를 추출합니다.
 */
export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);

  // rewrite를 통해 전달된 Yahoo API 경로
  const yahooPath = url.searchParams.get("__path") ?? "";
  if (!yahooPath) {
    return new Response(
      JSON.stringify({ error: "Missing __path parameter" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // ⚠️ URLSearchParams.toString()은 쉼표(,)를 %2C로 재인코딩합니다.
  // 원본 URL에서 __path= 부분만 제거하여 쉼표를 보존합니다.
  const originalSearch = url.search
    .replace(/[?&]__path=[^&]*/, "")
    .replace(/^&/, "?");

  const doFetch = async (forceNewCrumb: boolean) => {
    const { crumb, cookie } = await getCrumb(forceNewCrumb);
    const sep = originalSearch ? "&" : "?";
    const targetUrl = `https://query1.finance.yahoo.com/${yahooPath}${originalSearch}${sep}crumb=${encodeURIComponent(crumb)}`;

    const init: RequestInit = {
      method: request.method,
      headers: { "User-Agent": UA, Cookie: cookie } as Record<string, string>,
    };

    if (request.method === "POST" && request.body) {
      init.body = request.body;
      const ct = request.headers.get("content-type");
      if (ct) (init.headers as Record<string, string>)["Content-Type"] = ct;
    }

    return fetch(targetUrl, init);
  };

  try {
    let response = await doFetch(false);

    if (response.status === 401 || response.status === 403) {
      response = await doFetch(true);
    }

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
        error: "Yahoo Finance proxy failed",
        detail: String(err),
      }),
      {
        status: 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
}
