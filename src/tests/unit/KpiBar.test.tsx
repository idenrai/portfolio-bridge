// @vitest-environment jsdom
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KpiBar } from '@/components/dashboard/KpiBar';
import type { PortfolioSummary } from '@/types';

describe('KpiBar Component', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  const renderWithProviders = (ui: React.ReactElement) =>
    render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);

  const sampleSummary: PortfolioSummary = {
    totalValueKRW: 44586710,
    totalCostKRW: 41741790,
    totalPnLKRW: 2844920,
    totalReturnPercent: 6.8,
    holdingCount: 8,
    assetTypeCount: 3,
    cashPercent: 0.0,
    currencyExposure: [
      { currency: 'KRW', totalLocal: 34064246, totalKRW: 34064246, percent: 76.4, rate: 1 },
      { currency: 'USD', totalLocal: 7516.05, totalKRW: 10522464, percent: 23.6, rate: 1400 },
    ],
    categoryAllocation: [],
    marketAllocation: [],
    currencyAllocation: [],
    holdings: [],
    currencyScenarios: [],
    insights: [],
  };

  it('renders positive return percent with a single plus sign and without double plus (++6.8%)', () => {
    const { container } = renderWithProviders(<KpiBar summary={sampleSummary} />);
    
    // Check text content does not contain "++"
    expect(container.textContent).not.toContain('++');
    
    // Check that "(+6.8%)" is rendered correctly
    expect(screen.getByText('(+6.8%)')).toBeTruthy();
  });

  it('renders negative return percent correctly without double minus', () => {
    const negativeSummary: PortfolioSummary = {
      ...sampleSummary,
      totalPnLKRW: -1500000,
      totalReturnPercent: -3.5,
    };

    const { container } = renderWithProviders(<KpiBar summary={negativeSummary} />);
    
    expect(container.textContent).not.toContain('--');
    expect(container.textContent).not.toContain('+-');
    expect(screen.getByText('(-3.5%)')).toBeTruthy();
  });
});

