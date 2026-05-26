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
  holdings_col_weight: "比率",  holdings_col_per: "PER",
  holdings_col_pbr: "PBR",  holdings_show_all: (n) => `全${n}件を表示`,
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
    'AIの応答JSONをここに貼り付けてください...\n\n例:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "..." },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "..." }\n]',
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
  csv_preview_more: (n) => `... 他${n}行`,

  guru_title: "投資家",
  guru_empty_title: "投資家分析",
  guru_empty_desc:
    "資産を登録すると、著名投資家のポートフォリオと比較・分析できます。",
  guru_philosophy_title: (name) => `${name}の投資哲学`,
  guru_ideal_alloc: (name) => `${name}の理想的な配分`,
  guru_radar_title: "マイポートフォリオ vs 投資家比較",
  guru_my_portfolio: "マイポートフォリオ",
  guru_rebalance_title: (name) => `${name}基準のリバランス提案`,
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
    "以下のプロンプトをコピーして、ChatGPT・Claudeなど任意のAIに貼り付けてください。",
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
    "• 長期保有：理解できるビジネスを適正価格で購入し10年以上保有\n" +
    "• 配当成長 & 自社株買い：着実な株主還元方針を重視\n" +
    "• 能力の輪（Circle of Competence）：自分がよく理解している産業にのみ投資\n" +
    "• 現金確保：好機をつかむため常に十分な現金を保持\n" +
    "• 名言：「ルール1：絶対に損をするな。ルール2：ルール1を忘れるな」",
  guru_philosophy_munger:
    "• 集中投資：少数の優れた企業に強い確信がある時のみ大規模に投資\n" +
    "• メンタルモデル（多分野的思考）：心理学・物理学・経済学など多分野のフレームワークを活用\n" +
    "• 忍耐力：「何もしないこと」が最善である場合が多いと強調\n" +
    "• 流行アイデアの回避：人気のある投資テーマや群衆思考に流されず、真に独立した判断を最優先に\n" +
    "• 回避の技術：悪い投資を避けることが良い投資を見つけることより重要\n" +
    "• 名言：「逆から考えよ。常に逆から考えよ（Invert, always invert）」",
  guru_philosophy_lynch:
    "• 日常の投資アイデア：生活の中で成長する製品・サービスを発見し投資\n" +
    "• PEGレシオ：PERを利益成長率で割り、適正バリュエーションを判断\n" +
    "• テンバガー追求：10倍以上のリターンが期待できる成長株を発掘\n" +
    "• 幅広い分散投資：数十〜数百銘柄に分散してリスクを管理\n" +
    "• 徹底したリサーチ：企業訪問・財務諸表分析など直接調査を重視\n" +
    "• 名言：「何を、なぜ保有しているのか説明できるようにせよ」",
  guru_philosophy_graham:
    "• 安全マージン（Margin of Safety）：本質的価値より大幅に割安な価格でのみ購入\n" +
    "• 守りの投資：元本保全を最優先とする保守的アプローチ\n" +
    "• 株式-債券バランス配分：株式25〜75%、残りは債券で市況に応じて調節\n" +
    "• 定量分析：感情を排除し、財務データに基づく冷静な企業評価\n" +
    "• 市場は「計量器」：長期的には企業の本質的価値が株価に反映される\n" +
    "• 名言：「投資家最大の敵は、多くの場合自分自身である」",
  guru_philosophy_dalio:
    "• オールウェザー戦略：あらゆる経済局面（成長/減速 × インフレ/デフレ）に備える\n" +
    "• リスクパリティ：資産クラス別のリスク寄与度を均等に配分\n" +
    "• 幅広い分散：株・債券・金・コモディティなど低相関資産に分散投資\n" +
    "• 原則（Principles）：体系的な意思決定プロセスと組織原則の確立\n" +
    "• 景気サイクルの理解：短期・長期の債務サイクルを分析して対応\n" +
    "• 名言：「水晶玉に頼って生きる者は、砕けたガラスを食べることになる」",
  guru_philosophy_lilu:
    "• バフェット-マンガー流のアジア適用：バリュー投資の原則を中国・アジア市場で実践\n" +
    "• 深い企業分析：ビジネスモデルの本質と長期競争力を徹底的に把握\n" +
    "• 超集中ポートフォリオ：高い確信を持つ少数銘柄に大規模投資\n" +
    "• 長期保有：5〜10年以上の超長期投資視点\n" +
    "• 知的誠実さ：自らの無知を認め、能力の輪の中でのみ投資\n" +
    "• 名言：「投資で最も大きなリスクは、価格変動ではなく恒久的な資本損失だ」",
  guru_philosophy_ackman:
    "• アクティビスト投資：企業経営に積極的に関与し、価値を引き出す\n" +
    "• 集中ポートフォリオ：5〜10社の優良企業に大規模集中投資\n" +
    "• ビジネスモデル分析：シンプルで予測可能なキャッシュフローの企業を選好\n" +
    "• 非対称リターン：下方リスクが限定的で上方余地が大きい機会を追求\n" +
    "• マクロヘッジ：極端なシナリオに備えた防御的ポジションを活用\n" +
    "• 名言：「富は集中で築き、分散で守る」",
  guru_philosophy_burry:
    "• 逆張り投資：市場多数の意見に反するポジションを躊躇なく取る\n" +
    "• バリューベース分析：企業の本質的価値・資産価値を精密に算出\n" +
    "• マクロベッティング：マクロ経済のトレンドとバブルを分析し大きな方向性に賭ける\n" +
    "• 独立した思考：群集心理に流されず自分の分析に基づく\n" +
    "• 高い現金比率：確実な好機が来るまで忍耐強く現金を保有\n" +
    "• 名言：「私は早すぎるだけで、間違ってはいない」",
  guru_philosophy_fisher:
    "• グローバルマクロ：世界経済の動向と市場サイクルを分析して資産配分を決定\n" +
    "• 投資心理の逆利用：投資家の過度な楽観・悲観を収益機会に活用\n" +
    "• 長期的な株式オーバーウェイト：株式は長期的に他の資産より高いリターンを提供\n" +
    "• 幅広いグローバル分散：特定の国に偏らず世界中に分散投資\n" +
    "• 3つの質問：市場が知っていること・知らないこと・誤解していることを区別して投資\n" +
    "• 名言：「市場は不安の壁をよじ登る」",
  guru_philosophy_cohen:
    "• マルチマネージャーモデル：複数の投資戦略とマネージャーを並行運用\n" +
    "• リスク管理最優先：ポジション別のロスカットと全体ポートフォリオリスクを厳格管理\n" +
    "• 短〜中期トレーディング：迅速な意思決定とポジション回転で収益を追求\n" +
    "• 情報優位：徹底したリサーチとデータ分析に基づく投資判断\n" +
    "• 柔軟な戦略：ロング/ショート、イベントドリブン、クオンツなど多様な戦略を活用\n" +
    "• 名言：「重要なのは予測精度より、損失管理の徹底だ」",
  guru_philosophy_marks:
    "• 市場サイクル理論：市場の振り子のような周期的振動を理解し現在位置を把握\n" +
    "• セカンドレベル思考：コンセンサスとは異なり、より優れた思考を追求\n" +
    "• ディストレスト投資：不良債権・危機資産から高いリターン機会を捉える\n" +
    "• リスク＝永久的損失：ボラティリティではなく永久的な資本損失を真のリスクと定義\n" +
    "• 守りの投資：好況時の最大リターンより、不況時の損失抑制に集中\n" +
    "• 名言：「予測はできなくても、備えることはできる」",
  guru_philosophy_klarman:
    "• 安全マージンの継承：グレアムの安全マージン哲学を現代市場に適用\n" +
    "• 絶対リターン追求：ベンチマーク対比の相対リターンではなく絶対リターンに集中\n" +
    "• 高い現金比率：良い機会がない時は現金比率を50%まで高めることも厭わない\n" +
    "• 市場の恐怖を活用：危機時に他者が売る中、割安資産を積極的に購入\n" +
    "• 下方保護最優先：リターン最大化より元本保全をより重視\n" +
    "• 名言：「バリュー投資とは、逆張り気質と計算機の結婚である」",
  guru_philosophy_templeton:
    "• グローバル逆張り：「最大悲観ポイント（Point of Maximum Pessimism）」で買い\n" +
    "• 国境のない投資：世界中の市場から割安な機会を探索\n" +
    "• 長期バリュー投資：5〜10年以上の長期保有で企業価値の実現を期待\n" +
    "• 定量スクリーニング：低PER・PBRなど定量指標を活用した銘柄選別\n" +
    "• 謙虚な投資：市場に勝とうとするより、市場のミスを活用する姿勢\n" +
    "• 名言：「最大悲観の時こそ、最高の買い場だ」",
  guru_philosophy_soros:
    "• 再帰性理論（Reflexivity）：市場参加者の認識が現実を変化させるフィードバックループ\n" +
    "• 大規模方向性ベット：確信がある時、通貨・債券・株式にまたがる巨大なポジション\n" +
    "• グローバルマクロ：政治・経済・社会の変化を読み、マクロ投資機会を捉える\n" +
    "• 素早い損切り：仮説が誤りと判断されればただちにポジションを清算\n" +
    "• 市場の不安定性を活用：市場の不均衡と非効率から収益機会を発掘\n" +
    "• 名言：「正誤より重要なのは、当たった時にいくら稼ぎ、外した時にいくら失うかだ」",
  guru_philosophy_wood:
    "• 破壊的イノベーション：5〜10年後に世界を変える技術に集中投資\n" +
    "• 5大テーマ：AI、ロボティクス、エネルギー貯蔵、ゲノミクス、ブロックチェーン\n" +
    "• 長期成長投資：短期の変動を受け入れ、長期的成長ポテンシャルにベット\n" +
    "• 積極的リサーチ：自社リサーチチームによる独自の将来予想と価格モデリング\n" +
    "• 透明な運用：日次で売買内容を公開するなど、透明性の高いファンド運営\n" +
    "• 名言：「イノベーションは課題を解決し、まったく新しい市場機会を生む」",

  guru_philosophy_druckenmiller:
    "• マクロ運用の名手：通貨・金利・株式の相関を読み、大きな方向性ポジションを取る\n" +
    "• ソロスの薫陶：クォンタム・ファンドで磨かれた戦略を継承・発展し、長期で高い複利リターンを実現\n" +
    "• 高確信の集中投資：確信度の高いアイデアには大胆に資金を配分し、曖昧な賭けは避ける\n" +
    "• モメンタム重視：トレンドには強く乗り、シグナルが反転したら即座にポジションを切り替える\n" +
    "• 非対称リスク管理：損失は小さく、利益は伸ばす運用で期待値を高める\n" +
    "• 名言：「長期リターンを築く道は、資本を守り、ホームランを打つことだ」",
  guru_philosophy_smith:
    "• 優良企業の長期保有：「良い企業を買い、買い過ぎず、余計な売買をしない」という原則\n" +
    "• 高ROIC重視：投下資本利益率が持続的に高い企業だけを選び、長期の複利成長を狙う\n" +
    "• 集中ポートフォリオ：およそ25〜30銘柄に絞り、銘柄数よりアイデアの質で勝負\n" +
    "• クオリティ優先：単なる割安さより、事業の質・価格決定力・キャッシュ創出力を重視\n" +
    "• 複利の源泉：高収益企業が内部再投資を続けることで、時間とともに価値が雪だるま式に拡大\n" +
    "• 名言：「リスク低減のための機械的な分散には賛成しない。持つなら最高の企業を持て」",
  guru_philosophy_greenblatt:
    "• マジック・フォーミュラ：高い益回り(Earnings Yield)と高い資本収益性(ROIC)を同時に満たす銘柄を選別\n" +
    "• 定量バリュー投資：感情を排し、ルールに従って機械的に運用するシステム型アプローチ\n" +
    "• 放置された優良株の発掘：市場に見過ごされた割安かつ高品質な企業を体系的に見つける\n" +
    "• 分散運用：20〜30銘柄で個別リスクを抑えつつ、戦略の再現性を高める\n" +
    "• 忍耐が前提：有効な戦略でも3〜4年程度は市場に劣後し得ることを受け入れる\n" +
    "• 名言：「価値を見積もり、それより十分に安く買え。短期の株式市場は“ミスター・マーケット”に過ぎない」",  guru_philosophy_piotroski:
    "• Fスコア：9つの二値基準で企業の財務健全性を0〜9点にスコアリングする定量手法\n" +
    "• バリュー株フィルター：簿価対市価(BM)が高い銘柄のうち、財務体質が優良なものだけを選別\n" +
    "• 収益性シグナル：ROA、営業キャッシュフロー、発生主義品質（キャッシュフロー＞純利益）\n" +
    "• 財務健全性：負債の減少、流動比率の改善、株式希薄化なしで安定性を確認\n" +
    "• 運営効率性：粗利率と資産回転率の改善が経営効率の向上を示す\n" +
    "• 名言：「高BM企業のうち財務が健全な銘柄は年平均7.5%の超過リターンを生む」",
  guru_philosophy_oneil:
    "• CAN SLIMシステム：ファンダメンタルとテクニカルを融合した7要素の成長株選別手法\n" +
    "• C（四半期業績）：直近四半期のEPS成長が前年同期比25%以上の銘柄を選好\n" +
    "• A（年間業績）：年間EPS成長が25%以上で3〜5年持続する企業を追求\n" +
    "• N（新要素・新高値）：革新的な製品/サービスを持ち、52週高値付近で推移する銘柄に注目\n" +
    "• S・L・I・M：需給（浮動株数）、主導株か、機関買い、相場全体の方向性を総合判断\n" +
    "• 名言：「株式投資の秘訣は、間違ったときの損失をいかに最小限に抑えるかだ」",  lynch_tenbagger_title: "ピーター・リンチ テンバガー採点",
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
    "例: 3年以内に配当収入月、3万円を目指し、成長株中心にリバランス...",
  profile_plan5y_label: "5年投資計画",
  profile_plan5y_placeholder:
    "例: 5年後に結婚資金として 1000万円を目指す...",
  profile_plan10y_label: "10年投資計画",
  profile_plan10y_placeholder:
    "例: 10年後に配当収入だけで生活費を賄える経済的自由を達成...",
  profile_save: "保存",
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
  af_search_placeholder: "ティッカーまたは銘柄名...",
  af_search_btn: "検索",
  af_searching: "検索中…",
  af_results_count: (n) => `検索結果: ${n}件`,
  af_no_results: "該当なし",
  af_manual_hint:
    "Yahoo Finance で検索できない銘柄（投資信託など）を手動で入力します。\nISIN またはシンボルがわかれば入力後に現在値取得を試みてください。",
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
