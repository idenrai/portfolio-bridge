// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import {
  createFullBackup,
  validateBackupData,
  sanitizeAssets,
  sanitizeSnapshots,
  sanitizeBrokerAccounts,
  importFullBackupFromJson,
} from "@/utils/backup";
import {
  useAssetStore,
  useSettingsStore,
  useProfileStore,
  useFireStore,
} from "@/stores";

describe("jsonBackup utility", () => {
  beforeEach(() => {
    localStorage.clear();
    useAssetStore.setState({ assets: [] });
    useProfileStore.setState({
      nickname: "테스터",
      age: 30,
      annualIncome: 50000000,
      monthlyBudget: 3000000,
      plan3y: "",
      plan5y: "",
      plan10y: "",
      notes: "",
    });
    useSettingsStore.setState((s) => ({
      ...s,
      baseCurrency: "KRW",
      targetAllocations: [],
    }));
    useFireStore.setState({
      mode: "expense",
      monthlySavings: 2000000,
      expectedReturnRate: 8,
      targetAmount: 1500000000,
      monthlyExpense: 3500000,
      safeWithdrawalRate: 4,
      currentAge: 32,
      usePortfolioAssets: true,
      manualCurrentAssets: 0,
    });
  });

  it("createFullBackup creates a valid backup snapshot with current store data", () => {
    const backup = createFullBackup();

    expect(backup.app).toBe("PortfolioBridge");
    expect(backup.version).toBe(1);
    expect(backup.exportedAt).toBeTruthy();
    expect(backup.data.profile.nickname).toBe("테스터");
    expect(backup.data.fire.monthlySavings).toBe(2000000);
    expect(backup.data.fire.expectedReturnRate).toBe(8);
    expect(backup.data.settings.baseCurrency).toBe("KRW");
  });

  it("validateBackupData correctly validates schema integrity", () => {
    const valid = createFullBackup();
    expect(validateBackupData(valid)).toBe(true);

    expect(validateBackupData(null)).toBe(false);
    expect(validateBackupData({})).toBe(false);
    expect(validateBackupData({ app: "OtherApp", version: 1, data: {} })).toBe(false);
    expect(validateBackupData({ app: "PortfolioBridge", version: 2, data: {} })).toBe(false);
    expect(
      validateBackupData({
        app: "PortfolioBridge",
        version: 1,
        data: { assets: "invalid", settings: {} },
      }),
    ).toBe(false);
  });

  it("importFullBackupFromJson restores all store data successfully", () => {
    const sampleBackup = {
      app: "PortfolioBridge",
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        assets: [
          {
            id: "test-asset-1",
            name: "삼성전자",
            ticker: "005930.KS",
            type: "stock",
            market: "KR",
            currency: "KRW",
            quantity: 50,
            avgBuyPrice: 70000,
            currentPrice: 75000,
            categories: ["stock"],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
        settings: {
          baseCurrency: "USD",
          targetAllocations: [{ category: "stock", percentage: 70 }],
        },
        profile: {
          nickname: "워런 버핏",
          age: 94,
          annualIncome: 100000000,
          monthlyBudget: 5000000,
          plan3y: "가치투자",
          plan5y: "장기보유",
          plan10y: "복리효과",
          notes: "현금 비중 유지",
        },
        snapshots: [],
        brokerAccounts: [],
        fire: {
          mode: "target",
          monthlySavings: 5000000,
          expectedReturnRate: 10,
          targetAmount: 3000000000,
          monthlyExpense: 5000000,
          safeWithdrawalRate: 3.5,
          currentAge: 40,
          usePortfolioAssets: false,
          manualCurrentAssets: 500000000,
        },
        lang: "ko",
      },
    };

    const res = importFullBackupFromJson(JSON.stringify(sampleBackup));
    expect(res.success).toBe(true);

    // 스토어 복원 검증
    expect(useAssetStore.getState().assets).toHaveLength(1);
    expect(useAssetStore.getState().assets[0].name).toBe("삼성전자");
    expect(useSettingsStore.getState().baseCurrency).toBe("USD");
    expect(useProfileStore.getState().nickname).toBe("워런 버핏");
    expect(useFireStore.getState().mode).toBe("target");
    expect(useFireStore.getState().monthlySavings).toBe(5000000);
    expect(useFireStore.getState().targetAmount).toBe(3000000000);
  });

  it("importFullBackupFromJson returns error on invalid JSON", () => {
    const res = importFullBackupFromJson("{ invalid-json");
    expect(res.success).toBe(false);
    expect(res.error).toBeTruthy();
  });

  it("sanitizeAssets filters out malformed or corrupted asset records", () => {
    const rawList = [
      {
        id: "valid-1",
        name: "애플",
        type: "stock",
        market: "US",
        currency: "USD",
        quantity: 10,
        avgBuyPrice: 150,
        currentPrice: 180,
        categories: ["growth"],
      },
      null,
      "invalid-string",
      { id: "", name: "무효 ID" },
      { id: "invalid-2", name: "" },
      { id: "invalid-3", name: "수량 NaN", type: "stock", market: "US", currency: "USD", quantity: NaN, avgBuyPrice: 10, currentPrice: 10, categories: [] },
      { id: "invalid-4", name: "카테고리 누락", type: "stock", market: "US", currency: "USD", quantity: 1, avgBuyPrice: 10, currentPrice: 10 },
    ];

    const cleaned = sanitizeAssets(rawList);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0].id).toBe("valid-1");
    expect(cleaned[0].name).toBe("애플");
  });

  it("sanitizeSnapshots filters out malformed snapshot records", () => {
    const rawList = [
      { date: "2026-09-12", totalValueKRW: 100000000, totalCostKRW: 80000000 },
      null,
      { date: "invalid-date", totalValueKRW: 100, totalCostKRW: 100 },
      { date: "2026-09-12", totalValueKRW: NaN, totalCostKRW: 100 },
      { date: "2026-09-12", totalValueKRW: 100, totalCostKRW: NaN },
    ];

    const cleaned = sanitizeSnapshots(rawList);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0].date).toBe("2026-09-12");
  });

  it("sanitizeBrokerAccounts filters out malformed broker account records", () => {
    const rawList = [
      { id: "broker-1", country: "KR", broker: "미래에셋" },
      null,
      { id: "", country: "KR", broker: "한국투자" },
      { id: "broker-2", country: "KR", broker: "" },
      { id: "broker-3", country: "", broker: "삼성증권" },
    ];

    const cleaned = sanitizeBrokerAccounts(rawList);
    expect(cleaned).toHaveLength(1);
    expect(cleaned[0].id).toBe("broker-1");
    expect(cleaned[0].broker).toBe("미래에셋");
  });

  it("importFullBackupFromJson rejects excessively large JSON approaching quota limit", () => {
    // 4.5MB 초과 문자열 (2.5M 글자 * 2 = 5MB)
    const hugeString = "a".repeat(2.5 * 1024 * 1024);
    const res = importFullBackupFromJson(hugeString);
    expect(res.success).toBe(false);
    expect(res.error).toBe("quota_exceeded");
  });
});
