import { Card } from "@/components/common";
import { useT } from "@/hooks";
import { useBuffettIndicator } from "@/hooks";

// ─── 평가 구간 정의 ───────────────────────────────────────────────────────────

interface Zone {
  labelKey:
    | "buffett_indicator_status_deep_under"
    | "buffett_indicator_status_under"
    | "buffett_indicator_status_fair"
    | "buffett_indicator_status_over"
    | "buffett_indicator_status_deep_over";
  color: string;
  bgColor: string;
  borderColor: string;
  gaugeColor: string;
  /** 해당 구간의 상한 (%) — 마지막은 Infinity */
  max: number;
}

const ZONES: Zone[] = [
  {
    labelKey: "buffett_indicator_status_deep_under",
    color: "text-sky-700",
    bgColor: "bg-sky-50",
    borderColor: "border-sky-300",
    gaugeColor: "bg-sky-500",
    max: 80,
  },
  {
    labelKey: "buffett_indicator_status_under",
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-300",
    gaugeColor: "bg-emerald-500",
    max: 100,
  },
  {
    labelKey: "buffett_indicator_status_fair",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    gaugeColor: "bg-amber-400",
    max: 130,
  },
  {
    labelKey: "buffett_indicator_status_over",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-300",
    gaugeColor: "bg-orange-500",
    max: 165,
  },
  {
    labelKey: "buffett_indicator_status_deep_over",
    color: "text-red-700",
    bgColor: "bg-red-50",
    borderColor: "border-red-300",
    gaugeColor: "bg-red-500",
    max: Infinity,
  },
];

function getZone(ratio: number): Zone {
  return ZONES.find((z) => ratio < z.max) ?? ZONES[ZONES.length - 1];
}

/** 게이지 바 너비 계산 (0~100%) — 200%를 MAX로 클램핑 */
function gaugeWidth(ratio: number): number {
  return Math.min((ratio / 200) * 100, 100);
}

function formatTrillions(value: number, lang: string): string {
  const locale = lang === "ko" ? "ko-KR" : lang === "ja" ? "ja-JP" : "en-US";
  return (
    new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
      minimumFractionDigits: 1,
    }).format(value) + "T"
  );
}

// ─── 게이지 마커 (주요 임계값 표시) ─────────────────────────────────────────

const MARKERS = [
  { value: 80, label: "80%" },
  { value: 100, label: "100%" },
  { value: 130, label: "130%" },
  { value: 165, label: "165%" },
];

// ─── 컴포넌트 ─────────────────────────────────────────────────────────────────

export function BuffettIndicatorCard() {
  const t = useT();
  const { ratio, gdpTrillions, marketCapTrillions, year, loading, error } =
    useBuffettIndicator();

  return (
    <Card title={t.buffett_indicator_title}>
      {loading ? (
        <p className="text-sm text-slate-500 py-4 text-center animate-pulse">
          {t.buffett_indicator_loading}
        </p>
      ) : error ? (
        <p className="text-sm text-red-500 py-4 text-center">
          {t.buffett_indicator_error}
        </p>
      ) : (
        <div className="space-y-5">
          {/* 상태 뱃지 + 비율 */}
          {(() => {
            const zone = getZone(ratio);
            return (
              <div
                className={`flex items-center justify-between rounded-xl border px-4 py-3 ${zone.bgColor} ${zone.borderColor}`}
              >
                <div>
                  <p className="text-xs text-slate-500 mb-0.5">
                    {t.buffett_indicator_ratio_label}
                  </p>
                  <p className={`text-3xl font-bold tabular-nums ${zone.color}`}>
                    {ratio.toFixed(1)}%
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${zone.bgColor} ${zone.color} border ${zone.borderColor}`}
                >
                  {t[zone.labelKey]}
                </span>
              </div>
            );
          })()}

          {/* 게이지 바 */}
          <div className="space-y-1">
            <div className="relative h-4 rounded-full bg-slate-100 overflow-hidden">
              {/* 구간 색상 배경 */}
              <div className="absolute inset-0 flex">
                <div className="h-full bg-sky-200" style={{ width: "40%" }} />
                <div className="h-full bg-emerald-200" style={{ width: "10%" }} />
                <div className="h-full bg-amber-200" style={{ width: "15%" }} />
                <div className="h-full bg-orange-200" style={{ width: "17.5%" }} />
                <div className="h-full bg-red-200" style={{ width: "17.5%" }} />
              </div>
              {/* 현재값 포인터 */}
              <div
                className="absolute top-0 h-full w-1 -translate-x-0.5 bg-slate-700 rounded-full shadow"
                style={{ left: `${gaugeWidth(ratio)}%` }}
              />
            </div>
            {/* 마커 레이블 */}
            <div className="relative h-4">
              {MARKERS.map((m) => (
                <span
                  key={m.value}
                  className="absolute text-[10px] text-slate-400 -translate-x-1/2"
                  style={{ left: `${(m.value / 200) * 100}%` }}
                >
                  {m.label}
                </span>
              ))}
            </div>
          </div>

          {/* 세부 수치 */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[11px] text-slate-500 mb-0.5">
                {t.buffett_indicator_market_cap} (USD)
              </p>
              <p className="text-sm font-semibold text-slate-700 tabular-nums">
                ${formatTrillions(marketCapTrillions, "en")}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[11px] text-slate-500 mb-0.5">
                {t.buffett_indicator_gdp} (USD)
              </p>
              <p className="text-sm font-semibold text-slate-700 tabular-nums">
                ${formatTrillions(gdpTrillions, "en")}
              </p>
            </div>
            <div className="rounded-lg bg-slate-50 px-3 py-2">
              <p className="text-[11px] text-slate-500 mb-0.5">
                {t.buffett_indicator_year}
              </p>
              <p className="text-sm font-semibold text-slate-700">{year}</p>
            </div>
          </div>

          {/* 설명 */}
          <p className="text-xs text-slate-500 leading-relaxed">
            {t.buffett_indicator_desc}
          </p>

          {/* 출처 */}
          <p className="text-[11px] text-slate-400 text-right">
            {t.buffett_indicator_source}
          </p>
        </div>
      )}
    </Card>
  );
}
