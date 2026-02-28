import { useState, useRef } from "react";
import { useAssetStore } from "@/stores";
import { Card, Button, Modal } from "@/components/common";
import { AssetForm } from "@/components/assets/AssetForm";
import { AssetTable } from "@/components/assets/AssetTable";
import { downloadCsv, parseCsv } from "@/utils";
import {
  buildClassificationPrompt,
  parseAiResponse,
} from "@/utils/aiClassification";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptText = buildClassificationPrompt(assets);

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
      for (const { id, tag } of results) {
        updateAsset(id, { tags: [tag] });
      }
      setImportResult({ applied, skipped });
    } catch (err) {
      setImportError(
        err instanceof Error
          ? `파싱 오류: ${err.message}`
          : "알 수 없는 오류가 발생했습니다.",
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
    if (window.confirm("이 자산을 삭제하시겠습니까?")) {
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
      parsed.forEach((data) => addAsset(data));
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">자산 관리</h2>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setPromptOpen(true)}
            disabled={assets.length === 0}
          >
            🤖 AI 분류 프롬프트
          </Button>
          <Button variant="secondary" size="sm" onClick={handleImport}>
            CSV 가져오기
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleExport}
            disabled={assets.length === 0}
          >
            CSV 내보내기
          </Button>
          <Button size="sm" onClick={handleAdd}>
            + 자산 추가
          </Button>
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
        title={editingAsset ? "자산 수정" : "새 자산 등록"}
        maxWidth="max-w-xl"
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
        title="🤖 AI 분류"
        maxWidth="max-w-2xl"
      >
        <div className="space-y-4">
          {/* 탭 */}
          <div className="flex rounded-lg border border-slate-200 overflow-hidden">
            <button
              type="button"
              onClick={() => setPromptTab("generate")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                promptTab === "generate"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              ① 프롬프트 생성
            </button>
            <button
              type="button"
              onClick={() => setPromptTab("import")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                promptTab === "import"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              ② AI 응답 가져오기
            </button>
          </div>

          {promptTab === "generate" ? (
            <>
              <p className="text-sm text-slate-600">
                아래 프롬프트를 복사해 ChatGPT, Claude 등 AI에 붙여 넣으세요.
                <br />
                응답을 받으면{" "}
                <button
                  type="button"
                  onClick={() => setPromptTab("import")}
                  className="text-blue-600 font-medium underline underline-offset-2"
                >
                  ② AI 응답 가져오기
                </button>{" "}
                탭에서 자동 적용할 수 있습니다.
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
                  닫기
                </Button>
                <Button onClick={handleCopyPrompt}>
                  {copied ? "✓ 복사됨!" : "클립보드에 복사"}
                </Button>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-slate-600">
                AI가 응답한 JSON을 아래에 붙여 넣고 <strong>태그 적용</strong>{" "}
                버튼을 눌러 주세요.
                <br />
                <span className="text-xs text-slate-400">
                  형식: {`[{ "index": 1, "tag": "dividend", ... }, ...]`}
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
                placeholder={`AI 응답 JSON을 여기에 붙여 넣으세요...\n\n예시:\n[\n  { "index": 1, "name": "삼성전자", "tag": "value", "reason": "..." },\n  { "index": 2, "name": "MSFT", "tag": "growth", "reason": "..." }\n]`}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs font-mono text-slate-700 resize-none focus:outline-none focus:border-blue-300"
              />

              {importError && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">
                  {importError}
                </div>
              )}

              {importResult && (
                <div className="rounded-lg bg-green-50 border border-green-200 px-3 py-2 text-sm text-green-700">
                  ✓ <strong>{importResult.applied}건</strong> 태그가
                  적용되었습니다.
                  {importResult.skipped > 0 && (
                    <span className="text-green-500">
                      {" "}
                      ({importResult.skipped}건 건너뜀)
                    </span>
                  )}
                </div>
              )}

              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={handleClosePrompt}>
                  닫기
                </Button>
                <Button
                  onClick={handleImportAiJson}
                  disabled={!aiJsonInput.trim()}
                >
                  태그 적용
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
