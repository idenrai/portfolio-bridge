import { describe, it, expect } from 'vitest';
import { toKRW, fromKRW, formatPercent } from '@/utils/calc/currency';

describe('currency utilities', () => {
  const mockRates = {
    KRW: 1,
    USD: 1400,
    JPY: 9,
    EUR: 1450,
  };

  it('toKRW converts correctly', () => {
    expect(toKRW(100, 'USD', mockRates)).toBe(140000);
    expect(toKRW(1000, 'JPY', mockRates)).toBe(9000);
    expect(toKRW(500, 'KRW', mockRates)).toBe(500);
  });

  it('fromKRW converts correctly', () => {
    expect(fromKRW(140000, 'USD', mockRates)).toBe(100);
    expect(fromKRW(9000, 'JPY', mockRates)).toBe(1000);
    expect(fromKRW(500, 'KRW', mockRates)).toBe(500);
  });

  it('formatPercent formats correctly', () => {
    expect(formatPercent(5.123)).toBe('+5.1%');
    expect(formatPercent(-2.56, 2)).toBe('-2.56%');
    expect(formatPercent(0)).toBe('+0.0%');
  });
});
