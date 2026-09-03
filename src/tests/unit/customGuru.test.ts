import { describe, it, expect, beforeEach } from "vitest";
import {
  useCustomGuruStore,
  DEFAULT_CUSTOM_GURU,
  type CustomGuruConfig,
} from "@/stores";
import { buildCustomGuruPrompt } from "@/utils/ai/buildCustomGuruPrompt";
import type {
  PortfolioSummary,
  Asset,
  TargetAllocation,
  BrokerAccount,
} from "@/types";

describe("useCustomGuruStore", () => {
  beforeEach(() => {
    useCustomGuruStore.getState().resetConfig();
  });

  it("initializes with DEFAULT_CUSTOM_GURU", () => {
    const config = useCustomGuruStore.getState().config;
    expect(config.name).toBe(DEFAULT_CUSTOM_GURU.name);
    expect(config.riskTolerance).toBe("balanced");
    expect(config.strategy).toBe("all_weather");
    expect(config.tone).toBe("supportive_mentor");
    expect(config.isConfigured).toBe(false);
  });

  it("updates partial config and sets isConfigured to true", () => {
    useCustomGuruStore.getState().updateConfig({
      name: "냉철한 팩트폭격가",
      riskTolerance: "aggressive",
      strategy: "tech_growth",
      tone: "direct_unfiltered",
    });

    const updated = useCustomGuruStore.getState().config;
    expect(updated.name).toBe("냉철한 팩트폭격가");
    expect(updated.riskTolerance).toBe("aggressive");
    expect(updated.strategy).toBe("tech_growth");
    expect(updated.tone).toBe("direct_unfiltered");
    expect(updated.isConfigured).toBe(true);
  });

  it("resets back to default config", () => {
    useCustomGuruStore.getState().updateConfig({
      name: "임시 구루",
      strategy: "deep_value",
    });
    expect(useCustomGuruStore.getState().config.name).toBe("임시 구루");

    useCustomGuruStore.getState().resetConfig();
    expect(useCustomGuruStore.getState().config.name).toBe(
      DEFAULT_CUSTOM_GURU.name,
    );
    expect(useCustomGuruStore.getState().config.isConfigured).toBe(false);
  });
});

describe("buildCustomGuruPrompt", () => {
  const mockConfig: CustomGuruConfig = {
    name: "자산배분 전속 멘토",
    avatarIcon: "sparkles",
    riskTolerance: "aggressive",
    strategy: "dividend_cashflow",
    tone: "direct_unfiltered",
    customPhilosophy: "코인은 매도 권유 금지, 배당금 재투자 최우선",
    isConfigured: true,
  };

  const mockSummary: PortfolioSummary = {
    totalValueKRW: 10_000_000,
    totalCostKRW: 8_000_000,
    totalPnLKRW: 2_000_000,
    totalReturnPercent: 25,
    holdingCount: 2,
    cashPercent: 10,
    holdings: [
      {
        id: "ast-1",
        ticker: "SCHD",
        name: "Schwab US Dividend Equity ETF",
        type: "stock",
        category: "dividend",
        currency: "USD",
        market: "US",
        quantity: 50,
        avgBuyPrice: 70,
        currentPrice: 80,
        valueKRW: 5_400_000,
        costKRW: 4_725_000,
        pnlKRW: 675_000,
        returnPercent: 14.3,
        weightPercent: 54,
      },
      {
        id: "ast-2",
        ticker: "005930.KS",
        name: "삼성전자",
        type: "stock",
        category: "growth",
        currency: "KRW",
        market: "KR",
        quantity: 50,
        avgBuyPrice: 65000,
        currentPrice: 72000,
        valueKRW: 3_600_000,
        costKRW: 3_250_000,
        pnlKRW: 350_000,
        returnPercent: 10.8,
        weightPercent: 36,
      },
    ],
    categoryAllocation: [
      { category: "dividend", valueKRW: 5_400_000, percent: 54 },
      { category: "growth", valueKRW: 3_600_000, percent: 36 },
      { category: "cash", valueKRW: 1_000_000, percent: 10 },
    ],
    marketAllocation: [
      { market: "US", valueKRW: 5_400_000, percent: 54 },
      { market: "KR", valueKRW: 3_600_000, percent: 36 },
    ],
    currencyAllocation: [
      { currency: "USD", valueKRW: 5_400_000, percent: 54 },
      { currency: "KRW", valueKRW: 4_600_000, percent: 46 },
    ],
    assetTypeCount: 1,
    currencyExposure: [
      { currency: "USD", totalLocal: 4000, totalKRW: 5_400_000, percent: 54, rate: 1350 },
      { currency: "KRW", totalLocal: 4_600_000, totalKRW: 4_600_000, percent: 46, rate: 1 },
    ],
    currencyScenarios: [],
    insights: [],
  };

  const mockAssets: Asset[] = [
    {
      id: "ast-1",
      ticker: "SCHD",
      name: "Schwab US Dividend Equity ETF",
      type: "stock",
      categories: ["dividend"],
      currency: "USD",
      market: "US",
      quantity: 50,
      avgBuyPrice: 70,
      currentPrice: 80,
      brokerId: "sbi",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
    {
      id: "ast-2",
      ticker: "005930.KS",
      name: "삼성전자",
      type: "stock",
      categories: ["growth"],
      currency: "KRW",
      market: "KR",
      quantity: 50,
      avgBuyPrice: 65000,
      currentPrice: 72000,
      brokerId: "kis",
      createdAt: "2026-01-01",
      updatedAt: "2026-01-01",
    },
  ];

  const mockTargets: TargetAllocation[] = [
    { category: "dividend", targetPercent: 60 },
    { category: "growth", targetPercent: 30 },
    { category: "cash", targetPercent: 10 },
  ];

  const mockBrokers: BrokerAccount[] = [
    {
      id: "sbi",
      country: "JP",
      broker: "SBI証券",
      accountType: "NISA (성장)",
      nickname: "SBI NISA",
    },
    {
      id: "kis",
      country: "KR",
      broker: "한국투자증권",
      accountType: "일반",
      nickname: "한투 일반",
    },
  ];

  it("injects custom guru persona, risk, strategy, and tone into prompt", () => {
    const prompt = buildCustomGuruPrompt(
      mockConfig,
      mockSummary,
      mockAssets,
      mockTargets,
      "ko",
      "KRW",
      { KRW: 1, USD: 1350, JPY: 9 },
      { nickname: "홍길동", age: 35 },
      mockBrokers,
    );

    expect(prompt).toContain("You are 자산배분 전속 멘토");
    expect(prompt).toContain("High-conviction growth");
    expect(prompt).toContain("Dividend & Cash Flow");
    expect(prompt).toContain("Direct, blunt, and uncompromising");
    expect(prompt).toContain("코인은 매도 권유 금지, 배당금 재투자 최우선");
    expect(prompt).toContain("Name: 홍길동");
    expect(prompt).toContain("Age: 35");
    expect(prompt).toContain("IMPORTANT - MULTI-ACCOUNT & TAX-AWARE ADVICE");
    expect(prompt).toContain("ALLOCATION BY CATEGORY (vs your custom target)");
    expect(prompt).toContain("respond entirely in Korean (한국어)");
  });

  it("handles empty target allocations gracefully by advising benchmark recommendation", () => {
    const prompt = buildCustomGuruPrompt(
      mockConfig,
      mockSummary,
      mockAssets,
      [], // no custom targets set
      "en",
    );

    expect(prompt).toContain(
      "The investor has not yet set explicit target allocation percentages",
    );
    expect(prompt).toContain("respond entirely in English");
  });
});
