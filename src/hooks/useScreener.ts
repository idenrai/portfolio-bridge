import { useState, useEffect, useCallback } from "react";
import { searchTicker } from "@/utils/yahooFinance";
import { useAssetStore } from "@/stores";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type ScreenMode = "portfolio" | "search";

export interface ScreenerProgress {
  phase: "enrich";
  done: number;
  total: number;
}

/** useScreener 결과에서 사용하는 최소 결과 형태 */
export interface BaseScreenResult {
  stock: { ticker: string; name: string };
  totalScore: number;
  criteria: Array<{
    key: string;
    pass: boolean | null;
    value: number | null;
    score: number;
    maxScore: number;
  }>;
}

interface UseScreenerConfig<TResult extends BaseScreenResult> {
  screenByTickers: (
    tickers: Array<{ ticker: string; name?: string }>,
    onProgress: (p: ScreenerProgress) => void,
  ) => Promise<TResult[]>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useScreener<TResult extends BaseScreenResult>(
  config: UseScreenerConfig<TResult>,
) {
  const assets = useAssetStore((s) => s.assets);

  const [mode, setMode] = useState<ScreenMode>("portfolio");
  const [results, setResults] = useState<TResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);
  const [progress, setProgress] = useState<ScreenerProgress>({
    phase: "enrich",
    done: 0,
    total: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<{ ticker: string; name: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  /** 포트폴리오 모드 — 보유 종목 스크리닝 */
  const runPortfolio = useCallback(async () => {
    const stockAssets = assets.filter(
      (a) => a.ticker && (a.type === "stock" || a.type === "etf"),
    );
    if (stockAssets.length === 0) return;

    setLoading(true);
    setRan(false);
    setProgress({ phase: "enrich", done: 0, total: stockAssets.length });
    try {
      const tickers = stockAssets.map((a) => ({
        ticker: a.ticker!,
        name: a.name,
      }));
      const res = await config.screenByTickers(tickers, (p) =>
        setProgress(p),
      );
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, [assets, config]);

  /** 검색 모드 — 단일 티커 스크리닝 */
  const runSearch = useCallback(
    async (ticker: string, name?: string) => {
      setLoading(true);
      setRan(false);
      setProgress({ phase: "enrich", done: 0, total: 1 });
      setSearchSuggestions([]);
      try {
        const res = await config.screenByTickers(
          [{ ticker, name }],
          (p) => setProgress(p),
        );
        setResults(res);
      } finally {
        setLoading(false);
        setRan(true);
      }
    },
    [config],
  );

  /** 티커 검색 → 자동완성 or 단일 결과 직접 스크리닝 */
  const handleSearch = useCallback(async () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearching(true);
    try {
      const items = await searchTicker(q);
      if (items.length === 1) {
        await runSearch(items[0].ticker, items[0].name);
      } else if (items.length > 1) {
        setSearchSuggestions(
          items.map((i) => ({ ticker: i.ticker, name: i.name })),
        );
      }
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, runSearch]);

  // 모드 변경 시 결과 초기화
  useEffect(() => {
    setResults([]);
    setRan(false);
    setProgress({ phase: "enrich", done: 0, total: 0 });
    setSearchSuggestions([]);
  }, [mode]);

  const portfolioTickerCount = assets.filter(
    (a) => a.ticker && (a.type === "stock" || a.type === "etf"),
  ).length;

  return {
    mode,
    setMode,
    results,
    loading,
    ran,
    progress,
    searchQuery,
    setSearchQuery,
    searchSuggestions,
    isSearching,
    runPortfolio,
    runSearch,
    handleSearch,
    portfolioTickerCount,
  } as const;
}
