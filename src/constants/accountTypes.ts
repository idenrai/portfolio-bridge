import type { Market } from "@/types";

export type AccountTypeCategory = "tax_free" | "pension" | "taxable" | "other";

export interface AccountTypeOption {
  value: string;
  label: string;
  category: AccountTypeCategory;
}

export const ACCOUNT_TYPES_BY_COUNTRY: Record<Market, AccountTypeOption[]> = {
  JP: [
    { value: "NISA", label: "NISA (성장·적립 / 少額投資非課税)", category: "tax_free" },
    { value: "特定", label: "特定 (원천징수 과세 / 特定口座)", category: "taxable" },
    { value: "一般", label: "一般 (일반과세 / 一般口座)", category: "taxable" },
    { value: "iDeCo", label: "iDeCo (개인형 확정기여연금)", category: "pension" },
    { value: "法人口座", label: "法人口座 (법인계좌)", category: "other" },
  ],
  KR: [
    { value: "일반위탁", label: "일반위탁 (종합매매 / 주식계좌)", category: "taxable" },
    { value: "ISA", label: "ISA (개인종합자산관리계좌)", category: "tax_free" },
    { value: "연금저축", label: "연금저축 (연금저축펀드/신탁)", category: "pension" },
    { value: "IRP", label: "IRP (개인형 퇴직연금)", category: "pension" },
    { value: "CMA", label: "CMA (수시입출금 / 자산관리)", category: "other" },
    { value: "해외주식비과세", label: "해외주식 비과세 (전용펀드)", category: "tax_free" },
  ],
  US: [
    { value: "Taxable", label: "Taxable (Standard Brokerage)", category: "taxable" },
    { value: "Roth IRA", label: "Roth IRA (Tax-Free Retirement)", category: "tax_free" },
    { value: "Traditional IRA", label: "Traditional IRA (Tax-Deferred)", category: "pension" },
    { value: "401(k)", label: "401(k) / Solo 401(k) (Employer Pension)", category: "pension" },
    { value: "HSA", label: "HSA (Health Savings Account)", category: "tax_free" },
  ],
  EU: [
    { value: "Standard Depot", label: "Standard Depot (Wertpapierdepot)", category: "taxable" },
    { value: "Sparplan", label: "Sparplan (Wertpapiersparplan)", category: "taxable" },
    { value: "Riester / Rürup", label: "Riester / Rürup (Altersvorsorge)", category: "pension" },
    { value: "PEA / ISA", label: "PEA / ISA (Tax-Advantaged Share Account)", category: "tax_free" },
  ],
  OTHER: [
    { value: "Taxable", label: "Taxable / General Brokerage", category: "taxable" },
    { value: "Tax-Advantaged", label: "Tax-Advantaged / Tax-Free", category: "tax_free" },
    { value: "Pension", label: "Pension / Retirement", category: "pension" },
    { value: "Crypto Wallet", label: "Crypto Wallet / Exchange", category: "other" },
    { value: "Bank Deposit", label: "Bank Deposit / Savings", category: "other" },
  ],
};

/**
 * 계좌 유형 문자열을 분석하여 시각적 배지 컬러 클래스 반환
 */
export function getAccountTypeBadgeStyle(accountType?: string): string {
  if (!accountType) return "border-zinc-700 bg-zinc-800/60 text-zinc-400";

  const lower = accountType.toLowerCase();

  // 비과세 / 절세 계좌 (에메랄드 틴트)
  if (
    lower.includes("nisa") ||
    lower.includes("isa") ||
    lower.includes("roth") ||
    lower.includes("hsa") ||
    lower.includes("pea") ||
    lower.includes("비과세") ||
    lower.includes("tax-advantaged") ||
    lower.includes("tax-free")
  ) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
  }

  // 연금 / 퇴직 계좌 (바이올렛 틴트)
  if (
    lower.includes("연금") ||
    lower.includes("irp") ||
    lower.includes("ideco") ||
    lower.includes("401") ||
    lower.includes("ira") ||
    lower.includes("pension") ||
    lower.includes("retirement") ||
    lower.includes("riester") ||
    lower.includes("rürup") ||
    lower.includes("rurup")
  ) {
    return "border-violet-500/30 bg-violet-500/10 text-violet-400";
  }

  // 가상자산 / CMA / 법인 / 특수 계좌 (앰버 틴트)
  if (
    lower.includes("crypto") ||
    lower.includes("cma") ||
    lower.includes("법인") ||
    lower.includes("法人") ||
    lower.includes("코인") ||
    lower.includes("wallet")
  ) {
    return "border-amber-500/30 bg-amber-500/10 text-amber-400";
  }

  // 일반 과세 계좌 (징크/슬레이트 틴트)
  return "border-zinc-700 bg-zinc-800/60 text-zinc-300";
}
