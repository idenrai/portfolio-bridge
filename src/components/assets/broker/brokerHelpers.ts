import { ACCOUNT_TYPES_BY_COUNTRY } from "@/constants";
import type { Market } from "@/types";

export const COUNTRY_OPTIONS: { value: Market; label: string }[] = [
  { value: "KR", label: "한국 (KR)" },
  { value: "JP", label: "日本 (JP)" },
  { value: "US", label: "US (US)" },
  { value: "EU", label: "EU (EU)" },
  { value: "OTHER", label: "기타 / Other" },
];

export type EditingState = {
  id: string | null; // null = 신규 추가
  country: Market;
  broker: string;
  accountType: string;
  isCustomType: boolean;
  nickname: string;
};

export const EMPTY_FORM: EditingState = {
  id: null,
  country: "JP",
  broker: "",
  accountType: "",
  isCustomType: false,
  nickname: "",
};

export function isPresetType(type: string, country: Market): boolean {
  if (!type) return true;
  return (
    ACCOUNT_TYPES_BY_COUNTRY[country]?.some((opt) => opt.value === type) ??
    false
  );
}

export function formatSuggestedNickname(
  broker: string,
  accountType: string,
): string {
  const b = broker.trim();
  const act = accountType.trim();
  if (!b && !act) return "";
  if (!b) return act;
  if (!act) return b;
  if (act === "NISA (성장)") return `${b} NISA 성장`;
  if (act === "NISA (적립)") return `${b} NISA 적립`;
  return `${b} ${act}`;
}
