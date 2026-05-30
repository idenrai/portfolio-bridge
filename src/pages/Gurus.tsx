import { useState } from "react";
import { Card } from "@/components/common";
import {
  LynchTenBaggerCard,
  MagicFormulaCard,
  GrahamDefensiveCard,
  SmithQualityCard,
  PiotroskiFScoreCard,
  OneilCanSlimCard,
  BuffettIndicatorCard,
} from "@/components/gurus";
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
import { useLanguageStore, useSettingsStore, useProfileStore } from "@/stores";
import { useGuruSessionStore } from "@/stores";
import { GURU_PROFILES, formatCurrency, buildGuruPrompt, buildGuruFollowUpPrompt } from "@/utils";
import { calculateRebalancing } from "@/utils";
import type { GuruProfile } from "@/types";
import { en } from "@/i18n";

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
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedFollowUp, setCopiedFollowUp] = useState(false);

  const { sessions, saveSession, clearSession } = useGuruSessionStore();
  const profile = useProfileStore();
  const profileData = {
    nickname: profile.nickname,
    age: profile.age,
    annualIncome: profile.annualIncome,
    monthlyBudget: profile.monthlyBudget,
    plan3y: profile.plan3y,
    plan5y: profile.plan5y,
    plan10y: profile.plan10y,
  };

  /** i18n 구루 이름 */
  const guruName = (guru: GuruProfile) =>
    (t as unknown as Record<string, string>)[`guru_name_${guru.id}`] ?? guru.name;

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] md:min-h-[60vh] text-slate-400 px-4">
        <p className="text-5xl md:text-6xl mb-4">💡</p>
        <h2 className="text-lg md:text-xl font-semibold text-slate-600 mb-2 text-center">
          {t.guru_empty_title}
        </h2>
        <p className="text-xs md:text-sm text-center">{t.guru_empty_desc}</p>
      </div>
    );
  }

  const guruRebalancing = selectedGuru
    ? calculateRebalancing(summary, selectedGuru.idealAllocation)
    : [];

  // 레이더 차트용 데이터: 내 포트폴리오 vs 선택 구루 (합집합)
  const radarData = selectedGuru
    ? (() => {
        const allCategories = new Set([
          ...selectedGuru.idealAllocation.map((a) => a.category),
          ...summary.categoryAllocation.map((a) => a.category),
        ]);
        return [...allCategories].map((cat) => {
          const guruAlloc = selectedGuru.idealAllocation.find(
            (a) => a.category === cat,
          );
          const myAlloc = summary.categoryAllocation.find(
            (a) => a.category === cat,
          );
          return {
            category: t.category_labels[cat] ?? cat,
            guru: guruAlloc ? guruAlloc.targetPercent : 0,
            mine: myAlloc ? Number(myAlloc.percent.toFixed(1)) : 0,
          };
        });
      })()
    : [];

  const selectedPhilosophyKey = selectedGuru
    ? (`guru_philosophy_${selectedGuru.id}` as keyof typeof en)
    : null;

  const localizedPhilosophy = selectedPhilosophyKey
    ? ((t[selectedPhilosophyKey as keyof typeof t] as string | undefined) ??
      (en[selectedPhilosophyKey] as string | undefined) ??
      "")
    : "";

  const englishPhilosophy = selectedPhilosophyKey
    ? ((en[selectedPhilosophyKey] as string | undefined) ?? "")
    : "";

  // ── AI 프롬프트 파생값 ─────────────────────────────────────────────────────
  const promptText = selectedGuru
    ? buildGuruPrompt(selectedGuru, summary, assets, lang, baseCurrency, rates, englishPhilosophy, profileData)
    : "";
  const prevSession = selectedGuru ? sessions[selectedGuru.id] : undefined;
  const followUpText =
    selectedGuru && prevSession
      ? buildGuruFollowUpPrompt(selectedGuru, prevSession, summary, lang, baseCurrency, rates, profileData)
      : null;

  const copyPrompt = async () => {
    if (!selectedGuru) return;
    await navigator.clipboard.writeText(promptText);
    saveSession({
      guruId: selectedGuru.id,
      date: new Date().toISOString().slice(0, 10),
      totalValueKRW: summary.totalValueKRW,
      totalCostKRW: summary.totalCostKRW,
      totalPnLKRW: summary.totalPnLKRW,
      totalReturnPercent: summary.totalReturnPercent,
      holdingCount: summary.holdingCount,
      cashPercent: summary.cashPercent,
      categoryAllocation: summary.categoryAllocation.map((c) => ({
        category: c.category,
        percent: c.percent,
      })),
      marketAllocation: summary.marketAllocation.map((m) => ({
        market: m.market,
        percent: m.percent,
      })),
      currencyAllocation: summary.currencyAllocation.map((c) => ({
        currency: c.currency,
        percent: c.percent,
      })),
      holdings: summary.holdings
        .filter((h) => h.type !== "cash")
        .map((h) => ({
          id: h.id,
          ticker: h.ticker,
          name: h.name,
          currency: h.currency,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          weightPercent: h.weightPercent,
          returnPercent: h.returnPercent,
          category: h.category,
        })),
      baseCurrency,
      rates,
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyFollowUp = async () => {
    if (!followUpText) return;
    await navigator.clipboard.writeText(followUpText);
    setCopiedFollowUp(true);
    setTimeout(() => setCopiedFollowUp(false), 2000);
  };

  const handleNewSession = () => {
    if (!selectedGuru) return;
    clearSession(selectedGuru.id);
    setShowFollowUp(false);
    setShowPrompt(true);
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className="text-lg font-bold text-slate-800">{t.guru_title}</h2>

      {/* 구루 선택 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
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
              {localizedPhilosophy}
            </p>
          </Card>

          {/* AI 구루 프롬프트 배너 */}
          <div className="rounded-xl bg-linear-to-r from-purple-600 to-indigo-500 p-px shadow-md">
            <div className="rounded-[11px] bg-white/95 px-4 py-3">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <span className="text-2xl shrink-0 mt-0.5">🧘</span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 leading-tight">
                      {t.guru_ai_banner_title}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {t.guru_ai_banner_desc}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                  {prevSession && (
                    <button
                      type="button"
                      onClick={() => {
                        setShowFollowUp(true);
                        setShowPrompt(false);
                      }}
                      className="rounded-lg bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap text-center"
                    >
                      {t.guru_ai_followup_btn}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleNewSession}
                    className="rounded-lg bg-linear-to-r from-purple-600 to-indigo-500 px-4 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap text-center"
                  >
                    {t.guru_ai_followup_new_session}
                  </button>
                </div>
              </div>

              {/* 첫 번째 프롬프트 */}
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

              {/* 두 번째 (변동 사항) 프롬프트 */}
              {showFollowUp && followUpText && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      📅 {prevSession?.date}
                    </span>
                    <p className="text-xs text-slate-500">{t.guru_ai_followup_desc}</p>
                  </div>
                  <textarea
                    readOnly
                    value={followUpText}
                    rows={14}
                    className="w-full rounded-lg border border-emerald-200 bg-emerald-50/40 px-3 py-2 text-xs font-mono text-slate-700 resize-none focus:outline-none"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={copyFollowUp}
                      className="rounded-lg bg-emerald-700 hover:bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white transition-colors cursor-pointer"
                    >
                      {copiedFollowUp ? t.guru_ai_copied : t.guru_ai_copy}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4">
            {/* 이상적 배분 파이 차트 */}
            <Card title={t.guru_ideal_alloc(guruName(selectedGuru))}>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={selectedGuru.idealAllocation.map((a) => ({
                      name: t.category_labels[a.category] ?? a.category,
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
              <ResponsiveContainer width="100%" height={220}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" tick={{ fontSize: 11 }} />
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
            <div className="overflow-x-auto -mx-4 md:-mx-5 px-4 md:px-5">
              <table className="w-full text-sm min-w-125">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b">
                    <th className="pb-2 font-medium">{t.guru_col_category}</th>
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
                      <tr key={s.category}>
                        <td className="py-2">
                          {t.category_labels[s.category] ?? s.category}
                        </td>
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

          {/* 피터 린치 전용: 10루타 후보 스크리너 */}
          {selectedGuru.id === "lynch" && (
            <LynchTenBaggerCard />
          )}

          {/* 워렌 버핏 전용: 버핏 지수 */}
          {selectedGuru.id === "buffett" && (
            <BuffettIndicatorCard />
          )}

          {/* 그린블라트 전용: 마법 공식 스크리너 */}
          {selectedGuru.id === "greenblatt" && (
            <MagicFormulaCard />
          )}
          {/* 그레이엄 전용: 방어적 투자 채점기 */}
          {selectedGuru.id === "graham" && (
            <GrahamDefensiveCard />
          )}

          {/* 테리 스미스 전용: 퀄리티 컴파운더 채점기 */}
          {selectedGuru.id === "smith" && (
            <SmithQualityCard />
          )}

          {/* 피오트로스키 전용: F-Score 채점기 */}
          {selectedGuru.id === "piotroski" && (
            <PiotroskiFScoreCard />
          )}

          {/* 윌리엄 오닐 전용: CAN SLIM 채점기 */}
          {selectedGuru.id === "oneil" && (
            <OneilCanSlimCard />
          )}        </>
      )}
    </div>
  );
}
