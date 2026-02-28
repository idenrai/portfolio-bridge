import type { CurrencyCode } from "./asset";

/** 환율 정보 (기준: 1단위 → KRW) */
export interface ExchangeRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
  updatedAt: string; // ISO 8601
}

/** 기본 환율 (수동 입력 초기값, 2026-02 기준 근사치) */
export const DEFAULT_RATES: Record<CurrencyCode, number> = {
  KRW: 1,
  JPY: 9.5, // 1 JPY ≈ 9.5 KRW
  USD: 1350, // 1 USD ≈ 1,350 KRW
};

/** 통화 기호 */
export const CURRENCY_SYMBOLS: Record<CurrencyCode, string> = {
  KRW: "₩",
  JPY: "¥",
  USD: "$",
};

/** 통화별 한글 라벨 */
export const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  KRW: "원화 (KRW)",
  JPY: "엔화 (JPY)",
  USD: "달러 (USD)",
};
