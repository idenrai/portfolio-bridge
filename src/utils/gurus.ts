import type { GuruProfile } from "@/types";

/**
 * 투자 구루 프로필 데이터
 * (향후 구루 페르소나 기반 분석 기능의 기초 데이터)
 */
export const GURU_PROFILES: GuruProfile[] = [
  {
    id: "buffett",
    name: "Warren Buffett",
    nameKo: "워렌 버핏",
    philosophy:
      "경제적 해자(moat)를 가진 우량 기업을 합리적 가격에 매수하여 장기 보유. " +
      "배당 성장과 자사주 매입을 중시하며, 이해할 수 있는 사업에만 투자.",
    idealAllocation: [
      { tag: "value", targetPercent: 40 },
      { tag: "dividend", targetPercent: 25 },
      { tag: "growth", targetPercent: 15 },
      { tag: "cash", targetPercent: 15 },
      { tag: "index", targetPercent: 5 },
    ],
  },
  {
    id: "munger",
    name: "Charlie Munger",
    nameKo: "찰리 멍거",
    philosophy:
      "집중 투자와 다학제적 사고(멘탈 모델). 소수의 뛰어난 기업에 대한 확신이 있을 때만 대규모 투자. " +
      "인내심과 역발상적 사고를 강조.",
    idealAllocation: [
      { tag: "value", targetPercent: 50 },
      { tag: "growth", targetPercent: 20 },
      { tag: "dividend", targetPercent: 15 },
      { tag: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "lynch",
    name: "Peter Lynch",
    nameKo: "피터 린치",
    philosophy:
      "일상에서 투자 아이디어를 발견하라. 성장주 발굴에 강점. PEG 비율로 성장 대비 밸류에이션을 평가. " +
      '분산투자를 선호하며 "10루타(tenbagger)" 종목 발굴을 추구.',
    idealAllocation: [
      { tag: "growth", targetPercent: 45 },
      { tag: "value", targetPercent: 20 },
      { tag: "dividend", targetPercent: 15 },
      { tag: "index", targetPercent: 10 },
      { tag: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "graham",
    name: "Benjamin Graham",
    nameKo: "벤저민 그레이엄",
    philosophy:
      "안전마진(Margin of Safety)을 최우선. 내재가치 대비 할인된 가격에서만 매수. " +
      "채권과 주식의 균형 있는 배분, 방어적 투자를 선호.",
    idealAllocation: [
      { tag: "value", targetPercent: 40 },
      { tag: "bond", targetPercent: 25 },
      { tag: "dividend", targetPercent: 20 },
      { tag: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "dalio",
    name: "Ray Dalio",
    nameKo: "레이 달리오",
    philosophy:
      "올웨더(All Weather) 전략. 경제 사이클에 무관하게 안정적 수익을 추구. " +
      "자산 분산, 리스크 패리티, 채권·금·원자재 포함 균형 포트폴리오.",
    idealAllocation: [
      { tag: "bond", targetPercent: 30 },
      { tag: "index", targetPercent: 25 },
      { tag: "commodity", targetPercent: 15 },
      { tag: "dividend", targetPercent: 15 },
      { tag: "growth", targetPercent: 10 },
      { tag: "cash", targetPercent: 5 },
    ],
  },
];

/**
 * 구루 ID로 프로필 조회
 */
export function getGuruProfile(id: string): GuruProfile | undefined {
  return GURU_PROFILES.find((g) => g.id === id);
}
