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

/** KRW 기준 금액을 baseCurrency로 변환하여 포맷팅 (음수 시 -₩5,000 형태) */
export function formatInBase(
  krwAmount: number,
  baseCurrency: string,
  rates: Record<string, number>,
): string {
  const symbol =
    (CURRENCY_SYMBOLS as Record<string, string>)[baseCurrency] ?? baseCurrency;
  const isNegative = krwAmount < 0;
  const absAmount = Math.abs(krwAmount);
  if (baseCurrency === "KRW") {
    const formatted = `${symbol}${Math.round(absAmount).toLocaleString()}`;
    return isNegative ? `-${formatted}` : formatted;
  }
  const rate = rates[baseCurrency] ?? 1;
  const amount = absAmount / rate;
  const formatted = `${symbol}${Math.round(amount).toLocaleString()}`;
  return isNegative ? `-${formatted}` : formatted;
}

/**
 * 배당수익률 값을 소수점 비율(0.01 = 1%)로 정규화
 * - 0.035 -> 0.035 (3.5%)
 * - 3.5   -> 0.035 (3.5%, 레거시 데이터 또는 백분율 스케일 방어)
 */
export function normalizeDividendYield(
  dy: number | null | undefined,
): number | null {
  if (dy == null || isNaN(dy) || dy < 0) return null;
  return dy > 1 ? dy / 100 : dy;
}

/**
 * 프롬프트 및 UI용 배당수익률 문자열 포맷팅 (예: 0.035 또는 3.5 -> "3.50%")
 */
export function formatDividendYield(
  dy: number | null | undefined,
): string | null {
  const normalized = normalizeDividendYield(dy);
  if (normalized == null) return null;
  return `${(normalized * 100).toFixed(2)}%`;
}

/** 숫자의 부호 접두사 반환 (양수면 "+", 음수면 "") */
export function sign(val: number): string {
  return val >= 0 ? "+" : "";
}

/**
 * 보유 종목 비교(Diff)를 위한 정규화 키 생성 함수
 * - ticker가 있으면: "t:TICKER" (공백 제거 및 대문자 통일)
 * - ticker가 없으면: "n:name__CURRENCY" (공백 트림 소문자 이름 + 대문자 통일 통화)
 */
export function getNormalizedHoldingKey(item: {
  ticker?: string;
  name: string;
  currency: string;
}): string {
  if (item.ticker && item.ticker.trim()) {
    return `t:${item.ticker.trim().toUpperCase()}`;
  }
  return `n:${item.name.trim().toLowerCase()}__${item.currency.trim().toUpperCase()}`;
}

