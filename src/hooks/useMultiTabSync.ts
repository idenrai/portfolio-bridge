import { useEffect } from "react";
import { STORAGE_KEYS } from "@/constants";
import {
  useAssetStore,
  useSettingsStore,
  useProfileStore,
  useSnapshotStore,
  useBrokerStore,
  useFireStore,
  useCustomGuruStore,
  useGuruSessionStore,
  useLanguageStore,
} from "@/stores";

/**
 * 브라우저의 storage 이벤트를 감지하여 다른 탭에서 로컬 스토리지가 변경되었을 때
 * 현재 탭의 Zustand 인메모리 상태를 자동으로 최신 디스크 상태와 동기화(rehydrate)하는 훅
 */
export function useMultiTabSync() {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      // 다른 탭에서 발생한 변경사항이 아니거나 키가 없으면 무시
      if (!event.key) return;

      switch (event.key) {
        case STORAGE_KEYS.ASSETS:
          useAssetStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.SETTINGS:
          useSettingsStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.PROFILE:
          useProfileStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.SNAPSHOTS:
          useSnapshotStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.BROKERS:
          useBrokerStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.FIRE:
          useFireStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.CUSTOM_GURU:
          useCustomGuruStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.GURU_SESSIONS:
          useGuruSessionStore.persist.rehydrate();
          break;
        case STORAGE_KEYS.LANGUAGE:
          useLanguageStore.persist.rehydrate();
          break;
        default:
          break;
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
}
