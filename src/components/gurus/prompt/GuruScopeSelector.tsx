import { AlertTriangle } from "lucide-react";
import type { PortfolioAsset } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";
import { assetValue, cn } from "@/utils";
import type { Translations } from "@/i18n";

interface GuruScopeSelectorProps {
  availableAssets: PortfolioAsset[];
  selectedAssetIds: Set<string>;
  toggleAssetId: (id: string) => void;
  selectAll: () => void;
  deselectAll: () => void;
  resetToDefaultScope: () => void;
  activeAssetsCount: number;
  t: Translations;
}

export function GuruScopeSelector({
  availableAssets,
  selectedAssetIds,
  toggleAssetId,
  selectAll,
  deselectAll,
  resetToDefaultScope,
  activeAssetsCount,
  t,
}: GuruScopeSelectorProps) {
  return (
    <div className="mt-4 space-y-3 rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-3.5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-800/80 pb-2.5">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-zinc-200">
            {t.guru_ai_scope_title}
          </p>
          <p className="text-2xs text-zinc-400">
            {t.guru_ai_scope_desc}
          </p>
        </div>
        <div className="flex items-center gap-2 font-medium">
          <button
            type="button"
            onClick={selectAll}
            className="cursor-pointer text-2xs text-indigo-400 transition-colors hover:text-indigo-300"
          >
            {t.guru_ai_scope_select_all}
          </button>
          <span className="text-2xs text-zinc-700">|</span>
          <button
            type="button"
            onClick={deselectAll}
            className="cursor-pointer text-2xs text-zinc-400 transition-colors hover:text-zinc-300"
          >
            {t.guru_ai_scope_deselect_all}
          </button>
          <span className="text-2xs text-zinc-700">|</span>
          <button
            type="button"
            onClick={resetToDefaultScope}
            className="cursor-pointer text-2xs text-emerald-400 transition-colors hover:text-emerald-300"
          >
            {t.guru_ai_scope_reset}
          </button>
        </div>
      </div>

      {availableAssets.length === 0 ? (
        <p className="py-2 text-center text-xs text-zinc-500">{t.guru_empty_desc}</p>
      ) : (
        <div className="grid max-h-60 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2 lg:grid-cols-3">
          {availableAssets.map((asset) => {
            const isSelected = selectedAssetIds.has(asset.id);
            const vis = asset.visibility ?? "all";
            const val = assetValue(asset);
            const sym = CURRENCY_SYMBOLS[asset.currency];

            return (
              <label
                key={asset.id}
                className={cn(
                  "flex cursor-pointer items-center gap-2.5 rounded-lg border p-2 text-xs transition-all select-none",
                  isSelected
                    ? "border-indigo-500/40 bg-indigo-500/5 text-zinc-100"
                    : "border-zinc-800/80 bg-zinc-900/30 text-zinc-500 opacity-60 hover:border-zinc-700",
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleAssetId(asset.id)}
                  className="size-4 shrink-0 cursor-pointer rounded border-zinc-700 bg-zinc-900 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate font-medium">{asset.name}</span>
                    {asset.ticker && (
                      <span className="shrink-0 font-mono text-3xs text-zinc-500">
                        {asset.ticker}
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex items-center gap-2 text-3xs text-zinc-400">
                    <span>
                      {t.category_labels[asset.categories[0]] ??
                        t.asset_type_labels[asset.type] ??
                        asset.type}
                    </span>
                    <span>•</span>
                    <span className="font-mono">
                      {sym}
                      {val.toLocaleString()}
                    </span>
                  </div>
                </div>
                {vis !== "all" && (
                  <span
                    className={cn(
                      "shrink-0 rounded border px-1.5 py-0.5 text-4xs font-medium uppercase",
                      vis === "dashboard_only" &&
                        "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
                      vis === "guru_only" &&
                        "border-purple-500/30 bg-purple-500/10 text-purple-400",
                      vis === "hidden" &&
                        "border-zinc-700 bg-zinc-800 text-zinc-400",
                    )}
                  >
                    {t.visibility_labels[vis]}
                  </span>
                )}
              </label>
            );
          })}
        </div>
      )}

      {activeAssetsCount === 0 && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{t.guru_ai_scope_empty_warning}</span>
        </div>
      )}
    </div>
  );
}
