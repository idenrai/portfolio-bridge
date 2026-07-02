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
  "#60a5fa",
  "#34d399",
  "#fbbf24",
  "#f87171",
  "#c084fc",
  "#2dd4bf",
  "#fb923c",
  "#a78bfa",
  "#f472b6",
  "#a3e635",
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

  const guruName = (guru: GuruProfile) =>
    (t[`guru_name_${guru.id}` as keyof typeof t] as string) ?? guru.name;

  return (
    <div className="grid grid-cols-1 gap-3 md:gap-4 lg:grid-cols-2">
      {/* 이상적 배분 파이 차트 */}
      <Card title={t.guru_ideal_alloc}>
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
            <PolarRadiusAxis angle={90} domain={[0, 60]} tick={false} axisLine={false} />
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
