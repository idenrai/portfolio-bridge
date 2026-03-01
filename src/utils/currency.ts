import { type CurrencyCode, CURRENCY_SYMBOLS } from "@/types";

/**
 * 현지 통화 금액 → KRW 변환
 */
export function toKRW(
  amount: number,
  currency: CurrencyCode,
  rates: Record<CurrencyCode, number>,
): number {
  return amount * (rates[currency] ?? 1);
}

/**
 * KRW → 지정 통화 변환
 */
export function fromKRW(
  amountKRW: number,
  currency: CurrencyCode,
  rates: Record<CurrencyCode, number>,
): number {
  const rate = rates[currency] ?? 1;
  return rate === 0 ? 0 : amountKRW / rate;
}

const CURRENCY_LOCALES: Record<CurrencyCode, string> = {
  KRW: "ko-KR",
  USD: "en-US",
  JPY: "ja-JP",
};

/**
 * 금액 포맷 (현지 통화 형식)
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  compact = false,
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const abs = Math.abs(amount);
  if (currency === "KRW") {
    if (compact && abs >= 1_0000_0000)
      return `${symbol}${(amount / 1_0000_0000).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억`;
    if (compact && abs >= 1_0000)
      return `${symbol}${Math.round(amount / 1_0000).toLocaleString("ko-KR")}만`;
  } else if (currency === "JPY") {
    if (compact && abs >= 1_0000_0000)
      return `${symbol}${(amount / 1_0000_0000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}億`;
    if (compact && abs >= 1_0000)
      return `${symbol}${Math.round(amount / 1_0000).toLocaleString("ja-JP")}万`;
  } else {
    // USD, etc.
    if (compact && abs >= 1_000_000)
      return `${symbol}${(amount / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
    if (compact && abs >= 1_000)
      return `${symbol}${(amount / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`;
  }
  return `${symbol}${amount.toLocaleString(CURRENCY_LOCALES[currency], {
    maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
  })}`;
}

/**
 * 퍼센트 포맷
 */
export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(decimals)}%`;
}
