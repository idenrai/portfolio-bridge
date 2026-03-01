import { useState, useCallback, useEffect } from "react";
import { useSettingsStore, useLanguageStore } from "@/stores";
import { TRANSLATIONS } from "@/i18n";
import { fetchAllExchangeRates } from "@/utils";

/** 캐시 유효 기간: 1시간 (이 시간 이내이면 자동 재조회 생략) */
const CACHE_TTL_MS = 60 * 60 * 1000;
/** 캐시 폴백 한도: 24시간 (조회 실패 시 이 시간 이내 캐시는 경고 후 사용) */
const CACHE_FALLBACK_MS = 24 * 60 * 60 * 1000;

interface UseExchangeRateResult {
  refreshRates: () => Promise<void>;
  isLoading: boolean;
  /** 마지막 성공 갱신 시각 (영속화된 ISO 문자열) */
  lastUpdated: string | null;
  /** 조회 실패 + 24h 초과 캐시일 때 에러 메시지 */
  error: string | null;
  /** 조회 실패 후 캐시 폴백 중일 때 true */
  isCached: boolean;
}

/**
 * Yahoo Finance에서 환율을 조회하고 설정 스토어를 갱신하는 훅
 *
 * - 마운트 시 캐시가 1시간 이상 됐거나 없으면 자동 조회
 * - 조회 실패 시 24시간 이내 캐시가 있으면 경고(isCached)만 표시하고 기존 환율 유지
 * - 24시간 초과 캐시이거나 캐시 자체가 없으면 에러 메시지 표시
 */
export function useExchangeRates(): UseExchangeRateResult {
  const setExchangeRate = useSettingsStore((s) => s.setExchangeRate);
  const lastUpdated = useSettingsStore((s) => s.exchangeRatesUpdatedAt);
  const setLastUpdated = useSettingsStore((s) => s.setExchangeRatesUpdatedAt);
  const lang = useLanguageStore((s) => s.lang);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);

  const refreshRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsCached(false);
    try {
      const rates = await fetchAllExchangeRates();
      if (rates.JPY) setExchangeRate("JPY", rates.JPY);
      if (rates.USD) setExchangeRate("USD", rates.USD);
      setLastUpdated(new Date().toISOString());
    } catch (e) {
      console.error("[ExchangeRate]", e);
      const cacheAge = lastUpdated
        ? Date.now() - new Date(lastUpdated).getTime()
        : Infinity;

      if (cacheAge < CACHE_FALLBACK_MS) {
        // 캐시 폴백: 에러 대신 경고 상태로 처리
        setIsCached(true);
      } else {
        setError(TRANSLATIONS[lang].exchange_rate_error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setExchangeRate, setLastUpdated, lastUpdated, lang]);

  // 마운트 시 자동 조회: 캐시가 없거나 1시간 이상 경과한 경우
  useEffect(() => {
    const cacheAge = lastUpdated
      ? Date.now() - new Date(lastUpdated).getTime()
      : Infinity;
    if (cacheAge > CACHE_TTL_MS) {
      refreshRates();
    }
    // 의존성 배열 의도적 생략: 마운트 1회만 실행
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { refreshRates, isLoading, lastUpdated, error, isCached };
}
