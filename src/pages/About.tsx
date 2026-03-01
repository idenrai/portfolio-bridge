import { useT } from "@/hooks";

const FEATURES = [
  {
    icon: "📊",
    titleKey: "about_feat1_title" as const,
    descKey: "about_feat1_desc" as const,
  },
  {
    icon: "💼",
    titleKey: "about_feat2_title" as const,
    descKey: "about_feat2_desc" as const,
  },
  {
    icon: "💡",
    titleKey: "about_feat3_title" as const,
    descKey: "about_feat3_desc" as const,
  },
  {
    icon: "🤖",
    titleKey: "about_feat4_title" as const,
    descKey: "about_feat4_desc" as const,
  },
  {
    icon: "🔔",
    titleKey: "about_feat5_title" as const,
    descKey: "about_feat5_desc" as const,
  },
  {
    icon: "🌐",
    titleKey: "about_feat6_title" as const,
    descKey: "about_feat6_desc" as const,
  },
] as const;

const STACK = [
  "React 19 + TypeScript",
  "Vite 7",
  "Tailwind CSS v4",
  "Zustand 5",
  "Recharts",
  "Yahoo Finance API",
  "Tauri v2",
  "Vercel",
];

export function AboutPage() {
  const t = useT();

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-10">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white px-8 py-10 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <div className="text-4xl">📈</div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              <span className="text-blue-400">Portfolio</span>
              <span className="text-slate-300">Bridge</span>
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">{t.about_tagline}</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed">{t.about_intro}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href="https://portfolio-bridge-sigma.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors"
          >
            🌐 {t.about_links_live}
          </a>
          <a
            href="https://github.com/idenrai/portfolio-bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 px-4 py-2 text-sm font-semibold text-slate-200 transition-colors"
          >
            🐙 {t.about_links_github}
          </a>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">{t.about_features_title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FEATURES.map((f) => (
            <div
              key={f.titleKey}
              className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm"
            >
              <span className="text-xl flex-shrink-0 mt-0.5">{f.icon}</span>
              <div>
                <p className="text-sm font-semibold text-slate-800">{t[f.titleKey]}</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{t[f.descKey]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 flex items-start gap-3">
        <span className="text-xl flex-shrink-0 mt-0.5">🔒</span>
        <div>
          <p className="text-sm font-semibold text-emerald-800">{t.about_privacy_title}</p>
          <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">{t.about_privacy_desc}</p>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="text-base font-bold text-slate-700 mb-3">{t.about_tech_title}</h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-100 pt-4">
        {t.about_disclaimer}
      </p>
    </div>
  );
}
