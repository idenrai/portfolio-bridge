import type { Page } from "@playwright/test";

export interface MockAssetItem {
  id: string;
  name: string;
  ticker: string;
  type: string;
  market: string;
  currency: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  categories: string[];
  visibility?: string;
  brokerId?: string;
  accountId?: string;
  taxWrapper?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface MockAccountItem {
  id: string;
  name: string;
  broker?: string;
  nickname?: string;
  accountType?: string;
  country?: string;
  type?: string;
  taxWrapper?: string;
  currency?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface SetupPortfolioOptions {
  assets?: MockAssetItem[];
  accounts?: MockAccountItem[];
  baseCurrency?: "KRW" | "USD" | "JPY" | "EUR";
  targetAllocations?: Array<{ category: string; targetPercent: number }>;
  lang?: "ko" | "en" | "ja" | "de";
  customGuruConfig?: {
    name?: string;
    avatarIcon?: string;
    riskPreference?: string;
    investmentHorizon?: string;
    advisoryTone?: string;
    primaryStrategy?: string;
    userPrinciples?: string;
  };
}

/**
 * Zustand persist 스토리지 규약({ state, version: 0 })을 완벽히 준수하여
 * Playwright 테스트 환경의 localStorage를 주입하는 헬퍼 함수입니다.
 */
export async function setupTestPortfolio(
  page: Page,
  options: SetupPortfolioOptions = {},
) {
  const {
    assets = [
      {
        id: "mock-asset-1",
        name: "Apple Inc.",
        ticker: "AAPL",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 50,
        avgBuyPrice: 150,
        currentPrice: 200,
        categories: ["growth"],
        visibility: "all",
        createdAt: "2026-01-01T00:00:00Z",
        updatedAt: "2026-01-01T00:00:00Z",
      },
    ],
    accounts = [],
    baseCurrency = "KRW",
    targetAllocations = [
      { category: "growth", targetPercent: 50 },
      { category: "value", targetPercent: 50 },
    ],
    lang = "ko",
    customGuruConfig,
  } = options;

  await page.addInitScript(
    ({
      assets,
      accounts,
      baseCurrency,
      targetAllocations,
      lang,
      customGuruConfig,
    }) => {
      localStorage.setItem(
        "portfolio-bridge-assets",
        JSON.stringify({
          state: { assets },
          version: 0,
        }),
      );

      localStorage.setItem(
        "portfolio-bridge-settings",
        JSON.stringify({
          state: {
            baseCurrency,
            targetAllocations,
          },
          version: 0,
        }),
      );

      localStorage.setItem(
        "portfolio-bridge-lang",
        JSON.stringify({
          state: { lang },
          version: 0,
        }),
      );

      if (accounts && accounts.length > 0) {
        localStorage.setItem(
          "portfolio-bridge-brokers",
          JSON.stringify({
            state: { accounts },
            version: 0,
          }),
        );
      }

      if (customGuruConfig) {
        localStorage.setItem(
          "portfolio-bridge-custom-guru",
          JSON.stringify({
            state: { config: customGuruConfig },
            version: 0,
          }),
        );
      }
    },
    {
      assets,
      accounts,
      baseCurrency,
      targetAllocations,
      lang,
      customGuruConfig,
    },
  );
}
