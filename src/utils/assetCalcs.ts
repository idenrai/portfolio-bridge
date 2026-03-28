import type { Asset } from "@/types";

/** 자산 한 건의 현재 평가액 (현지 통화) */
export function assetValue(asset: Asset): number {
  return asset.quantity * asset.currentPrice;
}

/** 자산 한 건의 투자 원금 (현지 통화) */
export function assetCost(asset: Asset): number {
  return asset.quantity * asset.avgBuyPrice;
}

/** 자산 한 건의 손익 (현지 통화) */
export function assetPnL(asset: Asset): number {
  return assetValue(asset) - assetCost(asset);
}

/** 자산 한 건의 수익률 (%) */
export function assetReturnPercent(asset: Asset): number {
  const cost = assetCost(asset);
  return cost === 0 ? 0 : (assetPnL(asset) / cost) * 100;
}
