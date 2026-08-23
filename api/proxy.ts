// Vercel Edge Runtime — Yahoo Finance 프록시
// catch-all 파일명([...path])이 Vite 프리셋에서 작동하지 않아
// 일반 파일명 + vercel.json rewrites 조합으로 라우팅합니다.
export const config = { runtime: "edge" };

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

const TIMEOUT_MS = 10_000;

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
    signal: AbortSignal.timeout(TIMEOUT_MS),
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
      signal: AbortSignal.timeout(TIMEOUT_MS),
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

  if (request.method !== "GET" && request.method !== "POST") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method Not Allowed" }),
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
          Allow: "GET, POST, OPTIONS",
        },
      },
    );
  }

  const url = new URL(request.url);

  // rewrite를 통해 전달된 Yahoo API 경로
  const yahooPath = url.searchParams.get("__path")?.trim() ?? "";
  if (!yahooPath) {
    return new Response(
      JSON.stringify({ ok: false, error: "Missing __path parameter" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // 보안: Path Traversal 및 비정상 문자열 검증
  const SAFE_PATH_REGEX = /^[a-zA-Z0-9/_.-]+$/;
  if (
    !SAFE_PATH_REGEX.test(yahooPath) ||
    yahooPath.includes("..") ||
    yahooPath.includes("//")
  ) {
    console.error(`[Proxy Error] Suspicious path detected: ${yahooPath}`);
    return new Response(
      JSON.stringify({ ok: false, error: "Invalid path parameter" }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // 허용된 Yahoo Finance API 네임스페이스 검증
  const ALLOWED_PATH_PREFIXES = /^(v[0-9]+|ws)\/finance\//i;
  if (!ALLOWED_PATH_PREFIXES.test(yahooPath)) {
    console.error(`[Proxy Error] Unrecognized endpoint prefix: ${yahooPath}`);
    return new Response(
      JSON.stringify({ ok: false, error: "Endpoint prefix not allowed" }),
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
      signal: AbortSignal.timeout(TIMEOUT_MS),
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

    // 200 OK GET 응답에 대해 엔드포인트별 스마트 엣지 캐시 적용 (Yahoo 429 레이트리밋 방어 및 응답속도 향상)
    if (request.method === "GET" && response.status === 200) {
      if (yahooPath.includes("/chart/")) {
        // 과거 차트/시계열 데이터: 5분 엣지 캐시 + 10분 백그라운드 갱신
        headers.set("Cache-Control", "public, s-maxage=300, stale-while-revalidate=600");
      } else if (yahooPath.includes("/quoteSummary/") || yahooPath.includes("/search")) {
        // 재무제표 / 티커 검색: 1분 엣지 캐시 + 2분 백그라운드 갱신
        headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
      } else {
        // 실시간 시세: 15초 엣지 캐시 + 30초 백그라운드 갱신
        headers.set("Cache-Control", "public, s-maxage=15, stale-while-revalidate=30");
      }
    }

    return new Response(await response.text(), {
      status: response.status,
      headers,
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error("[Yahoo Proxy Error]", err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: isTimeout ? "Yahoo Finance request timed out" : "Yahoo Finance proxy failed",
      }),
      {
        status: isTimeout ? 504 : 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
}
