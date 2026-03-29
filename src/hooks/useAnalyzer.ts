import { useState, useEffect, useCallback } from "react";
import { searchTicker } from "@/utils/yahooFinance";
import { useAssetStore } from "@/stores";

// ─── 타입 ─────────────────────────────────────────────────────────────────────

export type AnalyzerMode = "portfolio" | "search";

export interface AnalyzerProgress {
  phase: "enrich";
  done: number;
  total: number;
}

/** useAnalyzer 결과에서 사용하는 최소 결과 형태 */
export interface BaseAnalyzerResult {
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

interface UseAnalyzerConfig<TResult extends BaseAnalyzerResult> {
  analyzeByTickers: (
    tickers: Array<{ ticker: string; name?: string }>,
    onProgress: (p: AnalyzerProgress) => void,
  ) => Promise<TResult[]>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnalyzer<TResult extends BaseAnalyzerResult>(
  config: UseAnalyzerConfig<TResult>,
) {
  const assets = useAssetStore((s) => s.assets);

  const [mode, setMode] = useState<AnalyzerMode>("portfolio");
  const [results, setResults] = useState<TResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [ran, setRan] = useState(false);
  const [progress, setProgress] = useState<AnalyzerProgress>({
    phase: "enrich",
    done: 0,
    total: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [searchSuggestions, setSearchSuggestions] = useState<
    Array<{ ticker: string; name: string }>
  >([]);
  const [isSearching, setIsSearching] = useState(false);

  /** 포트폴리오 모드 — 보유 주식 채점 */
  const runPortfolio = useCallback(async () => {
    const stockAssets = assets.filter(
      (a) => a.ticker && a.type === "stock",
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
      const res = await config.analyzeByTickers(tickers, (p) =>
        setProgress(p),
      );
      setResults(res);
    } finally {
      setLoading(false);
      setRan(true);
    }
  }, [assets, config]);

  /** 검색 모드 — 단일 티커 분석 */
  const runSearch = useCallback(
    async (ticker: string, name?: string) => {
      setLoading(true);
      setRan(false);
      setProgress({ phase: "enrich", done: 0, total: 1 });
      setSearchSuggestions([]);
      try {
        const res = await config.analyzeByTickers(
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

  const portfolioStockCount = assets.filter(
    (a) => a.ticker && a.type === "stock",
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
    portfolioStockCount,
  } as const;
}
