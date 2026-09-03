import { describe, it, expect } from "vitest";
import { matchGurus } from "@/utils/guruMatcher";
import { GURU_METADATA } from "@/utils/guruMetadata";
import { GURU_PROFILES } from "@/utils/gurus";

describe("guruMatcher", () => {
  it("covers all 23 historical gurus in GURU_METADATA", () => {
    for (const guru of GURU_PROFILES) {
      const meta = GURU_METADATA[guru.id];
      expect(meta).toBeDefined();
      expect(meta.category).toBeDefined();
      expect(meta.risk).toBeDefined();
      expect(meta.horizon).toBeDefined();
      expect(meta.tone).toBeDefined();
    }
  });

  it("recommends Warren Buffett or Benjamin Graham for conservative value investors seeking warm mentorship", () => {
    const results = matchGurus({
      risk: "conservative",
      strategy: "value",
      tone: "mentor",
    });

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0];
    // Buffett is conservative + value + mentor -> should score 45 + 30 + 25 = 100 -> 98 max
    expect(topMatch.guru.id).toBe("buffett");
    expect(topMatch.score).toBe(98);
    expect(topMatch.matchReasonKey).toBe("guru_match_reason_buffett");
  });

  it("recommends Ray Dalio or John Bogle for passive/all-weather asset allocation", () => {
    const results = matchGurus({
      risk: "balanced",
      strategy: "passive",
      tone: "academic",
    });

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0];
    expect(["dalio", "swensen", "bogle"]).toContain(topMatch.guru.id);
  });

  it("recommends Cathie Wood or William O'Neil for aggressive growth investors", () => {
    const results = matchGurus({
      risk: "aggressive",
      strategy: "growth",
      tone: "mentor",
    });

    expect(results.length).toBeGreaterThan(0);
    const topGuruIds = results.slice(0, 3).map((r) => r.guru.id);
    expect(topGuruIds).toContain("wood");
  });

  it("recommends Nassim Taleb or Michael Burry for hedging and contrarian strategies", () => {
    const results = matchGurus({
      risk: "conservative",
      strategy: "hedge",
      tone: "blunt",
    });

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0];
    expect(topMatch.guru.id).toBe("taleb");
    expect(topMatch.score).toBe(98);
  });

  it("recommends Joel Greenblatt or Joseph Piotroski for quantitative value strategies", () => {
    const results = matchGurus({
      risk: "balanced",
      strategy: "quant",
      tone: "academic",
    });

    expect(results.length).toBeGreaterThan(0);
    const topMatch = results[0];
    expect(topMatch.guru.id).toBe("greenblatt");
  });
});
