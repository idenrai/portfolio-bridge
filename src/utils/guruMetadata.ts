import type { GuruId } from "@/types";

export type GuruCategoryTag =
  | "value"     // 가치투자
  | "growth"    // 성장·모멘텀
  | "passive"   // 자산배분·패시브
  | "quant"     // 퀀트·지표·공식
  | "macro"     // 글로벌 매크로·추세
  | "hedge";    // 역발상·헤지

export interface GuruMetadata {
  id: GuruId;
  category: GuruCategoryTag;
  secondaryCategory?: GuruCategoryTag;
  risk: "conservative" | "balanced" | "aggressive";
  horizon: "long_term" | "medium_term" | "tactical";
  tone: "mentor" | "blunt" | "academic" | "trader";
  tagKey: string;
}

export const GURU_METADATA: Record<GuruId, GuruMetadata> = {
  buffett: {
    id: "buffett",
    category: "value",
    secondaryCategory: "passive",
    risk: "conservative",
    horizon: "long_term",
    tone: "mentor",
    tagKey: "guru_tag_value",
  },
  munger: {
    id: "munger",
    category: "value",
    secondaryCategory: "growth",
    risk: "balanced",
    horizon: "long_term",
    tone: "blunt",
    tagKey: "guru_tag_value",
  },
  lynch: {
    id: "lynch",
    category: "growth",
    secondaryCategory: "value",
    risk: "balanced",
    horizon: "medium_term",
    tone: "mentor",
    tagKey: "guru_tag_growth",
  },
  graham: {
    id: "graham",
    category: "value",
    risk: "conservative",
    horizon: "medium_term",
    tone: "academic",
    tagKey: "guru_tag_value",
  },
  dalio: {
    id: "dalio",
    category: "passive",
    secondaryCategory: "macro",
    risk: "balanced",
    horizon: "long_term",
    tone: "academic",
    tagKey: "guru_tag_passive",
  },
  lilu: {
    id: "lilu",
    category: "value",
    secondaryCategory: "growth",
    risk: "balanced",
    horizon: "long_term",
    tone: "mentor",
    tagKey: "guru_tag_value",
  },
  ackman: {
    id: "ackman",
    category: "value",
    secondaryCategory: "hedge",
    risk: "aggressive",
    horizon: "tactical",
    tone: "trader",
    tagKey: "guru_tag_value",
  },
  burry: {
    id: "burry",
    category: "hedge",
    secondaryCategory: "value",
    risk: "aggressive",
    horizon: "tactical",
    tone: "blunt",
    tagKey: "guru_tag_hedge",
  },
  fisher: {
    id: "fisher",
    category: "growth",
    risk: "balanced",
    horizon: "long_term",
    tone: "academic",
    tagKey: "guru_tag_growth",
  },
  cohen: {
    id: "cohen",
    category: "macro",
    secondaryCategory: "growth",
    risk: "aggressive",
    horizon: "tactical",
    tone: "trader",
    tagKey: "guru_tag_macro",
  },
  marks: {
    id: "marks",
    category: "value",
    secondaryCategory: "macro",
    risk: "conservative",
    horizon: "medium_term",
    tone: "academic",
    tagKey: "guru_tag_value",
  },
  klarman: {
    id: "klarman",
    category: "value",
    secondaryCategory: "hedge",
    risk: "conservative",
    horizon: "medium_term",
    tone: "academic",
    tagKey: "guru_tag_value",
  },
  templeton: {
    id: "templeton",
    category: "value",
    secondaryCategory: "macro",
    risk: "balanced",
    horizon: "medium_term",
    tone: "mentor",
    tagKey: "guru_tag_value",
  },
  soros: {
    id: "soros",
    category: "macro",
    secondaryCategory: "hedge",
    risk: "aggressive",
    horizon: "tactical",
    tone: "trader",
    tagKey: "guru_tag_macro",
  },
  wood: {
    id: "wood",
    category: "growth",
    risk: "aggressive",
    horizon: "tactical",
    tone: "mentor",
    tagKey: "guru_tag_growth",
  },
  druckenmiller: {
    id: "druckenmiller",
    category: "macro",
    secondaryCategory: "growth",
    risk: "aggressive",
    horizon: "tactical",
    tone: "trader",
    tagKey: "guru_tag_macro",
  },
  smith: {
    id: "smith",
    category: "value",
    secondaryCategory: "growth",
    risk: "balanced",
    horizon: "long_term",
    tone: "blunt",
    tagKey: "guru_tag_value",
  },
  greenblatt: {
    id: "greenblatt",
    category: "quant",
    secondaryCategory: "value",
    risk: "balanced",
    horizon: "medium_term",
    tone: "academic",
    tagKey: "guru_tag_quant",
  },
  piotroski: {
    id: "piotroski",
    category: "quant",
    secondaryCategory: "value",
    risk: "conservative",
    horizon: "medium_term",
    tone: "academic",
    tagKey: "guru_tag_quant",
  },
  oneil: {
    id: "oneil",
    category: "growth",
    secondaryCategory: "quant",
    risk: "aggressive",
    horizon: "tactical",
    tone: "trader",
    tagKey: "guru_tag_growth",
  },
  bogle: {
    id: "bogle",
    category: "passive",
    risk: "conservative",
    horizon: "long_term",
    tone: "mentor",
    tagKey: "guru_tag_passive",
  },
  swensen: {
    id: "swensen",
    category: "passive",
    secondaryCategory: "macro",
    risk: "balanced",
    horizon: "long_term",
    tone: "academic",
    tagKey: "guru_tag_passive",
  },
  taleb: {
    id: "taleb",
    category: "hedge",
    risk: "conservative",
    horizon: "long_term",
    tone: "blunt",
    tagKey: "guru_tag_hedge",
  },
  custom: {
    id: "custom",
    category: "value",
    risk: "balanced",
    horizon: "medium_term",
    tone: "mentor",
    tagKey: "custom_guru_selector_badge",
  },
};
