import type { Translations } from "./types";

export const en: Translations = {
  nav_dashboard: "Dashboard",
  nav_assets: "Assets",
  nav_gurus: "Gurus",
  nav_settings: "Settings",
  nav_about: "About",
  app_tagline: "Unified Asset Management + AI & Guru Insights",
  app_version_info: "Browser storage",

  about_tagline: "Unified Asset Management + AI & Guru Insights",
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
    "Reference the philosophies and model portfolios of 20 legendary investors — Buffett, Dalio, Lynch, and more — and compare them with your own portfolio. Includes 6 quantitative analyzers: Lynch 10-Bagger, Greenblatt Magic Formula, Graham Defensive, Smith Quality Compounder, Piotroski F-Score, and O'Neil CAN SLIM. AI chat prompts in the persona of your chosen guru.",
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
    "All asset data is stored only in your browser's localStorage. Nothing is sent to an external server. No account creation needed. Optionally, you can enable Google Drive backup — data is saved only in an app-specific hidden folder (appDataFolder) with no access to your regular Drive files.",
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
  dash_sample_hint: "Sample data can be removed via Settings › Reset All Data.",
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
  holdings_col_weight: "Weight", holdings_col_per: "P/E",
  holdings_col_pbr: "P/B", holdings_show_all: (n) => `View all ${n}`,
  holdings_show_top10: "Top 10 only",

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
  asset_ai_modal_title: "AI Classification",
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
    'Paste AI response JSON here…\n\nExample:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "…" },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "…" }\n]',
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
  csv_preview_more: (n) => `… and ${n} more rows`,

  guru_title: "Investment Gurus",
  guru_empty_title: "Guru Analysis",
  guru_empty_desc:
    "Register your assets to compare your portfolio against a guru.",
  guru_philosophy_label: "Investment Philosophy",
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
  guru_ai_copied: "✓ Copied!",
  guru_ai_followup_btn: "Continue Previous Chat",
  guru_ai_followup_desc:
    "A prompt containing only the portfolio changes since your last conversation. Paste it into your previous chat to get an evaluation of what's changed.",
  guru_ai_followup_new_session: "Start New Conversation",
  guru_ai_followup_new_session_confirm:
    "This will clear the saved previous portfolio state and start fresh with the current state. Continue?",
  guru_ai_session_saved: "✓ Current portfolio state has been saved.",
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
    "Only when the tide goes out do you discover who's been swimming naked.",
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
    "The most important organ in the stock market is the brain, not the stomach.\n" +
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
    "• Broad Diversification: Structurally diversify across mutually uncorrelated assets like nominal bonds, inflation-linked bonds, gold, and commodities\n" +
    "• Radical Transparency: Pursue truth regardless of hierarchy and enforce an Idea Meritocracy within the organization\n" +
    "• Principles: Understand markets and life as a machine of cause-and-effect; systemize lessons from failures into algorithms\n" +
    "• Understanding Debt Cycles: Analyze short-term business cycles and long-term debt cycles to navigate macroeconomic turning points\n",
  guru_quotes_dalio:
    "He who lives by the crystal ball will eat shattered glass.\n" +
    "Pain + Reflection = Progress.",
  guru_philosophy_lilu:
    "• Buffett-Munger Approach in Asia: Systematically apply the purest form of value investing principles to the rapidly growing Chinese and Asian markets\n" +
    "• Deep Business Analysis: Thoroughly grasp the essence of business models, management integrity, and impenetrable long-term competitive advantages\n" +
    "• Ultra-Concentrated Portfolio: Commit massive amounts of capital to only a handful of life-changing, high-conviction ideas\n" +
    "• Long-Term Holding: Ignore short-term volatility entirely, maintaining a 5–10+ year horizon until intrinsic value is fully recognized\n" +
    "• Intellectual Honesty: Accurately acknowledge the limits of your own knowledge and rigorously stay within your Circle of Competence\n",
  guru_quotes_lilu:
    "The biggest risk in investing is not volatility, but permanent loss of capital.\n" +
    "A true value investor never tries to beat the market. They only control their own ignorance.",
  guru_philosophy_ackman:
    "• Activist Investing: Acquire massive stakes to actively engage with and force management to unlock hidden shareholder value\n" +
    "• Concentrated Portfolio: Make huge, high-conviction investments in a heavily concentrated portfolio of 5–10 world-class companies\n" +
    "• Business Model Analysis: Demand simple, highly predictable businesses with exceptional free cash flow and dominant brand moats\n" +
    "• Asymmetric Risk-Reward: Relentlessly hunt for asymmetric opportunities where the downside is strictly capped but the upside is potentially infinite\n" +
    "• Macro Hedging: Utilize massive derivative positions (like CDS) as ultimate defensive hedges against extreme macroeconomic shocks or pandemics\n",
  guru_quotes_ackman:
    "Concentration builds wealth; diversification preserves it.\n" +
    "The best investments are often the ones that people laugh at as terrible ideas at the time.",
  guru_philosophy_burry:
    "• Contrarian Investing: Willingly and decisively take positions diametrically opposed to the market consensus or mania\n" +
    "• Value-Based Analysis: Meticulously calculate intrinsic and asset values, completely ignoring herd mentality\n" +
    "• Macro Bets: Analyze deep macroeconomic trends, systemic risks, and asset bubbles to place massive directional wagers when conviction is absolute\n" +
    "• Independent Thinking: Isolate yourself from Wall Street narratives and rely solely on your own exhaustive, solitary research\n" +
    "• High Cash Reserves: Exhibit infinite patience, holding cash until a wildly asymmetric, undeniable opportunity presents itself\n",
  guru_quotes_burry:
    "I may be early, but I'm not wrong.\n" +
    "If everyone believes something, it’s a good bet that nobody has really tested it.",
  guru_philosophy_fisher:
    "• Global Macro: Analyze massive shifts in the world economy and historical market cycles to dictate top-down asset allocation\n" +
    "• Exploiting Sentiment: Capitalize on the irrational extremes of market crowds—buying max pessimism and selling max optimism\n" +
    "• Long-Term Equity Bias: Hold the firm conviction that equities will vastly outperform all other asset classes over the long haul in a capitalist system\n" +
    "• Broad Global Diversification: Completely eliminate home country bias by spreading investments extensively across the globe\n" +
    "• The Three Questions: Always ask what the market knows, what it doesn't know, and what it believes that is actually completely false\n",
  guru_quotes_fisher:
    "Markets climb a wall of worry.\n" +
    "What everyone knows is usually wrong, and therein lies the biggest opportunity.",
  guru_philosophy_cohen:
    "• Multi-Manager Model: Run a massive platform combining numerous independent trading strategies executed by brilliant, specialized portfolio managers\n" +
    "• Supreme Risk Management: Enforce ruthless stop-loss limits on every position and strictly manage total portfolio risk limits without exception\n" +
    "• Short-to-Medium Term Trading: Exploit short-term market inefficiencies through rapid decision-making and extraordinarily high portfolio turnover\n" +
    "• Information Edge: Base every decision on the most relentless, legally permissible research and alternative data analysis on Wall Street\n" +
    "• Flexible Strategy: Deploy whatever works best in the current environment—long/short equity, event-driven, or pure quantitative strategies\n",
  guru_quotes_cohen:
    "What matters is not how accurately you predict the future, but how ruthlessly you manage risk and cut losses.\n" +
    "The market is not perfectly efficient. Money is made where information is asymmetric.",
  guru_philosophy_marks:
    "• Market Cycle Theory: Understand that markets swing like a pendulum, and figuring out where we are in the cycle is paramount\n" +
    "• Second-Level Thinking: You can't do the same things as others and expect to outperform; you must think deeper and differently than the consensus\n" +
    "• Distressed Investing: Pioneer in distressed debt, finding true value and high-return opportunities where the crowd is panicking\n" +
    "• Risk = Permanent Loss: Define true risk exclusively as the probability of permanent capital loss, not temporary price volatility\n" +
    "• Defensive Investing: Focus far more heavily on limiting losses in bad times than maximizing gains in good times\n" +
    "• Price vs. Value: A great asset bought too expensively is a bad investment, while a bad asset bought cheaply enough is a great investment\n",
  guru_quotes_marks:
    "You can’t predict. You can prepare.\n" +
    "Experience is what you got when you didn't get what you wanted.\n" +
    "The most dangerous thing is to buy something at the peak of its popularity.",
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
    "The time of maximum pessimism is the best time to buy.",
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
    "• Disruptive Innovation: Concentrate on technologies that will transform the world in 5–10 years\n" +
    "• Five Key Themes: AI, robotics, energy storage, genomics, and blockchain innovation platforms\n" +
    "• Long-Term Growth Investing: Accept short-term volatility; bet on long-term growth potential\n" +
    "• Proactive Research: Proprietary future forecasts and price modeling by in-house research teams\n" +
    "• Transparent Management: Publicly disclose daily trades for full fund transparency\n",
  guru_quotes_wood:
    "Innovation solves problems and creates entirely new market opportunities.",

  guru_philosophy_druckenmiller:
    "• Macro Trading Mastery: Directional bets via analysis of correlations between currencies, rates, and equities\n" +
    "• Soros Protégé: Inherited and evolved strategies proven at the Quantum Fund — averaged ~30% annual returns over 30 years\n" +
    "• Concentrated Bets: \"When you have tremendous conviction on a trade, you have to go for the jugular.\"\n" +
    "• Momentum-Aware: Ride trends with conviction; pivot immediately when signals reverse — ego is the enemy\n" +
    "• Asymmetric Risk Management: Limit losses while maximizing upside through asymmetric position sizing\n",
  guru_quotes_druckenmiller:
    "The way to build long-term returns is through preservation of capital and home runs.",
  guru_philosophy_smith:
    "• Quality Compounders: \"Buy good companies, don't overpay, do nothing\"—a remarkably simple, yet brutally effective philosophy\n" +
    "• High ROIC Focus: Only invest in companies with wide moats that can sustainably reinvest capital at exceptionally high rates of return\n" +
    "• Concentrated Portfolio: Reject \"diworsification\"; concentrate in 25–30 core holdings and rely on the sheer quality of the ideas\n" +
    "• Quality Over Cheapness: Avoid low-quality \"cigar butts\" completely; willingly pay a fair price for outstanding business economics and cash flow\n" +
    "• Compounding Machine & Patience: True value investing is not trading; it is holding a compounding machine forever to maximize exponential returns\n",
  guru_quotes_smith:
    "I have a problem with the idea you should diversify to reduce risk. If you own a business, own the best.\n" +
    "The greatest mistake investors make is the urge to do something, when doing nothing is the right answer.",
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
  lynch_progress_enrich: (done, total) => `⏳ Analyzing… (${done}/${total})`,
  lynch_phase_enrich: "🔍 Enriching stocks with detailed fundamentals…",
  lynch_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  lynch_tenbagger_badge: "🚀 Tenbagger Candidate",
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
  mf_progress_enrich: (done, total) => `⏳ Analyzing… (${done}/${total})`,
  mf_phase_enrich: "🔍 Enriching stocks with detailed fundamentals…",
  mf_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  mf_magic_badge: "🪄 Magic Formula Pick",
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
  graham_progress_enrich: (done, total) => `⏳ Analyzing… (${done}/${total})`,
  graham_phase_enrich: "🔍 Enriching stocks with detailed fundamentals…",
  graham_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  graham_defensive_badge: "🛡️ Defensive Pick",
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
  smith_progress_enrich: (done, total) => `⏳ Analyzing… (${done}/${total})`,
  smith_phase_enrich: "🔍 Enriching stocks with detailed fundamentals…",
  smith_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  smith_quality_badge: "✨ Quality Compounder",
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
  piotroski_progress_enrich: (done, total) => `⏳ Analyzing… (${done}/${total})`,
  piotroski_phase_enrich: "🔍 Enriching financial data…",
  piotroski_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  piotroski_fscore_badge: "📊 Strong F-Score",
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
  oneil_progress_enrich: (done, total) => `⏳ Analyzing… (${done}/${total})`,
  oneil_phase_enrich: "🔍 Enriching financial data…",
  oneil_no_result: "No stock data received from Yahoo Finance. Please try again later.",
  oneil_canslim_badge: "🚀 CAN SLIM Fit",
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
  settings_data_refresh_refresh: "🔄 Refresh Now",
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
  settings_target_sum: (n) => `Total: ${n}%`,
  settings_target_save: "Save",
  settings_target_saved: "Saved",
  settings_data_title: "Data Management",
  settings_data_local_title: "Local Storage",
  settings_data_desc: "All data is stored in browser local storage.",
  settings_data_count: (n) => `Registered assets: ${n}`,
  settings_data_reset: "Reset All Data",
  settings_data_reset_confirm:
    "This will reset all data (assets, settings). This action cannot be undone.",
  settings_data_drive_title: "💡 Google Drive Data Deletion",
  settings_data_drive_note:
    "To delete data saved on Google Drive, go to your Google Account's app permissions page (myaccount.google.com/permissions) and revoke access for this app. Revoking access will also delete the backup file stored in Drive.",

  profile_title: "My Profile",
  profile_desc:
    "Personal info used when chatting with gurus. Stored locally and never sent to any server.",
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
  profile_saved: "✓ Saved",

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
  ticker_search_no_result: "No results found.",
  ticker_search_error: "Search failed. Please check your network connection.",

  history_title: "Portfolio Value History",
  history_value: "Value",
  history_cost: "Cost Basis",
  history_no_data: "Collecting data. The chart will appear from tomorrow.",

  pnl_chart_title: "P&L by Asset",
  pnl_chart_pnl: "P&L",
  pnl_chart_profit: "Profit",
  pnl_chart_loss: "Loss",
  pnl_chart_top12: "Top 12 by absolute P&L",

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
  af_current_price_auto: "✓ Auto-fetched from Yahoo Finance",
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
  broker_nickname_label: "Nickname",
  broker_name_placeholder: "e.g. Fidelity, Chase, SBI Securities, Mirae Asset",
  broker_type_placeholder: "e.g. IRA, NISA, Taxable, ISA",
  broker_nickname_placeholder: "e.g. Fidelity Roth IRA, SBI NISA",
  broker_delete_confirm: "Delete this account?",
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

  nav_fire: "Freedom Planner",
  fire_title: "Financial Freedom Planner",
  fire_desc: "Predict when you can achieve Financial Independence (FIRE) based on your current assets, savings, and expected returns.",
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
  fire_result_already_reached: "Congratulations! You have already reached your target. 🎉",
  fire_chart_title: "Projected Wealth Growth",
  fire_chart_asset: "Projected Assets",
  fire_chart_target: "Target Amount",
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
};
