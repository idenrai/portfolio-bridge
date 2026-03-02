import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const YAHOO_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Yahoo Finance 통합 프록시 플러그인 (US + JP)
 *

 * - Yahoo US: query1.finance.yahoo.com API (cookie + crumb 인증 포함)
 *
 * Yahoo Finance v8 API는 cookie + crumb 인증이 필요합니다.
 * dev server 수명 동안 crumb을 캐시하고, 만료(401/403) 시 자동 갱신합니다.
 */
function yahooProxy(): Plugin {
  // ── Crumb 캐시 (dev server 수명 동안 유지) ────────────────────
  let crumb = "";
  let cookie = "";
  let crumbTs = 0;
  const CRUMB_TTL = 5 * 60_000; // 5 min

  async function ensureCrumb(force = false) {
    if (!force && crumb && cookie && Date.now() - crumbTs < CRUMB_TTL) return;

    // 1) Yahoo 쿠키 획득
    const r1 = await fetch("https://fc.yahoo.com/", {
      redirect: "manual",
      headers: { "User-Agent": YAHOO_UA },
    });
    const parts: string[] = [];
    if (typeof r1.headers.getSetCookie === "function") {
      for (const sc of r1.headers.getSetCookie()) {
        parts.push(sc.split(";")[0]);
      }
    }
    cookie = parts.join("; ");

    // 2) Crumb 토큰 발급
    const r2 = await fetch(
      "https://query2.finance.yahoo.com/v1/test/getcrumb",
      { headers: { "User-Agent": YAHOO_UA, Cookie: cookie } },
    );
    if (!r2.ok) throw new Error(`crumb ${r2.status}`);
    crumb = (await r2.text()).trim();
    crumbTs = Date.now();
  }

  return {
    name: "yahoo-proxy",
    configureServer(server) {
      // ── Yahoo JP (더 구체적인 경로 → 먼저 등록) ────────────────
      server.middlewares.use("/api/yahoo-jp", async (req, res) => {
        const targetPath = req.url ?? "/";
        const targetUrl = `https://finance.yahoo.co.jp${targetPath}`;
        try {
          const response = await fetch(targetUrl, {
            headers: {
              "User-Agent": YAHOO_UA,
              "Accept-Language": "ja-JP,ja;q=0.9",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
          });
          res.statusCode = response.status;
          const contentType = response.headers.get("content-type");
          if (contentType) res.setHeader("Content-Type", contentType);
          const body = await response.text();
          res.end(body);
        } catch (err) {
          res.statusCode = 502;
          res.end(
            JSON.stringify({
              error: "Yahoo JP fetch failed",
              detail: String(err),
            }),
          );
        }
      });

      // ── Yahoo US (cookie + crumb 인증) ──────────────────────
      server.middlewares.use("/api/yahoo", async (req, res) => {
        const targetPath = req.url ?? "/";
        try {
          await ensureCrumb();
          const url = new URL(`https://query1.finance.yahoo.com${targetPath}`);
          url.searchParams.set("crumb", crumb);

          let response = await fetch(url.toString(), {
            headers: { "User-Agent": YAHOO_UA, Cookie: cookie },
          });

          // 401/403 → crumb 만료, 새 crumb으로 재시도
          if (response.status === 401 || response.status === 403) {
            await ensureCrumb(true);
            url.searchParams.set("crumb", crumb);
            response = await fetch(url.toString(), {
              headers: { "User-Agent": YAHOO_UA, Cookie: cookie },
            });
          }

          res.statusCode = response.status;
          const contentType = response.headers.get("content-type");
          if (contentType) res.setHeader("Content-Type", contentType);
          res.end(await response.text());
        } catch (err) {
          res.statusCode = 502;
          res.end(
            JSON.stringify({
              error: "Yahoo US proxy failed",
              detail: String(err),
            }),
          );
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), yahooProxy()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
