import { describe, it, expect } from 'vitest';
import { toKRW, fromKRW, formatPercent, formatCurrency } from '@/utils/calc/currency';

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

  it('formatPercent formats correctly with default signed option', () => {
    expect(formatPercent(5.123)).toBe('+5.1%');
    expect(formatPercent(-2.56, 2)).toBe('-2.56%');
    expect(formatPercent(0)).toBe('+0.0%');
    // Ensure no duplicate plus
    expect(formatPercent(6.8)).toBe('+6.8%');
  });

  it('formatPercent formats correctly when signed is false', () => {
    expect(formatPercent(5.123, 1, { signed: false })).toBe('5.1%');
    expect(formatPercent(-2.56, 2, { signed: false })).toBe('-2.56%');
    expect(formatPercent(0, 1, { signed: false })).toBe('0.0%');
  });

  it('formatCurrency formats correctly with and without positive sign', () => {
    // Default showPositiveSign = false
    expect(formatCurrency(284492, 'JPY')).toBe('¥284,492');
    expect(formatCurrency(-284492, 'JPY')).toBe('-¥284,492');
    expect(formatCurrency(0, 'JPY')).toBe('¥0');

    // showPositiveSign = true
    expect(formatCurrency(284492, 'JPY', false, true)).toBe('+¥284,492');
    expect(formatCurrency(-284492, 'JPY', false, true)).toBe('-¥284,492');
    expect(formatCurrency(0, 'JPY', false, true)).toBe('¥0');

    // USD
    expect(formatCurrency(1234.56, 'USD', false, true)).toBe('+$1,234.56');
    expect(formatCurrency(-1234.56, 'USD', false, true)).toBe('-$1,234.56');
  });

  it('formatCurrency compact units respect UI language settings', () => {
    // Korean UI (ko): JPY currency formatted with 억 / 만
    expect(formatCurrency(240000000, 'JPY', true, false, 'ko')).toBe('¥2.4억');
    expect(formatCurrency(60000000, 'JPY', true, false, 'ko')).toBe('¥6,000만');
    expect(formatCurrency(150000000, 'USD', true, false, 'ko')).toBe('$1.5억');

    // Japanese UI (ja): JPY currency formatted with 億 / 万
    expect(formatCurrency(240000000, 'JPY', true, false, 'ja')).toBe('¥2.4億');
    expect(formatCurrency(60000000, 'JPY', true, false, 'ja')).toBe('¥6,000万');

    // English / German UI (en / de): formatted with B / M / K
    expect(formatCurrency(240000000, 'JPY', true, false, 'en')).toBe('¥240M');
    expect(formatCurrency(60000000, 'JPY', true, false, 'en')).toBe('¥60M');
    expect(formatCurrency(15000, 'USD', true, false, 'en')).toBe('$15K');
    expect(formatCurrency(2500000000, 'USD', true, false, 'en')).toBe('$2.5B');
  });
});

