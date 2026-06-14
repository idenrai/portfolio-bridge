import { useT } from "@/hooks";
import { Button } from "@/components/common";
import {
  type Asset,
  type AssetCategory,
  CURRENCY_SYMBOLS,
  type BrokerAccount,
} from "@/types";
import {
  assetValue,
  assetPnL,
  assetReturnPercent,
  formatPercent,
} from "@/utils";

interface AssetTableRowProps {
  asset: Asset;
  categoryOptions: [AssetCategory, string][];
  brokerAccounts: BrokerAccount[];
  hasBrokers: boolean;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onCategoryChange: (id: string, category: AssetCategory | "") => void;
  onBrokerChange: (id: string, brokerId: string) => void;
}

export function AssetTableRow({
  asset,
  categoryOptions,
  brokerAccounts,
  hasBrokers,
  onEdit,
  onDelete,
  onCategoryChange,
  onBrokerChange,
}: AssetTableRowProps) {
  const t = useT();
  const val = assetValue(asset);
  const pnl = assetPnL(asset);
  const ret = assetReturnPercent(asset);
  const sym = CURRENCY_SYMBOLS[asset.currency];
  const pnlColor = pnl >= 0 ? "text-red-600" : "text-blue-600";
  const isCash = asset.type === "cash";

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="py-2.5 max-w-65">
        <p className="font-medium text-white wrap-break-word whitespace-normal leading-snug">
          {asset.name}
        </p>
        {asset.ticker && (
          <p className="text-xs text-slate-400">{asset.ticker}</p>
        )}
      </td>
      <td className="py-2.5 whitespace-nowrap">
        <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
          {t.market_labels[asset.market]}
        </span>
      </td>
      <td className="py-2.5 whitespace-nowrap">
        <select
          value={asset.categories[0] ?? ""}
          onChange={(e) =>
            onCategoryChange(asset.id, e.target.value as AssetCategory | "")
          }
          className="text-xs rounded border border-slate-800 px-1.5 py-1 bg-slate-900/50 text-slate-200 focus:border-emerald-500 focus:outline-none min-w-22.5"
        >
          <option value="">{t.at_unclassified}</option>
          {categoryOptions.map(([val, label]) => (
            <option key={val} value={val}>
              {label}
            </option>
          ))}
        </select>
      </td>
      {hasBrokers && (
        <td className="py-2.5 whitespace-nowrap">
          <select
            value={asset.brokerId ?? ""}
            onChange={(e) => onBrokerChange(asset.id, e.target.value)}
            className="text-xs rounded border border-slate-800 px-1.5 py-1 bg-slate-900/50 text-slate-200 focus:border-emerald-500 focus:outline-none min-w-22.5"
          >
            <option value="">{t.af_account_none}</option>
            {brokerAccounts.map((b) => (
              <option key={b.id} value={b.id}>
                {b.nickname}
              </option>
            ))}
          </select>
        </td>
      )}
      <td className="py-2.5 text-right tabular-nums">
        {isCash ? (
          <span className="text-slate-400">-</span>
        ) : (
          asset.quantity.toLocaleString()
        )}
      </td>
      <td className="py-2.5 text-right tabular-nums text-slate-500">
        {isCash ? (
          <span className="text-slate-400">-</span>
        ) : (
          <>
            {sym}
            {asset.avgBuyPrice.toLocaleString()}
          </>
        )}
      </td>
      <td className="py-2.5 text-right tabular-nums">
        {isCash ? (
          <span className="text-slate-400">-</span>
        ) : (
          <>
            {sym}
            {asset.currentPrice.toLocaleString()}
          </>
        )}
      </td>
      <td className="py-2.5 text-right tabular-nums font-medium">
        {sym}
        {val.toLocaleString()}
      </td>
      <td
        className={`py-2.5 text-right tabular-nums ${isCash ? "text-slate-400" : pnlColor}`}
      >
        {isCash ? (
          "-"
        ) : (
          <>
            {sym}
            {pnl.toLocaleString()}
          </>
        )}
      </td>
      <td
        className={`py-2.5 text-right tabular-nums font-medium ${isCash ? "text-slate-400" : pnlColor}`}
      >
        {isCash ? "-" : formatPercent(ret)}
      </td>
      <td className="py-2.5 text-center whitespace-nowrap">
        <div className="flex items-center justify-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onEdit(asset)}>
            {t.at_btn_edit}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(asset.id)}
            className="text-red-500 hover:text-red-700"
          >
            {t.at_btn_delete}
          </Button>
        </div>
      </td>
    </tr>
  );
}
