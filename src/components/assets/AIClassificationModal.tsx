import { useState } from "react";
import { useAssetStore, useLanguageStore } from "@/stores";
import { useT } from "@/hooks";
import { Button, Modal } from "@/components/common";
import { buildClassificationPrompt, parseAiResponse, cn } from "@/utils";
import { Sparkles } from "lucide-react";

interface AIClassificationModalProps {
  open: boolean;
  onClose: () => void;
}

export function AIClassificationModal({
  open,
  onClose }: AIClassificationModalProps) {
  const { assets, updateAsset } = useAssetStore();
  const lang = useLanguageStore((s) => s.lang);
  const t = useT();

  const [promptTab, setPromptTab] = useState<"generate" | "import">("generate");
  const [copied, setCopied] = useState(false);
  const [aiJsonInput, setAiJsonInput] = useState("");
  const [importResult, setImportResult] = useState<{
    applied: number;
    skipped: number;
  } | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const promptText = buildClassificationPrompt(assets, lang);

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

  const handleClose = () => {
    setCopied(false);
    setAiJsonInput("");
    setImportResult(null);
    setImportError(null);
    setPromptTab("generate");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2">
          <Sparkles className="size-5 text-indigo-400" />
          <span>{t.asset_ai_modal_title}</span>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* 탭 */}
        <div className="flex overflow-hidden rounded-lg border border-zinc-800">
          <button
            type="button"
            onClick={() => setPromptTab("generate")}
            className={cn(
              "flex-1 cursor-pointer py-2 text-sm font-medium transition-colors",
              promptTab === "generate"
                ? "bg-zinc-100 text-black shadow-sm"
                : "bg-white text-zinc-400 hover:bg-zinc-900/50"
            )}
          >
            {t.asset_ai_tab_generate}
          </button>
          <button
            type="button"
            onClick={() => setPromptTab("import")}
            className={cn(
              "flex-1 cursor-pointer py-2 text-sm font-medium transition-colors",
              promptTab === "import"
                ? "bg-zinc-100 text-black shadow-sm"
                : "bg-white text-zinc-400 hover:bg-zinc-900/50"
            )}
          >
            {t.asset_ai_tab_import}
          </button>
        </div>

        {promptTab === "generate" ? (
          <>
            <p className="text-sm text-zinc-400">
              {t.asset_ai_copy_desc}
              <br />
              {t.asset_ai_copy_link_pre}{" "}
              <button
                type="button"
                onClick={() => setPromptTab("import")}
                className="cursor-pointer font-medium text-zinc-300 underline underline-offset-2"
              >
                {t.asset_ai_tab_link}
              </button>{" "}
              {t.asset_ai_copy_link_post}
            </p>
            <textarea
              readOnly
              value={promptText}
              rows={16}
              aria-label={t.asset_ai_copy_desc}
              onFocus={(e) => e.target.select()}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-sm text-zinc-300 focus:ring-1 focus:ring-zinc-700 focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                {t.asset_ai_close}
              </Button>
              <Button onClick={handleCopyPrompt}>
                {copied ? t.asset_ai_copied : t.asset_ai_copy}
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-400">
              {t.asset_ai_import_desc} <strong>{t.asset_ai_apply_btn}</strong>{" "}
              {t.asset_ai_import_btn_suffix}
              <br />
              <span className="text-xs text-zinc-400">
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
              aria-label={t.asset_ai_json_placeholder}
              spellCheck={false}
              placeholder={t.asset_ai_json_placeholder}
              className="w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-3 font-mono text-sm text-zinc-300 focus:ring-1 focus:ring-zinc-700 focus:outline-none"
            />

            {importError && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {importError}
              </div>
            )}

            {importResult && (
              <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-400">
                {t.asset_ai_apply_result(
                  importResult.applied,
                  importResult.skipped,
                )}
              </div>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
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
  );
}
