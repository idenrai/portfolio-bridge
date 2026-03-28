// Vercel Edge Runtime — Web Standard Request/Response API 사용
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

  // 1) Yahoo 쿠키 획득
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

  // 2) Crumb 토큰 발급 (429 시 재시도)
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
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

/**
 * Vercel Serverless Function — Yahoo Finance US 프록시
 * /api/yahoo/* → https://query1.finance.yahoo.com/*
 *
 * Yahoo Finance v8 API는 cookie + crumb 인증이 필요합니다.
 * 모듈 레벨에서 crumb을 캐시하고, 만료 시 자동 갱신합니다.
 */
export default async function handler(request: Request) {
  // CORS preflight
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);

  // catch-all path: /api/yahoo/v8/finance/chart/AAPL → v8/finance/chart/AAPL
  const pathStr = url.pathname.replace(/^\/api\/yahoo\/?/, "");

  // ⚠️ url.search 를 그대로 유지해야 쉼표(,)가 %2C로 재인코딩되지 않음
  // URLSearchParams.toString()은 , → %2C 변환 버그가 있음
  const originalSearch = url.search; // "?modules=a,b,c" 형태

  const doFetch = async (forceNewCrumb: boolean) => {
    const { crumb, cookie } = await getCrumb(forceNewCrumb);
    const sep = originalSearch ? "&" : "?";
    const targetUrl = `https://query1.finance.yahoo.com/${pathStr}${originalSearch}${sep}crumb=${encodeURIComponent(crumb)}`;

    return fetch(targetUrl, {
      method: request.method,
      headers: { "User-Agent": UA, Cookie: cookie },
    });
  };

  try {
    let response = await doFetch(false);

    // 401/403 → crumb 만료, 새 crumb으로 재시도
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
