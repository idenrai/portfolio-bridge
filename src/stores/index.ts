import { useLanguageStore } from "./useLanguageStore";
import { useSettingsStore } from "./useSettingsStore";
import type { Lang } from "@/i18n";
import type { CurrencyCode } from "@/types";

const LANG_TO_CURRENCY: Record<Lang, CurrencyCode> = {
  ko: "KRW",
  ja: "JPY",
  en: "USD",
  de: "EUR",
};

useLanguageStore.subscribe((state, prevState) => {
  if (state.lang !== prevState.lang) {
    const { isBaseCurrencyManuallySet, setBaseCurrency } =
      useSettingsStore.getState();
    if (!isBaseCurrencyManuallySet) {
      setBaseCurrency(LANG_TO_CURRENCY[state.lang], false);
    }
  }
});

export { useAssetStore } from "./useAssetStore";
export { useSettingsStore } from "./useSettingsStore";
export { useLanguageStore } from "./useLanguageStore";
export { useGoogleDriveStore } from "./useGoogleDriveStore";
export { useSnapshotStore } from "./useSnapshotStore";
export { useGuruSessionStore } from "./useGuruSessionStore";
export type { GuruSessionSnapshot } from "./useGuruSessionStore";
export { useProfileStore } from "./useProfileStore";
export type { UserProfile } from "./useProfileStore";
export { useBrokerStore } from "./useBrokerStore";
export { useFireStore } from "./useFireStore";
export type { FireCalculationMode } from "./useFireStore";
export {
  useCustomGuruStore,
  DEFAULT_CUSTOM_GURU,
  CUSTOM_GURU_RISK_KEYS,
  CUSTOM_GURU_STRATEGY_KEYS,
  CUSTOM_GURU_TONE_KEYS,
  type CustomGuruConfig,
  type CustomGuruRisk,
  type CustomGuruStrategy,
  type CustomGuruTone,
} from "./useCustomGuruStore";


