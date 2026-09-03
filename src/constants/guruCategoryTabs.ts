import type { GuruCategoryTag } from "@/utils";

export const CATEGORY_TABS: Array<{ id: GuruCategoryTag | "all"; labelKey: string }> = [
  { id: "all", labelKey: "guru_filter_all" },
  { id: "value", labelKey: "guru_tag_value" },
  { id: "growth", labelKey: "guru_tag_growth" },
  { id: "passive", labelKey: "guru_tag_passive" },
  { id: "quant", labelKey: "guru_tag_quant" },
  { id: "macro", labelKey: "guru_tag_macro" },
  { id: "hedge", labelKey: "guru_tag_hedge" },
];
