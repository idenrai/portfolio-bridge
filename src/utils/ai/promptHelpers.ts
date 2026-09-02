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

import type {
  PortfolioSummary,
  Asset,
  BrokerAccount,
  HoldingDetail,
} from "@/types";
import type { AccountTypeCategory } from "@/constants/accountTypes";
import { normalizeTicker } from "../yahoo/yahooCore";

export interface AccountTypePromptInfo {
  labelEn: string;
  category: AccountTypeCategory;
  categoryTag: string;
}

/** 계좌 유형 문자열을 AI 프롬프트용 영문 라벨 및 세무 카테고리로 변환 */
export function getAccountTypePromptInfo(
  accountType?: string,
): AccountTypePromptInfo {
  if (!accountType) {
    return { labelEn: "Unassigned", category: "other", categoryTag: "[Other]" };
  }

  const lower = accountType.toLowerCase();

  // 1. Tax-Free / 비과세 (NISA, ISA, Roth IRA, HSA, PEA 등)
  if (
    lower.includes("성장") ||
    lower.includes("growth") ||
    accountType.includes("NISA (성장)")
  ) {
    return {
      labelEn: "NISA Growth",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    };
  }
  if (
    lower.includes("적립") ||
    lower.includes("tsumitate") ||
    lower.includes("accumulation") ||
    accountType.includes("NISA (적립)")
  ) {
    return {
      labelEn: "NISA Accumulation",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    };
  }
  if (lower.includes("nisa")) {
    return {
      labelEn: "NISA",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    };
  }
  if (lower.includes("isa") || accountType.includes("ISA")) {
    return { labelEn: "ISA", category: "tax_free", categoryTag: "[Tax-Free]" };
  }
  if (lower.includes("roth")) {
    return {
      labelEn: "Roth IRA",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    };
  }
  if (lower.includes("hsa")) {
    return { labelEn: "HSA", category: "tax_free", categoryTag: "[Tax-Free]" };
  }
  if (lower.includes("pea")) {
    return {
      labelEn: "PEA / Tax-Advantaged Share",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    };
  }
  if (
    accountType.includes("비과세") ||
    lower.includes("tax-free") ||
    lower.includes("tax-advantaged")
  ) {
    return {
      labelEn: "Tax-Free Account",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    };
  }

  // 2. Pension / 과세이연 연금 (연금저축, IRP, iDeCo, 401k, Traditional IRA, Riester, Rürup 등)
  if (accountType.includes("연금저축") || lower.includes("pension savings")) {
    return {
      labelEn: "Pension Savings",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }
  if (lower.includes("irp") || accountType.includes("IRP")) {
    return {
      labelEn: "IRP Retirement",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }
  if (lower.includes("ideco") || accountType.includes("iDeCo")) {
    return {
      labelEn: "iDeCo Pension",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }
  if (lower.includes("401")) {
    return {
      labelEn: "401(k) Pension",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }
  if (lower.includes("traditional ira")) {
    return {
      labelEn: "Traditional IRA",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }
  if (
    lower.includes("riester") ||
    lower.includes("rürup") ||
    lower.includes("rurup")
  ) {
    return {
      labelEn: "Riester/Rürup Pension",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }
  if (
    accountType.includes("연금") ||
    lower.includes("pension") ||
    lower.includes("retirement")
  ) {
    return {
      labelEn: "Retirement Pension",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    };
  }

  // 3. Taxable / 일반 과세 (일반위탁, 특정, 일반, Standard Depot, Sparplan 등)
  if (
    accountType.includes("特定") ||
    accountType.includes("특정") ||
    lower.includes("tokutei")
  ) {
    return {
      labelEn: "Specific/Withholding Tax",
      category: "taxable",
      categoryTag: "[Taxable]",
    };
  }
  if (accountType.includes("일반위탁") || lower.includes("standard brokerage")) {
    return {
      labelEn: "Standard Brokerage",
      category: "taxable",
      categoryTag: "[Taxable]",
    };
  }
  if (
    accountType.includes("一般") ||
    accountType.includes("일반") ||
    lower.includes("general taxable")
  ) {
    return {
      labelEn: "General Taxable",
      category: "taxable",
      categoryTag: "[Taxable]",
    };
  }
  if (lower.includes("sparplan")) {
    return {
      labelEn: "Savings Plan (Sparplan)",
      category: "taxable",
      categoryTag: "[Taxable]",
    };
  }
  if (lower.includes("depot") || lower.includes("taxable")) {
    return {
      labelEn: "Taxable Depot",
      category: "taxable",
      categoryTag: "[Taxable]",
    };
  }

  // 4. Other
  if (accountType.includes("CMA") || lower.includes("cma")) {
    return {
      labelEn: "CMA Cash Management",
      category: "other",
      categoryTag: "[Other]",
    };
  }
  if (
    accountType.includes("법인") ||
    accountType.includes("法人") ||
    lower.includes("corporate")
  ) {
    return {
      labelEn: "Corporate Account",
      category: "other",
      categoryTag: "[Corporate]",
    };
  }
  if (
    lower.includes("crypto") ||
    lower.includes("wallet") ||
    accountType.includes("코인")
  ) {
    return {
      labelEn: "Crypto Wallet",
      category: "other",
      categoryTag: "[Crypto]",
    };
  }

  return { labelEn: accountType, category: "other", categoryTag: "[Other]" };
}

/** 세무 유형별 및 계좌별 자산 배분 요약 섹션 빌드 */
export function buildAccountTaxAllocationSection(
  summary: PortfolioSummary,
  assets: Asset[],
  brokers: BrokerAccount[],
  baseCurrency: string,
  rates: Record<string, number>,
): string {
  if (brokers.length === 0 || assets.length === 0) return "";

  const brokerMap = new Map<string, BrokerAccount>(
    brokers.map((b) => [b.id, b]),
  );

  // 계좌별 평가액 집계 (KRW)
  const accountValueMap = new Map<string, number>();
  let unassignedValueKRW = 0;

  for (const a of assets) {
    const fxRate = a.currency === "KRW" ? 1 : (rates[a.currency] ?? 1);
    const currentPrice = a.currentPrice ?? a.avgBuyPrice;
    const valueInAssetCurrency = a.quantity * currentPrice;
    const valueKRW =
      a.currency === "KRW"
        ? valueInAssetCurrency
        : valueInAssetCurrency * fxRate;

    if (a.brokerId && brokerMap.has(a.brokerId)) {
      accountValueMap.set(
        a.brokerId,
        (accountValueMap.get(a.brokerId) ?? 0) + valueKRW,
      );
    } else {
      unassignedValueKRW += valueKRW;
    }
  }

  const totalValKRW = summary.totalValueKRW || 1;

  // 세무 카테고리별 합산
  let taxFreeKRW = 0;
  let pensionKRW = 0;
  let taxableKRW = 0;
  let otherKRW = unassignedValueKRW;

  const accountBreakdownLines: string[] = [];

  // 브로커 계좌별 정보 정리
  const activeBrokers = brokers
    .map((b) => {
      const valKRW = accountValueMap.get(b.id) ?? 0;
      const pct = (valKRW / totalValKRW) * 100;
      const promptInfo = getAccountTypePromptInfo(b.accountType);
      return { broker: b, valKRW, pct, promptInfo };
    })
    .filter((x) => x.valKRW > 0)
    .sort((a, b) => b.valKRW - a.valKRW);

  for (const { broker, valKRW, pct, promptInfo } of activeBrokers) {
    if (promptInfo.category === "tax_free") taxFreeKRW += valKRW;
    else if (promptInfo.category === "pension") pensionKRW += valKRW;
    else if (promptInfo.category === "taxable") taxableKRW += valKRW;
    else otherKRW += valKRW;

    const accName = broker.nickname || broker.broker;
    accountBreakdownLines.push(
      `  - "${accName}" (${broker.country}: ${promptInfo.labelEn} ${promptInfo.categoryTag}): ${formatInBase(valKRW, baseCurrency, rates)} (${pct.toFixed(1)}%)`,
    );
  }

  const taxAdvantagedKRW = taxFreeKRW + pensionKRW;
  const taxAdvantagedPct = (taxAdvantagedKRW / totalValKRW) * 100;
  const taxFreePct = (taxFreeKRW / totalValKRW) * 100;
  const pensionPct = (pensionKRW / totalValKRW) * 100;
  const taxablePct = (taxableKRW / totalValKRW) * 100;
  const otherPct = (otherKRW / totalValKRW) * 100;
  const otherLine =
    otherKRW > 0
      ? `\n- Other / Unassigned Accounts: ${otherPct.toFixed(1)}% (${formatInBase(otherKRW, baseCurrency, rates)})`
      : "";

  if (activeBrokers.length === 0) return "";

  return `--- ALLOCATION BY ACCOUNT & TAX STATUS ---
- Tax-Advantaged Total: ${taxAdvantagedPct.toFixed(1)}% (${formatInBase(taxAdvantagedKRW, baseCurrency, rates)})
  * Tax-Free (e.g., NISA, ISA, Roth): ${taxFreePct.toFixed(1)}% (${formatInBase(taxFreeKRW, baseCurrency, rates)})
  * Tax-Deferred Pension (e.g., iDeCo, IRP, 401k): ${pensionPct.toFixed(1)}% (${formatInBase(pensionKRW, baseCurrency, rates)})
- Taxable Accounts (Standard / Specific): ${taxablePct.toFixed(1)}% (${formatInBase(taxableKRW, baseCurrency, rates)})${otherLine}

Account Breakdown:
${accountBreakdownLines.join("\n")}`;
}

/** 개별 종목에 대한 계좌별 분기 문자열 빌드 */
function buildHoldingAccountBreakdown(
  h: HoldingDetail,
  assets: Asset[],
  brokerMap: Map<string, BrokerAccount>,
): string {
  if (assets.length === 0 || brokerMap.size === 0) return "";

  // assets에서 h와 매칭되는 개별 자산들 필터
  const matchingAssets = assets.filter((a) => {
    if (a.type === "cash") return false;
    if (h.ticker && a.ticker) {
      return normalizeTicker(a.ticker) === normalizeTicker(h.ticker);
    }
    return a.name === h.name && a.currency === h.currency;
  });

  if (matchingAssets.length === 0) return "";

  const breakdownParts: string[] = [];
  for (const a of matchingAssets) {
    if (!a.brokerId) continue;
    const b = brokerMap.get(a.brokerId);
    if (!b) continue;

    const accountName = b.nickname || b.broker;
    const promptInfo = getAccountTypePromptInfo(b.accountType);
    const typeLabel = b.accountType
      ? ` (${promptInfo.labelEn} ${promptInfo.categoryTag})`
      : "";
    breakdownParts.push(
      `${a.quantity.toLocaleString()} in "${accountName}"${typeLabel}`,
    );
  }

  if (breakdownParts.length === 0) return "";
  if (breakdownParts.length === 1) {
    return ` | account: ${breakdownParts[0]}`;
  }
  return ` | accounts: ${breakdownParts.join(", ")}`;
}

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

/** 보유 종목 상세 행 빌드 (현금 제외, 평가액 순, 계좌별 분기 정보 포함, 최대 maxItems) */
export function buildHoldingRows(
  summary: PortfolioSummary,
  assets: Asset[] = [],
  brokers: BrokerAccount[] = [],
  maxItems = 30,
): { rows: string; count: number } {
  const brokerMap = new Map<string, BrokerAccount>(
    brokers.map((b) => [b.id, b]),
  );

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
        const accountStr = buildHoldingAccountBreakdown(h, assets, brokerMap);

        return (
          `  ${i + 1}. ${h.name}${h.ticker ? ` [${h.ticker}]` : ""}` +
          ` | ${type} | ${market} | ${h.currency}` +
          ` | weight: ${h.weightPercent.toFixed(1)}%` +
          ` | return: ${h.returnPercent >= 0 ? "+" : ""}${h.returnPercent.toFixed(1)}%` +
          ` | category: ${category}` +
          (h.peRatio != null ? ` | PER: ${h.peRatio.toFixed(1)}` : "") +
          (h.pbRatio != null ? ` | PBR: ${h.pbRatio.toFixed(2)}` : "") +
          (h.dividendYield != null ? ` | DY: ${(h.dividendYield * 100).toFixed(2)}%` : "") +
          accountStr
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
  brokers: BrokerAccount[] = [],
): string {
  const pnlKRW = summary.totalPnLKRW;
  const returnPct = summary.totalReturnPercent;
  const accountTaxSection = buildAccountTaxAllocationSection(
    summary,
    assets,
    brokers,
    baseCurrency,
    rates,
  );
  const marketSection = buildMarketSection(summary);
  const fxSection = buildFxSection(summary);
  const { rows: holdingRows, count: holdingCount } = buildHoldingRows(
    summary,
    assets,
    brokers,
  );
  const cashSection = buildCashSection(assets);

  const accountTaxBlock = accountTaxSection ? `\n\n${accountTaxSection}` : "";

  return `--- PORTFOLIO OVERVIEW ---
Total value (${baseCurrency}): ${formatInBase(summary.totalValueKRW, baseCurrency, rates)}
Total P&L (${baseCurrency}):   ${sign(pnlKRW)}${formatInBase(pnlKRW, baseCurrency, rates)} (${sign(returnPct)}${returnPct.toFixed(2)}%)
Number of positions: ${summary.holdingCount}
Cash %: ${summary.cashPercent.toFixed(1)}%${accountTaxBlock}

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
