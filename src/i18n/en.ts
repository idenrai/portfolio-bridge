import type { Translations } from "./types";

export const en: Translations = {
  nav_dashboard: "Dashboard",
  nav_assets: "Assets",
  nav_gurus: "Gurus",
  nav_settings: "Settings",
  nav_about: "About",
  app_tagline: "Unified Asset Management + AI & Guru Insights",
  app_version_info: "Browser storage",

  about_tagline: "Unified Portfolio Management + AI & Guru Insights",
  about_intro:
    "Portfolio Bridge is a privacy-first web app that lets you manage multi-country financial assets (Korea, US, Japan, Germany) in a single unified dashboard, drawing portfolio insights from AI and legendary investment gurus. All data is stored exclusively in your browser and never sent to external servers.",
  about_features_title: "Key Features",
  about_feat1_title: "Unified Dashboard",
  about_feat1_desc:
    "Review core KPI metrics, ranked P&L waterfall bar lists, portfolio history trends, category & currency exposure, and rebalancing suggestions at a single glance.",
  about_feat2_title: "Multi-Country & Tax-Advantaged Accounts",
  about_feat2_desc:
    "Manage multi-market holdings and granular account wrappers (NISA Growth/Accumulation, ISA, Pension Savings, IRP, Taxable Brokerage, etc.) with Yahoo Finance search, AI classification, and CSV import/export.",
  about_feat3_title: "23 Investment Gurus & 6 Quant Scorers",
  about_feat3_desc:
    "Compare your holdings against 23 legendary philosophies (Buffett, Dalio, Lynch, etc.) and analyze positions using 6 quantitative scorers (Lynch, Magic Formula, Graham, Smith, Piotroski, O'Neil) plus FRED Buffett Indicator (^W5000 / GDP).",
  about_feat4_title: "AI Portfolio Diagnostics",
  about_feat4_desc:
    "Generate structured AI prompts enriched with guru personas and Tax-Efficient Asset Location directives, ready to paste directly into ChatGPT, Claude, Gemini, or Grok.",
  about_feat5_title: "Automated Risk Insights",
  about_feat5_desc:
    "Automatically detect position concentration, heavy unrealized losses, low cash buffers, and excessive FX risks with actionable risk mitigation alerts.",
  about_feat6_title: "Multi-Language & Multi-Currency",
  about_feat6_desc:
    "Full native support for 4 languages (English, Korean, Japanese, German) with real-time base currency conversions across KRW, USD, JPY, and EUR.",
  about_feat7_title: "FIRE Early Retirement Planner",
  about_feat7_desc:
    "Simulate compound asset growth and project your exact milestone to Financial Independence and Early Retirement based on safe withdrawal rates.",
  about_privacy_title: "Privacy First & Cloud Backup",
  about_privacy_desc:
    "All asset data is stored only in your browser's localStorage with zero account creation required. Seamlessly connect your private Google Drive for secure cross-device backup and restoration.",
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
    "Data is stored only in this browser on this device. It does not sync across devices — please use the same device and browser.",
  dash_notice_csv:
    "Asset data can be exported/imported as CSV files. Use this for backups or device migration.",
  dash_notice_mobile:
    "💡 Fully responsive and optimized for all mobile, tablet, and desktop viewports.",
  dash_sample_btn: "Explore with sample data",
  dash_sample_hint:
    "Sample data can be removed via Settings › Local Data Management › Reset All Data.",
  dash_refresh: "Refresh All",
  dash_refreshing: "Fetching…",
  dash_updated_at: (time) => `${time}`,

  kpi_total_value: "Total Value",
  kpi_pnl: "Unrealized P&L",
  kpi_cash_weight: "Cash",
  kpi_fx_exposure: "FX Exposure",
  kpi_holdings_unit: "stocks",
  kpi_asset_type_unit: "asset types",

  chart_allocation_title: "Asset Allocation",
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
  holdings_col_per: "P/E",
  holdings_col_pbr: "P/B",
  holdings_show_all: (n) => `View all ${n}`,
  holdings_show_top10: "Top 10 only",
  holdings_show_top20: "Top 20 only",
  holdings_show_top: (n) => `Top ${n} only`,

  category_title: "Category Target vs Actual",
  category_set_target: "Set Targets",
  category_empty: 'Click "Set Targets" to configure target allocations.',
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
  rebalance_ok: "Allocation is close to target",
  rebalance_buy: "Buy",
  rebalance_sell: "Sell",

  insights_title: "Insights",
  insights_ok: "No issues found",
  insights_ai_btn: "View Prompt",
  insights_ai_copy: "Copy to clipboard",
  insights_ai_copied: "Copied!",
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
  asset_ai_modal_title: "AI Classification",
  asset_ai_tab_generate: "① Generate Prompt",
  asset_ai_tab_import: "② Import AI Response",
  asset_ai_copy_desc:
    "Copy the prompt below and paste it into ChatGPT, Claude, Gemini, Grok, or another AI.",
  asset_ai_tab_link: "② Import AI Response",
  asset_ai_copy: "Copy to Clipboard",
  asset_ai_copied: "Copied!",
  asset_ai_close: "Close",
  asset_ai_import_desc: "Paste the JSON returned by the AI below and",
  asset_ai_format_label: "Format:",
  asset_ai_json_placeholder:
    'Paste AI response JSON here…\n\nExample:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "…" },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "…" }\n]',
  asset_ai_apply_btn: "Apply Categories",
  asset_ai_apply_result: (applied, skipped) =>
    `Categories applied to ${applied} assets.${skipped > 0 ? ` (${skipped} skipped)` : ""}`,
  asset_ai_parse_error: "Parse error",
  exchange_rate_error: "Failed to fetch exchange rates. Please enter manually.",
  asset_ai_copy_link_pre: "When you get a response, go to the",
  asset_ai_copy_link_post: "tab to apply automatically.",
  asset_ai_import_btn_suffix: "and apply.",
  csv_preview_title: (n) => `CSV Preview — ${n} rows`,
  csv_preview_confirm: "Confirm import",
  csv_preview_more: (n) => `… and ${n} more rows`,

  guru_title: "Investment Gurus",
  guru_empty_title: "Guru Analysis",
  guru_empty_desc:
    "Register your assets to compare your portfolio against a guru.",
  guru_philosophy_label: "Investment Philosophy",
  guru_detail_explorer_label: "Explore Gurus",
  guru_ideal_alloc: "Ideal Allocation",
  guru_radar_title: "My Portfolio vs Guru",
  guru_my_portfolio: "My Portfolio",
  guru_rebalance_title: "Rebalance Suggestions",
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
    "Copy the prompt below and paste it into AI tools like ChatGPT, Claude, Gemini, or Grok.",
  guru_ai_search_warn: "AI will search the web for the latest news, which may take a few extra seconds.",
  guru_ai_copy: "Copy to Clipboard",
  guru_ai_copied: "Copied!",
  guru_ai_followup_btn: "Continue Previous Chat",
  guru_ai_followup_desc:
    "A prompt containing only the portfolio changes since your last conversation. Paste it into your previous chat to get an evaluation of what's changed.",
  guru_ai_followup_new_session: "Start New Conversation",
  guru_ai_followup_new_session_confirm:
    "This will clear the saved previous portfolio state and start fresh with the current state. Continue?",
  guru_ai_session_saved: "Current portfolio state has been saved.",
  guru_ai_scope_title: "Consultation Assets",
  guru_ai_scope_desc: "Select or exclude holdings to include in the Guru's analysis.",
  guru_ai_scope_count: (selected, total) => `${selected}/${total} selected`,
  guru_ai_scope_reset: "Reset to Default",
  guru_ai_scope_select_all: "Select All",
  guru_ai_scope_deselect_all: "Deselect All",
  guru_ai_scope_empty_warning: "Please select at least 1 asset to generate a Guru consultation prompt.",
  guru_all_scoped_out_notice: "All assets are currently set to 'Dashboard Only' or 'Hidden', so no holdings are included by default. Select a Guru and choose holdings in the banner above.",

  // ─── Custom Guru ──────────────────────────────────────────────────────────
  custom_guru_dash_banner_title: "My Custom AI Guru Consultation",
  custom_guru_dash_banner_desc: "1:1 in-depth portfolio review tailored to your targets and risk profile",
  custom_guru_dash_banner_action: "Consult",
  custom_guru_selector_badge: "Custom Guru",
  custom_guru_default_name: "My Custom Guru",
  custom_guru_unconfigured_desc: "Configure your style and targets to create your personal AI advisor",
  custom_guru_settings_btn: "Configure Persona",
  custom_guru_modal_title: "Configure Your Custom AI Guru",
  custom_guru_modal_desc: "Combine your risk tolerance, strategy, and coaching tone to build your personal advisor.",
  custom_guru_name_label: "Guru Name / Title",
  custom_guru_icon_label: "Avatar Icon",
  custom_guru_risk_label: "Risk Tolerance",
  custom_guru_risk_conservative: "Conservative (Capital preservation & downside defense)",
  custom_guru_risk_balanced: "Balanced (Market return & steady compounding)",
  custom_guru_risk_aggressive: "Aggressive (High growth & alpha maximization)",
  custom_guru_strategy_label: "Investment Strategy",
  custom_guru_strat_all_weather: "All-Weather (Macro regime diversification)",
  custom_guru_strat_dividend: "Dividend & Cash Flow (Income & compounding)",
  custom_guru_strat_tech: "Tech & Innovation (Big tech & secular trends)",
  custom_guru_strat_value: "Deep Value (Margin of safety & discounts)",
  custom_guru_strat_momentum: "Quant & Momentum (Systematic factors & trends)",
  custom_guru_tone_label: "Coaching Tone",
  custom_guru_tone_direct: "Direct & Unfiltered (Munger style: blunt reality checks)",
  custom_guru_tone_mentor: "Supportive Mentor (Bogle/Lynch style: patient & encouraging)",
  custom_guru_tone_quant: "Objective Analyst (Dalio style: probabilistic & data-driven)",
  custom_guru_philosophy_label: "Personal Guiding Principles (Optional)",
  custom_guru_philosophy_placeholder: "e.g., Do not recommend selling Bitcoin, maintain 15% cash minimum",
  custom_guru_target_preview_label: "Portfolio Target Asset Allocation",
  custom_guru_target_help: "Synchronized with Dashboard 'Category Target vs Actual' as the AI coach benchmark.",
  custom_guru_target_edit_btn: "Edit Target",
  custom_guru_target_empty: "No target allocation configured. Click [Edit Target] to set your asset mix.",
  custom_guru_save_btn: "Save & Apply Guru",
  custom_guru_reset_btn: "Reset to Default",
  custom_guru_cancel_btn: "Cancel",

  // ─── Guru Guide & Strategy Tags ──────────────────────────────────────────
  guru_tag_value: "Value",
  guru_tag_growth: "Growth & Momentum",
  guru_tag_passive: "Asset Allocation",
  guru_tag_quant: "Quant & Rules",
  guru_tag_macro: "Global Macro",
  guru_tag_hedge: "Contrarian & Hedge",

  guru_filter_all: "All",
  guru_search_placeholder: "Search by guru name or firm...",
  guru_search_clear: "Clear search",
  guru_search_empty: "No gurus match your criteria.",
  guru_count_badge: (count: number) => `Showing ${count}`,
  guru_btn_all_grid: "All Gurus",

  guru_guide_btn: "Find My Guru",
  guru_guide_modal_title: "Personalized Guru Matcher Guide",
  guru_guide_modal_desc: "Answer 3 quick questions to discover the legendary investor whose philosophy best aligns with your goals.",
  guru_guide_step: (current: number, total: number) => `Step ${current} of ${total}`,
  guru_guide_q1_title: "Q1. What is your primary objective and risk tolerance?",
  guru_guide_q1_opt_conservative: "Capital preservation & steady dividends (downside protection first)",
  guru_guide_q1_opt_balanced: "Balanced compound growth outperforming the broader market",
  guru_guide_q1_opt_aggressive: "Disruptive high alpha seeking exponential upside (high volatility accepted)",
  guru_guide_q2_title: "Q2. Which portfolio strategy resonates most with you?",
  guru_guide_q2_opt_value: "Intrinsic value, durable moats, and margin of safety (Value Investing)",
  guru_guide_q2_opt_growth: "Exponential innovation, secular trends, and momentum (Growth)",
  guru_guide_q2_opt_passive: "All-Weather all-regime asset allocation & indexing (Passive)",
  guru_guide_q2_opt_quant: "Empirical factor data and mechanical formula rules (Quant)",
  guru_guide_q2_opt_macro: "Global liquidity cycles and macroeconomic regime shifts (Macro)",
  guru_guide_q2_opt_hedge: "Tail-risk protection, convex payoffs, and crisis hedging (Hedge)",
  guru_guide_q3_title: "Q3. What advisory coaching tone do you prefer?",
  guru_guide_q3_opt_mentor: "Warm, encouraging, and supportive mentorship",
  guru_guide_q3_opt_blunt: "Direct, blunt, and uncompromising candid honesty",
  guru_guide_q3_opt_academic: "Intellectually rigorous, principled, and analytical",
  guru_guide_q3_opt_trader: "Agile, sharp, and battle-tested market operator",
  guru_guide_q3_opt_trader_desc: "Prioritize agile momentum and market trend dynamics",

  guru_guide_result_title: "Your Recommended Investment Gurus",
  guru_guide_result_desc: "Based on your risk profile, strategy, and preferred tone, here are the legends best suited for your portfolio.",
  guru_guide_result_best_badge: "BEST MATCH",
  guru_guide_result_score: "Match",
  guru_guide_result_select_btn: "Consult with this Guru",
  guru_guide_result_other_matches: "Alternative Recommendations",
  guru_guide_result_candidate_select: "Select",
  guru_guide_result_custom_prompt: "Looking to craft your own personalized mentor?",
  guru_guide_result_custom_link: "Configure Custom Guru",
  guru_guide_btn_next: "Next",
  guru_guide_btn_prev: "Previous",
  guru_guide_btn_restart: "Retake Quiz",

  guru_match_reason_buffett: "Ideal for long-term compounders seeking durable competitive moats, cash flow, and capital preservation.",
  guru_match_reason_munger: "Leverage Munger's multidisciplinary inversion model and blunt intellectual honesty to eliminate portfolio errors.",
  guru_match_reason_lynch: "Uncover everyday growth champions with real-world observation and pragmatic PEG discipline.",
  guru_match_reason_graham: "Built for strictly disciplined defensive value investors seeking tangible asset backing and deep margin of safety.",
  guru_match_reason_dalio: "Engineered for resilient all-weather multi-asset diversification across all economic seasons.",
  guru_match_reason_bogle: "The gold standard for low-cost, permanent indexing that never tries to outsmart the market.",
  guru_match_reason_swensen: "Pioneering institutional multi-asset endowment allocation with disciplined systematic rebalancing.",
  guru_match_reason_taleb: "Safeguard your wealth against catastrophic fat tails through convex anti-fragile positioning.",
  guru_match_reason_wood: "Tailored for high-conviction exposure to exponential technological transformation and thematic growth.",
  guru_match_reason_soros: "Exploit market reflexivity, regulatory tipping points, and macroeconomic regime shifts.",
  guru_match_reason_greenblatt: "Systematic evidence-based quantitative value using the formulaic blend of ROC and Earnings Yield.",
  guru_match_reason_marks: "Master market cycles, second-level thinking, and risk asymmetry during uncertain periods.",
  guru_match_reason_category_value: "Focuses on undervalued high-quality assets trading below intrinsic value for steady compounding.",
  guru_match_reason_category_growth: "Targets high-growth momentum and market leadership to capture substantial capital appreciation.",
  guru_match_reason_category_passive: "Combines broad diversification and rule-based rebalancing to achieve steady compound returns.",
  guru_match_reason_category_quant: "Eliminates emotional bias through disciplined empirical rules and financial metric scoring.",
  guru_match_reason_category_macro: "Navigates global macroeconomic cycles, interest rates, and liquidity trends.",
  guru_match_reason_category_hedge: "Focuses on asymmetric downside hedging to protect wealth during systemic crises.",

  guru_name_buffett: "Warren Buffett",
  guru_name_munger: "Charlie Munger",
  guru_name_lynch: "Peter Lynch",
  guru_name_graham: "Benjamin Graham",
  guru_name_dalio: "Ray Dalio",
  guru_name_lilu: "Li Lu",
  guru_name_ackman: "Bill Ackman",
  guru_name_burry: "Michael Burry",
  guru_name_fisher: "Ken Fisher",
  guru_name_cohen: "Steven Cohen",
  guru_name_marks: "Howard Marks",
  guru_name_klarman: "Seth Klarman",
  guru_name_templeton: "John Templeton",
  guru_name_soros: "George Soros",
  guru_name_wood: "Cathie Wood",
  guru_name_druckenmiller: "Stanley Druckenmiller",
  guru_name_smith: "Terry Smith",
  guru_name_greenblatt: "Joel Greenblatt",
  guru_name_piotroski: "Joseph Piotroski",
  guru_name_oneil: "William O'Neil",
  guru_name_bogle: "John Bogle",
  guru_name_swensen: "David Swensen",
  guru_name_taleb: "Nassim Taleb",
  guru_philosophy_buffett:
    "• Economic Moat: Focus on companies with durable competitive advantages and high barriers to entry\n" +
    "• Long-Term Holding: Buy understandable businesses at fair prices and prefer holding them forever\n" +
    "• Dividend Growth & Buybacks: Favor companies with consistent shareholder return policies and excellent capital allocation\n" +
    "• Circle of Competence: Only invest in industries and business models you truly understand\n" +
    "• Wonderful Business: It's far better to buy a wonderful company at a fair price than a fair company at a wonderful price\n" +
    "• Reject Stupidity: Strictly avoid complex derivatives and businesses that are too hard to understand\n" +
    "• Cash Optionality: Always maintain substantial cash to provide liquidity during crises and seize great opportunities\n",
  guru_quotes_buffett:
    "Rule No.1: Never lose money. Rule No.2: Never forget Rule No.1.\n" +
    "Be fearful when others are greedy, and greedy when others are fearful.\n" +
    "Price is what you pay. Value is what you get.",
  guru_philosophy_munger:
    "• Concentrated Investing: Make massive bets only when highly confident in a few outstanding businesses\n" +
    "• Mental Models (Multidisciplinary Thinking): Leverage core frameworks from psychology, physics, biology, math, and history\n" +
    "• Patience: Avoid frequent trading; the best move is often to do nothing and let a great business compound over time\n" +
    "• Contrarian Thinking: Resist popular narratives and herd mentality; truly independent judgment is paramount\n" +
    "• The Art of Avoidance (Inversion): Ask how you might fail first, and systematically avoid stupidity to achieve success\n" +
    "• Continuous Learning: Try to go to bed a little wiser than when you woke up through relentless reading and reflection\n" +
    "• Power of Incentives: Absolutely emphasize the massive impact incentive structures have on human behavior and business outcomes\n",
  guru_quotes_munger:
    "Invert, always invert.\n" +
    "Show me the incentive and I will show you the outcome.\n" +
    "It is remarkable how much long-term advantage people like us have gotten by trying to be consistently not stupid, instead of trying to be very intelligent.",
  guru_philosophy_lynch:
    "• Everyday Investment Ideas: Be the first to discover growing products and services in your daily life and verify them with fundamental analysis\n" +
    "• PEG Ratio: Divide the P/E ratio by the earnings growth rate to accurately assess whether growth is fairly priced\n" +
    "• Tenbagger Hunting: Target highly promising small-to-mid cap companies with the potential to multiply your investment tenfold\n" +
    "• Broad Diversification: Hold hundreds of stocks to spread risk, but rigorously track the unique thesis for each one\n" +
    "• Thorough Research: Emphasize persistent, hands-on investigation including company visits and direct management interviews\n" +
    "• Cocktail Party Theory: A contrarian indicator—when everyone at a party is bragging about stocks, it's a market top; when they ignore stocks, it's a bottom\n",
  guru_quotes_lynch:
    "Know what you own, and know why you own it.\n" +
    "The most important organ in the stock market is the stomach, not the brain.\n" +
    "Time is on your side when you own shares of superior companies.",
  guru_philosophy_graham:
    "• Margin of Safety: Only buy at a significant discount to intrinsic value to provide a buffer against errors in judgment\n" +
    "• Mr. Market: View the market as a manic-depressive business partner; never let his wild emotional swings dictate your actions, but rather profit from them\n" +
    "• Defensive Investing: Prioritize strict capital preservation and downside protection above maximizing returns\n" +
    "• Stock-Bond Balance: Mechanically allocate 25–75% to stocks and the rest to bonds, adjusting purely based on market conditions\n" +
    "• Quantitative Analysis: Entirely remove emotion and evaluate companies solely on cold financial data such as Net Current Asset Value (NCAV)\n",
  guru_quotes_graham:
    "An investment operation is one which, upon thorough analysis, promises safety of principal and an adequate return.\n" +
    "The investor’s chief problem—and even his worst enemy—is likely to be himself.\n" +
    "In the short run, the market is a voting machine but in the long run, it is a weighing machine.",
  guru_philosophy_dalio:
    "• All Weather Strategy: Perfectly prepare for all economic regimes mapping to four quadrants (growth/slowdown × inflation/deflation)\n" +
    "• Risk Parity: Equalize 'risk contributions' across asset classes rather than capital amounts to avoid volatility dominance\n" +
    "• Non-Liability Asset Hedge: Reduce bonds and diversify into hard assets like gold (10–15%) and Bitcoin to hedge late-stage debt cycles\n" +
    "• Radical Transparency: Pursue truth regardless of hierarchy and enforce an Idea Meritocracy within the organization\n" +
    "• Principles: Understand markets and life as a machine of cause-and-effect; systemize lessons from failures into algorithms\n" +
    "• Understanding Debt Cycles: Analyze short-term business cycles and long-term debt cycles to navigate macroeconomic turning points\n",
  guru_quotes_dalio:
    "He who lives by the crystal ball will eat shattered glass.\n" +
    "Pain + Reflection = Progress.\n" +
    "Knowing what you don't know is much more important than whatever it is you know.",
  guru_philosophy_lilu:
    "• Buffett-Munger Approach in Asia: Systematically apply the purest form of value investing principles to the rapidly growing Chinese and Asian markets\n" +
    "• Deep Business Analysis: Thoroughly grasp the essence of business models, management integrity, and impenetrable long-term competitive advantages\n" +
    "• Ultra-Concentrated Portfolio: Commit massive amounts of capital to only a handful of life-changing, high-conviction ideas\n" +
    "• Long-Term Holding: Ignore short-term volatility entirely, maintaining a 5–10+ year horizon until intrinsic value is fully recognized\n" +
    "• Intellectual Honesty: Accurately acknowledge the limits of your own knowledge and rigorously stay within your Circle of Competence\n",
  guru_quotes_lilu:
    "The biggest risk in investing is not volatility, but permanent loss of capital.\n" +
    "A true value investor never tries to beat the market. They only control their own ignorance.\n" +
    "You only need a few truly great investment ideas in a lifetime.",
  guru_philosophy_ackman:
    "• Activist Investing: Acquire massive stakes to actively engage with and force management to unlock hidden shareholder value\n" +
    "• Concentrated Portfolio: Make huge, high-conviction investments in a heavily concentrated portfolio of 5–10 world-class companies\n" +
    "• Business Model Analysis: Demand simple, highly predictable businesses with exceptional free cash flow and dominant brand moats\n" +
    "• Asymmetric Risk-Reward: Relentlessly hunt for asymmetric opportunities where the downside is strictly capped but the upside is potentially infinite\n" +
    "• Macro Hedging: Utilize massive derivative positions (like CDS) as ultimate defensive hedges against extreme macroeconomic shocks or pandemics\n",
  guru_quotes_ackman:
    "Concentration builds wealth; diversification preserves it.\n" +
    "The best investments are often the ones that people laugh at as terrible ideas at the time.\n" +
    "Invest in simple, predictable, cash-flow-generative businesses with dominant market positions.",
  guru_philosophy_burry:
    "• Contrarian Investing: Willingly and decisively take positions diametrically opposed to the market consensus or mania\n" +
    "• Value-Based Analysis: Meticulously calculate intrinsic and asset values, completely ignoring herd mentality\n" +
    "• Macro Bets: Analyze deep macroeconomic trends, systemic risks, and asset bubbles to place massive directional wagers when conviction is absolute\n" +
    "• Independent Thinking: Isolate yourself from Wall Street narratives and rely solely on your own exhaustive, solitary research\n" +
    "• High Cash Reserves: Exhibit infinite patience, holding cash until a wildly asymmetric, undeniable opportunity presents itself\n",
  guru_quotes_burry:
    "I may be early, but I'm not wrong.\n" +
    "If everyone believes something, it’s a good bet that nobody has really tested it.\n" +
    "In the midst of market mania, quietly calculate intrinsic value and hidden tail risks.",
  guru_philosophy_fisher:
    "• Global Macro: Analyze massive shifts in the world economy and historical market cycles to dictate top-down asset allocation\n" +
    "• Exploiting Sentiment: Capitalize on the irrational extremes of market crowds—buying max pessimism and selling max optimism\n" +
    "• Long-Term Equity Bias: Hold the firm conviction that equities will vastly outperform all other asset classes over the long haul in a capitalist system\n" +
    "• Broad Global Diversification: Completely eliminate home country bias by spreading investments extensively across the globe\n" +
    "• The Three Questions: Always ask what the market knows, what it doesn't know, and what it believes that is actually completely false\n",
  guru_quotes_fisher:
    "Markets climb a wall of worry.\n" +
    "What everyone knows is usually wrong, and therein lies the biggest opportunity.\n" +
    "Short-term headlines are mostly noise; the real driver of long-term wealth is capitalist innovation.",
  guru_philosophy_cohen:
    "• Multi-Manager Model: Run a massive platform combining numerous independent trading strategies executed by brilliant, specialized portfolio managers\n" +
    "• Supreme Risk Management: Enforce ruthless stop-loss limits on every position and strictly manage total portfolio risk limits without exception\n" +
    "• Short-to-Medium Term Trading: Exploit short-term market inefficiencies through rapid decision-making and extraordinarily high portfolio turnover\n" +
    "• Information Edge: Base every decision on the most relentless, legally permissible research and alternative data analysis on Wall Street\n" +
    "• Flexible Strategy: Deploy whatever works best in the current environment—long/short equity, event-driven, or pure quantitative strategies\n",
  guru_quotes_cohen:
    "What matters is not how accurately you predict the future, but how ruthlessly you manage risk and cut losses.\n" +
    "The market is not perfectly efficient. Money is made where information is asymmetric.\n" +
    "When the trade thesis is broken, cut your loss immediately without emotion.",
  guru_philosophy_marks:
    "• Market Cycle Theory: Understand that markets swing like a pendulum, and figuring out where we are in the cycle is paramount\n" +
    "• Second-Level Thinking: You can't do the same things as others and expect to outperform; you must think deeper and differently than the consensus\n" +
    "• Sea Change: The era of ultra-low rates has ended; high-yield credit and debt instruments now offer equity-like returns with less risk\n" +
    "• Risk = Permanent Loss: Define true risk exclusively as the probability of permanent capital loss, not temporary price volatility\n" +
    "• Defensive Investing: Focus far more heavily on limiting losses in bad times than maximizing gains in good times\n" +
    "• Price vs. Value: A great asset bought too expensively is a bad investment, while a bad asset bought cheaply enough is a great investment\n",
  guru_quotes_marks:
    "You can’t predict. You can prepare.\n" +
    "Experience is what you got when you didn't get what you wanted.\n" +
    "When the economic tide turns, strategy must evolve. We are living in a Sea Change era.",
  guru_philosophy_klarman:
    "• Margin of Safety Legacy: Brilliantly adapt Benjamin Graham's conservative margin of safety principles to complex, modern financial markets\n" +
    "• Absolute Returns: Entirely reject the trap of relative benchmark chasing, focusing exclusively on achieving positive absolute returns without losing money\n" +
    "• High Cash Reserves: Display extreme patience by holding 50% or more in cash if no investments meet your stringent criteria\n" +
    "• Utilizing Market Fear: Act as the ultimate buyer of last resort when others are panic-selling, scooping up assets far below intrinsic value\n" +
    "• Downside Protection First: Constantly prioritize capital preservation and downside protection over the temptation to maximize upside in a raging bull market\n",
  guru_quotes_klarman:
    "Value investing is at its core the marriage of a contrarian streak and a calculator.\n" +
    "Our goal is not to make money; our goal is to not lose money. If we do that, the returns will take care of themselves.\n" +
    "The market can always be wrong, and price volatility does not equal risk.",
  guru_philosophy_templeton:
    "• Global Contrarian: Buy at the 'Point of Maximum Pessimism'\n" +
    "• Borderless Investing: Search for undervalued opportunities across all global markets\n" +
    "• Long-Term Value Investing: Hold for 5–10+ years, waiting for intrinsic value realization\n" +
    "• Quantitative Screening: Use low P/E, P/B and other metrics to screen candidates\n" +
    "• Humble Investing: Exploit market mistakes rather than trying to beat the market\n",
  guru_quotes_templeton:
    "The time of maximum pessimism is the best time to buy.\n" +
    "The best investment opportunities exist where common wisdom refuses to look.\n" +
    "The four most expensive words in the English language are: 'This time is different.'",
  guru_philosophy_soros:
    "• Reflexivity Theory: Markets are not efficient; biased perceptions of participants affect prices, which in turn alter the underlying fundamentals in a feedback loop\n" +
    "• Massive Directional Bets: When you have strong conviction on macroeconomic imbalances, use leverage to make massive bets across currencies, bonds, and equities\n" +
    "• Global Macro: Analyze political, economic, and social changes alongside central bank policies to uncover massive macro opportunities\n" +
    "• Fast Stop-Loss & Survival: Survival is the absolute priority; if your hypothesis is proven wrong, liquidate the position immediately and run\n" +
    "• Exploiting Chaos: Actively utilize the early stages of market instability and forming bubbles as highly profitable opportunities\n" +
    "• Fallibility: Human beings are inherently fallible; always remain skeptical and open to the possibility that your thesis is fundamentally flawed\n",
  guru_quotes_soros:
    "It's not whether you're right or wrong that's important, but how much money you make when you're right and how much you lose when you're wrong.\n" +
    "Markets are constantly in a state of uncertainty and flux, and money is made by discounting the obvious and betting on the unexpected.\n" +
    "I'm only rich because I know when I'm wrong.",
  guru_philosophy_wood:
    "• Disruptive Innovation: Focus exclusively on world-transforming technologies set to dominate over the next 5–10 years\n" +
    "• Five Innovation Platforms: Bet on exponential growth across AI, robotics, energy storage, multi-omics sequencing, and blockchain\n" +
    "• Long-Term S-Curve Horizon: Accept short-term volatility as normal; evaluate positions based on 5-year expected-value modeling\n" +
    "• Wright's Law in Action: Apply the cost-reduction learning curve to project rapid adoption and realistic valuation multiples\n" +
    "• Transparent Management: Publicly share daily trades and open-source research for complete operational transparency\n" +
    "• Mispriced Innovation: Capitalize on the market's systematic tendency to underestimate exponential technological adoption\n",
  guru_quotes_wood:
    "Innovation solves problems and creates entirely new market opportunities.\n" +
    "We are on the right side of change, on the right side of history.\n" +
    "When investing in disruptive innovation, look beyond short-term volatility and focus on the 5-year S-curve.",

  guru_philosophy_druckenmiller:
    "• Macro Trading Mastery: Directional bets via analysis of correlations between currencies, rates, and equities\n" +
    "• Bitcoin & Infrastructure: Value Bitcoin as a store-of-value brand and bet on AI compute & power/mining infrastructure\n" +
    "• Concentrated Bets: \"When you have tremendous conviction on a trade, you have to go for the jugular.\"\n" +
    "• Momentum-Aware: Ride trends with conviction; pivot immediately when signals reverse — ego is the enemy\n" +
    "• Asymmetric Risk Management: Limit losses while maximizing upside through asymmetric position sizing\n",
  guru_quotes_druckenmiller:
    "The way to build long-term returns is through preservation of capital and home runs.\n" +
    "Put all your eggs in one basket and watch that basket very carefully.\n" +
    "It's not about being right on every trade, but having the courage to bet big when conviction is absolute.",
  guru_philosophy_smith:
    "• Quality Compounders: 'Buy good companies, don't overpay, do nothing'—a ruthlessly simple core philosophy\n" +
    "• High ROCE Focus: Only invest in capital-light companies with durable competitive moats that compound capital at 20%+\n" +
    "• AI CapEx Discipline: Scrutinize tech giants' massive AI infrastructure spending to ensure capital returns are not being destroyed\n" +
    "• Concentrated Portfolio: Reject 'diworsification'; concentrate in 20–30 core holdings and rely on the sheer quality of the ideas\n" +
    "• Pragmatic Active Action: Hold for the long term, but ruthlessly exit broken business models rather than clinging to dogma\n" +
    "• Compounding Machine & Patience: True investing is holding high-return businesses to maximize exponential compounding over time\n",
  guru_quotes_smith:
    "Buy good companies, don't overpay, do nothing.\n" +
    "I have a problem with the idea you should diversify to reduce risk. If you own a business, own the best.\n" +
    "The greatest mistake investors make is the urge to constantly tinker when doing nothing is the right answer.",
  guru_philosophy_greenblatt:
    "• Magic Formula: Mechanically combine high Earnings Yield (value) with high Return on Invested Capital (quality) to select optimal stocks\n" +
    "• Systematic Value Investing: Remove human greed and fear entirely; deploy capital coldly based on strict mathematical rules\n" +
    "• Unloved Stocks: Systematically filter the market to find phenomenal, high-quality businesses that Wall Street has temporarily discarded\n" +
    "• Diversified Approach & Rebalancing: Hold 20–30 positions to mitigate individual company risk, and rebalance strictly every 12 months\n" +
    "• Patience Required: Even a statistically proven strategy can underperform for 3–4 years; enduring this pain is the price of long-term outperformance\n",
  guru_quotes_greenblatt:
    "Figure out what something is worth and pay a lot less, because the stock market is Mr. Market in the short run.\n" +
    "The fact that the magic formula doesn't work all the time is the exact reason why it continues to work over the long term.",
  guru_philosophy_piotroski:
    "• F-Score: A rigorous 9-point binary scoring system evaluating a company's absolute fundamental health across profitability, leverage, and efficiency\n" +
    "• Value Stock Filter: Avoid \"value traps\" by screening high book-to-market stocks to isolate only those undergoing a genuine fundamental turnaround\n" +
    "• Profitability & Cash Flow: Prioritize earnings quality above all—operating cash flow must exceed net income (accruals quality)\n" +
    "• Financial Strength Tracking: Demand proof of financial stability, such as declining leverage, improving liquidity, and zero equity dilution\n" +
    "• Operational Efficiency: Require concrete data showing management execution, such as improving gross margins and asset turnover\n",
  guru_quotes_piotroski:
    "Buying cheap stocks is dangerous. You must verify through hard data that the financial statements are genuinely improving.\n" +
    "Among high BM firms, those with strong fundamentals earn an annual return premium of 7.5% over weak ones.",
  guru_philosophy_oneil:
    "• CAN SLIM System: A highly systematic growth methodology flawlessly blending strict fundamental analysis with technical chart reading\n" +
    "• C & A (Earnings Growth): Demand massive current quarterly EPS growth (25%+) and a multi-year history of explosive annual compounding\n" +
    "• N (New Product/New High): Buy into sheer momentum when a company with a world-changing product breaks out to new 52-week highs\n" +
    "• S·L·I·M Requirements: Analyze supply/demand, insist on buying the #1 market leader, require institutional backing, and respect market direction\n" +
    "• Ruthless Stop-Loss Rule: Mechanically cut all losses at 7-8% without a single exception or excuse to prevent catastrophic capital destruction\n",
  guru_quotes_oneil:
    "The whole secret to winning in the stock market is to lose the least amount possible when you're not right.\n" +
    "Never buy cheap stocks. Buy expensive stocks and sell them higher.\n" +
    "The best stocks always look too high to the majority, and the worst ones always look too low.",
  guru_philosophy_bogle:
    "• Index Revolution: Own the entire stock market. Attempting to beat the average will ultimately fail due to fees.\n" +
    "• Minimize Costs: Ruthlessly control management fees, turnover costs, and taxes that eat into investment returns.\n" +
    "• Stay the Course: Do not let short-term market noise or crashes shake you; stick to your asset allocation.\n" +
    "• Magic of Compounding: Compound interest is a miracle in investing, but compound costs are a terrible disaster.\n" +
    "• Aesthetics of Simplicity: Instead of complex funds or derivatives, a single low-cost broad index fund is sufficient.\n",
  guru_quotes_bogle:
    "Don't look for the needle in the haystack. Just buy the haystack!\n" +
    "Time is your friend; impulse is your enemy.\n" +
    "The greatest enemies of the equity investor are expenses and emotions. Buy the market and stay the course.",
  guru_philosophy_swensen:
    "• Endowment Model: Move beyond traditional 60/40 splits and diversify heavily into alternative assets (private equity, real estate, commodities).\n" +
    "• Equity-Oriented Portfolio: Increase allocation to equity-like assets with high expected returns to maintain long-term purchasing power.\n" +
    "• True Diversification: Combine asset classes with low correlation to fundamentally lower portfolio risk without sacrificing returns.\n" +
    "• Illiquidity Premium: For long-term capital that doesn't need immediate cash, sacrifice liquidity to capture higher returns.\n" +
    "• Mechanical Rebalancing: Do not be swayed by emotions during market volatility; strictly rebalance by selling winners and buying losers.\n",
  guru_quotes_swensen:
    "Diversification is the only free lunch in investing.\n" +
    "The investor's worst enemy is typically the investor himself.\n" +
    "Asset allocation accounts for more than 90% of the variation in portfolio returns over time.",
  guru_philosophy_taleb:
    "• Barbell Strategy: Avoid middle-risk investments; allocate 90% to hyper-safe assets and 10% to high-convexity tail hedges\n" +
    "• Antifragile: Go beyond just surviving shocks; build a portfolio that grows stronger and profits from chaos\n" +
    "• Prepare for Black Swans: Survival is paramount when extreme, unpredictable events occur that standard models fail to foresee\n" +
    "• Filter Out Fragility: Reject zero-sum speculative fads lacking intrinsic value (as in the Bitcoin Black Paper)\n" +
    "• Seek Asymmetric Payoffs: Hunt for setups where downside risk is strictly capped while upside potential is explosive\n",
  guru_quotes_taleb:
    "Survival comes first. You must not go bankrupt to have long-term returns.\n" +
    "Wind extinguishes a candle and energizes fire. Be the fire.\n" +
    "Taking a risk you cannot afford to survive is not investing; it is suicide.",

  lynch_tenbagger_title: "Peter Lynch Tenbagger Analyzer",
  lynch_tenbagger_desc:
    "Scores your stock holdings or any ticker against Peter Lynch's PEG, growth, and financial health criteria. Stocks score higher with PEG < 1.0, EPS growth > 15%, revenue growth > 10%, D/E < 80%, operating margin > 10%, and market cap under $10B. Ideal for identifying high-growth small-to-mid cap stocks with tenbagger potential.",
  lynch_criterion_peg: "PEG Ratio",
  lynch_criterion_eps: "EPS Growth",
  lynch_criterion_rev: "Revenue Growth",
  lynch_criterion_debt: "Debt/Equity",
  lynch_criterion_margin: "Operating Margin",
  lynch_criterion_cap: "Market Cap",
  lynch_no_data: "No data",
  lynch_disclaimer:
    "※ Based on Yahoo Finance fundamentals. Do not use as a basis for investment decisions.",
  lynch_progress_enrich: (done, total) => `Analyzing… (${done}/${total})`,
  lynch_phase_enrich: "Enriching stocks with detailed fundamentals…",
  lynch_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  lynch_tenbagger_badge: "Tenbagger Candidate",
  lynch_initial_guide: "Analyze your portfolio or search a ticker to start.",

  // ─── Analyzer Common (mode tabs) ─────────────────────────────────────────────
  analyzer_mode_portfolio: "My Portfolio",
  analyzer_mode_search: "Ticker Search",
  analyzer_portfolio_desc: (count) => `Score ${count} stocks in your portfolio.`,
  analyzer_btn_portfolio: "Score Portfolio",
  analyzer_btn_search: "Analyze",
  analyzer_search_placeholder: "Enter ticker or stock name (e.g. AAPL, Tesla)",

  // ─── Magic Formula Analyzer ──────────────────────────────────────────────────
  mf_title: "Joel Greenblatt Magic Formula Analyzer",
  mf_desc:
    "Scores stocks on earnings yield and return on capital — the two pillars of Greenblatt's Magic Formula. Stocks score higher with EY > 10%, ROC > 25%, operating margin > 15%, D/E < 50%, and market cap between $1B–$10B. Best for systematic, rule-based value stock picking that removes emotion from the process.",
  mf_criterion_ey: "Earnings Yield",
  mf_criterion_roc: "Return on Capital",
  mf_criterion_margin: "Operating Margin",
  mf_criterion_debt: "Debt/Equity",
  mf_criterion_cap: "Market Cap",
  mf_no_data: "No data",
  mf_disclaimer:
    "※ Based on Yahoo Finance fundamentals. Do not use as a basis for investment decisions.",
  mf_progress_enrich: (done, total) => `Analyzing… (${done}/${total})`,
  mf_phase_enrich: "Enriching stocks with detailed fundamentals…",
  mf_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  mf_magic_badge: "Magic Formula Pick",
  mf_initial_guide: "Analyze your portfolio or search a ticker to start.",

  // Graham
  graham_analyzer_title: "Benjamin Graham Defensive Investor Analyzer",
  graham_analyzer_desc:
    "Scores your stock holdings or any ticker against Graham's margin of safety criteria. Stocks score higher with P/E < 15, P/B < 1.5, Graham Number (P/E×P/B) < 22.5, current ratio > 2.0, D/E < 50%, and dividend yield > 3%. Ideal for finding undervalued, financially stable defensive value stocks.",
  graham_criterion_pe: "P/E Ratio",
  graham_criterion_pb: "P/B Ratio",
  graham_criterion_gn: "Graham Number",
  graham_criterion_cr: "Current Ratio",
  graham_criterion_debt: "Debt/Equity",
  graham_criterion_div: "Dividend Yield",
  graham_no_data: "No data",
  graham_disclaimer:
    "※ Based on Yahoo Finance fundamentals. Do not use as a basis for investment decisions.",
  graham_progress_enrich: (done, total) => `Analyzing… (${done}/${total})`,
  graham_phase_enrich: "Enriching stocks with detailed fundamentals…",
  graham_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  graham_defensive_badge: "️ Defensive Pick",
  graham_initial_guide: "Analyze your portfolio or search a ticker to start.",

  // Smith
  smith_analyzer_title: "Terry Smith Quality Compounder Analyzer",
  smith_analyzer_desc:
    "Scores your stock holdings or any ticker against Smith's quality compounder criteria. Stocks score higher with ROE > 20%, operating margin > 15%, FCF conversion > 80%, revenue growth > 10%, and D/E < 50%. Ideal for identifying high-quality compounders with strong profitability and cash generation that compound wealth over time.",
  smith_criterion_roe: "ROE",
  smith_criterion_margin: "Operating Margin",
  smith_criterion_fcf: "FCF Conversion",
  smith_criterion_rev: "Revenue Growth",
  smith_criterion_debt: "Debt/Equity",
  smith_no_data: "No data",
  smith_disclaimer:
    "※ Based on Yahoo Finance fundamentals. Do not use as a basis for investment decisions.",
  smith_progress_enrich: (done, total) => `Analyzing… (${done}/${total})`,
  smith_phase_enrich: "Enriching stocks with detailed fundamentals…",
  smith_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  smith_quality_badge: "Quality Compounder",
  smith_initial_guide: "Analyze your portfolio or search a ticker to start.",

  // Piotroski F-Score
  piotroski_analyzer_title: "Piotroski F-Score Analyzer",
  piotroski_analyzer_desc:
    "Scores your holdings or any ticker against Piotroski's 9 binary financial health criteria across three areas: Profitability (ROA > 0, positive cash flow, improving ROA, cash flow > net income), Financial Strength (declining debt, improving current ratio, no equity dilution), and Efficiency (improving gross margin and asset turnover). A perfect 9/9 (100 pts) signals strong fundamentals. Ideal for picking financially healthy value stocks.",
  piotroski_criterion_roa: "ROA",
  piotroski_criterion_cfo: "Operating Cash Flow",
  piotroski_criterion_delta_roa: "ΔROA (YoY)",
  piotroski_criterion_accruals: "Accruals Quality",
  piotroski_criterion_delta_leverage: "ΔLong-term Debt",
  piotroski_criterion_delta_liquidity: "ΔCurrent Ratio",
  piotroski_criterion_equity_dilution: "Equity Dilution",
  piotroski_criterion_delta_margin: "ΔGross Margin",
  piotroski_criterion_delta_turnover: "ΔAsset Turnover",
  piotroski_no_data: "No data",
  piotroski_disclaimer:
    "※ Based on Yahoo Finance data. Do not use as sole basis for investment decisions.",
  piotroski_progress_enrich: (done, total) => `Analyzing… (${done}/${total})`,
  piotroski_phase_enrich: "Enriching financial data…",
  piotroski_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  piotroski_fscore_badge: "Strong F-Score",
  piotroski_initial_guide: "Analyze your portfolio or search a ticker to start.",

  // O'Neil CAN SLIM
  oneil_analyzer_title: "William O'Neil CAN SLIM Analyzer",
  oneil_analyzer_desc:
    "Scores your holdings or any ticker against O'Neil's 7 CAN SLIM criteria: C (quarterly EPS growth ≥ 25%), A (annual EPS growth ≥ 25%), N (near 52-week high ≥ 90%), S (float shares < 50M), L (high relative strength), I (institutional ownership 30–70%), and M (market cap $2B–$50B). Ideal for discovering high-growth momentum stocks with explosive earnings and strong price action.",
  oneil_criterion_current: "Quarterly EPS Growth (C)",
  oneil_criterion_annual: "Annual EPS Growth (A)",
  oneil_criterion_newhigh: "Near 52-Week High (N)",
  oneil_criterion_supply: "Float Shares (S)",
  oneil_criterion_leader: "Relative Strength (L)",
  oneil_criterion_institutional: "Institutional Ownership (I)",
  oneil_criterion_cap: "Market Cap (M)",
  oneil_no_data: "No data",
  oneil_disclaimer:
    "※ Based on Yahoo Finance data. Do not use as sole basis for investment decisions.",
  oneil_progress_enrich: (done, total) => `Analyzing… (${done}/${total})`,
  oneil_phase_enrich: "Enriching financial data…",
  oneil_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  oneil_canslim_badge: "CAN SLIM Fit",
  oneil_initial_guide: "Analyze your portfolio or search a ticker to start.",

  // ─── Buffett Indicator ────────────────────────────────────────────────────
  buffett_indicator_title: "Buffett Indicator",
  buffett_indicator_subtitle: "US Stock Market Cap / GDP",
  buffett_indicator_ratio_label: "Current Ratio",
  buffett_indicator_market_cap: "Market Cap",
  buffett_indicator_gdp: "GDP",
  buffett_indicator_year: "Reference Date",
  buffett_indicator_loading: "Loading data…",
  buffett_indicator_error: "Unable to load data. Please try again later.",
  buffett_indicator_status_deep_under: "Significantly Undervalued",
  buffett_indicator_status_under: "Modestly Undervalued",
  buffett_indicator_status_fair: "Fairly Valued",
  buffett_indicator_status_over: "Modestly Overvalued",
  buffett_indicator_status_deep_over: "Significantly Overvalued",
  buffett_indicator_source: "Market Cap: Yahoo Finance ^W5000 · GDP: World Bank",
  buffett_indicator_desc: "The Buffett Indicator is the ratio of total US stock market capitalization to GDP. Buffett called it 'probably the best single measure of where valuations stand at any given moment.' Below 75% signals a buying opportunity; above 200% is 'playing with fire.'",

  settings_title: "Settings",
  settings_display_currency_title: "Display Currency",
  settings_display_currency_desc:
    "Select the base currency for displaying portfolio values.",
  settings_fx_title: "Exchange Rates",
  settings_fx_cache_warn: (time) =>
    `Rate fetch failed — using cached value (as of ${time})`,
  settings_data_refresh_title: "Rates & Prices",
  settings_data_refresh_refreshing: "Fetching…",
  settings_data_refresh_refresh: "Refresh Now",
  settings_data_refresh_auto:
    "Rates and prices are fetched automatically on app start.",
  settings_data_refresh_time: (time) => `As of ${time}`,
  settings_data_refresh_cache_warn: (time) =>
    `Fetch failed — using cached values (as of ${time})`,
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
  drive_syncing: "Loading\u2026",
  drive_saving: "Saving\u2026",
  drive_synced_at: (time) => `Synced at ${time}`,
  drive_sync_now: "Sync Now",
  drive_save_to_drive: "Save to Drive",
  drive_load_from_drive: "Load from Drive",
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
  settings_target_section_desc: "Set target allocation percentages by asset category. Sum must equal 100%.",
  settings_target_sum: (n) => `Total: ${n}%`,
  settings_target_save: "Save",
  settings_target_saved: "Saved",
  settings_data_title: "Data Backup & Management",
  settings_data_local_auto_note:
    "All portfolio data is automatically saved to your browser's local storage in real-time.",
  settings_data_local_title: "Reset Local Storage",
  settings_data_desc: "All data is stored in browser local storage.",
  settings_data_count: (n) => `Registered assets: ${n}`,
  settings_data_reset: "Reset All Data",
  settings_data_reset_confirm:
    "This will reset all data (assets, settings). This action cannot be undone.",
  settings_data_drive_title: "Google Drive Data Deletion",
  settings_data_drive_note:
    "To delete data saved on Google Drive, go to your Google Account's app permissions page (myaccount.google.com/permissions) and revoke access for this app. Revoking access will also delete the backup file stored in Drive.",

  profile_title: "My Profile",
  profile_desc:
    "Personal info used when chatting with gurus. Stored locally and never sent to any server. All inputs are automatically saved to your device in real-time.",
  profile_nickname_label: "Nickname (how gurus will address you)",
  profile_nickname_placeholder: "e.g. Alex",
  profile_age_label: "Age",
  profile_age_placeholder: "e.g. 35",
  profile_annual_income_label: "Annual Income",
  profile_annual_income_placeholder: "e.g. 60000",
  profile_monthly_budget_label: "Monthly Investment Budget",
  profile_monthly_budget_placeholder: "e.g. 1000",
  profile_plan3y_label: "3-Year Investment Plan",
  profile_plan3y_placeholder:
    "e.g. Within 3 years, target $500/mo in dividend income and shift toward growth…",
  profile_plan5y_label: "5-Year Investment Plan",
  profile_plan5y_placeholder:
    "e.g. By year 5, accumulate $100k for a down payment…",
  profile_plan10y_label: "10-Year Investment Plan",
  profile_plan10y_placeholder:
    "e.g. Achieve financial independence through passive income covering all living expenses…",
  profile_notes_label: "Notes & Caveats",
  profile_notes_placeholder:
    "e.g. Mortgage remaining: $230k (15 yrs left). $500/mo auto-invested in S&P 500 ETF, so only $300/mo is actively managed.",
  profile_save: "Save",
  profile_saved: "Saved",

  at_col_name: "Name",
  at_col_market: "Market",
  at_col_category: "Category",
  at_col_quantity: "Qty",
  at_col_avg_buy_price: "Avg. Cost",
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
  at_filter_all_market: "All Markets",
  at_filter_all_type: "All Types",
  at_filter_all_category: "All Categories",
  at_filter_clear: "Clear filters",
  at_filter_count: (shown, total) => `${shown} / ${total} assets`,
  at_filter_no_result: "No assets match the selected filters.",
  at_col_ticker: "Ticker",
  at_col_visibility: "Scope",
  at_filter_all_visibility: "All Scopes",
  at_filter_all_account: "All Accounts",
  filter_select_all: "Select All",
  filter_clear_all: "Clear All",
  ticker_search_no_result: "No results found.",
  ticker_search_error: "Search failed. Please check your network connection.",

  history_title: "Portfolio Value History",
  history_value: "Value",
  history_cost: "Cost Basis",
  history_pnl: "P&L",
  history_return: "Return",
  history_no_data: "Collecting data. The chart will appear from tomorrow.",
  history_range_1m: "1M",
  history_range_3m: "3M",
  history_range_6m: "6M",
  history_range_1y: "1Y",
  history_range_all: "ALL",
  history_all_portfolio_badge: "All Portfolio Basis",

  pnl_chart_title: "P&L by Asset",
  pnl_chart_pnl: "P&L",
  pnl_chart_profit: "Profit",
  pnl_chart_loss: "Loss",
  pnl_chart_top12: "Top 12 by absolute P&L",
  pnl_sort_abs: "By Impact",
  pnl_sort_profit: "By Gain",
  pnl_sort_return: "By Return",
  pnl_show_top20: "Top 20",
  pnl_show_all: (count) => `Show All (${count})`,
  pnl_summary_win_loss: (win, loss) => `Gain ${win} · Loss ${loss}`,

  af_mode_stock: "Search Ticker",
  af_mode_cash: "Cash / Deposit",
  af_mode_crypto: "Crypto",
  af_mode_manual: "Manual Entry",
  af_search_hint: "Enter a ticker or company name and search.",
  af_search_placeholder: "Ticker or name…",
  af_search_btn: "Search",
  af_searching: "Searching…",
  af_results_count: (n) => `${n} result${n !== 1 ? "s" : ""}`,
  af_no_results: "No results found",
  af_manual_hint:
    "Manually enter assets not found on Yahoo Finance (e.g. mutual funds).\nIf you know the ISIN or symbol, enter it and try fetching the current price.",
  af_entry_mode_simple: "Simple",
  af_entry_mode_detail: "Detailed",
  af_simple_amount_label: "Current Value *",
  af_simple_amount_placeholder: "Enter current market value",
  af_name_label: "Name *",
  af_ticker_label: "Symbol / ISIN (optional)",
  af_asset_type_label: "Asset Type",
  af_market_label: "Market",
  af_currency_label: "Currency",
  af_quantity_label: "Quantity *",
  af_avg_price_label: "Average Cost",
  af_current_price_label: "Current Price",
  af_current_price_help: "※ The entered price may be overwritten upon auto-refresh. However, for assets where auto-refresh fails (e.g. mutual funds), the manually entered price will be maintained, allowing manual PnL tracking.",
  af_current_price_auto: "Auto-fetched from Yahoo Finance",
  af_fetch_price_btn: "Fetch Price",
  af_fetching: "Fetching…",
  af_currency_placeholder: "Select currency",
  af_currency_no_result: "No results",
  af_back_to_search: "← Back to search",
  af_re_search: "← Search again",
  af_btn_cancel: "Cancel",
  af_btn_submit: "Save",
  af_manual_name_placeholder: "e.g. Vanguard S&P 500 Index Fund",
  af_manual_ticker_placeholder: "0P0001D75H.T or JP90C000KRC0",
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
  af_account_label: "Account",
  af_account_none: "No account",
  af_visibility_label: "Visibility Scope",
  af_visibility_help: "Choose whether this asset is included in the dashboard, Guru AI consultation, or both.",

  broker_manage_btn: "Accounts",
  broker_title: "Account Manager",
  broker_add_btn: "Add Account",
  broker_edit_btn: "Edit",
  broker_save_btn: "Save",
  broker_delete_btn: "Delete",
  broker_cancel_btn: "Cancel",
  broker_empty: "No accounts registered yet. Add one to get started.",
  broker_country_label: "Country",
  broker_name_label: "Institution",
  broker_type_label: "Account Type",
  broker_type_none: "None (Unspecified)",
  broker_type_custom: "Custom Input...",
  broker_type_custom_placeholder: "Enter custom account type (e.g., Trust, Custodial)",
  broker_nickname_label: "Nickname",
  broker_name_placeholder: "e.g. Fidelity, Chase, SBI Securities, Mirae Asset",
  broker_type_placeholder: "e.g. IRA, NISA, Taxable, ISA",
  broker_nickname_placeholder: "e.g. Fidelity Roth IRA, SBI NISA",
  broker_delete_confirm: "Delete this account?",
  broker_delete_inline_confirm: "Delete this account?",
  broker_confirm_btn: "Confirm",
  broker_col_nickname: "Nickname",
  broker_col_broker: "Institution",
  broker_col_type: "Account Type",
  broker_col_country: "Country",

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

  nav_fire: "FIRE Planner",
  fire_title: "FIRE Planner",
  fire_desc: "Predict when you can achieve FIRE based on your current assets, savings, and expected returns.",
  fire_tab_target: "By Target Amount",
  fire_tab_expense: "By Monthly Expense",
  fire_use_portfolio_assets: "Use Portfolio Assets",
  fire_current_assets: "Current Total Assets",
  fire_monthly_savings: "Monthly Savings",
  fire_helper_expected_return: "Historical average annual return of markets like S&P 500 is typically 7~10%.",
  fire_expected_return: "Expected Annual Return (%)",
  fire_target_amount: "Target Net Worth",
  fire_monthly_expense: "Target Monthly Expense",
  fire_helper_safe_withdrawal: "Based on the Trinity Study, a 4% rule is recommended so you won't run out of money.",
  fire_safe_withdrawal_rate: "Safe Withdrawal Rate (%)",
  fire_calculate_btn: "Calculate",
  fire_res_years_label: "Years to FIRE",
  fire_res_age_label: "Expected Age",
  fire_res_yrs: "YRS",
  fire_res_out_of_bounds: "Out of calculation bounds. Try increasing savings or returns!",
  fire_result_already_reached: "Congratulations! You have already reached your target.",
  fire_kpi_target_amount: "Target Assets",
  fire_kpi_total_contributions: "Total Contributions",
  fire_kpi_compound_growth: "Compound Growth",
  fire_kpi_years_to_fire: "FIRE Milestone",
  fire_kpi_already_achieved: "Goal Reached 🎉",
  fire_preset_conservative: "Conservative (4%)",
  fire_preset_moderate: "Moderate (7%)",
  fire_preset_aggressive: "Aggressive (10%)",
  fire_kpi_compound_leverage: "Compound Leverage",
  fire_kpi_compound_ratio: (ratio) => `+${ratio}% Compound Gain`,
  fire_kpi_years_suffix: (years) => `In ${years} Yrs`,
  fire_age_reached_badge: (age) => `Reach at ${age}`,
  fire_already_reached_desc: "Your current portfolio already exceeds your target. You can enjoy financial freedom today.",
  fire_age_unit: "Yrs",
  fire_swr_preset_conservative: "3.5% (Conservative)",
  fire_swr_preset_trinity: "4.0% (Trinity Rule)",
  fire_swr_preset_aggressive: "5.0% (Aggressive)",
  settings_data_drive_subtitle: "Google Drive Cloud Backup",
  fire_chart_title: "Projected Wealth Growth",
  fire_chart_asset: "Projected Assets",
  fire_chart_target: "Target Amount",
  fire_chart_milestone: "FIRE Milestone",
  fire_tooltip_year: (year, age) => `Year ${year}${age ? ` (Age ${age})` : ''}`,
  fire_age_label: "Current Age (Optional)",
  fire_age_placeholder: "e.g., 30",
  fire_error_savings_exceed_target: "Monthly savings exceed the target asset amount. Please check your target amount or monthly savings.",

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
  visibility_labels: {
    all: "All (Dashboard & Guru)",
    dashboard_only: "Dashboard Only",
    guru_only: "Guru Only",
    hidden: "Hidden",
  },
  visibility_descriptions: {
    all: "Included in both dashboard and Guru AI consultation.",
    dashboard_only: "Shown on dashboard only; excluded from Guru AI consultation.",
    guru_only: "Included in Guru AI consultation only; excluded from dashboard.",
    hidden: "Excluded from both dashboard and Guru AI consultation.",
  },
};
