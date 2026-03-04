import { useState, useRef } from "react";
import { useAssetStore, useLanguageStore } from "@/pages/stores";
import { Card, Button, Modal } from "@/components/common";
import { AssetForm } from "@/components/assets/AssetForm";
import { AssetTable } from "@/components/assets/AssetTable";
import { downloadCsv, parseCsv } from "@/utils";
import {
  buildClassificationPrompt,
  parseAiResponse,
} from "@/utils/aiClassification";
import { useT, useGoogleDrive } from "@/hooks";
import { format } from "date-fns";
import type { Asset, AssetFormData } from "@/types";

export function AssetsPage() {
  const { assets, addAsset, updateAsset, deleteAsset } = useAssetStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();
  const [promptOpen, setPromptOpen] = useState(false);
  const [promptTab, setPromptTab] = useState<"generate" | "import">("generate");
  const [copied, setCopied] = useState(false);
  const [aiJsonInput, setAiJsonInput] = useState("");
  const [importResult, setImportResult] = useState<{
    applied: number;
    skipped: number;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importPreview, setImportPreview] = useState<AssetFormData[] | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lang = useLanguageStore((s) => s.lang);
  const promptText = buildClassificationPrompt(assets, lang);
  const t = useT();
  const drive = useGoogleDrive();

  const handleCopyPrompt = async () => {
    await navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportAiJson = () => {
    setImportResult(null);
    setImportError(null);
    try {
      const { applied, skipped, results } = parseAiResponse(
        aiJsonInput,
        assets,
      );
      for (const { id, category } of results) {
        updateAsset(id, { categories: [category] });
      }
      setImportResult({ applied, skipped });
    } catch (err) {
      setImportError(
        err instanceof Error
          ? `${t.asset_ai_parse_error}: ${err.message}`
          : t.asset_ai_parse_error,
      );
    }
  };

  const handleClosePrompt = () => {
    setPromptOpen(false);
    setCopied(false);
    setAiJsonInput("");
    setImportResult(null);
    setImportError(null);
    setPromptTab("generate");
  };

  const handleAdd = () => {
    setEditingAsset(undefined);
    setModalOpen(true);
  };

  const handleEdit = (asset: Asset) => {
    setEditingAsset(asset);
    setModalOpen(true);
  };

  const handleSubmit = (data: AssetFormData) => {
    if (editingAsset) {
      updateAsset(editingAsset.id, data);
    } else {
      addAsset(data);
    }
    setModalOpen(false);
    setEditingAsset(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t.asset_delete_confirm)) {
      deleteAsset(id);
    }
  };

  const handleExport = () => {
    downloadCsv(assets);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const csv = ev.target?.result as string;
      const parsed = parseCsv(csv);
      setImportPreview(parsed);
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const handleConfirmImport = () => {
    if (!importPreview) return;
    importPreview.forEach((data) => addAsset(data));
    setImportPreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">{t.asset_title}</h2>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleImport}>
            {t.asset_btn_import_csv}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={assets.length === 0}
          >
            {t.asset_btn_export_csv}
          </Button>
          <Button size="sm" onClick={handleAdd}>
            {t.asset_btn_add}
          </Button>
        </div>
      </div>

      {/* Google Drive 세션 */}
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-slate-500 mr-1">Google Drive</span>
          {drive.isConnected ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={drive.loadFromDrive}
                disabled={drive.isSyncing}
              >
                {t.drive_load_from_drive}
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={drive.syncNow}
                disabled={drive.isSyncing}
              >
                {drive.isSyncing
                  ? <span className="animate-pulse">{t.drive_syncing}</span>
                  : t.drive_save_to_drive
                }
              </Button>
              {drive.syncedAt && (
                <span className="text-xs text-slate-400">
                  {t.drive_synced_at(format(new Date(drive.syncedAt), "HH:mm"))}
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
            </>
          ) : (
            <Button size="sm" variant="secondary" onClick={drive.connect}>
              {t.drive_connect}
            </Button>
          )}
        </div>

        {/* 에러 */}
        {drive.syncError && (
          <p className="mt-2 text-xs text-red-600 bg-red-50 rounded px-3 py-1.5">
            {t.drive_error_prefix}{" "}
            {drive.syncError === "no_client_id"
              ? t.drive_error_no_client_id
              : drive.syncError === "gis_not_loaded"
                ? t.drive_error_gis_not_loaded
                : drive.syncError}
          </p>
        )}

        {/* 충돌 해소 */}
        {drive.pendingConflict && (
          <div className="mt-2 rounded-lg border border-amber-300 bg-amber-50 p-3 space-y-2">
            <p className="text-xs font-semibold text-amber-800">{t.drive_conflict_title}</p>
            <p className="text-xs text-amber-700">
              {t.drive_conflict_desc(
                format(new Date(drive.pendingConflict.syncedAt), "MM/dd HH:mm"),
                drive.syncedAt ? format(new Date(drive.syncedAt), "MM/dd HH:mm") : "-",
              )}
            </p>
            <div className="flex gap-2">
              <Button size="sm" onClick={drive.resolveWithDrive}>{t.drive_use_drive}</Button>
              <Button size="sm" variant="secondary" onClick={drive.resolveWithLocal}>{t.drive_use_local}</Button>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-xl bg-linear-to-r from-violet-600 to-purple-500 p-px shadow-md">
        <div className="rounded-[11px] bg-white/95 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-2xl shrink-0 mt-0.5">🤖</span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 leading-tight">
                  {t.asset_ai_banner_title}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {t.asset_ai_banner_desc}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPromptOpen(true)}
              disabled={assets.length === 0}
              className="shrink-0 rounded-lg bg-linear-to-r from-violet-600 to-purple-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t.asset_btn_ai}
            </button>
          </div>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <Card>
        <AssetTable
          assets={assets}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAsset(undefined);
        }}
        title={editingAsset ? t.asset_modal_edit : t.asset_modal_add}
        maxWidth="max-w-2xl"
      >
        <AssetForm
          initial={editingAsset}
          onSubmit={handleSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingAsset(undefined);
          }}
        />
      </Modal>

      {/* AI 분류 프롬프트 모달 */}
      <Modal
        open={promptOpen}
        onClose={handleClosePrompt}
        title={t.asset_ai_modal_title}
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {/* 탭 */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setPromptTab("generate")}
              className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                promptTab === "generate"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.asset_ai_tab_generate}
            </button>
            <button
              type="button"
              onClick={() => setPromptTab("import")}
              className={`flex-1 py-2 text-sm font-medium transition-colors cursor-pointer ${
                promptTab === "import"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {t.asset_ai_tab_import}
            </button>
          </div>

          {promptTab === "generate" ? (
            <>
              <p className="text-sm text-slate-600">
                {t.asset_ai_copy_desc}
                <br />
                {t.asset_ai_copy_link_pre}{" "}
                <button
                  type="button"
                  onClick={() => setPromptTab("import")}
                  className="text-blue-600 font-medium underline underline-offset-2 cursor-pointer"
                >
                  {t.asset_ai_tab_link}
                </button>{" "}
                {t.asset_ai_copy_link_post}
              </p>
              <textarea
                readOnly
                value={promptText}
                rows={16}
                onFocus={(e) => e.target.select()}
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-mono text-slate-700 resize-none focus:outline-none focus:border-blue-300"
              />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={handleClosePrompt}>
                  {t.asset_ai_close}
                </Button>
                <Button onClick={handleCopyPrompt}>
                  {copied ? t.asset_ai_copied : t.asset_ai_copy}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                {t.asset_ai_import_desc} <strong>{t.asset_ai_apply_btn}</strong>{" "}
                {t.asset_ai_import_btn_suffix}
                <br />
                <span className="text-xs text-slate-400">
                  {t.asset_ai_format_label}{" "}
                  {`[{ "index": 1, "category": "dividend", ... }, ...]`}
                </span>
              </p>
              <textarea
                value={aiJsonInput}
                onChange={(e) => {
                  setAiJsonInput(e.target.value);
                  setImportResult(null);
                  setImportError(null);
                }}
                rows={14}
                placeholder={t.asset_ai_json_placeholder}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-700 resize-none focus:outline-none focus:border-blue-300"
              />

              {importError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {importError}
                </div>
              )}

              {importResult && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                  {t.asset_ai_apply_result(
                    importResult.applied,
                    importResult.skipped,
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={handleClosePrompt}>
                  {t.asset_ai_close}
                </Button>
                <Button
                  onClick={handleImportAiJson}
                  disabled={!aiJsonInput.trim()}
                >
                  {t.asset_ai_apply_btn}
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* CSV 미리보기 모달 */}
      <Modal
        open={!!importPreview}
        onClose={() => setImportPreview(null)}
        title={importPreview ? t.csv_preview_title(importPreview.length) : ""}
        maxWidth="max-w-3xl"
      >
        {importPreview && (
          <div className="space-y-4">
            <div className="overflow-x-auto rounded-lg border border-slate-200">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 text-slate-500 font-medium">
                  <tr>
                    <th className="px-3 py-2">{t.at_col_name}</th>
                    <th className="px-3 py-2">티커</th>
                    <th className="px-3 py-2">{t.at_col_market}</th>
                    <th className="px-3 py-2">{t.af_currency_label}</th>
                    <th className="px-3 py-2 text-right">
                      {t.af_quantity_label}
                    </th>
                    <th className="px-3 py-2 text-right">
                      {t.af_avg_price_label}
                    </th>
                    <th className="px-3 py-2 text-right">
                      {t.af_current_price_label}
                    </th>
                    <th className="px-3 py-2">{t.at_col_category}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {importPreview.slice(0, 5).map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-3 py-1.5 text-slate-800 font-medium">
                        {row.name}
                      </td>
                      <td className="px-3 py-1.5 font-mono text-slate-500">
                        {row.ticker ?? "—"}
                      </td>
                      <td className="px-3 py-1.5 text-slate-600">
                        {row.market}
                      </td>
                      <td className="px-3 py-1.5 text-slate-600">
                        {row.currency}
                      </td>
                      <td className="px-3 py-1.5 text-right text-slate-700">
                        {row.quantity.toLocaleString()}
                      </td>
                      <td className="px-3 py-1.5 text-right text-slate-700">
                        {row.avgBuyPrice.toLocaleString()}
                      </td>
                      <td className="px-3 py-1.5 text-right text-slate-700">
                        {row.currentPrice.toLocaleString()}
                      </td>
                      <td className="px-3 py-1.5 text-slate-500">
                        {row.categories.join(", ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {importPreview.length > 5 && (
              <p className="text-xs text-slate-400 text-center">
                {t.csv_preview_more(importPreview.length - 5)}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                onClick={() => setImportPreview(null)}
              >
                {t.af_btn_cancel}
              </Button>
              <Button onClick={handleConfirmImport}>
                {t.csv_preview_confirm}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
