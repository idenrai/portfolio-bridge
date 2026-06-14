import { useState, useRef } from "react";
import { useAssetStore } from "@/stores";
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
  const { assets, addAsset, updateAsset, deleteAsset } = useAssetStore();
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
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">{t.asset_title}</h1>
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
      <div className="rounded-xl bg-linear-to-r from-violet-600 to-purple-500 p-px shadow-md">
        <div className="rounded-[11px] bg-zinc-950/95 px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
              <span className="text-2xl shrink-0 mt-0.5">🤖</span>
              <div className="min-w-0">
                <p className="text-sm font-bold text-white leading-tight">
                  {t.asset_ai_banner_title}
                </p>
                <p className="text-xs text-zinc-400 mt-0.5 leading-relaxed">
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
