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
import { usePortfolio } from "@/hooks";
import { GURU_PROFILES, getTagLabel, formatCurrency } from "@/utils";
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

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <p className="text-6xl mb-4">🧠</p>
        <h2 className="text-xl font-semibold text-slate-600 mb-2">
          투자 구루 분석
        </h2>
        <p className="text-sm">
          자산을 등록한 후 구루와 비교 분석을 할 수 있습니다.
        </p>
      </div>
    );
  }

  const guruRebalancing = selectedGuru
    ? calculateRebalancing(summary, selectedGuru.idealAllocation)
    : [];

  // 레이더 차트용 데이터: 내 포트폴리오 vs 선택 구루
  const radarData = selectedGuru
    ? selectedGuru.idealAllocation.map((ga) => {
        const myAlloc = summary.tagAllocation.find((t) => t.tag === ga.tag);
        return {
          tag: getTagLabel(ga.tag),
          guru: ga.targetPercent,
          mine: myAlloc ? Number(myAlloc.percent.toFixed(1)) : 0,
        };
      })
    : [];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-800">투자 구루</h2>

      {/* 구루 선택 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {GURU_PROFILES.map((guru) => (
          <button
            key={guru.id}
            onClick={() => setSelectedGuru(guru)}
            className={`text-left p-4 rounded-xl border transition-all ${
              selectedGuru?.id === guru.id
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-slate-200 bg-white hover:border-blue-300 hover:shadow-sm"
            }`}
          >
            <p className="font-semibold text-slate-800">{guru.nameKo}</p>
            <p className="text-xs text-slate-500 mt-0.5">{guru.name}</p>
          </button>
        ))}
      </div>

      {selectedGuru && (
        <>
          {/* 철학 */}
          <Card title={`${selectedGuru.nameKo}의 투자 철학`}>
            <p className="text-sm text-slate-600 leading-relaxed">
              {selectedGuru.philosophy}
            </p>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 이상적 배분 파이 차트 */}
            <Card title={`${selectedGuru.nameKo}의 이상적 배분`}>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={selectedGuru.idealAllocation.map((a) => ({
                      name: getTagLabel(a.tag),
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
            <Card title="내 포트폴리오 vs 구루 비교">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="tag" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 60]} />
                  <Radar
                    name={selectedGuru.nameKo}
                    dataKey="guru"
                    stroke="#3b82f6"
                    fill="#3b82f6"
                    fillOpacity={0.15}
                  />
                  <Radar
                    name="내 포트폴리오"
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
          <Card title={`${selectedGuru.nameKo} 기준 리밸런싱 제안`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b">
                    <th className="pb-2 font-medium">태그</th>
                    <th className="pb-2 font-medium text-right">현재</th>
                    <th className="pb-2 font-medium text-right">구루 목표</th>
                    <th className="pb-2 font-medium text-right">차이</th>
                    <th className="pb-2 font-medium text-right">조정 금액</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guruRebalancing.map((s) => {
                    const diff = s.targetPercent - s.currentPercent;
                    return (
                      <tr key={s.tag}>
                        <td className="py-2">{getTagLabel(s.tag)}</td>
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
