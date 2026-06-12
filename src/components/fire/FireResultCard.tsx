import { Card } from "@/components/common";
import { useT } from "@/hooks";
import type { FireResult } from "@/utils/calc/fire";

interface FireResultCardProps {
  result: FireResult | null;
}

export function FireResultCard({ result }: FireResultCardProps) {
  const t = useT();

  if (!result) return null;

  if (result.isInvalidInput) {
    return (
      <div className="flex items-start gap-2 px-4 py-3 rounded-lg border bg-amber-50 border-amber-200 text-amber-800 w-full shadow-sm">
        <span className="text-base shrink-0 mt-0.5">⚠️</span>
        <span className="leading-relaxed flex-1 font-medium text-sm">
          {t.fire_error_savings_exceed_target}
        </span>
      </div>
    );
  }

  return (
    <Card className="p-8 flex flex-col items-center justify-center text-center gap-4 bg-gradient-to-br from-blue-50 to-white border-blue-100">
      <div className="text-4xl mb-2">🏝️</div>
      {result.alreadyReached ? (
        <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
          {t.fire_result_already_reached}
        </h2>
      ) : result.successYear !== null ? (
        <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
          {t.fire_result_success(result.successYear, result.successAge)}
        </h2>
      ) : (
        <h2 className="text-xl md:text-2xl font-semibold text-slate-600">
          계산 범위를 초과했습니다. 저축액이나 수익률을 높여보세요!
        </h2>
      )}
    </Card>
  );
}
