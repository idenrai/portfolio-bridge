/** 통화 코드 */
export type CurrencyCode = "KRW" | "JPY" | "USD" | "EUR";

/** 자산이 속한 국가/시장 */
export type Market = "KR" | "JP" | "US" | "EU" | "OTHER";

/** 자산 분류 카테고리 */
export type AssetCategory =
  | "dividend" // 배당주
  | "growth" // 성장주
  | "value" // 가치주
  | "index" // 인덱스/ETF
  | "bond" // 채권
  | "reit" // 리츠
  | "cash" // 현금성
  | "crypto" // 암호화폐
  | "commodity" // 원자재
  | "other"; // 기타

/** 자산 유형 */
export type AssetType =
  | "stock" // 개별 주식
  | "etf" // ETF
  | "bond" // 채권
  | "fund" // 펀드
  | "cash" // 현금/예금
  | "crypto" // 암호화폐
  | "real_estate" // 부동산
  | "other"; // 기타

/** 개별 자산 (보유 종목 한 건) */
export interface Asset {
  id: string;
  /** 종목명 (예: 삼성전자, トヨタ自動車) */
  name: string;
  /** 티커/코드 (예: 005930.KS, 7203.T) — 선택 */
  ticker?: string;
  /** 자산 유형 */
  type: AssetType;
  /** 해당 시장 */
  market: Market;
  /** 통화 */
  currency: CurrencyCode;
  /** 보유 수량 */
  quantity: number;
  /** 매입 단가 (현지 통화) */
  avgBuyPrice: number;
  /** 현재가 (현지 통화) — 수동 입력 또는 시세 갱신 */
  currentPrice: number;
  /** 분류 카테고리 (복수 가능) */
  categories: AssetCategory[];
  /** 메모 */
  memo?: string;
  /** 생성일 */
  createdAt: string; // ISO 8601
  /** 수정일 */
  updatedAt: string; // ISO 8601
}

/** 자산 등록/수정 시 사용하는 폼 데이터 */
export type AssetFormData = Omit<Asset, "id" | "createdAt" | "updatedAt">;

/** 카테고리별 한글 라벨 */
export const CATEGORY_LABELS: Record<AssetCategory, string> = {
  dividend: "배당",
  growth: "성장",
  value: "가치",
  index: "인덱스/ETF",
  bond: "채권",
  reit: "리츠",
  cash: "현금성",
  crypto: "암호화폐",
  commodity: "원자재",
  other: "기타",
};

/** 자산유형별 한글 라벨 */
export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  stock: "주식",
  etf: "ETF",
  bond: "채권",
  fund: "펀드",
  cash: "현금/예금",
  crypto: "암호화폐",
  real_estate: "부동산",
  other: "기타",
};

/** 시장별 한글 라벨 */
export const MARKET_LABELS: Record<Market, string> = {
  KR: "한국",
  JP: "일본",
  US: "미국",
  EU: "유럽",
  OTHER: "기타",
};
