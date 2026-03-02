import { Button } from "@/components/common";
import { type Asset, type AssetCategory, CURRENCY_SYMBOLS } from "@/types";
import { useAssetStore } from "@/pages/stores";
import { useT } from "@/hooks";
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
  const t = useT();
  const CATEGORY_OPTIONS = Object.entries(t.category_labels) as [
    AssetCategory,
    string,
  ][];

  const handleCategoryChange = (id: string, category: AssetCategory | "") => {
    updateAsset(id, { categories: category ? [category] : [] });
  };
  if (assets.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-4xl mb-3">💼</p>
        <p className="font-medium">{t.at_empty_title}</p>
        <p className="text-sm mt-1">{t.at_empty_desc}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-slate-200">
            <th className="pb-2 font-medium">{t.at_col_name}</th>
            <th className="pb-2 font-medium">{t.at_col_market}</th>
            <th className="pb-2 font-medium">{t.at_col_tag}</th>
            <th className="pb-2 font-medium text-right">{t.at_col_quantity}</th>
            <th className="pb-2 font-medium text-right">
              {t.at_col_current_price}
            </th>
            <th className="pb-2 font-medium text-right">{t.at_col_value}</th>
            <th className="pb-2 font-medium text-right">{t.at_col_pnl}</th>
            <th className="pb-2 font-medium text-right">{t.at_col_return}</th>
            <th className="pb-2 font-medium text-center">{t.at_col_actions}</th>
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
                    {t.market_labels[a.market]}
                  </span>
                </td>
                <td className="py-2.5">
                  <select
                    value={a.categories[0] ?? ""}
                    onChange={(e) =>
                      handleCategoryChange(
                        a.id,
                        e.target.value as AssetCategory | "",
                      )
                    }
                    className="text-xs rounded border border-slate-200 px-1.5 py-1 bg-white text-slate-700 focus:border-blue-400 focus:outline-none min-w-[90px]"
                  >
                    <option value="">{t.at_unclassified}</option>
                    {CATEGORY_OPTIONS.map(([val, label]) => (
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
                      {t.at_btn_edit}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(a.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      {t.at_btn_delete}
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
