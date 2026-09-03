/**
 * AI 프롬프트 공통 라벨·포맷·계좌 분기 유틸리티 (Re-export Facade)
 *
 * 본 파일은 기존 호출부와의 100% 하위 호환성을 유지하기 위한 통합 배럴입니다.
 * 세부 로직은 책임별 모듈로 분할되어 관리됩니다:
 * - promptFormatters.ts: 라벨 매핑 및 통화 포맷팅
 * - promptAccountBreakdown.ts: 계좌 유형 및 세무 래퍼 분석
 * - promptHoldings.ts: 보유 종목 및 포트폴리오 데이터 블록 조립
 */

export * from "./promptFormatters";
export * from "./promptAccountBreakdown";
export * from "./promptHoldings";
