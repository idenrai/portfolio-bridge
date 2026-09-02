// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import {
  buildHoldingRows,
  buildPortfolioDataBlock,
  getAccountTypePromptInfo,
} from "@/utils/ai/promptHelpers";
import { buildGuruPrompt } from "@/utils/ai/buildGuruPrompt";
import { GURU_PROFILES } from "@/utils/gurus";
import type { Asset, BrokerAccount, PortfolioSummary } from "@/types";

describe("AI prompt account breakdown helpers", () => {
  const mockBrokers: BrokerAccount[] = [
    {
      id: "broker-nisa",
      country: "JP",
      broker: "SBI証券",
      accountType: "NISA",
      nickname: "SBI NISA",
    },
    {
      id: "broker-taxable",
      country: "JP",
      broker: "SBI証券",
      accountType: "특정",
      nickname: "SBI 특정",
    },
    {
      id: "broker-isa",
      country: "KR",
      broker: "미래에셋",
      accountType: "ISA",
      nickname: "미래 ISA",
    },
  ];

  const mockAssets: Asset[] = [
    {
      id: "asset-sanrio-1",
      name: "Sanrio Company, Ltd.",
      ticker: "8136.T",
      type: "stock",
      market: "JP",
      currency: "JPY",
      quantity: 500,
      avgBuyPrice: 3000,
      currentPrice: 4000,
      categories: ["growth"],
      brokerId: "broker-nisa",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "asset-sanrio-2",
      name: "Sanrio Company, Ltd.",
      ticker: "8136.T",
      type: "stock",
      market: "JP",
      currency: "JPY",
      quantity: 100,
      avgBuyPrice: 3500,
      currentPrice: 4000,
      categories: ["growth"],
      brokerId: "broker-taxable",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "asset-samsung",
      name: "삼성전자",
      ticker: "005930.KS",
      type: "stock",
      market: "KR",
      currency: "KRW",
      quantity: 50,
      avgBuyPrice: 70000,
      currentPrice: 80000,
      categories: ["dividend"],
      brokerId: "broker-isa",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "asset-apple",
      name: "Apple Inc.",
      ticker: "AAPL",
      type: "stock",
      market: "US",
      currency: "USD",
      quantity: 10,
      avgBuyPrice: 150,
      currentPrice: 200,
      categories: ["growth"],
      // 계좌 미지정
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ];

  const mockSummary: PortfolioSummary = {
    totalValueKRW: 30000000,
    totalCostKRW: 25000000,
    totalPnLKRW: 5000000,
    totalReturnPercent: 20,
    holdingCount: 3,
    assetTypeCount: 1,
    cashPercent: 0,
    categoryAllocation: [],
    marketAllocation: [],
    currencyAllocation: [],
    currencyExposure: [],
    currencyScenarios: [],
    insights: [],
    holdings: [
      {
        id: "t:8136.T",
        name: "Sanrio Company, Ltd.",
        ticker: "8136.T",
        type: "stock",
        market: "JP",
        currency: "JPY",
        quantity: 600, // 500 + 100
        avgBuyPrice: 3083.33,
        currentPrice: 4000,
        category: "growth",
        valueKRW: 21600000,
        costKRW: 16650000,
        pnlKRW: 4950000,
        returnPercent: 29.7,
        weightPercent: 72.0,
      },
      {
        id: "t:005930.KS",
        name: "삼성전자",
        ticker: "005930.KS",
        type: "stock",
        market: "KR",
        currency: "KRW",
        quantity: 50,
        avgBuyPrice: 70000,
        currentPrice: 80000,
        category: "dividend",
        valueKRW: 4000000,
        costKRW: 3500000,
        pnlKRW: 500000,
        returnPercent: 14.3,
        weightPercent: 13.3,
      },
      {
        id: "t:AAPL",
        name: "Apple Inc.",
        ticker: "AAPL",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 10,
        avgBuyPrice: 150,
        currentPrice: 200,
        category: "growth",
        valueKRW: 2700000,
        costKRW: 2025000,
        pnlKRW: 675000,
        returnPercent: 33.3,
        weightPercent: 9.0,
      },
    ],
  };

  it("builds multi-account and single-account breakdown in buildHoldingRows with English tax labels", () => {
    const { rows } = buildHoldingRows(mockSummary, mockAssets, mockBrokers);

    // Sanrio: 2개 계좌에 분산 (500 in SBI NISA, 100 in SBI 특정)
    expect(rows).toContain(
      'accounts: 500 in "SBI NISA" (NISA [Tax-Free]), 100 in "SBI 특정" (Specific/Withholding Tax [Taxable])',
    );

    // 삼성전자: 1개 계좌 (50 in 미래 ISA)
    expect(rows).toContain('account: 50 in "미래 ISA" (ISA [Tax-Free])');

    // Apple: 계좌 미지정
    const appleLine = rows.split("\n").find((l) => l.includes("Apple Inc."));
    expect(appleLine).toBeDefined();
    expect(appleLine).not.toContain("account");
  });

  it("includes account tax allocation overview and holding breakdown in buildPortfolioDataBlock", () => {
    const block = buildPortfolioDataBlock(
      mockSummary,
      mockAssets,
      "KRW",
      { KRW: 1, USD: 1350, JPY: 9 },
      "category data",
      "ALLOCATION BY CATEGORY",
      mockBrokers,
    );

    // 세무 배분 요약 블록 확인
    expect(block).toContain("--- ALLOCATION BY ACCOUNT & TAX STATUS ---");
    expect(block).toContain("Tax-Advantaged Total:");
    expect(block).toContain("Tax-Free (e.g., NISA, ISA, Roth):");
    expect(block).toContain("Taxable Accounts (Standard / Specific):");
    expect(block).toContain('"SBI NISA" (JP: NISA [Tax-Free])');

    // 종목별 행 확인
    expect(block).toContain(
      'accounts: 500 in "SBI NISA" (NISA [Tax-Free]), 100 in "SBI 특정" (Specific/Withholding Tax [Taxable])',
    );
    expect(block).toContain('account: 50 in "미래 ISA" (ISA [Tax-Free])');
  });

  it("includes account breakdown and tax-efficient asset location guidelines in buildGuruPrompt", () => {
    const buffett = GURU_PROFILES.find((g) => g.id === "buffett")!;
    const prompt = buildGuruPrompt(
      buffett,
      mockSummary,
      mockAssets,
      "ko",
      "KRW",
      { KRW: 1, USD: 1350, JPY: 9 },
      "Buffett philosophy",
      undefined,
      mockBrokers,
    );

    expect(prompt).toContain(
      'accounts: 500 in "SBI NISA" (NISA [Tax-Free]), 100 in "SBI 특정" (Specific/Withholding Tax [Taxable])',
    );
    expect(prompt).toContain("Tax-Efficient Asset Location");
    expect(prompt).toContain("ALLOCATION BY ACCOUNT & TAX STATUS");
  });

  it("correctly categorizes and translates various account types in getAccountTypePromptInfo", () => {
    // JP
    expect(getAccountTypePromptInfo("NISA (성장)")).toEqual({
      labelEn: "NISA Growth",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    });
    expect(getAccountTypePromptInfo("NISA (적립)")).toEqual({
      labelEn: "NISA Accumulation",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    });
    expect(getAccountTypePromptInfo("特定")).toEqual({
      labelEn: "Specific/Withholding Tax",
      category: "taxable",
      categoryTag: "[Taxable]",
    });
    expect(getAccountTypePromptInfo("iDeCo")).toEqual({
      labelEn: "iDeCo Pension",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    });

    // KR
    expect(getAccountTypePromptInfo("ISA")).toEqual({
      labelEn: "ISA",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    });
    expect(getAccountTypePromptInfo("연금저축")).toEqual({
      labelEn: "Pension Savings",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    });
    expect(getAccountTypePromptInfo("IRP")).toEqual({
      labelEn: "IRP Retirement",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    });
    expect(getAccountTypePromptInfo("일반위탁")).toEqual({
      labelEn: "Standard Brokerage",
      category: "taxable",
      categoryTag: "[Taxable]",
    });

    // US
    expect(getAccountTypePromptInfo("Roth IRA")).toEqual({
      labelEn: "Roth IRA",
      category: "tax_free",
      categoryTag: "[Tax-Free]",
    });
    expect(getAccountTypePromptInfo("401(k)")).toEqual({
      labelEn: "401(k) Pension",
      category: "pension",
      categoryTag: "[Tax-Deferred Pension]",
    });
  });
});
