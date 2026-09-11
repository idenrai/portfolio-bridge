import { useState, useEffect, useCallback } from "react";
import { STORAGE_KEYS } from "@/constants";

export interface StorageInfo {
  isPersisted: boolean;
  isSupported: boolean;
  browserUsageBytes: number;
  browserQuotaBytes: number;
  localStorageUsageBytes: number;
  formattedLocalUsage: string;
  formattedBrowserUsage: string;
  formattedBrowserQuota: string;
}

/** 바이트 수를 읽기 쉬운 문자열(KB, MB 등)로 포맷팅 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes <= 0) return "0 B";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/** 현재 localStorage에 저장된 Portfolio Bridge 데이터의 총 바이트 수 계산 */
export function calculateLocalStorageUsage(): number {
  if (typeof window === "undefined" || !window.localStorage) return 0;
  let totalBytes = 0;
  try {
    const keySet = new Set<string>(Object.values(STORAGE_KEYS));
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (keySet.has(key) || key.startsWith("portfolio-bridge"))) {
        const val = localStorage.getItem(key) ?? "";
        // UTF-16 문자열이므로 문자당 2바이트 계산
        totalBytes += (key.length + val.length) * 2;
      }
    }
  } catch {
    // localStorage 접근 실패 시 0 반환
  }
  return totalBytes;
}

/**
 * 브라우저 StorageManager API를 통해 스토리지 지속성 및 할당량을 감지하고 관리하는 훅
 */
export function useStoragePersistence() {
  const [info, setInfo] = useState<StorageInfo>({
    isPersisted: false,
    isSupported: false,
    browserUsageBytes: 0,
    browserQuotaBytes: 0,
    localStorageUsageBytes: 0,
    formattedLocalUsage: "0 B",
    formattedBrowserUsage: "0 B",
    formattedBrowserQuota: "0 B",
  });
  const [isRequesting, setIsRequesting] = useState(false);

  const refreshStorageInfo = useCallback(async () => {
    const isSupported =
      typeof navigator !== "undefined" && !!navigator.storage;

    let isPersisted = false;
    let browserUsage = 0;
    let browserQuota = 0;

    if (isSupported) {
      try {
        if (navigator.storage.persisted) {
          isPersisted = await navigator.storage.persisted();
        }
        if (navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate();
          browserUsage = estimate.usage ?? 0;
          browserQuota = estimate.quota ?? 0;
        }
      } catch (e) {
        console.warn("StorageManager estimate failed", e);
      }
    }

    const localUsage = calculateLocalStorageUsage();

    setInfo({
      isPersisted,
      isSupported,
      browserUsageBytes: browserUsage,
      browserQuotaBytes: browserQuota,
      localStorageUsageBytes: localUsage,
      formattedLocalUsage: formatBytes(localUsage),
      formattedBrowserUsage: formatBytes(browserUsage),
      formattedBrowserQuota: formatBytes(browserQuota),
    });
  }, []);

  const requestPersistence = useCallback(async (): Promise<boolean> => {
    if (typeof navigator === "undefined" || !navigator.storage?.persist) {
      return false;
    }
    try {
      setIsRequesting(true);
      const granted = await navigator.storage.persist();
      await refreshStorageInfo();
      return granted;
    } catch (e) {
      console.warn("Failed to request persistent storage", e);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, [refreshStorageInfo]);

  useEffect(() => {
    refreshStorageInfo();
  }, [refreshStorageInfo]);

  return {
    ...info,
    isRequesting,
    requestPersistence,
    refreshStorageInfo,
  };
}
