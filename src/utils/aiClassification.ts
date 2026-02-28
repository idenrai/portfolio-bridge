import { TAG_LABELS, ASSET_TYPE_LABELS, MARKET_LABELS } from "@/types";
import type { Asset, AssetTag } from "@/types";

/** 유효한 AssetTag인지 확인 */
const VALID_TAGS = new Set<string>(Object.keys(TAG_LABELS));
function isValidTag(tag: string): tag is AssetTag {
  return VALID_TAGS.has(tag);
}

/** AI 응답 JSON 내 한 건 */
interface AiClassificationItem {
  index: number;
  name: string;
  tag: string;
  reason?: string;
}

/** 자산 목록을 AI 분류 요청 프롬프트로 변환 */
export function buildClassificationPrompt(assets: Asset[]): string {
  const tagList = Object.entries(TAG_LABELS)
    .map(([k, v]) => `  - ${k}: ${v}`)
    .join("\n");

  const assetLines = assets
    .map((a, i) => {
      const currentTag = a.tags[0]
        ? `(현재 태그: ${TAG_LABELS[a.tags[0]]})`
        : "(미분류)";
      return `${i + 1}. ${a.name}${a.ticker ? ` [${a.ticker}]` : ""} | 유형: ${ASSET_TYPE_LABELS[a.type]} | 시장: ${MARKET_LABELS[a.market]} | 통화: ${a.currency} ${currentTag}`;
    })
    .join("\n");

  return `아래 자산 목록의 각 항목에 대해, 투자 성격에 맞는 분류 태그를 하나 골라 주세요.

■ 사용 가능한 태그 목록:
${tagList}

■ 자산 목록:
${assetLines}

■ 출력 형식 (JSON 배열로 응답해 주세요):
[
  { "index": 1, "name": "종목명", "tag": "태그키", "reason": "짧은 이유" },
  ...
]

각 항목의 tag 필드에는 위 태그 목록의 키(영문) 중 하나만 기입해 주세요.`;
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
  if (!arrMatch) throw new Error("JSON 배열을 찾을 수 없습니다.");

  const parsed: AiClassificationItem[] = JSON.parse(arrMatch[0]);
  if (!Array.isArray(parsed)) throw new Error("배열 형태가 아닙니다.");

  const results: { id: string; tag: AssetTag }[] = [];
  let skipped = 0;

  for (const item of parsed) {
    const idx = (item.index ?? 0) - 1; // 1-based → 0-based
    const asset = assets[idx];
    if (!asset) {
      skipped++;
      continue;
    }
    if (!isValidTag(item.tag)) {
      skipped++;
      continue;
    }
    results.push({ id: asset.id, tag: item.tag });
  }

  return { applied: results.length, skipped, results };
}
