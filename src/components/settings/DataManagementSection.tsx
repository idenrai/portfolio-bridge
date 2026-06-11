import { useGoogleDrive, useT } from "@/hooks";
import { Card, Button } from "@/components/common";
import { STORAGE_KEYS } from "@/constants";
import { format } from "date-fns";

export function DataManagementSection() {
  const t = useT();
  const drive = useGoogleDrive();

  const handleResetAll = () => {
    if (window.confirm(t.settings_data_reset_confirm)) {
      Object.values(STORAGE_KEYS).forEach((key) =>
        localStorage.removeItem(key),
      );
      window.location.reload();
    }
  };

  return (
    <Card title={t.settings_data_title}>
      <div className="space-y-5">
        {/* Google Drive 연동 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            Google Drive
          </p>
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
                  <span className="text-xs text-slate-400">
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
                <p className="text-xs text-red-600 bg-red-50 rounded px-3 py-1.5">
                  {t.drive_error_prefix}{" "}
                  {drive.syncError === "no_client_id"
                    ? t.drive_error_no_client_id
                    : drive.syncError === "gis_not_loaded"
                      ? t.drive_error_gis_not_loaded
                      : drive.syncError}
                </p>
              )}
              {drive.pendingConflict && (
                <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 space-y-2">
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
              <p className="text-sm text-slate-500">{t.drive_desc}</p>
              <Button size="sm" variant="secondary" onClick={drive.connect}>
                {t.drive_connect}
              </Button>
            </div>
          )}
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 space-y-1">
            <p className="text-xs font-medium text-slate-600">
              {t.settings_data_drive_title}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {t.settings_data_drive_note}
            </p>
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-xs text-blue-600 hover:underline mt-0.5"
            >
              myaccount.google.com/permissions →
            </a>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* 로컬 스토리지 초기화 */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-500 tracking-wide">
            {t.settings_data_local_title}
          </p>
          <p className="text-sm text-slate-500">{t.settings_data_desc}</p>
          <Button variant="danger" size="sm" onClick={handleResetAll}>
            {t.settings_data_reset}
          </Button>
        </div>
      </div>
    </Card>
  );
}
