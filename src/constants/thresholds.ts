/** 인사이트 경고 임계값 */
export const INSIGHT_THRESHOLDS = {
  /** 개별 종목 과대 비중 (%) */
  CONCENTRATION: 15,
  /** 큰 손실 기준 (%) */
  BIG_LOSS: -20,
  /** 현금 과다 기준 (%) */
  CASH_HIGH: 20,
  /** 현금 부족 기준 (%) */
  CASH_LOW: 3,
  /** 현금 부족 경고 최소 종목 수 */
  CASH_LOW_MIN_ASSETS: 3,
  /** 환율 노출 과다 기준 (%) */
  FX_HIGH: 40,
  /** 카테고리 목표 대비 편차 기준 (%p) */
  CATEGORY_DIFF: 10,
} as const;
