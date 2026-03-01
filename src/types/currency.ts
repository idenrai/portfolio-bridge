import type { CurrencyCode } from "./asset";

/** 기본 환율 (수동 입력 초기값, 2026-02 기준 근사치) */
export const DEFAULT_RATES: Record<CurrencyCode, number> = {
  KRW: 1,
  JPY: 9.5, // 1 JPY ≈ 9.5 KRW
  USD: 1350, // 1 USD ≈ 1,350 KRW
  EUR: 1470, // 1 EUR ≈ 1,470 KRW
};

/** 통화 기호 */
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  KRW: "₩",
  JPY: "¥",
  USD: "$",
  EUR: "€",
};

/** 통화별 한글 라벨 */
export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  KRW: "원화 (KRW)",
  JPY: "엔화 (JPY)",
  USD: "달러 (USD)",
  EUR: "유로 (EUR)",
};
