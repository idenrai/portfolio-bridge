import { useT } from "@/hooks";
import { Modal, Button } from "@/components/common";
import type { AssetFormData } from "@/types";

interface CSVPreviewModalProps {
  open: boolean;
  previewData: AssetFormData[] | null;
  onClose: () => void;
  onConfirm: () => void;
}

export function CSVPreviewModal({
  open,
  previewData,
  onClose,
  onConfirm,
}: CSVPreviewModalProps) {
  const t = useT();

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={previewData ? t.csv_preview_title(previewData.length) : ""}
      maxWidth="max-w-3xl"
    >
      {previewData && (
        <div className="space-y-4">
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                  <th className="px-3 py-2">{t.at_col_name}</th>
                  <th className="px-3 py-2">{t.at_col_ticker}</th>
                  <th className="px-3 py-2">{t.at_col_market}</th>
                  <th className="px-3 py-2">{t.af_currency_label}</th>
                  <th className="px-3 py-2 text-right">
                    {t.af_quantity_label}
                  </th>
                  <th className="px-3 py-2 text-right">
                    {t.af_avg_price_label}
                  </th>
                  <th className="px-3 py-2 text-right">
                    {t.af_current_price_label}
                  </th>
                  <th className="px-3 py-2">{t.at_col_category}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {previewData.slice(0, 5).map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50">
                    <td className="px-3 py-1.5 text-slate-800 font-medium">
                      {row.name}
                    </td>
                    <td className="px-3 py-1.5 font-mono text-slate-500">
                      {row.ticker ?? "—"}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">
                      {row.market}
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">
                      {row.currency}
                    </td>
                    <td className="px-3 py-1.5 text-right text-slate-700">
                      {row.quantity.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right text-slate-700">
                      {row.avgBuyPrice.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-right text-slate-700">
                      {row.currentPrice.toLocaleString()}
                    </td>
                    <td className="px-3 py-1.5 text-slate-500">
                      {row.categories.join(", ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {previewData.length > 5 && (
            <p className="text-xs text-slate-400 text-center">
              {t.csv_preview_more(previewData.length - 5)}
            </p>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              {t.af_btn_cancel}
            </Button>
            <Button onClick={onConfirm}>{t.csv_preview_confirm}</Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
