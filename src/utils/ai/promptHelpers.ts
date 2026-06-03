/**
 * AI 프롬프트 공통 라벨·포맷 유틸리티
 *
 * buildGuruPrompt, buildInsightPrompt, aiClassification에서 중복되던
 * CATEGORY_LABELS_EN, ASSET_TYPE_LABELS_EN, MARKET_LABELS_EN, formatInBase를 통합
 */
import type { AssetCategory, AssetType, Market } from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";

/** AI 프롬프트용 영문 카테고리 라벨 */
export const CATEGORY_LABELS_EN: Record<AssetCategory, string> = {
  dividend: "Dividend",
  growth: "Growth",
  value: "Value",
  index: "Index/ETF",
  bond: "Bond",
  reit: "REIT",
  cash: "Cash",
  crypto: "Crypto",
  commodity: "Commodity",
  other: "Other",
};

/** AI 프롬프트용 영문 자산유형 라벨 */
export const ASSET_TYPE_LABELS_EN: Record<AssetType, string> = {
  stock: "Stock",
  etf: "ETF",
  bond: "Bond",
  fund: "Fund",
  cash: "Cash/Deposit",
  crypto: "Crypto",
  real_estate: "Real Estate",
  other: "Other",
};

/** AI 프롬프트용 영문 시장 라벨 */
export const MARKET_LABELS_EN: Record<Market, string> = {
  KR: "Korea",
  JP: "Japan",
  US: "US",
  EU: "Europe",
  OTHER: "Other",
};

/** KRW 기준 금액을 baseCurrency로 변환하여 포맷팅 */
export function formatInBase(
  krwAmount: number,
  baseCurrency: string,
  rates: Record<string, number>,
): string {
  const symbol =
    (CURRENCY_SYMBOLS as Record<string, string>)[baseCurrency] ?? baseCurrency;
  if (baseCurrency === "KRW") {
    return `${symbol}${Math.round(krwAmount).toLocaleString()}`;
  }
  const rate = rates[baseCurrency] ?? 1;
  const amount = krwAmount / rate;
  return `${symbol}${Math.round(amount).toLocaleString()}`;
}

import type { PortfolioSummary, Asset } from "@/types";

/** 카테고리별 배분 섹션 빌드 (목표 비중과 비교) */
export function buildCategorySection(
  summary: PortfolioSummary,
  targets: { category: string; targetPercent?: number }[],
  targetLabel = "target",
): string {
  return (
    summary.categoryAllocation
      .map((t) => {
        const tgt = targets.find((x) => x.category === t.category);
        const label =
          CATEGORY_LABELS_EN[t.category as AssetCategory] ?? t.category;
        const targetStr =
          tgt?.targetPercent != null
            ? ` (${targetLabel}: ${tgt.targetPercent}%)`
            : "";
        return `  - ${label}: ${t.percent.toFixed(1)}%${targetStr}`;
      })
      .join("\n") || "  (no data)"
  );
}

/** 시장별 배분 섹션 빌드 */
export function buildMarketSection(summary: PortfolioSummary): string {
  return (
    summary.marketAllocation
      .map(
        (m) =>
          `  - ${MARKET_LABELS_EN[m.market as keyof typeof MARKET_LABELS_EN] ?? m.market}: ${m.percent.toFixed(1)}%`,
      )
      .join("\n") || "  (no data)"
  );
}

/** 외화 노출 섹션 빌드 */
export function buildFxSection(summary: PortfolioSummary): string {
  return (
    summary.currencyExposure
      .map((e) => `  - ${e.currency}: ${e.percent.toFixed(1)}%`)
      .join("\n") || "  (no data)"
  );
}

/** 보유 종목 상세 행 빌드 (현금 제외, 평가액 순, 최대 maxItems) */
export function buildHoldingRows(
  summary: PortfolioSummary,
  maxItems = 30,
): { rows: string; count: number } {
  const holdings = [...summary.holdings]
    .filter((h) => h.type !== "cash")
    .sort((a, b) => b.valueKRW - a.valueKRW)
    .slice(0, maxItems);

  const rows =
    holdings
      .map((h, i) => {
        const type =
          ASSET_TYPE_LABELS_EN[h.type as keyof typeof ASSET_TYPE_LABELS_EN] ??
          h.type;
        const market =
          MARKET_LABELS_EN[h.market as keyof typeof MARKET_LABELS_EN] ??
          h.market;
        const category = h.category
          ? (CATEGORY_LABELS_EN[h.category as AssetCategory] ?? h.category)
          : "—";
        return (
          `  ${i + 1}. ${h.name}${h.ticker ? ` [${h.ticker}]` : ""}` +
          ` | ${type} | ${market} | ${h.currency}` +
          ` | weight: ${h.weightPercent.toFixed(1)}%` +
          ` | return: ${h.returnPercent >= 0 ? "+" : ""}${h.returnPercent.toFixed(1)}%` +
          ` | category: ${category}` +
          (h.peRatio != null ? ` | PER: ${h.peRatio.toFixed(1)}` : "") +
          (h.pbRatio != null ? ` | PBR: ${h.pbRatio.toFixed(2)}` : "") +
          (h.dividendYield != null ? ` | DY: ${(h.dividendYield * 100).toFixed(2)}%` : "")
        );
      })
      .join("\n") || "  (no data)";

  return { rows, count: holdings.length };
}

/** 현금자산 섹션 빌드 */
export function buildCashSection(assets: Asset[]): string {
  const cashAssets = assets.filter((a) => a.type === "cash");
  return cashAssets.length > 0
    ? cashAssets
        .map((a) => `  - ${a.currency} ${a.quantity.toLocaleString()}`)
        .join("\n")
    : "  (none)";
}

/** 프롬프트 공통 페르소나 헤더 (buildGuruPrompt / buildGuruFollowUpPrompt 공유) */
export function buildPersonaHeader(guruName: string): string {
  return (
    `You are ${guruName}, the legendary investor, speaking directly and personally to an individual investor who has shared their portfolio for your honest assessment.\n` +
    `Maintain ${guruName}'s authentic voice, investment philosophy, characteristic vocabulary, and reasoning style fully and consistently from the first word to the last.`
  );
}

/** 숫자의 부호 접두사 반환 ("+3.5%" 표기 등) */
export function sign(n: number): string {
  return n >= 0 ? "+" : "";
}

/**
 * 포트폴리오 데이터 블록 빌드
 * PORTFOLIO OVERVIEW ~ CASH POSITIONS 섹션을 생성 (buildGuruPrompt / buildInsightPrompt 공유)
 */
export function buildPortfolioDataBlock(
  summary: PortfolioSummary,
  assets: Asset[],
  baseCurrency: string,
  rates: Record<string, number>,
  categorySection: string,
  categoryHeader = "ALLOCATION BY CATEGORY",
): string {
  const pnlKRW = summary.totalPnLKRW;
  const returnPct = summary.totalReturnPercent;
  const marketSection = buildMarketSection(summary);
  const fxSection = buildFxSection(summary);
  const { rows: holdingRows, count: holdingCount } = buildHoldingRows(summary);
  const cashSection = buildCashSection(assets);

  return `--- PORTFOLIO OVERVIEW ---
Total value (${baseCurrency}): ${formatInBase(summary.totalValueKRW, baseCurrency, rates)}
Total P&L (${baseCurrency}):   ${sign(pnlKRW)}${formatInBase(pnlKRW, baseCurrency, rates)} (${sign(returnPct)}${returnPct.toFixed(2)}%)
Number of positions: ${summary.holdingCount}
Cash %: ${summary.cashPercent.toFixed(1)}%

--- ${categoryHeader} ---
${categorySection}

--- ALLOCATION BY MARKET ---
${marketSection}

--- CURRENCY EXPOSURE ---
${fxSection}

--- HOLDINGS (sorted by weight, top ${holdingCount}) ---
${holdingRows}

--- CASH POSITIONS ---
${cashSection}`;
}
