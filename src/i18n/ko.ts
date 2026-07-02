import type { Translations } from "./types";

export const ko: Translations = {
  nav_dashboard: "대시보드",
  nav_assets: "자산 관리",
  nav_gurus: "투자 구루",
  nav_settings: "설정",
  nav_about: "소개",
  app_tagline: "자산 통합 관리 + AI · 구루 인사이트",
  app_version_info: "브라우저 저장",

  about_tagline: "자산 통합 관리 + AI · 구루 인사이트",
  about_intro:
    "Portfolio Bridge는 한국 · 미국 · 일본 · 독일의 금융자산을 하나의 화면에서 관리하고, AI와 전설적인 투자가들의 관점에서 포트폴리오 인사이트를 얻을 수 있는 privacy-first 웹 앱입니다. 모든 데이터는 브라우저 내에만 저장되며 외부 서버로 전송되지 않습니다.",
  about_features_title: "주요 기능",
  about_feat1_title: "통합 대시보드",
  about_feat1_desc:
    "KPI 요약, 분류·시장별 배분 차트, 보유 종목 테이블, 리밸런싱 제안을 한눈에 확인하세요.",
  about_feat2_title: "자산 관리",
  about_feat2_desc:
    "Yahoo Finance 종목 검색 및 수동 등록으로 다국가 자산을 통합 관리합니다. AI 자동 분류, CSV 가져오기·내보내기 지원.",
  about_feat3_title: "투자 구루",
  about_feat3_desc:
    "버핏, 달리오, 린치 등 20명의 투자 철학과 대표 포트폴리오를 참고해 내 포트폴리오와 비교할 수 있습니다. 린치 10루타 · 그린블라트 마법공식 · 그레이엄 방어투자 · 스미스 퀄리티 · 피오트로스키 F-Score · 오닐 CAN SLIM 6종 채점기로 종목을 분석하고, 구루 페르소나 AI 프롬프트를 제공합니다.",
  about_feat4_title: "AI 포트폴리오 분석",
  about_feat4_desc:
    "ChatGPT · Claude · Gemini · Grok에 바로 붙여넣을 수 있는 구조화된 프롬프트를 생성합니다. 이상적 배분과 조정 인사이트를 AI에게 물어보세요.",
  about_feat5_title: "자동 인사이트",
  about_feat5_desc:
    "과대비중, 큰 손실, 현금 부족, 환 노출 초과 등을 자동으로 감지해 인사이트 카드에서 확인할 수 있습니다.",
  about_feat6_title: "다국어 · 다통화",
  about_feat6_desc:
    "한국어 · English · 日本語 · Deutsch 4개국어와 KRW · USD · JPY · EUR 통화 표시를 지원합니다.",
  about_privacy_title: "프라이버시 우선",
  about_privacy_desc:
    "모든 자산 데이터는 브라우저 localStorage에만 저장됩니다. 외부 서버로 개인 자산 데이터가 전송되지 않으며, 계정 생성 없이 바로 사용할 수 있습니다. 선택적으로 개인의 Google Drive를 연동해 데이터를 백업할 수도 있습니다.",
  about_tech_title: "기술 스택",
  about_links_live: "라이브 데모",
  about_links_github: "GitHub",
  about_disclaimer:
    "이 앱은 개인 학습 및 포트폴리오 관리 목적으로 제작되었습니다. 제공되는 시세·환율·분석 데이터는 참고용이며 투자 결정의 근거로 사용해서는 안 됩니다.",

  dash_title: "대시보드",
  dash_empty_title: "포트폴리오를 시작하세요",
  dash_empty_desc:
    '"자산 관리" 메뉴에서 보유 자산을 등록하면 여기에 요약이 표시됩니다.',
  dash_notice_storage:
    "💾 데이터는 이 기기의 브라우저에만 저장됩니다. 다른 기기와 동기화되지 않으므로, 같은 기기 · 같은 브라우저에서 이용해 주세요.",
  dash_notice_csv:
    "📁 자산 데이터는 CSV 파일로 내보내기/가져오기가 가능합니다. 백업이나 기기 이전 시 활용하세요.",
  dash_notice_mobile:
    "🖥️ 현재 PC 브라우저에 최적화되어 있습니다. 모바일 화면은 지원하지 않습니다.",
  dash_sample_btn: "📈 샘플 데이터로 둘러보기",
  dash_sample_hint: "샘플 데이터는 '설정 › 전체 데이터 초기화'로 제거할 수 있습니다.",
  dash_refresh: "환율 · 시세 갱신",
  dash_refreshing: "조회 중…",
  dash_updated_at: (time) => `${time}`,

  kpi_total_value: "총 평가액",
  kpi_pnl: "평가 손익",
  kpi_cash_weight: "현금 비중",
  kpi_fx_exposure: "외화 노출",
  kpi_holdings_unit: "종목",
  kpi_asset_type_unit: "개 자산군",

  chart_market: "국가(시장)별 배분",
  chart_category: "분류별 배분",
  chart_no_data: "데이터 없음",

  holdings_title: "보유 종목",
  holdings_col_name: "종목",
  holdings_col_type: "유형",
  holdings_col_value: "평가액",
  holdings_col_pnl: "손익",
  holdings_col_return: "수익률",
  holdings_col_weight: "비중",
  holdings_col_per: "PER",
  holdings_col_pbr: "PBR",
  holdings_show_all: (n) => `전체 ${n}개 보기`,
  holdings_show_top10: "상위 10개만",

  category_title: "분류 목표 vs 실제",
  category_set_target: "목표 설정",
  category_empty: "목표 설정 버튼으로 직접 등록하세요",
  category_legend_target: "목표",
  category_legend_normal: "정상",
  category_legend_over: "초과",
  category_legend_under: "부족",

  fx_title: "환율 노출 & 시나리오",
  fx_col_currency: "통화",
  fx_col_value: "평가액",
  fx_col_weight: "비중",
  fx_col_rate: "환율",
  fx_scenario_title: "환율 ±5% 시나리오",

  rebalance_title: "리밸런스 제안",
  rebalance_ok: "✅ 배분이 목표에 근접합니다",
  rebalance_buy: "매수",
  rebalance_sell: "매도",

  insights_title: "인사이트",
  insights_ok: "✅ 특이사항 없음",
  insights_ai_btn: "프롬프트 보기",
  insights_ai_copy: "클립보드에 복사",
  insights_ai_copied: "✓ 복사됨!",
  insights_ai_desc:
    "아래 프롬프트를 복사해 ChatGPT, Claude, Gemini, Grok 등 AI에 붙여넣으세요.",
  insights_ai_close: "닫기",
  insights_ai_banner_title: "AI 포트폴리오 분석",
  insights_ai_banner_desc:
    "보유 종목 상세 데이터를 포함한 프롬프트를 생성합니다. ChatGPT · Claude · Gemini · Grok에 바로 붙여넣어 이상적 자산 배분 모델과 구체적인 조정 인사이트를 받아보세요.",
  insight_concentration: (name, pct) =>
    `${name} 비중 ${pct}% — 개별 종목 집중도 높음`,
  insight_big_loss: (name, pct) => `${name} 수익률 ${pct}% — 큰 손실 발생 중`,
  insight_cash_high: (pct) => `현금 비중 ${pct}% — 유동성 과다, 투자 기회 검토`,
  insight_cash_low: (pct) => `현금 비중 ${pct}% — 비상자금 부족 주의`,
  insight_fx_high: (currency, pct) =>
    `${currency} 노출 ${pct}% — 환율 변동 민감`,
  insight_category_over: (label, pct, target, diff) =>
    `${label} 비중 ${pct}% (목표 ${target}%) → +${diff}%p 과중`,
  insight_category_under: (label, pct, target, diff) =>
    `${label} 비중 ${pct}% (목표 ${target}%) → ${diff}%p 부족`,

  asset_title: "자산 관리",
  asset_btn_ai: "프롬프트 보기",
  asset_ai_banner_title: "AI 자산 분류",
  asset_ai_banner_desc:
    "분류가 없는 자산을 AI가 자동으로 분류합니다. 프롬프트를 ChatGPT · Claude · Gemini · Grok에 붙여넣으면 각 자산에 적합한 분류를 추천받을 수 있습니다.",
  asset_btn_import_csv: "CSV 가져오기",
  asset_btn_export_csv: "CSV 내보내기",
  asset_btn_add: "+ 자산 추가",
  asset_modal_add: "새 자산 등록",
  asset_modal_edit: "자산 수정",
  asset_delete_confirm: "이 자산을 삭제하시겠습니까?",
  asset_ai_modal_title: "AI 분류",
  asset_ai_tab_generate: "① 프롬프트 생성",
  asset_ai_tab_import: "② AI 응답 가져오기",
  asset_ai_copy_desc:
    "아래 프롬프트를 복사해 ChatGPT, Claude, Gemini, Grok 등 AI에 붙여 넣으세요.",
  asset_ai_tab_link: "② AI 응답 가져오기",
  asset_ai_copy: "클립보드에 복사",
  asset_ai_copied: "✓ 복사됨!",
  asset_ai_close: "닫기",
  asset_ai_import_desc: "AI가 응답한 JSON을 아래에 붙여 넣고",
  asset_ai_format_label: "형식:",
  asset_ai_json_placeholder:
    'AI 응답 JSON을 여기에 붙여 넣으세요…\n\n예시:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "…" },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "…" }\n]',
  asset_ai_apply_btn: "분류 적용",
  asset_ai_apply_result: (applied, skipped) =>
    `✓ ${applied}건 분류가 적용되었습니다.${skipped > 0 ? ` (${skipped}건 건너뜀)` : ""}`,

  asset_ai_parse_error: "파싱 오류",
  exchange_rate_error: "환율 조회에 실패했습니다. 수동으로 입력해 주세요.",
  asset_ai_copy_link_pre: "응답을 받으면",
  asset_ai_copy_link_post: "탭에서 자동 적용할 수 있습니다.",
  asset_ai_import_btn_suffix: "버튼을 눌러 주세요.",
  csv_preview_title: (n) => `CSV 미리보기 — ${n}행`,
  csv_preview_confirm: "가져오기 확정",
  csv_preview_more: (n) => `… 외 ${n}행`,

  guru_title: "투자 구루",
  guru_empty_title: "투자 구루 분석",
  guru_empty_desc: "자산을 등록한 후 구루와 비교 분석을 할 수 있습니다.",
  guru_philosophy_label: "투자 철학",
  guru_ideal_alloc: "이상적 자산 배분",
  guru_radar_title: "내 포트폴리오 vs 구루 비교",
  guru_my_portfolio: "내 포트폴리오",
  guru_rebalance_title: "구루 기준 리밸런싱 제안",
  guru_col_category: "분류",
  guru_col_current: "현재",
  guru_col_guru_target: "구루 목표",
  guru_col_diff: "차이",
  guru_col_amount: "조정 금액",
  guru_ai_banner_title: "구루에게 묻기",
  guru_ai_banner_desc:
    "선택한 구루의 관점으로 내 포트폴리오를 분석해 드립니다.",
  guru_ai_btn: "프롬프트 생성",
  guru_ai_close: "닫기",
  guru_ai_desc:
    "아래 프롬프트를 복사해 ChatGPT, Claude, Gemini, Grok 등 AI에 붙여 넣으세요.",
  guru_ai_search_warn: "AI가 최신 뉴스를 검색하므로 답변에 수 초가 더 소요될 수 있습니다.",
  guru_ai_copy: "클립보드에 복사",
  guru_ai_copied: "✓ 복사됨!",
  guru_ai_followup_btn: "이전 대화에서 계속",
  guru_ai_followup_desc:
    "지난 대화 이후의 포트폴리오 변동 사항만을 담은 프롬프트입니다. 이전 채팅에 이어 붙여넣어 바뀐 점을 평가받으세요.",
  guru_ai_followup_new_session: "새 대화 시작",
  guru_ai_followup_new_session_confirm:
    "저장된 이전 포트폴리오 상태를 삭제하고 현재 상태로 새 대화를 시작합니다. 계속하시겠습니까?",
  guru_ai_session_saved: "✓ 현재 포트폴리오 상태가 저장되었습니다.",
  guru_name_buffett: "워렌 버핏",
  guru_name_munger: "찰리 멍거",
  guru_name_lynch: "피터 린치",
  guru_name_graham: "벤저민 그레이엄",
  guru_name_dalio: "레이 달리오",
  guru_name_lilu: "리루",
  guru_name_ackman: "빌 애크먼",
  guru_name_burry: "마이클 버리",
  guru_name_fisher: "켄 피셔",
  guru_name_cohen: "스티븐 코헨",
  guru_name_marks: "하워드 막스",
  guru_name_klarman: "세스 클라먼",
  guru_name_templeton: "존 템플턴",
  guru_name_soros: "조지 소로스",
  guru_name_wood: "캐시 우드",
  guru_name_druckenmiller: "스탠리 드러큰밀러",
  guru_name_smith: "테리 스미스",
  guru_name_greenblatt: "조엘 그린블라트",
  guru_name_piotroski: "조셉 피오트로스키",
  guru_name_oneil: "윌리엄 오닐",
  guru_philosophy_buffett:
    "• 경제적 해자(moat): 진입 장벽이 높고 지속 가능한 경쟁 우위를 가진 기업에 주목\n" +
    "• 장기 보유: 이해할 수 있는 사업을 합리적 가격에 매수하여 영구적으로 보유하는 것을 선호\n" +
    "• 배당 성장 & 자사주 매입: 꾸준한 주주환원 정책과 탁월한 자본 배분 능력을 중시\n" +
    "• 능력 범위(Circle of Competence): 본인이 명확히 이해할 수 있는 산업과 비즈니스 모델에만 투자\n" +
    "• 훌륭한 비즈니스: 적당한 회사를 훌륭한 가격에 사는 것보다, 훌륭한 회사를 적당한 가격에 사는 것이 훨씬 낫다\n" +
    "• 무지성의 극복: 복잡한 파생상품과 이해할 수 없는 비즈니스를 철저히 배제\n" +
    "• 현금 옵션: 위기 상황에서 유동성을 공급하고 기회를 잡기 위해 항상 막대한 현금을 대기시킴\n",
  guru_quotes_buffett:
    "규칙 1: 절대 돈을 잃지 마라. 규칙 2: 규칙 1을 절대 잊지 마라.\n" +
    "남들이 탐욕스러울 때 두려워하고, 남들이 두려워할 때 탐욕스러워져라.\n" +
    "밀물이 빠져나가야 비로소 누가 발가벗고 헤엄치고 있었는지 알 수 있다.",
  guru_philosophy_munger:
    "• 집중 투자: 소수의 뛰어난 기업에 대한 강한 확신이 있을 때만 대규모로 집중 베팅\n" +
    "• 멘탈 모델(다학제적 사고): 심리학, 물리학, 생물학, 수학, 역사학 등 여러 분야의 핵심 원리를 융합하여 사고\n" +
    "• 인내심: 잦은 매매를 피하고, 훌륭한 비즈니스가 오랜 시간 동안 복리를 창출하도록 '아무것도 하지 않는 것'의 미덕을 강조\n" +
    "• 유행 아이디어 회피: 대중적 서사와 군중 사고에 휩쓸리지 않고, 진정으로 독립적인 판단을 유지\n" +
    "• 회피의 기술(역발상): 어떻게 하면 실패할지 먼저 묻고, 어리석은 짓을 체계적으로 피함으로써 성공을 달성\n" +
    "• 지속적 학습: 매일 일어날 때보다 조금 더 현명해지려고 노력하며, 끊임없는 독서와 반추를 실천\n" +
    "• 인센티브의 힘: 인센티브 체계가 인간 행동과 비즈니스 결과에 미치는 막대한 영향을 절대적으로 중시\n",
  guru_quotes_munger:
    "뒤집어 생각하라. 항상 뒤집어 생각하라(Invert, always invert).\n" +
    "내게 인센티브를 보여주면, 결과를 보여주겠다.\n" +
    "우리가 장기적으로 성공한 이유는 아주 똑똑해지려고 노력해서가 아니라, 지속적으로 어리석은 짓을 피하려고 노력했기 때문이다.",
  guru_philosophy_lynch:
    "• 일상 속 투자 아이디어: 생활에서 성장하는 제품·서비스를 가장 먼저 발견하고 펀더멘털 분석으로 검증\n" +
    "• PEG 비율: 주가수익비율(PER)을 이익 성장률로 나누어, 성장이 가격에 얼마나 반영되었는지 적정 밸류에이션 판단\n" +
    "• 텐배거(Tenbagger) 추구: 수십 배 성장할 수 있는 강소기업을 발굴하여 10배 이상의 경이적인 수익을 목표\n" +
    "• 광범위한 분산: 수백 종목을 보유하여 리스크를 분산하되, 각각의 투자 논거를 명확히 관리\n" +
    "• 철저한 리서치: 기업 방문, 경영진 면담, 재무제표 분석 등 끈질긴 발로 뛰는 조사를 중시\n" +
    "• 칵테일 파티 이론: 대중이 주식에 열광할 때가 고점이고, 모두가 주식을 외면할 때가 바닥이라는 군중 심리 지표\n",
  guru_quotes_lynch:
    "무엇을 왜 보유하는지 스스로 명확히 설명할 수 있어야 한다.\n" +
    "주식 시장에서 가장 뛰어난 기관은 바로 당신의 뇌다.\n" +
    "뛰어난 기업의 주식을 보유하고 있다면 시간은 당신 편이다.",
  guru_philosophy_graham:
    "• 안전마진(Margin of Safety): 내재가치 대비 충분히 극단적으로 할인된 가격에서만 매수하여 오판의 여지를 방어\n" +
    "• 미스터 마켓(Mr. Market): 시장은 매일 변덕스럽게 가격을 제시하는 동업자일 뿐, 시장의 감정에 휘둘리지 말고 이를 이용하라\n" +
    "• 방어적 투자: 원금 보전과 손실 방어를 최우선으로 하는 극단적으로 보수적인 접근\n" +
    "• 주식-채권 균형 배분: 주식 25~75%, 나머지 채권으로 기계적 배분을 통해 시장 상황에 따라 포트폴리오 조절\n" +
    "• 정량적 분석: 경영진의 약속이나 테마 등 감정을 철저히 배제하고, 순유동자산가치(NCAV) 등 재무 데이터 기반의 냉철한 기업 평가\n",
  guru_quotes_graham:
    "투자란 철저한 분석을 통해 원금의 안전과 적절한 수익을 보장하는 것이다. 이 요건을 충족하지 못하면 투기다.\n" +
    "투자자의 가장 큰 문제는—그리고 최악의 적은—대부분 자기 자신이다.\n" +
    "단기적으로 시장은 투표기지만, 장기적으로는 저울이다.",
  guru_philosophy_dalio:
    "• 올웨더(All Weather) 전략: 경제 사이클을 경제 성장(증가/둔화)과 인플레이션(상승/하락)의 4사분면으로 나누어 완벽하게 대비\n" +
    "• 리스크 패리티: 자본액이 아닌 '자산군별 리스크 기여도'를 균등하게 배분하여 특정 자산의 변동성에 휘둘리지 않는 포트폴리오 구축\n" +
    "• 광범위한 분산: 주식, 명목 채권, 물가연동채, 금, 원자재 등 서로 상관관계가 낮은 자산에 구조적으로 분산 투자\n" +
    "• 극단적 투명성(Radical Transparency): 조직 내에서 직급과 무관하게 진실을 추구하고 아이디어 성과주의(Idea Meritocracy)를 실천\n" +
    "• 원칙(Principles): 시장과 삶을 기계적인 인과관계로 이해하고, 실패를 통해 얻은 교훈을 알고리즘과 체계적 프로세스로 시스템화\n" +
    "• 부채 사이클 이해: 단기 부채 사이클(비즈니스 사이클)과 장기 부채 사이클을 분석하여 거시경제적 추세의 변곡점에 대응\n",
  guru_quotes_dalio:
    "수정 구슬에 기대어 사는 자는 결국 깨진 유리를 씹게 된다.\n" +
    "고통에 반성을 더하면 발전이 된다(Pain + Reflection = Progress).",
  guru_philosophy_lilu:
    "• 버핏-멍거 접근의 아시아 적용: 가치 투자 원칙을 구조적 성장이 일어나는 중국 및 아시아 시장에 맞게 실행\n" +
    "• 깊은 기업 분석: 비즈니스 모델의 본질, 경영진의 진실성, 그리고 장기적인 경쟁 우위를 철저히 파악\n" +
    "• 초집중 포트폴리오: 평생 몇 안 되는 높은 확신이 있는 소수 종목에만 대규모로 자본을 투자\n" +
    "• 장기 보유: 단기 변동성을 무시하고, 기업의 내재가치가 가격에 반영될 때까지 5~10년 이상의 초장기 투자 관점 유지\n" +
    "• 지적 정직함: 자신의 무지와 능력의 한계를 명확히 인정하고, 철저히 능력 범위(Circle of Competence) 내에서만 투자\n",
  guru_quotes_lilu:
    "투자의 가장 큰 위험은 가격 변동성이 아니라 영구적 자본 손실이다.\n" +
    "올바른 투자자는 결코 시장을 이기려 하지 않는다. 그들은 스스로의 무지를 통제할 뿐이다.",
  guru_philosophy_ackman:
    "• 행동주의 투자(Activist Investing): 대규모 지분을 확보한 뒤 기업 경영에 적극 개입하여 숨겨진 주주 가치를 강제로 끌어올림\n" +
    "• 집중 포트폴리오: 가장 확신하는 5~10개의 단순하고 예측 가능한 우량 기업에 대규모 집중 투자\n" +
    "• 사업 모델 분석: 잉여현금흐름이 뛰어나고, 브랜드 파워가 강력하며, 진입 장벽이 높은 해자 기업 선호\n" +
    "• 비대칭 보상(Asymmetric Risk-Reward): 잃을 확률과 금액은 극히 제한적이지만, 성공했을 때 얻을 상방 잠재력은 무한한 기회 추구\n" +
    "• 매크로 헤지: 시장 폭락이나 팬데믹 같은 극단적 거시경제 시나리오에 대비해 신용디폴트스왑(CDS) 등 거대한 방어적 파생상품 포지션 활용\n",
  guru_quotes_ackman:
    "집중은 부를 만들고, 분산은 부를 지킨다.\n" +
    "최고의 투자는 언제나 사람들이 그것을 최악의 아이디어라고 조롱할 때 이루어진다.",
  guru_philosophy_burry:
    "• 역발상 투자: 시장 다수의 의견이나 열광에 반대되는 포지션을 취하는 것을 조금도 주저하지 않음\n" +
    "• 가치 기반 분석: 군중 심리를 배제하고 기업의 내재가치와 자산가치를 정밀하고 집요하게 계산\n" +
    "• 매크로 베팅: 거시경제적 추세, 시스템적 리스크, 자산 거품을 심층 분석하여 확신이 서면 거대한 방향성 베팅을 단행\n" +
    "• 고독한 독립적 사고: 월스트리트의 주류 서사나 타인의 의견에 휩쓸리지 않고 철저히 고립된 자신만의 분석에 근거\n" +
    "• 높은 현금 비중: 시장에 확실하고 매력적인 기회가 올 때까지 끝없이 인내하며 현금을 보유\n",
  guru_quotes_burry:
    "나는 일찍 틀린 것이 아니라, 일찍 맞았을 뿐이다.\n" +
    "모두가 무언가를 믿는다는 것은, 그 누구도 그것을 검증하지 않았다는 뜻이다.",
  guru_philosophy_fisher:
    "• 글로벌 매크로: 세계 경제의 거대한 흐름과 역사적 시장 사이클을 분석하여 거시적 자산 배분을 결정\n" +
    "• 투자 심리 역이용: 시장의 극단적인 공포나 지나친 낙관 등 대중의 쏠림 현상을 역으로 이용해 수익 기회로 활용\n" +
    "• 장기 주식 비중 확대: 자본주의 시스템에서 주식이 장기적으로 다른 어떤 자산보다 압도적으로 높은 수익을 제공한다고 확신\n" +
    "• 광범위한 글로벌 분산: 특정 국가나 섹터에 편중된 홈 바이어스(Home Bias)를 배제하고 전 세계에 걸쳐 광범위하게 분산 투자\n" +
    "• 3가지 질문: 시장이 아는 것, 모르는 것, 그리고 틀리게 믿고 있는 것을 날카롭게 구별하여 엣지를 확보\n",
  guru_quotes_fisher:
    "시장은 늘 걱정의 벽을 타고 오른다.\n" +
    "모두가 안다고 생각하는 것은 사실 틀린 경우가 많으며, 거기에 가장 큰 기회가 있다.",
  guru_philosophy_cohen:
    "• 멀티 매니저 모델: 다수의 독립적인 투자 전략과 천재적인 매니저들을 하나의 플랫폼에서 병행 운영\n" +
    "• 리스크 관리 최우선: 포지션별 엄격한 손절선 설정과 전체 포트폴리오의 리스크 한도를 무자비하게 관리\n" +
    "• 단기~중기 거래: 시장의 단기적 비효율성을 포착하여 빠른 의사결정과 높은 포지션 회전율로 절대 수익을 추구\n" +
    "• 정보 우위: 월스트리트 최고 수준의 집요한 리서치 역량과 방대한 대체 데이터 분석에 기반한 투자 결정\n" +
    "• 유연한 전략: 롱/숏 에쿼티, 이벤트 드리븐, 퀀트 등 시장 환경에 맞춰 모든 전략을 동원\n",
  guru_quotes_cohen:
    "중요한 것은 예측의 정확도가 아니라, 손실을 통제하는 무자비한 리스크 관리다.\n" +
    "시장은 효율적이지 않다. 정보가 비대칭적일 때 돈이 벌린다.",
  guru_philosophy_marks:
    "• 시장 사이클 이론: 시장은 직선이 아니라 진자처럼 오르내리며, 현재 우리가 사이클의 어디에 있는지 파악하는 것이 핵심\n" +
    "• 2차적 사고(Second-Level Thinking): 남들과 똑같이 생각해서는 초과 수익을 낼 수 없으며, 합의된 대중의 생각보다 한 차원 깊고 남다르게 사고해야 함\n" +
    "• 디스트레스드 투자: 부실채권이나 위기 자산처럼 대중이 기피하는 곳에서 진정한 가치와 높은 수익률 기회를 포착\n" +
    "• 리스크의 본질: 리스크는 단기적 '변동성(Volatility)'이 아니라 '영구적 자본 손실(Permanent Loss of Capital)'의 가능성으로 정의\n" +
    "• 방어적 투자: 좋은 시기에 최대 수익을 좇기보다, 나쁜 시기에 손실을 줄이는 방어적 포지셔닝에 훨씬 더 집중\n" +
    "• 가격과 가치의 괴리: 아무리 좋은 자산도 비싸게 사면 나쁜 투자가 되고, 나쁜 자산도 충분히 싸게 사면 좋은 투자가 됨\n",
  guru_quotes_marks:
    "우리는 미래를 예측할 수는 없지만, 미래에 대비할 수는 있다.\n" +
    "경험이란 당신이 원하는 것을 얻지 못했을 때 얻게 되는 것이다.\n" +
    "가장 위험한 투자는 리스크가 없다고 믿는 것이다.",
  guru_philosophy_klarman:
    "• 안전마진 계승: 벤저민 그레이엄의 보수적인 안전마진 철학을 복잡한 현대 금융 시장에 맞게 정교하게 적용\n" +
    "• 절대 수익 추구: 벤치마크 지수를 추종하는 상대 수익의 함정을 거부하고, 잃지 않는 절대 수익 달성에만 집중\n" +
    "• 높은 현금 비중: 가치 기준을 충족하는 기회가 없을 때는 현금 비중을 50% 이상까지 끌어올리는 극단적인 인내심 발휘\n" +
    "• 시장 공포 활용: 위기 시 남들이 패닉에 빠져 무차별 매도할 때, 자산의 본질 가치를 계산하여 가장 훌륭한 매수자로 등장\n" +
    "• 하방 보호 최우선: 상승장의 막바지에 수익을 극대화하려는 유혹을 뿌리치고, 언제나 원금 보전과 하방 리스크 차단을 최우선시\n",
  guru_quotes_klarman:
    "가치투자는 역발상 성향과 계산기의 결합이다.\n" +
    "우리의 목표는 돈을 버는 것이 아니라 돈을 잃지 않는 것이다. 그러면 수익은 알아서 따라온다.\n" +
    "시장은 언제나 틀릴 수 있으며, 가격 변동성이 곧 리스크를 의미하는 것은 아니다.",
  guru_philosophy_templeton:
    "• 글로벌 역발상: 모든 사람이 매도하기를 원해 주가가 바닥을 치는 '비관의 극점(Point of Maximum Pessimism)'에서 과감히 매수\n" +
    "• 국경 없는 투자: 자국 시장의 편견에서 벗어나 전 세계 모든 국가와 자산군에서 저평가된 기회를 끝없이 탐색\n" +
    "• 장기 가치 투자: 단기적인 소음에 흔들리지 않고 5~10년 이상의 장기 보유를 통해 진정한 기업 가치 실현을 기대\n" +
    "• 정량적 스크리닝: 낮은 PER, PBR, 높은 이익률 등 철저한 계량 지표를 바탕으로 가장 저렴하고 건실한 종목을 선별\n" +
    "• 유연성과 개방성: 시장 상황에 따라 투자 스타일이나 자산군을 유연하게 변경하며 절대 한 가지 접근법에 얽매이지 않음\n",
  guru_quotes_templeton:
    "비관이 극에 달했을 때가 최고의 매수 시점이고, 낙관이 극에 달했을 때가 최고의 매도 시점이다.\n" +
    "가장 훌륭한 투자 수익은 상식에 반하는 곳에 존재한다.\n" +
    "이번엔 다르다(This time is different)는 영어에서 가장 값비싼 네 단어다.",
  guru_philosophy_soros:
    "• 재귀성 이론(Reflexivity): 시장은 효율적이지 않으며, 참여자의 편향된 인식이 시장 가격에 영향을 주고 그것이 다시 펀더멘털을 변화시키는 피드백 루프 생성\n" +
    "• 대규모 방향성 베팅: 거시경제적 불균형을 포착하고 확신이 섰을 때, 통화·채권·주식 등 자산군을 가리지 않고 레버리지를 동원해 거대하게 베팅\n" +
    "• 글로벌 매크로: 정치, 경제, 사회적 변화, 중앙은행의 정책 방향을 읽어내어 거시적 투자 기회를 발굴\n" +
    "• 빠른 손절과 생존: 생존이 가장 중요하며, 가설이 틀렸다고 판단되면 즉시 포지션을 청산하고 도망칠 줄 알아야 함\n" +
    "• 혼돈과 비효율성 활용: 시장의 불안정성과 거품이 형성되는 초기 단계를 오히려 수익 기회로 적극 활용\n" +
    "• 오류 가능성(Fallibility): 인간은 필연적으로 오류를 범하며, 자신의 가설이 틀릴 수 있다는 것을 항상 열어두고 의심\n",
  guru_quotes_soros:
    "맞고 틀리고보다, 맞았을 때 얼마나 벌고 틀렸을 때 얼마나 잃는지가 중요하다.\n" +
    "시장은 항상 틀린다.\n" +
    "내가 부자인 이유는 내가 언제 틀렸는지를 알고, 실수를 재빨리 인정하기 때문이다.",
  guru_philosophy_wood:
    "• 파괴적 혁신(Disruptive Innovation): 현재의 비즈니스 모델을 완전히 파괴하고 5~10년 후 세상을 지배할 기술에만 집중 투자\n" +
    "• 핵심 테마: AI, 로보틱스, 에너지 저장, 유전체학(DNA 시퀀싱), 블록체인의 5대 혁신 플랫폼이 창출하는 기하급수적 성장에 베팅\n" +
    "• 장기 성장 투자: 혁신 기술이 성숙하기까지 발생하는 극심한 단기 변동성을 당연한 것으로 감수하고 장기적 잠재력에 집중\n" +
    "• 라이트의 법칙(Wright's Law) 적용: 누적 생산량이 증가할수록 비용이 일정 비율로 하락한다는 원칙을 테슬라 등 기술주 밸류에이션에 적용\n" +
    "• 투명한 운용 체계: 자체 리서치 팀의 오픈소스 기반 리서치 및 매일의 펀드 매매 내역을 투명하게 대중과 공유\n",
  guru_quotes_wood:
    "혁신은 문제를 해결하고, 이전에 존재하지 않았던 완전히 새로운 시장 기회를 창출한다.\n" +
    "우리는 역사의 올바른 편, 혁신의 편에 서서 내일을 앞당기고 있다.",

  guru_philosophy_druckenmiller:
    "• 매크로 트레이딩의 대가: 거시경제, 통화 정책, 금리, 주식의 상관관계를 통찰하여 확신이 설 때 막대한 방향성 포지션을 구축\n" +
    "• 자본 보전 최우선: 조지 소로스의 퀀텀 펀드 시절부터 일관되게 하방 리스크를 통제하며 30년 넘게 마이너스 수익률을 기록한 해가 없음\n" +
    "• 고확신 집중 베팅: 평범한 아이디어에는 분산 투자로 방어하지만, 엄청난 확신이 드는 순간에는 모든 자본을 끌어모아 레버리지로 홈런을 노림\n" +
    "• 유연성과 추세 추종: 자신의 분석이 틀렸다고 판단하거나 시장의 거대한 추세가 꺾이면 자존심을 버리고 즉시 포지션을 180도 전환\n" +
    "• 비대칭 리스크 관리: 잘못된 베팅의 손실은 아주 짧게 끊어내고, 올바른 베팅의 수익 구간은 끈질기게 길게 가져가 절대 수익을 창출\n",
  guru_quotes_druckenmiller:
    "장기적으로 압도적인 수익률을 만드는 길은 철저한 자본 보전과 이따금씩 치는 거대한 홈런이다.\n" +
    "계란을 한 바구니에 담아라. 그리고 그 바구니를 밤낮없이 아주 철저하게 지켜보라.",
  guru_philosophy_smith:
    "• 우량 기업 장기 보유: '좋은 기업을 사고, 비싸게 사지 말고, 아무것도 하지 마라(Buy good companies, don't overpay, do nothing)'라는 극단적으로 단순한 핵심 원칙\n" +
    "• 높은 ROIC 중시: 자본을 재투자해 지속적으로 높은 수익을 창출하는 독점적 해자를 가진 기업만 철저히 선별해 장기 복리 성장을 추구\n" +
    "• 집중 포트폴리오: 시장 수익률을 갉아먹는 과도한 분산을 거부하고 약 25~30개 핵심 종목에만 집중해 아이디어의 질로 승부\n" +
    "• 품질 우선: 일시적으로 저평가된 싼 주식(Cigar Butt)보다 사업의 질, 강력한 잉여현금창출력, 압도적인 경영 효율성을 훨씬 더 높게 평가\n" +
    "• 복리 메커니즘과 인내: 가치 투자의 본질은 잦은 트레이딩이 아니라, 내부 재투자 수익률이 높은 위대한 기업을 영원히 보유해 복리 효과를 극대화하는 것\n",
  guru_quotes_smith:
    "리스크를 줄이겠다며 무작정 분산하는 접근에는 동의하지 않는다. 보유한다면 최고의 기업을 보유하라.\n" +
    "투자자들이 저지르는 가장 큰 실수는 포트폴리오를 자꾸 건드리고 무언가 해야만 한다고 느끼는 것이다.",
  guru_philosophy_greenblatt:
    "• 마법 공식(Magic Formula): 높은 이익수익률(Earnings Yield)로 저평가를, 높은 자본수익률(ROIC)로 기업의 퀄리티를 동시에 충족하는 종목을 기계적으로 선별\n" +
    "• 정량 기반 가치 투자: 탐욕과 공포라는 인간의 감정을 철저히 배제하고, 수학적 규칙에 따라 냉정하게 자본을 배분하는 시스템형 접근\n" +
    "• 소외된 우량주 발굴: 시장이 일시적 악재로 인해 무관심하게 던져버린 저평가·고품질 기업을 체계적인 필터링으로 찾아냄\n" +
    "• 분산 운용과 정기 리밸런싱: 20~30개 종목으로 개별 기업의 리스크를 분산하고, 1년 단위의 기계적 리밸런싱으로 팩터 전략의 일관성을 유지\n" +
    "• 인내가 핵심: 전략이 아무리 통계적으로 유효해도 3~4년가량은 시장 대비 부진할 수 있으며, 이 고통을 견뎌야만 장기적인 초과 수익을 얻음\n",
  guru_quotes_greenblatt:
    "가치를 먼저 계산하고, 그보다 훨씬 싼 가격에 사라. 단기 시장은 미스터 마켓의 감정에 흔들린다.\n" +
    "마법 공식이 항상 통하지 않는다는 바로 그 사실이, 장기적으로 마법 공식을 작동하게 만드는 핵심 원동력이다.",
  guru_philosophy_piotroski:
    "• F-Score(피오트로스키 스코어): 9가지 엄격한 이진 재무 기준(수익성, 재무 구조, 영업 효율성)을 통해 기업의 펀더멘털 건전성을 0~9점으로 정량 평가\n" +
    "• 가치주 필터링: 단순히 장부가 대비 저평가된 싼 주식(Value Trap)을 피하고, 턴어라운드 중이거나 재무 체질이 튼튼한 우량 가치주만 선별\n" +
    "• 수익성 및 현금흐름 평가: 순이익보다 현금흐름이 큰지(발생주의 품질), ROA가 전년 대비 개선되었는지 등 이익의 질을 가장 우선시\n" +
    "• 재무 건전성 추적: 신규 주식 발행 여부, 부채 비율의 감소, 유동비율 개선 등 재무적 안정성이 확보된 기업에만 자본을 투입\n" +
    "• 운영 효율성 진단: 매출총이익률 상승과 자산 회전율 개선 등 경영 효율화가 실질적으로 진행되고 있는지를 데이터로 증명\n",
  guru_quotes_piotroski:
    "단순히 싼 주식을 사는 것은 위험하다. 그 기업의 재무제표가 개선되고 있다는 결정적 증거를 데이터로 확인하라.\n" +
    "높은 BM(장부가 대비 시가) 기업 중 재무가 탄탄한 9점 만점의 종목만이 가치 투자의 승률을 압도적으로 높여준다.",
  guru_philosophy_oneil:
    "• CAN SLIM 시스템: 기업의 펀더멘털과 주가 차트의 기술적 분석을 완벽하게 결합하여 초고속 성장주를 선별하는 체계적 투자 방법론\n" +
    "• C(당기 실적) & A(연간 실적): 최근 분기 EPS가 전년 동기 대비 최소 25% 이상 성장해야 하며, 지난 3~5년간 폭발적 성장을 지속한 기업을 추구\n" +
    "• N(신제품·신고가): 세상을 뒤흔들 혁신적인 신제품이나 서비스를 보유하고 주가가 52주 신고가를 돌파하는 강세 모멘텀에서 매수\n" +
    "• S·L·I·M 요건: 공급이 적은 주식, 시장을 주도하는 1등 선도주, 기관 투자자의 적극적 매수세, 그리고 전체 시장의 확고한 상승장 진입 여부를 종합 판단\n" +
    "• 무자비한 손절매 규칙: 매수가 대비 7~8% 하락 시 그 어떤 예외나 핑계 없이 기계적으로 손절하여 거대한 자본 손실을 원천 차단\n",
  guru_quotes_oneil:
    "주식 시장에서 이기는 가장 큰 비결은, 당신이 틀렸을 때 최대한 적게 잃고 재빨리 빠져나오는 것이다.\n" +
    "싼 주식을 사서 싸게 팔지 마라. 비싸게 사서 더 비싸게 팔아라.\n" +
    "가장 위대한 주식은 언제나 처음에는 너무 비싸 보이고, 가장 엉망인 주식은 언제나 가장 싸 보인다.",

  lynch_tenbagger_title: "피터 린치 10루타 채점기",
  lynch_tenbagger_desc:
    "보유 주식이나 관심 종목을 피터 린치의 PEG·성장·재무 기준으로 채점합니다. PEG < 1.0, EPS 성장률 > 15%, 매출 성장률 > 10%, 부채비율 < 80%, 영업이익률 > 10%, 시가총액 $10B 미만일수록 높은 점수를 받습니다. 저PEG·고성장 소중형주를 발굴하는 데 적합합니다.",
  lynch_criterion_peg: "PEG 비율",
  lynch_criterion_eps: "EPS 성장률",
  lynch_criterion_rev: "매출 성장률",
  lynch_criterion_debt: "부채비율 (D/E)",
  lynch_criterion_margin: "영업이익률",
  lynch_criterion_cap: "시가총액",
  lynch_no_data: "데이터 없음",
  lynch_disclaimer:
    "※ Yahoo Finance 재무 데이터 기반. 투자 결정의 근거로 삼지 마세요.",
  lynch_progress_enrich: (done, total) => `⏳ 상세 분석 중… (${done}/${total})`,
  lynch_phase_enrich: "🔍 종목 상세 재무 데이터 보강 중…",
  lynch_no_result: "Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  lynch_tenbagger_badge: "🚀 10루타 후보",
  lynch_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  // ─── Analyzer Common (mode tabs) ─────────────────────────────────────────────
  analyzer_mode_portfolio: "내 포트폴리오",
  analyzer_mode_search: "티커 검색",
  analyzer_portfolio_desc: (count) => `포트폴리오 내 주식 ${count}종목을 채점합니다.`,
  analyzer_btn_portfolio: "포트폴리오 채점",
  analyzer_btn_search: "분석",
  analyzer_search_placeholder: "티커 또는 종목명 입력 (예: AAPL, 삼성전자)",

  // ─── Magic Formula Analyzer ──────────────────────────────────────────────────
  mf_title: "조엘 그린블라트 마법 공식 채점기",
  mf_desc:
    "높은 이익수익률(Earnings Yield)과 높은 자본수익률(Return on Capital)을 동시에 갖춘 종목을 채점합니다. EY > 10%, ROC > 25%, 영업이익률 > 15%, 부채비율 < 50%, 시가총액 $1B–$10B 구간일수록 높은 점수를 받습니다. 감정을 배제한 규칙 기반 가치 투자 종목 발굴에 적합합니다.",
  mf_criterion_ey: "이익수익률",
  mf_criterion_roc: "자본수익률",
  mf_criterion_margin: "영업이익률",
  mf_criterion_debt: "부채비율 (D/E)",
  mf_criterion_cap: "시가총액",
  mf_no_data: "데이터 없음",
  mf_disclaimer:
    "※ Yahoo Finance 재무 데이터 기반. 투자 결정의 근거로 삼지 마세요.",
  mf_progress_enrich: (done, total) => `⏳ 상세 분석 중… (${done}/${total})`,
  mf_phase_enrich: "🔍 종목 상세 재무 데이터 보강 중…",
  mf_no_result: "Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  mf_magic_badge: "🪄 마법 공식 적합",
  mf_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  // Graham
  graham_analyzer_title: "벤저민 그레이엄 방어적 투자 채점기",
  graham_analyzer_desc:
    "보유 주식 또는 임의 티커를 그레이엄의 안전마진 기준으로 채점합니다. P/E < 15, P/B < 1.5, P/E×P/B < 22.5(그레이엄 넘버), 유동비율 > 2.0, 부채비율 < 50%, 배당수익률 > 3%일수록 높은 점수를 받습니다. 재무적으로 안정적인 저평가 방어적 가치주를 찾는 데 적합합니다.",
  graham_criterion_pe: "P/E 비율",
  graham_criterion_pb: "P/B 비율",
  graham_criterion_gn: "그레이엄 넘버",
  graham_criterion_cr: "유동비율",
  graham_criterion_debt: "부채비율 (D/E)",
  graham_criterion_div: "배당수익률",
  graham_no_data: "데이터 없음",
  graham_disclaimer:
    "※ Yahoo Finance 재무 데이터 기반. 투자 결정의 근거로 삼지 마세요.",
  graham_progress_enrich: (done, total) => `⏳ 상세 분석 중… (${done}/${total})`,
  graham_phase_enrich: "🔍 종목 상세 재무 데이터 보강 중…",
  graham_no_result: "Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  graham_defensive_badge: "🛡️ 방어적 투자 적합",
  graham_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  // Smith
  smith_analyzer_title: "테리 스미스 퀄리티 컴파운더 채점기",
  smith_analyzer_desc:
    "보유 주식 또는 임의 티커를 스미스의 퀄리티 컴파운더 기준으로 채점합니다. ROE > 20%, 영업이익률 > 15%, FCF 전환율 > 80%, 매출 성장률 > 10%, 부채비율 < 50%일수록 높은 점수를 받습니다. 높은 수익성과 현금 창출력을 갖춘 복리 성장 우량주 발굴에 적합합니다.",
  smith_criterion_roe: "ROE",
  smith_criterion_margin: "영업이익률",
  smith_criterion_fcf: "FCF 전환율",
  smith_criterion_rev: "매출 성장률",
  smith_criterion_debt: "부채비율 (D/E)",
  smith_no_data: "데이터 없음",
  smith_disclaimer:
    "※ Yahoo Finance 재무 데이터 기반. 투자 결정의 근거로 삼지 마세요.",
  smith_progress_enrich: (done, total) => `⏳ 상세 분석 중… (${done}/${total})`,
  smith_phase_enrich: "🔍 종목 상세 재무 데이터 보강 중…",
  smith_no_result: "Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  smith_quality_badge: "✨ 퀄리티 컴파운더",
  smith_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  // Piotroski F-Score
  piotroski_analyzer_title: "피오트로스키 F-Score 채점기",
  piotroski_analyzer_desc:
    "보유 주식 또는 임의 티커를 피오트로스키의 9가지 이진 재무 건전성 기준으로 채점합니다. 수익성(ROA > 0, 영업현금흐름 > 0, ΔROA 개선, 현금흐름 > 순이익), 재무건전성(부채 감소, 유동비율 개선, 주식 희석 없음), 운영효율(매출총이익률·자산회전율 개선) 세 영역 총 9점 만점. 재무 체질이 탄탄한 가치주 선별에 적합합니다.",
  piotroski_criterion_roa: "ROA (총자산수익률)",
  piotroski_criterion_cfo: "영업현금흐름",
  piotroski_criterion_delta_roa: "ΔROA (전년 대비)",
  piotroski_criterion_accruals: "발생주의 품질",
  piotroski_criterion_delta_leverage: "Δ장기부채",
  piotroski_criterion_delta_liquidity: "Δ유동비율",
  piotroski_criterion_equity_dilution: "주식 희석 여부",
  piotroski_criterion_delta_margin: "Δ매출총이익률",
  piotroski_criterion_delta_turnover: "Δ자산회전율",
  piotroski_no_data: "데이터 없음",
  piotroski_disclaimer:
    "※ Yahoo Finance 재무 데이터 기반. 투자 결정의 근거로 삼지 마세요.",
  piotroski_progress_enrich: (done, total) => `⏳ 상세 분석 중… (${done}/${total})`,
  piotroski_phase_enrich: "🔍 종목 상세 재무 데이터 보강 중…",
  piotroski_no_result: "Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  piotroski_fscore_badge: "📊 F-Score 우수",
  piotroski_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  // O'Neil CAN SLIM
  oneil_analyzer_title: "윌리엄 오닐 CAN SLIM 채점기",
  oneil_analyzer_desc:
    "보유 주식 또는 임의 티커를 오닐의 CAN SLIM 7가지 기준으로 채점합니다. C(분기 EPS 성장 ≥ 25%), A(연간 EPS 성장 ≥ 25%), N(52주 신고가 근접 ≥ 90%), S(유통주식 < 50M), L(높은 상대강도), I(기관 보유 30–70%), M(시가총액 $2B–$50B)으로 평가합니다. 폭발적 실적 성장과 강한 모멘텀을 갖춘 성장주 발굴에 적합합니다.",
  oneil_criterion_current: "분기 EPS 성장률 (C)",
  oneil_criterion_annual: "연간 EPS 성장률 (A)",
  oneil_criterion_newhigh: "52주 신고가 근접 (N)",
  oneil_criterion_supply: "유통주식 수 (S)",
  oneil_criterion_leader: "상대강도 (L)",
  oneil_criterion_institutional: "기관 보유 비중 (I)",
  oneil_criterion_cap: "시가총액 (M)",
  oneil_no_data: "데이터 없음",
  oneil_disclaimer:
    "※ Yahoo Finance 재무 데이터 기반. 투자 결정의 근거로 삼지 마세요.",
  oneil_progress_enrich: (done, total) => `⏳ 상세 분석 중… (${done}/${total})`,
  oneil_phase_enrich: "🔍 종목 상세 재무 데이터 보강 중…",
  oneil_no_result: "Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  oneil_canslim_badge: "🚀 CAN SLIM 적합",
  oneil_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  // ─── Buffett Indicator ────────────────────────────────────────────────────
  buffett_indicator_title: "버핏 지수 (Buffett Indicator)",
  buffett_indicator_subtitle: "미국 주식시장 시가총액 / GDP",
  buffett_indicator_ratio_label: "현재 버핏 지수",
  buffett_indicator_market_cap: "시가총액",
  buffett_indicator_gdp: "GDP",
  buffett_indicator_year: "기준 날짜",
  buffett_indicator_loading: "데이터 불러오는 중…",
  buffett_indicator_error: "데이터를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요.",
  buffett_indicator_status_deep_under: "대폭 저평가",
  buffett_indicator_status_under: "저평가",
  buffett_indicator_status_fair: "적정 평가",
  buffett_indicator_status_over: "고평가",
  buffett_indicator_status_deep_over: "대폭 고평가",
  buffett_indicator_source: "시가총액: Yahoo Finance ^W5000 · GDP: World Bank",
  buffett_indicator_desc: "버핏 지수는 미국 전체 주식시장 시가총액을 GDP로 나눈 값입니다. 워렌 버핏이 '아마 가장 좋은 단일 밸류에이션 지표'라고 언급했으며, 75% 미만이면 저평가, 200% 이상이면 '불장난'에 비유한 바 있습니다.",

  settings_title: "설정",
  settings_display_currency_title: "표시 화폐",
  settings_display_currency_desc:
    "대시보드 금액을 표시할 기준 통화를 선택합니다.",
  settings_fx_title: "환율",
  settings_fx_cache_warn: (time) =>
    `환율 조회 실패 — 캐시값 사용 중 (${time} 기준)`,
  settings_data_refresh_title: "환율 · 시세 갱신",
  settings_data_refresh_refreshing: "조회 중…",
  settings_data_refresh_refresh: "🔄 지금 갱신",
  settings_data_refresh_auto: "앱 시작 시 자동 조회됩니다.",
  settings_data_refresh_time: (time) => `${time} 기준`,
  settings_data_refresh_cache_warn: (time) =>
    `조회 실패 — 캐시값 사용 중 (${time} 기준)`,
  settings_data_refresh_result: (updated, total) =>
    `${total}건 중 ${updated}건 시세 갱신`,
  settings_data_refresh_no_ticker: "티커가 등록된 자산이 없습니다.",
  data_refresh_error:
    "환율/시세 조회에 실패했습니다. 네트워크 상태를 확인해 주세요.",
  data_refresh_partial_fail: (names) =>
    `다음 항목은 시세 조회에 실패했습니다. 자산 상세에서 현재가를 수동으로 입력해 주세요: ${names.join(", ")}`,

  drive_title: "Google Drive 동기화",
  drive_desc:
    "자산 데이터를 본인 Google Drive의 앱 전용 폴더에 자동 저장합니다. 다른 기기에서 동일 Google 계정으로 접속하면 데이터를 복원할 수 있습니다.",
  drive_connect: "Google으로 연결",
  drive_disconnect: "연결 해제",
  drive_connected: "Drive 연결됨",
  drive_syncing: "불러오는 중…",
  drive_saving: "저장 중…",
  drive_synced_at: (time) => `${time} 동기화됨`,
  drive_sync_now: "지금 동기화",
  drive_save_to_drive: "드라이브에 저장",
  drive_load_from_drive: "드라이브에서 불러오기",
  drive_no_client_id: "VITE_GOOGLE_CLIENT_ID 환경변수가 설정되지 않았습니다.",
  drive_error_prefix: "동기화 오류:",
  drive_conflict_title: "데이터 충돌 감지",
  drive_conflict_desc: (driveTime, localTime) =>
    `Google Drive 데이터(${driveTime})가 로컬 데이터(${localTime})보다 최신입니다. 어느 데이터를 사용하시겠습니까?`,
  drive_use_drive: "Google Drive 데이터 사용",
  drive_use_local: "로컬 데이터 유지",
  drive_error_no_client_id:
    "Google Client ID가 설정되지 않았습니다. .env를 확인해 주세요.",
  drive_error_gis_not_loaded:
    "Google Identity Services 스크립트가 로드되지 않았습니다.",
  settings_target_title: "목표 비중 배분",
  settings_target_sum: (n) => `합계: ${n}%`,
  settings_target_save: "저장",
  settings_target_saved: "저장되었습니다",
  settings_data_title: "데이터 관리",
  settings_data_local_title: "로컬 스토리지",
  settings_data_desc: "모든 데이터는 로컬 스토리지에 저장됩니다.",
  settings_data_count: (n) => `현재 등록된 자산: ${n}건`,
  settings_data_reset: "전체 데이터 초기화",
  settings_data_reset_confirm:
    "모든 데이터(자산, 설정)를 초기화합니다. 이 작업은 되돌릴 수 없습니다.",
  settings_data_drive_title: "💡 Google Drive 데이터 삭제",
  settings_data_drive_note:
    "Google Drive에 저장된 데이터를 삭제하려면 Google 계정의 앱 연결 관리 페이지(myaccount.google.com/permissions)에서 이 앱의 접근 권한을 해제하세요. 권한 해제 시 Google Drive에 저장된 백업 파일도 함께 삭제됩니다.",

  profile_title: "내 정보",
  profile_desc:
    "구루와 대화할 때 활용되는 개인 정보입니다. 파일로 저장되며 외부로 전송되지 않습니다.",
  profile_nickname_label: "닉네임 (불리고 싶은 이름)",
  profile_nickname_placeholder: "예시: 투자가A",
  profile_age_label: "나이",
  profile_age_placeholder: "예시: 35",
  profile_annual_income_label: "연소득 (연봉)",
  profile_annual_income_placeholder: "예시: 60000000",
  profile_monthly_budget_label: "매달 투자 가능 금액",
  profile_monthly_budget_placeholder: "예시: 500000",
  profile_plan3y_label: "3년 투자 계획",
  profile_plan3y_placeholder:
    "예시: 3년 안에 배당주 수입 월 30만원을 목표로 성장주 중심으로 리밸런싱…",
  profile_plan5y_label: "5년 투자 계획",
  profile_plan5y_placeholder:
    "예시: 5년 후 결혼 자금으로 1억 목표, 부동산 마련 계획…",
  profile_plan10y_label: "10년 투자 계획",
  profile_plan10y_placeholder:
    "예시: 10년 후 경제적 자유 달성을 위해 배당 수입만으로 생활비 충당…",
  profile_notes_label: "특이사항 / 유의점",
  profile_notes_placeholder:
    "예시: 주택론 잔액 2.3억원(잔여 15년), 월 투자액 중 50만원은 S&P500 ETF 자동매수로 실질적 수동 투자는 30만원 분…",
  profile_save: "저장",
  profile_saved: "✓ 저장되었습니다",

  at_col_name: "종목",
  at_col_market: "시장",
  at_col_category: "분류",
  at_col_quantity: "수량",
  at_col_avg_buy_price: "매입가",
  at_col_current_price: "현재가",
  at_col_value: "평가액",
  at_col_pnl: "손익",
  at_col_return: "수익률",
  at_col_weight: "비중",
  at_col_actions: "관리",
  at_empty_title: "등록된 자산이 없습니다",
  at_empty_desc: '위의 "자산 추가" 버튼으로 첫 자산을 등록해 보세요.',
  at_btn_edit: "편집",
  at_btn_delete: "삭제",
  at_unclassified: "미분류",
  at_filter_all_market: "전체 시장",
  at_filter_all_type: "전체 유형",
  at_filter_all_category: "전체 분류",
  at_filter_clear: "필터 해제",
  at_filter_count: (shown, total) => `${shown} / ${total}종목`,
  at_filter_no_result: "필터 조건에 맞는 자산이 없습니다.",
  at_col_ticker: "티커",
  ticker_search_no_result: "검색 결과가 없습니다.",
  ticker_search_error: "검색에 실패했습니다. 네트워크 상태를 확인해 주세요.",

  history_title: "자산 구성 추이",
  history_value: "평가액",
  history_cost: "매입원가",
  history_no_data: "데이터를 수집 중입니다. 내일부터 추이를 확인할 수 있어요.",

  pnl_chart_title: "종목별 손익 현황",
  pnl_chart_pnl: "손익",
  pnl_chart_profit: "수익",
  pnl_chart_loss: "손실",
  pnl_chart_top12: "손익 절대값 상위 12개",

  af_mode_stock: "종목 검색",
  af_mode_cash: "현금/예금",
  af_mode_crypto: "코인",
  af_mode_manual: "직접 입력",
  af_search_hint: "티커 또는 종목명을 입력하고 검색하세요.",
  af_search_placeholder: "티커 또는 종목명…",
  af_search_btn: "검색",
  af_searching: "검색 중…",
  af_results_count: (n) => `검색 결과 ${n}건`,
  af_no_results: "검색 결과 없음",
  af_manual_hint:
    "Yahoo Finance에서 검색되지 않는 종목(투자신탁 등)을 직접 입력합니다.\nISIN 또는 심볼을 알고 있다면 입력 후 현재가 조회를 시도하세요.",
  af_entry_mode_simple: "간이입력",
  af_entry_mode_detail: "상세입력",
  af_simple_amount_label: "평가액 *",
  af_simple_amount_placeholder: "현재 보유 평가액을 입력하세요",
  af_name_label: "종목명 *",
  af_ticker_label: "심볼 / ISIN (선택)",
  af_asset_type_label: "자산 유형",
  af_market_label: "시장",
  af_currency_label: "통화",
  af_quantity_label: "보유 수량 *",
  af_avg_price_label: "매입 단가",
  af_current_price_label: "현재가",
  af_current_price_auto: "✓ Yahoo Finance 자동 조회",
  af_fetch_price_btn: "현재가 조회",
  af_fetching: "조회 중…",
  af_currency_placeholder: "화폐를 선택하세요",
  af_currency_no_result: "결과 없음",
  af_back_to_search: "← 검색으로",
  af_re_search: "← 다시 검색",
  af_btn_cancel: "취소",
  af_btn_submit: "등록 완료",
  af_manual_name_placeholder: "예: 삼성전자, S&P 500 인덱스 펀드",
  af_manual_ticker_placeholder: "0P0001D75H.T 또는 JP90C000KRC0",
  af_manual_link: "Yahoo Finance에서 검색되지 않나요? → 직접 입력",
  af_cash_amount_label: "보유액",
  af_crypto_hint: "코인 티커를 입력하고 거래쌍을 선택하세요.",
  af_crypto_search_btn: "거래쌍 검색",
  af_crypto_searching: "조회 중…",
  af_crypto_pair_title: "거래쌍 선택",
  af_crypto_no_pairs: "거래쌍을 찾을 수 없습니다. 티커를 확인해 주세요.",
  af_crypto_selected: "선택됨",
  af_crypto_select: "선택",
  af_buy_price_label: "매입 단가",
  af_current_price_placeholder: "자동 조회 또는 수동 입력",
  af_account_label: "계좌",
  af_account_none: "계좌 미지정",

  broker_manage_btn: "계좌 관리",
  broker_title: "계좌 관리",
  broker_add_btn: "계좌 추가",
  broker_edit_btn: "수정",
  broker_save_btn: "저장",
  broker_delete_btn: "삭제",
  broker_cancel_btn: "취소",
  broker_empty: "등록된 계좌가 없습니다. 계좌를 추가해 보세요.",
  broker_country_label: "국가",
  broker_name_label: "금융기관",
  broker_type_label: "계좌 종류",
  broker_nickname_label: "애칭",
  broker_name_placeholder: "예: 미래에셋증권, KB국민은행, SBI証券, Fidelity",
  broker_type_placeholder: "예: ISA, NISA, 특정, 일반, IRA",
  broker_nickname_placeholder: "예: 키움 ISA, SBI 특정",
  broker_delete_confirm: "이 계좌를 삭제하시겠습니까?",
  broker_col_nickname: "애칭",
  broker_col_broker: "금융기관",
  broker_col_type: "계좌 종류",
  broker_col_country: "국가",

  atype_stock: "주식",
  atype_etf: "ETF",
  atype_fund: "펀드·투자신탁",
  atype_bond: "채권",
  atype_other: "기타",
  atype_crypto: "암호화폐",
  atype_cash: "현금/예금",
  market_jp: "일본 (JP)",
  market_us: "미국 (US)",
  market_kr: "한국 (KR)",
  market_eu: "유럽 (EU)",
  market_other: "기타",
  currency_jpy: "엔화 (JPY)",
  currency_usd: "달러 (USD)",
  currency_krw: "원화 (KRW)",
  currency_eur: "유로 (EUR)",

  nav_fire: "경제적 자유 플래너",
  fire_title: "경제적 자유 플래너",
  fire_desc: "현재 자산과 저축액, 수익률을 바탕으로 언제 경제적 자유(FIRE)에 도달할 수 있는지 예측해 보세요.",
  fire_tab_target: "목표 금액으로 계산",
  fire_tab_expense: "월 생활비로 계산",
  fire_use_portfolio_assets: "포트폴리오 자산 연동",
  fire_current_assets: "현재 자산 총액",
  fire_monthly_savings: "월 저축액",
  fire_helper_expected_return: "S&P 500 등 시장의 역사적 연평균 수익률은 보통 7%~10% 수준입니다.",
  fire_expected_return: "연 기대 수익률 (%)",
  fire_target_amount: "목표 자산 총액",
  fire_monthly_expense: "목표 월 생활비",
  fire_helper_safe_withdrawal: "은퇴 후 자산이 고갈되지 않는 기준선인 트리니티 연구의 4% 룰을 권장합니다.",
  fire_safe_withdrawal_rate: "안전 인출률 (%)",
  fire_calculate_btn: "계산하기",
  fire_res_years_label: "목표 달성 예상 기간",
  fire_res_age_label: "예상 도달 연령",
  fire_res_yrs: "년",
  fire_res_out_of_bounds: "계산 범위를 초과했습니다. 저축액이나 수익률을 높여보세요!",
  fire_result_already_reached: "축하합니다! 이미 목표를 달성하셨습니다. 🎉",
  fire_chart_title: "예상 자산 성장 추이",
  fire_chart_asset: "예상 자산액",
  fire_chart_target: "목표액",
  fire_tooltip_year: (year, age) => `${year}년 후${age ? ` (${age}세)` : ''}`,
  fire_age_label: "현재 나이 (선택)",
  fire_age_placeholder: "예: 30",
  fire_error_savings_exceed_target: "월 저축액이 목표 자산 총액을 초과합니다. 목표 금액이나 월 저축액을 다시 확인해 주세요.",

  category_labels: {
    dividend: "배당",
    growth: "성장",
    value: "가치",
    index: "인덱스/ETF",
    bond: "채권",
    reit: "리츠",
    cash: "현금성",
    crypto: "암호화폐",
    commodity: "원자재",
    other: "기타",
  },
  asset_type_labels: {
    stock: "주식",
    etf: "ETF",
    bond: "채권",
    fund: "펀드",
    cash: "현금/예금",
    crypto: "암호화폐",
    real_estate: "부동산",
    other: "기타",
  },
  market_labels: {
    KR: "한국",
    JP: "일본",
    US: "미국",
    EU: "유럽",
    OTHER: "기타",
  },
};
