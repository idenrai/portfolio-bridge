import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import { useAssetStore } from "@/stores";
import { usePortfolio } from "@/hooks";
import { Card, Button, Modal } from "@/components/common";
import { AssetForm, AssetTable, BrokerManager, AIClassificationModal, CSVPreviewModal } from "@/components/assets";
import { downloadCsv, parseCsv } from "@/utils";
import { useT } from "@/hooks";
import type {
  Asset,
  AssetFormData,
  Market,
  AssetType,
  AssetCategory,
} from "@/types";

export function AssetsPage() {
  const { assets } = usePortfolio();
  const { addAsset, updateAsset, deleteAsset } = useAssetStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | undefined>();
  const [brokerManagerOpen, setBrokerManagerOpen] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<AssetFormData[] | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useT();

  // ── 필터 / 정렬 상태 ──────────────────────────────────────────────────────
  const [filterMarket, setFilterMarket] = useState<Market | "">("");
  const [filterType, setFilterType] = useState<AssetType | "">("");
  const [filterCategory, setFilterCategory] = useState<AssetCategory | "">("");
  const [sortKey, setSortKey] = useState<"name" | "value" | "pnl" | "return">(
    "value",
  );
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const handleSort = (key: "name" | "value" | "pnl" | "return") => {
    if (sortKey === key)
      setSortDir((d: "asc" | "desc") => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredAssets = assets
    .filter((a) => !filterMarket || a.market === filterMarket)
    .filter((a) => !filterType || a.type === filterType)
    .filter(
      (a) =>
        !filterCategory ||
        a.categories.includes(filterCategory as AssetCategory),
    );


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
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-balance text-white md:text-3xl">{t.asset_title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={() => setBrokerManagerOpen(true)}>
            {t.broker_manage_btn}
          </Button>
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
      <div className="rounded-xl bg-linear-to-r from-violet-500/20 to-purple-500/20 p-px shadow-sm">
        <div className="rounded-[11px] bg-zinc-950/95 p-4 sm:px-5">
          <div className="flex flex-col gap-4">
            {/* Header */}
            <div className="flex gap-4">
              <Sparkles className="mt-0.5 size-6 shrink-0 text-indigo-400" />
              <div className="flex-1 space-y-3">
                <p className="text-sm leading-tight font-semibold text-zinc-100">
                  {t.asset_ai_banner_title}
                </p>
                <p className="mt-1 text-[11px] leading-relaxed text-zinc-500 sm:text-xs">
                  {t.asset_ai_banner_desc}
                </p>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPromptOpen(true)}
                disabled={assets.length === 0}
                className="flex-1 cursor-pointer rounded-lg border border-violet-500/30 bg-violet-500/10 px-3 py-2 text-center text-xs font-medium whitespace-nowrap text-violet-400 shadow-sm transition-all hover:bg-violet-500/20 hover:opacity-90 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
              >
                {t.asset_btn_ai}
              </button>
            </div>
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
          assets={filteredAssets}
          allAssets={assets}
          filterMarket={filterMarket}
          filterType={filterType}
          filterCategory={filterCategory}
          onFilterMarket={setFilterMarket}
          onFilterType={setFilterType}
          onFilterCategory={setFilterCategory}
          sortKey={sortKey}
          sortDir={sortDir}
          onSort={handleSort}
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

      <AIClassificationModal
        open={promptOpen}
        onClose={() => setPromptOpen(false)}
      />

      {/* CSV 미리보기 모달 */}
      <CSVPreviewModal
        open={!!importPreview}
        previewData={importPreview}
        onClose={() => setImportPreview(null)}
        onConfirm={handleConfirmImport}
      />

      {/* 계좌 관리 모달 */}
      <Modal
        open={brokerManagerOpen}
        onClose={() => setBrokerManagerOpen(false)}
        title={t.broker_title}
        maxWidth="max-w-2xl"
      >
        <BrokerManager />
      </Modal>
    </div>
  );
}
