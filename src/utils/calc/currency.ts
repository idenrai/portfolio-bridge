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
  EUR: "de-DE",
};

/**
 * 금액 포맷 (현지 통화 형식)
 * @param showPositiveSign true일 경우 양수 금액 앞에 '+' 부호를 추가합니다. (기본값: false)
 */
export function formatCurrency(
  amount: number,
  currency: CurrencyCode,
  compact = false,
  showPositiveSign = false,
): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const abs = Math.abs(amount);
  const sign = amount < 0 ? "-" : (showPositiveSign && amount > 0 ? "+" : "");
  
  if (currency === "KRW") {
    if (compact && abs >= 1_0000_0000)
      return `${sign}${symbol}${(abs / 1_0000_0000).toLocaleString("ko-KR", { maximumFractionDigits: 1 })}억`;
    if (compact && abs >= 1_0000)
      return `${sign}${symbol}${Math.round(abs / 1_0000).toLocaleString("ko-KR")}만`;
  } else if (currency === "JPY") {
    if (compact && abs >= 1_0000_0000)
      return `${sign}${symbol}${(abs / 1_0000_0000).toLocaleString("ja-JP", { maximumFractionDigits: 1 })}億`;
    if (compact && abs >= 1_0000)
      return `${sign}${symbol}${Math.round(abs / 1_0000).toLocaleString("ja-JP")}万`;
  } else {
    // USD, EUR, etc.
    if (compact && abs >= 1_000_000)
      return `${sign}${symbol}${(abs / 1_000_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}M`;
    if (compact && abs >= 1_000)
      return `${sign}${symbol}${(abs / 1_000).toLocaleString("en-US", { maximumFractionDigits: 1 })}K`;
  }
  
  return `${sign}${symbol}${abs.toLocaleString(CURRENCY_LOCALES[currency], {
    maximumFractionDigits: currency === "JPY" || currency === "KRW" ? 0 : 2,
  })}`;
}

/**
 * 퍼센트 포맷 (수익률/변화율 등)
 * 기본적으로 양수 및 0에 대해 '+' 부호를 자동으로 포함합니다. (예: `+5.1%`, `-2.3%`)
 *
 * @param value 포맷팅할 수치 (예: 5.123 -> +5.1%)
 * @param decimals 표시할 소수점 자릿수 (기본값: 1)
 * @param options signed가 false일 경우 '+' 부호를 생략합니다. (기본값: { signed: true })
 */
export function formatPercent(
  value: number,
  decimals = 1,
  options: { signed?: boolean } = { signed: true },
): string {
  const isSigned = options.signed ?? true;
  const sign = isSigned && value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
}

