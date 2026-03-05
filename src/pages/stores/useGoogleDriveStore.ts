import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DriveBackup } from "@/utils/googleDrive";

export interface DriveStoreState {
  /** Drive에 업로드된 파일의 ID (영속화) */
  fileId: string | null;
  /** 마지막 성공 동기화 시각 ISO (영속화) */
  syncedAt: string | null;
  /** OAuth 연결 여부 (비영속, 페이지 로드 시 재인증 필요) */
  isConnected: boolean;
  /** 진행 중인 작업: null=없음, "upload"=저장 중, "download"=불러오는 중 */
  syncingAction: "upload" | "download" | null;
  /** 동기화 에러 메시지 */
  syncError: string | null;
  /** Drive vs 로컬 충돌 시 Drive 데이터 (해소 후 null) */
  pendingConflict: DriveBackup | null;

  setFileId: (id: string | null) => void;
  setSyncedAt: (iso: string) => void;
  setConnected: (v: boolean) => void;
  setSyncingAction: (v: "upload" | "download" | null) => void;
  setSyncError: (e: string | null) => void;
  setPendingConflict: (data: DriveBackup | null) => void;
  resetSession: () => void;
}

export const useGoogleDriveStore = create<DriveStoreState>()(
  persist(
    (set) => ({
      fileId: null,
      syncedAt: null,
      isConnected: false,
      syncingAction: null,
      syncError: null,
      pendingConflict: null,

      setFileId: (fileId) => set({ fileId }),
      setSyncedAt: (syncedAt) => set({ syncedAt }),
      setConnected: (isConnected) => set({ isConnected }),
      setSyncingAction: (syncingAction) => set({ syncingAction }),
      setSyncError: (syncError) => set({ syncError }),
      setPendingConflict: (pendingConflict) => set({ pendingConflict }),
      /** 연결 해제 시 세션 초기화 (fileId·syncedAt 유지, 나머지 초기화) */
      resetSession: () =>
        set({
          isConnected: false,
          syncingAction: null,
          syncError: null,
          pendingConflict: null,
        }),
    }),
    {
      name: "portfolio-bridge-drive",
      // fileId, syncedAt, isConnected 영속화 (재시작 시 연결 상태 유지)
      partialize: (state) => ({
        fileId: state.fileId,
        syncedAt: state.syncedAt,
        isConnected: state.isConnected,
      }),
    },
  ),
);
