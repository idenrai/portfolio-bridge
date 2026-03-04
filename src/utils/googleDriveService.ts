/**
 * Google Drive 서비스 싱글턴
 * - 모듈 레벨에서 상태를 관리하므로 여러 컴포넌트가 훅을 사용해도 단 1회만 초기화됨
 */
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

// ── 모듈 레벨 싱글턴 상태 ────────────────────────────────────────────────────
let tokenValue: string | null = null;
let tokenExpires = 0;
let tokenClient: TokenClient | null = null;
let postAuthAction: "initialSync" | "uploadOnly" | "downloadOnly" =
  "initialSync";
let initialized = false;

const isTokenValid = () => !!tokenValue && Date.now() < tokenExpires - 30_000;

// ── 헬퍼 ─────────────────────────────────────────────────────────────────────
const store = () => useGoogleDriveStore.getState();

function buildBackup(): DriveBackup {
  const { assets } = useAssetStore.getState();
  const { baseCurrency, targetAllocations } = useSettingsStore.getState();
  return {
    version: 1,
    syncedAt: new Date().toISOString(),
    assets,
    settings: { baseCurrency, targetAllocations },
  };
}

function applyRemote(backup: DriveBackup) {
  try {
    useAssetStore.setState({ assets: backup.assets as Asset[] });
    useSettingsStore.setState((s) => ({
      ...s,
      baseCurrency: backup.settings.baseCurrency as never,
      targetAllocations: backup.settings.targetAllocations as never,
    }));
  } catch (e) {
    console.error("applyRemote failed", e);
  }
}

// ── 업로드 ────────────────────────────────────────────────────────────────────
export async function uploadNow(): Promise<void> {
  if (!isTokenValid()) return;
  const s = store();
  s.setSyncing(true);
  s.setSyncError(null);
  try {
    const backup = buildBackup();
    const fileId = await uploadDriveBackup(tokenValue!, backup, s.fileId);
    if (fileId) {
      s.setFileId(fileId);
      s.setSyncedAt(backup.syncedAt);
    } else {
      s.setSyncError("upload_failed");
    }
  } catch (e) {
    s.setSyncError(String(e));
  } finally {
    s.setSyncing(false);
  }
}

// ── 초기 동기화 (연결 직후) ───────────────────────────────────────────────────
async function initialSync(token: string): Promise<void> {
  const s = store();
  s.setSyncing(true);
  s.setSyncError(null);
  try {
    let fileId = s.fileId;
    if (!fileId) {
      fileId = await findDriveFile(token);
      if (fileId) s.setFileId(fileId);
    }

    if (!fileId) {
      const backup = buildBackup();
      const newId = await uploadDriveBackup(token, backup, null);
      if (newId) {
        s.setFileId(newId);
        s.setSyncedAt(backup.syncedAt);
      }
      return;
    }

    const remote = await downloadDriveBackup(token, fileId);
    if (!remote) {
      await uploadNow();
      return;
    }

    const remoteTs = remote.syncedAt ? new Date(remote.syncedAt).getTime() : 0;
    const localTs = s.syncedAt ? new Date(s.syncedAt).getTime() : 0;

    if (remoteTs > localTs) {
      if (localTs === 0) {
        applyRemote(remote);
        s.setSyncedAt(remote.syncedAt);
      } else {
        s.setPendingConflict(remote);
      }
    } else {
      await uploadNow();
    }
  } catch (e) {
    s.setSyncError(String(e));
  } finally {
    s.setSyncing(false);
  }
}

// ── GIS 토큰 수신 콜백 ────────────────────────────────────────────────────────
async function onToken(token: string): Promise<void> {
  tokenValue = token;
  tokenExpires = Date.now() + 3_600_000;
  store().setConnected(true);

  if (postAuthAction === "uploadOnly") {
    postAuthAction = "initialSync";
    await uploadNow();
  } else if (postAuthAction === "downloadOnly") {
    postAuthAction = "initialSync";
    await downloadAndApply(token);
  } else {
    await initialSync(token);
  }
}

function onTokenError(error: string) {
  store().setSyncError(error);
  store().setConnected(false);
}

// ── 초기화 (앱 전체에서 1회) ──────────────────────────────────────────────────
export function initGoogleDriveService() {
  if (initialized) return;
  initialized = true;

  const setup = () => {
    if (!window.google?.accounts?.oauth2) return;
    tokenClient = createTokenClient(CLIENT_ID, onToken, onTokenError);
    // 앱 시작 시 자동 토큰 요청 안 함 — GIS는 silent re-auth도 잠깐 오버레이를 띄우므로
    // 사용자가 저장/불러오기 버튼을 누를 때 필요 시 토큰을 요청함
  };

  if (window.google?.accounts?.oauth2) {
    setup();
  } else {
    window.addEventListener("googleScriptLoaded", setup, { once: true });
  }
}

// ── 공개 액션 ─────────────────────────────────────────────────────────────────
export function driveConnect() {
  if (!CLIENT_ID) {
    store().setSyncError("no_client_id");
    return;
  }
  if (!tokenClient) {
    store().setSyncError("gis_not_loaded");
    return;
  }
  tokenClient.requestAccessToken({ prompt: "select_account" });
}

export function driveDisconnect() {
  if (tokenValue && window.google?.accounts?.oauth2) {
    window.google.accounts.oauth2.revoke(tokenValue, () => {});
  }
  tokenValue = null;
  tokenExpires = 0;
  store().resetSession();
}

// ── Drive 다운로드 + 적용 ────────────────────────────────────────────────────
async function downloadAndApply(token: string): Promise<void> {
  const s = store();
  s.setSyncing(true);
  s.setSyncError(null);
  try {
    let fileId = s.fileId;
    if (!fileId) {
      fileId = await findDriveFile(token);
      if (fileId) s.setFileId(fileId);
    }
    if (!fileId) {
      s.setSyncError("no_file_in_drive");
      return;
    }
    const remote = await downloadDriveBackup(token, fileId);
    if (!remote) {
      s.setSyncError("download_failed");
      return;
    }
    applyRemote(remote);
    s.setSyncedAt(remote.syncedAt);
  } catch (e) {
    s.setSyncError(String(e));
  } finally {
    s.setSyncing(false);
  }
}

export async function driveSyncNow(): Promise<void> {
  if (isTokenValid()) {
    await uploadNow();
    return;
  }
  if (!tokenClient) {
    store().setSyncError("gis_not_loaded");
    return;
  }
  postAuthAction = "uploadOnly";
  tokenClient.requestAccessToken({ prompt: "" });
}

export async function driveLoadFromDrive(): Promise<void> {
  if (isTokenValid()) {
    await downloadAndApply(tokenValue!);
    return;
  }
  if (!tokenClient) {
    store().setSyncError("gis_not_loaded");
    return;
  }
  postAuthAction = "downloadOnly";
  tokenClient.requestAccessToken({ prompt: "" });
}

export function driveResolveWithDrive() {
  const s = store();
  const remote = s.pendingConflict;
  if (!remote) return;
  applyRemote(remote);
  s.setPendingConflict(null);
  s.setSyncedAt(remote.syncedAt);
}

export function driveResolveWithLocal() {
  store().setPendingConflict(null);
  uploadNow();
}
