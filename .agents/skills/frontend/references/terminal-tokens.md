# Bloomberg Terminal Design Tokens & Signage

Portfolio Bridge 프론트엔드 UI를 위한 블룸버그 단말기 시그니처 토큰 및 사이니지 규격서입니다.

---

## 1. Color Palette (Terminal Telemetry)

| 용도 | Tailwind CSS v4 토큰 | 용례 |
| :--- | :--- | :--- |
| **Canvas Background** | `bg-black`, `bg-zinc-950` | 최상위 캔버스 및 카드 배경 |
| **Hairline Border** | `border-zinc-850`, `border-border` | 컴포넌트 간 1px 하이퍼라인 분할선 |
| **Primary Amber** | `text-amber-400`, `border-amber-500/30`, `bg-amber-500/10` | 시스템 프롬프트, 경고, 활성 탭 하이라이트 |
| **Terminal Emerald** | `text-emerald-400`, `border-emerald-500/30`, `bg-emerald-500/10` | 플러스 수익률, 안정 상태, 텔레메트리 정상 지표 |
| **Terminal Rose** | `text-rose-400`, `border-rose-500/30`, `bg-rose-500/10` | 마이너스 손실, 위험 상태, 임계치 초과 |
| **Terminal Cyan** | `text-cyan-400`, `border-cyan-500/30`, `bg-cyan-500/10` | 퀀트 분석, 헤지펀드 지표, 델타 메트릭 |
| **Muted Text** | `text-zinc-500`, `text-zinc-400` | 보조 라벨, 단위 표시, 비활성 요소 |

> [!CAUTION]
> `violet-*`, `purple-*`, `indigo-*` 및 그라디언트는 안티-AI-슬롭 원칙에 따라 프로젝트 전역에서 엄격히 금지됩니다.

---

## 2. Typography & Micro Tokens

- **Font Family**:
  - 기본 텍스트: `font-sans` (`Inter`)
  - 티커 심볼, 가격, 수치, 퍼센트, 날짜: `font-mono` (`Fira Code`)
- **Tabular Numbers**: 모든 수치 데이터에 `tabular-nums` 적용 필수.
- **Micro Typography**:
  - 초소형 라벨: `text-2xs font-bold uppercase tracking-wider text-zinc-500`
  - 초고밀도 인디케이터: `text-3xs`
  - 표준 카드 헤더: `text-xs font-semibold tracking-tight text-zinc-300`

---

## 3. Terminal Signage & Brackets

- **버튼 및 배지 감싸기**: `[ SUBMIT ]`, `[ LIVE ]`, `[ 01 ]`, `[ OK ]`
- **시스템 프롬프트 사이니지**: `> READY`, `> EVALUATING`, `> ERROR`
- **상태 인디케이터**: `● LIVE`, `○ IDLE`, `▲ +2.45%`, `▼ -1.12%`
- **모서리(Radius)**: 전역 `rounded-none` 원칙 (라운딩 배제). 초소형 인풋/태그에 한해 `rounded-sm` 허용.

