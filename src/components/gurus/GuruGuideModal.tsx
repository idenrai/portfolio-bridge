import { useState, useMemo } from "react";
import { Compass, ChevronRight, ChevronLeft, RotateCcw } from "lucide-react";
import { Modal } from "@/components/common";
import { useT } from "@/hooks";
import {
  matchGurus,
  type GuruCategoryTag,
  type GuruMatchAnswer,
  type GuruMatchResult,
} from "@/utils";
import type { GuruId } from "@/types";
import {
  GuruGuideStepRisk,
  GuruGuideStepStrategy,
  GuruGuideStepTone,
  GuruGuideResultView,
} from "./guide";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectGuru: (guruId: GuruId) => void;
  onOpenCustomGuruConfig?: () => void;
}

function GuruGuideModalInner({
  onClose,
  onSelectGuru,
  onOpenCustomGuruConfig,
}: Omit<Props, "open">) {
  const t = useT();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [risk, setRisk] = useState<GuruMatchAnswer["risk"]>("balanced");
  const [strategy, setStrategy] = useState<GuruCategoryTag>("value");
  const [tone, setTone] = useState<GuruMatchAnswer["tone"]>("mentor");

  const matchResults = useMemo<GuruMatchResult[]>(() => {
    if (step !== 4) return [];
    return matchGurus({ risk, strategy, tone });
  }, [step, risk, strategy, tone]);

  const topMatch = matchResults[0];
  const otherMatches = matchResults.slice(1, 3);

  const handleNext = () => {
    if (step < 3) {
      setStep((s) => (s + 1) as 1 | 2 | 3 | 4);
    } else if (step === 3) {
      setStep(4);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep((s) => (s - 1) as 1 | 2 | 3 | 4);
    }
  };

  const handleRestart = () => {
    setStep(1);
    setRisk("balanced");
    setStrategy("value");
    setTone("mentor");
  };

  const handleSelect = (guruId: GuruId) => {
    onSelectGuru(guruId);
    onClose();
  };

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="flex size-6 items-center justify-center rounded-none border border-amber-500/30 bg-amber-500/10 text-amber-400">
            <Compass className="size-3.5" />
          </div>
          <span>
            {step === 4
              ? t.guru_guide_result_title
              : t.guru_guide_modal_title}
          </span>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-6 p-1 sm:p-2">
        {/* Step indicator header */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <p className="text-xs text-zinc-400">
            {step === 4
              ? t.guru_guide_result_desc
              : t.guru_guide_modal_desc}
          </p>

          {step < 4 ? (
            <span className="shrink-0 rounded-none border border-zinc-800 bg-zinc-900 px-2 py-0.5 font-mono text-2xs font-semibold text-amber-400">
              {t.guru_guide_step(step, 3)}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleRestart}
              className="flex shrink-0 cursor-pointer items-center gap-1 rounded-none border border-zinc-800 bg-zinc-900 px-2.5 py-1 font-mono text-xs text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
            >
              <RotateCcw className="size-3.5" />
              <span>{t.guru_guide_btn_restart}</span>
            </button>
          )}
        </div>

        {/* STEP 1: RISK & OBJECTIVE */}
        {step === 1 && (
          <GuruGuideStepRisk risk={risk} onChangeRisk={setRisk} />
        )}

        {/* STEP 2: PORTFOLIO STRATEGY */}
        {step === 2 && (
          <GuruGuideStepStrategy
            strategy={strategy}
            onChangeStrategy={setStrategy}
          />
        )}

        {/* STEP 3: ADVISORY TONE */}
        {step === 3 && (
          <GuruGuideStepTone tone={tone} onChangeTone={setTone} />
        )}

        {/* STEP 4: RECOMMENDATION RESULTS */}
        {step === 4 && topMatch && (
          <GuruGuideResultView
            topMatch={topMatch}
            otherMatches={otherMatches}
            onSelectGuru={handleSelect}
            onOpenCustomGuruConfig={onOpenCustomGuruConfig}
          />
        )}

        {/* MODAL FOOTER NAV BUTTONS */}
        {step < 4 && (
          <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="flex min-h-11 cursor-pointer items-center gap-1 rounded-none border border-zinc-800 bg-zinc-900 px-3.5 py-1.5 font-mono text-xs font-semibold text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              >
                <ChevronLeft className="size-4" />
                <span>{t.guru_guide_btn_prev}</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={handleNext}
              className="flex min-h-11 cursor-pointer items-center gap-1 rounded-none border border-amber-500/40 bg-amber-500/10 px-5 py-2 font-mono text-xs font-bold text-amber-400 shadow-none transition-all hover:bg-amber-400 hover:text-black active:scale-100"
            >
              <span>{step === 3 ? t.guru_guide_btn : t.guru_guide_btn_next}</span>
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}

export function GuruGuideModal({
  open,
  onClose,
  onSelectGuru,
  onOpenCustomGuruConfig,
}: Props) {
  if (!open) return null;

  return (
    <GuruGuideModalInner
      onClose={onClose}
      onSelectGuru={onSelectGuru}
      onOpenCustomGuruConfig={onOpenCustomGuruConfig}
    />
  );
}
