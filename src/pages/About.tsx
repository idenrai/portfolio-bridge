import { useT } from "@/hooks";

const FEATURES = [
  {
    icon: "[ 01 ]",
    titleKey: "about_feat1_title" as const,
    descKey: "about_feat1_desc" as const,
  },
  {
    icon: "[ 02 ]",
    titleKey: "about_feat2_title" as const,
    descKey: "about_feat2_desc" as const,
  },
  {
    icon: "[ 03 ]",
    titleKey: "about_feat3_title" as const,
    descKey: "about_feat3_desc" as const,
  },
  {
    icon: "[ 04 ]",
    titleKey: "about_feat4_title" as const,
    descKey: "about_feat4_desc" as const,
  },
  {
    icon: "[ 05 ]",
    titleKey: "about_feat5_title" as const,
    descKey: "about_feat5_desc" as const,
  },
  {
    icon: "[ 06 ]",
    titleKey: "about_feat7_title" as const,
    descKey: "about_feat7_desc" as const,
  },
] as const;

const STACK = [
  "React 19 + TypeScript",
  "Vite 7",
  "Tailwind CSS v4",
  "Zustand 5",
  "Lucide React",
  "Recharts",
  "Yahoo Finance API",
  "Tauri v2",
  "Vercel",
];

export function AboutPage() {
  const t = useT();

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-10 md:space-y-8">
      {/* Hero */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 px-5 py-7 text-white shadow-lg md:px-8 md:py-10">
        <div className="mb-4 flex items-center gap-4">
          <img src="/favicon.svg" className="size-10 rounded-xl border border-zinc-800 md:size-12" alt="" aria-hidden="true" />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-balance text-white md:text-2xl">
              Portfolio Bridge
            </h1>
            <p className="mt-1 text-sm text-zinc-400">{t.about_tagline}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-zinc-300">
          {t.about_intro}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <a
            href="https://github.com/idenrai/portfolio-bridge"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-semibold text-zinc-300 transition-colors hover:bg-zinc-800 hover:text-white"
          >
            <svg
              viewBox="0 0 16 16"
              className="size-4 fill-current"
              aria-hidden="true"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
            {t.about_links_github}
          </a>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="mb-3 text-base font-bold text-zinc-200">
          {t.about_features_title}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {FEATURES.map((f, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 rounded-xl border border-zinc-800 bg-black p-3 shadow-sm md:gap-3.5 md:p-4"
            >
              <div className="flex h-10 w-auto min-w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900 px-2 font-mono text-sm whitespace-nowrap text-zinc-400">
                {f.icon}
              </div>
              <div className="pt-0.5">
                <p className="text-sm font-bold text-zinc-100">
                  {t[f.titleKey]}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-400">
                  {t[f.descKey]}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Foundations */}
      <div className="grid grid-cols-1 gap-3 md:gap-3.5">
        {/* Global */}
        <div className="flex items-start gap-3.5 rounded-xl border border-l-4 border-zinc-800 border-l-blue-500 bg-zinc-900 px-4 py-3 shadow-sm md:px-5 md:py-4">
          <div className="flex h-8 w-auto shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 px-2 font-mono text-sm text-zinc-400">
            [ GLOBAL ]
          </div>
          <div className="pt-0.5">
            <p className="text-sm font-bold text-zinc-200">
              {t.about_feat6_title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {t.about_feat6_desc}
            </p>
          </div>
        </div>

        {/* Secure */}
        <div className="flex items-start gap-3.5 rounded-xl border border-l-4 border-zinc-800 border-l-emerald-500 bg-zinc-900 px-4 py-3 shadow-sm md:px-5 md:py-4">
          <div className="flex h-8 w-auto shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 px-2 font-mono text-sm text-zinc-400">
            [ SECURE ]
          </div>
          <div className="pt-0.5">
            <p className="text-sm font-bold text-zinc-200">
              {t.about_privacy_title}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-400">
              {t.about_privacy_desc}
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div>
        <h2 className="mb-3 text-base font-bold text-zinc-200">
          {t.about_tech_title}
        </h2>
        <div className="flex flex-wrap gap-2">
          {STACK.map((s) => (
            <span
              key={s}
              className="rounded-md border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 font-mono text-xs tracking-wider text-zinc-400 uppercase shadow-sm"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <p className="border-t border-zinc-800 pt-5 text-xs leading-relaxed text-zinc-500">
        {t.about_disclaimer}
      </p>
    </div>
  );
}
