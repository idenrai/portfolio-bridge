import type {
  PortfolioSummary,
  Asset,
  BrokerAccount,
  HoldingDetail,
} from "@/types";
import type { AccountTypeCategory } from "@/constants/accountTypes";
import { normalizeTicker } from "../yahoo/yahooCore";
import { formatInBase, sign } from "./promptFormatters";

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

export function getTaxWrapperGuidance(
  category: "tax_free" | "pension" | "taxable" | "other",
): string {
  switch (category) {
    case "tax_free":
      return "Tax-Free wrapper (0% capital gains & dividend tax; preserve for long-term compound growth)";
    case "pension":
      return "Tax-Deferred Pension (early withdrawal penalties apply; long-term retirement lock-in)";
    case "taxable":
      return "Taxable Account (subject to capital gains tax upon disposal; eligible for tax-loss harvesting)";
    default:
      return "Standard/Other Account";
  }
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

    const countryPrefix = broker.country ? `[${broker.country}] ` : "";
    const nameStr = broker.nickname || broker.broker;
    accountBreakdownLines.push(
      `  - ${countryPrefix}"${nameStr}" (${promptInfo.labelEn} ${promptInfo.categoryTag}): ${pct.toFixed(1)}% (${formatInBase(valKRW, baseCurrency, rates)})`,
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
export function buildHoldingAccountBreakdown(
  h: HoldingDetail,
  assets: Asset[],
  brokerMap: Map<string, BrokerAccount>,
  baseCurrency = "KRW",
  rates: Record<string, number> = { KRW: 1, USD: 1350, JPY: 9 },
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

  // 단 1개 계좌에만 있는 경우
  if (matchingAssets.length === 1) {
    const a = matchingAssets[0];
    if (!a.brokerId) return "";
    const b = brokerMap.get(a.brokerId);
    if (!b) return "";

    const accountName = b.nickname || b.broker;
    const promptInfo = getAccountTypePromptInfo(b.accountType);
    const costLocal = a.quantity * a.avgBuyPrice;
    const currentPrice = a.currentPrice ?? a.avgBuyPrice;
    const valLocal = a.quantity * currentPrice;
    const pnlLocal = valLocal - costLocal;
    const retPct = costLocal === 0 ? 0 : (pnlLocal / costLocal) * 100;
    const countryPrefix = b.country ? `${b.country}: ` : "";
    const fxRate = a.currency === "KRW" ? 1 : (rates[a.currency] ?? 1);
    const valKRW = a.currency === "KRW" ? valLocal : valLocal * fxRate;
    const baseValStr =
      a.currency !== baseCurrency
        ? `, val: ${formatInBase(valKRW, baseCurrency, rates)}`
        : "";

    return ` | account: ${a.quantity.toLocaleString()} in "${accountName}" (${countryPrefix}${promptInfo.labelEn} ${promptInfo.categoryTag}) [avg: ${a.currency} ${a.avgBuyPrice.toLocaleString()}, ret: ${sign(retPct)}${retPct.toFixed(1)}%${baseValStr}]`;
  }

  // 복수 계좌에 분산된 경우: 계좌별 매입단가, 수익률, 세무 상태를 계층적으로 구조화
  const totalQty = matchingAssets.reduce((sum, item) => sum + item.quantity, 0);
  const subLines: string[] = [
    `\n     * Multi-Account Breakdown (${matchingAssets.length} separate account positions):`,
  ];

  for (const a of matchingAssets) {
    const b = a.brokerId ? brokerMap.get(a.brokerId) : undefined;
    const accountName = b ? (b.nickname || b.broker) : "Unassigned Account";
    const promptInfo = b?.accountType
      ? getAccountTypePromptInfo(b.accountType)
      : {
          labelEn: "Unassigned",
          category: "other" as const,
          categoryTag: "[Unassigned]",
        };

    const qty = a.quantity;
    const avgBuyPrice = a.avgBuyPrice;
    const currentPrice = a.currentPrice ?? a.avgBuyPrice;
    const costLocal = qty * avgBuyPrice;
    const valLocal = qty * currentPrice;
    const pnlLocal = valLocal - costLocal;
    const retPct = costLocal === 0 ? 0 : (pnlLocal / costLocal) * 100;
    const fxRate = a.currency === "KRW" ? 1 : (rates[a.currency] ?? 1);
    const valKRW = a.currency === "KRW" ? valLocal : valLocal * fxRate;
    const sharePct = totalQty > 0 ? (qty / totalQty) * 100 : 0;
    const taxGuidance = getTaxWrapperGuidance(promptInfo.category);
    const countryPrefix = b?.country ? `${b.country}: ` : "";

    subLines.push(
      `       - Account: "${accountName}" (${countryPrefix}${promptInfo.labelEn} ${promptInfo.categoryTag})`,
    );
    subLines.push(
      `         * Holding: ${qty.toLocaleString()} shares (${sharePct.toFixed(1)}% of position) | Value: ${a.currency} ${valLocal.toLocaleString()} (${formatInBase(valKRW, baseCurrency, rates)})`,
    );
    subLines.push(
      `         * Avg Buy Price: ${a.currency} ${avgBuyPrice.toLocaleString()} | Current Price: ${a.currency} ${currentPrice.toLocaleString()}`,
    );
    subLines.push(
      `         * Return: ${sign(retPct)}${retPct.toFixed(1)}% (P&L: ${sign(pnlLocal)}${a.currency} ${pnlLocal.toLocaleString()})`,
    );
    subLines.push(
      `         * Tax Status: ${taxGuidance}`,
    );
  }

  return subLines.join("\n");
}
