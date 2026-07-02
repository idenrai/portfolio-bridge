import type { Translations } from "./types";

export const de: Translations = {
  nav_dashboard: "Dashboard",
  nav_assets: "Vermögen",
  nav_gurus: "Gurus",
  nav_settings: "Einstellungen",
  nav_about: "Über",
  app_tagline: "Integrierte Vermögensverwaltung + KI & Guru-Einblicke",
  app_version_info: "Browser-Speicher",

  about_tagline: "Integrierte Vermögensverwaltung + KI & Guru-Einblicke",
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
    "Referenzieren Sie die Philosophien und Musterportfolios von 20 legendären Investoren — Buffett, Dalio, Lynch und mehr — und vergleichen Sie sie mit Ihrem eigenen Portfolio. Inkl. 6 quantitative Analyzer: Lynch 10-Bagger, Greenblatt Magic Formula, Graham Defensive, Smith Quality Compounder, Piotroski F-Score und O'Neil CAN SLIM. KI-Chat-Prompts in der Persona des gewählten Gurus.",
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
  holdings_col_per: "KGV",
  holdings_col_pbr: "KBV",
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
    'KI-Antwort-JSON hier einfügen…\n\nBeispiel:\n[\n  { "index": 1, "name": "AAPL", "category": "growth", "reason": "…" },\n  { "index": 2, "name": "MSFT", "category": "growth", "reason": "…" }\n]',
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
  csv_preview_more: (n) => `… und ${n} weitere Zeilen`,

  guru_title: "Investmentgurus",
  guru_empty_title: "Guru-Analyse",
  guru_empty_desc:
    "Registrieren Sie Ihre Vermögenswerte, um Ihr Portfolio mit einem Guru zu vergleichen.",
  guru_philosophy_label: "Investmentphilosophie",
  guru_ideal_alloc: "Ideale Allokation",
  guru_radar_title: "Mein Portfolio vs. Guru",
  guru_my_portfolio: "Mein Portfolio",
  guru_rebalance_title: "Rebalancing-Vorschlag",
  guru_col_category: "Kategorie",
  guru_col_current: "Aktuell",
  guru_col_guru_target: "Guru-Ziel",
  guru_col_diff: "Differenz",
  guru_col_amount: "Betrag",
  guru_ai_banner_title: "Guru befragen",
  guru_ai_banner_desc:
    "Analysieren Sie Ihr Portfolio aus der Perspektive des gewählten Gurus.",
  guru_ai_btn: "Prompt erstellen",
  guru_ai_close: "Schließen",
  guru_ai_desc:
    "Kopieren Sie den Prompt unten und fügen Sie ihn in ChatGPT, Claude, Gemini oder Grok ein.",
  guru_ai_search_warn: "⚠️ Die KI sucht nach den neuesten Nachrichten, was einige zusätzliche Sekunden dauern kann.",
  guru_ai_copy: "In die Zwischenablage kopieren",
  guru_ai_copied: "✓ Kopiert!",
  guru_ai_followup_btn: "Vorheriges Gespräch fortsetzen",
  guru_ai_followup_desc:
    "Ein Prompt, der nur die Portfolio-Änderungen seit Ihrem letzten Gespräch enthält. Fügen Sie ihn in Ihren vorherigen Chat ein, um eine Bewertung der Änderungen zu erhalten.",
  guru_ai_followup_new_session: "Neues Gespräch starten",
  guru_ai_followup_new_session_confirm:
    "Dies löscht den gespeicherten früheren Portfolio-Status und startet neu mit dem aktuellen Status. Fortfahren?",
  guru_ai_session_saved: "✓ Aktueller Portfolio-Status wurde gespeichert.",
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
    "• Wirtschaftlicher Burggraben: Konzentration auf Unternehmen mit dauerhaften Wettbewerbsvorteilen und hohen Markteintrittsbarrieren\n" +
    "• Langfristiges Halten: Verständliche Unternehmen zu fairen Preisen kaufen und bevorzugt für immer halten\n" +
    "• Dividendenwachstum & Aktienrückkäufe: Bevorzugung von Unternehmen mit konsistenter Aktionärsvergütungspolitik und exzellenter Kapitalallokation\n" +
    "• Kompetenzkreis: Nur in Branchen und Geschäftsmodelle investieren, die man wirklich versteht\n" +
    "• Wunderbares Geschäft: Es ist weitaus besser, ein wunderbares Unternehmen zu einem fairen Preis zu kaufen als ein faires Unternehmen zu einem wunderbaren Preis\n" +
    "• Dummheit meiden: Komplexe Derivate und schwer verständliche Geschäftsmodelle strikt ablehnen\n" +
    "• Barreserven: Stets erhebliche Barmittel halten, um in Krisen Liquidität zu sichern und großartige Gelegenheiten zu ergreifen\n" +
    '• "Regel Nr. 1: Verliere niemals Geld. Regel Nr. 2: Vergiss niemals Regel Nr. 1."\n' +
    '• "Sei ängstlich, wenn andere gierig sind, und gierig, wenn andere ängstlich sind."\n' +
    '• "Erst wenn die Ebbe kommt, sieht man, wer nackt geschwommen ist."',
  guru_philosophy_munger:
    "• Konzentriertes Investieren: Massive Wetten nur bei hoher Überzeugung in wenige herausragende Unternehmen abschließen\n" +
    "• Mentale Modelle (multidisziplinäres Denken): Kernkonzepte aus Psychologie, Physik, Biologie, Mathematik und Geschichte zusammenführen\n" +
    "• Geduld: Häufiges Handeln vermeiden; oft ist es am besten, nichts zu tun und den Zinseszins eines großartigen Geschäfts wirken zu lassen\n" +
    "• Konträres Denken: Populären Narrativen und Herdendenken widerstehen; ein wirklich unabhängiges Urteil ist unerlässlich\n" +
    "• Die Kunst der Vermeidung (Inversion): Zuerst fragen, wie man scheitern könnte, und Dummheit systematisch meiden, um Erfolg zu haben\n" +
    "• Kontinuierliches Lernen: Jeden Tag ein wenig klüger ins Bett gehen als man aufgewacht ist, durch unermüdliches Lesen und Nachdenken\n" +
    "• Macht der Anreize: Die enorme Bedeutung von Anreizstrukturen auf menschliches Verhalten und Unternehmensergebnisse absolut betonen\n" +
    '• "Invertieren, immer invertieren."\n' +
    '• "Zeig mir den Anreiz, und ich zeige dir das Ergebnis."\n' +
    '• "Es ist bemerkenswert, wie viel langfristigen Vorteil wir erzielt haben, indem wir beständig versuchten, nicht dumm zu sein, anstatt zu versuchen, sehr intelligent zu sein."',
  guru_philosophy_lynch:
    "• Alltägliche Investmentideen: Entdecken Sie schnell wachsende Produkte und Dienstleistungen im täglichen Leben vor der Wall Street und überprüfen Sie diese fundamental\n" +
    "• PEG-Ratio: Teilen Sie das KGV durch die Gewinnwachstumsrate, um das Wachstum objektiv und präzise zu bewerten\n" +
    "• Tenbagger-Suche: Zielen Sie auf vielversprechende Small- und Mid-Cap-Unternehmen ab, die das Potenzial haben, Ihren Einsatz zu verzehnfachen\n" +
    "• Breite Diversifikation: Streuen Sie das Risiko über Hunderte von Aktien, aber verfolgen Sie für jede einzelne einen klaren, individuellen Investment-Case\n" +
    "• Gründliche Recherche: Betonen Sie beharrliche Unternehmensbesuche und direkte Interviews mit dem Management anstelle von reinen Zahlen\n" +
    "• Cocktailparty-Theorie: Ein Kontraindikator – wenn jeder auf einer Party mit Aktien prahlt, ist der Markt am Höhepunkt; wenn sie Aktien ignorieren, am Tiefpunkt\n" +
    '• "Wisse, was du besitzt – und warum du es besitzt."\n' +
    '• "Das wichtigste Organ an der Börse ist das Gehirn, nicht der Magen."\n' +
    '• "Die Zeit ist auf Ihrer Seite, wenn Sie Aktien von überlegenen Unternehmen besitzen."',
  guru_philosophy_graham:
    "• Sicherheitsmarge: Kaufen Sie ausschließlich mit einem massiven Abschlag zum inneren Wert, um einen Puffer gegen Fehler und Pech zu schaffen\n" +
    "• Mr. Market: Betrachten Sie den Markt als einen manisch-depressiven Geschäftspartner; lassen Sie sich niemals von seinen Emotionen leiten, sondern profitieren Sie davon\n" +
    "• Defensives Investieren: Priorisieren Sie den absoluten Kapitalerhalt und die Absicherung nach unten über die Maximierung der Rendite\n" +
    "• Aktien-Anleihen-Balance: Allokieren Sie mechanisch 25–75% in Aktien und den Rest in Anleihen, angepasst rein an die aktuelle Marktlage\n" +
    "• Quantitative Analyse: Schalten Sie Emotionen völlig aus; bewerten Sie Unternehmen ausschließlich anhand kalter Finanzdaten wie dem Netto-Umlaufvermögen (NCAV)\n" +
    '• "Eine Investitionsoperation ist eine, die nach gründlicher Analyse die Sicherheit des Kapitals und eine angemessene Rendite verspricht."\n' +
    '• "Das größte Problem des Investors – und oft sein schlimmster Feind – ist er selbst."\n' +
    '• "Kurzfristig ist der Markt eine Wahlmaschine, aber langfristig ist er eine Wiegemaschine."',
  guru_philosophy_dalio:
    "• Allwetter-Strategie: Sich perfekt auf alle Wirtschaftsregimes in vier Quadranten vorbereiten (Wachstum/Abschwung × Inflation/Deflation)\n" +
    "• Risikoparität: Risikobeiträge statt Kapitalmengen angleichen, um die Dominanz einzelner Anlageklassen zu vermeiden\n" +
    "• Breite Diversifikation: Strukturell in unkorrelierte Vermögenswerte wie Aktien, nominale Anleihen, inflationsgeschützte Anleihen, Gold und Rohstoffe investieren\n" +
    "• Radikale Transparenz: Unabhängig von der Hierarchie nach Wahrheit streben und eine Ideen-Meritokratie (Idea Meritocracy) im Unternehmen durchsetzen\n" +
    "• Prinzipien: Märkte und das Leben als Maschine von Ursache und Wirkung verstehen; Lehren aus Fehlern in Algorithmen systematisieren\n" +
    "• Zyklen verstehen: Kurzfristige Geschäftszyklen und langfristige Schuldenzyklen analysieren, um makroökonomische Wendepunkte zu navigieren\n" +
    '• "Wer von der Kristallkugel lebt, wird zersplittertes Glas essen."\n' +
    '• "Schmerz + Reflexion = Fortschritt."',
  guru_philosophy_lilu:
    "• Buffett-Munger-Ansatz in Asien: Wenden Sie die reinsten Prinzipien des Value-Investings systematisch auf die schnell wachsenden asiatischen Märkte an\n" +
    "• Tiefgehende Unternehmensanalyse: Verstehen Sie das absolute Wesen von Geschäftsmodellen, die Integrität des Managements und unüberwindbare Burggräben\n" +
    "• Ultra-konzentriertes Portfolio: Investieren Sie massives Kapital in nur eine Handvoll lebensverändernder, extrem überzeugender Ideen\n" +
    "• Langfristiges Halten: Ignorieren Sie kurzfristige Volatilität komplett und halten Sie Positionen 5–10+ Jahre, bis der innere Wert voll erkannt wird\n" +
    "• Intellektuelle Ehrlichkeit: Erkennen Sie die Grenzen Ihres eigenen Wissens präzise an und agieren Sie streng innerhalb Ihres Kompetenzkreises\n" +
    '• "Das größte Risiko beim Investieren ist nicht Volatilität, sondern permanenter Kapitalverlust."\n' +
    '• "Ein wahrer Value-Investor versucht niemals, den Markt zu schlagen. Er kontrolliert nur seine eigene Unwissenheit."',
  guru_philosophy_ackman:
    "• Aktivistisches Investieren: Erwerben Sie massive Beteiligungen, um aktiv mit dem Management zu streiten und verborgenen Aktionärswert freizusetzen\n" +
    "• Konzentriertes Portfolio: Tätigen Sie riesige Investitionen mit höchster Überzeugung in ein konzentriertes Portfolio von 5–10 Weltklasse-Unternehmen\n" +
    "• Geschäftsmodellanalyse: Fordern Sie einfache, hochgradig vorhersehbare Geschäftsmodelle mit starkem freien Cashflow und dominanten Marken-Burggräben\n" +
    "• Asymmetrisches Chance-Risiko-Verhältnis: Suchen Sie unerbittlich nach Chancen, bei denen das Abwärtsrisiko strikt begrenzt, das Aufwärtspotenzial jedoch grenzenlos ist\n" +
    "• Makro-Absicherung: Nutzen Sie massive Derivatpositionen (wie CDS) als ultimative defensive Absicherung gegen extreme makroökonomische Schocks\n" +
    '• "Konzentration baut Vermögen auf; Diversifikation bewahrt es."\n' +
    '• "Die besten Investitionen sind oft diejenigen, über die die Leute damals als furchtbare Ideen gelacht haben."',
  guru_philosophy_burry:
    "• Konträres Investieren: Bereitwillig und entschlossen Positionen einnehmen, die dem Konsens oder dem Wahn des Marktes diametral entgegenstehen\n" +
    "• Wertbasierte Analyse: Innere und Vermögenswerte akribisch berechnen, wobei das Herdenverhalten vollständig ignoriert wird\n" +
    "• Makro-Wetten: Tiefe makroökonomische Trends, systemische Risiken und Vermögensblasen analysieren, um massive direktionale Wetten bei absoluter Überzeugung zu platzieren\n" +
    "• Unabhängiges Denken: Sich von den Narrativen der Wall Street isolieren und sich ausschließlich auf eigene, erschöpfende und einsame Recherchen verlassen\n" +
    "• Hohe Bargeldreserven: Unendliche Geduld zeigen und Bargeld halten, bis sich eine wild asymmetrische, unbestreitbare Gelegenheit bietet\n" +
    '• "Ich bin vielleicht früh dran, aber ich liege nicht falsch."\n' +
    '• "Wenn jeder etwas glaubt, ist es eine gute Wette, dass es niemand wirklich überprüft hat."',
  guru_philosophy_fisher:
    "• Globales Makro: Massive Verschiebungen in der Weltwirtschaft und historische Marktzyklen analysieren, um die Top-Down-Vermögensallokation zu diktieren\n" +
    "• Stimmung ausnutzen: Aus den irrationalen Extremen der Marktmassen Kapital schlagen – maximalen Pessimismus kaufen und maximalen Optimismus verkaufen\n" +
    "• Langfristige Aktienpräferenz: Die feste Überzeugung vertreten, dass Aktien alle anderen Anlageklassen in einem kapitalistischen System langfristig weit übertreffen werden\n" +
    "• Breite globale Diversifikation: Den Home-Country-Bias durch weitreichende weltweite Streuung von Investitionen vollständig eliminieren\n" +
    "• Die drei Fragen: Immer fragen, was der Markt weiß, was er nicht weiß und was er glaubt, das in Wirklichkeit völlig falsch ist\n" +
    '• "Märkte klettern an einer Mauer der Sorge hinauf."\n' +
    '• "Was jeder weiß, ist meistens falsch, und genau darin liegt die größte Chance."',
  guru_philosophy_cohen:
    "• Multi-Manager-Modell: Eine massive Plattform betreiben, die zahlreiche unabhängige Handelsstrategien kombiniert, die von brillanten, spezialisierten Portfoliomanagern ausgeführt werden\n" +
    "• Höchstes Risikomanagement: Gnadenlose Stop-Loss-Limits für jede Position durchsetzen und die Gesamtrisikolimits des Portfolios ausnahmslos streng verwalten\n" +
    "• Kurz- bis mittelfristiger Handel: Kurzfristige Marktineffizienzen durch schnelle Entscheidungsfindung und außerordentlich hohen Portfolioumschlag ausnutzen\n" +
    "• Informationsvorsprung: Jede Entscheidung auf der unerbittlichsten, rechtlich zulässigen Recherche und alternativen Datenanalyse der Wall Street basieren\n" +
    "• Flexible Strategie: Alles einsetzen, was im aktuellen Umfeld am besten funktioniert – Long/Short-Equity, Event-Driven oder rein quantitative Strategien\n" +
    '• "Entscheidend ist nicht, wie genau man die Zukunft vorhersagt, sondern wie gnadenlos man Risiken managt und Verluste begrenzt."\n' +
    '• "Der Markt ist nicht perfekt effizient. Geld wird da verdient, wo Informationen asymmetrisch sind."',
  guru_philosophy_marks:
    "• Marktzyklus-Theorie: Verstehen, dass Märkte wie ein Pendel schwingen, und herauszufinden, wo wir uns im Zyklus befinden, ist von größter Bedeutung\n" +
    "• Denken auf zweiter Ebene (Second-Level Thinking): Man kann nicht das Gleiche tun wie andere und Überrenditen erwarten; man muss tiefer und anders denken als der Konsens\n" +
    "• Distressed Investing: Pionier bei notleidenden Krediten; wahren Wert und hochrentable Chancen dort finden, wo die Masse in Panik gerät\n" +
    "• Risiko = Permanenter Verlust: Wahres Risiko ausschließlich als Wahrscheinlichkeit eines dauerhaften Kapitalverlusts definieren, nicht als kurzfristige Volatilität\n" +
    "• Defensives Investieren: Sich viel stärker darauf konzentrieren, Verluste in schlechten Zeiten zu begrenzen, als Gewinne in guten Zeiten zu maximieren\n" +
    "• Preis vs. Wert: Ein großartiges Asset, das zu teuer gekauft wird, ist ein schlechtes Investment; ein schlechtes Asset, das billig genug gekauft wird, ist ein großartiges Investment\n" +
    '• "Man kann nicht vorhersagen, aber man kann sich vorbereiten."\n' +
    '• "Erfahrung ist das, was man bekommt, wenn man nicht das bekommt, was man wollte."\n' +
    '• "Das Gefährlichste ist es, etwas auf dem Höhepunkt seiner Beliebtheit zu kaufen."',
  guru_philosophy_klarman:
    "• Vermächtnis der Sicherheitsmarge: Benjamin Grahams konservatives Prinzip der Sicherheitsmarge brillant an komplexe, moderne Finanzmärkte anpassen\n" +
    "• Absolute Renditen: Die Falle der relativen Benchmark-Jagd vollständig ablehnen und sich ausschließlich darauf konzentrieren, positive absolute Renditen zu erzielen, ohne Geld zu verlieren\n" +
    "• Hohe Bargeldreserven: Extreme Geduld beweisen, indem man 50 % oder mehr in bar hält, wenn keine Investitionen die strengen Kriterien erfüllen\n" +
    "• Marktängste nutzen: Als ultimativer Käufer der letzten Instanz agieren, wenn andere in Panik verkaufen, und Vermögenswerte weit unter ihrem inneren Wert aufsammeln\n" +
    "• Abwärtsschutz zuerst: Kapitalerhalt und Schutz vor Verlusten haben stets Vorrang vor der Versuchung, die Gewinne in einem wütenden Bullenmarkt zu maximieren\n" +
    '• "Value Investing ist im Kern die Verbindung einer konträren Ader mit einem Taschenrechner."\n' +
    '• "Unser Ziel ist es nicht, Geld zu verdienen; unser Ziel ist es, kein Geld zu verlieren. Wenn wir das tun, kümmern sich die Renditen um sich selbst."\n' +
    '• "Der Markt kann immer falsch liegen, und Preisvolatilität ist nicht gleich Risiko."',
  guru_philosophy_templeton:
    "• Globaler Konträrer: Aggressiv am 'Punkt des maximalen Pessimismus' kaufen, wenn die Masse in Panik gerät und Vermögenswerte abstößt\n" +
    "• Grenzenloses Investieren: Unerbittlich nach tief unterbewerteten Gelegenheiten in allen Nationen und Anlageklassen suchen und den Home-Bias ignorieren\n" +
    "• Langfristiger Wert: Sich vollständig auf die Realisierung des inneren Wertes über eine Haltedauer von 5–10+ Jahren konzentrieren und kurzfristiges Rauschen ausblenden\n" +
    "• Quantitatives Screening: Rauschen durch strenge fundamentale Kennzahlen wie niedriges KGV, niedriges KBV und hohe Gewinnmargen herausfiltern\n" +
    "• Flexibilität und Offenheit: Den eigenen Anlagestil dynamisch an den Markt oder die Anlageklasse anpassen, die den aktuell besten Wert bietet\n" +
    '• "Die Zeit des maximalen Pessimismus ist die beste Zeit zum Kaufen, und die Zeit des maximalen Optimismus ist die beste Zeit zum Verkaufen."\n' +
    '• "Wenn man eine bessere Performance als die Masse erzielen will, muss man Dinge anders machen als die Masse."\n' +
    '• "Die vier gefährlichsten Worte beim Investieren sind: \'Dieses Mal ist alles anders.\'"',
  guru_philosophy_soros:
    "• Reflexivitätstheorie: Märkte sind nicht effizient; voreingenommene Wahrnehmungen der Teilnehmer beeinflussen die Preise, was wiederum die Fundamentaldaten in einer Rückkopplungsschleife verändert\n" +
    "• Massive direktionale Wetten: Bei starker Überzeugung von makroökonomischen Ungleichgewichten massiv und mit Hebel über Währungen, Anleihen und Aktien hinweg wetten\n" +
    "• Global Macro: Politische, wirtschaftliche und soziale Veränderungen sowie Zentralbankpolitik analysieren, um massive Makro-Chancen aufzudecken\n" +
    "• Schneller Stop-Loss & Überleben: Überleben hat absolute Priorität; wenn sich die eigene Hypothese als falsch erweist, die Position sofort liquidieren und fliehen\n" +
    "• Chaos ausnutzen: Die Frühphasen von Marktinstabilitäten und Blasenbildungen aktiv als hochprofitable Chancen nutzen\n" +
    "• Fehlbarkeit (Fallibility): Menschen sind von Natur aus fehlbar; stets skeptisch bleiben und offen für die Möglichkeit sein, dass die eigene These grundlegend falsch ist\n" +
    '• "Es ist nicht wichtig, ob du recht oder unrecht hast, sondern wie viel Geld du verdienst, wenn du recht hast, und wie viel du verlierst, wenn du unrecht hast."\n' +
    '• "Märkte irren sich immer."\n' +
    '• "Ich bin nur reich, weil ich weiß, wann ich falsch liege."',
  guru_philosophy_wood:
    "• Disruptive Innovation: Ausschließlich in transformative Technologien investieren, die die alte Weltordnung in den nächsten 5–10 Jahren vollständig zerstören werden\n" +
    "• Kernthemen: Aggressiv auf die exponentiellen Wachstumskurven von KI, Robotik, Energiespeicherung, DNA-Sequenzierung und Blockchain-Technologie setzen\n" +
    "• Langfristiger Wachstumsfokus: Schwere, qualvolle kurzfristige Volatilität bereitwillig ertragen, um massive langfristige exponentielle Gewinne zu erzielen\n" +
    "• Anwendung des Wrightschen Gesetzes: Futuristische Unternehmen wie Tesla nach dem Wrightschen Gesetz bewerten, wonach die Kosten mit zunehmender kumulativer Produktion stetig sinken\n" +
    "• Radikale Transparenz: Alle proprietären Forschungsmodelle als Open-Source zur Verfügung stellen und tägliche Handelsaktivitäten für die gesamte Öffentlichkeit zur Prüfung veröffentlichen\n" +
    '• "Innovation löst Probleme und schafft völlig neue Marktchancen."\n' +
    '• "Wir stehen auf der richtigen Seite des Wandels, der richtigen Seite der Geschichte."',

  guru_philosophy_druckenmiller:
    "• Makro-Mastermind: Das komplexe Netz aus Makroökonomie, Zentralbankpolitik und Aktienmärkten entschlüsseln, um massive direktionale Positionen aufzubauen\n" +
    "• Kapitalerhalt steht an erster Stelle: Das von Soros geerbte Prinzip, das Abwärtsrisiko strikt zu begrenzen, führte zu einem legendären 30-jährigen Track-Record ohne ein einziges Verlustjahr\n" +
    "• Wetten mit hoher Überzeugung: Bei durchschnittlichen Ideen mit Diversifikation verteidigen, aber bei absoluter Überzeugung massiven Hebel einsetzen, um Home Runs zu erzielen\n" +
    "• Gnadenlose Flexibilität: Sofort umschwenken; eine massive Position augenblicklich auflösen, wenn die These bricht oder der Haupttrend des Marktes dreht\n" +
    "• Asymmetrisches Risikomanagement: Verluste mit erschreckender Geschwindigkeit begrenzen, Gewinner aber so lange laufen lassen, wie der makroökonomische Rückenwind anhält\n" +
    '• "Der Weg zum Aufbau langfristiger Renditen führt über den Erhalt des Kapitals und das Schlagen von Home Runs."\n' +
    '• "Lege alle deine Eier in einen Korb und behalte diesen Korb dann sehr genau im Auge."',
  guru_philosophy_smith:
    '• Qualitäts-Compounder: Das radikal einfache Kernprinzip ausführen: "Kaufe gute Unternehmen, überbezahle nicht, tu dann absolut gar nichts"\n' +
    "• Hoher ROIC-Fokus: Rücksichtslos Unternehmen mit wirtschaftlichen Burggräben aussortieren, die außergewöhnlich hohe Renditen auf ihr investiertes Kapital erzielen und diese Gewinne dauerhaft reinvestieren können\n" +
    "• Konzentriertes Portfolio: Die verwässernden Auswirkungen einer breiten Diversifikation ablehnen und stattdessen eine konzentrierte Liste von 25–30 Eliteunternehmen mit extrem hoher Überzeugung halten\n" +
    "• Qualität vor Schnäppchenjagd: Bereitwillig faire – oder sogar scheinbar hohe – Preise für außergewöhnliche, erstklassige Geschäftsmodelle zahlen, anstatt Zigarrenstummel von geringer Qualität zu jagen\n" +
    "• Zinseszins-Effekt: Den wahren Wert des Investierens erkennen, der in der ungestörten, magischen Aufzinsung großartiger Unternehmen über Jahrzehnte hinweg liegt\n" +
    '• "Zur Risikoreduktion blind zu diversifizieren, überzeugt mich nicht. Wenn man investiert, dann in die allerbesten Unternehmen."\n' +
    '• "Der größte Fehler, den Investoren machen, ist das ständige Bedürfnis, an ihrem Portfolio herumzupfuschen und das Gefühl zu haben, sie müssten etwas tun."',
  guru_philosophy_greenblatt:
    "• Magische Formel: Aktien systematisch ordnen und auswählen, die gleichzeitig hohe Gewinnrenditen (Günstigkeit) und eine hohe Kapitalrendite (Qualität) aufweisen\n" +
    "• Systematisches Value Investing: Menschliche Emotionen, Gier und Angst vollständig durch einen mechanischen, auf strengen Regeln basierenden Quant-Ansatz ersetzen\n" +
    "• Übersehene Qualitätswerte: Methodisch Weltklasse-Unternehmen aufspüren, die vom breiteren Markt aufgrund vorübergehender, kurzfristiger Probleme vorübergehend weggeworfen wurden\n" +
    "• Diversifizierte Umsetzung: 20–30 magische Formel-Aktien halten und diese religiös einmal im Jahr umschichten, um idiosynkratische Risiken zu mindern\n" +
    "• Geduld als Voraussetzung: Die psychologische Pein akzeptieren, dass die Formel in regelmäßigen Abständen für 3–4 Jahre eine Underperformance aufweisen kann, was notwendig ist, damit sie langfristig funktioniert\n" +
    '• "Ermitteln Sie den wahren Wert eines Unternehmens und zahlen Sie deutlich weniger. Der kurzfristige Aktienmarkt verhält sich genau wie ein sehr emotionaler Mr. Market."\n' +
    '• "Die Tatsache, dass die Magische Formel nicht die ganze Zeit funktioniert, ist genau der Grund, warum sie auf lange Sicht weiterhin funktioniert."',
  guru_philosophy_piotroski:
    "• F-Score: Ein rigoroses, binäres 9-Punkte-Bilanzierungssystem verwenden, um die finanzielle Stärke und fundamentale Verbesserung von Unternehmen eiskalt zu bewerten\n" +
    "• Value-Aktien-Filter: Value-Fallen gezielt eliminieren, indem man unter Aktien mit niedrigem Kurs-Buchwert-Verhältnis strikt nur in jene mit einer unbestreitbar starken, nachgewiesenen finanziellen Basis investiert\n" +
    "• Rentabilitätssignale: Die tatsächliche Qualität der Gewinne priorisieren, wobei darauf geachtet wird, dass der operative Cashflow den ausgewiesenen Nettogewinn bei weitem übersteigt\n" +
    "• Finanzielle Stabilität: Unverhandelbare Nachweise fordern: sinkende langfristige Verschuldung, sich verbessernde Liquiditätskennzahlen und absolut keine Verwässerung durch Aktienemissionen\n" +
    "• Betriebseffizienz: Eine reale Steigerung der betrieblichen Effizienz durch explizit steigende Bruttomargen und einen beschleunigten Anlageumschlag belegen\n" +
    '• "Kaufen Sie nicht einfach nur eine billige Aktie. Fordern Sie den mathematischen Beweis in den Finanzdaten, dass sich die fundamentalen Aussichten des Unternehmens dramatisch verbessern."\n' +
    '• "Innerhalb des Value-Universums mit hohem Buch-Marktwert-Verhältnis erzielen finanziell makellose Unternehmen eine konstante, massive Überrendite gegenüber jenen mit schwachen Bilanzen."',
  guru_philosophy_oneil:
    "• CAN-SLIM-System: Intensive fundamentale Datenanalyse perfekt mit dem unbestreitbaren technischen Preis-Momentum verschmelzen, um die größten Marktsieger zu identifizieren\n" +
    "• C & A (Gewinnwachstum): Gnadenlos Unternehmen fordern, die sowohl kurzfristig als auch über einen mehrjährigen Zeitraum hinweg ein geradezu explosives EPS-Wachstum von 25 %+ aufweisen\n" +
    "• N (Neues Produkt/Neues Hoch): Auf Unternehmen abzielen, die die Welt mit bahnbrechenden Produkten revolutionieren und während sie das tun, direkt auf 52-Wochen-Höchstständen ausbrechen\n" +
    "• S·L·I·M: Sich mit dem großen Geld verbünden: institutionelles Sponsoring, wahre Branchenführerschaft und eindeutige Markttrends nach oben sicherstellen\n" +
    "• Unnachgiebige Stop-Losses: Jeden einzelnen potenziell verheerenden Verlust automatisch kappen, indem man ausnahmslos 7–8 % unter dem Kaufpreis ohne zu zögern verkauft\n" +
    '• "Das gesamte Geheimnis des großen Erfolgs an der Börse besteht darin, extrem wenig zu verlieren, wenn man falsch liegt."\n' +
    '• "Kaufen Sie keine Aktien auf dem Weg nach unten. Kaufen Sie sie auf dem Weg nach oben."\n' +
    '• "Die besten Aktien der Welt scheinen für die Masse oft zu teuer und zu hoch, während die schlechtesten wie großartige Schnäppchen wirken."',

  lynch_tenbagger_title: "Peter Lynch Tenbagger-Bewertung",
  lynch_tenbagger_desc:
    "Bewertet Ihre Aktienbestände oder beliebige Ticker anhand von Peter Lynchs PEG-, Wachstums- und Finanzkennzahlen. Höhere Punktzahlen bei PEG < 1,0, EPS-Wachstum > 15 %, Umsatzwachstum > 10 %, D/E < 80 %, Betriebsmarge > 10 % und Marktkapitalisierung unter $10 Mrd. Ideal für wachstumsstarke Small-/Mid-Cap-Aktien mit Tenbagger-Potenzial.",
  lynch_criterion_peg: "PEG-Verhältnis",
  lynch_criterion_eps: "EPS-Wachstum",
  lynch_criterion_rev: "Umsatzwachstum",
  lynch_criterion_debt: "Verschuldungsgrad (D/E)",
  lynch_criterion_margin: "Betriebsmarge",
  lynch_criterion_cap: "Marktkapitalisierung",
  lynch_no_data: "Keine Daten",
  lynch_disclaimer:
    "※ Auf Basis von Yahoo Finance-Fundamentaldaten. Nicht als Grundlage für Anlageentscheidungen verwenden.",
  lynch_progress_enrich: (done, total) => `⏳ Analyse… (${done}/${total})`,
  lynch_phase_enrich: "🔍 Detaillierte Fundamentaldaten der Aktien ergänzen…",
  lynch_no_result: "⚠️ Keine Aktiendaten von Yahoo Finance erhalten. Bitte versuchen Sie es später erneut.",
  lynch_tenbagger_badge: "🚀 Tenbagger-Kandidat",
  lynch_initial_guide: "Analysieren Sie Ihr Portfolio oder suchen Sie einen Ticker, um die Bewertung zu starten.",

  // ─── Analyzer Common (mode tabs) ─────────────────────────────────────────────
  analyzer_mode_portfolio: "Mein Portfolio",
  analyzer_mode_search: "Ticker-Suche",
  analyzer_portfolio_desc: (count) => `${count} Aktien in Ihrem Portfolio bewerten.`,
  analyzer_btn_portfolio: "Portfolio bewerten",
  analyzer_btn_search: "Analysieren",
  analyzer_search_placeholder: "Ticker oder Aktienname eingeben (z.B. AAPL, Siemens)",

  // ─── Magic Formula Analyzer ──────────────────────────────────────────────────
  mf_title: "Joel Greenblatt Magic-Formula-Bewertung",
  mf_desc:
    "Bewertet Aktien nach Gewinnrendite und Kapitalrendite — die zwei Säulen von Greenblatts Magic Formula. Höhere Punktzahlen bei EY > 10 %, ROC > 25 %, Betriebsmarge > 15 %, D/E < 50 % und Marktkapitalisierung $1–10 Mrd. Ideal für systematische, regelbasierte Value-Aktienauswahl ohne Emotionen.",
  mf_criterion_ey: "Gewinnrendite",
  mf_criterion_roc: "Kapitalrendite",
  mf_criterion_margin: "Betriebsmarge",
  mf_criterion_debt: "Verschuldungsgrad (D/E)",
  mf_criterion_cap: "Marktkapitalisierung",
  mf_no_data: "Keine Daten",
  mf_disclaimer:
    "※ Auf Basis von Yahoo Finance-Fundamentaldaten. Nicht als Grundlage für Anlageentscheidungen verwenden.",
  mf_progress_enrich: (done, total) => `⏳ Analyse… (${done}/${total})`,
  mf_phase_enrich: "🔍 Detaillierte Fundamentaldaten der Aktien ergänzen…",
  mf_no_result: "⚠️ Keine Aktiendaten von Yahoo Finance erhalten. Bitte versuchen Sie es später erneut.",
  mf_magic_badge: "🪄 Magic-Formula-Kandidat",
  mf_initial_guide: "Analysieren Sie Ihr Portfolio oder suchen Sie einen Ticker, um die Bewertung zu starten.",

  // Graham
  graham_analyzer_title: "Benjamin Graham Defensiver Investor Analyzer",
  graham_analyzer_desc:
    "Bewertet Ihre Aktienbestände oder beliebige Ticker anhand von Grahams Sicherheitsmarge. Höhere Punktzahlen bei P/E < 15, P/B < 1,5, Graham Number (P/E×P/B) < 22,5, Liquiditätsquote > 2,0, D/E < 50 % und Dividendenrendite > 3 %. Ideal für unterbewertete, finanziell stabile defensive Value-Aktien.",
  graham_criterion_pe: "P/E-Verhältnis",
  graham_criterion_pb: "P/B-Verhältnis",
  graham_criterion_gn: "Graham Number",
  graham_criterion_cr: "Liquiditätsquote",
  graham_criterion_debt: "Verschuldungsgrad (D/E)",
  graham_criterion_div: "Dividendenrendite",
  graham_no_data: "Keine Daten",
  graham_disclaimer:
    "※ Auf Basis von Yahoo Finance-Fundamentaldaten. Nicht als Grundlage für Anlageentscheidungen verwenden.",
  graham_progress_enrich: (done, total) => `⏳ Analyse… (${done}/${total})`,
  graham_phase_enrich: "🔍 Detaillierte Fundamentaldaten der Aktien ergänzen…",
  graham_no_result: "⚠️ Keine Aktiendaten von Yahoo Finance erhalten. Bitte versuchen Sie es später erneut.",
  graham_defensive_badge: "🛡️ Defensiver Kandidat",
  graham_initial_guide: "Analysieren Sie Ihr Portfolio oder suchen Sie einen Ticker, um die Bewertung zu starten.",

  // Smith
  smith_analyzer_title: "Terry Smith Quality Compounder Analyzer",
  smith_analyzer_desc:
    "Bewertet Ihre Aktienbestände oder beliebige Ticker anhand von Smiths Qualitätskriterien. Höhere Punktzahlen bei ROE > 20 %, Betriebsmarge > 15 %, FCF-Konversion > 80 %, Umsatzwachstum > 10 % und D/E < 50 %. Ideal für hochwertige Compounding-Aktien mit starker Profitabilität und Cashflow-Generierung.",
  smith_criterion_roe: "ROE",
  smith_criterion_margin: "Betriebsmarge",
  smith_criterion_fcf: "FCF-Konversion",
  smith_criterion_rev: "Umsatzwachstum",
  smith_criterion_debt: "Verschuldungsgrad (D/E)",
  smith_no_data: "Keine Daten",
  smith_disclaimer:
    "※ Auf Basis von Yahoo Finance-Fundamentaldaten. Nicht als Grundlage für Anlageentscheidungen verwenden.",
  smith_progress_enrich: (done, total) => `⏳ Analyse… (${done}/${total})`,
  smith_phase_enrich: "🔍 Detaillierte Fundamentaldaten der Aktien ergänzen…",
  smith_no_result: "⚠️ Keine Aktiendaten von Yahoo Finance erhalten. Bitte versuchen Sie es später erneut.",
  smith_quality_badge: "✨ Quality Compounder",
  smith_initial_guide: "Analysieren Sie Ihr Portfolio oder suchen Sie einen Ticker, um die Bewertung zu starten.",

  // Piotroski F-Score
  piotroski_analyzer_title: "Piotroski F-Score Bewertung",
  piotroski_analyzer_desc:
    "Bewertet Ihre Aktien oder beliebige Ticker anhand von Piotroskis 9 binären Finanzkennzahlen in drei Bereichen: Rentabilität (ROA > 0, positiver Cashflow, verbessertes ROA, Cashflow > Reingewinn), Finanzstärke (sinkende Schulden, verbesserte Liquiditätsquote, keine Verwässerung) und Effizienz (verbesserte Bruttomarge und Kapitalumschlag). Ein perfekter F-Score von 9 (100 Pkt.) signalisiert starke Fundamentaldaten. Ideal für finanziell gesunde Value-Aktien.",
  piotroski_criterion_roa: "ROA (Gesamtkapitalrendite)",
  piotroski_criterion_cfo: "Operativer Cashflow",
  piotroski_criterion_delta_roa: "ΔROA (ggü. Vorjahr)",
  piotroski_criterion_accruals: "Abgrenzungsqualität",
  piotroski_criterion_delta_leverage: "ΔLangfristschulden",
  piotroski_criterion_delta_liquidity: "ΔLiquiditätsquote",
  piotroski_criterion_equity_dilution: "Aktien-Verwässerung",
  piotroski_criterion_delta_margin: "ΔBruttomarge",
  piotroski_criterion_delta_turnover: "ΔKapitalumschlag",
  piotroski_no_data: "Keine Daten",
  piotroski_disclaimer:
    "※ Basierend auf Yahoo Finance-Daten. Nicht als alleinige Grundlage für Anlageentscheidungen verwenden.",
  piotroski_progress_enrich: (done, total) => `⏳ Analyse läuft… (${done}/${total})`,
  piotroski_phase_enrich: "🔍 Detaillierte Finanzdaten werden ergänzt…",
  piotroski_no_result: "⚠️ Keine Aktiendaten von Yahoo Finance erhalten. Bitte versuchen Sie es später erneut.",
  piotroski_fscore_badge: "📊 Starker F-Score",
  piotroski_initial_guide: "Analysieren Sie Ihr Portfolio oder suchen Sie einen Ticker, um die Bewertung zu starten.",

  // O'Neil CAN SLIM
  oneil_analyzer_title: "William O'Neil CAN SLIM Bewertung",
  oneil_analyzer_desc:
    "Bewertet Ihre Aktien oder beliebige Ticker anhand von O'Neils 7 CAN-SLIM-Kriterien: C (Quartals-EPS-Wachstum ≥ 25 %), A (Jahres-EPS-Wachstum ≥ 25 %), N (nahe 52-Wochen-Hoch ≥ 90 %), S (Streubesitz < 50 Mio.), L (hohe relative Stärke), I (institutionelle Beteiligung 30–70 %) und M (Marktkapitalisierung $2–50 Mrd.). Ideal für wachstumsstarke Momentum-Aktien mit explosivem Gewinnwachstum.",
  oneil_criterion_current: "Quartals-EPS-Wachstum (C)",
  oneil_criterion_annual: "Jährliches EPS-Wachstum (A)",
  oneil_criterion_newhigh: "Nahe 52-Wochen-Hoch (N)",
  oneil_criterion_supply: "Streubesitz (S)",
  oneil_criterion_leader: "Relative Stärke (L)",
  oneil_criterion_institutional: "Institutionelle Beteiligung (I)",
  oneil_criterion_cap: "Marktkapitalisierung (M)",
  oneil_no_data: "Keine Daten",
  oneil_disclaimer:
    "※ Basierend auf Yahoo Finance-Daten. Nicht als alleinige Grundlage für Anlageentscheidungen verwenden.",
  oneil_progress_enrich: (done, total) => `⏳ Analyse läuft… (${done}/${total})`,
  oneil_phase_enrich: "🔍 Detaillierte Finanzdaten werden ergänzt…",
  oneil_no_result: "⚠️ Keine Aktiendaten von Yahoo Finance erhalten. Bitte versuchen Sie es später erneut.",
  oneil_canslim_badge: "🚀 CAN SLIM geeignet",
  oneil_initial_guide: "Analysieren Sie Ihr Portfolio oder suchen Sie einen Ticker, um die Bewertung zu starten.",

  // ─── Buffett Indicator
  buffett_indicator_title: "Buffett-Indikator",
  buffett_indicator_subtitle: "US-Börsenkapitalisierung / BIP",
  buffett_indicator_ratio_label: "Aktueller Wert",
  buffett_indicator_market_cap: "Börsenkapitalisierung",
  buffett_indicator_gdp: "BIP",
  buffett_indicator_year: "Referenzdatum",
  buffett_indicator_loading: "Daten werden geladen…",
  buffett_indicator_error: "Daten konnten nicht geladen werden. Bitte später erneut versuchen.",
  buffett_indicator_status_deep_under: "Stark unterbewertet",
  buffett_indicator_status_under: "Leicht unterbewertet",
  buffett_indicator_status_fair: "Fair bewertet",
  buffett_indicator_status_over: "Leicht überbewertet",
  buffett_indicator_status_deep_over: "Stark überbewertet",
  buffett_indicator_source: "Marktkapitalisierung: Yahoo Finance ^W5000 · BIP: World Bank",
  buffett_indicator_desc: "Der Buffett-Indikator ist das Verhältnis der gesamten US-Aktienmarktkapitalisierung zum BIP. Buffett nannte ihn 'wahrscheinlich den besten Einzelindikator'. Unter 75% signalisiert eine Kaufgelegenheit; über 200% bedeutet 'Spiel mit dem Feuer'.",

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
  settings_data_local_title: "Local Storage",
  settings_data_desc:
    "Alle Daten werden im lokalen Browser-Speicher gespeichert.",
  settings_data_count: (n) => `Registrierte Vermögenswerte: ${n}`,
  settings_data_reset: "Alle Daten zurücksetzen",
  settings_data_reset_confirm:
    "Dadurch werden alle Daten (Vermögen, Einstellungen) zurückgesetzt. Diese Aktion kann nicht rückgängig gemacht werden.",
  settings_data_drive_title: "💡 Google Drive Daten löschen",
  settings_data_drive_note:
    "Um die auf Google Drive gespeicherten Daten zu löschen, wechseln Sie zur App-Berechtigungsseite Ihres Google-Kontos (myaccount.google.com/permissions) und widerrufen Sie den Zugriff für diese App. Beim Widerrufen wird auch die in Drive gespeicherte Sicherungsdatei gelöscht.",

  profile_title: "Mein Profil",
  profile_desc:
    "Persönliche Informationen, die beim Chat mit Gurus verwendet werden. Lokal gespeichert, nie an Server übertragen.",
  profile_nickname_label: "Spitzname (wie Gurus Sie ansprechen sollen)",
  profile_nickname_placeholder: "z. B. Max",
  profile_age_label: "Alter",
  profile_age_placeholder: "z. B. 35",
  profile_annual_income_label: "Jahreseinkommen",
  profile_annual_income_placeholder: "z. B. 60000",
  profile_monthly_budget_label: "Monatliches Investitionsbudget",
  profile_monthly_budget_placeholder: "z. B. 500",
  profile_plan3y_label: "3-Jahres-Investitionsplan",
  profile_plan3y_placeholder:
    "z. B. In 3 Jahren Dividendeneinnahmen von 200 €/Monat anstreben…",
  profile_plan5y_label: "5-Jahres-Investitionsplan",
  profile_plan5y_placeholder:
    "z. B. In 5 Jahren 100.000 € als Eigenkapital für eine Immobilie aufbauen…",
  profile_plan10y_label: "10-Jahres-Investitionsplan",
  profile_plan10y_placeholder:
    "z. B. Finanzielle Unabhängigkeit durch passives Einkommen in 10 Jahren erreichen…", profile_notes_label: "Besonderheiten / Hinweise",
  profile_notes_placeholder:
    "z. B. Hypothek: noch 230.000 € (15 Jahre). 500 €/Monat werden automatisch in S&P-500-ETF investiert, aktiv verwaltetes Budget: 300 €.", profile_save: "Speichern",
  profile_saved: "✓ Gespeichert",

  at_col_name: "Name",
  at_col_market: "Markt",
  at_col_category: "Kategorie",
  at_col_quantity: "Menge",
  at_col_avg_buy_price: "Kaufkurs",
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
  at_col_ticker: "Ticker",
  ticker_search_no_result: "Keine Ergebnisse gefunden.",
  ticker_search_error: "Suche fehlgeschlagen. Bitte überprüfen Sie Ihre Netzwerkverbindung.",

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
  af_search_placeholder: "Ticker oder Name…",
  af_search_btn: "Suchen",
  af_searching: "Suche läuft…",
  af_results_count: (n) => `${n} Ergebnis${n !== 1 ? "se" : ""}`,
  af_no_results: "Keine Ergebnisse gefunden",
  af_manual_hint:
    "Vermögenswerte manuell eingeben, die nicht auf Yahoo Finance zu finden sind (z.B. Investmentfonds).\nWenn Sie die ISIN oder das Symbol kennen, geben Sie es ein und versuchen Sie, den aktuellen Kurs abzurufen.",
  af_entry_mode_simple: "Einfach",
  af_entry_mode_detail: "Detailliert",
  af_simple_amount_label: "Aktueller Wert *",
  af_simple_amount_placeholder: "Aktuellen Marktwert eingeben",
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
  af_manual_name_placeholder: "z.B. iShares MSCI World ETF",
  af_manual_ticker_placeholder: "0P0001D75H.T oder JP90C000KRC0",
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
  af_account_label: "Depot",
  af_account_none: "Kein Depot",

  broker_manage_btn: "Depots",
  broker_title: "Konto-Verwaltung",
  broker_add_btn: "Depot hinzufügen",
  broker_edit_btn: "Bearbeiten",
  broker_save_btn: "Speichern",
  broker_delete_btn: "Löschen",
  broker_cancel_btn: "Abbrechen",
  broker_empty: "Keine Depots registriert. Fügen Sie ein Depot hinzu.",
  broker_country_label: "Land",
  broker_name_label: "Institut",
  broker_type_label: "Depot-Typ",
  broker_nickname_label: "Spitzname",
  broker_name_placeholder: "z.B. Fidelity, ING, Comdirect, Deutsche Bank",
  broker_type_placeholder: "z.B. Depot, IRA, ISA, Roth IRA",
  broker_nickname_placeholder: "z.B. ING Depot, Fidelity IRA",
  broker_delete_confirm: "Dieses Depot löschen?",
  broker_col_nickname: "Spitzname",
  broker_col_broker: "Institut",
  broker_col_type: "Depot-Typ",
  broker_col_country: "Land",

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

  nav_fire: "Freiheitsplaner",
  fire_title: "Finanzielle Freiheit Planer",
  fire_desc: "Prognostizieren Sie, wann Sie finanzielle Unabhängigkeit (FIRE) erreichen können, basierend auf Ihrem aktuellen Vermögen, Ihren Ersparnissen und der erwarteten Rendite.",
  fire_tab_target: "Nach Zielbetrag",
  fire_tab_expense: "Nach monatlichen Ausgaben",
  fire_use_portfolio_assets: "Portfoliovermögen verwenden",
  fire_current_assets: "Aktuelles Gesamtvermögen",
  fire_monthly_savings: "Monatliche Ersparnisse",
  fire_helper_expected_return: "Die historische durchschnittliche Jahresrendite von Märkten wie dem S&P 500 liegt typischerweise bei 7~10%.",
  fire_expected_return: "Erwartete Jahresrendite (%)",
  fire_target_amount: "Ziel-Nettovermögen",
  fire_monthly_expense: "Ziel für monatliche Ausgaben",
  fire_helper_safe_withdrawal: "Basierend auf der Trinity-Studie wird die 4%-Regel empfohlen, damit das Vermögen im Ruhestand nicht aufgebraucht wird.",
  fire_safe_withdrawal_rate: "Sichere Entnahmerate (%)",
  fire_calculate_btn: "Berechnen",
  fire_res_years_label: "Jahre bis FIRE",
  fire_res_age_label: "Erwartetes Alter",
  fire_res_yrs: "J.",
  fire_res_out_of_bounds: "Außerhalb des Berechnungsbereichs. Erhöhen Sie die Sparrate oder Rendite!",
  fire_result_already_reached: "Herzlichen Glückwunsch! Sie haben Ihr Ziel bereits erreicht. 🎉",
  fire_chart_title: "Prognostiziertes Vermögenswachstum",
  fire_chart_asset: "Prognostiziertes Vermögen",
  fire_chart_target: "Zielbetrag",
  fire_tooltip_year: (year, age) => `Jahr ${year}${age ? ` (Alter ${age})` : ''}`,
  fire_age_label: "Aktuelles Alter (optional)",
  fire_age_placeholder: "z.B. 30",
  fire_error_savings_exceed_target: "Die monatlichen Ersparnisse übersteigen den Zielvermögensbetrag. Bitte überprüfen Sie Ihren Zielbetrag oder Ihre Ersparnisse.",

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
