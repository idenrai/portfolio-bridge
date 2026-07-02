import type { Translations } from "./types";

export const ja: Translations = {
  nav_dashboard: "ダッシュボード",
  nav_assets: "資産管理",
  nav_gurus: "投資家",
  nav_settings: "設定",
  nav_about: "アプリについて",
  app_tagline: "資産統合管理 + AI・グルーインサイト",
  app_version_info: "ブラウザ保存",

  about_tagline: "資産統合管理 + AI・グルーインサイト",
  about_intro:
    "Portfolio Bridgeは、韓国・米国・日本・ドイツの金融資産を一画面で管理し、AIや伝説の投資家たちの知恵からポートフォリオのインサイトを得るプライバシー重視のウェブアプリです。すべてのデータはブラウザ内にのみ保存され、外部サーバーへは送信されません。",
  about_features_title: "主な機能",
  about_feat1_title: "統合ダッシュボード",
  about_feat1_desc:
    "KPIサマリー、カテゴリー・市場別配分チャート、保有銘柄テーブル、リバランス提案を一目で確認できます。",
  about_feat2_title: "資産管理",
  about_feat2_desc:
    "Yahoo Financeで銘柄を検索するか、手動登録で多国籍資産を一元管理。AI自動分類、CSVインポート・エクスポートに対応。",
  about_feat3_title: "投資家",
  about_feat3_desc:
    "バフェット、ダリオ、リンチなど伝説の投資家20名の哲学と代表ポートフォリオを参考に、自分のポートフォリオと比較できます。リンチ10バガー・グリーンブラット魔法公式・グレアム防御的投資・スミスクオリティ・ピオトロスキーFスコア・オニールCAN SLIMの6種採点機で銘柄を分析。グルペルソナAIプロンプトも提供します。",
  about_feat4_title: "AI ポートフォリオ分析",
  about_feat4_desc:
    "保有銘柄データを盛り込んだ構造化プロンプトを生成。ChatGPT・Claude・Gemini・Grokに貼り付けるだけで、理想配分のアドバイスを得られます。",
  about_feat5_title: "自動インサイト",
  about_feat5_desc:
    "集中リスク、大きな損失、現金不足、為替エクスポージャー超過などを自動検知。インサイトカードとして表示されます。",
  about_feat6_title: "多言語・多通貨",
  about_feat6_desc:
    "韓国語・English・日本語・Deutschの4ヵ国語とKRW・USD・JPY・EURの通貨表示に対応しています。",
  about_privacy_title: "プライバシー重視",
  about_privacy_desc:
    "すべての資産データはブラウザのlocalStorageのみに保存されます。外部サーバーへの送信は一切なく、アカウント不要で即座にご利用いただけます。任意で個人のGoogle Driveと連携してデータをバックアップすることもできます。",
  about_tech_title: "技術スタック",
  about_links_live: "ライブデモ",
  about_links_github: "GitHub",
  about_disclaimer:
    "このアプリは個人学習およびポートフォリオ管理を目的として制作されました。提供される相場情報・為替レート・分析は参考用であり、投資判断の根拠として使用しないでください。",

  dash_title: "ダッシュボード",
  dash_empty_title: "ポートフォリオを始めましょう",
  dash_empty_desc:
    "「資産管理」メニューで保有資産を登録すると、ここにサマリーが表示されます。",
  dash_notice_storage:
    "💾 データはこの端末のブラウザにのみ保存されます。他の端末とは同期されないため、同じ端末・同じブラウザでご利用ください。",
  dash_notice_csv:
    "📁 資産データはCSVファイルでエクスポート/インポートが可能です。バックアップや端末移行時にご活用ください。",
  dash_notice_mobile:
    "🖥️ PCブラウザに最適化されています。モバイル画面には現在対応しておりません。",
  dash_sample_btn: "📈 サンプルデータで確認",
  dash_sample_hint:
    "サンプルデータは「設定 › 全データ初期化」で削除できます。",
  dash_refresh: "為替・時価更新",
  dash_refreshing: "取得中…",
  dash_updated_at: (time) => `${time}`,

  kpi_total_value: "総評価額",
  kpi_pnl: "評価損益",
  kpi_cash_weight: "現金比率",
  kpi_fx_exposure: "外貨エクスポージャー",
  kpi_holdings_unit: "銘柄",
  kpi_asset_type_unit: "資産クラス",

  chart_market: "国別配分",
  chart_category: "カテゴリー別配分",
  chart_no_data: "データなし",

  holdings_title: "保有銘柄",
  holdings_col_name: "銘柄",
  holdings_col_type: "種別",
  holdings_col_value: "評価額",
  holdings_col_pnl: "損益",
  holdings_col_return: "騰落率",
  holdings_col_weight: "比率", holdings_col_per: "PER",
  holdings_col_pbr: "PBR", holdings_show_all: (n) => `全${n}件を表示`,
  holdings_show_top10: "上位10件のみ",

  category_title: "カテゴリー目標 vs 実績",
  category_set_target: "目標設定",
  category_empty: "「目標設定」から目標配分を登録してください",
  category_legend_target: "目標",
  category_legend_normal: "正常",
  category_legend_over: "超過",
  category_legend_under: "不足",

  fx_title: "外貨エクスポージャー & シナリオ",
  fx_col_currency: "通貨",
  fx_col_value: "評価額",
  fx_col_weight: "比率",
  fx_col_rate: "為替レート",
  fx_scenario_title: "為替 ±5% シナリオ",

  rebalance_title: "リバランス提案",
  rebalance_ok: "✅ 配分は目標に近い状態です",
  rebalance_buy: "買い",
  rebalance_sell: "売り",

  insights_title: "インサイト",
  insights_ok: "✅ 特記事項なし",
  insights_ai_btn: "プロンプトを見る",
  insights_ai_copy: "クリップボードにコピー",
  insights_ai_copied: "✓ コピー済み!",
  insights_ai_desc:
    "下のプロンプトをコピーして、ChatGPT・Claude・Gemini・GrokなどのAIに貼り付けてください。",
  insights_ai_close: "閉じる",
  insights_ai_banner_title: "AI ポートフォリオ分析",
  insights_ai_banner_desc:
    "保有銘柄の詳細データを含むプロンプトを生成します。ChatGPT · Claude · Gemini · Grokに貼り付けて理想的な資産配分モデルと調整のインサイトを得ましょう。",
  insight_concentration: (name, pct) =>
    `${name} 比率${pct}% — 個別銘柄集中度が高い`,
  insight_big_loss: (name, pct) =>
    `${name} リターン${pct}% — 大幅な損失が発生中`,
  insight_cash_high: (pct) => `現金比率${pct}% — 流動性過多、投資機会の検討を`,
  insight_cash_low: (pct) => `現金比率${pct}% — 緊急資金不足に注意`,
  insight_fx_high: (currency, pct) =>
    `${currency} エクスポージャー${pct}% — 為替変動リスク大`,
  insight_category_over: (label, pct, target, diff) =>
    `${label} ${pct}% (目標${target}%) → +${diff}%p オーバーウェイト`,
  insight_category_under: (label, pct, target, diff) =>
    `${label} ${pct}% (目標${target}%) → ${diff}%p アンダーウェイト`,

  asset_title: "資産管理",
  asset_btn_ai: "プロンプトを見る",
  asset_ai_banner_title: "AI 資産分類",
  asset_ai_banner_desc:
    "カテゴリーのない資産をAIが自動的に分類します。プロンプトをChatGPT・Claude・Gemini・Grokに貼り付けると、各資産に適したカテゴリーを提案してもらえます。",
  asset_btn_import_csv: "CSVインポート",
  asset_btn_export_csv: "CSVエクスポート",
  asset_btn_add: "+ 資産追加",
  asset_modal_add: "新規資産登録",
  asset_modal_edit: "資産編集",
  asset_delete_confirm: "この資産を削除しますか？",
  asset_ai_modal_title: "🤖 AI分類",
  asset_ai_tab_generate: "① プロンプト生成",
  asset_ai_tab_import: "② AI回答インポート",
  asset_ai_copy_desc:
    "以下のプロンプトをコピーして ChatGPT・Claude・Gemini・Grok などの AI に貼り付けてください。",
  asset_ai_tab_link: "② AI回答インポート",
  asset_ai_copy: "クリップボードにコピー",
  asset_ai_copied: "✓ コピーしました！",
  asset_ai_close: "閉じる",
  asset_ai_import_desc: "AIが返答したJSONを下に貼り付けて",
  asset_ai_format_label: "形式:",
  asset_ai_json_placeholder:
    'AIの応答JSONをここに貼り付けてください…\n\n例:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "…" },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "…" }\n]',
  asset_ai_apply_btn: "カテゴリーを適用",
  asset_ai_apply_result: (applied, skipped) =>
    `✓ ${applied}件にカテゴリーを適用しました。${skipped > 0 ? `（${skipped}件スキップ）` : ""}`,
  asset_ai_parse_error: "パースエラー",
  exchange_rate_error:
    "為替レートの取得に失敗しました。手動で入力してください。",
  asset_ai_copy_link_pre: "回答が届いたら",
  asset_ai_copy_link_post: "タブで自動適用できます。",
  asset_ai_import_btn_suffix: "ボタンを押してください。",
  csv_preview_title: (n) => `CSVプレビュー — ${n}行`,
  csv_preview_confirm: "インポートを確定",
  csv_preview_more: (n) => `… 他${n}行`,

  guru_title: "投資家",
  guru_empty_title: "投資家分析",
  guru_empty_desc:
    "資産を登録すると、著名投資家のポートフォリオと比較・分析できます。",
  guru_philosophy_label: "投資哲学",
  guru_ideal_alloc: "理想的な資産配分",
  guru_radar_title: "マイポートフォリオ vs 投資家比較",
  guru_my_portfolio: "マイポートフォリオ",
  guru_rebalance_title: "リバランス提案",
  guru_col_category: "カテゴリー",
  guru_col_current: "現在",
  guru_col_guru_target: "投資家目標",
  guru_col_diff: "差異",
  guru_col_amount: "調整金額",
  guru_ai_banner_title: "師匠に聞く",
  guru_ai_banner_desc: "選択した投資家の視点でポートフォリオを分析します。",
  guru_ai_btn: "プロンプト生成",
  guru_ai_close: "閉じる",
  guru_ai_desc:
    "以下のプロンプトをコピーし、ChatGPT、Claude、Gemini、GrokなどのAIに貼り付けてください。",
  guru_ai_search_warn: "⚠️ AIが最新ニュースを検索するため、回答に数秒余分にかかる場合があります。",
  guru_ai_copy: "クリップボードにコピー",
  guru_ai_copied: "✓ コピー済み!",
  guru_ai_followup_btn: "前回の会話から続ける",
  guru_ai_followup_desc:
    "前回の会話以降のポートフォリオ変更のみを含むプロンプトです。前のチャットに貼り付けて、変化した点を評価してもらいましょう。",
  guru_ai_followup_new_session: "新しい会話を始める",
  guru_ai_followup_new_session_confirm:
    "保存された以前のポートフォリオ状態を削除し、現在の状態で新しく始めます。続けますか？",
  guru_ai_session_saved: "✓ 現在のポートフォリオ状態が保存されました。",
  guru_name_buffett: "ウォーレン・バフェット",
  guru_name_munger: "チャーリー・マンガー",
  guru_name_lynch: "ピーター・リンチ",
  guru_name_graham: "ベンジャミン・グレアム",
  guru_name_dalio: "レイ・ダリオ",
  guru_name_lilu: "リー・ルー",
  guru_name_ackman: "ビル・アックマン",
  guru_name_burry: "マイケル・バーリー",
  guru_name_fisher: "ケン・フィッシャー",
  guru_name_cohen: "スティーブン・コーエン",
  guru_name_marks: "ハワード・マークス",
  guru_name_klarman: "セス・クラーマン",
  guru_name_templeton: "ジョン・テンプルトン",
  guru_name_soros: "ジョージ・ソロス",
  guru_name_wood: "キャシー・ウッド",
  guru_name_druckenmiller: "スタンリー・ドラッケンミラー",
  guru_name_smith: "テリー・スミス",
  guru_name_greenblatt: "ジョエル・グリーンブラット",
  guru_name_piotroski: "ジョセフ・ピオトロスキー",
  guru_name_oneil: "ウィリアム・オニール",
  guru_philosophy_buffett:
    "• 経済的な堀（moat）：参入障壁が高く、持続的な競争優位性を持つ企業に着目\n" +
    "• 長期保有：理解できるビジネスを適正価格で購入し、永久に保有することを好む\n" +
    "• 配当成長 & 自社株買い：着実な株主還元方針と卓越した資本配分能力を重視\n" +
    "• 能力の輪（Circle of Competence）：自分が明確に理解している産業とビジネスモデルにのみ投資\n" +
    "• 素晴らしいビジネス：そこそこの企業を素晴らしい価格で買うより、素晴らしい企業をそこそこの価格で買う方が遥かに良い\n" +
    "• 無知の克服：複雑なデリバティブや理解できないビジネスを徹底的に排除\n" +
    "• 現金オプション：危機的状況で流動性を供給し好機を掴むため、常に莫大な現金を待機させる\n",
  guru_quotes_buffett:
    "ルール1：絶対に損をするな。ルール2：ルール1を忘れるな\n" +
    "他人が強欲な時に恐怖を抱き、他人が恐怖を抱いている時に強欲であれ\n" +
    "潮が引いて初めて、誰が裸で泳いでいたかが分かる",
  guru_philosophy_munger:
    "• 集中投資：少数の優れた企業に強い確信がある時のみ大規模に集中ベット\n" +
    "• メンタルモデル（多分野的思考）：心理学・物理学・生物学・数学・歴史学など多分野の中核原理を融合して思考\n" +
    "• 忍耐力：頻繁な売買を避け、素晴らしいビジネスが長い時間をかけて複利を生むよう「何もしないこと」の美徳を強調\n" +
    "• 流行アイデアの回避：大衆の物語や群衆思考に流されず、真に独立した判断を維持\n" +
    "• 回避の技術（逆転の思考）：どうすれば失敗するかをまず問い、愚かな行動を体系的に避けることで成功を達成\n" +
    "• 継続的学習：毎日起きた時より少し賢くなろうと努め、絶え間ない読書と反芻を実践\n" +
    "• インセンティブの力：インセンティブの仕組みが人間の行動とビジネス結果に与える絶大な影響を絶対的に重視\n",
  guru_quotes_munger:
    "逆から考えよ。常に逆から考えよ（Invert, always invert）\n" +
    "私にインセンティブを見せれば、結果を見せてやろう\n" +
    "私たちが長期的に成功した理由は、非常に賢くなろうとしたからではなく、継続的に愚かなことを避けようとしたからだ",
  guru_philosophy_lynch:
    "• 日常の投資アイデア：生活の中で急成長する製品・サービスを誰よりも早く発見し、ファンダメンタルズ分析で検証\n" +
    "• PEGレシオ：PERを利益成長率で割り、株価に成長がどれだけ織り込まれているか適正バリュエーションを判断\n" +
    "• テンバガー追求：数十倍に成長する可能性を秘めた中小型株を発掘し、10倍以上の驚異的リターンを目標とする\n" +
    "• 幅広い分散投資：数百銘柄を保有してリスクを分散しつつ、それぞれの投資根拠を明確に管理\n" +
    "• 徹底したリサーチ：企業訪問、経営陣との面談、財務諸表分析など、泥臭い現地調査を重んじる\n" +
    "• カクテルパーティー理論：大衆が株に熱狂する時が天井であり、誰もが株を無視する時が底であるという群集心理指標\n",
  guru_quotes_lynch:
    "自分が何をなぜ保有しているのか、明確に説明できなければならない\n" +
    "株式市場で最も優れた器官は胃袋ではなく、脳である\n" +
    "優れた企業の株を保有しているなら、時間はあなたの味方だ",
  guru_philosophy_graham:
    "• 安全マージン（Margin of Safety）：本質的価値に対して極端に割安な価格でのみ購入し、判断ミスの余地を防御\n" +
    "• ミスター・マーケット：市場は毎日気まぐれに価格を提示する共同経営者に過ぎない。市場の感情に振り回されず、それを利用せよ\n" +
    "• 守りの投資：元本保全と下方リスクの防御を最優先とする極めて保守的なアプローチ\n" +
    "• 株式-債券バランス配分：株式25〜75%、残りを債券とし、市場状況に応じて機械的にポートフォリオを調節\n" +
    "• 定量分析：経営陣の約束やテーマなどの感情を徹底的に排除し、正味流動資産価値（NCAV）など財務データに基づく冷静な企業評価\n",
  guru_quotes_graham:
    "投資とは、徹底的な分析を通じて元本の安全性と適切な収益を約束するものであり、この要件を満たさないものは投機である\n" +
    "投資家の最大の問題であり、最悪の敵は、多くの場合自分自身である\n" +
    "短期的には市場は投票機だが、長期的には計量器である",
  guru_philosophy_dalio:
    "• オールウェザー戦略：経済サイクルを経済成長（加速/減速）とインフレ（上昇/下落）の4象限に分け完璧に備える\n" +
    "• リスクパリティ：資本額ではなく「資産クラスごとのリスク寄与度」を均等に配分し、特定資産の変動に振り回されないポートフォリオを構築\n" +
    "• 幅広い分散：株・名目債券・物価連動債・金・コモディティなど、相互に相関性が低い資産に構造的に分散投資\n" +
    "• 極端な透明性（Radical Transparency）：組織内で役職に関係なく真実を追求し、アイデアの実力主義（Idea Meritocracy）を実践\n" +
    "• 原則（Principles）：市場と人生を機械的な因果関係として理解し、失敗から得た教訓をアルゴリズムと体系的プロセスとしてシステム化\n" +
    "• 債務サイクルの理解：短期債務サイクル（ビジネスサイクル）と長期債務サイクルを分析し、マクロ経済の転換点に対応\n",
  guru_quotes_dalio:
    "水晶玉に頼って生きる者は、砕けたガラスを食べることになる\n" +
    "苦痛に反省を加えれば進歩になる（Pain + Reflection = Progress）",
  guru_philosophy_lilu:
    "• バフェット-マンガー流のアジア適用：バリュー投資の原則を、構造的成長が起きている中国・アジア市場で実践\n" +
    "• 深い企業分析：ビジネスモデルの本質、経営陣の誠実さ、そして長期的な競争優位性を徹底的に把握\n" +
    "• 超集中ポートフォリオ：一生に数回しかない高い確信を持つ少数銘柄にのみ大規模に資本を投下\n" +
    "• 長期保有：短期的な価格変動を無視し、企業の本質的価値が価格に反映されるまで5〜10年以上の超長期視点を維持\n" +
    "• 知的誠実さ：自らの無知と能力の限界を明確に認め、能力の輪（Circle of Competence）の中で徹底的に投資\n",
  guru_quotes_lilu:
    "投資における最大のリスクは価格変動ではなく、恒久的な資本損失だ\n" +
    "真のバリュー投資家は決して市場を打ち負かそうとはしない。彼らはただ自らの無知をコントロールするだけだ",
  guru_philosophy_ackman:
    "• アクティビスト投資：大規模な株式を取得後、企業経営に積極的に関与し、隠れた株主価値を強制的に引き出す\n" +
    "• 集中ポートフォリオ：最も確信を持てる5〜10社のシンプルで予測可能な優良企業に大規模集中投資\n" +
    "• ビジネスモデル分析：フリーキャッシュフローが豊富で、ブランド力が強く、参入障壁の高い強力な堀を持つ企業を選好\n" +
    "• 非対称リターン：損失の可能性と金額は極めて限定的だが、成功時に得る上方余地は無限大の機会を追求\n" +
    "• マクロヘッジ：市場の暴落やパンデミックなどの極端なマクロ経済シナリオに備え、CDSなどの巨大な防御的派生商品ポジションを活用\n",
  guru_quotes_ackman:
    "富は集中によって築かれ、分散によって守られる\n" +
    "最高の投資は、大衆がそれを最悪のアイデアだと嘲笑する時に行われる",
  guru_philosophy_burry:
    "• 逆張り投資：市場多数の意見や熱狂に反するポジションを取ることを少しも躊躇わない\n" +
    "• バリューベース分析：群集心理を完全に排除し、企業の本質的価値と資産価値を精密かつ執拗に算出\n" +
    "• マクロベッティング：マクロ経済のトレンド、システミックリスク、資産バブルを深く分析し、確信を持てば巨大な方向性に賭ける\n" +
    "• 孤独な独立思考：ウォール街の主流の物語や他人の意見に流されず、徹底的に孤立した独自の分析のみに依存\n" +
    "• 高い現金比率：市場に確実で魅力的な機会が訪れるまで、果てしない忍耐を持って現金を保有し続ける\n",
  guru_quotes_burry:
    "私は早く間違えたのではない、早く正しかっただけだ\n" +
    "誰もが何かを信じているということは、誰もそれを検証していないということだ",
  guru_philosophy_fisher:
    "• グローバルマクロ：世界経済の巨大な流れと歴史的な市場サイクルを分析し、マクロ的な資産配分を決定\n" +
    "• 投資心理の逆利用：市場の極端な恐怖や過剰な楽観など、大衆の偏りを逆手にとって収益機会として活用\n" +
    "• 長期株式比率の拡大：資本主義システムにおいて、株式が長期的に他のどの資産よりも圧倒的に高いリターンを提供すると確信\n" +
    "• 幅広いグローバル分散：特定の国やセクターに偏るホームバイアスを排除し、世界中に幅広く分散投資\n" +
    "• 3つの質問：市場が知っていること、知らないこと、そして間違って信じていることを鋭く区別し、エッジを確保\n",
  guru_quotes_fisher:
    "市場は常に心配の壁を登っていく\n" +
    "誰もが知っていると思っていることは大抵間違っており、そこに最大の機会がある",
  guru_philosophy_cohen:
    "• マルチマネージャーモデル：多数の独立した投資戦略と天才的なマネージャーたちを一つのプラットフォームで並行運用\n" +
    "• リスク管理最優先：ポジションごとの厳格な損切りラインの設定と、ポートフォリオ全体のリスク限度を無慈悲に管理\n" +
    "• 短中期の取引：市場の短期的な非効率性を捉え、迅速な意思決定と高いポートフォリオ回転率で絶対収益を追求\n" +
    "• 情報の優位性：ウォール街最高水準の執拗なリサーチ能力と、膨大なオルタナティブデータ分析に基づく投資決定\n" +
    "• 柔軟な戦略：ロング/ショート・エクイティ、イベント・ドリブン、クオンツなど、市場環境に合わせてあらゆる戦略を動員\n",
  guru_quotes_cohen:
    "重要なのは予測の正確さではなく、損失をコントロールする無慈悲なリスク管理である\n" +
    "市場は効率的ではない。情報が非対称である時にこそ金が儲かる",
  guru_philosophy_marks:
    "• 市場サイクル理論：市場は直線ではなく振り子のように揺れ動いており、現在私たちがサイクルのどこにいるかを把握することが核心\n" +
    "• 2次的思考（Second-Level Thinking）：他人と同じことをして超過収益は得られない。合意された大衆の考えより一次元深く、異なる思考が必要\n" +
    "• ディストレス投資：不良債権や危機的資産など、大衆が避ける場所で真の価値と高いリターン機会を捕捉\n" +
    "• リスクの本質：リスクとは短期的な「ボラティリティ（変動性）」ではなく、「永久的な資本損失（Permanent Loss of Capital）」の可能性と定義\n" +
    "• 守りの投資：好況時に最大収益を追うより、不況時に損失を抑える防御的なポジショニングに遥かに集中\n" +
    "• 価格と価値の乖離：どんなに良い資産も高く買えば悪い投資になり、悪い資産も十分に安く買えば良い投資になる\n",
  guru_quotes_marks:
    "未来を予測することはできないが、準備することはできる\n" +
    "経験とは、自分が望んでいたものを手に入れられなかった時に得られるものだ\n" +
    "最も危険な投資は、リスクがないと信じることである",
  guru_philosophy_klarman:
    "• 安全マージンの継承：グレアムの安全マージン哲学を現代市場に適用\n" +
    "• 絶対リターン追求：ベンチマーク対比の相対リターンではなく絶対リターンに集中\n" +
    "• 高い現金比率：良い機会がない時は現金比率を50%まで高めることも厭わない\n" +
    "• 市場の恐怖を活用：危機時に他者が売る中、割安資産を積極的に購入\n" +
    "• 下方保護最優先：リターン最大化より元本保全をより重視\n",
  guru_quotes_klarman:
    "バリュー投資とは、逆張り気質と計算機の結婚である",
  guru_philosophy_templeton:
    "• グローバル逆張り：大衆がパニックに陥り資産を投げ売りする「最大悲観ポイント（Point of Maximum Pessimism）」で攻撃的に買い向かう\n" +
    "• 国境のない投資：ホームバイアスを完全に排除し、世界中のあらゆる国や資産クラスから最も割安な機会を執拗に探索する\n" +
    "• 長期バリュー投資：短期的なノイズを無視し、企業の本質的価値が実現するまで5〜10年以上の長期保有を完全に貫く\n" +
    "• 定量スクリーニング：低PER、低PBR、高利益率などの厳格な定量指標を活用し、市場のノイズをフィルタリングする\n" +
    "• 柔軟性と受容：特定の資産やスタイルに固執せず、現在最も価値のある市場がどこであっても動的に投資スタイルを適応させる\n",
  guru_quotes_templeton:
    "最大悲観の時こそが最高の買い時であり、最大楽観の時こそが最高の売り時である\n" +
    "大衆より優れたパフォーマンスを出したいなら、大衆とは違う行動を取らなければならない\n" +
    "投資において最も危険な4つの言葉は『今回は違う（This time it's different）』だ",
  guru_philosophy_soros:
    "• 再帰性理論（Reflexivity）：市場は効率的ではなく、参加者の偏った認識が市場価格に影響を与え、それが再びファンダメンタルズを変化させるフィードバックループを生成\n" +
    "• 大規模な方向性ベット：マクロ経済の不均衡を捉え、確信を持った時、通貨・債券・株式など資産クラスを問わずレバレッジを動員して巨大なベットを行う\n" +
    "• グローバルマクロ：政治・経済・社会の変化、中央銀行の政策方向を読み解き、マクロ的な投資機会を発掘\n" +
    "• 素早い損切りと生存：生き残ることが最重要であり、仮説が間違っていると判断した場合は直ちにポジションを清算して逃げるべき\n" +
    "• 混沌と非効率性の活用：市場の不安定性やバブルが形成される初期段階を、むしろ収益機会として積極的に活用\n" +
    "• 誤謬性（Fallibility）：人間は必然的に誤りを犯すものであり、自らの仮説が間違っている可能性を常に開いて疑う\n",
  guru_quotes_soros:
    "正しいか間違っているかよりも、正しい時にいくら稼ぎ、間違った時にいくら失うかが重要だ\n" +
    "市場は常に間違っている\n" +
    "私が金持ちなのは、自分がいつ間違ったかを知り、間違いを素早く認めるからだ",
  guru_philosophy_wood:
    "• 破壊的イノベーション：現在のビジネスモデルを完全に破壊し、5〜10年後の世界を支配する技術にのみ集中投資\n" +
    "• 5大コアテーマ：AI、ロボティクス、エネルギー貯蔵、ゲノミクス（DNAシーケンシング）、ブロックチェーンが創出する指数関数的成長にベット\n" +
    "• 長期成長投資：革新的な技術が成熟するまでに発生する極めて激しい短期的なボラティリティを当然のものとして甘受し、長期的ポテンシャルに集中\n" +
    "• ライトの法則（Wright's Law）の適用：累積生産量が増加するにつれてコストが一定割合で低下するという原則を、テスラなどの技術株バリュエーションに適用\n" +
    "• 透明な運用体制：自社リサーチチームのオープンソースベースのリサーチと、毎日のファンド売買履歴を透明に大衆と共有\n",
  guru_quotes_wood:
    "イノベーションは課題を解決し、これまで存在しなかった全く新しい市場機会を創出する\n" +
    "私たちは歴史の正しい側、イノベーションの側に立ち、明日を早めている",

  guru_philosophy_druckenmiller:
    "• マクロ運用の名手：マクロ経済、金融政策、金利、株式の相関関係を洞察し、確信が持てた時に巨大な方向性ポジションを構築\n" +
    "• 資本保全最優先：ジョージ・ソロスのクォンタム・ファンド時代から一貫して下方リスクを統制し、30年以上にわたりマイナス収益率を記録した年がない\n" +
    "• 高確信の集中ベット：平凡なアイデアには分散投資で防御するが、絶大な確信がある瞬間には全資本を集め、レバレッジでホームランを狙う\n" +
    "• 柔軟性とトレンド追従：自らの分析が間違っていると判断したり、市場の巨大なトレンドが崩れたりした場合はプライドを捨て、即座にポジションを180度転換\n" +
    "• 非対称リスク管理：間違った賭けの損失は極めて短く断ち切り、正しい賭けの収益区間は執拗に長く持ち続けて絶対収益を創出\n",
  guru_quotes_druckenmiller:
    "長期的に圧倒的な収益率を生み出す道は、徹底的な資本保全と、時折打つ巨大なホームランだ\n" +
    "卵を一つのカゴに入れろ。そしてそのカゴを昼夜問わず非常に注意深く見張れ",
  guru_philosophy_smith:
    "• 優良企業の長期保有：「良い企業を買い、買い過ぎず、何もしない（Buy good companies, don't overpay, do nothing）」という極端にシンプルで強力なコア原則\n" +
    "• 高ROIC重視：資本を再投資し、持続的に高い利益を生み出す独占的な堀を持つ企業だけを徹底的に選別し、長期の複利成長を追求\n" +
    "• 集中ポートフォリオ：市場収益率を食い潰す過度な分散を拒否し、約25〜30のコア銘柄にのみ集中してアイデアの質で勝負\n" +
    "• クオリティ優先：一時的に割安なだけの低品質株（シガー・バッツ）よりも、事業の質、強力なフリーキャッシュフロー、圧倒的な経営効率を遥かに高く評価\n" +
    "• 複利メカニズムと忍耐：バリュー投資の本質は頻繁な取引ではなく、内部再投資収益率の高い偉大な企業を永遠に保有し、複利効果を最大化すること\n",
  guru_quotes_smith:
    "リスクを減らすために盲目的に分散するアプローチには賛同しない。保有するなら最高の企業を保有せよ\n" +
    "投資家が犯す最大の過ちは、ポートフォリオをいじり回し、何かをしなければならないと感じることだ",
  guru_philosophy_greenblatt:
    "• マジック・フォーミュラ（魔法の公式）：高い益回り(Earnings Yield)で割安さを、高い資本収益性(ROIC)で企業の質を同時に満たす銘柄を機械的に選別\n" +
    "• 定量バリュー投資：強欲と恐怖という人間の感情を徹底的に排除し、数学的ルールに従って冷酷に資本を配分するシステム型アプローチ\n" +
    "• 放置された優良株の発掘：市場が一時的な悪材料で無関心に投げ売りした、割安かつ高品質な企業を体系的なフィルタリングで見つけ出す\n" +
    "• 分散運用と定期リバランス：20〜30銘柄で個別企業のリスクを分散し、1年単位の機械的なリバランスでファクター戦略の一貫性を維持\n" +
    "• 忍耐が核心：戦略が統計的に有効であっても、3〜4年程度は市場に劣後することがあり、この苦痛に耐えてこそ長期的な超過収益を得られる\n",
  guru_quotes_greenblatt:
    "価値を先に見積もり、それより遥かに安く買え。短期的な市場はミスター・マーケットの感情に振り回される\n" +
    "魔法の公式が常に機能するわけではないというその事実こそが、長期的に魔法の公式を機能させる核心的な原動力である",
  guru_philosophy_piotroski:
    "• Fスコア（ピオトロスキー・スコア）：9つの厳格な二値財務基準（収益性、財務構造、営業効率）により企業のファンダメンタルズ健全性を0〜9点で定量評価\n" +
    "• バリュー株フィルター：単に簿価対市価(BM)が高いだけの割安株（バリュートラップ）を避け、ターンアラウンド中か財務体質が強固な優良バリュー株だけを選別\n" +
    "• 収益性とキャッシュフロー評価：純利益よりもキャッシュフローが大きいか（発生主義品質）、ROAが前年比で改善したかなど、利益の質を最優先\n" +
    "• 財務健全性の追跡：新規株式発行の有無、負債比率の減少、流動比率の改善など、財務的安定性が確保された企業にのみ資本を投入\n" +
    "• 運営効率性の診断：粗利率の上昇と資産回転率の改善など、経営効率化が実質的に進行しているかをデータで証明\n",
  guru_quotes_piotroski:
    "単に安い株を買うのは危険だ。その企業の財務諸表が改善しているという決定的な証拠をデータで確認せよ\n" +
    "高BM企業のうち、財務が強固な9点満点の銘柄だけがバリュー投資の勝率を圧倒的に高めてくれる",
  guru_philosophy_oneil:
    "• CAN SLIMシステム：企業のファンダメンタルズと株価チャートのテクニカル分析を完璧に融合し、超高速成長株を選別する体系的投資手法\n" +
    "• C（当期業績）＆ A（年間業績）：直近四半期EPSが前年同期比で最低でも25%以上成長しており、過去3〜5年間にわたり爆発的成長を持続した企業を追求\n" +
    "• N（新製品・新高値）：世界を揺るがす革新的な新製品やサービスを持ち、株価が52週新高値を突破する強気モメンタムで買い\n" +
    "• S・L・I・M要件：供給が少ない株式、市場を主導する1位の先導株、機関投資家の積極的な買い、そして市場全体の確固たる上昇トレンド入りを総合判断\n" +
    "• 無慈悲な損切りルール：買値から7〜8%下落した場合は、いかなる例外や言い訳もなしに機械的に損切りし、壊滅的な資本損失を根源から遮断\n",
  guru_quotes_oneil:
    "株式市場で勝つ最大の秘訣は、自分が間違っていた時に失う金額を極力少なくし、素早く撤退することだ\n" +
    "安い株を買って安く売るな。高い株を買ってさらに高く売れ\n" +
    "最も偉大な株は常に最初は高すぎるように見え、最もひどい株は常に最も安く見える",
    lynch_tenbagger_title: "ピーター・リンチ テンバガー採点",
  lynch_tenbagger_desc:
    "保有株や気になる銘柄をピーター・リンチのPEG・成長・財務基準でスコアリングします。PEG < 1.0、EPS成長率 > 15%、売上成長率 > 10%、D/E < 80%、営業利益率 > 10%、時価総額$10B未満ほど高スコア。低PEG・高成長の中小型株発掘に最適です。",
  lynch_criterion_peg: "PEGレシオ",
  lynch_criterion_eps: "EPS成長率",
  lynch_criterion_rev: "売上成長率",
  lynch_criterion_debt: "負債比率 (D/E)",
  lynch_criterion_margin: "営業利益率",
  lynch_criterion_cap: "時価総額",
  lynch_no_data: "データなし",
  lynch_disclaimer:
    "※ Yahoo Financeの財務データに基づきます。投資判断の根拠として使用しないでください。",
  lynch_progress_enrich: (done, total) => `⏳ 詳細分析中… (${done}/${total})`,
  lynch_phase_enrich: "🔍 銘柄の詳細な財務データを補強中…",
  lynch_no_result: "⚠️ Yahoo Financeから銘柄データを取得できませんでした。しばらくしてから再試行してください。",
  lynch_tenbagger_badge: "🚀 テンバガー候補",
  lynch_initial_guide: "ポートフォリオ分析またはティッカー検索で採点を開始してください。",

  // ─── Analyzer Common (mode tabs) ─────────────────────────────────────────────
  analyzer_mode_portfolio: "マイポートフォリオ",
  analyzer_mode_search: "ティッカー検索",
  analyzer_portfolio_desc: (count) => `ポートフォリオ内の株式 ${count}銘柄を採点します。`,
  analyzer_btn_portfolio: "ポートフォリオ採点",
  analyzer_btn_search: "分析",
  analyzer_search_placeholder: "ティッカーまたは銘柄名を入力（例：AAPL、トヨタ）",

  // ─── Magic Formula Analyzer ──────────────────────────────────────────────────
  mf_title: "ジョエル・グリーンブラット マジック・フォーミュラ採点",
  mf_desc:
    "高い益回り(EY)と高い資本収益率(ROC)を兼ね備えた銘柄を採点します。EY > 10%、ROC > 25%、営業利益率 > 15%、D/E < 50%、時価総額$1B–$10B帯ほど高スコア。感情を排したルール基盤のバリュー株発掘に最適です。",
  mf_criterion_ey: "益回り",
  mf_criterion_roc: "資本収益率",
  mf_criterion_margin: "営業利益率",
  mf_criterion_debt: "負債比率 (D/E)",
  mf_criterion_cap: "時価総額",
  mf_no_data: "データなし",
  mf_disclaimer:
    "※ Yahoo Financeの財務データに基づきます。投資判断の根拠として使用しないでください。",
  mf_progress_enrich: (done, total) => `⏳ 詳細分析中… (${done}/${total})`,
  mf_phase_enrich: "🔍 銘柄の詳細な財務データを補強中…",
  mf_no_result: "⚠️ Yahoo Financeから銘柄データを取得できませんでした。しばらくしてから再試行してください。",
  mf_magic_badge: "🪄 マジック・フォーミュラ適合",
  mf_initial_guide: "ポートフォリオ分析またはティッカー検索で採点を開始してください。",

  // Graham
  graham_analyzer_title: "ベンジャミン・グレアム 防御的投資 採点器",
  graham_analyzer_desc:
    "保有株または任意のティッカーをグレアムの安全余裕基準で採点します。P/E < 15、P/B < 1.5、グレアムナンバー(P/E×P/B) < 22.5、流動比率 > 2.0、D/E < 50%、配当利回り > 3%ほど高スコア。財務的に安定した割安ディフェンシブ株の発掘に最適です。",
  graham_criterion_pe: "P/E比率",
  graham_criterion_pb: "P/B比率",
  graham_criterion_gn: "グレアムナンバー",
  graham_criterion_cr: "流動比率",
  graham_criterion_debt: "負債比率 (D/E)",
  graham_criterion_div: "配当利回り",
  graham_no_data: "データなし",
  graham_disclaimer:
    "※ Yahoo Financeの財務データに基づきます。投資判断の根拠として使用しないでください。",
  graham_progress_enrich: (done, total) => `⏳ 詳細分析中… (${done}/${total})`,
  graham_phase_enrich: "🔍 銘柄の詳細な財務データを補強中…",
  graham_no_result: "⚠️ Yahoo Financeから銘柄データを取得できませんでした。しばらくしてから再試行してください。",
  graham_defensive_badge: "🛡️ 防御的投資適合",
  graham_initial_guide: "ポートフォリオ分析またはティッカー検索で採点を開始してください。",

  // Smith
  smith_analyzer_title: "テリー・スミス クオリティコンパウンダー 採点器",
  smith_analyzer_desc:
    "保有株または任意のティッカーをスミスのクオリティコンパウンダー基準で採点します。ROE > 20%、営業利益率 > 15%、FCF転換率 > 80%、売上成長率 > 10%、D/E < 50%ほど高スコア。高い収益性とキャッシュ創出力を持つ複利成長型の優良株発掘に最適です。",
  smith_criterion_roe: "ROE",
  smith_criterion_margin: "営業利益率",
  smith_criterion_fcf: "FCF転換率",
  smith_criterion_rev: "売上成長率",
  smith_criterion_debt: "負債比率 (D/E)",
  smith_no_data: "データなし",
  smith_disclaimer:
    "※ Yahoo Financeの財務データに基づきます。投資判断の根拠として使用しないでください。",
  smith_progress_enrich: (done, total) => `⏳ 詳細分析中… (${done}/${total})`,
  smith_phase_enrich: "🔍 銘柄の詳細な財務データを補強中…",
  smith_no_result: "⚠️ Yahoo Financeから銘柄データを取得できませんでした。しばらくしてから再試行してください。",
  smith_quality_badge: "✨ クオリティコンパウンダー",
  smith_initial_guide: "ポートフォリオ分析またはティッカー検索で採点を開始してください。",

  // Piotroski F-Score
  piotroski_analyzer_title: "ピオトロスキー Fスコア採点",
  piotroski_analyzer_desc:
    "保有株や任意のティッカーをピオトロスキの9つの二項財務基準で採点します。収益性(ROA > 0、営業CF > 0、ΔROA改善、CF > 純利益)、財務健全性(負債減少、流動比率改善、株式希薄化なし)、運営効率(粗利率・資産回転率改善)の3分野計9点満点。財務体質が堅固なバリュー株の選別に最適です。",
  piotroski_criterion_roa: "ROA（総資産利益率）",
  piotroski_criterion_cfo: "営業キャッシュフロー",
  piotroski_criterion_delta_roa: "ΔROA（前年比）",
  piotroski_criterion_accruals: "発生主義品質",
  piotroski_criterion_delta_leverage: "Δ長期負債",
  piotroski_criterion_delta_liquidity: "Δ流動比率",
  piotroski_criterion_equity_dilution: "株式希薄化",
  piotroski_criterion_delta_margin: "Δ粗利率",
  piotroski_criterion_delta_turnover: "Δ資産回転率",
  piotroski_no_data: "データなし",
  piotroski_disclaimer:
    "※ Yahoo Finance の財務データに基づきます。投資判断の唯一の根拠にしないでください。",
  piotroski_progress_enrich: (done, total) => `⏳ 詳細分析中… (${done}/${total})`,
  piotroski_phase_enrich: "🔍 銘柄の詳細財務データを補強中…",
  piotroski_no_result: "⚠️ Yahoo Financeから銘柄データを取得できませんでした。しばらくしてから再試行してください。",
  piotroski_fscore_badge: "📊 Fスコア優良",
  piotroski_initial_guide: "ポートフォリオ分析またはティッカー検索で採点を開始してください。",

  // O'Neil CAN SLIM
  oneil_analyzer_title: "ウィリアム・オニール CAN SLIM採点",
  oneil_analyzer_desc:
    "保有株や任意のティッカーをオニールのCAN SLIM 7基準で採点します。C(四半EPS成長 ≥ 25%)、A(年間EPS成長 ≥ 25%)、N(52週高値近接 ≥ 90%)、S(浮動株 < 50M株)、L(高い相対強度)、I(機関保有 30–70%)、M(時価総額$2B–$50B)で評価します。爆発的な業績成長と強いモメンタムを持つ成長株の発掘に最適です。",
  oneil_criterion_current: "四半期EPS成長率 (C)",
  oneil_criterion_annual: "年間EPS成長率 (A)",
  oneil_criterion_newhigh: "52週高値近接 (N)",
  oneil_criterion_supply: "浮動株数 (S)",
  oneil_criterion_leader: "相対強度 (L)",
  oneil_criterion_institutional: "機関保有比率 (I)",
  oneil_criterion_cap: "時価総額 (M)",
  oneil_no_data: "データなし",
  oneil_disclaimer:
    "※ Yahoo Finance の財務データに基づきます。投資判断の唯一の根拠にしないでください。",
  oneil_progress_enrich: (done, total) => `⏳ 詳細分析中… (${done}/${total})`,
  oneil_phase_enrich: "🔍 銘柄の詳細財務データを補強中…",
  oneil_no_result: "⚠️ Yahoo Financeから銘柄データを取得できませんでした。しばらくしてから再試行してください。",
  oneil_canslim_badge: "🚀 CAN SLIM適合",
  oneil_initial_guide: "ポートフォリオ分析またはティッカー検索で採点を開始してください。",

  // ─── Buffett Indicator
  buffett_indicator_title: "バフェット指標 (Buffett Indicator)",
  buffett_indicator_subtitle: "米国株式市場 時価総額 / GDP",
  buffett_indicator_ratio_label: "現在のバフェット指標",
  buffett_indicator_market_cap: "時価総額",
  buffett_indicator_gdp: "GDP",
  buffett_indicator_year: "基準日付",
  buffett_indicator_loading: "データを読み込み中…",
  buffett_indicator_error: "データを取得できませんでした。しばらくしてから再試行してください。",
  buffett_indicator_status_deep_under: "大幅に割安",
  buffett_indicator_status_under: "割安",
  buffett_indicator_status_fair: "適正評価",
  buffett_indicator_status_over: "割高",
  buffett_indicator_status_deep_over: "大幅に割高",
  buffett_indicator_source: "時価総額: Yahoo Finance ^W5000 · GDP: World Bank",
  buffett_indicator_desc: "バフェット指標は、米国株式市場全体の時価総額をGDPで割った値です。バフェットは『おそらく最も良い単一の評価指標』と呼んでおり、75%未満は買い機会、200%超えは『火遇び』と述べました。",

  settings_title: "設定",
  settings_display_currency_title: "表示通貨",
  settings_display_currency_desc:
    "ダッシュボードの金額表示に使用する基準通貨を選択します。",
  settings_fx_title: "為替レート",
  settings_fx_cache_warn: (time) =>
    `⚠️ 為替レート取得失敗 — キャッシュ値使用中（${time} 時点基準）`,
  settings_data_refresh_title: "為替・時価更新",
  settings_data_refresh_refreshing: "取得中…",
  settings_data_refresh_refresh: "🔄 今すぐ更新",
  settings_data_refresh_auto: "アプリ起動時に自動取得されます。",
  settings_data_refresh_time: (time) => `${time} 時点`,
  settings_data_refresh_cache_warn: (time) =>
    `⚠️ 取得失敗 — キャッシュ値使用中（${time} 時点基準）`,
  settings_data_refresh_result: (updated, total) =>
    `${total}件中${updated}件時価更新`,
  settings_data_refresh_no_ticker: "ティッカーが登録された資産がありません。",
  data_refresh_error:
    "為替/時価の取得に失敗しました。ネットワーク状態を確認してください。",
  data_refresh_partial_fail: (names) =>
    `以下の銘柄の時価取得に失敗しました。資産詳細から現在価格を手動で入力してください: ${names.join("、")}`,

  drive_title: "Google Drive 同期",
  drive_desc:
    "ポートフォリオデータを個人のGoogle Driveのアプリ専用フォルダに自動保存します。他の端末で同じGoogleアカウントでサインインするとデータを復元できます。",
  drive_connect: "Googleで接続",
  drive_disconnect: "接続解除",
  drive_connected: "Drive接続済み",
  drive_syncing: "読込中…",
  drive_saving: "保存中…",
  drive_synced_at: (time) => `${time}に同期済み`,
  drive_sync_now: "今すぐ同期",
  drive_save_to_drive: "Driveに保存",
  drive_load_from_drive: "Driveから読み込む",
  drive_no_client_id: "VITE_GOOGLE_CLIENT_IDが設定されていません。",
  drive_error_prefix: "同期エラー:",
  drive_conflict_title: "データ競合を検出",
  drive_conflict_desc: (driveTime, localTime) =>
    `Driveデータ（${driveTime}）はローカルデータ（${localTime}）より新しいです。どちらのデータを使用しますか？`,
  drive_use_drive: "Driveデータを使用",
  drive_use_local: "ローカルデータを維持",
  drive_error_no_client_id:
    "Google Client IDが設定されていません。.envファイルを確認してください。",
  drive_error_gis_not_loaded:
    "Google Identity Servicesスクリプトがロードされていません。",
  settings_target_title: "目標配分",
  settings_target_sum: (n) => `合計: ${n}%`,
  settings_target_save: "保存",
  settings_target_saved: "保存しました",
  settings_data_title: "データ管理",
  settings_data_local_title: "ローカルストレージ",
  settings_data_desc:
    "すべてのデータはブラウザのローカルストレージに保存されます。",
  settings_data_count: (n) => `登録資産数: ${n}件`,
  settings_data_reset: "全データ初期化",
  settings_data_reset_confirm:
    "すべてのデータ（資産・設定）を初期化します。この操作は元に戻せません。",
  settings_data_drive_title: "💡 Google Drive データ削除",
  settings_data_drive_note:
    "Google Driveに保存されたデータを削除するには、Googleアカウントのアプリ連携管理ページ（myaccount.google.com/permissions）でこのアプリのアクセス権限を解除してください。権限を解除するとDriveに保存されたバックアップファイルも削除されます。",

  profile_title: "プロフィール",
  profile_desc:
    "グルとの対話時に使用される個人情報です。ローカルに保存され、外部サーバーには送信されません。",
  profile_nickname_label: "ニックネーム（グルに呼んでほしい名前）",
  profile_nickname_placeholder: "例: はなこ",
  profile_age_label: "年齢",
  profile_age_placeholder: "例: 35",
  profile_annual_income_label: "年収入",
  profile_annual_income_placeholder: "例: 6000000",
  profile_monthly_budget_label: "毎月の投資可能額",
  profile_monthly_budget_placeholder: "例: 50000",
  profile_plan3y_label: "3年投資計画",
  profile_plan3y_placeholder:
    "例: 3年以内に配当収入月、3万円を目指し、成長株中心にリバランス…",
  profile_plan5y_label: "5年投資計画",
  profile_plan5y_placeholder:
    "例: 5年後に結婚資金として 1000万円を目指す…",
  profile_plan10y_label: "10年投資計画",
  profile_plan10y_placeholder:
    "例: 10年後に配当収入だけで生活費を賄える経済的自由を達成…", profile_notes_label: "特記事項 / 注意点",
  profile_notes_placeholder:
    "例: 住宅ローン残高 2,300万円５15年）。投賄予算のうち毎月 5万円は S&P500 ETF自動購入済み、実質的な機定投賄は毎月 3万円分…", profile_save: "保存",
  profile_saved: "✓ 保存しました",

  at_col_name: "銘柄",
  at_col_market: "市場",
  at_col_category: "分類",
  at_col_quantity: "数量",
  at_col_avg_buy_price: "取得単価",
  at_col_current_price: "現在値",
  at_col_value: "評価額",
  at_col_pnl: "損益",
  at_col_return: "騰落率",
  at_col_weight: "比重",
  at_col_actions: "操作",
  at_empty_title: "資産が登録されていません",
  at_empty_desc: "上の「資産追加」ボタンから最初の資産を登録してください。",
  at_btn_edit: "編集",
  at_btn_delete: "削除",
  at_unclassified: "未分類",
  at_filter_all_market: "全市場",
  at_filter_all_type: "全種類",
  at_filter_all_category: "全カテゴリ",
  at_filter_clear: "フィルター解除",
  at_filter_count: (shown, total) => `${shown} / ${total}銀柄`,
  at_filter_no_result: "該当する資産がありません。",
  at_col_ticker: "ティッカー",
  ticker_search_no_result: "検索結果がありません。",
  ticker_search_error: "検索に失敗しました。ネットワーク状態を確認してください。",

  history_title: "資産構成の推移",
  history_value: "評価額",
  history_cost: "取得原価",
  history_no_data: "データを収集中です。明日からグラフが表示されます。",

  pnl_chart_title: "銀柄別損益状況",
  pnl_chart_pnl: "損益",
  pnl_chart_profit: "利益",
  pnl_chart_loss: "損失",
  pnl_chart_top12: "損益絶対値上何12銀柄",

  af_mode_stock: "銘柄検索",
  af_mode_cash: "現金/預金",
  af_mode_crypto: "仮想通貨",
  af_mode_manual: "手動入力",
  af_search_hint: "ティッカーまたは銘柄名を入力して検索してください。",
  af_search_placeholder: "ティッカーまたは銘柄名…",
  af_search_btn: "検索",
  af_searching: "検索中…",
  af_results_count: (n) => `検索結果: ${n}件`,
  af_no_results: "該当なし",
  af_manual_hint:
    "Yahoo Finance で検索できない銘柄（投資信託など）を手動で入力します。\nISIN またはシンボルがわかれば入力後に現在値取得を試みてください。",
  af_entry_mode_simple: "簡易入力",
  af_entry_mode_detail: "詳細入力",
  af_simple_amount_label: "評価額 *",
  af_simple_amount_placeholder: "現在の保有評価額を入力してください",
  af_name_label: "銘柄名 *",
  af_ticker_label: "シンボル / ISIN（任意）",
  af_asset_type_label: "資産種別",
  af_market_label: "市場",
  af_currency_label: "通貨",
  af_quantity_label: "保有数量 *",
  af_avg_price_label: "取得単価",
  af_current_price_label: "現在値",
  af_current_price_auto: "✓ Yahoo Finance 自動取得",
  af_fetch_price_btn: "現在値取得",
  af_fetching: "取得中…",
  af_currency_placeholder: "通貨を選択",
  af_currency_no_result: "結果なし",
  af_back_to_search: "← 検索に戻る",
  af_re_search: "← 再検索",
  af_btn_cancel: "キャンセル",
  af_btn_submit: "登録完了",
  af_manual_name_placeholder: "例: 楽天・プラス・Ｓ＆Ｐ５００インデックス・ファンド",
  af_manual_ticker_placeholder: "0P0001D75H.T または JP90C000KRC0",
  af_manual_link: "Yahoo Finance で見つかりませんか？ → 手動入力",
  af_cash_amount_label: "保有額",
  af_crypto_hint: "コインのティッカーを入力して取引ペアを選択してください。",
  af_crypto_search_btn: "取引ペアを検索",
  af_crypto_searching: "取得中…",
  af_crypto_pair_title: "取引ペアを選択",
  af_crypto_no_pairs:
    "取引ペアが見つかりません。ティッカーを確認してください。",
  af_crypto_selected: "選択済み",
  af_crypto_select: "選択",
  af_buy_price_label: "取得単価",
  af_current_price_placeholder: "自動取得または手動入力",
  af_account_label: "口座",
  af_account_none: "口座未指定",

  broker_manage_btn: "口座管理",
  broker_title: "口座管理",
  broker_add_btn: "口座を追加",
  broker_edit_btn: "編集",
  broker_save_btn: "保存",
  broker_delete_btn: "削除",
  broker_cancel_btn: "キャンセル",
  broker_empty: "登録済みの口座がありません。口座を追加してください。",
  broker_country_label: "国",
  broker_name_label: "金融機関",
  broker_type_label: "口座種別",
  broker_nickname_label: "ニックネーム",
  broker_name_placeholder: "例: SBI証券、楽天銀行、Fidelity、Chase",
  broker_type_placeholder: "例: NISA、特定、一般、IRA",
  broker_nickname_placeholder: "例: SBI NISA、楽天 特定",
  broker_delete_confirm: "この口座を削除しますか？",
  broker_col_nickname: "ニックネーム",
  broker_col_broker: "金融機関",
  broker_col_type: "口座種別",
  broker_col_country: "国",

  atype_stock: "株式",
  atype_etf: "ETF",
  atype_fund: "ファンド・投資信託",
  atype_bond: "債券",
  atype_other: "その他",
  atype_crypto: "仮想通貨",
  atype_cash: "現金/預金",
  market_jp: "日本 (JP)",
  market_us: "米国 (US)",
  market_kr: "韓国 (KR)",
  market_eu: "ヨーロッパ (EU)",
  market_other: "その他",
  currency_jpy: "円 (JPY)",
  currency_usd: "ドル (USD)",
  currency_krw: "ウォン (KRW)",
  currency_eur: "ユーロ (EUR)",

  nav_fire: "経済的自由プランナー",
  fire_title: "経済的自由プランナー",
  fire_desc: "現在の資産、貯蓄額、期待利回りに基づいて、いつ経済的自立（FIRE）を達成できるかを予測します。",
  fire_tab_target: "目標金額で計算",
  fire_tab_expense: "月間生活費で計算",
  fire_use_portfolio_assets: "ポートフォリオ資産を連動",
  fire_current_assets: "現在の総資産",
  fire_monthly_savings: "月間貯蓄額",
  fire_helper_expected_return: "S&P 500など市場の歴史的な年平均利回りは通常7%〜10%程度です。",
  fire_expected_return: "期待年利回り (%)",
  fire_target_amount: "目標総資産",
  fire_monthly_expense: "目標月間生活費",
  fire_helper_safe_withdrawal: "引退後も資産が枯渇しない基準である、トリニティ研究の4%ルールを推奨します。",
  fire_safe_withdrawal_rate: "安全引き出し率 (%)",
  fire_calculate_btn: "計算する",
  fire_res_years_label: "目標達成までの予想期間",
  fire_res_age_label: "予想到達年齢",
  fire_res_yrs: "年",
  fire_res_out_of_bounds: "計算範囲を超えました。貯蓄額や利回りを増やしてみてください！",
  fire_result_already_reached: "おめでとうございます！すでに目標を達成しています。 🎉",
  fire_chart_title: "予測資産成長推移",
  fire_chart_asset: "予測資産額",
  fire_chart_target: "目標額",
  fire_tooltip_year: (year, age) => `${year}年後${age ? `（${age}歳）` : ''}`,
  fire_age_label: "現在の年齢（任意）",
  fire_age_placeholder: "例：30",
  fire_error_savings_exceed_target: "毎月の貯蓄額が目標資産総額を超えています。目標金額または貯蓄額を再確認してください。",

  category_labels: {
    dividend: "配当",
    growth: "グロース",
    value: "バリュー",
    index: "インデックス/ETF",
    bond: "債券",
    reit: "不動産投信",
    cash: "現金性",
    crypto: "仮想通貨",
    commodity: "コモディティ",
    other: "その他",
  },
  asset_type_labels: {
    stock: "株式",
    etf: "ETF",
    bond: "債券",
    fund: "ファンド",
    cash: "現金/預金",
    crypto: "仮想通貨",
    real_estate: "不動産",
    other: "その他",
  },
  market_labels: {
    KR: "韓国",
    JP: "日本",
    US: "米国",
    EU: "ヨーロッパ",
    OTHER: "その他",
  },
};
