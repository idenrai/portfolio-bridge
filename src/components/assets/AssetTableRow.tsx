import { useT } from "@/hooks";
import { Button } from "@/components/common";
import {
  type Asset,
  type AssetCategory,
  CURRENCY_SYMBOLS,
  type BrokerAccount,
  type PortfolioAsset,
} from "@/types";
import {
  assetValue,
  assetPnL,
  assetReturnPercent,
  formatPercent,
} from "@/utils";

interface AssetTableRowProps {
  asset: PortfolioAsset;
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
  const isPositive = pnl >= 0;
  const pnlColor = isPositive ? "text-emerald-400" : "text-rose-400";
  const pnlIcon = isPositive ? "▲" : "▼";
  const isCash = asset.type === "cash";

  return (
    <tr className="hover:bg-zinc-800/50 transition-colors whitespace-nowrap">
      <td className="py-2.5 max-w-65">
        <p className="font-medium text-white wrap-break-word whitespace-normal leading-snug">
          {asset.name}
        </p>
        {asset.ticker && (
          <p className="text-xs text-zinc-400">{asset.ticker}</p>
        )}
      </td>
      <td className="py-2.5 whitespace-nowrap">
        <span className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
          {t.market_labels[asset.market]}
        </span>
      </td>
      <td className="py-2.5 whitespace-nowrap">
        <select
          aria-label={t.at_col_category}
          value={asset.categories[0] ?? ""}
          onChange={(e) =>
            onCategoryChange(asset.id, e.target.value as AssetCategory | "")
          }
          className="text-[11px] uppercase tracking-wider rounded-sm border border-transparent hover:border-zinc-700 px-1 py-1 bg-transparent hover:bg-zinc-900 text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 min-w-22 cursor-pointer transition-colors"
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
            aria-label={t.af_account_label}
            value={asset.brokerId ?? ""}
            onChange={(e) => onBrokerChange(asset.id, e.target.value)}
            className="text-[11px] uppercase tracking-wider rounded-sm border border-transparent hover:border-zinc-700 px-1 py-1 bg-transparent hover:bg-zinc-900 text-zinc-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:border-zinc-500 min-w-22 cursor-pointer transition-colors"
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
          <span className="text-zinc-400">-</span>
        ) : (
          asset.quantity.toLocaleString()
        )}
      </td>
      <td className="py-2.5 text-right tabular-nums text-zinc-500">
        {isCash ? (
          <span className="text-zinc-400">-</span>
        ) : (
          <>
            {sym}
            {asset.avgBuyPrice.toLocaleString()}
          </>
        )}
      </td>
      <td className="py-2.5 text-right tabular-nums">
        {isCash ? (
          <span className="text-zinc-400">-</span>
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
        className={`py-2.5 text-right tabular-nums ${isCash ? "text-zinc-500" : pnlColor}`}
      >
        {isCash ? (
          "-"
        ) : (
          <div className="flex items-center justify-end gap-1">
            <span aria-hidden="true" className="text-[10px]">{pnlIcon}</span>
            <span>
              {sym}
              {Math.abs(pnl).toLocaleString()}
            </span>
          </div>
        )}
      </td>
      <td
        className={`py-2.5 text-right tabular-nums font-medium ${isCash ? "text-zinc-500" : pnlColor}`}
      >
        {isCash ? "-" : (
          <div className="flex items-center justify-end gap-1">
            <span aria-hidden="true" className="text-[10px]">{pnlIcon}</span>
            <span>{formatPercent(Math.abs(ret))}</span>
          </div>
        )}
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
            className="text-red-500 hover:text-red-400"
          >
            {t.at_btn_delete}
          </Button>
        </div>
      </td>
    </tr>
  );
}
