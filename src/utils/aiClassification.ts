import type { Asset, AssetTag } from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";

/** 유효한 AssetTag인지 확인 */
const VALID_TAGS = new Set<string>([
  "dividend",
  "growth",
  "value",
  "index",
  "bond",
  "reit",
  "cash",
  "crypto",
  "commodity",
  "other",
]);
function isValidTag(tag: string): tag is AssetTag {
  return VALID_TAGS.has(tag);
}

/** AI 응답 JSON 내 한 건 */
interface AiClassificationItem {
  index: number;
  name: string;
  category?: string; // 신규 필드명
  tag?: string; // 하위 호환용
  reason?: string;
}

const TAG_DESCRIPTIONS: Record<string, string> = {
  dividend:
    "dividend - income-generating stocks / REITs with regular dividends",
  growth: "growth - high-growth stocks (tech, biotech, etc.)",
  value: "value - undervalued, low-multiple stocks",
  index: "index - index funds / broad market ETFs",
  bond: "bond - government or corporate bonds / bond ETFs",
  reit: "reit - real estate investment trusts",
  cash: "cash - cash equivalents, money market, savings",
  crypto: "crypto - cryptocurrency assets",
  commodity: "commodity - gold, oil, silver, commodities ETFs",
  other: "other - does not fit any category above",
};

const ASSET_TYPE_EN: Record<string, string> = {
  stock: "Stock",
  etf: "ETF",
  bond: "Bond",
  fund: "Fund",
  cash: "Cash/Deposit",
  crypto: "Crypto",
  real_estate: "Real Estate",
  other: "Other",
};

const MARKET_EN: Record<string, string> = {
  KR: "Korea",
  JP: "Japan",
  US: "US",
  EU: "Europe (EU)",
  OTHER: "Other",
};

/** 자산 목록을 AI 분류 요청 프롬프트로 변환 */
export function buildClassificationPrompt(
  assets: Asset[],
  lang: Lang = "ko",
): string {
  const tagList = Object.entries(TAG_DESCRIPTIONS)
    .map(([, desc]) => `  - ${desc}`)
    .join("\n");

  const assetLines = assets
    .map((a, i) => {
      const type = ASSET_TYPE_EN[a.type] ?? a.type;
      const market = MARKET_EN[a.market] ?? a.market;
      const currentCategory = a.tags[0]
        ? `(current category: ${a.tags[0]})`
        : "(no category)";
      return `${i + 1}. ${a.name}${a.ticker ? ` [${a.ticker}]` : ""} | type: ${type} | market: ${market} | currency: ${a.currency} ${currentCategory}`;
    })
    .join("\n");

  return `You are a portfolio asset classifier. For each asset below, choose the single most appropriate category that best describes its investment characteristic.

Available categories:
${tagList}

Asset list:
${assetLines}

Output format — respond with a JSON array only, no extra text:
[
  { "index": 1, "name": "asset name", "category": "category_key", "reason": "brief reason" },
  ...
]

Rules:
- The "category" field must be exactly one of the category keys listed above (e.g. "dividend", "growth").
- Classify every asset, including already-classified ones.
- Keep reasons concise (one sentence).

IMPORTANT: Please write the "reason" field entirely in ${LANG_NAMES[lang]}.`;
}

/** AI 응답 JSON 파싱 → 각 자산에 태그 매핑 */
export function parseAiResponse(
  jsonText: string,
  assets: Asset[],
): {
  applied: number;
  skipped: number;
  results: { id: string; tag: AssetTag }[];
} {
  // JSON 배열 부분만 추출 (마크다운 코드블록 등 제거)
  const arrMatch = jsonText.match(/\[[\s\S]*\]/);
  if (!arrMatch) throw new Error("No JSON array found in the response.");

  const parsed: AiClassificationItem[] = JSON.parse(arrMatch[0]);
  if (!Array.isArray(parsed)) throw new Error("Parsed result is not an array.");

  const results: { id: string; tag: AssetTag }[] = [];
  let skipped = 0;

  for (const item of parsed) {
    const idx = (item.index ?? 0) - 1; // 1-based → 0-based
    const asset = assets[idx];
    if (!asset) {
      skipped++;
      continue;
    }
    if (!isValidTag(item.category ?? item.tag ?? "")) {
      skipped++;
      continue;
    }
    results.push({
      id: asset.id,
      tag: (item.category ?? item.tag) as AssetTag,
    });
  }

  return { applied: results.length, skipped, results };
}
