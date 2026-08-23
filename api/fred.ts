// Vercel Edge Runtime — FRED (Federal Reserve Economic Data) 프록시
// FRED fredgraph.csv 엔드포인트는 CORS 헤더를 제공하지 않아 브라우저 직접 접근 불가
// 이 프록시를 통해 CSV를 가져옵니다.
//
// 사용 예: GET /api/fred?id=WILL5000INDFC
export const config = { runtime: "edge" };

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const ALLOWED_SERIES = new Set(["WILL5000INDFC", "GDP"]);
const SERIES_ID_REGEX = /^[A-Z0-9_]{3,30}$/;

export default async function handler(request: Request) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (request.method !== "GET") {
    return new Response(
      JSON.stringify({ ok: false, error: "Method Not Allowed" }),
      {
        status: 405,
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "application/json",
          Allow: "GET, OPTIONS",
        },
      },
    );
  }

  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim() ?? "";

  // 형식 및 허용된 시리즈 ID 검증 (Zero-Trust)
  if (!SERIES_ID_REGEX.test(id) || !ALLOWED_SERIES.has(id)) {
    return new Response(
      JSON.stringify({ ok: false, error: `Series '${id}' not allowed or invalid` }),
      { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
    );
  }

  // 1년 전 날짜를 cosd(cut-off start date)로 지정해 최소한의 데이터만 수신
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  const cosd = oneYearAgo.toISOString().slice(0, 10); // YYYY-MM-DD

  const fredUrl = `https://fred.stlouisfed.org/graph/fredgraph.csv?id=${encodeURIComponent(id)}&cosd=${cosd}`;

  try {
    const res = await fetch(fredUrl, {
      headers: { "User-Agent": "portfolio-bridge/1.0" },
      signal: AbortSignal.timeout(10_000),
    });

    if (!res.ok) {
      return new Response(
        JSON.stringify({ ok: false, error: `FRED responded with ${res.status}` }),
        { status: res.status, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } },
      );
    }

    const text = await res.text();
    return new Response(text, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "text/csv; charset=utf-8",
        // 거시 경제 데이터: 1일 엣지 캐시 + 12시간 백그라운드 갱신
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200",
      },
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === "TimeoutError";
    console.error(`[FRED Error] Failed to fetch series ${id}:`, err);
    return new Response(
      JSON.stringify({
        ok: false,
        error: isTimeout ? "FRED API request timed out" : "FRED API proxy failed",
      }),
      {
        status: isTimeout ? 504 : 502,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      },
    );
  }
}
