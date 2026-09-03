import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Bot,
  Shield,
  Rocket,
  Scale,
  RotateCcw,
  Check,
  ExternalLink,
} from "lucide-react";
import { Modal } from "@/components/common";
import { useT } from "@/hooks";
import {
  useCustomGuruStore,
  useSettingsStore,
  DEFAULT_CUSTOM_GURU,
  type CustomGuruRisk,
  type CustomGuruStrategy,
  type CustomGuruTone,
} from "@/stores";
import { cn } from "@/utils";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

const AVATAR_ICONS = [
  { id: "sparkles", Icon: Sparkles, label: "Sparkles" },
  { id: "bot", Icon: Bot, label: "Bot" },
  { id: "shield", Icon: Shield, label: "Shield" },
  { id: "rocket", Icon: Rocket, label: "Rocket" },
  { id: "scale", Icon: Scale, label: "Scale" },
] as const;

function CustomGuruModalInner({
  onClose,
  onSaved,
}: {
  onClose: () => void;
  onSaved?: () => void;
}) {
  const t = useT();
  const { config, updateConfig, resetConfig } = useCustomGuruStore();
  const targetAllocations = useSettingsStore((s) => s.targetAllocations);

  const [name, setName] = useState(config.name);
  const [avatarIcon, setAvatarIcon] = useState(config.avatarIcon);
  const [riskTolerance, setRiskTolerance] = useState<CustomGuruRisk>(
    config.riskTolerance,
  );
  const [strategy, setStrategy] = useState<CustomGuruStrategy>(config.strategy);
  const [tone, setTone] = useState<CustomGuruTone>(config.tone);
  const [customPhilosophy, setCustomPhilosophy] = useState(
    config.customPhilosophy ?? "",
  );

  const handleReset = () => {
    setName(DEFAULT_CUSTOM_GURU.name);
    setAvatarIcon(DEFAULT_CUSTOM_GURU.avatarIcon);
    setRiskTolerance(DEFAULT_CUSTOM_GURU.riskTolerance);
    setStrategy(DEFAULT_CUSTOM_GURU.strategy);
    setTone(DEFAULT_CUSTOM_GURU.tone);
    setCustomPhilosophy(DEFAULT_CUSTOM_GURU.customPhilosophy ?? "");
    resetConfig();
  };

  const handleSave = () => {
    updateConfig({
      name: name.trim() || t.custom_guru_default_name,
      avatarIcon,
      riskTolerance,
      strategy,
      tone,
      customPhilosophy: customPhilosophy.trim(),
    });
    onClose();
    onSaved?.();
  };

  const riskOptions: { value: CustomGuruRisk; label: string }[] = [
    { value: "conservative", label: t.custom_guru_risk_conservative },
    { value: "balanced", label: t.custom_guru_risk_balanced },
    { value: "aggressive", label: t.custom_guru_risk_aggressive },
  ];

  const strategyOptions: { value: CustomGuruStrategy; label: string }[] = [
    { value: "all_weather", label: t.custom_guru_strat_all_weather },
    { value: "dividend_cashflow", label: t.custom_guru_strat_dividend },
    { value: "tech_growth", label: t.custom_guru_strat_tech },
    { value: "deep_value", label: t.custom_guru_strat_value },
    { value: "quant_momentum", label: t.custom_guru_strat_momentum },
  ];

  const toneOptions: { value: CustomGuruTone; label: string }[] = [
    { value: "direct_unfiltered", label: t.custom_guru_tone_direct },
    { value: "supportive_mentor", label: t.custom_guru_tone_mentor },
    { value: "analytical_quant", label: t.custom_guru_tone_quant },
  ];

  return (
    <Modal open={true} onClose={onClose} title={t.custom_guru_modal_title} maxWidth="max-w-2xl">
      <div className="space-y-6">
        <p className="text-xs leading-relaxed text-zinc-400">
          {t.custom_guru_modal_desc}
        </p>

        {/* 1. 구루 이름 & 아이콘 */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-2">
            <label
              htmlFor="custom-guru-name"
              className="block text-xs font-semibold text-zinc-200"
            >
              {t.custom_guru_name_label}
            </label>
            <input
              id="custom-guru-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.custom_guru_default_name}
              className="mt-1.5 w-full rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
            />
          </div>

          <div>
            <span className="block text-xs font-semibold text-zinc-200">
              {t.custom_guru_icon_label}
            </span>
            <div className="mt-1.5 flex items-center gap-1.5">
              {AVATAR_ICONS.map(({ id, Icon }) => {
                const isSelected = avatarIcon === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setAvatarIcon(id)}
                    className={cn(
                      "flex size-9 cursor-pointer items-center justify-center rounded-lg border transition-all",
                      isSelected
                        ? "border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-sm"
                        : "border-zinc-800 bg-zinc-900/80 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                    )}
                    aria-label={id}
                  >
                    <Icon className="size-4" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2. 투자 위험 성향 (3택) */}
        <div>
          <span className="block text-xs font-semibold text-zinc-200">
            {t.custom_guru_risk_label}
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {riskOptions.map((opt) => {
              const active = riskTolerance === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRiskTolerance(opt.value)}
                  className={cn(
                    "flex cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-indigo-500/80 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  <span className="text-xs leading-snug font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. 투자 전략 스타일 (5택) */}
        <div>
          <span className="block text-xs font-semibold text-zinc-200">
            {t.custom_guru_strategy_label}
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {strategyOptions.map((opt) => {
              const active = strategy === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStrategy(opt.value)}
                  className={cn(
                    "flex cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-indigo-500/80 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  <span className="text-xs leading-snug font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 조언 어투 (코칭 톤 - 3택) */}
        <div>
          <span className="block text-xs font-semibold text-zinc-200">
            {t.custom_guru_tone_label}
          </span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {toneOptions.map((opt) => {
              const active = tone === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTone(opt.value)}
                  className={cn(
                    "flex cursor-pointer flex-col items-start rounded-xl border p-3 text-left transition-all",
                    active
                      ? "border-indigo-500/80 bg-indigo-500/10 text-white shadow-sm ring-1 ring-indigo-500/30"
                      : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200",
                  )}
                >
                  <span className="text-xs leading-snug font-medium">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 나만의 투자 원칙 / 메모 */}
        <div>
          <label
            htmlFor="custom-guru-philosophy"
            className="block text-xs font-semibold text-zinc-200"
          >
            {t.custom_guru_philosophy_label}
          </label>
          <textarea
            id="custom-guru-philosophy"
            rows={2}
            value={customPhilosophy}
            onChange={(e) => setCustomPhilosophy(e.target.value)}
            placeholder={t.custom_guru_philosophy_placeholder}
            className="mt-1.5 w-full resize-none rounded-lg border border-zinc-800 bg-zinc-900 p-2.5 text-xs text-white placeholder:text-zinc-600 focus:border-zinc-500 focus:outline-none"
          />
        </div>

        {/* 6. 연동된 목표 자산 배분 현황 */}
        <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">
              {t.custom_guru_target_preview_label}
            </span>
            <Link
              to="/settings"
              onClick={onClose}
              className="inline-flex items-center gap-1 text-2xs text-indigo-400 hover:underline"
            >
              <span>{t.nav_settings}</span>
              <ExternalLink className="size-3" />
            </Link>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {targetAllocations && targetAllocations.length > 0 ? (
              targetAllocations.map((item) => (
                <span
                  key={item.category}
                  className="inline-flex items-center gap-1 rounded-md border border-zinc-800 bg-zinc-900 px-2 py-1 text-2xs font-medium text-zinc-300"
                >
                  <span>{t.category_labels[item.category] ?? item.category}</span>
                  <span className="font-mono text-indigo-400">{item.targetPercent}%</span>
                </span>
              ))
            ) : (
              <p className="text-2xs text-zinc-500">
                {t.custom_guru_target_empty}
              </p>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-zinc-800 px-3 py-2 text-xs font-medium text-zinc-400 transition-colors hover:border-zinc-700 hover:text-zinc-200"
          >
            <RotateCcw className="size-3.5" />
            <span>{t.custom_guru_reset_btn}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer rounded-lg px-3 py-2 text-xs font-medium text-zinc-400 hover:text-white"
            >
              [ {t.custom_guru_cancel_btn} ]
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 active:scale-95"
            >
              <Check className="size-3.5" />
              <span>{t.custom_guru_save_btn}</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export function CustomGuruModal({ open, onClose, onSaved }: Props) {
  if (!open) return null;
  return <CustomGuruModalInner onClose={onClose} onSaved={onSaved} />;
}
