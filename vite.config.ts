import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const YAHOO_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * Yahoo Finance 프록시 플러그인 (US)
 *
 * - Yahoo US: query1.finance.yahoo.com API (cookie + crumb 인증 포함)
 *
 * Yahoo Finance v8 API는 cookie + crumb 인증이 필요합니다.
 * dev server 수명 동안 crumb을 캐시하고, 만료(401/403) 또는 rate limit(429) 시 자동 재시도합니다.
 */
function yahooProxy(): Plugin {
  // ── Crumb 캐시 (dev server 수명 동안 유지) ────────────────────
  let crumb = "";
  let cookie = "";
  let crumbTs = 0;
  const CRUMB_TTL = 25 * 60_000; // 25 min

  async function ensureCrumb(force = false) {
    if (!force && crumb && cookie && Date.now() - crumbTs < CRUMB_TTL) return;

    // 1) Yahoo 쿠키 획득 (fc.yahoo.com → finance.yahoo.com 순으로 시도)
    let parts: string[] = [];
    for (const cookieUrl of [
      "https://fc.yahoo.com/",
      "https://finance.yahoo.com/",
    ]) {
      try {
        const r = await fetch(cookieUrl, {
          redirect: "manual",
          headers: { "User-Agent": YAHOO_UA },
        });
        if (typeof r.headers.getSetCookie === "function") {
          for (const sc of r.headers.getSetCookie()) {
            parts.push(sc.split(";")[0]);
          }
        }
        if (parts.length > 0) break;
      } catch {
        /* try next */
      }
    }
    cookie = parts.join("; ");

    // 2) Crumb 토큰 발급 (query2 → query1 순으로 시도, 429 시 대기 후 재시도)
    let lastErr = "";
    for (const crumbHost of [
      "https://query2.finance.yahoo.com/v1/test/getcrumb",
      "https://query1.finance.yahoo.com/v1/test/getcrumb",
    ]) {
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const r2 = await fetch(crumbHost, {
            headers: { "User-Agent": YAHOO_UA, Cookie: cookie },
          });
          if (r2.status === 429) {
            // rate limited: 지수 백오프 (2s, 4s, 8s)
            await new Promise((resolve) =>
              setTimeout(resolve, 2000 * 2 ** attempt),
            );
            continue;
          }
          if (!r2.ok) {
            lastErr = `crumb ${r2.status}`;
            break;
          }
          crumb = (await r2.text()).trim();
          crumbTs = Date.now();
          return;
        } catch (e) {
          lastErr = String(e);
        }
      }
    }
    throw new Error(`crumb 획득 실패: ${lastErr}`);
  }

  return {
    name: "yahoo-proxy",
    configureServer(server) {
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

          // 429 → 2초 대기 후 재시도
          if (response.status === 429) {
            await new Promise((resolve) => setTimeout(resolve, 2000));
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
