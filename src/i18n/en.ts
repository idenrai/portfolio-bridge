import type { Translations } from "./types";

export const en: Translations = {
  nav_dashboard: "Dashboard",
  nav_assets: "Assets",
  nav_gurus: "Gurus",
  nav_settings: "Settings",
  nav_about: "About",
  app_tagline: "Assets · AI Insights · Gurus",
  app_version_info: "Browser storage",

  about_tagline: "Unified multi-country asset management + AI & guru insights",
  about_intro:
    "Portfolio Bridge is a privacy-first web app for managing financial assets across Korea, the US, Japan, and Germany in a single dashboard. Get actionable portfolio insights powered by AI and the wisdom of legendary investors. All your data stays in the browser — no account required.",
  about_features_title: "Features",
  about_feat1_title: "Unified Dashboard",
  about_feat1_desc:
    "KPI summary, category & market allocation charts, holdings table, and rebalancing suggestions — all at a glance.",
  about_feat2_title: "Asset Management",
  about_feat2_desc:
    "Search tickers via Yahoo Finance or add assets manually. AI auto-classification, CSV import & export supported.",
  about_feat3_title: "Investment Gurus",
  about_feat3_desc:
    "Reference the philosophies and model portfolios of 15 legendary investors — Buffett, Dalio, Lynch, and more — and compare them with your own portfolio.",
  about_feat4_title: "AI Portfolio Analysis",
  about_feat4_desc:
    "Generate a structured prompt packed with your holdings data, ready to paste into ChatGPT, Claude, Gemini, or Grok for ideal allocation advice.",
  about_feat5_title: "Automatic Insights",
  about_feat5_desc:
    "Automatically detects concentration risk, large losses, low cash, and high FX exposure — displayed as dismissible insight cards.",
  about_feat6_title: "Multi-language & Currency",
  about_feat6_desc:
    "Full UI in Korean, English, Japanese, and German. Display currency switchable between KRW, USD, JPY, and EUR.",
  about_privacy_title: "Privacy First",
  about_privacy_desc:
    "All asset data is stored only in your browser's localStorage. Nothing is sent to an external server. No account creation needed.",
  about_tech_title: "Tech Stack",
  about_links_live: "Live Demo",
  about_links_github: "GitHub",
  about_disclaimer:
    "This app is built for personal learning and portfolio tracking. Market data, exchange rates, and analysis are for reference only and should not be used as the basis for investment decisions.",

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
  dash_refresh: "Refresh All",
  dash_refreshing: "Fetching…",
  dash_updated_at: (time) => `${time}`,

  kpi_total_value: "Total Value",
  kpi_pnl: "Unrealized P&L",
  kpi_cash_weight: "Cash",
  kpi_fx_exposure: "FX Exposure",
  kpi_holdings_unit: "stocks",
  kpi_asset_type_unit: "asset types",

  chart_market: "By Market",
  chart_category: "By Category",
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

  category_title: "Category Target vs Actual",
  category_empty: "Set target allocations in Settings.",
  category_legend_target: "Target",
  category_legend_normal: "Normal",
  category_legend_over: "Over",
  category_legend_under: "Under",

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
  insights_ai_btn: "View Prompt",
  insights_ai_copy: "Copy to clipboard",
  insights_ai_copied: "✓ Copied!",
  insights_ai_desc:
    "Copy the prompt below and paste it into ChatGPT, Claude, Gemini, Grok, or any AI assistant.",
  insights_ai_close: "Close",
  insights_ai_banner_title: "AI Portfolio Analysis",
  insights_ai_banner_desc:
    "Generate a prompt packed with your holdings data. Paste it into ChatGPT, Claude, Gemini, or Grok to get an ideal allocation model and actionable insights.",
  insight_concentration: (name, pct) =>
    `${name} weight ${pct}% — high single-stock concentration`,
  insight_big_loss: (name, pct) => `${name} return ${pct}% — significant loss`,
  insight_cash_high: (pct) =>
    `Cash ${pct}% — excess liquidity, consider deploying`,
  insight_cash_low: (pct) => `Cash ${pct}% — low emergency buffer`,
  insight_fx_high: (currency, pct) =>
    `${currency} exposure ${pct}% — sensitive to FX moves`,
  insight_category_over: (label, pct, target, diff) =>
    `${label} ${pct}% vs target ${target}% → +${diff}%p overweight`,
  insight_category_under: (label, pct, target, diff) =>
    `${label} ${pct}% vs target ${target}% → ${diff}%p underweight`,

  asset_title: "Assets",
  asset_btn_ai: "View Prompt",
  asset_ai_banner_title: "AI Asset Classification",
  asset_ai_banner_desc:
    "Automatically classify assets with AI. Copy the prompt and paste it into ChatGPT, Claude, Gemini, or Grok to get a recommended category for each holding.",
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
    "Copy the prompt below and paste it into ChatGPT, Claude, Gemini, Grok, or another AI.",
  asset_ai_tab_link: "② Import AI Response",
  asset_ai_copy: "Copy to Clipboard",
  asset_ai_copied: "✓ Copied!",
  asset_ai_close: "Close",
  asset_ai_import_desc: "Paste the JSON returned by the AI below and",
  asset_ai_format_label: "Format:",
  asset_ai_json_placeholder:
    'Paste AI response JSON here...\n\nExample:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "..." },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "..." }\n]',
  asset_ai_apply_btn: "Apply Categories",
  asset_ai_apply_result: (applied, skipped) =>
    `✓ Categories applied to ${applied} assets.${skipped > 0 ? ` (${skipped} skipped)` : ""}`,
  asset_ai_parse_error: "Parse error",
  exchange_rate_error: "Failed to fetch exchange rates. Please enter manually.",
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
  guru_col_category: "Category",
  guru_col_current: "Current",
  guru_col_guru_target: "Guru Target",
  guru_col_diff: "Diff",
  guru_col_amount: "Amount",
  guru_ai_banner_title: "Ask the Guru",
  guru_ai_banner_desc:
    "Analyze your portfolio through the lens of the selected guru.",
  guru_ai_btn: "Generate Prompt",
  guru_ai_close: "Close",
  guru_ai_desc:
    "Copy the prompt below and paste it into ChatGPT, Claude, or any AI assistant.",
  guru_ai_copy: "Copy to Clipboard",
  guru_ai_copied: "✓ Copied!",
  guru_philosophy_buffett:
    "• Economic Moat: Focus on companies with durable competitive advantages and high barriers to entry\n" +
    "• Long-Term Holding: Buy understandable businesses at fair prices and hold for 10+ years\n" +
    "• Dividend Growth & Buybacks: Favor companies with consistent shareholder return policies\n" +
    "• Circle of Competence: Only invest in industries you truly understand\n" +
    "• Cash Reserves: Always maintain substantial cash to seize great opportunities\n" +
    '• Quote: "Rule No.1: Never lose money. Rule No.2: Never forget Rule No.1."',
  guru_philosophy_munger:
    "• Concentrated Investing: Make large bets only when highly confident in a few outstanding businesses\n" +
    "• Mental Models (Multidisciplinary Thinking): Leverage frameworks from psychology, physics, economics, and more\n" +
    "• Patience: Often the best move is to do nothing at all\n" +
    "• Contrarian Thinking: Be fearful when others are greedy, and greedy when others are fearful\n" +
    "• The Art of Avoidance: Avoiding bad investments matters more than finding great ones\n" +
    '• Quote: "Invert, always invert."',
  guru_philosophy_lynch:
    "• Everyday Investment Ideas: Discover growing products and services in daily life\n" +
    "• PEG Ratio: Divide the P/E ratio by earnings growth rate to assess fair valuation\n" +
    "• Tenbagger Hunting: Seek stocks with the potential for 10x returns\n" +
    "• Broad Diversification: Spread risk across dozens to hundreds of stocks\n" +
    "• Thorough Research: Emphasize company visits and hands-on financial analysis\n" +
    '• Quote: "Know what you own, and know why you own it."',
  guru_philosophy_graham:
    "• Margin of Safety: Only buy at a significant discount to intrinsic value\n" +
    "• Defensive Investing: Prioritize capital preservation with a conservative approach\n" +
    "• Stock-Bond Balance: Allocate 25–75% to stocks, rest in bonds, adjust with market conditions\n" +
    "• Quantitative Analysis: Remove emotion; evaluate companies based on financial data\n" +
    '• The Market Is a "Weighing Machine": Long-term, stock prices reflect true business value\n' +
    '• Quote: "The investor’s chief problem—and even his worst enemy—is likely to be himself."',
  guru_philosophy_dalio:
    "• All Weather Strategy: Prepare for all economic regimes (growth/slowdown × inflation/deflation)\n" +
    "• Risk Parity: Equalize risk contributions across asset classes\n" +
    "• Broad Diversification: Invest across stocks, bonds, gold, and commodities with low correlations\n" +
    "• Principles: Establish systematic decision-making and organizational principles\n" +
    "• Understanding Cycles: Analyze short-term and long-term debt cycles to guide decisions\n" +
    '• Quote: "He who lives by the crystal ball will eat shattered glass."',
  guru_philosophy_lilu:
    "• Buffett-Munger Approach in Asia: Apply value investing principles to Chinese and Asian markets\n" +
    "• Deep Business Analysis: Thoroughly understand business models and long-term competitiveness\n" +
    "• Ultra-Concentrated Portfolio: Invest heavily in a small number of high-conviction ideas\n" +
    "• Long-Term Holding: Maintain 5–10+ year investment horizons\n" +
    "• Intellectual Honesty: Acknowledge the limits of your knowledge and stay within your circle\n" +
    '• Quote: "The biggest risk in investing is not volatility, but permanent loss of capital."',
  guru_philosophy_ackman:
    "• Activist Investing: Actively engage with company management to unlock value\n" +
    "• Concentrated Portfolio: Large-scale investments in 5–10 quality companies\n" +
    "• Business Model Analysis: Prefer simple, predictable cash flow businesses\n" +
    "• Asymmetric Risk-Reward: Seek opportunities with limited downside and large upside potential\n" +
    "• Macro Hedging: Use defensive positions to protect against extreme scenarios\n" +
    '• Quote: "Concentration builds wealth; diversification preserves it."',
  guru_philosophy_burry:
    "• Contrarian Investing: Willingly take positions opposite to the market consensus\n" +
    "• Value-Based Analysis: Meticulously calculate intrinsic and asset values\n" +
    "• Macro Bets: Analyze macroeconomic trends and market bubbles for directional bets\n" +
    "• Independent Thinking: Rely on your own analysis without succumbing to herd mentality\n" +
    "• High Cash Position: Hold cash patiently until truly compelling opportunities arise\n" +
    '• Quote: "I may be early, but I\'m not wrong."',
  guru_philosophy_fisher:
    "• Global Macro: Analyze global economic trends and market cycles to guide asset allocation\n" +
    "• Exploiting Investor Sentiment: Use excessive optimism and pessimism as profit opportunities\n" +
    "• Long-Term Equity Overweight: Stocks deliver superior long-term returns over other assets\n" +
    "• Broad Global Diversification: Avoid country-specific concentration; invest worldwide\n" +
    "• Three Questions: Distinguish what the market knows, doesn't know, and wrongly believes\n" +
    '• Quote: "Markets climb a wall of worry."',
  guru_philosophy_cohen:
    "• Multi-Manager Model: Operate multiple investment strategies and managers in parallel\n" +
    "• Risk Management First: Strictly manage per-position stop-losses and overall portfolio risk\n" +
    "• Short-to-Mid-Term Trading: Pursue returns through rapid decision-making and position turnover\n" +
    "• Information Edge: Investment decisions grounded in thorough research and data analysis\n" +
    "• Flexible Strategies: Employ long/short, event-driven, quantitative, and other approaches\n" +
    '• Quote: "The key is not predicting markets perfectly, but managing risk relentlessly."',
  guru_philosophy_marks:
    "• Market Cycle Theory: Understand the pendulum-like swings of markets and identify your position\n" +
    "• Second-Level Thinking: Think differently and better than the consensus\n" +
    "• Distressed Investing: Pioneer in distressed debt and crisis asset investing\n" +
    "• Risk = Permanent Loss: Define true risk as permanent capital loss, not volatility\n" +
    "• Defensive Investing: Focus on limiting losses in bad times over maximizing gains in good times\n" +
    '• Quote: "You can’t predict. You can prepare."',
  guru_philosophy_klarman:
    "• Margin of Safety Heir: Modernize Graham's margin of safety philosophy for today's markets\n" +
    "• Absolute Returns: Focus on absolute returns rather than relative benchmark performance\n" +
    "• High Cash Reserves: Willingly hold up to 50% cash when no compelling opportunities exist\n" +
    "• Capitalize on Fear: Aggressively buy undervalued assets during market panics\n" +
    "• Downside Protection First: Prioritize capital preservation over return maximization\n" +
    '• Quote: "Value investing is at its core the marriage of a contrarian streak and a calculator."',
  guru_philosophy_templeton:
    "• Global Contrarian: Buy at the 'Point of Maximum Pessimism'\n" +
    "• Borderless Investing: Search for undervalued opportunities across all global markets\n" +
    "• Long-Term Value Investing: Hold for 5–10+ years, waiting for intrinsic value realization\n" +
    "• Quantitative Screening: Use low P/E, P/B and other metrics to screen candidates\n" +
    "• Humble Investing: Exploit market mistakes rather than trying to beat the market\n" +
    '• Quote: "The time of maximum pessimism is the best time to buy."',
  guru_philosophy_soros:
    "• Reflexivity Theory: Market participants' perceptions alter reality in feedback loops\n" +
    "• Massive Directional Bets: Take enormous positions across currencies, bonds, and equities when conviction is high\n" +
    "• Global Macro: Read political, economic, and social shifts for macro investment opportunities\n" +
    "• Quick Stop-Losses: Exit positions immediately when the thesis proves wrong\n" +
    "• Exploiting Market Instability: Find profit opportunities in market imbalances and inefficiencies\n" +
    "• Quote: \"It's not whether you're right or wrong, but how much you make when you're right and how much you lose when you're wrong.\"",
  guru_philosophy_wood:
    "• Disruptive Innovation: Concentrate on technologies that will transform the world in 5–10 years\n" +
    "• Five Key Themes: AI, robotics, energy storage, genomics, and blockchain innovation platforms\n" +
    "• Long-Term Growth Investing: Accept short-term volatility; bet on long-term growth potential\n" +
    "• Proactive Research: Proprietary future forecasts and price modeling by in-house research teams\n" +
    "• Transparent Management: Publicly disclose daily trades for full fund transparency\n" +
    '• Quote: "Innovation solves problems and creates entirely new market opportunities."',

  guru_philosophy_druckenmiller:
    "• Macro Trading Mastery: Directional bets via analysis of correlations between currencies, rates, and equities\n" +
    "• Soros Protégé: Inherited and evolved strategies proven at the Quantum Fund — averaged ~30% annual returns over 30 years\n" +
    '• Concentrated Bets: "When you have tremendous conviction on a trade, you have to go for the jugular."\n' +
    "• Momentum-Aware: Ride trends with conviction; pivot immediately when signals reverse — ego is the enemy\n" +
    "• Asymmetric Risk Management: Limit losses while maximizing upside through asymmetric position sizing\n" +
    '• Quote: "The way to build long-term returns is through preservation of capital and home runs."',
  guru_philosophy_smith:
    '• Quality Compounders: "Buy good companies, don\'t overpay, do nothing" — a remarkably simple yet powerful philosophy\n' +
    "• High ROIC Focus: Only invests in companies with sustainably high returns on invested capital (ROIC ≥ 20%)\n" +
    '• Concentrated Portfolio: ~25–30 holdings; "Diversification is a confession of not knowing what you\'re doing"\n' +
    "• Quality Over Cheapness: Pays up for quality rather than hunting for cheap stocks — hold as long as fundamentals intact\n" +
    "• Compounding Machine: Outstanding companies that reinvest their own cash flows at high rates of return\n" +
    '• Quote: "I have a problem with the idea you should diversify to reduce risk. If you own a business, own the best."',
  guru_philosophy_greenblatt:
    "• Magic Formula: Combining high earnings yield with high return on invested capital (ROIC) — systematic stock selection\n" +
    '• Systematic Value Investing: Rules-based, emotion-free approach. Codified in "The Little Book That Beats the Market"\n' +
    "• Unloved Stocks: Systematically identifies cheap, high-quality companies ignored by the market\n" +
    "• Diversified Approach: 20–30 positions to reduce individual stock risk\n" +
    '• Patience Required: "The magic formula works over most periods but can lag the market for 3–4 years"\n' +
    '• Quote: "Figure out what something is worth and pay a lot less, because the stock market is Mr. Market in the short run."',

  settings_title: "Settings",
  settings_display_currency_title: "Display Currency",
  settings_display_currency_desc:
    "Select the base currency for displaying portfolio values.",
  settings_fx_title: "Exchange Rates",
  settings_fx_cache_warn: (time) =>
    `⚠️ Rate fetch failed — using cached value (as of ${time})`,
  settings_data_refresh_title: "Rates & Prices",
  settings_data_refresh_refreshing: "Fetching…",
  settings_data_refresh_refresh: "🔄 Refresh Now",
  settings_data_refresh_auto:
    "Rates and prices are fetched automatically on app start.",
  settings_data_refresh_time: (time) => `As of ${time}`,
  settings_data_refresh_cache_warn: (time) =>
    `⚠️ Fetch failed — using cached values (as of ${time})`,
  settings_data_refresh_result: (updated, total) =>
    `${updated} of ${total} prices updated`,
  settings_data_refresh_no_ticker: "No assets with tickers registered.",
  data_refresh_error:
    "Failed to fetch rates/prices. Please check your network.",
  data_refresh_partial_fail: (names) =>
    `The following assets could not be updated. Please enter the current price manually in asset details: ${names.join(", ")}`,

  drive_title: "Google Drive Sync",
  drive_desc:
    "Automatically saves your portfolio data to your personal Google Drive app folder. Sign in with the same Google account on any device to restore your data.",
  drive_connect: "Connect with Google",
  drive_disconnect: "Disconnect",
  drive_connected: "Drive Connected",
  drive_syncing: "Syncing\u2026",
  drive_synced_at: (time) => `Synced at ${time}`,
  drive_sync_now: "Sync Now",
  drive_no_client_id: "VITE_GOOGLE_CLIENT_ID is not set.",
  drive_error_prefix: "Sync error:",
  drive_conflict_title: "Data Conflict Detected",
  drive_conflict_desc: (driveTime, localTime) =>
    `Drive data (${driveTime}) is newer than local data (${localTime}). Which data would you like to use?`,
  drive_use_drive: "Use Drive Data",
  drive_use_local: "Keep Local Data",
  drive_error_no_client_id:
    "Google Client ID is not configured. Please check your .env file.",
  drive_error_gis_not_loaded: "Google Identity Services script is not loaded.",
  settings_target_title: "Target Allocation",
  settings_target_sum: (n) => `Total: ${n}%`,
  settings_target_save: "Save",
  settings_target_saved: "Saved",
  settings_data_title: "Data Management",
  settings_data_desc: "All data is stored in browser local storage.",
  settings_data_count: (n) => `Registered assets: ${n}`,
  settings_data_reset: "Reset All Data",
  settings_data_reset_confirm:
    "This will reset all data (assets, settings). This action cannot be undone.",

  at_col_name: "Name",
  at_col_market: "Market",
  at_col_category: "Category",
  at_col_quantity: "Qty",
  at_col_current_price: "Current Price",
  at_col_value: "Value",
  at_col_pnl: "P&L",
  at_col_return: "Return",
  at_col_weight: "Weight",
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
  market_eu: "Europe (EU)",
  market_other: "Other",
  currency_jpy: "Yen (JPY)",
  currency_usd: "Dollar (USD)",
  currency_krw: "Won (KRW)",
  currency_eur: "Euro (EUR)",

  category_labels: {
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
    EU: "Europe",
    OTHER: "Other",
  },
};
