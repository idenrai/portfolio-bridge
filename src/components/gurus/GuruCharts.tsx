import { useMemo } from "react";
import { useT } from "@/hooks";
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
import type { GuruProfile } from "@/types";

const COLORS = [
  "#38bdf8", // Sky
  "#34d399", // Emerald
  "#fbbf24", // Amber
  "#f87171", // Rose
  "#2dd4bf", // Teal
  "#fb923c", // Orange
  "#60a5fa", // Blue
  "#a3e635", // Lime
  "#94a3b8", // Slate
  "#cbd5e1", // Light Slate
];

interface GuruChartsProps {
  selectedGuru: GuruProfile;
  radarData: {
    category: string;
    guru: number;
    mine: number;
  }[];
}

export function GuruCharts({ selectedGuru, radarData }: GuruChartsProps) {
  const t = useT();

  const guruName = (guru: GuruProfile) => {
    if (guru.id === "custom") {
      return guru.name || (t.custom_guru_default_name ?? "Custom Guru");
    }
    return (t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name;
  };

  const maxRadarVal = Math.max(
    60,
    ...radarData.flatMap((d) => [d.guru, d.mine]),
  );
  const radarDomainMax = Math.ceil(maxRadarVal / 10) * 10;

  const pieData = useMemo(
    () =>
      selectedGuru.idealAllocation.map((a) => ({
        name: t.category_labels[a.category] ?? a.category,
        value: a.targetPercent,
      })),
    [selectedGuru.idealAllocation, t],
  );

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
      {/* 이상적 배분 파이 차트 */}
      <Card title={t.guru_ideal_alloc}>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={pieData}
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
            <Tooltip 
              formatter={(v) => `${Number(v)}%`} 
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }} 
              itemStyle={{ color: "#f8fafc", fontVariantNumeric: "tabular-nums" }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
          </PieChart>
        </ResponsiveContainer>
      </Card>

      {/* 레이더 비교 차트 */}
      <Card title={t.guru_radar_title}>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="category" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <PolarRadiusAxis angle={90} domain={[0, radarDomainMax]} tick={false} axisLine={false} />
            <Radar
              name={guruName(selectedGuru)}
              dataKey="guru"
              stroke="#60a5fa"
              fill="#60a5fa"
              fillOpacity={0.15}
            />
            <Radar
              name={t.guru_my_portfolio}
              dataKey="mine"
              stroke="#34d399"
              fill="#34d399"
              fillOpacity={0.15}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Tooltip 
              formatter={(v) => `${Number(v)}%`} 
              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", color: "#f8fafc" }} 
              itemStyle={{ color: "#f8fafc", fontVariantNumeric: "tabular-nums" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
