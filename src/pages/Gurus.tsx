import { useState } from "react";
import { Card } from "@/components/common";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { usePortfolio, useT } from "@/hooks";
import { useLanguageStore, useSettingsStore } from "@/stores";
import { GURU_PROFILES, formatCurrency, buildGuruPrompt } from "@/utils";
import { calculateRebalancing } from "@/utils";
import type { GuruProfile } from "@/types";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#14b8a6",
  "#f97316",
];

export function GurusPage() {
  const { assets, summary } = usePortfolio();
  const [selectedGuru, setSelectedGuru] = useState<GuruProfile | null>(null);
  const t = useT();
  const lang = useLanguageStore((s) => s.lang);
  const baseCurrency = useSettingsStore((s) => s.baseCurrency);
  const rates = useSettingsStore((s) => s.exchangeRates);
  const [showPrompt, setShowPrompt] = useState(false);
  const [copied, setCopied] = useState(false);

  /** 언어별 구루 이름 */
  const guruName = (guru: GuruProfile) => {
    if (lang === "ko") return guru.nameKo;
    if (lang === "ja") return guru.nameJa;
    return guru.name; // en, de → 영문명
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="text-6xl mb-4">💡</p>
        <h2 className="text-xl font-semibold text-slate-600 mb-2">
          {t.guru_empty_title}
        </h2>
        <p className="text-sm">{t.guru_empty_desc}</p>
      </div>
    );
  }

  const guruRebalancing = selectedGuru
    ? calculateRebalancing(summary, selectedGuru.idealAllocation)
    : [];

  // 레이더 차트용 데이터: 내 포트폴리오 vs 선택 구루
  const radarData = selectedGuru
    ? selectedGuru.idealAllocation.map((ga) => {
        const myAlloc = summary.tagAllocation.find((t_) => t_.tag === ga.tag);
        return {
          tag: t.tag_labels[ga.tag] ?? ga.tag,
          guru: ga.targetPercent,
          mine: myAlloc ? Number(myAlloc.percent.toFixed(1)) : 0,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">{t.guru_title}</h2>

      {/* 구루 선택 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {GURU_PROFILES.map((guru) => (
          <button
            key={guru.id}
            onClick={() => setSelectedGuru(guru)}
            className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
              selectedGuru?.id === guru.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <p className="font-semibold text-slate-800 text-sm leading-tight">
              {guruName(guru)}
            </p>
            <p className="text-xs text-slate-500 mt-0.5 leading-tight">
              {guru.firm}
            </p>
          </button>
        ))}
      </div>

      {selectedGuru && (
        <>
          {/* 철학 */}
          <Card title={t.guru_philosophy_title(guruName(selectedGuru))}>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {(t[
                `guru_philosophy_${selectedGuru.id}` as keyof typeof t
              ] as string) || selectedGuru.philosophy}
            </p>
          </Card>

          {/* AI 구루 프롬프트 배너 */}
          {(() => {
            const promptText = buildGuruPrompt(
              selectedGuru,
              summary,
              assets,
              lang,
              baseCurrency,
              rates,
            );
            const copyPrompt = async () => {
              await navigator.clipboard.writeText(promptText);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            };
            return (
              <div className="rounded-xl bg-gradient-to-r from-purple-600 to-indigo-500 p-px shadow-md">
                <div className="rounded-[11px] bg-white/95 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="text-2xl flex-shrink-0 mt-0.5">🧘</span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 leading-tight">
                          {t.guru_ai_banner_title}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {t.guru_ai_banner_desc}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPrompt((v) => !v)}
                      className="flex-shrink-0 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
                    >
                      {showPrompt ? t.guru_ai_close : t.guru_ai_btn}
                    </button>
                  </div>
                  {showPrompt && (
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                      <p className="text-xs text-slate-500">{t.guru_ai_desc}</p>
                      <textarea
                        readOnly
                        value={promptText}
                        rows={12}
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-mono text-slate-700 resize-none focus:outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={copyPrompt}
                          className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                        >
                          {copied ? t.guru_ai_copied : t.guru_ai_copy}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 이상적 배분 파이 차트 */}
            <Card title={t.guru_ideal_alloc(guruName(selectedGuru))}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={selectedGuru.idealAllocation.map((a) => ({
                      name: t.tag_labels[a.tag] ?? a.tag,
                      value: a.targetPercent,
                    }))}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    nameKey="name"
                    paddingAngle={2}
                  >
                    {selectedGuru.idealAllocation.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => `${Number(v)}%`} />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* 레이더 비교 차트 */}
            <Card title={t.guru_radar_title}>
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="tag" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 60]} />
                  <Radar
                    name={guruName(selectedGuru)}
                    dataKey="guru"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name={t.guru_my_portfolio}
                    dataKey="mine"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.15}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Tooltip formatter={(v) => `${Number(v)}%`} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* 조정 제안 */}
          <Card title={t.guru_rebalance_title(guruName(selectedGuru))}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b">
                    <th className="pb-2 font-medium">{t.guru_col_tag}</th>
                    <th className="pb-2 font-medium text-right">
                      {t.guru_col_current}
                    </th>
                    <th className="pb-2 font-medium text-right">
                      {t.guru_col_guru_target}
                    </th>
                    <th className="pb-2 font-medium text-right">
                      {t.guru_col_diff}
                    </th>
                    <th className="pb-2 font-medium text-right">
                      {t.guru_col_amount}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guruRebalancing.map((s) => {
                    const diff = s.targetPercent - s.currentPercent;
                    return (
                      <tr key={s.tag}>
                        <td className="py-2">{t.tag_labels[s.tag] ?? s.tag}</td>
                        <td className="py-2 text-right tabular-nums">
                          {s.currentPercent.toFixed(1)}%
                        </td>
                        <td className="py-2 text-right tabular-nums">
                          {s.targetPercent.toFixed(1)}%
                        </td>
                        <td
                          className={`py-2 text-right tabular-nums font-medium ${
                            diff >= 0 ? "text-blue-600" : "text-red-600"
                          }`}
                        >
                          {diff >= 0 ? "+" : ""}
                          {diff.toFixed(1)}%p
                        </td>
                        <td
                          className={`py-2 text-right tabular-nums ${
                            s.diffAmountKRW >= 0
                              ? "text-blue-600"
                              : "text-red-600"
                          }`}
                        >
                          {s.diffAmountKRW >= 0 ? "+" : ""}
                          {formatCurrency(s.diffAmountKRW, "KRW", true)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
