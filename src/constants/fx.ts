/**
 * 시가총액 USD 환산용 근사 환율
 * 실시간 환율이 아닌 스크리닝 필터용 대략적 기준입니다.
 */
export const APPROX_USD_RATES: Record<string, number> = {
  KRW: 1350,
  JPY: 150,
  EUR: 0.92,
  USD: 1,
};

/** 현지 통화 금액을 근사 USD로 변환 (스크리닝 필터용) */
export function approxToUSD(amount: number, currency: string): number {
  const rate = APPROX_USD_RATES[currency];
  if (!rate || rate === 1) return amount;
  return amount / rate;
}
