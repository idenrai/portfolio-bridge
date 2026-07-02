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
    <tr className="whitespace-nowrap transition-colors hover:bg-zinc-800/50">
      <td className="max-w-65 py-2.5">
        <p className="leading-snug font-medium wrap-break-word whitespace-normal text-white">
          {asset.name}
        </p>
        {asset.ticker && (
          <p className="text-xs text-zinc-400">{asset.ticker}</p>
        )}
      </td>
      <td className="py-2.5 whitespace-nowrap">
        <span className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300">
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
          className="min-w-22 cursor-pointer rounded-sm border border-transparent bg-transparent p-1 text-[11px] tracking-wider text-zinc-300 uppercase transition-colors hover:border-zinc-700 hover:bg-zinc-900 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
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
            className="min-w-22 cursor-pointer rounded-sm border border-transparent bg-transparent p-1 text-[11px] tracking-wider text-zinc-300 uppercase transition-colors hover:border-zinc-700 hover:bg-zinc-900 focus-visible:border-zinc-500 focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:outline-none"
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
      <td className="py-2.5 text-right text-zinc-500 tabular-nums">
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
      <td className="py-2.5 text-right font-medium tabular-nums">
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
        className={`py-2.5 text-right font-medium tabular-nums ${isCash ? "text-zinc-500" : pnlColor}`}
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
