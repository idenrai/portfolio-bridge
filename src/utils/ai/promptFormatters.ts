import type { AssetCategory, AssetType, Market } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

/** AI 프롬프트용 영문 카테고리 라벨 */
export const CATEGORY_LABELS_EN: Record<AssetCategory, string> = {
  dividend: "Dividend",
  growth: "Growth",
  value: "Value",
  index: "Index/ETF",
  bond: "Bond",
  reit: "REIT",
  cash: "Cash",
  crypto: "Crypto",
  commodity: "Commodity",
  other: "Other",
};

/** AI 프롬프트용 영문 자산유형 라벨 */
export const ASSET_TYPE_LABELS_EN: Record<AssetType, string> = {
  stock: "Stock",
  etf: "ETF",
  bond: "Bond",
  fund: "Fund",
  cash: "Cash/Deposit",
  crypto: "Crypto",
  real_estate: "Real Estate",
  other: "Other",
};

/** AI 프롬프트용 영문 시장 라벨 */
export const MARKET_LABELS_EN: Record<Market, string> = {
  KR: "Korea",
  JP: "Japan",
  US: "US",
  EU: "Europe",
  OTHER: "Other",
};

/** KRW 기준 금액을 baseCurrency로 변환하여 포맷팅 */
export function formatInBase(
  krwAmount: number,
  baseCurrency: string,
  rates: Record<string, number>,
): string {
  const symbol =
    (CURRENCY_SYMBOLS as Record<string, string>)[baseCurrency] ?? baseCurrency;
  if (baseCurrency === "KRW") {
    return `${symbol}${Math.round(krwAmount).toLocaleString()}`;
  }
  const rate = rates[baseCurrency] ?? 1;
  const amount = krwAmount / rate;
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

/** 숫자의 부호 접두사 반환 (양수면 "+", 음수면 "") */
export function sign(val: number): string {
  return val >= 0 ? "+" : "";
}
