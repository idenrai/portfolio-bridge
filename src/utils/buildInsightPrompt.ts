import type {
  Asset,
  AssetCategory,
  AssetType,
  Market,
  TargetAllocation,
  PortfolioSummary,
} from "@/types";
import { CURRENCY_SYMBOLS } from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";

/** English-only label maps for AI prompts */
const CATEGORY_LABELS_EN: Record<AssetCategory, string> = {
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

const ASSET_TYPE_LABELS_EN: Record<AssetType, string> = {
  stock: "Stock",
  etf: "ETF",
  bond: "Bond",
  fund: "Fund",
  cash: "Cash/Deposit",
  crypto: "Crypto",
  real_estate: "Real Estate",
  other: "Other",
};

const MARKET_LABELS_EN: Record<Market, string> = {
  KR: "Korea",
  JP: "Japan",
  US: "US",
  EU: "Europe",
  OTHER: "Other",
};

/** KRW 기준 금액을 baseCurrency로 변환하여 포맷팅 */
function formatInBase(
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

/**
 * AI에게 포트폴리오 인사이트를 요청하는 프롬프트 생성
 */
export function buildInsightPrompt(
  summary: PortfolioSummary,
  assets: Asset[],
  targets: TargetAllocation[],
  lang: Lang = "ko",
  baseCurrency: string = "KRW",
  rates: Record<string, number> = { KRW: 1, USD: 1350, JPY: 9 },
): string {
  const totalKRW = summary.totalValueKRW;
  const pnlKRW = summary.totalPnLKRW;
  const returnPct = summary.totalReturnPercent;

  // 카테고리별 배분 (목표 vs 실제)
  const categorySection = summary.categoryAllocation
    .map((t) => {
      const tgt = targets.find((x) => x.category === t.category);
      const label =
        CATEGORY_LABELS_EN[t.category as AssetCategory] ?? t.category;
      const targetStr = tgt ? ` (target: ${tgt.targetPercent}%)` : "";
      return `  - ${label}: ${t.percent.toFixed(1)}%${targetStr}`;
    })
    .join("\n");

  // 시장별 배분
  const marketSection = summary.marketAllocation
    .map(
      (m) =>
        `  - ${MARKET_LABELS_EN[m.market as keyof typeof MARKET_LABELS_EN] ?? m.market}: ${m.percent.toFixed(1)}%`,
    )
    .join("\n");

  // 외화 노출
  const fxSection = summary.currencyExposure
    .map((e) => `  - ${e.currency}: ${e.percent.toFixed(1)}%`)
    .join("\n");

  // 보유 종목 상세 (현금 제외 + 평가액 기준 정렬, 최대 30건)
  const holdings = [...summary.holdings]
    .filter((h) => h.type !== "cash")
    .sort((a, b) => b.valueKRW - a.valueKRW)
    .slice(0, 30);

  const holdingRows = holdings
    .map((h, i) => {
      const type =
        ASSET_TYPE_LABELS_EN[h.type as keyof typeof ASSET_TYPE_LABELS_EN] ??
        h.type;
      const market =
        MARKET_LABELS_EN[h.market as keyof typeof MARKET_LABELS_EN] ?? h.market;
      const category = h.category
        ? (CATEGORY_LABELS_EN[h.category as AssetCategory] ?? h.category)
        : "—";
      return (
        `  ${i + 1}. ${h.name}${h.ticker ? ` [${h.ticker}]` : ""}` +
        ` | ${type} | ${market} | ${h.currency}` +
        ` | weight: ${h.weightPercent.toFixed(1)}%` +
        ` | return: ${h.returnPercent >= 0 ? "+" : ""}${h.returnPercent.toFixed(1)}%` +
        ` | category: ${category}`
      );
    })
    .join("\n");

  // 현금자산
  const cashAssets = assets.filter((a) => a.type === "cash");
  const cashSection =
    cashAssets.length > 0
      ? cashAssets
          .map((a) => `  - ${a.currency} ${a.quantity.toLocaleString()}`)
          .join("\n")
      : "  (none)";

  return `You are a professional portfolio analyst. Please analyze the following portfolio and provide:
1. An assessment of the current portfolio composition (diversification, risk concentration, currency exposure)
2. An ideal asset allocation model tailored to the portfolio's profile
3. Specific, actionable portfolio adjustment insights (what to buy more, reduce, or rebalance)
4. Any notable risks or opportunities you observe

--- PORTFOLIO OVERVIEW ---
Total value (${baseCurrency}): ${formatInBase(totalKRW, baseCurrency, rates)}
Total P&L (${baseCurrency}):   ${pnlKRW >= 0 ? "+" : ""}${formatInBase(pnlKRW, baseCurrency, rates)} (${returnPct >= 0 ? "+" : ""}${returnPct.toFixed(2)}%)
Number of positions: ${summary.holdingCount}
Cash %: ${summary.cashPercent.toFixed(1)}%

--- ALLOCATION BY CATEGORY ---
${categorySection || "  (no data)"}

--- ALLOCATION BY MARKET ---
${marketSection || "  (no data)"}

--- CURRENCY EXPOSURE ---
${fxSection || "  (no data)"}

--- HOLDINGS (sorted by weight, top ${holdings.length}) ---
${holdingRows || "  (no data)"}

--- CASH POSITIONS ---
${cashSection}

IMPORTANT: Please respond entirely in ${LANG_NAMES[lang]}. Be concise but specific, and prioritize actionable recommendations.`;
}
