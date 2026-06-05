# Tauri Desktop App

**Framework**: Tauri v2  
**Source**: `src-tauri/`

---

## Prerequisites

| OS | Requirements |
|----|-------------|
| All | Node.js 18+, Rust 1.77.2+ |
| macOS | Xcode Command Line Tools (`xcode-select --install`) |
| Windows | Visual Studio Build Tools (C++ desktop workload), WebView2 (included in Windows 10+) |

---

## Commands

```bash
# Development: Vite HMR + native window
npm run tauri:dev

# Production: installer for current OS
npm run tauri:build
```

> **Cross-compilation is not supported.** Build macOS `.dmg` on macOS; Windows `.exe`/`.msi` on Windows.

---

## Build Output

| OS | Output Path | Format |
|----|-------------|--------|
| macOS | `src-tauri/target/release/bundle/dmg/` | `.app`, `.dmg` |
| Windows | `src-tauri/target/release/bundle/nsis/` | `.exe` (NSIS installer) |
| Windows | `src-tauri/target/release/bundle/msi/` | `.msi` |

---

## Architecture

```text
React SPA (WebView)
        ↓
  yahooFetch()
  [detects window.__TAURI__]
        ↓
  tauri-plugin-http
        ↓
  Yahoo Finance API (direct, bypasses CORS)
```

The Tauri runtime replaces the Vite/Vercel proxy with direct HTTP access.  
Detection: `yahooFetch()` checks `window.__TAURI__` to select the Tauri code path.

---

## Key Files

| File | Description |
|------|-------------|
| `tauri.conf.json` | App config (name, bundle ID, version, window size, permissions) |
| `Cargo.toml` | Rust dependencies (`tauri`, `tauri-plugin-http`, `tauri-plugin-log`) |
| `capabilities/default.json` | Allowed HTTP domains for outbound requests |
| `src/main.rs` | Rust entry point |
| `src/lib.rs` | Plugin registration (http, log) |

---

## Capabilities

HTTP requests from the Tauri WebView are restricted to explicitly allowed domains defined in `capabilities/default.json`.  
Any new external domain used by the app must be added here.

---

## Functional Parity with Web

The desktop app is functionally identical to the Vercel web deployment:

- All data still stored in WebView `localStorage`
- Google Drive backup is supported via OAuth in the WebView
- Language and currency settings behave identically
- All 6 quantitative analyzers and 20 guru prompts available
