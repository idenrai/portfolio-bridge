import { useState, useRef } from "react";
import { useGoogleDrive, useT, useStoragePersistence } from "@/hooks";
import { Card, Button, Modal } from "@/components/common";
import { Cloud, HardDrive, CheckCircle2, AlertTriangle, Download, Upload, ShieldCheck, FileJson } from "lucide-react";
import { STORAGE_KEYS } from "@/constants";
import { format } from "date-fns";
import { exportFullBackupAsJson, importFullBackupFromJson } from "@/utils";

export function DataManagementSection() {
  const t = useT();
  const drive = useGoogleDrive();
  const {
    isPersisted,
    formattedLocalUsage,
    formattedBrowserQuota,
    requestPersistence,
    isRequesting,
  } = useStoragePersistence();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 확인 모달 상태 (초기화 또는 백업 복원 확인)
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    confirmText: string;
    isDanger?: boolean;
    onConfirm: () => void;
  }>({
    open: false,
    title: "",
    message: "",
    confirmText: "",
    onConfirm: () => {},
  });

  // 알림 모달 상태 (성공 또는 에러 안내)
  const [alertModal, setAlertModal] = useState<{
    open: boolean;
    title: string;
    message: string;
    isError?: boolean;
    onClose?: () => void;
  }>({
    open: false,
    title: "",
    message: "",
  });

  const handleResetAll = () => {
    setConfirmModal({
      open: true,
      title: t.settings_data_reset_title,
      message: t.settings_data_reset_confirm,
      confirmText: t.settings_data_reset,
      isDanger: true,
      onConfirm: () => {
        setConfirmModal((prev) => ({ ...prev, open: false }));
        Object.values(STORAGE_KEYS).forEach((key) =>
          localStorage.removeItem(key),
        );
        window.location.reload();
      },
    });
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setConfirmModal({
        open: true,
        title: t.backup_json_import_title,
        message: t.backup_json_confirm,
        confirmText: t.modal_confirm,
        isDanger: false,
        onConfirm: () => {
          setConfirmModal((prev) => ({ ...prev, open: false }));
          const res = importFullBackupFromJson(content);
          if (res.success) {
            setAlertModal({
              open: true,
              title: t.backup_json_import_title,
              message: t.backup_json_success,
              onClose: () => window.location.reload(),
            });
          } else if (res.error === "quota_exceeded") {
            setAlertModal({
              open: true,
              title: t.backup_json_import_title,
              message: t.backup_json_quota_exceeded,
              isError: true,
            });
          } else {
            setAlertModal({
              open: true,
              title: t.backup_json_import_title,
              message: t.backup_json_error,
              isError: true,
            });
          }
        },
      });
    };
    reader.onerror = () => {
      setAlertModal({
        open: true,
        title: t.backup_json_import_title,
        message: t.backup_json_error,
        isError: true,
      });
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Card 
      title={
        <div className="flex items-center gap-2">
          <Cloud className="size-4 text-indigo-400" />
          {t.settings_data_title}
        </div>
      }
    >
      <div className="space-y-5">
        {/* 실시간 로컬 자동 저장 안내 배너 */}
        <div className="flex items-start gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2.5 text-xs text-emerald-400">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-400" />
          <span className="leading-relaxed font-medium">
            {t.settings_data_local_auto_note}
          </span>
        </div>

        {/* 로컬 스토리지 진단 및 지속성 상태 */}
        <div className="space-y-2.5 rounded-lg border border-zinc-800 bg-zinc-900/50 p-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <HardDrive className="size-4 text-indigo-400" />
              <span className="text-xs font-semibold text-zinc-300">
                {t.storage_usage_label(formattedLocalUsage, formattedBrowserQuota || "50MB+")}
              </span>
            </div>
            {isPersisted ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-2xs font-medium text-emerald-400">
                <ShieldCheck className="size-3" />
                {t.storage_persisted_active}
              </span>
            ) : (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-2xs font-medium text-amber-400">
                  <AlertTriangle className="size-3" />
                  {t.storage_persisted_inactive}
                </span>
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-6 px-2 text-2xs"
                  onClick={requestPersistence}
                  disabled={isRequesting}
                >
                  {t.storage_request_persist}
                </Button>
              </div>
            )}
          </div>
          <p className="text-2xs leading-relaxed text-zinc-400">
            {t.storage_persisted_desc}
          </p>
        </div>

        {/* Google Drive 연동 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-400">
            <Cloud className="size-3.5 text-blue-400" />
            {t.settings_data_drive_subtitle}
          </div>
          {drive.isConnected ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={drive.loadFromDrive}
                  disabled={drive.isSyncing}
                >
                  {drive.isLoading ? (
                    <span className="animate-pulse">{t.drive_syncing}</span>
                  ) : (
                    t.drive_load_from_drive
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={drive.syncNow}
                  disabled={drive.isSyncing}
                >
                  {drive.isSaving ? (
                    <span className="animate-pulse">{t.drive_saving}</span>
                  ) : (
                    t.drive_save_to_drive
                  )}
                </Button>
                {drive.syncedAt && (
                  <span className="text-xs text-zinc-400">
                    {t.drive_synced_at(
                      format(new Date(drive.syncedAt), "HH:mm"),
                    )}
                  </span>
                )}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={drive.disconnect}
                  disabled={drive.isSyncing}
                >
                  {t.drive_disconnect}
                </Button>
              </div>
              {drive.syncError && (
                <p className="rounded bg-red-500/10 px-3 py-1.5 text-xs text-red-600">
                  {t.drive_error_prefix}{" "}
                  {drive.syncError === "no_client_id"
                    ? t.drive_error_no_client_id
                    : drive.syncError === "gis_not_loaded"
                      ? t.drive_error_gis_not_loaded
                      : drive.syncError}
                </p>
              )}
              {drive.pendingConflict && (
                <div className="space-y-2 rounded-lg border border-amber-300 bg-amber-50 p-3">
                  <p className="text-xs font-semibold text-amber-800">
                    {t.drive_conflict_title}
                  </p>
                  <p className="text-xs text-amber-700">
                    {t.drive_conflict_desc(
                      format(
                        new Date(drive.pendingConflict.syncedAt),
                        "MM/dd HH:mm",
                      ),
                      drive.syncedAt
                        ? format(new Date(drive.syncedAt), "MM/dd HH:mm")
                        : "-",
                    )}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={drive.resolveWithDrive}>
                      {t.drive_use_drive}
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={drive.resolveWithLocal}
                    >
                      {t.drive_use_local}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-sm text-zinc-500">{t.drive_desc}</p>
              <Button size="sm" variant="secondary" onClick={drive.connect}>
                {t.drive_connect}
              </Button>
            </div>
          )}
          <div className="space-y-1 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2.5">
            <p className="text-xs font-medium text-zinc-400">
              {t.settings_data_drive_title}
            </p>
            <p className="text-xs leading-relaxed text-zinc-500">
              {t.settings_data_drive_note}
            </p>
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 inline-block text-xs text-zinc-400 transition-colors hover:text-zinc-100"
            >
              myaccount.google.com/permissions →
            </a>
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* 오프라인 통합 백업 (JSON) */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-400">
            <FileJson className="size-3.5 text-amber-400" />
            {t.backup_json_title}
          </div>
          <p className="text-xs leading-relaxed text-zinc-500">
            {t.backup_json_desc}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              className="flex items-center gap-1.5"
              onClick={() => exportFullBackupAsJson()}
            >
              <Download className="size-3.5" />
              {t.backup_json_export_btn}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="flex items-center gap-1.5"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-3.5" />
              {t.backup_json_import_btn}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="hidden"
              onChange={handleImportJson}
            />
          </div>
        </div>

        <hr className="border-zinc-800" />

        {/* 로컬 스토리지 초기화 */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wide text-zinc-400">
            <HardDrive className="size-3.5 text-rose-400" />
            {t.settings_data_local_title}
          </div>
          <p className="text-xs text-zinc-500">{t.settings_data_desc}</p>
          <Button variant="danger" size="sm" onClick={handleResetAll}>
            {t.settings_data_reset}
          </Button>
        </div>
      </div>

      {/* 확인 모달 */}
      <Modal
        open={confirmModal.open}
        onClose={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        title={
          <div className="flex items-center gap-2">
            {confirmModal.isDanger ? (
              <AlertTriangle className="size-4 text-rose-400" />
            ) : (
              <FileJson className="size-4 text-amber-400" />
            )}
            <span>{confirmModal.title}</span>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-300">
            {confirmModal.message}
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="secondary"
              autoFocus={confirmModal.isDanger}
              onClick={() =>
                setConfirmModal((prev) => ({ ...prev, open: false }))
              }
            >
              {t.modal_cancel}
            </Button>
            <Button
              variant={confirmModal.isDanger ? "danger" : "primary"}
              onClick={confirmModal.onConfirm}
            >
              {confirmModal.confirmText}
            </Button>
          </div>
        </div>
      </Modal>

      {/* 결과 알림 모달 */}
      <Modal
        open={alertModal.open}
        onClose={() => {
          setAlertModal((prev) => ({ ...prev, open: false }));
          alertModal.onClose?.();
        }}
        title={
          <div className="flex items-center gap-2">
            {alertModal.isError ? (
              <AlertTriangle className="size-4 text-rose-400" />
            ) : (
              <CheckCircle2 className="size-4 text-emerald-400" />
            )}
            <span>{alertModal.title}</span>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-zinc-300">
            {alertModal.message}
          </p>
          <div className="flex justify-end pt-2">
            <Button
              variant="secondary"
              onClick={() => {
                setAlertModal((prev) => ({ ...prev, open: false }));
                alertModal.onClose?.();
              }}
            >
              {t.modal_close}
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}
