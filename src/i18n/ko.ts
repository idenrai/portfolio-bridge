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
  asset_ai_modal_title: "🤖 AI 분류",
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
    'AI 응답 JSON을 여기에 붙여 넣으세요...\n\n예시:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "..." },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "..." }\n]',
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
  csv_preview_more: (n) => `... 외 ${n}행`,

  guru_title: "투자 구루",
  guru_empty_title: "투자 구루 분석",
  guru_empty_desc: "자산을 등록한 후 구루와 비교 분석을 할 수 있습니다.",
  guru_philosophy_title: (name) => `${name}의 투자 철학`,
  guru_ideal_alloc: (name) => `${name}의 이상적 배분`,
  guru_radar_title: "내 포트폴리오 vs 구루 비교",
  guru_my_portfolio: "내 포트폴리오",
  guru_rebalance_title: (name) => `${name} 기준 리밸런싱 제안`,
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
    "• 장기 보유: 이해할 수 있는 사업을 합리적 가격에 매수하여 10년 이상 보유\n" +
    "• 배당 성장 & 자사주 매입: 꾸준한 주주환원 정책을 중시\n" +
    "• 능력 범위(Circle of Competence): 본인이 잘 아는 산업에만 투자\n" +
    "• 현금 보유: 좋은 기회를 위해 항상 상당한 현금을 확보\n" +
    "• 명언: '규칙 1: 절대 돈을 잃지 마라. 규칙 2: 규칙 1을 절대 잊지 마라.'",
  guru_philosophy_munger:
    "• 집중 투자: 소수의 뛰어난 기업에 대한 강한 확신이 있을 때만 대규모 투자\n" +
    "• 멘탈 모델(다학제적 사고): 심리학, 물리학, 경제학 등 여러 분야의 프레임워크 활용\n" +
    "• 인내심: '아무것도 하지 않는 것'이 최선인 경우가 많다고 강조\n" +
    "• 역발상적 사고: 남들이 탐욕적일 때 두려워하고, 두려워할 때 탐욕적으로\n" +
    "• 회피의 기술: 나쁜 투자를 피하는 것이 좋은 투자를 찾는 것보다 중요\n" +
    "• 명언: '뒤집어 생각하라. 항상 뒤집어 생각하라(Invert, always invert).'",
  guru_philosophy_lynch:
    "• 일상 속 투자 아이디어: 생활에서 성장하는 제품·서비스를 발견하고 투자\n" +
    "• PEG 비율: 주가수익비율(PER)을 이익 성장률로 나눠 적정 밸류에이션 판단\n" +
    "• 텐배거(Tenbagger) 추구: 10배 이상 수익을 낼 수 있는 성장주 발굴\n" +
    "• 광범위한 분산: 수십~수백 종목에 분산 투자하여 리스크 관리\n" +
    "• 철저한 리서치: 기업 방문, 재무제표 분석 등 직접 조사를 중시\n" +
    "• 명언: '무엇을 왜 보유하는지 스스로 명확히 설명할 수 있어야 한다.'",
  guru_philosophy_graham:
    "• 안전마진(Margin of Safety): 내재가치 대비 충분히 할인된 가격에서만 매수\n" +
    "• 방어적 투자: 원금 보전을 최우선으로 하는 보수적 접근\n" +
    "• 주식-채권 균형 배분: 주식 25~75%, 나머지 채권으로 시장 상황에 따라 조절\n" +
    "• 정량적 분석: 감정 배제, 재무 데이터 기반의 냉철한 기업 평가\n" +
    "• 시장은 '투표기'가 아닌 '저울': 장기적으로 기업의 본질 가치가 반영됨\n" +
    "• 명언: '투자자의 가장 큰 문제는—그리고 최악의 적은—대부분 자기 자신이다.'",
  guru_philosophy_dalio:
    "• 올웨더(All Weather) 전략: 경제 사이클(성장/둔화 × 인플레/디플레)에 대비\n" +
    "• 리스크 패리티: 자산군별 리스크 기여도를 균등하게 배분\n" +
    "• 광범위한 분산: 주식, 채권, 금, 원자재 등 상관관계 낮은 자산에 분산 투자\n" +
    "• 원칙(Principles): 체계적인 의사결정 프로세스와 조직 원칙 확립\n" +
    "• 경기 순환 이해: 단기 부채 사이클과 장기 부채 사이클을 분석하여 대응\n" +
    "• 명언: '수정 구슬에 기대어 사는 자는 결국 깨진 유리를 씹게 된다.'",
  guru_philosophy_lilu:
    "• 버핏-멍거 접근의 아시아 적용: 가치 투자 원칙을 중국·아시아 시장에 맞게 실행\n" +
    "• 깊은 기업 분석: 비즈니스 모델의 본질과 장기 경쟁력을 철저히 파악\n" +
    "• 초집중 포트폴리오: 높은 확신이 있는 소수 종목에 대규모 투자\n" +
    "• 장기 보유: 5~10년 이상의 초장기 투자 관점\n" +
    "• 지적 정직함: 자신의 무지를 인정하고 능력 범위 내에서만 투자\n" +
    "• 명언: '투자의 가장 큰 위험은 가격 변동성이 아니라 영구적 자본 손실이다.'",
  guru_philosophy_ackman:
    "• 행동주의 투자(Activist Investing): 기업 경영에 적극 개입하여 가치를 끌어올림\n" +
    "• 집중 포트폴리오: 5~10개 우량 기업에 대규모 집중 투자\n" +
    "• 사업 모델 분석: 심플하고 예측 가능한 현금 흐름을 가진 기업 선호\n" +
    "• 비대칭 보상(Asymmetric Risk-Reward): 하방 리스크 대비 상방 잠재력이 큰 기회 추구\n" +
    "• 매크로 헤지: 극단적 시나리오에 대비한 방어적 포지션 활용\n" +
    "• 명언: '집중은 부를 만들고, 분산은 부를 지킨다.'",
  guru_philosophy_burry:
    "• 역발상 투자: 시장 다수의 의견에 반대되는 포지션을 취하는 것을 주저하지 않음\n" +
    "• 가치 기반 분석: 기업의 내재가치와 자산가치를 정밀하게 계산\n" +
    "• 매크로 베팅: 거시경제 추세와 시장 거품을 분석하여 큰 방향성 베팅\n" +
    "• 독립적 사고: 군중 심리에 휩쓸리지 않고 자신만의 분석에 근거\n" +
    "• 높은 현금 비중: 확실한 기회가 올 때까지 인내하며 현금을 보유\n" +
    "• 명언: '나는 일찍 틀린 것이 아니라, 일찍 맞았을 뿐이다(I may be early, but I'm not wrong).'",
  guru_philosophy_fisher:
    "• 글로벌 매크로: 세계 경제 흐름과 시장 사이클을 분석하여 자산 배분 결정\n" +
    "• 투자 심리 역이용: 투자자들의 과도한 낙관·비관을 수익 기회로 활용\n" +
    "• 장기 주식 비중 확대: 주식이 장기적으로 타 자산 대비 높은 수익을 제공한다고 확신\n" +
    "• 광범위한 글로벌 분산: 특정 국가에 편중하지 않고 전 세계에 분산 투자\n" +
    "• 3가지 질문: 시장이 아는 것, 모르는 것, 착각하는 것을 구별하여 투자\n" +
    "• 명언: '시장은 늘 걱정의 벽을 타고 오른다(Markets climb a wall of worry).'",
  guru_philosophy_cohen:
    "• 멀티 매니저 모델: 다수의 투자 전략과 매니저를 병행 운영\n" +
    "• 리스크 관리 최우선: 포지션별 손절선과 전체 포트폴리오 리스크를 엄격 관리\n" +
    "• 단기~중기 거래: 빠른 의사결정과 포지션 회전을 통한 수익 추구\n" +
    "• 정보 우위: 철저한 리서치와 데이터 분석에 기반한 투자 결정\n" +
    "• 유연한 전략: 롱/숏, 이벤트 드리븐, 퀀트 등 다양한 전략 활용\n" +
    "• 명언: '중요한 것은 예측의 정확도보다, 손실을 통제하는 리스크 관리다.'",
  guru_philosophy_marks:
    "• 시장 사이클 이론: 시장의 주기적 진자 운동을 이해하고 현재 위치를 파악\n" +
    "• 2차적 사고(Second-Level Thinking): 남들과 다르고 더 나은 사고를 추구\n" +
    "• 디스트레스드 투자: 부실채권·위기 자산에서 높은 수익률 기회 포착\n" +
    "• 리스크 = 영구적 손실: 변동성이 아닌 영구적 자본 손실을 진정한 리스크로 정의\n" +
    "• 방어적 투자: 좋은 시기에 최대 수익보다, 나쁜 시기에 손실을 줄이는 데 집중\n" +
    "• 명언: '우리는 미래를 예측할 수는 없지만, 미래에 대비할 수는 있다.'",
  guru_philosophy_klarman:
    "• 안전마진 계승: 그레이엄의 안전마진 철학을 현대 시장에 적용\n" +
    "• 절대 수익 추구: 벤치마크 대비 상대 수익이 아닌 절대 수익에 집중\n" +
    "• 높은 현금 비중: 좋은 기회가 없을 때는 현금 비중을 50%까지 높이는 것도 마다하지 않음\n" +
    "• 시장 공포 활용: 위기 시 남들이 팔 때 저평가 자산을 적극 매수\n" +
    "• 하방 보호 최우선: 수익 극대화보다 원금 보전을 더 중시\n" +
    "• 명언: '가치투자는 역발상 성향과 계산기의 결합이다.'",
  guru_philosophy_templeton:
    "• 글로벌 역발상: '비관의 극점(Point of Maximum Pessimism)'에서 매수\n" +
    "• 국경 없는 투자: 전 세계 시장에서 저평가된 기회를 탐색\n" +
    "• 장기 가치 투자: 5~10년 이상의 장기 보유를 통해 기업 가치 실현을 기대\n" +
    "• 정량적 스크리닝: 낮은 PER, PBR 등 계량 지표를 활용한 종목 선별\n" +
    "• 겸손한 투자: 시장을 이기려 하기보다, 시장의 실수를 활용하는 자세\n" +
    "• 명언: '비관이 극에 달했을 때가 최고의 매수 시점이다.'",
  guru_philosophy_soros:
    "• 재귀성 이론(Reflexivity): 시장 참여자의 인식이 현실을 변화시키는 되먹임 루프\n" +
    "• 대규모 방향성 베팅: 확신이 있을 때 통화·채권·주식에 걸친 거대한 포지션\n" +
    "• 글로벌 매크로: 정치, 경제, 사회적 변화를 읽고 거시적 투자 기회 포착\n" +
    "• 빠른 손절: 가설이 틀렸다고 판단되면 즉시 포지션 청산\n" +
    "• 시장 불안정성 활용: 시장의 불균형과 비효율에서 수익 기회를 발굴\n" +
    "• 명언: '맞고 틀리고보다, 맞았을 때 얼마나 벌고 틀렸을 때 얼마나 잃는지가 중요하다.'",
  guru_philosophy_wood:
    "• 파괴적 혁신(Disruptive Innovation): 5~10년 후 세상을 바꿀 기술에 집중 투자\n" +
    "• 핵심 테마: AI, 로보틱스, 에너지 저장, 유전체학, 블록체인의 5대 혁신 플랫폼\n" +
    "• 장기 성장 투자: 단기 변동성을 감수하고 장기적 성장 잠재력에 베팅\n" +
    "• 적극적 리서치: 자체 리서치 팀의 독자적인 미래 전망과 가격 모델링\n" +
    "• 투명한 운용: 매일 매매 내역을 공개하는 등 투명한 펀드 운용\n" +
    "• 명언: '혁신은 문제를 해결하고, 완전히 새로운 시장 기회를 만든다.'",

  guru_philosophy_druckenmiller:
    "• 매크로 트레이딩의 대가: 통화·금리·주식의 상관관계를 읽어 방향성 포지션을 크게 가져감\n" +
    "• 소로스의 수제자: 퀀텀 펀드에서 검증된 전략을 계승·발전시켜 장기적으로 높은 복리 수익을 기록\n" +
    "• 고확신 집중 베팅: 확신이 큰 아이디어에는 과감히 비중을 싣고, 애매한 포지션은 줄임\n" +
    "• 추세 추종 + 빠른 전환: 추세에는 강하게 올라타되 신호가 꺾이면 지체 없이 포지션을 바꿈\n" +
    "• 비대칭 리스크 관리: 손실은 짧게 끊고 수익 구간은 길게 가져가 기대값을 높임\n" +
    "• 명언: '장기 수익률을 만드는 길은 자본 보전과 홈런이다.'",
  guru_philosophy_smith:
    "• 우량 기업 장기 보유: '좋은 기업을 사고, 비싸게 사지 말고, 쓸데없이 매매하지 마라'라는 원칙\n" +
    "• 높은 ROIC 중시: 투하자본수익률이 지속적으로 높은 기업만 선별해 장기 복리 성장을 추구\n" +
    "• 집중 포트폴리오: 약 25~30개 핵심 종목에 집중해 아이디어의 질로 성과를 만든다는 철학\n" +
    "• 품질 우선: 단순 저평가보다 사업의 질·현금창출력·경영 효율성을 더 높게 평가\n" +
    "• 복리 메커니즘: 내부 재투자 수익률이 높은 기업을 오래 보유해 복리 효과를 극대화\n" +
    "• 명언: '리스크를 줄이겠다며 무작정 분산하는 접근에는 동의하지 않는다. 보유한다면 최고의 기업을 보유하라.'",
  guru_philosophy_greenblatt:
    "• 마법 공식(Magic Formula): 높은 이익수익률(Earnings Yield)과 높은 자본수익률(ROIC)을 함께 갖춘 종목을 선별\n" +
    "• 정량 기반 가치 투자: 감정을 배제하고 규칙에 따라 기계적으로 집행하는 시스템형 접근\n" +
    "• 소외된 우량주 발굴: 시장이 무관심한 저평가·고품질 기업을 체계적으로 찾아냄\n" +
    "• 분산 운용: 20~30개 종목으로 개별 종목 리스크를 낮추면서 전략의 일관성을 유지\n" +
    "• 인내가 핵심: 전략이 유효해도 3~4년가량 시장 대비 부진할 수 있음을 전제로 운용\n" +
    "• 명언: '가치를 먼저 계산하고, 그보다 훨씬 싼 가격에 사라. 단기 시장은 미스터 마켓의 감정에 흔들린다.'",
  guru_philosophy_piotroski:
    "• F-Score(피오트로스키 스코어): 9가지 이진 재무 기준으로 기업의 재무 건전성을 0~9점으로 평가\n" +
    "• 가치주 필터링: 장부가 대비 저평가된 종목 중 재무 체질이 우수한 기업만 선별\n" +
    "• 수익성 평가: ROA, 영업현금흐름, 발생주의 품질(현금흐름 > 순이익) 등 수익의 질을 측정\n" +
    "• 재무 건전성: 부채 감소, 유동비율 개선, 주식 희석 여부로 재무 안정성을 확인\n" +
    "• 운영 효율성: 매출총이익률 향상, 자산 회전율 개선으로 경영 효율을 판단\n" +
    "• 명언: '높은 BM(장부가 대비 시가) 기업 중 재무가 탄탄한 종목이 연평균 7.5%p 초과 수익을 낸다.'",
  guru_philosophy_oneil:
    "• CAN SLIM 시스템: 7가지 성장주 선별 기준을 체계적으로 적용하는 투자 방법론\n" +
    "• C(당기 실적): 최근 분기 EPS가 전년 동기 대비 25% 이상 성장한 종목을 선호\n" +
    "• A(연간 실적): 연간 EPS 성장률이 25% 이상이고 3~5년 지속 성장하는 기업을 추구\n" +
    "• N(신제품·신고가): 혁신적 제품/서비스를 보유하고 52주 신고가 부근에서 매수\n" +
    "• S·L·I·M: 수급(유통주식 수), 선도주 여부, 기관 매수, 시장 방향성을 종합적으로 판단\n" +
    "• 명언: '주식 시장에서 이기는 비결은, 틀렸을 때 최대한 적게 잃는 것이다.'",

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
  lynch_no_result: "⚠️ Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
  mf_no_result: "⚠️ Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
  graham_no_result: "⚠️ Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
  smith_no_result: "⚠️ Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
  piotroski_no_result: "⚠️ Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
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
  oneil_no_result: "⚠️ Yahoo Finance에서 종목 데이터를 받지 못했습니다. 잠시 후 다시 시도해 주세요.",
  oneil_canslim_badge: "🚀 CAN SLIM 적합",
  oneil_initial_guide: "포트폴리오 분석 또는 티커 검색으로 채점을 시작하세요.",

  settings_title: "설정",
  settings_display_currency_title: "표시 화폐",
  settings_display_currency_desc:
    "대시보드 금액을 표시할 기준 통화를 선택합니다.",
  settings_fx_title: "환율",
  settings_fx_cache_warn: (time) =>
    `⚠️ 환율 조회 실패 — 캐시값 사용 중 (${time} 기준)`,
  settings_data_refresh_title: "환율 · 시세 갱신",
  settings_data_refresh_refreshing: "조회 중…",
  settings_data_refresh_refresh: "🔄 지금 갱신",
  settings_data_refresh_auto: "앱 시작 시 자동 조회됩니다.",
  settings_data_refresh_time: (time) => `${time} 기준`,
  settings_data_refresh_cache_warn: (time) =>
    `⚠️ 조회 실패 — 캐시값 사용 중 (${time} 기준)`,
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

  at_col_name: "종목",
  at_col_market: "시장",
  at_col_category: "분류",
  at_col_quantity: "수량",
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
  af_search_placeholder: "티커 또는 종목명...",
  af_search_btn: "검색",
  af_searching: "검색 중…",
  af_results_count: (n) => `검색 결과 ${n}건`,
  af_no_results: "검색 결과 없음",
  af_manual_hint:
    "Yahoo Finance에서 검색되지 않는 종목(투자신탁 등)을 직접 입력합니다.\nISIN 또는 심볼을 알고 있다면 입력 후 현재가 조회를 시도하세요.",
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
