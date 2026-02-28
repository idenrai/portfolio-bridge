import { Button } from "@/components/common";
import type { Asset, AssetTag } from "@/types";
import { MARKET_LABELS, CURRENCY_SYMBOLS, TAG_LABELS } from "@/types";
import { useAssetStore } from "@/stores";

const TAG_OPTIONS = Object.entries(TAG_LABELS) as [AssetTag, string][];
import {
  assetValue,
  assetPnL,
  assetReturnPercent,
  formatPercent,
} from "@/utils";

interface Props {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
}

export function AssetTable({ assets, onEdit, onDelete }: Props) {
  const updateAsset = useAssetStore((s) => s.updateAsset);

  const handleTagChange = (id: string, tag: AssetTag | "") => {
    updateAsset(id, { tags: tag ? [tag] : [] });
  };
  if (assets.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">💼</p>
        <p className="font-medium">등록된 자산이 없습니다</p>
        <p className="text-sm mt-1">
          위의 &quot;자산 추가&quot; 버튼으로 첫 자산을 등록해 보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
            <th className="pb-2 font-medium">종목</th>
            <th className="pb-2 font-medium">시장</th>
            <th className="pb-2 font-medium">분류</th>
            <th className="pb-2 font-medium text-right">수량</th>
            <th className="pb-2 font-medium text-right">현재가</th>
            <th className="pb-2 font-medium text-right">평가액</th>
            <th className="pb-2 font-medium text-right">손익</th>
            <th className="pb-2 font-medium text-right">수익률</th>
            <th className="pb-2 font-medium text-center">관리</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {assets.map((a) => {
            const val = assetValue(a);
            const pnl = assetPnL(a);
            const ret = assetReturnPercent(a);
            const sym = CURRENCY_SYMBOLS[a.currency];
            const pnlColor = pnl >= 0 ? "text-red-600" : "text-blue-600";

            return (
              <tr key={a.id} className="hover:bg-slate-50">
                <td className="py-2.5 max-w-[180px]">
                  <p className="font-medium text-slate-800 break-words whitespace-normal leading-snug">
                    {a.name}
                  </p>
                  {a.ticker && (
                    <p className="text-xs text-slate-400">{a.ticker}</p>
                  )}
                </td>
                <td className="py-2.5">
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                    {MARKET_LABELS[a.market]}
                  </span>
                </td>
                <td className="py-2.5">
                  <select
                    value={a.tags[0] ?? ""}
                    onChange={(e) =>
                      handleTagChange(a.id, e.target.value as AssetTag | "")
                    }
                    className="text-xs rounded border border-slate-200 px-1.5 py-1 bg-white text-slate-700 focus:border-blue-400 focus:outline-none min-w-[90px]"
                  >
                    <option value="">미분류</option>
                    {TAG_OPTIONS.map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {a.quantity.toLocaleString()}
                </td>
                <td className="py-2.5 text-right tabular-nums">
                  {sym}
                  {a.currentPrice.toLocaleString()}
                </td>
                <td className="py-2.5 text-right tabular-nums font-medium">
                  {sym}
                  {val.toLocaleString()}
                </td>
                <td className={`py-2.5 text-right tabular-nums ${pnlColor}`}>
                  {sym}
                  {pnl.toLocaleString()}
                </td>
                <td
                  className={`py-2.5 text-right tabular-nums font-medium ${pnlColor}`}
                >
                  {formatPercent(ret)}
                </td>
                <td className="py-2.5 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(a)}>
                      편집
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(a.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      삭제
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
