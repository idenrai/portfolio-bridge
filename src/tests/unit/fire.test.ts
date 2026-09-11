// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { calculateFire, getTargetAmountFromExpense } from "@/utils/calc/fire";

describe("calculateFire with Longevity Horizon", () => {
  it("computes fire projection accurately with currentAge provided", () => {
    const res = calculateFire({
      currentAssets: 50_000_000,
      monthlySavings: 2_000_000,
      expectedReturnRate: 7,
      targetAmount: 1_000_000_000,
      currentAge: 30,
    });

    expect(res.alreadyReached).toBe(false);
    expect(res.successYear).toBeGreaterThan(0);
    expect(res.successAge).toBe(30 + (res.successYear ?? 0));
    // 100세 기대 수명 기준 인출 기간 검증
    expect(res.retirementYears).toBe(100 - (res.successAge ?? 0));
    // 30세 시작이면 은퇴 기간이 30년을 초과하므로 extended retirement
    expect(res.isExtendedRetirement).toBe(true);
  });

  it("handles late retirement where retirementYears <= 30", () => {
    const res = calculateFire({
      currentAssets: 800_000_000,
      monthlySavings: 5_000_000,
      expectedReturnRate: 5,
      targetAmount: 1_000_000_000,
      currentAge: 70, // 70세 시작
    });

    expect(res.successAge).toBeGreaterThanOrEqual(70);
    expect(res.retirementYears).toBeLessThanOrEqual(30);
    expect(res.isExtendedRetirement).toBe(false);
  });

  it("handles null currentAge gracefully", () => {
    const res = calculateFire({
      currentAssets: 50_000_000,
      monthlySavings: 2_000_000,
      expectedReturnRate: 7,
      targetAmount: 1_000_000_000,
      currentAge: null,
    });

    expect(res.successYear).toBeGreaterThan(0);
    expect(res.successAge).toBeNull();
    expect(res.retirementYears).toBeNull();
    expect(res.isExtendedRetirement).toBe(false);
  });

  it("handles already reached target amount with currentAge", () => {
    const res = calculateFire({
      currentAssets: 1_500_000_000,
      monthlySavings: 2_000_000,
      expectedReturnRate: 7,
      targetAmount: 1_000_000_000,
      currentAge: 40,
    });

    expect(res.alreadyReached).toBe(true);
    expect(res.successYear).toBe(0);
    expect(res.successAge).toBe(40);
    expect(res.retirementYears).toBe(60);
    expect(res.isExtendedRetirement).toBe(true);
  });

  it("calculates target amount correctly from monthly expense and SWR", () => {
    // 300만원 월 지출, 4% 안전인출률: (3,000,000 * 12) / 0.04 = 900,000,000
    const target = getTargetAmountFromExpense(3_000_000, 4);
    expect(target).toBe(900_000_000);
  });

  it("supports custom targetLongevity parameter", () => {
    const res = calculateFire({
      currentAssets: 100_000_000,
      monthlySavings: 3_000_000,
      expectedReturnRate: 6,
      targetAmount: 500_000_000,
      currentAge: 40,
      targetLongevity: 85, // 85세 기대 수명 설정
    });

    expect(res.targetLongevity).toBe(85);
    expect(res.successAge).not.toBeNull();
    expect(res.retirementYears).toBe(85 - (res.successAge ?? 0));
  });
});
