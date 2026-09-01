// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import {
  ACCOUNT_TYPES_BY_COUNTRY,
  getAccountTypeBadgeStyle,
} from "@/constants/accountTypes";

describe("Account Types presets and badge styling", () => {
  it("provides comprehensive presets for all supported markets", () => {
    const markets = ["JP", "KR", "US", "EU", "OTHER"] as const;

    for (const market of markets) {
      const presets = ACCOUNT_TYPES_BY_COUNTRY[market];
      expect(presets).toBeDefined();
      expect(presets.length).toBeGreaterThan(0);
      presets.forEach((opt) => {
        expect(opt.value).toBeTruthy();
        expect(opt.label).toBeTruthy();
        expect(["tax_free", "pension", "taxable", "other"]).toContain(
          opt.category,
        );
      });
    }
  });

  it("contains specific key presets for each market", () => {
    // JP: NISA (성장), NISA (적립), 特定, iDeCo
    const jpValues = ACCOUNT_TYPES_BY_COUNTRY.JP.map((o) => o.value);
    expect(jpValues).toContain("NISA (성장)");
    expect(jpValues).toContain("NISA (적립)");
    expect(jpValues).toContain("特定");
    expect(jpValues).toContain("iDeCo");

    // KR: ISA, 연금저축, IRP, 일반위탁
    const krValues = ACCOUNT_TYPES_BY_COUNTRY.KR.map((o) => o.value);
    expect(krValues).toContain("ISA");
    expect(krValues).toContain("연금저축");
    expect(krValues).toContain("IRP");
    expect(krValues).toContain("일반위탁");

    // US: Roth IRA, 401(k), Taxable, HSA
    const usValues = ACCOUNT_TYPES_BY_COUNTRY.US.map((o) => o.value);
    expect(usValues).toContain("Roth IRA");
    expect(usValues).toContain("401(k)");
    expect(usValues).toContain("Taxable");
    expect(usValues).toContain("HSA");
  });

  it("returns emerald badge style for tax-advantaged accounts", () => {
    const taxFreeTypes = [
      "NISA",
      "nisa",
      "ISA",
      "중개형 ISA",
      "Roth IRA",
      "HSA",
      "해외주식비과세",
      "PEA / ISA",
    ];

    for (const type of taxFreeTypes) {
      const style = getAccountTypeBadgeStyle(type);
      expect(style).toContain("emerald");
    }
  });

  it("returns violet badge style for retirement / pension accounts", () => {
    const pensionTypes = [
      "연금저축",
      "IRP",
      "iDeCo",
      "401(k)",
      "Traditional IRA",
      "Riester / Rürup",
    ];

    for (const type of pensionTypes) {
      const style = getAccountTypeBadgeStyle(type);
      expect(style).toContain("violet");
    }
  });

  it("returns amber badge style for crypto, CMA, corporate accounts", () => {
    const otherTypes = ["Crypto Wallet", "CMA", "법인", "法人口座"];

    for (const type of otherTypes) {
      const style = getAccountTypeBadgeStyle(type);
      expect(style).toContain("amber");
    }
  });

  it("returns default zinc badge style for standard taxable / general accounts", () => {
    const taxableTypes = ["特定", "一般", "일반위탁", "Taxable", "Standard Depot"];

    for (const type of taxableTypes) {
      const style = getAccountTypeBadgeStyle(type);
      expect(style).toContain("zinc");
    }
  });
});
