export type Lang = "ko" | "en" | "ja" | "de";

/** Language display names for AI prompts */
export const LANG_NAMES: Record<Lang, string> = {
  ko: "Korean (한국어)",
  en: "English",
  ja: "Japanese (日本語)",
  de: "German (Deutsch)",
};

/** BCP-47 locale codes per Lang */
export const LANG_LOCALES: Record<Lang, string> = {
  ko: "ko-KR",
  en: "en-US",
  ja: "ja-JP",
  de: "de-DE",
};

export interface Translations {
  // ─── App / Navigation ──────────────────────────────────────────────────────
  nav_dashboard: string;
  nav_assets: string;
  nav_gurus: string;
  nav_settings: string;
  nav_about: string;
  app_tagline: string;
  app_version_info: string;

  // ─── About Page ───────────────────────────────────────────────────────────
  about_tagline: string;
  about_intro: string;
  about_features_title: string;
  about_feat1_title: string;
  about_feat1_desc: string;
  about_feat2_title: string;
  about_feat2_desc: string;
  about_feat3_title: string;
  about_feat3_desc: string;
  about_feat4_title: string;
  about_feat4_desc: string;
  about_feat5_title: string;
  about_feat5_desc: string;
  about_feat6_title: string;
  about_feat6_desc: string;
  about_privacy_title: string;
  about_privacy_desc: string;
  about_tech_title: string;
  about_links_live: string;
  about_links_github: string;
  about_disclaimer: string;

  // ─── Dashboard ─────────────────────────────────────────────────────────────
  dash_title: string;
  dash_empty_title: string;
  dash_empty_desc: string;
  dash_notice_storage: string;
  dash_notice_csv: string;
  dash_notice_mobile: string;
  dash_sample_btn: string;
  dash_sample_hint: string;
  dash_refresh: string;
  dash_refreshing: string;
  dash_updated_at: (time: string) => string;

  // ─── KPI Bar ───────────────────────────────────────────────────────────────
  kpi_total_value: string;
  kpi_pnl: string;
  kpi_cash_weight: string;
  kpi_fx_exposure: string;
  kpi_holdings_unit: string;
  kpi_asset_type_unit: string;

  // ─── Allocation Charts ─────────────────────────────────────────────────────
  chart_market: string;
  chart_category: string;
  chart_no_data: string;

  // ─── TopHoldingsTable ──────────────────────────────────────────────────────
  holdings_title: string;
  holdings_col_name: string;
  holdings_col_type: string;
  holdings_col_value: string;
  holdings_col_pnl: string;
  holdings_col_return: string;
  holdings_col_weight: string;  holdings_col_per: string;
  holdings_col_pbr: string;  holdings_show_all: (n: number) => string;
  holdings_show_top10: string;

  // ─── CategoryAnalysisCard ────────────────────────────────────────────────
  category_title: string;
  category_set_target: string;
  category_empty: string;
  category_legend_target: string;
  category_legend_normal: string;
  category_legend_over: string;
  category_legend_under: string;

  // ─── CurrencyExposureCard ──────────────────────────────────────────────────
  fx_title: string;
  fx_col_currency: string;
  fx_col_value: string;
  fx_col_weight: string;
  fx_col_rate: string;
  fx_scenario_title: string;

  // ─── RebalanceCard ─────────────────────────────────────────────────────────
  rebalance_title: string;
  rebalance_ok: string;
  rebalance_buy: string;
  rebalance_sell: string;

  // ─── InsightsPanel ─────────────────────────────────────────────────────────
  insights_title: string;
  insights_ok: string;
  insights_ai_btn: string;
  insights_ai_copy: string;
  insights_ai_copied: string;
  insights_ai_desc: string;
  insights_ai_close: string;
  insights_ai_banner_title: string;
  insights_ai_banner_desc: string;
  insight_concentration: (name: string, pct: string) => string;
  insight_big_loss: (name: string, pct: string) => string;
  insight_cash_high: (pct: string) => string;
  insight_cash_low: (pct: string) => string;
  insight_fx_high: (currency: string, pct: string) => string;
  insight_category_over: (
    label: string,
    pct: string,
    target: string,
    diff: string,
  ) => string;
  insight_category_under: (
    label: string,
    pct: string,
    target: string,
    diff: string,
  ) => string;

  // ─── Assets Page ───────────────────────────────────────────────────────────
  asset_title: string;
  asset_btn_ai: string;
  asset_ai_banner_title: string;
  asset_ai_banner_desc: string;
  asset_btn_import_csv: string;
  asset_btn_export_csv: string;
  asset_btn_add: string;
  asset_modal_add: string;
  asset_modal_edit: string;
  asset_delete_confirm: string;
  asset_ai_modal_title: string;
  asset_ai_tab_generate: string;
  asset_ai_tab_import: string;
  asset_ai_copy_desc: string;
  asset_ai_tab_link: string;
  asset_ai_copy: string;
  asset_ai_copied: string;
  asset_ai_close: string;
  asset_ai_import_desc: string;
  asset_ai_format_label: string;
  asset_ai_json_placeholder: string;
  asset_ai_apply_btn: string;
  asset_ai_apply_result: (applied: number, skipped: number) => string;
  asset_ai_parse_error: string;
  exchange_rate_error: string;
  asset_ai_copy_link_pre: string;
  asset_ai_copy_link_post: string;
  asset_ai_import_btn_suffix: string;
  csv_preview_title: (n: number) => string;
  csv_preview_confirm: string;
  csv_preview_more: (n: number) => string;

  // ─── Gurus Page ────────────────────────────────────────────────────────────
  guru_title: string;
  guru_empty_title: string;
  guru_empty_desc: string;
  guru_philosophy_title: (name: string) => string;
  guru_ideal_alloc: (name: string) => string;
  guru_radar_title: string;
  guru_my_portfolio: string;
  guru_rebalance_title: (name: string) => string;
  guru_col_category: string;
  guru_col_current: string;
  guru_col_guru_target: string;
  guru_col_diff: string;
  guru_col_amount: string;
  guru_ai_banner_title: string;
  guru_ai_banner_desc: string;
  guru_ai_btn: string;
  guru_ai_close: string;
  guru_ai_desc: string;
  guru_ai_copy: string;
  guru_ai_copied: string;
  guru_ai_followup_btn: string;
  guru_ai_followup_desc: string;
  guru_ai_followup_new_session: string;
  guru_ai_followup_new_session_confirm: string;
  guru_ai_session_saved: string;
  guru_name_buffett: string;
  guru_name_munger: string;
  guru_name_lynch: string;
  guru_name_graham: string;
  guru_name_dalio: string;
  guru_name_lilu: string;
  guru_name_ackman: string;
  guru_name_burry: string;
  guru_name_fisher: string;
  guru_name_cohen: string;
  guru_name_marks: string;
  guru_name_klarman: string;
  guru_name_templeton: string;
  guru_name_soros: string;
  guru_name_wood: string;
  guru_name_druckenmiller: string;
  guru_name_smith: string;
  guru_name_greenblatt: string;
  guru_name_piotroski: string;
  guru_name_oneil: string;
  guru_philosophy_buffett: string;
  guru_philosophy_munger: string;
  guru_philosophy_lynch: string;
  guru_philosophy_graham: string;
  guru_philosophy_dalio: string;
  guru_philosophy_lilu: string;
  guru_philosophy_ackman: string;
  guru_philosophy_burry: string;
  guru_philosophy_fisher: string;
  guru_philosophy_cohen: string;
  guru_philosophy_marks: string;
  guru_philosophy_klarman: string;
  guru_philosophy_templeton: string;
  guru_philosophy_soros: string;
  guru_philosophy_wood: string;
  guru_philosophy_druckenmiller: string;
  guru_philosophy_smith: string;
  guru_philosophy_greenblatt: string;
  guru_philosophy_piotroski: string;
  guru_philosophy_oneil: string;

  // ─── Lynch 10-Bagger Analyzer ───────────────────────────────────────────────
  lynch_tenbagger_title: string;
  lynch_tenbagger_desc: string;
  lynch_criterion_peg: string;
  lynch_criterion_eps: string;
  lynch_criterion_rev: string;
  lynch_criterion_debt: string;
  lynch_criterion_margin: string;
  lynch_criterion_cap: string;
  lynch_no_data: string;
  lynch_disclaimer: string;
  lynch_progress_enrich: (done: number, total: number) => string;
  lynch_phase_enrich: string;
  lynch_no_result: string;
  lynch_tenbagger_badge: string;
  lynch_initial_guide: string;

  // ─── Analyzer Common (mode tabs) ────────────────────────────────────────────
  analyzer_mode_portfolio: string;
  analyzer_mode_search: string;
  analyzer_portfolio_desc: (count: number) => string;
  analyzer_btn_portfolio: string;
  analyzer_btn_search: string;
  analyzer_search_placeholder: string;

  // ─── Magic Formula Analyzer ──────────────────────────────────────────────────
  mf_title: string;
  mf_desc: string;
  mf_criterion_ey: string;
  mf_criterion_roc: string;
  mf_criterion_margin: string;
  mf_criterion_debt: string;
  mf_criterion_cap: string;
  mf_no_data: string;
  mf_disclaimer: string;
  mf_progress_enrich: (done: number, total: number) => string;
  mf_phase_enrich: string;
  mf_no_result: string;
  mf_magic_badge: string;
  mf_initial_guide: string;
  // ─── Graham Defensive Analyzer ───────────────────────────────────────────────────────────
  graham_analyzer_title: string;
  graham_analyzer_desc: string;
  graham_criterion_pe: string;
  graham_criterion_pb: string;
  graham_criterion_gn: string;
  graham_criterion_cr: string;
  graham_criterion_debt: string;
  graham_criterion_div: string;
  graham_no_data: string;
  graham_disclaimer: string;
  graham_progress_enrich: (done: number, total: number) => string;
  graham_phase_enrich: string;
  graham_no_result: string;
  graham_defensive_badge: string;
  graham_initial_guide: string;

  // ─── Smith Quality Compounder Analyzer ─────────────────────────────────────────────────────
  smith_analyzer_title: string;
  smith_analyzer_desc: string;
  smith_criterion_roe: string;
  smith_criterion_margin: string;
  smith_criterion_fcf: string;
  smith_criterion_rev: string;
  smith_criterion_debt: string;
  smith_no_data: string;
  smith_disclaimer: string;
  smith_progress_enrich: (done: number, total: number) => string;
  smith_phase_enrich: string;
  smith_no_result: string;
  smith_quality_badge: string;
  smith_initial_guide: string;

  // ─── Piotroski F-Score Analyzer ─────────────────────────────────────────────────────
  piotroski_analyzer_title: string;
  piotroski_analyzer_desc: string;
  piotroski_criterion_roa: string;
  piotroski_criterion_cfo: string;
  piotroski_criterion_delta_roa: string;
  piotroski_criterion_accruals: string;
  piotroski_criterion_delta_leverage: string;
  piotroski_criterion_delta_liquidity: string;
  piotroski_criterion_equity_dilution: string;
  piotroski_criterion_delta_margin: string;
  piotroski_criterion_delta_turnover: string;
  piotroski_no_data: string;
  piotroski_disclaimer: string;
  piotroski_progress_enrich: (done: number, total: number) => string;
  piotroski_phase_enrich: string;
  piotroski_no_result: string;
  piotroski_fscore_badge: string;
  piotroski_initial_guide: string;

  // ─── O'Neil CAN SLIM Analyzer ─────────────────────────────────────────────────────
  oneil_analyzer_title: string;
  oneil_analyzer_desc: string;
  oneil_criterion_current: string;
  oneil_criterion_annual: string;
  oneil_criterion_newhigh: string;
  oneil_criterion_supply: string;
  oneil_criterion_leader: string;
  oneil_criterion_institutional: string;
  oneil_criterion_cap: string;
  oneil_no_data: string;
  oneil_disclaimer: string;
  oneil_progress_enrich: (done: number, total: number) => string;
  oneil_phase_enrich: string;
  oneil_no_result: string;
  oneil_canslim_badge: string;
  oneil_initial_guide: string;

  // ─── Buffett Indicator ────────────────────────────────────────────────────
  buffett_indicator_title: string;
  buffett_indicator_subtitle: string;
  buffett_indicator_ratio_label: string;
  buffett_indicator_market_cap: string;
  buffett_indicator_gdp: string;
  buffett_indicator_year: string;
  buffett_indicator_loading: string;
  buffett_indicator_error: string;
  buffett_indicator_status_deep_under: string;
  buffett_indicator_status_under: string;
  buffett_indicator_status_fair: string;
  buffett_indicator_status_over: string;
  buffett_indicator_status_deep_over: string;
  buffett_indicator_source: string;
  buffett_indicator_desc: string;

  // ─── Settings Page ─────────────────────────────────────────────────────────
  settings_title: string;
  settings_display_currency_title: string;
  settings_display_currency_desc: string;
  settings_fx_title: string;
  settings_fx_cache_warn: (time: string) => string;
  settings_data_refresh_title: string;
  settings_data_refresh_refreshing: string;
  settings_data_refresh_refresh: string;
  settings_data_refresh_auto: string;
  settings_data_refresh_time: (time: string) => string;
  settings_data_refresh_cache_warn: (time: string) => string;
  settings_data_refresh_result: (updated: number, total: number) => string;
  settings_data_refresh_no_ticker: string;
  data_refresh_error: string;
  data_refresh_partial_fail: (names: string[]) => string;

  // ─── Google Drive Sync ────────────────────────────────────────────────────
  drive_title: string;
  drive_desc: string;
  drive_connect: string;
  drive_disconnect: string;
  drive_connected: string;
  drive_syncing: string;
  drive_saving: string;
  drive_synced_at: (time: string) => string;
  drive_sync_now: string;
  drive_save_to_drive: string;
  drive_load_from_drive: string;
  drive_no_client_id: string;
  drive_error_prefix: string;
  drive_conflict_title: string;
  drive_conflict_desc: (driveTime: string, localTime: string) => string;
  drive_use_drive: string;
  drive_use_local: string;
  drive_error_no_client_id: string;
  drive_error_gis_not_loaded: string;
  settings_target_title: string;
  settings_target_sum: (n: string) => string;
  settings_target_save: string;
  settings_target_saved: string;
  settings_data_title: string;
  settings_data_local_title: string;
  settings_data_desc: string;
  settings_data_count: (n: number) => string;
  settings_data_reset: string;
  settings_data_reset_confirm: string;
  settings_data_drive_title: string;
  settings_data_drive_note: string;

  // ─── Profile Section ───────────────────────────────────────────────────────
  profile_title: string;
  profile_desc: string;
  profile_nickname_label: string;
  profile_nickname_placeholder: string;
  profile_age_label: string;
  profile_age_placeholder: string;
  profile_annual_income_label: string;
  profile_annual_income_placeholder: string;
  profile_monthly_budget_label: string;
  profile_monthly_budget_placeholder: string;
  profile_plan3y_label: string;
  profile_plan3y_placeholder: string;
  profile_plan5y_label: string;
  profile_plan5y_placeholder: string;
  profile_plan10y_label: string;
  profile_plan10y_placeholder: string;
  profile_notes_label: string;
  profile_notes_placeholder: string;
  profile_save: string;
  profile_saved: string;

  // ─── Asset Table ───────────────────────────────────────────────────────────
  at_col_name: string;
  at_col_market: string;
  at_col_category: string;
  at_col_quantity: string;
  at_col_avg_buy_price: string;
  at_col_current_price: string;
  at_col_value: string;
  at_col_pnl: string;
  at_col_return: string;
  at_col_weight: string;
  at_col_actions: string;
  at_empty_title: string;
  at_empty_desc: string;
  at_btn_edit: string;
  at_btn_delete: string;
  at_unclassified: string;
  at_filter_all_market: string;
  at_filter_all_type: string;
  at_filter_all_category: string;
  at_filter_clear: string;
  at_filter_count: (shown: number, total: number) => string;
  at_filter_no_result: string;

  // ─── Portfolio History Chart ───────────────────────────────────────────────
  history_title: string;
  history_value: string;
  history_cost: string;
  history_no_data: string;

  // ─── PnL Waterfall Chart ──────────────────────────────────────────────────
  pnl_chart_title: string;
  pnl_chart_pnl: string;
  pnl_chart_profit: string;
  pnl_chart_loss: string;
  pnl_chart_top12: string;

  // ─── Asset Form ────────────────────────────────────────────────────────────
  af_mode_stock: string;
  af_mode_cash: string;
  af_mode_crypto: string;
  af_mode_manual: string;
  af_search_hint: string;
  af_search_placeholder: string;
  af_search_btn: string;
  af_searching: string;
  af_results_count: (n: number) => string;
  af_no_results: string;
  af_manual_hint: string;
  af_name_label: string;
  af_ticker_label: string;
  af_asset_type_label: string;
  af_market_label: string;
  af_currency_label: string;
  af_quantity_label: string;
  af_avg_price_label: string;
  af_current_price_label: string;
  af_current_price_auto: string;
  af_fetch_price_btn: string;
  af_fetching: string;
  af_currency_placeholder: string;
  af_currency_no_result: string;
  af_back_to_search: string;
  af_re_search: string;
  af_btn_cancel: string;
  af_btn_submit: string;
  af_manual_name_placeholder: string;
  af_manual_ticker_placeholder: string;
  af_manual_link: string;
  af_cash_amount_label: string;
  af_crypto_hint: string;
  af_crypto_search_btn: string;
  af_crypto_searching: string;
  af_crypto_pair_title: string;
  af_crypto_no_pairs: string;
  af_crypto_selected: string;
  af_crypto_select: string;
  af_buy_price_label: string;
  af_current_price_placeholder: string;
  /** 계좌 선택 셀렉트박스 */
  af_account_label: string;
  af_account_none: string;

  // ─── Broker Account Manager ───────────────────────────────────────────────
  broker_manage_btn: string;
  broker_title: string;
  broker_add_btn: string;
  broker_edit_btn: string;
  broker_save_btn: string;
  broker_delete_btn: string;
  broker_cancel_btn: string;
  broker_empty: string;
  broker_country_label: string;
  broker_name_label: string;
  broker_type_label: string;
  broker_nickname_label: string;
  broker_name_placeholder: string;
  broker_type_placeholder: string;
  broker_nickname_placeholder: string;
  broker_delete_confirm: string;
  broker_col_nickname: string;
  broker_col_broker: string;
  broker_col_type: string;
  broker_col_country: string;

  // ─── Type / Market / Currency option labels ────────────────────────────────
  atype_stock: string;
  atype_etf: string;
  atype_fund: string;
  atype_bond: string;
  atype_other: string;
  atype_crypto: string;
  atype_cash: string;
  market_jp: string;
  market_us: string;
  market_kr: string;
  market_eu: string;
  market_other: string;
  currency_jpy: string;
  currency_usd: string;
  currency_krw: string;
  currency_eur: string;

  // ─── Label maps (charts, dropdowns) ───────────────────────────────────────
  category_labels: Record<string, string>;
  asset_type_labels: Record<string, string>;
  market_labels: Record<string, string>;
}
