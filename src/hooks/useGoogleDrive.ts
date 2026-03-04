import { useCallback, useEffect, useRef } from "react";
import { useAssetStore, useSettingsStore } from "@/pages/stores";
import { useGoogleDriveStore } from "@/pages/stores/useGoogleDriveStore";
import {
  findDriveFile,
  downloadDriveBackup,
  uploadDriveBackup,
  createTokenClient,
  type DriveBackup,
} from "@/utils/googleDrive";
import type { Asset } from "@/types";

const CLIENT_ID =
  "897974484199-ikb59r4mvok827d0s69nhqdbljbqah8t.apps.googleusercontent.com";

/** Google Drive 자동 동기화 훅 */
export function useGoogleDrive() {
  const driveStore = useGoogleDriveStore();

  // 인메모리 액세스 토큰 (localStorage에 저장하지 않음)
  const tokenRef = useRef<string | null>(null);
  // 토큰 만료 시각 (epoch ms)
  const tokenExpiresRef = useRef<number>(0);
  // GIS 토큰 클라이언트 인스턴스
  const tokenClientRef = useRef<TokenClient | null>(null);
  // 원격 데이터 적용 중일 때 true → 업로드 방지
  const isApplyingRemoteRef = useRef(false);
  // 초기 연결 완료 후 콜백 큐
  const onConnectedRef = useRef<(() => void) | null>(null);
  // re-auth 후 실행할 동작: 'initialSync' | 'uploadOnly'
  const postAuthActionRef = useRef<"initialSync" | "uploadOnly">("initialSync");

  const isTokenValid = () =>
    !!tokenRef.current && Date.now() < tokenExpiresRef.current - 30_000;

  // ── 백업 데이터 빌드 ──────────────────────────────────────────────────────
  const buildBackup = useCallback((): DriveBackup => {
    const { assets } = useAssetStore.getState();
    const { baseCurrency, targetAllocations } = useSettingsStore.getState();
    return {
      version: 1,
      syncedAt: new Date().toISOString(),
      assets,
      settings: { baseCurrency, targetAllocations },
    };
  }, []);

  // ── 원격 → 로컬 적용 ─────────────────────────────────────────────────────
  const applyRemote = useCallback((backup: DriveBackup) => {
    isApplyingRemoteRef.current = true;
    try {
      // Zustand persist 미들웨어가 setState 호출 시 localStorage 자동 저장
      useAssetStore.setState({ assets: backup.assets as Asset[] });
      useSettingsStore.setState((s) => ({
        ...s,
        baseCurrency: backup.settings.baseCurrency as never,
        targetAllocations: backup.settings.targetAllocations as never,
      }));
    } finally {
      setTimeout(() => {
        isApplyingRemoteRef.current = false;
      }, 500);
    }
  }, []);

  // ── Drive 업로드 ──────────────────────────────────────────────────────────
  const uploadNow = useCallback(async () => {
    if (!isTokenValid()) return;
    driveStore.setSyncing(true);
    driveStore.setSyncError(null);
    try {
      const backup = buildBackup();
      const fileId = await uploadDriveBackup(
        tokenRef.current!,
        backup,
        driveStore.fileId,
      );
      if (fileId) {
        driveStore.setFileId(fileId);
        driveStore.setSyncedAt(backup.syncedAt);
      } else {
        driveStore.setSyncError("upload_failed");
      }
    } catch (e) {
      driveStore.setSyncError(String(e));
    } finally {
      driveStore.setSyncing(false);
    }
  }, [buildBackup, driveStore]);

  // ── 초기 동기화 (연결 직후) ───────────────────────────────────────────────
  const initialSync = useCallback(
    async (token: string) => {
      driveStore.setSyncing(true);
      driveStore.setSyncError(null);
      try {
        // 1) Drive 파일 탐색
        let fileId = driveStore.fileId;
        if (!fileId) {
          fileId = await findDriveFile(token);
          if (fileId) driveStore.setFileId(fileId);
        }

        if (!fileId) {
          // Drive에 파일 없음 → 로컬 데이터 업로드
          const backup = buildBackup();
          const newId = await uploadDriveBackup(token, backup, null);
          if (newId) {
            driveStore.setFileId(newId);
            driveStore.setSyncedAt(backup.syncedAt);
          }
          return;
        }

        // 2) Drive 파일 다운로드
        const remote = await downloadDriveBackup(token, fileId);
        if (!remote) {
          // 다운로드 실패 → 로컬 업로드 시도
          await uploadNow();
          return;
        }

        const remoteTs = remote.syncedAt
          ? new Date(remote.syncedAt).getTime()
          : 0;
        const localTs = driveStore.syncedAt
          ? new Date(driveStore.syncedAt).getTime()
          : 0;

        if (remoteTs > localTs) {
          if (localTs === 0) {
            // 이 기기에서 동기화 기록이 없음 → 충돌 없이 Drive 데이터 바로 적용
            applyRemote(remote);
            driveStore.setSyncedAt(remote.syncedAt);
          } else {
            // 양쪽 모두 데이터가 있고 Drive가 더 최신 → 사용자에게 선택 요청
            driveStore.setPendingConflict(remote);
          }
        } else {
          // 로컬이 최신 또는 동일 → Drive에 업로드
          await uploadNow();
        }
      } catch (e) {
        driveStore.setSyncError(String(e));
      } finally {
        driveStore.setSyncing(false);
      }
    },
    [buildBackup, driveStore, uploadNow, applyRemote],
  );

  // ── GIS 토큰 수신 콜백 ────────────────────────────────────────────────────
  const onToken = useCallback(
    async (token: string) => {
      tokenRef.current = token;
      tokenExpiresRef.current = Date.now() + 3600_000; // 1시간
      driveStore.setConnected(true);
      if (postAuthActionRef.current === "uploadOnly") {
        // syncNow 버튼으로 재인증한 경우 → 업로드만
        postAuthActionRef.current = "initialSync"; // 초기화
        await uploadNow();
      } else {
        await initialSync(token);
      }
      onConnectedRef.current?.();
      onConnectedRef.current = null;
    },
    [driveStore, initialSync, uploadNow],
  );

  const onTokenError = useCallback(
    (error: string) => {
      driveStore.setSyncError(error);
      driveStore.setConnected(false);
    },
    [driveStore],
  );

  // ── 토큰 클라이언트 초기화 (GIS 로드 후 1회) ─────────────────────────────
  useEffect(() => {
    if (!CLIENT_ID) return;
    const init = () => {
      if (window.google?.accounts?.oauth2) {
        tokenClientRef.current = createTokenClient(
          CLIENT_ID,
          onToken,
          onTokenError,
        );
      }
    };

    const run = () => {
      init();
      // 이미 연결된 상태로 앱이 재시작된 경우 silent re-auth
      if (useGoogleDriveStore.getState().isConnected) {
        tokenClientRef.current?.requestAccessToken({ prompt: "" });
      }
    };

    if (window.google?.accounts?.oauth2) {
      run();
    } else {
      // GIS 스크립트 로드 이벤트 대기
      window.addEventListener("googleScriptLoaded", run, { once: true });
      return () => window.removeEventListener("googleScriptLoaded", run);
    }
  }, [onToken, onTokenError]);

  // ── 공개 API ──────────────────────────────────────────────────────────────

  const connect = useCallback(() => {
    if (!CLIENT_ID) {
      driveStore.setSyncError("no_client_id");
      return;
    }
    if (!tokenClientRef.current) {
      driveStore.setSyncError("gis_not_loaded");
      return;
    }
    tokenClientRef.current.requestAccessToken({ prompt: "select_account" });
  }, [driveStore]);

  const disconnect = useCallback(() => {
    const token = tokenRef.current;
    if (token && window.google?.accounts?.oauth2) {
      window.google.accounts.oauth2.revoke(token, () => {});
    }
    tokenRef.current = null;
    tokenExpiresRef.current = 0;
    driveStore.resetSession();
  }, [driveStore]);

  /** 충돌 해소: Drive 데이터 사용 */
  const resolveWithDrive = useCallback(() => {
    const remote = driveStore.pendingConflict;
    if (!remote) return;
    applyRemote(remote);
    driveStore.setPendingConflict(null);
    driveStore.setSyncedAt(remote.syncedAt);
  }, [driveStore, applyRemote]);

  /** 충돌 해소: 로컬 데이터 유지 → Drive에 업로드 */
  const resolveWithLocal = useCallback(() => {
    driveStore.setPendingConflict(null);
    uploadNow();
  }, [driveStore, uploadNow]);

  /** 지금 동기화 버튼 핸들러: 토큰 유효 시 즉시 업로드, 만료 시 silent re-auth 후 업로드 */
  const syncNow = useCallback(async () => {
    if (isTokenValid()) {
      await uploadNow();
      return;
    }
    // 토큰 만료 → 계정 선택 없이 silent re-auth 후 uploadOnly
    if (!tokenClientRef.current) {
      driveStore.setSyncError("gis_not_loaded");
      return;
    }
    postAuthActionRef.current = "uploadOnly";
    tokenClientRef.current.requestAccessToken({ prompt: "" });
  }, [uploadNow, driveStore]);

  const hasClientId = !!CLIENT_ID;

  return {
    isConnected: driveStore.isConnected,
    isSyncing: driveStore.isSyncing,
    syncError: driveStore.syncError,
    syncedAt: driveStore.syncedAt,
    pendingConflict: driveStore.pendingConflict,
    hasClientId,
    connect,
    disconnect,
    syncNow,
    resolveWithDrive,
    resolveWithLocal,
  };
}
