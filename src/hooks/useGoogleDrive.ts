/**
 * useGoogleDrive
 * - store 상태만 구독하는 얇은 래퍼
 * - 실제 로직은 googleDriveService 싱글턴에서 처리 (여러 컴포넌트에서 사용해도 중복 실행 없음)
 */
import { useGoogleDriveStore } from "@/stores";
import {
  driveConnect,
  driveDisconnect,
  driveSyncNow,
  driveLoadFromDrive,
  driveResolveWithDrive,
  driveResolveWithLocal,
} from "@/utils";

export function useGoogleDrive() {
  const isConnected = useGoogleDriveStore((s) => s.isConnected);
  const syncingAction = useGoogleDriveStore((s) => s.syncingAction);
  const syncError = useGoogleDriveStore((s) => s.syncError);
  const syncedAt = useGoogleDriveStore((s) => s.syncedAt);
  const pendingConflict = useGoogleDriveStore((s) => s.pendingConflict);

  return {
    isConnected,
    isSyncing: syncingAction !== null,
    isSaving: syncingAction === "upload",
    isLoading: syncingAction === "download",
    syncError,
    syncedAt,
    pendingConflict,
    hasClientId: true,
    connect: driveConnect,
    disconnect: driveDisconnect,
    syncNow: driveSyncNow,
    loadFromDrive: driveLoadFromDrive,
    resolveWithDrive: driveResolveWithDrive,
    resolveWithLocal: driveResolveWithLocal,
  };
}
