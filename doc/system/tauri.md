# Tauri Desktop App

Tauri v2 기반 데스크톱 앱입니다.

| Item | Value |
| --- | --- |
| Framework | Tauri v2 |
| Source | `src-tauri/` |

## Prerequisites

사전 요구 사항입니다.

| OS | Requirements |
| --- | --- |
| All / 공통 | Node.js 18+, Rust 1.77.2+ |
| macOS | Xcode Command Line Tools (`xcode-select --install`) |
| Windows | Visual Studio Build Tools (C++ desktop workload), WebView2 (included in Windows 10+) |

## Commands

```bash
# Development: Vite HMR + native window / 개발 모드: Vite HMR + 네이티브 윈도우
npm run tauri:dev

# Production: installer for current OS / 현재 OS에 맞는 인스톨러 생성
npm run tauri:build
```

> **Cross-compilation is not supported.**
> Build macOS `.dmg` on macOS; Windows `.exe` / `.msi` on Windows.
>
> **크로스 컴파일은 지원되지 않습니다.**
> macOS `.dmg`는 macOS에서, Windows `.exe` / `.msi`는 Windows에서 빌드하세요.

## Build Output

빌드 결과물 경로입니다.

| OS | Output Path | Format |
| --- | --- | --- |
| macOS | `src-tauri/target/release/bundle/dmg/` | `.app`, `.dmg` |
| Windows | `src-tauri/target/release/bundle/nsis/` | `.exe` (NSIS installer) |
| Windows | `src-tauri/target/release/bundle/msi/` | `.msi` |

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

Tauri 런타임은 Vite/Vercel 프록시를 직접 HTTP 접근으로 대체합니다.
`yahooFetch()`가 `window.__TAURI__`를 확인하여 Tauri 코드 경로를 선택합니다.

## Key Files

주요 파일 목록입니다.

| File | Description |
| --- | --- |
| `tauri.conf.json` | App config (name, bundle ID, version, window, permissions) / 앱 설정 |
| `Cargo.toml` | Rust dependencies / Rust 의존성 |
| `capabilities/default.json` | Allowed HTTP domains / 허용된 HTTP 도메인 목록 |
| `src/main.rs` | Rust entry point / Rust 진입점 |
| `src/lib.rs` | Plugin registration (http, log) / 플러그인 등록 |

## Capabilities

HTTP requests from the Tauri WebView are restricted to explicitly allowed domains
defined in `capabilities/default.json`. Any new external domain used by the app must be added here.

Tauri WebView의 HTTP 요청은 `capabilities/default.json`에 명시적으로 허용된 도메인으로만 제한됩니다.
앱에서 사용하는 새로운 외부 도메인은 반드시 이 파일에 추가해야 합니다.

## Functional Parity with Web

The desktop app is functionally identical to the Vercel web deployment.

데스크톱 앱은 Vercel 웹 배포와 기능적으로 동일합니다.

- All data still stored in WebView `localStorage`. / 모든 데이터는 WebView `localStorage`에 저장됩니다.
- Google Drive backup is supported via OAuth in the WebView. / Google Drive 백업이 WebView OAuth를 통해 지원됩니다.
- Language and currency settings behave identically. / 언어·통화 설정이 동일하게 동작합니다.
- All 6 quantitative analyzers and 20 guru prompts are available. / 6종 채점기와 20명 구루 프롬프트가 모두 사용 가능합니다.
