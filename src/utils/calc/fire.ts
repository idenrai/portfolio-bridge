export interface FireCalculationParams {
  currentAssets: number;
  monthlySavings: number;
  expectedReturnRate: number; // in %
  targetAmount: number;
  currentAge: number | null;
}

export interface FireDataPoint {
  year: number;
  age: number | null;
  asset: number;
  target: number;
}

export interface FireResult {
  data: FireDataPoint[];
  successYear: number | null;
  successAge: number | null;
  alreadyReached: boolean;
  isInvalidInput?: boolean;
}

export function calculateFire(params: FireCalculationParams, maxYears: number = 60): FireResult {
  const { currentAssets, monthlySavings, expectedReturnRate, targetAmount, currentAge } = params;

  if (monthlySavings > targetAmount) {
    return {
      data: [],
      successYear: null,
      successAge: null,
      alreadyReached: false,
      isInvalidInput: true,
    };
  }
  
  if (currentAssets >= targetAmount) {
    return {
      data: [{ year: 0, age: currentAge, asset: currentAssets, target: targetAmount }],
      successYear: 0,
      successAge: currentAge,
      alreadyReached: true,
    };
  }

  const annualReturnRate = expectedReturnRate / 100;
  const annualSavings = monthlySavings * 12;

  let current = currentAssets;
  let year = 0;
  let successYear: number | null = null;
  const data: FireDataPoint[] = [];

  data.push({
    year: 0,
    age: currentAge,
    asset: current,
    target: targetAmount,
  });

  while (year < maxYears) {
    year++;
    // Simple compound: End of year balance = (start balance * (1 + rate)) + annual savings
    current = current * (1 + annualReturnRate) + annualSavings;

    const currentAgeForYear = currentAge !== null ? currentAge + year : null;

    data.push({
      year,
      age: currentAgeForYear,
      asset: current,
      target: targetAmount,
    });

    if (current >= targetAmount && successYear === null) {
      successYear = year;
      break; 
    }
  }

  // Add up to 3 more years after reaching the goal to make the chart look complete
  if (successYear !== null) {
    const extraYears = Math.min(3, maxYears - year);
    for (let i = 0; i < extraYears; i++) {
      year++;
      current = current * (1 + annualReturnRate) + annualSavings;
      data.push({
        year,
        age: currentAge !== null ? currentAge + year : null,
        asset: current,
        target: targetAmount,
      });
    }
  }

  return {
    data,
    successYear,
    successAge: successYear !== null && currentAge !== null ? currentAge + successYear : null,
    alreadyReached: false,
  };
}

/**
 * Calculate required FIRE target amount using the Safe Withdrawal Rate
 * e.g., 4% rule: Target = (Monthly Expense * 12) / 0.04
 */
export function getTargetAmountFromExpense(monthlyExpense: number, safeWithdrawalRate: number): number {
  if (safeWithdrawalRate <= 0) return 0;
  const annualExpense = monthlyExpense * 12;
  return annualExpense / (safeWithdrawalRate / 100);
}
