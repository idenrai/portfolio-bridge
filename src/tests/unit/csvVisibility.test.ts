import { describe, it, expect } from "vitest";
import { exportToCsv, parseCsv } from "@/utils/csv";
import type { Asset } from "@/types";

describe("CSV Export and Parse with Visibility", () => {
  const sampleAssets: Asset[] = [
    {
      id: "1",
      name: "Samsung",
      ticker: "005930.KS",
      type: "stock",
      market: "KR",
      currency: "KRW",
      quantity: 10,
      avgBuyPrice: 70000,
      currentPrice: 75000,
      categories: ["growth"],
      visibility: "dashboard_only",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "2",
      name: "Bitcoin",
      type: "crypto",
      market: "OTHER",
      currency: "USD",
      quantity: 0.5,
      avgBuyPrice: 60000,
      currentPrice: 65000,
      categories: ["crypto"],
      visibility: "guru_only",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
    {
      id: "3",
      name: "Secret Stock",
      type: "stock",
      market: "US",
      currency: "USD",
      quantity: 100,
      avgBuyPrice: 10,
      currentPrice: 12,
      categories: [],
      visibility: "hidden",
      createdAt: "2026-01-01T00:00:00Z",
      updatedAt: "2026-01-01T00:00:00Z",
    },
  ];

  it("exports assets with visibility column", () => {
    const csv = exportToCsv(sampleAssets);
    const lines = csv.trim().split("\n");
    expect(lines[0]).toContain("visibility");
    expect(lines[1]).toContain("dashboard_only");
    expect(lines[2]).toContain("guru_only");
    expect(lines[3]).toContain("hidden");
  });

  it("parses CSV with visibility correctly", () => {
    const csv = exportToCsv(sampleAssets);
    const parsed = parseCsv(csv);
    expect(parsed.length).toBe(3);
    expect(parsed[0].visibility).toBe("dashboard_only");
    expect(parsed[1].visibility).toBe("guru_only");
    expect(parsed[2].visibility).toBe("hidden");
  });

  it("parses legacy 10-column CSV without visibility and defaults to 'all'", () => {
    const legacyCsv = [
      "name,ticker,type,market,currency,quantity,avgBuyPrice,currentPrice,categories,memo",
      '"Legacy Stock","LEG","stock","US","USD",10,100,110,"growth","some memo"',
    ].join("\n");

    const parsed = parseCsv(legacyCsv);
    expect(parsed.length).toBe(1);
    expect(parsed[0].name).toBe("Legacy Stock");
    expect(parsed[0].visibility).toBe("all");
  });
});
