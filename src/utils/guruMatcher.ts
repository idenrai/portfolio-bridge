import { GURU_PROFILES } from "@/utils/gurus";
import { GURU_METADATA, type GuruCategoryTag, type GuruMetadata } from "./guruMetadata";
import type { GuruProfile, GuruId } from "@/types";

export interface GuruMatchAnswer {
  risk: "conservative" | "balanced" | "aggressive";
  strategy: GuruCategoryTag;
  tone: "mentor" | "blunt" | "academic" | "trader";
}

export interface GuruMatchResult {
  guru: GuruProfile;
  score: number;
  metadata: GuruMetadata;
  matchReasonKey: string;
}

const SPECIFIC_REASON_GURUS: Set<GuruId> = new Set([
  "buffett",
  "munger",
  "lynch",
  "graham",
  "dalio",
  "bogle",
  "swensen",
  "taleb",
  "wood",
  "soros",
  "greenblatt",
  "marks",
]);

export function matchGurus(answers: GuruMatchAnswer): GuruMatchResult[] {
  const results: GuruMatchResult[] = [];

  for (const guru of GURU_PROFILES) {
    const meta = GURU_METADATA[guru.id];
    if (!meta) continue;

    let score = 0;

    // 1. 전략 스타일 일치도 (최대 45점)
    if (answers.strategy === meta.category) {
      score += 45;
    } else if (answers.strategy === meta.secondaryCategory) {
      score += 25;
    }

    // 2. 위험 성향 일치도 (최대 30점)
    if (answers.risk === meta.risk) {
      score += 30;
    } else if (
      (answers.risk === "conservative" && meta.risk === "balanced") ||
      (answers.risk === "balanced" && (meta.risk === "conservative" || meta.risk === "aggressive")) ||
      (answers.risk === "aggressive" && meta.risk === "balanced")
    ) {
      score += 15;
    }

    // 3. 조언 톤 일치도 (최대 25점)
    if (answers.tone === meta.tone) {
      score += 25;
    } else {
      score += 5; // 기본 성향 가산점
    }

    // 정규화: 최소 60점 ~ 최대 98점 범위로 보정
    const finalScore = Math.min(98, Math.max(60, score));

    const reasonKey = SPECIFIC_REASON_GURUS.has(guru.id)
      ? `guru_match_reason_${guru.id}`
      : `guru_match_reason_category_${meta.category}`;

    results.push({
      guru,
      score: finalScore,
      metadata: meta,
      matchReasonKey: reasonKey,
    });
  }

  // 점수 내림차순 정렬
  results.sort((a, b) => b.score - a.score);

  return results;
}
