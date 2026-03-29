import type { Market } from "@/types";

/** 스크리닝용 최소 종목 정보 */
export interface UniverseStock {
  ticker: string;
  name: string;
  market: Market;
}

// ─── GET 기반 동적 종목 발굴 ─────────────────────────────────────────────────
// US: Yahoo Trending API → v7 배치
// KR/JP/EU: 시드 티커 풀 → v7 배치 → 실시간 데이터 기반 필터링
//
// 시드 티커는 "검색 시작점"이지 하드코딩된 결과가 아닙니다.
// v7 배치에서 실시간 시가총액·PEG·성장률 등을 받아와 필터링하므로
// 재무 상태가 바뀐 종목은 자연스럽게 탈락합니다.

/** 시장별 Yahoo trending region 코드 (US 전용) */
export const TRENDING_REGIONS: Record<string, string> = {
  US: "US",
};

/** 시가총액 필터 범위 (USD) */
export const MCAP_MIN = 300_000_000;   // $300M
export const MCAP_MAX = 30_000_000_000; // $30B

// ─── 시장별 시드 티커 ───────────────────────────────────────────────────────
// Yahoo Trending API는 대형주 위주이므로, 소·중형 성장주 시드 풀을 병행합니다.
// v7 배치로 실시간 데이터를 가져온 뒤 시가총액 $300M–$30B로 필터링합니다.

/** 미국 (NYSE/NASDAQ) — 소중형 성장주 + 테크/바이오/소비재/산업재 */
const US_SEEDS = [
  // 테크·소프트웨어
  "CRWD",  // CrowdStrike
  "DDOG",  // Datadog
  "ZS",    // Zscaler
  "NET",   // Cloudflare
  "MDB",   // MongoDB
  "OKTA",  // Okta
  "HUBS",  // HubSpot
  "BILL",  // Bill Holdings
  "PCOR",  // Procore Technologies
  "GTLB",  // GitLab
  "CFLT",  // Confluent
  "ESTC",  // Elastic
  "FRSH",  // Freshworks
  "DOCN",  // DigitalOcean
  "BRZE",  // Braze
  // 반도체·하드웨어
  "SMCI",  // Super Micro Computer
  "ONTO",  // Onto Innovation
  "RMBS",  // Rambus
  "CRUS",  // Cirrus Logic
  "ACLS",  // Axcelis Technologies
  "POWI",  // Power Integrations
  "LSCC",  // Lattice Semiconductor
  "CEVA",  // CEVA
  "SLAB",  // Silicon Laboratories
  // 바이오·헬스케어
  "EXAS",  // Exact Sciences
  "NTRA",  // Natera
  "INSP",  // Inspire Medical
  "RGEN",  // Repligen
  "MEDP",  // Medpace
  "IOVA",  // Iovance Biotherapeutics
  "TGTX",  // TG Therapeutics
  "PCVX",  // Vaxcyte
  "RYTM",  // Rhythm Pharma
  "KRTX",  // Karuna Therapeutics
  // 금융·핀테크
  "SSNC",  // SS&C Technologies
  "TOST",  // Toast
  "RELY",  // Remitly
  "AFRM",  // Affirm
  "LPRO",  // Open Lending
  // 소비재·산업재
  "DUOL",  // Duolingo
  "CELH",  // Celsius Holdings
  "ELF",   // e.l.f. Beauty
  "WFRD",  // Weatherford International
  "CRNX",  // Crinetics Pharmaceuticals
  "KRYS",  // Krystal Biotech
  "BRBR",  // BellRing Brands
  "SHAK",  // Shake Shack
  "BOOT",  // Boot Barn
  "CARG",  // CarGurus
];

/** 한국 (KOSPI/KOSDAQ) — 소중형 성장주 + IT/바이오/소비재 */
const KR_SEEDS = [
  // IT·반도체·소프트웨어
  "035720.KS", // 카카오
  "035420.KS", // NAVER
  "068270.KS", // 셀트리온
  "028260.KS", // 삼성물산
  "034730.KS", // SK
  "003670.KS", // 포스코퓨처엠
  "012330.KS", // 현대모비스
  "096770.KS", // SK이노베이션
  "011170.KS", // 롯데케미칼
  "033780.KS", // KT&G
  "009150.KS", // 삼성전기
  "010130.KS", // 고려아연
  "018260.KS", // 삼성에스디에스
  "036570.KS", // 엔씨소프트
  "251270.KS", // 넷마블
  "263750.KS", // 펄어비스
  "293490.KS", // 카카오게임즈
  "352820.KS", // 하이브
  "373220.KS", // LG에너지솔루션
  "247540.KS", // 에코프로비엠
  // KOSDAQ 성장주
  "086520.KQ", // 에코프로
  "041510.KQ", // 에스엠
  "112040.KQ", // 위메이드
  "328130.KQ", // 루닛
  "950160.KQ", // 코오롱티슈진
  "059210.KQ", // 메타바이오메드
  "039030.KQ", // 이오테크닉스
  "357780.KQ", // 솔브레인
  "196170.KQ", // 알테오젠
  "403870.KQ", // HPSP
  "067160.KQ", // 아프리카TV
  "145020.KQ", // 휴젤
  "330860.KQ", // 네이처셀
  "053800.KQ", // 안랩
  "095340.KQ", // ISC
  "060310.KQ", // 3S
  "200670.KQ", // 휴메딕스
  "222080.KQ", // 씨아이에스
  "083310.KQ", // 엘오티베큠
  "058470.KQ", // 리노공업
];

/** 일본 (TSE) — 소중형 성장주 + IT/제조/게임 */
const JP_SEEDS = [
  // 중형 성장주
  "2413.T",  // エムスリー
  "4689.T",  // LY (ex-Z Holdings)
  "3659.T",  // ネクソン
  "4385.T",  // メルカリ
  "6920.T",  // レーザーテック (Lasertec)
  "6532.T",  // ベイカレント
  "4755.T",  // 楽天グループ
  "9613.T",  // NTTデータ
  "4661.T",  // オリエンタルランド
  "6526.T",  // ソシオネクスト
  "6146.T",  // ディスコ
  "7741.T",  // HOYA
  "4543.T",  // テルモ
  "6857.T",  // アドバンテスト
  "7832.T",  // バンナムHD
  "9766.T",  // コナミHD
  "3635.T",  // コーエーテクモ
  "7342.T",  // ウェルスナビ
  "4480.T",  // メドレー
  "4478.T",  // フリー
  "4565.T",  // そーせいグループ
  "4485.T",  // JTOWER
  "7071.T",  // ANYCOLOR
  "5765.T",  // フジミインコーポ
  "6323.T",  // ローツェ
  "6981.T",  // 村田製作所
  "6645.T",  // オムロン
  "6869.T",  // シスメックス
  "4523.T",  // エーザイ
  "2801.T",  // キッコーマン
  "6098.T",  // リクルートHD
  "4684.T",  // オービック
  "6752.T",  // パナソニック
  "7267.T",  // ホンダ
  "6902.T",  // デンソー
  "8802.T",  // 三菱地所
  "9101.T",  // 日本郵船
  "2502.T",  // アサヒグループ
  "4911.T",  // 資生堂
  "7269.T",  // スズキ
];

/** 유럽 (DAX/CAC/AMS 등) — 소중형 성장주 + 테크/럭셔리/산업재 */
const EU_SEEDS = [
  // 독일
  "IFX.DE",  // Infineon
  "RWE.DE",  // RWE
  "HFG.DE",  // HelloFresh
  "PUM.DE",  // Puma
  "1COV.DE", // Covestro
  "TKA.DE",  // ThyssenKrupp
  "EVK.DE",  // Evonik
  "ZAL.DE",  // Zalando
  "DB1.DE",  // Deutsche Börse
  "FRE.DE",  // Fresenius
  "LEG.DE",  // LEG Immobilien
  "MTX.DE",  // MTU Aero Engines
  "RHM.DE",  // Rheinmetall
  "ENR.DE",  // Siemens Energy
  // 프랑스
  "DSY.PA",  // Dassault Systèmes
  "CAP.PA",  // Capgemini
  "PUB.PA",  // Publicis
  "ATO.PA",  // Atos
  "SOI.PA",  // Soitec
  "GFC.PA",  // Gecina
  "VIV.PA",  // Vivendi
  "BN.PA",   // Danone
  "EN.PA",   // Bouygues
  // 네덜란드·벨기에
  "BESI.AS", // BE Semiconductor
  "LIGHT.AS",// Signify
  "WKL.AS",  // Wolters Kluwer
  "AD.AS",   // Ahold Delhaize
  "GLPG.AS", // Galapagos
  "UCB.BR",  // UCB
  "ABI.BR",  // AB InBev
  // 스위스·이탈리아·스페인
  "LONN.SW", // Lonza
  "SREN.SW", // Swiss Re
  "GEBN.SW", // Geberit
  "EOAN.DE", // E.ON
  "ISP.MI",  // Intesa Sanpaolo
  "IBE.MC",  // Iberdrola
  "CABK.MC", // CaixaBank
  "FER.MC",  // Ferrovial
  "AMS.MC",  // Amadeus IT
];

/** 시장별 시드 티커 맵 */
export const MARKET_SEEDS: Record<string, string[]> = {
  US: US_SEEDS,
  KR: KR_SEEDS,
  JP: JP_SEEDS,
  EU: EU_SEEDS,
};
