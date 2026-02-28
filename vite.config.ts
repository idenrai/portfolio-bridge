import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

/**
 * Yahoo Finance Japan 프록시 플러그인
 * http-proxy가 아닌 Node.js 네이티브 fetch를 사용하여 Yahoo CDN 호환성 확보
 */
function yahooJpProxy(): Plugin {
  return {
    name: "yahoo-jp-proxy",
    configureServer(server) {
      server.middlewares.use("/api/yahoo-jp", async (req, res) => {
        const targetPath = req.url ?? "/";
        const targetUrl = `https://finance.yahoo.co.jp${targetPath}`;
        try {
          const response = await fetch(targetUrl, {
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
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
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), yahooJpProxy()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      // Yahoo Finance API (CORS 우회 — 개발 전용)
      "/api/yahoo": {
        target: "https://query1.finance.yahoo.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/yahoo/, ""),
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        },
      },
    },
  },
});
