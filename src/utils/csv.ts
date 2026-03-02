import type {
  Asset,
  AssetFormData,
  AssetCategory,
  AssetType,
  CurrencyCode,
  Market,
} from "@/types";

const CSV_HEADERS = [
  "name",
  "ticker",
  "type",
  "market",
  "currency",
  "quantity",
  "avgBuyPrice",
  "currentPrice",
  "categories",
  "memo",
] as const;

/**
 * 자산 배열 → CSV 문자열
 */
export function exportToCsv(assets: Asset[]): string {
  const rows = assets.map((a) =>
    [
      quote(a.name),
      quote(a.ticker ?? ""),
      a.type,
      a.market,
      a.currency,
      a.quantity,
      a.avgBuyPrice,
      a.currentPrice,
      a.categories.join(";"),
      quote(a.memo ?? ""),
    ].join(","),
  );
  return [CSV_HEADERS.join(","), ...rows].join("\n");
}

/**
 * CSV 문자열 → AssetFormData 배열 (파싱)
 */
export function parseCsv(csv: string): AssetFormData[] {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];

  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    return {
      name: cols[0] ?? "",
      ticker: cols[1] || undefined,
      type: (cols[2] ?? "stock") as AssetType,
      market: (cols[3] ?? "KR") as Market,
      currency: (cols[4] ?? "KRW") as CurrencyCode,
      quantity: Number(cols[5]) || 0,
      avgBuyPrice: Number(cols[6]) || 0,
      currentPrice: Number(cols[7]) || 0,
      categories: cols[8] ? (cols[8].split(";").filter(Boolean) as AssetCategory[]) : [],
      memo: cols[9] || undefined,
    };
  });
}

/** CSV 다운로드 트리거 */
export function downloadCsv(
  assets: Asset[],
  filename = "portfolio-bridge.csv",
) {
  const csv = exportToCsv(assets);
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

// --- helpers ---

function quote(s: string): string {
  if (s.includes(",") || s.includes('"') || s.includes("\n")) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (const ch of line) {
    if (ch === '"') {
      inQuotes = !inQuotes;
    } else if (ch === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}
