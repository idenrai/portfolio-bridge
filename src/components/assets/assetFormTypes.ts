import type { AssetType, Market, CurrencyCode } from "@/types";

export type FormMode = "stock" | "cash" | "crypto";

export interface SelectedStock {
  name: string;
  ticker: string;
  type: AssetType;
  market: Market;
  currency: CurrencyCode;
  currentPrice: number;
}
