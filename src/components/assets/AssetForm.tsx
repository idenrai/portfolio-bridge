import { useState } from "react";
import type { AssetFormData, Asset } from "@/types";
import type { FormMode, SelectedStock } from "./assetFormTypes";
import { EditForm } from "./EditForm";
import { ModeSelector } from "./ModeSelector";
import { CashForm } from "./CashForm";
import { CryptoForm } from "./CryptoForm";
import { ManualEntryForm } from "./ManualEntryForm";
import { SearchStep } from "./SearchStep";
import { ConfirmStep } from "./ConfirmStep";

interface Props {
  initial?: Asset;
  onSubmit: (data: AssetFormData) => void;
  onCancel: () => void;
}

export function AssetForm({ initial, onSubmit, onCancel }: Props) {
  const [mode, setMode] = useState<FormMode>("stock");
  const [stockStep, setStockStep] = useState<"search" | "confirm" | "manual">(
    "search",
  );
  const [selectedStock, setSelectedStock] = useState<SelectedStock | null>(
    null,
  );

  if (initial) {
    return (
      <EditForm initial={initial} onSubmit={onSubmit} onCancel={onCancel} />
    );
  }

  return (
    <div className="space-y-5">
      <ModeSelector
        mode={mode}
        onChange={(m) => {
          setMode(m);
          setStockStep("search");
          setSelectedStock(null);
        }}
      />

      {mode === "cash" && <CashForm onSubmit={onSubmit} onCancel={onCancel} />}

      {mode === "crypto" && (
        <CryptoForm onSubmit={onSubmit} onCancel={onCancel} />
      )}

      {mode === "stock" && stockStep === "search" && (
        <SearchStep
          onSelect={(item) => {
            setSelectedStock(item);
            setStockStep("confirm");
          }}
          onManual={() => setStockStep("manual")}
          onCancel={onCancel}
        />
      )}

      {mode === "stock" && stockStep === "manual" && (
        <ManualEntryForm
          onSubmit={onSubmit}
          onBack={() => setStockStep("search")}
        />
      )}

      {mode === "stock" && stockStep === "confirm" && selectedStock && (
        <ConfirmStep
          item={selectedStock}
          onSubmit={onSubmit}
          onBack={() => setStockStep("search")}
        />
      )}
    </div>
  );
}
