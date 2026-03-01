import type { Translations } from "./types";

export const en: Translations = {
  nav_dashboard: "Dashboard",
  nav_assets: "Assets",
  nav_gurus: "Gurus",
  nav_settings: "Settings",
  app_tagline: "Multi-country asset management",
  app_version_info: "Browser storage",

  dash_title: "Dashboard",
  dash_empty_title: "Start your portfolio",
  dash_empty_desc:
    'Register your holdings in "Assets" and a summary will appear here.',
  dash_notice_storage:
    "💾 Data is stored only in this browser on this device. It does not sync across devices — please use the same device and browser.",
  dash_notice_csv:
    "📁 Asset data can be exported/imported as CSV files. Use this for backups or device migration.",
  dash_notice_mobile:
    "🖥️ Optimized for desktop browsers. Mobile screens are not currently supported.",
  dash_sample_btn: "📈 Explore with sample data",
  dash_sample_hint: "Sample data can be removed via Settings › Reset all data.",

  kpi_total_value: "Total Value",
  kpi_pnl: "Unrealized P&L",
  kpi_cash_weight: "Cash",
  kpi_fx_exposure: "FX Exposure",
  kpi_holdings_unit: "stocks",
  kpi_asset_type_unit: "asset types",

  chart_market: "By Market",
  chart_tag: "By Tag",
  chart_no_data: "No data",

  holdings_title: "Holdings",
  holdings_col_name: "Name",
  holdings_col_type: "Type",
  holdings_col_value: "Value",
  holdings_col_pnl: "P&L",
  holdings_col_return: "Return",
  holdings_col_weight: "Weight",
  holdings_show_all: (n) => `View all ${n}`,
  holdings_show_top10: "Top 10 only",

  tag_title: "Tag Target vs Actual",
  tag_empty: "Set target allocations in Settings.",
  tag_legend_target: "Target",
  tag_legend_normal: "Normal",
  tag_legend_over: "Over",
  tag_legend_under: "Under",

  fx_title: "FX Exposure & Scenario",
  fx_col_currency: "Currency",
  fx_col_value: "Value",
  fx_col_weight: "Weight",
  fx_col_rate: "Rate",
  fx_scenario_title: "±5% FX Scenario",

  rebalance_title: "Rebalance Suggestions",
  rebalance_ok: "✅ Allocation is close to target",
  rebalance_buy: "Buy",
  rebalance_sell: "Sell",

  insights_title: "Insights",
  insights_ok: "✅ No issues found",

  asset_title: "Assets",
  asset_btn_ai: "🤖 AI Classification Prompt",
  asset_btn_import_csv: "Import CSV",
  asset_btn_export_csv: "Export CSV",
  asset_btn_add: "+ Add Asset",
  asset_modal_add: "Add New Asset",
  asset_modal_edit: "Edit Asset",
  asset_delete_confirm: "Are you sure you want to delete this asset?",
  asset_ai_modal_title: "🤖 AI Classification",
  asset_ai_tab_generate: "① Generate Prompt",
  asset_ai_tab_import: "② Import AI Response",
  asset_ai_copy_desc:
    "Copy the prompt below and paste it into ChatGPT, Claude, or another AI.",
  asset_ai_tab_link: "② Import AI Response",
  asset_ai_copy: "Copy to Clipboard",
  asset_ai_copied: "✓ Copied!",
  asset_ai_close: "Close",
  asset_ai_import_desc: "Paste the JSON returned by the AI below and",
  asset_ai_apply_btn: "Apply Tags",
  asset_ai_apply_result: (applied, skipped) =>
    `✓ Tags applied to ${applied} assets.${skipped > 0 ? ` (${skipped} skipped)` : ""}`,
  asset_ai_parse_error: "Parse error",
  asset_ai_copy_link_pre: "When you get a response, go to the",
  asset_ai_copy_link_post: "tab to apply automatically.",
  asset_ai_import_btn_suffix: "and apply.",
  csv_preview_title: (n) => `CSV Preview — ${n} rows`,
  csv_preview_confirm: "Confirm import",
  csv_preview_more: (n) => `... and ${n} more rows`,

  guru_title: "Investment Gurus",
  guru_empty_title: "Guru Analysis",
  guru_empty_desc:
    "Register your assets to compare your portfolio against a guru.",
  guru_philosophy_title: (name) => `${name}'s Investment Philosophy`,
  guru_ideal_alloc: (name) => `${name}'s Ideal Allocation`,
  guru_radar_title: "My Portfolio vs Guru",
  guru_my_portfolio: "My Portfolio",
  guru_rebalance_title: (name) => `Rebalance Suggestions (${name})`,
  guru_col_tag: "Tag",
  guru_col_current: "Current",
  guru_col_guru_target: "Guru Target",
  guru_col_diff: "Diff",
  guru_col_amount: "Amount",
  guru_top_holdings_title: (name) => `${name}'s Top 5 Holdings`,
  guru_holdings_col_ticker: "Ticker",
  guru_holdings_col_name: "Name",
  guru_holdings_col_weight: "Weight",
  guru_holdings_note:
    "※ Based on public filings and disclosures. May not reflect current holdings.",
  guru_philosophy_buffett:
    "• Economic Moat: Focus on companies with durable competitive advantages and high barriers to entry\n" +
    "• Long-Term Holding: Buy understandable businesses at fair prices and hold for 10+ years\n" +
    "• Dividend Growth & Buybacks: Favor companies with consistent shareholder return policies\n" +
    "• Circle of Competence: Only invest in industries you truly understand\n" +
    "• Cash Reserves: Always maintain substantial cash to seize great opportunities",
  guru_philosophy_munger:
    "• Concentrated Investing: Make large bets only when highly confident in a few outstanding businesses\n" +
    "• Mental Models (Multidisciplinary Thinking): Leverage frameworks from psychology, physics, economics, and more\n" +
    "• Patience: Often the best move is to do nothing at all\n" +
    "• Contrarian Thinking: Be fearful when others are greedy, and greedy when others are fearful\n" +
    "• The Art of Avoidance: Avoiding bad investments matters more than finding great ones",
  guru_philosophy_lynch:
    "• Everyday Investment Ideas: Discover growing products and services in daily life\n" +
    "• PEG Ratio: Divide the P/E ratio by earnings growth rate to assess fair valuation\n" +
    "• Tenbagger Hunting: Seek stocks with the potential for 10x returns\n" +
    "• Broad Diversification: Spread risk across dozens to hundreds of stocks\n" +
    "• Thorough Research: Emphasize company visits and hands-on financial analysis",
  guru_philosophy_graham:
    "• Margin of Safety: Only buy at a significant discount to intrinsic value\n" +
    "• Defensive Investing: Prioritize capital preservation with a conservative approach\n" +
    "• Stock-Bond Balance: Allocate 25–75% to stocks, rest in bonds, adjust with market conditions\n" +
    "• Quantitative Analysis: Remove emotion; evaluate companies based on financial data\n" +
    '• The Market Is a "Weighing Machine": Long-term, stock prices reflect true business value',
  guru_philosophy_dalio:
    "• All Weather Strategy: Prepare for all economic regimes (growth/slowdown × inflation/deflation)\n" +
    "• Risk Parity: Equalize risk contributions across asset classes\n" +
    "• Broad Diversification: Invest across stocks, bonds, gold, and commodities with low correlations\n" +
    "• Principles: Establish systematic decision-making and organizational principles\n" +
    "• Understanding Cycles: Analyze short-term and long-term debt cycles to guide decisions",
  guru_philosophy_lilu:
    "• Buffett-Munger Approach in Asia: Apply value investing principles to Chinese and Asian markets\n" +
    "• Deep Business Analysis: Thoroughly understand business models and long-term competitiveness\n" +
    "• Ultra-Concentrated Portfolio: Invest heavily in a small number of high-conviction ideas\n" +
    "• Long-Term Holding: Maintain 5–10+ year investment horizons\n" +
    "• Intellectual Honesty: Acknowledge the limits of your knowledge and stay within your circle",
  guru_philosophy_ackman:
    "• Activist Investing: Actively engage with company management to unlock value\n" +
    "• Concentrated Portfolio: Large-scale investments in 5–10 quality companies\n" +
    "• Business Model Analysis: Prefer simple, predictable cash flow businesses\n" +
    "• Asymmetric Risk-Reward: Seek opportunities with limited downside and large upside potential\n" +
    "• Macro Hedging: Use defensive positions to protect against extreme scenarios",
  guru_philosophy_burry:
    "• Contrarian Investing: Willingly take positions opposite to the market consensus\n" +
    "• Value-Based Analysis: Meticulously calculate intrinsic and asset values\n" +
    "• Macro Bets: Analyze macroeconomic trends and market bubbles for directional bets\n" +
    "• Independent Thinking: Rely on your own analysis without succumbing to herd mentality\n" +
    "• High Cash Position: Hold cash patiently until truly compelling opportunities arise",
  guru_philosophy_fisher:
    "• Global Macro: Analyze global economic trends and market cycles to guide asset allocation\n" +
    "• Exploiting Investor Sentiment: Use excessive optimism and pessimism as profit opportunities\n" +
    "• Long-Term Equity Overweight: Stocks deliver superior long-term returns over other assets\n" +
    "• Broad Global Diversification: Avoid country-specific concentration; invest worldwide\n" +
    "• Three Questions: Distinguish what the market knows, doesn't know, and wrongly believes",
  guru_philosophy_cohen:
    "• Multi-Manager Model: Operate multiple investment strategies and managers in parallel\n" +
    "• Risk Management First: Strictly manage per-position stop-losses and overall portfolio risk\n" +
    "• Short-to-Mid-Term Trading: Pursue returns through rapid decision-making and position turnover\n" +
    "• Information Edge: Investment decisions grounded in thorough research and data analysis\n" +
    "• Flexible Strategies: Employ long/short, event-driven, quantitative, and other approaches",
  guru_philosophy_marks:
    "• Market Cycle Theory: Understand the pendulum-like swings of markets and identify your position\n" +
    "• Second-Level Thinking: Think differently and better than the consensus\n" +
    "• Distressed Investing: Pioneer in distressed debt and crisis asset investing\n" +
    "• Risk = Permanent Loss: Define true risk as permanent capital loss, not volatility\n" +
    "• Defensive Investing: Focus on limiting losses in bad times over maximizing gains in good times",
  guru_philosophy_klarman:
    "• Margin of Safety Heir: Modernize Graham's margin of safety philosophy for today's markets\n" +
    "• Absolute Returns: Focus on absolute returns rather than relative benchmark performance\n" +
    "• High Cash Reserves: Willingly hold up to 50% cash when no compelling opportunities exist\n" +
    "• Capitalize on Fear: Aggressively buy undervalued assets during market panics\n" +
    "• Downside Protection First: Prioritize capital preservation over return maximization",
  guru_philosophy_templeton:
    "• Global Contrarian: Buy at the 'Point of Maximum Pessimism'\n" +
    "• Borderless Investing: Search for undervalued opportunities across all global markets\n" +
    "• Long-Term Value Investing: Hold for 5–10+ years, waiting for intrinsic value realization\n" +
    "• Quantitative Screening: Use low P/E, P/B and other metrics to screen candidates\n" +
    "• Humble Investing: Exploit market mistakes rather than trying to beat the market",
  guru_philosophy_soros:
    "• Reflexivity Theory: Market participants' perceptions alter reality in feedback loops\n" +
    "• Massive Directional Bets: Take enormous positions across currencies, bonds, and equities when conviction is high\n" +
    "• Global Macro: Read political, economic, and social shifts for macro investment opportunities\n" +
    "• Quick Stop-Losses: Exit positions immediately when the thesis proves wrong\n" +
    "• Exploiting Market Instability: Find profit opportunities in market imbalances and inefficiencies",
  guru_philosophy_wood:
    "• Disruptive Innovation: Concentrate on technologies that will transform the world in 5–10 years\n" +
    "• Five Key Themes: AI, robotics, energy storage, genomics, and blockchain innovation platforms\n" +
    "• Long-Term Growth Investing: Accept short-term volatility; bet on long-term growth potential\n" +
    "• Proactive Research: Proprietary future forecasts and price modeling by in-house research teams\n" +
    "• Transparent Management: Publicly disclose daily trades for full fund transparency",

  settings_title: "Settings",
  settings_display_currency_title: "Display Currency",
  settings_display_currency_desc:
    "Select the base currency for displaying portfolio values.",
  settings_fx_title: "Exchange Rates (auto-fetched from Yahoo Finance)",
  settings_fx_refreshing: "Fetching…",
  settings_fx_refresh: "🔄 Refresh Now",
  settings_fx_auto: "Rates are fetched automatically on app start.",
  settings_fx_time: (time) => `As of ${time}`,
  settings_fx_cache_warn: (time) => `⚠️ Rate fetch failed — using cached value (as of ${time})`,
  settings_target_title: "Target Allocation",
  settings_target_sum: (n) => `Total: ${n}%`,
  settings_target_save: "Save",
  settings_data_title: "Data Management",
  settings_data_desc: "All data is stored in browser local storage.",
  settings_data_count: (n) => `Registered assets: ${n}`,
  settings_data_reset: "Reset All Data",
  settings_data_reset_confirm:
    "This will reset all data (assets, settings). This action cannot be undone.",

  at_col_name: "Name",
  at_col_market: "Market",
  at_col_tag: "Tag",
  at_col_quantity: "Qty",
  at_col_current_price: "Current Price",
  at_col_value: "Value",
  at_col_pnl: "P&L",
  at_col_return: "Return",
  at_col_actions: "Actions",
  at_empty_title: "No assets registered",
  at_empty_desc: 'Click the "Add Asset" button above to add your first asset.',
  at_btn_edit: "Edit",
  at_btn_delete: "Delete",
  at_unclassified: "Unclassified",

  af_mode_stock: "Search Ticker",
  af_mode_cash: "Cash / Deposit",
  af_mode_crypto: "Crypto",
  af_mode_manual: "Manual Entry",
  af_search_hint: "Enter a ticker or company name and search.",
  af_search_placeholder: "Ticker or name...",
  af_search_btn: "Search",
  af_searching: "Searching…",
  af_results_count: (n) => `${n} result${n !== 1 ? "s" : ""}`,
  af_no_results: "No results found",
  af_manual_hint:
    "Manually enter assets not found on Yahoo Finance (e.g. mutual funds).\nIf you know the ISIN or symbol, enter it and try fetching the current price.",
  af_name_label: "Name *",
  af_ticker_label: "Symbol / ISIN (optional)",
  af_asset_type_label: "Asset Type",
  af_market_label: "Market",
  af_currency_label: "Currency",
  af_quantity_label: "Quantity *",
  af_avg_price_label: "Average Cost",
  af_current_price_label: "Current Price",
  af_current_price_auto: "✓ Auto-fetched from Yahoo Finance",
  af_fetch_price_btn: "Fetch Price",
  af_fetching: "Fetching…",
  af_currency_placeholder: "Select currency",
  af_currency_no_result: "No results",
  af_back_to_search: "← Back to search",
  af_re_search: "← Search again",
  af_btn_cancel: "Cancel",
  af_btn_submit: "Save",
  af_manual_link: "Not found on Yahoo Finance? → Enter manually",
  af_cash_amount_label: "Amount",
  af_crypto_hint: "Enter a coin ticker and select a trading pair.",
  af_crypto_search_btn: "Search Pairs",
  af_crypto_searching: "Fetching…",
  af_crypto_pair_title: "Select Trading Pair",
  af_crypto_no_pairs: "No pairs found. Check the ticker.",
  af_crypto_selected: "Selected",
  af_crypto_select: "Select",
  af_buy_price_label: "Buy Price",
  af_current_price_placeholder: "Auto-fetch or enter manually",

  atype_stock: "Stock",
  atype_etf: "ETF",
  atype_fund: "Fund / Trust",
  atype_bond: "Bond",
  atype_other: "Other",
  atype_crypto: "Crypto",
  atype_cash: "Cash / Deposit",
  market_jp: "Japan (JP)",
  market_us: "US (US)",
  market_kr: "South Korea (KR)",
  market_other: "Other",
  currency_jpy: "Yen (JPY)",
  currency_usd: "Dollar (USD)",
  currency_krw: "Won (KRW)",

  tag_labels: {
    dividend: "Dividend",
    growth: "Growth",
    value: "Value",
    index: "Index/ETF",
    bond: "Bond",
    reit: "REIT",
    cash: "Cash",
    crypto: "Crypto",
    commodity: "Commodity",
    other: "Other",
  },
  asset_type_labels: {
    stock: "Stock",
    etf: "ETF",
    bond: "Bond",
    fund: "Fund",
    cash: "Cash",
    crypto: "Crypto",
    real_estate: "Real Estate",
    other: "Other",
  },
  market_labels: {
    KR: "South Korea",
    JP: "Japan",
    US: "US",
    OTHER: "Other",
  },
};
