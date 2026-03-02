import type { GuruProfile } from "@/types";

/**
 * 투자 구루 프로필 데이터
 */
export const GURU_PROFILES: GuruProfile[] = [
  {
    id: "buffett",
    name: "Warren Buffett",
    nameKo: "워렌 버핏",
    nameJa: "ウォーレン・バフェット",
    firm: "Berkshire Hathaway",
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
    nameJa: "チャーリー・マンガー",
    firm: "Daily Journal Corporation",
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
    nameJa: "ピーター・リンチ",
    firm: "Fidelity (Magellan Fund, ret.)",
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
    nameJa: "ベンジャミン・グレアム",
    firm: "Graham-Newman Corp. (hist.)",
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
    nameJa: "レイ・ダリオ",
    firm: "Bridgewater Associates",
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
  {
    id: "lilu",
    name: "Li Lu",
    nameKo: "리루",
    nameJa: "リー・ルー",
    firm: "Himalaya Capital",
    philosophy:
      "버핏과 멍거의 가치 투자 철학을 아시아 시장에 적용. " +
      "깊은 기업 분석과 장기 보유, 소수 확신 종목에 집중 투자.",
    idealAllocation: [
      { tag: "value", targetPercent: 45 },
      { tag: "growth", targetPercent: 25 },
      { tag: "dividend", targetPercent: 15 },
      { tag: "cash", targetPercent: 15 },
    ],
  },
  {
    id: "ackman",
    name: "Bill Ackman",
    nameKo: "빌 애크먼",
    nameJa: "ビル・アックマン",
    firm: "Pershing Square Capital",
    philosophy:
      "행동주의 투자(Activist Investing)의 대표 주자. " +
      "소수의 우량 기업에 대규모 집중 투자하고 경영 개선을 적극 요구.",
    idealAllocation: [
      { tag: "value", targetPercent: 35 },
      { tag: "growth", targetPercent: 30 },
      { tag: "dividend", targetPercent: 15 },
      { tag: "cash", targetPercent: 15 },
      { tag: "bond", targetPercent: 5 },
    ],
  },
  {
    id: "burry",
    name: "Michael Burry",
    nameKo: "마이클 버리",
    nameJa: "マイケル・バーリー",
    firm: "Scion Asset Management",
    philosophy:
      "역발상 가치 투자자. 시장의 비효율성과 거품을 간파하여 투자. " +
      "남들이 간과하는 저평가 자산을 발굴하고 매크로 베팅에도 적극적.",
    idealAllocation: [
      { tag: "value", targetPercent: 40 },
      { tag: "commodity", targetPercent: 20 },
      { tag: "cash", targetPercent: 20 },
      { tag: "growth", targetPercent: 10 },
      { tag: "bond", targetPercent: 10 },
    ],
  },
  {
    id: "fisher",
    name: "Ken Fisher",
    nameKo: "켄 피셔",
    nameJa: "ケン・フィッシャー",
    firm: "Fisher Asset Management",
    philosophy:
      "글로벌 매크로 분석 기반의 성장 투자. 시장 사이클과 투자 심리를 활용. " +
      "광범위한 글로벌 분산과 장기적 주식 비중 확대를 선호.",
    idealAllocation: [
      { tag: "growth", targetPercent: 40 },
      { tag: "index", targetPercent: 25 },
      { tag: "dividend", targetPercent: 15 },
      { tag: "value", targetPercent: 10 },
      { tag: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "cohen",
    name: "Steven Cohen",
    nameKo: "스티븐 코헨",
    nameJa: "スティーブン・コーエン",
    firm: "Point72 Asset Management",
    philosophy:
      "짧은 시간 단위의 고빈도 거래와 다수 포지션 운용. " +
      "리스크 관리를 최우선시하며, 다양한 전략을 병행하는 멀티 매니저 모델.",
    idealAllocation: [
      { tag: "growth", targetPercent: 30 },
      { tag: "value", targetPercent: 25 },
      { tag: "index", targetPercent: 15 },
      { tag: "cash", targetPercent: 15 },
      { tag: "commodity", targetPercent: 10 },
      { tag: "bond", targetPercent: 5 },
    ],
  },
  {
    id: "marks",
    name: "Howard Marks",
    nameKo: "하워드 막스",
    nameJa: "ハワード・マークス",
    firm: "Oaktree Capital Management",
    philosophy:
      "시장 사이클 이론의 대가. '2차적 사고'를 통한 역발상 투자. " +
      "부실채권·디스트레스드 자산 투자의 선구자이며, 리스크와 불확실성의 관리를 강조.",
    idealAllocation: [
      { tag: "bond", targetPercent: 35 },
      { tag: "value", targetPercent: 30 },
      { tag: "cash", targetPercent: 15 },
      { tag: "dividend", targetPercent: 10 },
      { tag: "growth", targetPercent: 10 },
    ],
  },
  {
    id: "klarman",
    name: "Seth Klarman",
    nameKo: "세스 클라먼",
    nameJa: "セス・クラーマン",
    firm: "The Baupost Group",
    philosophy:
      "그레이엄의 안전마진 철학을 현대에 계승. 절대 수익 추구, 하방 보호를 최우선. " +
      "시장 공포 속에서 저평가 기회를 포착하며 현금 비중을 높게 유지.",
    idealAllocation: [
      { tag: "value", targetPercent: 40 },
      { tag: "cash", targetPercent: 25 },
      { tag: "bond", targetPercent: 20 },
      { tag: "dividend", targetPercent: 10 },
      { tag: "growth", targetPercent: 5 },
    ],
  },
  {
    id: "templeton",
    name: "John Templeton",
    nameKo: "존 템플턴",
    nameJa: "ジョン・テンプルトン",
    firm: "Templeton Growth Fund (hist.)",
    philosophy:
      "글로벌 역발상 가치 투자의 선구자. '비관의 극점'에서 매수하는 전략. " +
      "전 세계 시장에서 저평가된 기회를 찾으며, 국경을 넘는 분산 투자를 강조.",
    idealAllocation: [
      { tag: "value", targetPercent: 40 },
      { tag: "index", targetPercent: 20 },
      { tag: "growth", targetPercent: 15 },
      { tag: "bond", targetPercent: 15 },
      { tag: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "soros",
    name: "George Soros",
    nameKo: "조지 소로스",
    nameJa: "ジョージ・ソロス",
    firm: "Soros Fund Management",
    philosophy:
      "재귀성 이론(Reflexivity)에 기반한 매크로 투자. 시장의 편향과 되먹임 루프를 이용. " +
      "통화·채권·주식 등 전 자산군에 걸친 대규모 방향성 베팅.",
    idealAllocation: [
      { tag: "growth", targetPercent: 30 },
      { tag: "bond", targetPercent: 20 },
      { tag: "commodity", targetPercent: 20 },
      { tag: "cash", targetPercent: 15 },
      { tag: "index", targetPercent: 15 },
    ],
  },
  {
    id: "wood",
    name: "Cathie Wood",
    nameKo: "캐시 우드",
    nameJa: "キャシー・ウッド",
    firm: "ARK Invest",
    philosophy:
      "파괴적 혁신(Disruptive Innovation)에 집중 투자. AI, 로보틱스, 유전체학, 블록체인 등 " +
      "미래 기술 기반 성장주에 장기 투자하며, 높은 변동성을 감수.",
    idealAllocation: [
      { tag: "growth", targetPercent: 55 },
      { tag: "crypto", targetPercent: 15 },
      { tag: "index", targetPercent: 10 },
      { tag: "cash", targetPercent: 10 },
      { tag: "value", targetPercent: 10 },
    ],
  },
  {
    id: "druckenmiller",
    name: "Stanley Druckenmiller",
    nameKo: "스탠리 드러큰밀러",
    nameJa: "スタンリー・ドラッケンミラー",
    firm: "Duquesne Family Office",
    philosophy:
      "글로벌 매크로와 모멘텀 투자를 결합. 조지 소로스의 수제자로 퀀텀 펀드에서 " +
      "검증된 통화·금리 전략을 계승. 최고 아이디어에 집중 베팅하며 추세가 꺾이면 즉각 매도.",
    idealAllocation: [
      { tag: "growth", targetPercent: 35 },
      { tag: "index", targetPercent: 20 },
      { tag: "commodity", targetPercent: 20 },
      { tag: "cash", targetPercent: 15 },
      { tag: "bond", targetPercent: 10 },
    ],
  },
  {
    id: "smith",
    name: "Terry Smith",
    nameKo: "테리 스미스",
    nameJa: "テリー・スミス",
    firm: "Fundsmith LLP",
    philosophy:
      "우량 기업을 공정 가격에 매수하고 아무것도 하지 말라(Buy good companies, don't overpay, do nothing). " +
      "높은 ROIC를 지속적으로 창출하는 기업에만 투자하며, 매매를 최소화하는 장기 복리 전략.",
    idealAllocation: [
      { tag: "growth", targetPercent: 45 },
      { tag: "dividend", targetPercent: 25 },
      { tag: "value", targetPercent: 20 },
      { tag: "cash", targetPercent: 10 },
    ],
  },
  {
    id: "greenblatt",
    name: "Joel Greenblatt",
    nameKo: "조엘 그린블라트",
    nameJa: "ジョエル・グリーンブラット",
    firm: "Gotham Asset Management",
    philosophy:
      '"마법 공식(Magic Formula)": 이익수익률(Earnings Yield)과 자본수익률(ROIC)이 높은 종목을 ' +
      "체계적으로 선별하여 분산 투자. 감정 없는 정량적·규칙 기반의 가치 투자 접근법.",
    idealAllocation: [
      { tag: "value", targetPercent: 40 },
      { tag: "growth", targetPercent: 25 },
      { tag: "index", targetPercent: 20 },
      { tag: "cash", targetPercent: 10 },
      { tag: "bond", targetPercent: 5 },
    ],
  },
];

/**
 * 구루 ID로 프로필 조회
 */
export function getGuruProfile(id: string): GuruProfile | undefined {
  return GURU_PROFILES.find((g) => g.id === id);
}
