import type { Translations } from "./types";

export const de: Translations = {
  nav_dashboard: "Dashboard",
  nav_assets: "Vermögen",
  nav_gurus: "Gurus",
  nav_settings: "Einstellungen",
  nav_about: "Über",
  app_tagline: "Vermögen · KI-Einblicke · Gurus",
  app_version_info: "Browser-Speicher",

  about_tagline:
    "Einheitliches Multi-Länder-Vermögensmanagement + KI & Guru-Einblicke",
  about_intro:
    "Portfolio Bridge ist eine datenschutzorientierte Web-App zur Verwaltung von Finanzanlagen aus Korea, den USA, Japan und Deutschland in einem einzigen Dashboard. Erhalten Sie umsetzbare Portfolio-Einblicke durch KI und die Weisheit legendärer Investoren. Alle Daten verbleiben im Browser — kein Konto erforderlich.",
  about_features_title: "Funktionen",
  about_feat1_title: "Einheitliches Dashboard",
  about_feat1_desc:
    "KPI-Zusammenfassung, Kategorie- & Marktallokationsdiagramme, Bestandstabelle und Neuausrichtungsvorschläge — auf einen Blick.",
  about_feat2_title: "Vermögensverwaltung",
  about_feat2_desc:
    "Ticker über Yahoo Finance suchen oder Vermögenswerte manuell hinzufügen. KI-Autoclassifizierung, CSV-Import & -Export unterstützt.",
  about_feat3_title: "Investmentgurus",
  about_feat3_desc:
    "Referenzieren Sie die Philosophien und Musterportfolios von 15 legendären Investoren — Buffett, Dalio, Lynch und mehr — und vergleichen Sie sie mit Ihrem eigenen Portfolio. Erstellt außerdem KI-Chatprompts in der Persona des gewählten Gurus.",
  about_feat4_title: "KI-Portfolioanalyse",
  about_feat4_desc:
    "Erstellen Sie einen strukturierten Prompt mit Ihren Bestandsdaten, bereit zum Einfügen in ChatGPT, Claude, Gemini oder Grok für ideale Allokationsratschläge.",
  about_feat5_title: "Automatische Einblicke",
  about_feat5_desc:
    "Erkennt automatisch Konzentrationsrisiken, hohe Verluste, niedrige Barreserven und hohe Währungsexponierung — dargestellt als schließbare Einblickskarten.",
  about_feat6_title: "Mehrsprachig & Mehrwährung",
  about_feat6_desc:
    "Vollständige Benutzeroberfläche auf Koreanisch, Englisch, Japanisch und Deutsch. Anzeigewährung zwischen KRW, USD, JPY und EUR umschaltbar.",
  about_privacy_title: "Datenschutz an erster Stelle",
  about_privacy_desc:
    "Alle Vermögensdaten werden nur im localStorage Ihres Browsers gespeichert. Es werden keine Daten an externe Server gesendet. Kein Konto erforderlich. Optional können Sie Ihr persönliches Google Drive verknüpfen, um Ihre Daten zu sichern.",
  about_tech_title: "Technologie-Stack",
  about_links_live: "Live-Demo",
  about_links_github: "GitHub",
  about_disclaimer:
    "Diese App wurde für persönliches Lernen und Portfolio-Tracking erstellt. Marktdaten, Wechselkurse und Analysen dienen nur als Referenz und sollten nicht als Grundlage für Anlageentscheidungen verwendet werden.",

  dash_title: "Dashboard",
  dash_empty_title: "Portfolio starten",
  dash_empty_desc:
    'Registrieren Sie Ihre Bestände unter "Vermögen" und eine Übersicht erscheint hier.',
  dash_notice_storage:
    "💾 Daten werden nur in diesem Browser auf diesem Gerät gespeichert. Sie werden nicht geräteübergreifend synchronisiert — bitte verwenden Sie dasselbe Gerät und denselben Browser.",
  dash_notice_csv:
    "📁 Vermögensdaten können als CSV-Dateien exportiert/importiert werden. Verwenden Sie dies für Backups oder Gerätemigrationen.",
  dash_notice_mobile:
    "🖥️ Optimiert für Desktop-Browser. Mobilbildschirme werden derzeit nicht unterstützt.",
  dash_sample_btn: "📈 Mit Beispieldaten erkunden",
  dash_sample_hint:
    "Beispieldaten können über Einstellungen › Alle Daten zurücksetzen entfernt werden.",
  dash_refresh: "Alles aktualisieren",
  dash_refreshing: "Abruf…",
  dash_updated_at: (time) => `${time}`,

  kpi_total_value: "Gesamtwert",
  kpi_pnl: "Nicht realisierter G&V",
  kpi_cash_weight: "Bargeld",
  kpi_fx_exposure: "Währungsexponierung",
  kpi_holdings_unit: "Positionen",
  kpi_asset_type_unit: "Vermögensklassen",

  chart_market: "Nach Markt",
  chart_category: "Nach Kategorie",
  chart_no_data: "Keine Daten",

  holdings_title: "Bestände",
  holdings_col_name: "Name",
  holdings_col_type: "Typ",
  holdings_col_value: "Wert",
  holdings_col_pnl: "G&V",
  holdings_col_return: "Rendite",
  holdings_col_weight: "Anteil",
  holdings_show_all: (n) => `Alle ${n} anzeigen`,
  holdings_show_top10: "Nur Top 10",

  category_title: "Kategorie: Ziel vs. Ist",
  category_set_target: "Ziele festlegen",
  category_empty: 'Zielallokationen über "Ziele festlegen" eingeben.',
  category_legend_target: "Ziel",
  category_legend_normal: "Normal",
  category_legend_over: "Übergewichtet",
  category_legend_under: "Untergewichtet",

  fx_title: "Währungsexponierung & Szenario",
  fx_col_currency: "Währung",
  fx_col_value: "Wert",
  fx_col_weight: "Anteil",
  fx_col_rate: "Kurs",
  fx_scenario_title: "±5% Währungsszenario",

  rebalance_title: "Neuausrichtungsvorschläge",
  rebalance_ok: "✅ Allokation liegt nahe am Ziel",
  rebalance_buy: "Kaufen",
  rebalance_sell: "Verkaufen",

  insights_title: "Einblicke",
  insights_ok: "✅ Keine Probleme gefunden",
  insights_ai_btn: "Prompt anzeigen",
  insights_ai_copy: "In Zwischenablage kopieren",
  insights_ai_copied: "✓ Kopiert!",
  insights_ai_desc:
    "Kopieren Sie den folgenden Prompt und fügen Sie ihn in ChatGPT, Claude, Gemini, Grok oder einen anderen KI-Assistenten ein.",
  insights_ai_close: "Schließen",
  insights_ai_banner_title: "KI-Portfolioanalyse",
  insights_ai_banner_desc:
    "Erstellen Sie einen Prompt mit Ihren Bestandsdaten. Fügen Sie ihn in ChatGPT, Claude, Gemini oder Grok ein, um ein ideales Allokationsmodell und umsetzbare Einblicke zu erhalten.",
  insight_concentration: (name, pct) =>
    `${name} Anteil ${pct}% — hohe Einzelwert-Konzentration`,
  insight_big_loss: (name, pct) =>
    `${name} Rendite ${pct}% — erheblicher Verlust`,
  insight_cash_high: (pct) =>
    `Bargeld ${pct}% — überschüssige Liquidität, Einsatz erwägen`,
  insight_cash_low: (pct) => `Bargeld ${pct}% — niedrige Notfallreserve`,
  insight_fx_high: (currency, pct) =>
    `${currency} Exponierung ${pct}% — anfällig für Währungsschwankungen`,
  insight_category_over: (label, pct, target, diff) =>
    `${label} ${pct}% vs. Ziel ${target}% → +${diff}%p übergewichtet`,
  insight_category_under: (label, pct, target, diff) =>
    `${label} ${pct}% vs. Ziel ${target}% → ${diff}%p untergewichtet`,

  asset_title: "Vermögen",
  asset_btn_ai: "Prompt anzeigen",
  asset_ai_banner_title: "KI-Vermögensklassifizierung",
  asset_ai_banner_desc:
    "Vermögenswerte automatisch mit KI klassifizieren. Kopieren Sie den Prompt und fügen Sie ihn in ChatGPT, Claude, Gemini oder Grok ein, um eine empfohlene Kategorie für jeden Bestand zu erhalten.",
  asset_btn_import_csv: "CSV importieren",
  asset_btn_export_csv: "CSV exportieren",
  asset_btn_add: "+ Vermögen hinzufügen",
  asset_modal_add: "Neues Vermögen hinzufügen",
  asset_modal_edit: "Vermögen bearbeiten",
  asset_delete_confirm: "Möchten Sie diesen Vermögenswert wirklich löschen?",
  asset_ai_modal_title: "🤖 KI-Klassifizierung",
  asset_ai_tab_generate: "① Prompt erstellen",
  asset_ai_tab_import: "② KI-Antwort importieren",
  asset_ai_copy_desc:
    "Kopieren Sie den folgenden Prompt und fügen Sie ihn in ChatGPT, Claude, Gemini, Grok oder eine andere KI ein.",
  asset_ai_tab_link: "② KI-Antwort importieren",
  asset_ai_copy: "In Zwischenablage kopieren",
  asset_ai_copied: "✓ Kopiert!",
  asset_ai_close: "Schließen",
  asset_ai_import_desc:
    "Fügen Sie das von der KI zurückgegebene JSON unten ein und",
  asset_ai_format_label: "Format:",
  asset_ai_json_placeholder:
    'KI-Antwort-JSON hier einfügen...\n\nBeispiel:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "..." },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "..." }\n]',
  asset_ai_apply_btn: "Kategorien anwenden",
  asset_ai_apply_result: (applied, skipped) =>
    `✓ Kategorien auf ${applied} Vermögenswerte angewendet.${skipped > 0 ? ` (${skipped} übersprungen)` : ""}`,
  asset_ai_parse_error: "Parse-Fehler",
  exchange_rate_error:
    "Wechselkurse konnten nicht abgerufen werden. Bitte manuell eingeben.",
  asset_ai_copy_link_pre: "Wenn Sie eine Antwort erhalten, gehen Sie zum",
  asset_ai_copy_link_post: "Tab, um automatisch anzuwenden.",
  asset_ai_import_btn_suffix: "und anwenden.",
  csv_preview_title: (n) => `CSV-Vorschau — ${n} Zeilen`,
  csv_preview_confirm: "Import bestätigen",
  csv_preview_more: (n) => `... und ${n} weitere Zeilen`,

  guru_title: "Investmentgurus",
  guru_empty_title: "Guru-Analyse",
  guru_empty_desc:
    "Registrieren Sie Ihre Vermögenswerte, um Ihr Portfolio mit einem Guru zu vergleichen.",
  guru_philosophy_title: (name) => `${name}s Investmentphilosophie`,
  guru_ideal_alloc: (name) => `${name}s Idealallokation`,
  guru_radar_title: "Mein Portfolio vs. Guru",
  guru_my_portfolio: "Mein Portfolio",
  guru_rebalance_title: (name) => `Neuausrichtungsvorschläge (${name})`,
  guru_col_category: "Kategorie",
  guru_col_current: "Aktuell",
  guru_col_guru_target: "Guru-Ziel",
  guru_col_diff: "Differenz",
  guru_col_amount: "Betrag",
  guru_ai_banner_title: "Guru befragen",
  guru_ai_banner_desc:
    "Analysieren Sie Ihr Portfolio aus der Perspektive des gewählten Gurus.",
  guru_ai_btn: "Prompt generieren",
  guru_ai_close: "Schließen",
  guru_ai_desc:
    "Kopieren Sie den Prompt und fügen Sie ihn in ChatGPT, Claude oder einen anderen KI-Assistenten ein.",
  guru_ai_copy: "In Zwischenablage kopieren",
  guru_ai_copied: "✓ Kopiert!",
  guru_philosophy_buffett:
    "• Wirtschaftlicher Burggraben: Konzentration auf Unternehmen mit dauerhaften Wettbewerbsvorteilen und hohen Markteintrittsbarrieren\n" +
    "• Langfristiges Halten: Verständliche Unternehmen zu fairen Preisen kaufen und 10+ Jahre halten\n" +
    "• Dividendenwachstum & Aktienrückkäufe: Bevorzugung von Unternehmen mit konsistenter Aktionärsvergütungspolitik\n" +
    "• Kompetenzkreis: Nur in Branchen investieren, die man wirklich versteht\n" +
    "• Barreserven: Stets erhebliche Barmittel halten, um großartige Gelegenheiten zu ergreifen\n" +
    '• Zitat: "Regel Nr. 1: Verliere niemals Geld. Regel Nr. 2: Vergiss niemals Regel Nr. 1."',
  guru_philosophy_munger:
    "• Konzentriertes Investieren: Große Wetten nur bei hoher Überzeugung in wenige herausragende Unternehmen\n" +
    "• Mentale Modelle (multidisziplinäres Denken): Frameworks aus Psychologie, Physik, Ökonomie und mehr nutzen\n" +
    "• Geduld: Oft ist der beste Schachzug, gar nichts zu tun\n" +
    "• Konträres Denken: Ängstlich sein, wenn andere gierig sind, und gierig sein, wenn andere ängstlich sind\n" +
    "• Die Kunst der Vermeidung: Schlechte Investitionen zu vermeiden ist wichtiger als großartige zu finden\n" +
    '• Zitat: "Invertieren, immer invertieren."',
  guru_philosophy_lynch:
    "• Alltägliche Investmentideen: Wachsende Produkte und Dienstleistungen im täglichen Leben entdecken\n" +
    "• PEG-Ratio: KGV durch Gewinnwachstumsrate teilen, um faire Bewertung einzuschätzen\n" +
    "• Tenbagger-Suche: Aktien mit dem Potenzial für 10-fache Renditen suchen\n" +
    "• Breite Diversifikation: Risiko über Dutzende bis Hunderte von Aktien streuen\n" +
    "• Gründliche Recherche: Unternehmensbesuche und praxisnahe Finanzanalyse betonen\n" +
    '• Zitat: "Wisse, was du besitzt – und warum du es besitzt."',
  guru_philosophy_graham:
    "• Sicherheitsmarge: Nur mit erheblichem Abschlag zum inneren Wert kaufen\n" +
    "• Defensives Investieren: Kapitalerhalt mit konservativem Ansatz priorisieren\n" +
    "• Aktien-Anleihen-Balance: 25–75% in Aktien, Rest in Anleihen, je nach Marktlage anpassen\n" +
    "• Quantitative Analyse: Emotionen ausschalten; Unternehmen anhand von Finanzdaten bewerten\n" +
    '• Der Markt ist eine "Wiegemaschine": Langfristig spiegeln Aktienkurse den wahren Unternehmenswert wider\n' +
    '• Zitat: "Das größte Problem des Investors – und oft sein schlimmster Feind – ist er selbst."',
  guru_philosophy_dalio:
    "• Allwetter-Strategie: Auf alle Wirtschaftsregimes vorbereiten (Wachstum/Abschwung × Inflation/Deflation)\n" +
    "• Risikoparität: Risikobeiträge über Anlageklassen hinweg angleichen\n" +
    "• Breite Diversifikation: In Aktien, Anleihen, Gold und Rohstoffe mit geringen Korrelationen investieren\n" +
    "• Prinzipien: Systematische Entscheidungsfindung und Organisationsprinzipien etablieren\n" +
    "• Zyklen verstehen: Kurz- und langfristige Schuldenzyklen analysieren, um Entscheidungen zu leiten\n" +
    '• Zitat: "Wer von der Kristallkugel lebt, wird zersplittertes Glas essen."',
  guru_philosophy_lilu:
    "• Buffett-Munger-Ansatz in Asien: Wertinvestitionsprinzipien auf chinesische und asiatische Märkte anwenden\n" +
    "• Tiefgehende Unternehmensanalyse: Geschäftsmodelle und langfristige Wettbewerbsfähigkeit gründlich verstehen\n" +
    "• Ultra-konzentriertes Portfolio: Stark in wenige hochkonviktierte Ideen investieren\n" +
    "• Langfristiges Halten: 5–10+ Jahre Investitionshorizonte aufrechterhalten\n" +
    "• Intellektuelle Ehrlichkeit: Die Grenzen des eigenen Wissens anerkennen und im Kompetenzkreis bleiben\n" +
    '• Zitat: "Das größte Risiko beim Investieren ist nicht Volatilität, sondern permanenter Kapitalverlust."',
  guru_philosophy_ackman:
    "• Aktivistisches Investieren: Aktiv mit dem Unternehmensmanagement zusammenarbeiten, um Wert freizusetzen\n" +
    "• Konzentriertes Portfolio: Großangelegte Investitionen in 5–10 Qualitätsunternehmen\n" +
    "• Geschäftsmodellanalyse: Einfache, vorhersehbare Cashflow-Unternehmen bevorzugen\n" +
    "• Asymmetrisches Chance-Risiko-Verhältnis: Chancen mit begrenztem Abwärtspotenzial und großem Aufwärtspotenzial suchen\n" +
    "• Makro-Absicherung: Defensive Positionen zum Schutz vor extremen Szenarien nutzen\n" +
    '• Zitat: "Konzentration baut Vermögen auf; Diversifikation bewahrt es."',
  guru_philosophy_burry:
    "• Konträres Investieren: Bereitwillig Positionen entgegen dem Marktkonsens eingehen\n" +
    "• Wertbasierte Analyse: Innere und Vermögenswerte sorgfältig berechnen\n" +
    "• Makro-Wetten: Makroökonomische Trends und Marktblasen für gerichtete Wetten analysieren\n" +
    "• Unabhängiges Denken: Auf eigene Analyse setzen, ohne dem Herdenverhalten nachzugeben\n" +
    "• Hohe Bargeldposition: Geduldig Barmittel halten, bis wirklich überzeugende Chancen entstehen\n" +
    '• Zitat: "Ich bin vielleicht früh dran, aber ich liege nicht falsch."',
  guru_philosophy_fisher:
    "• Globales Makro: Globale Wirtschaftstrends und Marktzyklen zur Steuerung der Vermögensallokation analysieren\n" +
    "• Investorenstimmung nutzen: Übermäßigen Optimismus und Pessimismus als Gewinnchancen nutzen\n" +
    "• Langfristige Übergewichtung von Aktien: Aktien liefern langfristig überlegene Renditen gegenüber anderen Anlagen\n" +
    "• Breite globale Diversifikation: Länderspezifische Konzentration vermeiden; weltweit investieren\n" +
    "• Drei Fragen: Unterscheiden, was der Markt weiß, nicht weiß und fälschlicherweise glaubt\n" +
    '• Zitat: "Märkte klettern eine Mauer der Sorgen hinauf."',
  guru_philosophy_cohen:
    "• Multi-Manager-Modell: Mehrere Anlagestrategien und Manager parallel betreiben\n" +
    "• Risikomanagement zuerst: Stop-Losses pro Position und Gesamtportfoliorisiko streng managen\n" +
    "• Kurz- bis mittelfristiger Handel: Renditen durch schnelle Entscheidungsfindung und Positionsrotation erzielen\n" +
    "• Informationsvorteil: Anlageentscheidungen auf Basis gründlicher Recherche und Datenanalyse\n" +
    "• Flexible Strategien: Long/Short, ereignisgesteuerte, quantitative und andere Ansätze einsetzen\n" +
    '• Zitat: "Entscheidend ist nicht perfekte Prognose, sondern konsequentes Risikomanagement."',
  guru_philosophy_marks:
    "• Marktzyklustheorie: Die pendelartige Schwingung der Märkte verstehen und die eigene Position bestimmen\n" +
    "• Zweistufiges Denken: Anders und besser als der Konsens denken\n" +
    "• Distressed Investing: Pionier im Bereich notleidender Schulden und Krisenanlageninvestments\n" +
    "• Risiko = Permanenter Verlust: Wahres Risiko als permanenten Kapitalverlust definieren, nicht als Volatilität\n" +
    "• Defensives Investieren: In schlechten Zeiten Verluste begrenzen über Gewinne in guten Zeiten maximieren\n" +
    '• Zitat: "Du kannst nicht vorhersagen, aber du kannst dich vorbereiten."',
  guru_philosophy_klarman:
    "• Sicherheitsmarge-Erbe: Grahams Sicherheitsmarge-Philosophie für heutige Märkte modernisieren\n" +
    "• Absolute Renditen: Auf absolute Renditen statt relative Benchmark-Performance fokussieren\n" +
    "• Hohe Barreserven: Bereitwillig bis zu 50% Barmittel halten, wenn keine überzeugenden Chancen existieren\n" +
    "• Angst ausnutzen: Bei Marktpanik aggressiv unterbewertete Anlagen kaufen\n" +
    "• Kapitalschutz zuerst: Kapitalerhalt über Renditemaximierung priorisieren\n" +
    '• Zitat: "Value Investing ist im Kern die Verbindung aus konträrem Denken und einem Taschenrechner."',
  guru_philosophy_templeton:
    "• Globaler Konträrer: Am 'Punkt des maximalen Pessimismus' kaufen\n" +
    "• Grenzenlos investieren: Unterbewertete Chancen auf allen globalen Märkten suchen\n" +
    "• Langfristiges Wertinvestieren: 5–10+ Jahre halten und auf die Realisierung des inneren Werts warten\n" +
    "• Quantitatives Screening: Niedriges KGV, KBV und andere Kennzahlen zur Kandidatenselektion nutzen\n" +
    "• Bescheidenes Investieren: Marktfehler ausnutzen statt zu versuchen, den Markt zu schlagen\n" +
    '• Zitat: "Die Zeit maximaler Pessimismus ist die beste Zeit zum Kaufen."',
  guru_philosophy_soros:
    "• Reflexivitätstheorie: Marktwahrnehmungen der Teilnehmer verändern die Realität in Rückkopplungsschleifen\n" +
    "• Massive gerichtete Wetten: Enorme Positionen in Währungen, Anleihen und Aktien eingehen, wenn die Überzeugung hoch ist\n" +
    "• Globales Makro: Politische, wirtschaftliche und soziale Verschiebungen für Makro-Investitionschancen lesen\n" +
    "• Schnelle Stop-Losses: Positionen sofort verlassen, wenn die These sich als falsch erweist\n" +
    "• Marktinstabilität ausnutzen: Gewinnchancen in Marktungleichgewichten und Ineffizienzen finden\n" +
    '• Zitat: "Entscheidend ist nicht, ob man recht hat, sondern wie viel man gewinnt, wenn man recht hat, und wie viel man verliert, wenn man falsch liegt."',
  guru_philosophy_wood:
    "• Disruptive Innovation: Konzentration auf Technologien, die in 5–10 Jahren die Welt transformieren werden\n" +
    "• Fünf Schlüsselthemen: KI, Robotik, Energiespeicherung, Genomik und Blockchain-Innovationsplattformen\n" +
    "• Langfristiges Wachstumsinvestieren: Kurzfristige Volatilität akzeptieren; auf langfristiges Wachstumspotenzial setzen\n" +
    "• Proaktive Forschung: Eigenentwickelte Zukunftsprognosen und Preismodellierungen durch interne Forschungsteams\n" +
    "• Transparentes Management: Tägliche Trades öffentlich offenlegen für vollständige Fondstransparenz\n" +
    '• Zitat: "Innovation löst Probleme und schafft völlig neue Marktchancen."',

  guru_philosophy_druckenmiller:
    "• Meister des Makro-Tradings: Richtungswetten auf Basis von Zusammenhängen zwischen Währungen, Zinsen und Aktien\n" +
    "• Geprägt von Soros: Im Quantum Fund entwickelte Strategien übernommen und konsequent weiterentwickelt\n" +
    '• Konzentrierte Einsätze: "Wenn die Überzeugung sehr hoch ist, muss man entschlossen agieren."\n' +
    "• Momentum-orientiert: Trends offensiv reiten, bei Signalwechsel aber sofort umschalten\n" +
    "• Asymmetrisches Risikomanagement: Verluste konsequent begrenzen und Gewinner laufen lassen\n" +
    '• Zitat: "Langfristige Renditen entstehen durch Kapitalerhalt und gelegentliche Home Runs."',
  guru_philosophy_smith:
    '• Qualitäts-Compounder: "Gute Unternehmen kaufen, nicht überbezahlen, dann nichts tun" als Kernprinzip\n' +
    "• Hoher ROIC-Fokus: Bevorzugt Unternehmen mit dauerhaft hoher Kapitalrendite und starkem Reinvestitionspotenzial\n" +
    "• Konzentriertes Portfolio: Rund 25–30 Positionen; Qualität der Ideen vor bloßer Streuung\n" +
    "• Qualität vor Schnäppchenjagd: Lieber faire Preise für exzellente Geschäftsmodelle als billige, schwache Unternehmen\n" +
    "• Zinseszins-Effekt: Langfristiges Halten von Unternehmen, die interne Cashflows zu hohen Renditen reinvestieren\n" +
    '• Zitat: "Zur Risikoreduktion blind zu diversifizieren überzeugt mich nicht. Wenn man investiert, dann in die besten Unternehmen."',
  guru_philosophy_greenblatt:
    "• Magische Formel: Kombination aus hoher Gewinnrendite (Earnings Yield) und hoher Kapitalrendite (ROIC) zur systematischen Titelauswahl\n" +
    '• Systematisches Value Investing: Regelgebundener, emotionsfreier Prozess statt Bauchgefühl; bekannt aus "The Little Book That Beats the Market"\n' +
    "• Übersehene Qualitätswerte: Sucht gezielt günstige, hochwertige Unternehmen, die der Markt vernachlässigt\n" +
    "• Diversifizierte Umsetzung: 20–30 Positionen, um Einzeltitelrisiken zu reduzieren und die Strategie robust umzusetzen\n" +
    "• Geduld als Voraussetzung: Die Strategie kann über 3–4 Jahre hinter dem Markt liegen, bevor sie aufholt\n" +
    '• Zitat: "Ermitteln Sie den Wert eines Unternehmens und zahlen Sie deutlich weniger — kurzfristig ist der Markt nur Mr. Market."',

  settings_title: "Einstellungen",
  settings_display_currency_title: "Anzeigewährung",
  settings_display_currency_desc:
    "Wählen Sie die Basiswährung für die Anzeige von Portfoliowerten.",
  settings_fx_title: "Wechselkurse",
  settings_fx_cache_warn: (time) =>
    `⚠️ Kursabruf fehlgeschlagen — gecachten Wert verwenden (Stand: ${time})`,
  settings_data_refresh_title: "Kurse & Preise",
  settings_data_refresh_refreshing: "Wird abgerufen…",
  settings_data_refresh_refresh: "🔄 Jetzt aktualisieren",
  settings_data_refresh_auto:
    "Kurse und Preise werden beim App-Start automatisch abgerufen.",
  settings_data_refresh_time: (time) => `Stand: ${time}`,
  settings_data_refresh_cache_warn: (time) =>
    `⚠️ Abruf fehlgeschlagen — gecachte Werte verwenden (Stand: ${time})`,
  settings_data_refresh_result: (updated, total) =>
    `${updated} von ${total} Preise aktualisiert`,
  settings_data_refresh_no_ticker:
    "Keine Vermögenswerte mit Ticker registriert.",
  data_refresh_error:
    "Abruf von Kursen/Preisen fehlgeschlagen. Bitte prüfen Sie Ihre Netzwerkverbindung.",
  data_refresh_partial_fail: (names) =>
    `Für folgende Positionen konnte kein Kurs abgerufen werden. Bitte den aktuellen Preis in den Asset-Details manuell eingeben: ${names.join(", ")}`,

  drive_title: "Google Drive-Synchronisierung",
  drive_desc:
    "Speichert Ihre Portfolio-Daten automatisch in Ihrem persönlichen Google Drive App-Ordner. Melden Sie sich auf einem anderen Gerät mit demselben Google-Konto an, um Ihre Daten wiederherzustellen.",
  drive_connect: "Mit Google verbinden",
  drive_disconnect: "Trennen",
  drive_connected: "Drive verbunden",
  drive_syncing: "Lade\u2026",
  drive_saving: "Speichere\u2026",
  drive_synced_at: (time) => `Synchronisiert um ${time}`,
  drive_sync_now: "Jetzt synchronisieren",
  drive_save_to_drive: "In Drive speichern",
  drive_load_from_drive: "Von Drive laden",
  drive_no_client_id: "VITE_GOOGLE_CLIENT_ID ist nicht gesetzt.",
  drive_error_prefix: "Sync-Fehler:",
  drive_conflict_title: "Datenkonflikt erkannt",
  drive_conflict_desc: (driveTime, localTime) =>
    `Drive-Daten (${driveTime}) sind neuer als lokale Daten (${localTime}). Welche Daten möchten Sie verwenden?`,
  drive_use_drive: "Drive-Daten verwenden",
  drive_use_local: "Lokale Daten behalten",
  drive_error_no_client_id:
    "Google Client ID ist nicht konfiguriert. Bitte prüfen Sie Ihre .env-Datei.",
  drive_error_gis_not_loaded:
    "Google Identity Services-Skript ist nicht geladen.",
  settings_target_title: "Zielallokation",
  settings_target_sum: (n) => `Gesamt: ${n}%`,
  settings_target_save: "Speichern",
  settings_target_saved: "Gespeichert",
  settings_data_title: "Datenverwaltung",
  settings_data_desc:
    "Alle Daten werden im lokalen Browser-Speicher gespeichert.",
  settings_data_count: (n) => `Registrierte Vermögenswerte: ${n}`,
  settings_data_reset: "Alle Daten zurücksetzen",
  settings_data_reset_confirm:
    "Dadurch werden alle Daten (Vermögen, Einstellungen) zurückgesetzt. Diese Aktion kann nicht rückgängig gemacht werden.",
  settings_data_drive_note:
    "Um die auf Google Drive gespeicherten Daten zu löschen, wechseln Sie zur App-Berechtigungsseite Ihres Google-Kontos (myaccount.google.com/permissions) und widerrufen Sie den Zugriff für diese App. Beim Widerrufen wird auch die in Drive gespeicherte Sicherungsdatei gelöscht.",

  at_col_name: "Name",
  at_col_market: "Markt",
  at_col_category: "Kategorie",
  at_col_quantity: "Menge",
  at_col_current_price: "Aktueller Kurs",
  at_col_value: "Wert",
  at_col_pnl: "G&V",
  at_col_return: "Rendite",
  at_col_weight: "Anteil",
  at_col_actions: "Aktionen",
  at_empty_title: "Keine Vermögenswerte registriert",
  at_empty_desc:
    'Klicken Sie auf die Schaltfläche "Vermögen hinzufügen" oben, um Ihren ersten Vermögenswert hinzuzufügen.',
  at_btn_edit: "Bearbeiten",
  at_btn_delete: "Löschen",
  at_unclassified: "Nicht klassifiziert",
  at_filter_all_market: "Alle Märkte",
  at_filter_all_type: "Alle Typen",
  at_filter_all_category: "Alle Kategorien",
  at_filter_clear: "Filter zurücksetzen",
  at_filter_count: (shown, total) => `${shown} / ${total} Werte`,
  at_filter_no_result: "Keine Werte entsprechen den Filterkriterien.",

  history_title: "Portfolioverlauf",
  history_value: "Bewertung",
  history_cost: "Einstandswert",
  history_no_data:
    "Daten werden gesammelt. Ab morgen wird das Chart angezeigt.",

  pnl_chart_title: "G&V nach Wertpapier",
  pnl_chart_pnl: "G&V",
  pnl_chart_profit: "Gewinn",
  pnl_chart_loss: "Verlust",
  pnl_chart_top12: "Top 12 nach absolutem G&V",

  af_mode_stock: "Ticker suchen",
  af_mode_cash: "Bargeld / Einlage",
  af_mode_crypto: "Kryptowährung",
  af_mode_manual: "Manuelle Eingabe",
  af_search_hint:
    "Geben Sie einen Ticker oder Unternehmensnamen ein und suchen.",
  af_search_placeholder: "Ticker oder Name...",
  af_search_btn: "Suchen",
  af_searching: "Suche läuft…",
  af_results_count: (n) => `${n} Ergebnis${n !== 1 ? "se" : ""}`,
  af_no_results: "Keine Ergebnisse gefunden",
  af_manual_hint:
    "Vermögenswerte manuell eingeben, die nicht auf Yahoo Finance zu finden sind (z.B. Investmentfonds).\nWenn Sie die ISIN oder das Symbol kennen, geben Sie es ein und versuchen Sie, den aktuellen Kurs abzurufen.",
  af_name_label: "Name *",
  af_ticker_label: "Symbol / ISIN (optional)",
  af_asset_type_label: "Vermögenstyp",
  af_market_label: "Markt",
  af_currency_label: "Währung",
  af_quantity_label: "Menge *",
  af_avg_price_label: "Durchschnittlicher Einstandspreis",
  af_current_price_label: "Aktueller Kurs",
  af_current_price_auto: "✓ Automatisch von Yahoo Finance abgerufen",
  af_fetch_price_btn: "Kurs abrufen",
  af_fetching: "Wird abgerufen…",
  af_currency_placeholder: "Währung auswählen",
  af_currency_no_result: "Keine Ergebnisse",
  af_back_to_search: "← Zurück zur Suche",
  af_re_search: "← Erneut suchen",
  af_btn_cancel: "Abbrechen",
  af_btn_submit: "Speichern",
  af_manual_link: "Nicht auf Yahoo Finance gefunden? → Manuell eingeben",
  af_cash_amount_label: "Betrag",
  af_crypto_hint:
    "Geben Sie einen Münzticker ein und wählen Sie ein Handelspaar.",
  af_crypto_search_btn: "Paare suchen",
  af_crypto_searching: "Wird abgerufen…",
  af_crypto_pair_title: "Handelspaar auswählen",
  af_crypto_no_pairs: "Keine Paare gefunden. Prüfen Sie den Ticker.",
  af_crypto_selected: "Ausgewählt",
  af_crypto_select: "Auswählen",
  af_buy_price_label: "Kaufkurs",
  af_current_price_placeholder: "Automatisch abrufen oder manuell eingeben",

  atype_stock: "Aktie",
  atype_etf: "ETF",
  atype_fund: "Fonds / Trust",
  atype_bond: "Anleihe",
  atype_other: "Sonstiges",
  atype_crypto: "Kryptowährung",
  atype_cash: "Bargeld / Einlage",
  market_jp: "Japan (JP)",
  market_us: "USA (US)",
  market_kr: "Südkorea (KR)",
  market_eu: "Europa (EU)",
  market_other: "Sonstige",
  currency_jpy: "Yen (JPY)",
  currency_usd: "Dollar (USD)",
  currency_krw: "Won (KRW)",
  currency_eur: "Euro (EUR)",

  category_labels: {
    dividend: "Dividende",
    growth: "Wachstum",
    value: "Wert",
    index: "Index/ETF",
    bond: "Anleihe",
    reit: "REIT",
    cash: "Bargeld",
    crypto: "Krypto",
    commodity: "Rohstoff",
    other: "Sonstiges",
  },
  asset_type_labels: {
    stock: "Aktie",
    etf: "ETF",
    bond: "Anleihe",
    fund: "Fonds",
    cash: "Bargeld",
    crypto: "Krypto",
    real_estate: "Immobilien",
    other: "Sonstiges",
  },
  market_labels: {
    KR: "Südkorea",
    JP: "Japan",
    US: "USA",
    EU: "Europa",
    OTHER: "Sonstige",
  },
};
