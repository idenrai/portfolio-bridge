import { AlertTriangle, Check, Copy } from "lucide-react";
import { FeedbackIconText } from "@/components/common";
import type { Translations } from "@/i18n";

interface GuruPromptCardProps {
  promptText: string;
  activeAssetsCount: number;
  copied: boolean;
  onCopy: () => void;
  t: Translations;
}

export function GuruPromptCard({
  promptText,
  activeAssetsCount,
  copied,
  onCopy,
  t,
}: GuruPromptCardProps) {
  return (
    <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
      <p className="font-mono text-xs text-zinc-500">{t.guru_ai_desc}</p>
      {activeAssetsCount === 0 ? (
        <div className="flex items-center gap-2 rounded-none border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-xs text-amber-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{t.guru_ai_scope_empty_warning}</span>
        </div>
      ) : (
        <div className="group relative">
          <textarea
            readOnly
            value={promptText}
            rows={12}
            aria-label={t.guru_ai_banner_title}
            className="w-full resize-none rounded-none border border-zinc-800 bg-zinc-950 p-3 pb-12 font-mono text-xs-plus text-zinc-300 focus:border-amber-400 focus:ring-1 focus:ring-amber-400/40 focus:outline-none sm:text-xs"
          />
          <button
            type="button"
            onClick={onCopy}
            className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-none border border-zinc-700 bg-zinc-900 px-3 py-1.5 font-mono text-xs font-medium text-white shadow-none transition-colors hover:border-zinc-500 hover:bg-zinc-800"
          >
            {copied ? (
              <FeedbackIconText
                icon={Check}
                text={t.guru_ai_copied}
                animate={true}
                className="text-emerald-400"
                textClassName="text-white"
              />
            ) : (
              <FeedbackIconText
                icon={Copy}
                text={t.guru_ai_copy}
                className="transition-opacity hover:opacity-80"
                iconClassName="opacity-70"
              />
            )}
          </button>
        </div>
      )}
      <div className="mt-1 flex items-start gap-2 rounded-none border border-yellow-500/20 bg-yellow-500/10 p-2.5 font-mono">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
        <span className="text-2xs leading-relaxed text-yellow-500/90 sm:text-xs-plus">
          {t.guru_ai_search_warn}
        </span>
      </div>
    </div>
  );
}
