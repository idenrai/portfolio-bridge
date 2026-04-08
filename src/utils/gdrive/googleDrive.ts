/**
 * Google Drive AppData 연동 유틸리티
 *
 * - OAuth 스코프: drive.appdata (사용자 Drive에 숨겨진 앱 전용 폴더)
 * - 저장 파일: appDataFolder/portfolio-bridge-data.json
 */

const DRIVE_API = "https://www.googleapis.com/drive/v3";
const UPLOAD_API = "https://www.googleapis.com/upload/drive/v3";
const FILE_NAME = "portfolio-bridge-data.json";

export const DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.appdata";

export interface DriveBackup {
  version: number;
  syncedAt: string;
  assets: unknown[];
  settings: {
    baseCurrency: string;
    targetAllocations: unknown[];
  };
}

// ─── 파일 검색 ────────────────────────────────────────────────────────────────

/** Drive appDataFolder에서 백업 파일 ID를 반환. 없으면 null */
export async function findDriveFile(token: string): Promise<string | null> {
  const url =
    `${DRIVE_API}/files` +
    `?spaces=appDataFolder` +
    `&q=name%3D'${encodeURIComponent(FILE_NAME)}'` +
    `&fields=files(id)`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  const data: { files?: { id: string }[] } = await res.json();
  return data.files?.[0]?.id ?? null;
}

// ─── 다운로드 ─────────────────────────────────────────────────────────────────

/** Drive 파일 내용을 JSON으로 다운로드 */
export async function downloadDriveBackup(
  token: string,
  fileId: string,
): Promise<DriveBackup | null> {
  const res = await fetch(`${DRIVE_API}/files/${fileId}?alt=media`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  try {
    return (await res.json()) as DriveBackup;
  } catch {
    return null;
  }
}

// ─── 업로드 ──────────────────────────────────────────────────────────────────

/** 백업 데이터를 Drive에 생성 또는 갱신. 성공 시 fileId 반환 */
export async function uploadDriveBackup(
  token: string,
  data: DriveBackup,
  existingFileId: string | null,
): Promise<string | null> {
  const body = JSON.stringify(data);
  const contentType = "application/json";

  if (existingFileId) {
    // PATCH: 기존 파일 덮어쓰기
    const res = await fetch(
      `${UPLOAD_API}/files/${existingFileId}?uploadType=media`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": contentType,
        },
        body,
      },
    );
    return res.ok ? existingFileId : null;
  } else {
    // POST: 신규 파일 생성 (multipart: metadata + body)
    const metadata = JSON.stringify({
      name: FILE_NAME,
      parents: ["appDataFolder"],
    });
    const boundary = "pb_boundary_" + Math.random().toString(36).slice(2);
    const multipart =
      `--${boundary}\r\n` +
      `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
      `${metadata}\r\n` +
      `--${boundary}\r\n` +
      `Content-Type: ${contentType}\r\n\r\n` +
      `${body}\r\n` +
      `--${boundary}--`;

    const res = await fetch(`${UPLOAD_API}/files?uploadType=multipart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: multipart,
    });
    if (!res.ok) return null;
    const created: { id?: string } = await res.json();
    return created.id ?? null;
  }
}

// ─── 토큰 클라이언트 초기화 ───────────────────────────────────────────────────

/** GIS 토큰 클라이언트 초기화 */
export function createTokenClient(
  clientId: string,
  onToken: (token: string) => void,
  onError: (error: string) => void,
): TokenClient {
  return window.google!.accounts.oauth2.initTokenClient({
    client_id: clientId,
    scope: DRIVE_SCOPE,
    callback: (resp) => {
      if (resp.error || !resp.access_token) {
        onError(resp.error ?? "unknown_error");
      } else {
        onToken(resp.access_token);
      }
    },
  });
}
