import { AlertTriangle, Calendar, Check, Copy } from "lucide-react";
import { FeedbackIconText } from "@/components/common";
import type { Translations } from "@/i18n";

interface GuruFollowUpSectionProps {
  followUpText: string;
  prevSessionDate?: string;
  activeAssetsCount: number;
  copiedFollowUp: boolean;
  onCopyFollowUp: () => void;
  t: Translations;
}

export function GuruFollowUpSection({
  followUpText,
  prevSessionDate,
  activeAssetsCount,
  copiedFollowUp,
  onCopyFollowUp,
  t,
}: GuruFollowUpSectionProps) {
  return (
    <div className="mt-4 space-y-3 border-t border-zinc-800/50 pt-4">
      <div className="flex items-center gap-2">
        {prevSessionDate && (
          <span className="rounded-full border border-emerald-800/50 bg-emerald-900/30 px-2 py-0.5 text-2xs font-medium text-emerald-400">
            <Calendar className="mr-1.5 inline-block size-3 text-emerald-400/80" /> {prevSessionDate}
          </span>
        )}
        <p className="text-xs-plus text-zinc-500">{t.guru_ai_followup_desc}</p>
      </div>
      {activeAssetsCount === 0 ? (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-400">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{t.guru_ai_scope_empty_warning}</span>
        </div>
      ) : (
        <div className="group relative">
          <textarea
            readOnly
            value={followUpText}
            rows={14}
            aria-label={t.guru_ai_followup_btn}
            className="w-full resize-none rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-3 pb-12 font-mono text-xs-plus text-zinc-300 transition-shadow focus:ring-1 focus:ring-emerald-500/50 focus:outline-none sm:text-xs"
          />
          <button
            type="button"
            onClick={onCopyFollowUp}
            className="absolute right-3 bottom-3 shrink-0 cursor-pointer rounded-md border border-emerald-700/50 bg-emerald-800/80 px-3 py-1.5 text-xs font-medium text-emerald-50 shadow-sm backdrop-blur transition-colors hover:bg-emerald-700"
          >
            {copiedFollowUp ? (
              <FeedbackIconText
                icon={Check}
                text={t.guru_ai_copied}
                animate={true}
                className="text-emerald-300"
                textClassName="text-emerald-50"
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
      <div className="mt-1 flex items-start gap-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2.5">
        <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-yellow-500" />
        <span className="text-2xs leading-relaxed text-yellow-500/90 sm:text-xs-plus">
          {t.guru_ai_search_warn}
        </span>
      </div>
    </div>
  );
}
