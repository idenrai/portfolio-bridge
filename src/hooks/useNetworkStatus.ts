import { useState, useEffect, useCallback, useRef } from "react";

export interface UseNetworkStatusOptions {
  /** 온라인으로 복구되었을 때 호출되는 콜백 */
  onReconnect?: () => void;
  /** 연결 확인용 핑 URL (기본값: /api/health) */
  probeUrl?: string;
  /** 핑 타임아웃 (ms, 기본값: 3000) */
  timeoutMs?: number;
}

/**
 * 실시간 네트워크 연결 상태를 감지하고 실제 인터넷 가용성을 확인하는 훅
 */
export function useNetworkStatus(options: UseNetworkStatusOptions = {}) {
  const { onReconnect, probeUrl = "/api/health", timeoutMs = 3000 } = options;
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true,
  );
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const prevOnlineRef = useRef<boolean>(isOnline);

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return false;
    }
    try {
      setIsChecking(true);
      const res = await fetch(probeUrl, {
        method: "HEAD",
        cache: "no-store",
        signal: AbortSignal.timeout(timeoutMs),
      });
      return res.ok;
    } catch {
      return false;
    } finally {
      setIsChecking(false);
    }
  }, [probeUrl, timeoutMs]);

  useEffect(() => {
    let mounted = true;

    const handleOnline = async () => {
      const actuallyOnline = await checkConnectivity();
      if (!mounted) return;
      setIsOnline(actuallyOnline);
      if (actuallyOnline && !prevOnlineRef.current) {
        onReconnect?.();
      }
      prevOnlineRef.current = actuallyOnline;
    };

    const handleOffline = () => {
      if (!mounted) return;
      setIsOnline(false);
      prevOnlineRef.current = false;
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      mounted = false;
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [checkConnectivity, onReconnect]);

  return { isOnline, isChecking, checkConnectivity };
}
