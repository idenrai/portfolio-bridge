

import type { CurrencyCode } from "./currency";

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
  /** 사용자가 수동으로 입력한 현재가 (API 실패 시 Fallback) */
  currentPrice: number;
  /** 분류 카테고리 (복수 가능) */
  categories: AssetCategory[];
  /** 연결된 증권사 계좌 ID */
  brokerId?: string;
  /** 메모 */
  memo?: string;
  /** 생성일 */
  createdAt: string; // ISO 8601
  /** 수정일 */
  updatedAt: string; // ISO 8601
}

/** 실시간 시세가 병합된 형태의 자산 데이터 (계산 및 UI 렌더링용) */
export interface PortfolioAsset extends Asset {
  /** API에서 조회된 실시간 가격 (없을 경우 Asset의 currentPrice로 대체됨) */
  livePrice?: number;
  peRatio?: number | null;
  pbRatio?: number | null;
  dividendYield?: number | null;
}

/** 자산 등록/수정 시 사용하는 폼 데이터 */
export type AssetFormData = Omit<Asset, "id" | "createdAt" | "updatedAt">;

/** 증권사 / 계좌 정보 */
export interface BrokerAccount {
  id: string;
  /** 국가 */
  country: Market;
  /** 증권사명 (예: 미래에셋, SBI証券, Fidelity) */
  broker: string;
  /** 계좌 종류 (예: ISA, NISA, 특정, 일반, IRA) */
  accountType: string;
  /** 사용자 정의 애칭 (예: 토스 ISA, SBI NISA) */
  nickname: string;
}


