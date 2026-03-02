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
  dash_refresh_rates: string;
  dash_refresh_prices: string;
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
  chart_tag: string;
  chart_no_data: string;

  // ─── TopHoldingsTable ──────────────────────────────────────────────────────
  holdings_title: string;
  holdings_col_name: string;
  holdings_col_type: string;
  holdings_col_value: string;
  holdings_col_pnl: string;
  holdings_col_return: string;
  holdings_col_weight: string;
  holdings_show_all: (n: number) => string;
  holdings_show_top10: string;

  // ─── TagAnalysisCard ───────────────────────────────────────────────────────
  tag_title: string;
  tag_empty: string;
  tag_legend_target: string;
  tag_legend_normal: string;
  tag_legend_over: string;
  tag_legend_under: string;

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
  insight_tag_over: (
    label: string,
    pct: string,
    target: string,
    diff: string,
  ) => string;
  insight_tag_under: (
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
  guru_col_tag: string;
  guru_col_current: string;
  guru_col_guru_target: string;
  guru_col_diff: string;
  guru_col_amount: string;
  guru_top_holdings_title: (name: string) => string;
  guru_holdings_col_ticker: string;
  guru_holdings_col_name: string;
  guru_holdings_col_weight: string;
  guru_holdings_note: string;
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

  // ─── Settings Page ─────────────────────────────────────────────────────────
  settings_title: string;
  settings_display_currency_title: string;
  settings_display_currency_desc: string;
  settings_fx_title: string;
  settings_fx_refreshing: string;
  settings_fx_refresh: string;
  settings_fx_auto: string;
  settings_fx_time: (time: string) => string;
  settings_fx_cache_warn: (time: string) => string;
  settings_price_title: string;
  settings_price_refreshing: string;
  settings_price_refresh: string;
  settings_price_auto: string;
  settings_price_time: (time: string) => string;
  settings_price_cache_warn: (time: string) => string;
  settings_price_result: (updated: number, total: number) => string;
  settings_price_no_ticker: string;
  price_refresh_error: string;
  settings_target_title: string;
  settings_target_sum: (n: string) => string;
  settings_target_save: string;
  settings_target_saved: string;
  settings_data_title: string;
  settings_data_desc: string;
  settings_data_count: (n: number) => string;
  settings_data_reset: string;
  settings_data_reset_confirm: string;

  // ─── Asset Table ───────────────────────────────────────────────────────────
  at_col_name: string;
  at_col_market: string;
  at_col_tag: string;
  at_col_quantity: string;
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
  tag_labels: Record<string, string>;
  asset_type_labels: Record<string, string>;
  market_labels: Record<string, string>;
}
