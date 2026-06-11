import { useState, useCallback, useRef } from "react";
import { searchTicker, fetchCurrentPrice } from "@/utils";
import type { TickerSearchItem, QuoteData } from "@/utils";
import { useLanguageStore } from "@/stores";
import { TRANSLATIONS } from "@/i18n";

interface UseTickerSearchResult {
  query: string;
  setQuery: (q: string) => void;
  results: TickerSearchItem[];
  isSearching: boolean;
  searchError: string | null;
  search: () => Promise<void>;
  /** 선택된 종목 및 현재가 */
  selected: TickerSearchItem | null;
  selectedPrice: number | null;
  isFetchingPrice: boolean;
  selectItem: (item: TickerSearchItem) => Promise<void>;
  reset: () => void;
}

/**
 * Yahoo Finance 티커 검색 및 종목 선택 훅
 */
export function useTickerSearch(): UseTickerSearchResult {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TickerSearchItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [selected, setSelected] = useState<TickerSearchItem | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const lang = useLanguageStore((s) => s.lang);

  const search = useCallback(async () => {
    if (!query.trim()) return;
    // 이전 요청 취소
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setIsSearching(true);
    setSearchError(null);
    setResults([]);
    try {
      const items = await searchTicker(query.trim());
      setResults(items);
      if (items.length === 0) setSearchError(TRANSLATIONS[lang].ticker_search_no_result);
    } catch {
      setSearchError(TRANSLATIONS[lang].ticker_search_error);
    } finally {
      setIsSearching(false);
    }
  }, [query, lang]);

  const selectItem = useCallback(async (item: TickerSearchItem) => {
    setSelected(item);
    setResults([]);
    setIsFetchingPrice(true);
    setSelectedPrice(null);
    try {
      const quote: QuoteData | null = await fetchCurrentPrice(item.ticker);
      if (quote) setSelectedPrice(quote.price);
    } catch {
      // 현재가 조회 실패는 무시 — 사용자가 직접 입력 가능
    } finally {
      setIsFetchingPrice(false);
    }
  }, []);

  const reset = useCallback(() => {
    setQuery("");
    setResults([]);
    setSearchError(null);
    setSelected(null);
    setSelectedPrice(null);
  }, []);

  return {
    query,
    setQuery,
    results,
    isSearching,
    searchError,
    search,
    selected,
    selectedPrice,
    isFetchingPrice,
    selectItem,
    reset,
  };
}
