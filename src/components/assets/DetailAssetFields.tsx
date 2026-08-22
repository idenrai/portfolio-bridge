import { Button, Input, CustomSelect, Label } from "@/components/common";
import { useT } from "@/hooks";
import type { AssetType, Market } from "@/types";

interface DetailAssetFieldsProps {
  ticker: string;
  setTicker: (val: string) => void;
  assetType: AssetType;
  setAssetType: (val: AssetType) => void;
  market: Market;
  setMarket: (val: Market) => void;
  quantity: number | "";
  setQuantity: (val: number | "") => void;
  avgBuyPrice: number | "";
  setAvgBuyPrice: (val: number | "") => void;
  currentPrice: number | "";
  setCurrentPrice: (val: number | "") => void;
  isFetchingPrice: boolean;
  handleFetchPrice: () => void;
  sym: string;
}

export function DetailAssetFields({
  ticker,
  setTicker,
  assetType,
  setAssetType,
  market,
  setMarket,
  quantity,
  setQuantity,
  avgBuyPrice,
  setAvgBuyPrice,
  currentPrice,
  setCurrentPrice,
  isFetchingPrice,
  handleFetchPrice,
  sym,
}: DetailAssetFieldsProps) {
  const t = useT();

  const ASSET_TYPE_OPTIONS: { value: AssetType; label: string }[] = [
    { value: "stock", label: t.atype_stock },
    { value: "etf", label: t.atype_etf },
    { value: "fund", label: t.atype_fund },
    { value: "bond", label: t.atype_bond },
    { value: "other", label: t.atype_other },
  ];

  const MARKET_OPTIONS: { value: Market; label: string }[] = [
    { value: "JP", label: t.market_jp },
    { value: "US", label: t.market_us },
    { value: "KR", label: t.market_kr },
    { value: "OTHER", label: t.market_other },
  ];

  return (
    <>
      <div className="block">
        <Label>{t.af_ticker_label}</Label>
        <div className="mt-1 flex gap-2">
          <Input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder={t.af_manual_ticker_placeholder}
          />
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={handleFetchPrice}
            disabled={!ticker.trim() || isFetchingPrice}
          >
            {isFetchingPrice ? t.af_fetching : t.af_fetch_price_btn}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="block">
          <Label>{t.af_asset_type_label}</Label>
          <CustomSelect<AssetType>
            value={assetType}
            onChange={(val) => setAssetType(val)}
            options={ASSET_TYPE_OPTIONS}
          />
        </div>
        <div className="block">
          <Label>{t.af_market_label}</Label>
          <CustomSelect<Market>
            value={market}
            onChange={(val) => setMarket(val)}
            options={MARKET_OPTIONS}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="block">
          <Label>{t.af_quantity_label} *</Label>
          <Input
            type="number"
            required
            min={0}
            step="any"
            value={quantity}
            onChange={(e) =>
              setQuantity(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="0"
          />
        </div>
        <div className="block">
          <Label>
            {t.af_avg_price_label} ({sym})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={avgBuyPrice}
            onChange={(e) =>
              setAvgBuyPrice(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            placeholder="0"
          />
        </div>
        <div className="block">
          <Label>
            {t.af_current_price_label} ({sym})
          </Label>
          <Input
            type="number"
            min={0}
            step="any"
            value={currentPrice}
            onChange={(e) =>
              setCurrentPrice(
                e.target.value === "" ? "" : Number(e.target.value),
              )
            }
            placeholder={t.af_current_price_placeholder}
          />
        </div>
      </div>
    </>
  );
}
