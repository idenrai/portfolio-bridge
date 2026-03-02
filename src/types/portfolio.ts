import type { AssetTag, AssetType, CurrencyCode, Market } from "./asset";

/** 목표 배분 한 건 */
export interface TargetAllocation {
  tag: AssetTag;
  /** 목표 비중 (0–100 %) */
  targetPercent: number;
}

/** 리밸런싱 권장 결과 한 건 */
export interface RebalanceSuggestion {
  tag: AssetTag;
  currentPercent: number;
  targetPercent: number;
  /** 양수 = 추가 매수 권장, 음수 = 매도 권장 (KRW 기준 금액) */
  diffAmountKRW: number;
}

/** 보유 종목 상세 (KRW 환산 포함) */
export interface HoldingDetail {
  id: string;
  name: string;
  ticker?: string;
  type: AssetType;
  market: Market;
  currency: CurrencyCode;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  tag: AssetTag | null;
  /** 평가액 (KRW) */
  valueKRW: number;
  /** 투자원금 (KRW) */
  costKRW: number;
  /** 손익 (KRW) */
  pnlKRW: number;
  /** 수익률 % */
  returnPercent: number;
  /** 전체 대비 비중 % */
  weightPercent: number;
}

/** 환율 노출 상세 */
export interface CurrencyExposure {
  currency: CurrencyCode;
  /** 해당 통화 총 평가액 (현지 통화) */
  totalLocal: number;
  /** KRW 환산액 */
  totalKRW: number;
  /** 전체 대비 비중 % */
  percent: number;
  /** 환율 */
  rate: number;
}

/** 환율 시나리오 분석 (±N%) */
export interface CurrencyScenario {
  currency: CurrencyCode;
  changePercent: number;
  /** 변동 시 포트폴리오 총액 변화 (KRW) */
  impactKRW: number;
  /** 변동 시 포트폴리오 수익률 변화 (pp) */
  impactPercent: number;
}

/** 인사이트 알림 */
export interface PortfolioInsight {
  type: "warning" | "info" | "danger";
  icon: string;
  message: string;
}

/** 포트폴리오 요약 통계 */
export interface PortfolioSummary {
  /** 전체 평가액 (KRW) */
  totalValueKRW: number;
  /** 전체 투자원금 (KRW) */
  totalCostKRW: number;
  /** 전체 손익 (KRW) */
  totalPnLKRW: number;
  /** 전체 수익률 (%) */
  totalReturnPercent: number;
  /** 보유 종목 수 (현금 제외) */
  holdingCount: number;
  /** 자산군 수 (type distinct count) */
  assetTypeCount: number;
  /** 현금 비중 (%) */
  cashPercent: number;

  /** 태그별 비중 */
  tagAllocation: { tag: AssetTag; percent: number; valueKRW: number }[];
  /** 시장(국가)별 비중 */
  marketAllocation: { market: string; percent: number; valueKRW: number }[];
  /** 통화별 비중 */
  currencyAllocation: { currency: string; percent: number; valueKRW: number }[];

  /** 보유 종목 상세 (평가액 내림차순) */
  holdings: HoldingDetail[];
  /** 환율 노출 */
  currencyExposure: CurrencyExposure[];
  /** 환율 시나리오 (±5%) */
  currencyScenarios: CurrencyScenario[];
  /** 인사이트 */
  insights: PortfolioInsight[];
}

/** 투자 구루 ID */
export type GuruId =
  | "buffett"
  | "munger"
  | "lynch"
  | "graham"
  | "dalio"
  | "lilu"
  | "ackman"
  | "burry"
  | "fisher"
  | "cohen"
  | "marks"
  | "klarman"
  | "templeton"
  | "soros"
  | "wood"
  | "druckenmiller"
  | "smith"
  | "greenblatt";

/** 구루 대표 보유 종목 */
export interface TopHolding {
  ticker: string;
  name: string;
  /** 비중 (%) */
  percent: number;
}

/** 투자 구루 프로필 */
export interface GuruProfile {
  id: GuruId;
  name: string;
  nameKo: string;
  nameJa: string;
  /** 운용사/소속 펀드 */
  firm: string;
  /** 운용 자산 규모 (표시용 문자열) */
  aum: string;
  philosophy: string;
  /** 추천 태그 비중 */
  idealAllocation: TargetAllocation[];
  /** 대표 보유 종목 */
  topHoldings: TopHolding[];
}
