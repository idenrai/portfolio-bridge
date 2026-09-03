import type { Asset, GuruProfile, PortfolioSummary, BrokerAccount } from "@/types";
import { DEFAULT_RATES } from "@/types";
import type { Lang } from "@/i18n";
import { LANG_NAMES } from "@/i18n";
import type { GuruSessionSnapshot, UserProfile } from "@/stores";
import { GURU_FOLLOWUP_FOCUS } from "./guruFrameworks";
import {
  formatInBase,
  CATEGORY_LABELS_EN,
  MARKET_LABELS_EN,
  buildPersonaHeader,
  sign,
} from "./promptHelpers";

/**
 * 이전 채팅(첫 번째 프롬프트)에 이어, 포트폴리오의 변동 사항만을 담은
 * 두 번째 프롬프트를 생성합니다.
 */
export function buildGuruFollowUpPrompt(
  guru: GuruProfile,
  prev: GuruSessionSnapshot,
  current: PortfolioSummary,
  lang: Lang = "ko",
  baseCurrency: string = "KRW",
  rates: Record<string, number> = DEFAULT_RATES,
  profile?: Partial<UserProfile>,
  brokers: BrokerAccount[] = [],
  currentAssets: Asset[] = [],
): string {
  const guruName = guru.name;

  // ── 총액 · 손익 변화 ─────────────────────────────────────────────────────
  const valueDelta = current.totalValueKRW - prev.totalValueKRW;
  const valueDeltaPct =
    prev.totalValueKRW > 0 ? (valueDelta / prev.totalValueKRW) * 100 : 0;
  const pnlDelta = current.totalPnLKRW - prev.totalPnLKRW;
  const returnDelta = current.totalReturnPercent - prev.totalReturnPercent;

  const fmt = (n: number) => formatInBase(n, baseCurrency, rates);

  // ── 보유 종목 비교 ────────────────────────────────────────────────────────
  const prevMap = new Map(prev.holdings.map((h) => [h.id, h]));
  const currMap = new Map(
    current.holdings
      .filter((h) => h.type !== "cash")
      .map((h) => [h.id, h]),
  );

  const newHoldings: string[] = [];
  const removedHoldings: string[] = [];
  const changedWeights: string[] = [];

  // 신규 편입
  for (const [id, h] of currMap) {
    if (!prevMap.has(id)) {
      newHoldings.push(
        `  + ${h.name}${h.ticker ? ` [${h.ticker}]` : ""} — weight: ${h.weightPercent.toFixed(1)}%` +
          ` | return: ${sign(h.returnPercent)}${h.returnPercent.toFixed(1)}%`,
      );
    }
  }

  // 제거된 종목
  for (const [id, h] of prevMap) {
    if (!currMap.has(id)) {
      removedHoldings.push(
        `  - ${h.name}${h.ticker ? ` [${h.ticker}]` : ""} (was ${h.weightPercent.toFixed(1)}%)`,
      );
    }
  }

  // 비중 변화 ≥ 1.5%p, return ≥ 5pp, 또는 수량/평단가 변화가 있는 종목
  for (const [id, curr] of currMap) {
    const p = prevMap.get(id);
    if (!p) continue;
    const wDiff = curr.weightPercent - p.weightPercent;
    const rDiff = curr.returnPercent - p.returnPercent;
    const qtyChanged = curr.quantity !== p.quantity;
    const costChanged = Math.abs(curr.avgBuyPrice - p.avgBuyPrice) > 0.001;

    if (Math.abs(wDiff) >= 1.5 || Math.abs(rDiff) >= 5 || qtyChanged || costChanged) {
      const parts: string[] = [
        `  ${curr.name}${curr.ticker ? ` [${curr.ticker}]` : ""}`,
      ];
      if (qtyChanged) {
        const qDiff = curr.quantity - p.quantity;
        parts.push(
          `qty: ${p.quantity} → ${curr.quantity} (${sign(qDiff)}${qDiff})`,
        );
      }
      if (costChanged) {
        parts.push(
          `avg cost: ${p.avgBuyPrice.toFixed(2)} → ${curr.avgBuyPrice.toFixed(2)} ${curr.currency}`,
        );
      }
      parts.push(
        `weight: ${p.weightPercent.toFixed(1)}% → ${curr.weightPercent.toFixed(1)}% (${sign(wDiff)}${wDiff.toFixed(1)}%p)`,
      );
      parts.push(
        `return: ${sign(p.returnPercent)}${p.returnPercent.toFixed(1)}% → ${sign(curr.returnPercent)}${curr.returnPercent.toFixed(1)}% (${sign(rDiff)}${rDiff.toFixed(1)}pp)`,
      );
      if (currentAssets.length > 0 && brokers.length > 0) {
        const brokerMap = new Map<string, BrokerAccount>(brokers.map((b) => [b.id, b]));
        const isMatch = (item: { ticker?: string; name: string; currency: string }) => {
          if (curr.ticker && item.ticker) return item.ticker === curr.ticker;
          return item.name === curr.name && item.currency === curr.currency;
        };

        const currMatching = currentAssets.filter((a) => a.type !== "cash" && isMatch(a));
        const prevMatching = prev.assets?.filter((a) => isMatch(a)) ?? [];

        if (prev.assets && prev.assets.length > 0) {
          const allBrokerIds = Array.from(
            new Set([
              ...currMatching.map((a) => a.brokerId || "__unassigned__"),
              ...prevMatching.map((a) => a.brokerId || "__unassigned__"),
            ]),
          );

          if (allBrokerIds.length > 1) {
            const accDeltas: string[] = [];
            for (const bid of allBrokerIds) {
              const b = bid !== "__unassigned__" ? brokerMap.get(bid) : undefined;
              const name = b ? (b.nickname || b.broker) : "Unassigned";
              const prevPos = prevMatching.find((a) => (a.brokerId || "__unassigned__") === bid);
              const currPos = currMatching.find((a) => (a.brokerId || "__unassigned__") === bid);

              const prevQ = prevPos?.quantity ?? 0;
              const currQ = currPos?.quantity ?? 0;
              if (prevQ !== currQ) {
                const qDelta = currQ - prevQ;
                accDeltas.push(
                  `"${name}": ${prevQ.toLocaleString()} → ${currQ.toLocaleString()} (${sign(qDelta)}${qDelta.toLocaleString()})`,
                );
              } else if (currQ > 0) {
                accDeltas.push(`"${name}": ${currQ.toLocaleString()} (no change)`);
              }
            }
            if (accDeltas.length > 0) {
              parts.push(`account changes: ${accDeltas.join(", ")}`);
            }
          } else if (currMatching.length === 1 && currMatching[0].brokerId) {
            const b = brokerMap.get(currMatching[0].brokerId);
            if (b) {
              parts.push(`account: "${b.nickname || b.broker}"`);
            }
          }
        } else {
          // 레거시 스냅샷(prev.assets 미보유 시) 폴백
          if (currMatching.length > 1) {
            const accParts = currMatching
              .map((a) => {
                const b = a.brokerId ? brokerMap.get(a.brokerId) : undefined;
                const name = b ? (b.nickname || b.broker) : "Unassigned";
                return `${a.quantity.toLocaleString()} in "${name}"`;
              })
              .join(", ");
            parts.push(`accounts: ${accParts}`);
          }
        }
      }
      changedWeights.push(parts[0] + " | " + parts.slice(1).join(" | "));
    }
  }

  // ── 카테고리 배분 변화 ────────────────────────────────────────────────────
  const prevCatMap = new Map(prev.categoryAllocation.map((c) => [c.category, c.percent]));
  const catChanges = current.categoryAllocation
    .map((c) => {
      const prevPct = prevCatMap.get(c.category) ?? 0;
      const diff = c.percent - prevPct;
      const label = CATEGORY_LABELS_EN[c.category as keyof typeof CATEGORY_LABELS_EN] ?? c.category;
      return { label, prev: prevPct, curr: c.percent, diff };
    })
    .filter((c) => Math.abs(c.diff) >= 1.0);

  // prev에만 있던 카테고리 (완전 제거)
  for (const [cat, pct] of prevCatMap) {
    if (!current.categoryAllocation.find((c) => c.category === cat)) {
      const label = CATEGORY_LABELS_EN[cat as keyof typeof CATEGORY_LABELS_EN] ?? cat;
      catChanges.push({ label, prev: pct, curr: 0, diff: -pct });
    }
  }

  const categorySection =
    catChanges.length > 0
      ? catChanges
          .map(
            (c) =>
              `  - ${c.label}: ${c.prev.toFixed(1)}% → ${c.curr.toFixed(1)}% (${sign(c.diff)}${c.diff.toFixed(1)}%p)`,
          )
          .join("\n")
      : "  (no significant category changes)";

  // ── 시장 배분 변화 ────────────────────────────────────────────────────────
  const prevMktMap = new Map(prev.marketAllocation.map((m) => [m.market, m.percent]));
  const mktChanges = current.marketAllocation
    .map((m) => {
      const prevPct = prevMktMap.get(m.market) ?? 0;
      const diff = m.percent - prevPct;
      const label = MARKET_LABELS_EN[m.market as keyof typeof MARKET_LABELS_EN] ?? m.market;
      return { label, prev: prevPct, curr: m.percent, diff };
    })
    .filter((m) => Math.abs(m.diff) >= 1.0);

  const marketSection =
    mktChanges.length > 0
      ? mktChanges
          .map(
            (m) =>
              `  - ${m.label}: ${m.prev.toFixed(1)}% → ${m.curr.toFixed(1)}% (${sign(m.diff)}${m.diff.toFixed(1)}%p)`,
          )
          .join("\n")
      : "  (no significant market changes)";

  // ── 현금 비중 변화 ────────────────────────────────────────────────────────
  const cashDiff = current.cashPercent - prev.cashPercent;

  // ── 이상 배분 대비 현재 배분 ──────────────────────────────────────────────
  const idealAllocSection = guru.idealAllocation
    .map((ia) => {
      const label =
        CATEGORY_LABELS_EN[ia.category as keyof typeof CATEGORY_LABELS_EN] ??
        ia.category;
      const currAlloc = current.categoryAllocation.find(
        (c) => c.category === ia.category,
      );
      const currPct = currAlloc?.percent ?? 0;
      const gap = currPct - ia.targetPercent;
      return (
        `  ${label}: target ${ia.targetPercent}% | actual ${currPct.toFixed(1)}%` +
        ` (gap ${sign(gap)}${Math.abs(gap).toFixed(1)}%p)`
      );
    })
    .join("\n");

  const today = new Date().toISOString().slice(0, 10);

  const addressLine = profile?.nickname
    ? `Please address the investor as "${profile.nickname}" throughout your response.`
    : `Maintain ${guruName}'s characteristic voice and reasoning style.`;

  return `${buildPersonaHeader(guruName)}

--- YOUR COMMUNICATION STYLE ---
${guru.style}

--- CONTEXT ---
Today's date: ${today}
This is a follow-up review. You previously assessed this investor's portfolio on ${prev.date}. The data below covers ONLY the changes since that date.

--- YOUR TASK ---
Evaluate the changes from YOUR perspective as ${guruName}. This is a focused check-in, not a full portfolio review.

${GURU_FOLLOWUP_FOCUS[guru.id] 
  ? `Before concluding, briefly think step-by-step about the weight shifts and macro context.\n${GURU_FOLLOWUP_FOCUS[guru.id]}`
  : `Address the following, in order:
1. [Step-by-Step Reasoning] Briefly think step-by-step about the most significant weight shifts and current macro context
2. Whether the changes are moving in the right direction based on your principles
3. Your reaction to the new positions added and positions removed
4. Whether the rebalancing moves were wise or misguided
5. Any specific concerns or approvals about the shifts you observe
6. A brief updated verdict on the portfolio's direction — improving or deteriorating?`}

--- PORTFOLIO PERFORMANCE SINCE LAST REVIEW (${prev.date}) ---
Portfolio value change (${baseCurrency}): ${sign(valueDelta)}${fmt(valueDelta)} (${sign(valueDeltaPct)}${valueDeltaPct.toFixed(2)}%)
P&L change (${baseCurrency}): ${sign(pnlDelta)}${fmt(pnlDelta)}
Return rate: ${sign(prev.totalReturnPercent)}${prev.totalReturnPercent.toFixed(2)}% → ${sign(current.totalReturnPercent)}${current.totalReturnPercent.toFixed(2)}% (${sign(returnDelta)}${returnDelta.toFixed(2)}pp)
Positions: ${prev.holdingCount} → ${current.holdingCount}
Cash %: ${prev.cashPercent.toFixed(1)}% → ${current.cashPercent.toFixed(1)}% (${sign(cashDiff)}${cashDiff.toFixed(1)}%p)

--- YOUR IDEAL ALLOCATION vs. CURRENT ---
${idealAllocSection}

--- NEW POSITIONS ADDED ---
${newHoldings.length > 0 ? newHoldings.join("\n") : "  (none)"}

--- POSITIONS REMOVED ---
${removedHoldings.length > 0 ? removedHoldings.join("\n") : "  (none)"}

--- POSITION CHANGES (qty/avg cost changes, ≥1.5%p weight, or ≥5pp return) ---
${changedWeights.length > 0 ? changedWeights.join("\n") : "  (none)"}

--- CATEGORY ALLOCATION SHIFTS (≥1%p) ---
${categorySection}

--- MARKET ALLOCATION SHIFTS (≥1%p) ---
${marketSection}

--- RESPONSE CONSTRAINTS ---
- Language: respond entirely in ${LANG_NAMES[lang]}
- Scope: focus exclusively on the changes listed above; your general investment philosophy and a full portfolio re-review are out of scope for this check-in
- Voice: Do not hedge with disclaimers (e.g., never say "this is not financial advice"). Speak with direct confidence.
- CRITICAL: Your internal knowledge is outdated. You MUST use your web search tool to find the latest news and price actions up to ${today} for the specific changes mentioned below. Do not rely solely on your internal training data.
- Edge Cases: If the user sold everything to cash, or moved >80% into a single asset, strongly address this extreme move first.
- ${addressLine}`;
}
