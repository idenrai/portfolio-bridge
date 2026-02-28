import { useState } from "react";
import { Card, Button } from "@/components/common";
import { useSettingsStore } from "@/stores";
import { useAssetStore } from "@/stores";
import { useExchangeRates } from "@/hooks";
import { TAG_LABELS, CURRENCY_LABELS, CURRENCY_SYMBOLS } from "@/types";
import type { AssetTag, TargetAllocation } from "@/types";
import { format } from "date-fns";

export function SettingsPage() {
  const settings = useSettingsStore();
  const assetStore = useAssetStore();
  const {
    refreshRates,
    isLoading,
    lastUpdated,
    error: rateError,
  } = useExchangeRates();
  const [allocations, setAllocations] = useState<TargetAllocation[]>([
    ...settings.targetAllocations,
  ]);

  const handleAllocationChange = (index: number, value: string) => {
    const updated = [...allocations];
    updated[index] = { ...updated[index], targetPercent: Number(value) || 0 };
    setAllocations(updated);
  };

  const saveAllocations = () => {
    settings.setTargetAllocations(allocations);
  };

  const totalPercent = allocations.reduce((s, a) => s + a.targetPercent, 0);

  const handleResetAll = () => {
    if (
      window.confirm(
        "모든 데이터(자산, 설정)를 초기화합니다. 이 작업은 되돌릴 수 없습니다.",
      )
    ) {
      localStorage.removeItem("portfolio-bridge-assets");
      localStorage.removeItem("portfolio-bridge-settings");
      window.location.reload();
    }
  };

  // handleRateChange는 더 이상 사용하지 않음 (자동 조회만 지원)

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-lg font-bold text-slate-800">설정</h2>

      {/* 환율 */}
      <Card
        title="환율 (Yahoo Finance 자동 조회)"
        action={
          <div className="flex items-center gap-2">
            {lastUpdated && (
              <span className="text-xs text-slate-400">
                {format(new Date(lastUpdated), "HH:mm 기준")}
              </span>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={refreshRates}
              disabled={isLoading}
            >
              {isLoading ? "조회 중…" : "🔄 지금 갱신"}
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {rateError && (
            <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-2">
              {rateError}
            </p>
          )}
          {(
            Object.entries(CURRENCY_LABELS).filter(([k]) => k !== "KRW") as [
              keyof typeof CURRENCY_SYMBOLS,
              string,
            ][]
          ).map(([code, label]) => (
            <div key={code} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32">{label}</span>
              <span className="text-sm font-mono text-slate-800 w-24 text-right">
                {settings.exchangeRates[code]?.toLocaleString("ko-KR", {
                  maximumFractionDigits: 2,
                }) ?? "—"}
              </span>
              <span className="text-xs text-slate-400">KRW</span>
            </div>
          ))}
          {!lastUpdated && !rateError && (
            <p className="text-xs text-slate-400">
              앱 시작 시 자동 조회됩니다.
            </p>
          )}
        </div>
      </Card>

      {/* 목표 비중 */}
      <Card
        title="목표 비중 배분"
        action={
          <div className="flex items-center gap-2">
            <span
              className={`text-xs ${
                Math.abs(totalPercent - 100) < 0.01
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              합계: {totalPercent.toFixed(0)}%
            </span>
            <Button size="sm" onClick={saveAllocations}>
              저장
            </Button>
          </div>
        }
      >
        <div className="space-y-2">
          {allocations.map((a, i) => (
            <label key={a.tag} className="flex items-center gap-3">
              <span className="text-sm text-slate-600 w-32">
                {TAG_LABELS[a.tag as AssetTag] ?? a.tag}
              </span>
              <input
                type="number"
                min={0}
                max={100}
                value={a.targetPercent}
                onChange={(e) => handleAllocationChange(i, e.target.value)}
                className="w-24 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
              />
              <span className="text-xs text-slate-400">%</span>
            </label>
          ))}
        </div>
      </Card>

      {/* 데이터 관리 */}
      <Card title="데이터 관리">
        <div className="space-y-3">
          <p className="text-sm text-slate-500">
            모든 데이터는 브라우저 로컬 스토리지에 저장됩니다.
          </p>
          <p className="text-sm text-slate-500">
            현재 등록된 자산: <strong>{assetStore.assets.length}</strong>건
          </p>
          <Button variant="danger" size="sm" onClick={handleResetAll}>
            전체 데이터 초기화
          </Button>
        </div>
      </Card>
    </div>
  );
}
