import { Landmark, Pencil, Trash2, Check, X } from "lucide-react";
import { useT } from "@/hooks";
import { cn } from "@/utils/cn";
import { getAccountTypeBadgeStyle } from "@/constants";
import type { BrokerAccount } from "@/types";

interface Props {
  accounts: BrokerAccount[];
  deletingId: string | null;
  onOpenEdit: (account: BrokerAccount) => void;
  onStartDelete: (id: string) => void;
  onConfirmDelete: (id: string) => void;
  onCancelDelete: () => void;
}

export function BrokerAccountList({
  accounts,
  deletingId,
  onOpenEdit,
  onStartDelete,
  onConfirmDelete,
  onCancelDelete,
}: Props) {
  const t = useT();

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-none border border-dashed border-zinc-800/80 bg-zinc-900/20 py-8 text-center font-mono">
        <div className="mb-2 flex size-10 items-center justify-center rounded-none border border-zinc-800 bg-zinc-900 text-zinc-500">
          <Landmark className="size-5" />
        </div>
        <p className="text-sm font-medium text-zinc-400">{t.broker_empty}</p>
      </div>
    );
  }

  return (
    <>
      {/* 모바일 카드 뷰 (< sm) */}
      <div className="space-y-2 sm:hidden">
        {accounts.map((a) => (
          <div
            key={a.id}
            className="rounded-lg border border-zinc-800/80 bg-zinc-900/30 p-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className="truncate font-medium text-zinc-100"
                    title={a.nickname}
                  >
                    {a.nickname}
                  </span>
                  <span className="font-mono text-xs text-zinc-500">
                    {a.country}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-zinc-400">
                  <span>{a.broker || "—"}</span>
                  {a.accountType && (
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-xs font-medium",
                        getAccountTypeBadgeStyle(a.accountType),
                      )}
                    >
                      {a.accountType}
                    </span>
                  )}
                </div>
              </div>

              {deletingId !== a.id && (
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onOpenEdit(a)}
                    title={t.broker_edit_btn}
                    className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartDelete(a.id)}
                    title={t.broker_delete_btn}
                    className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              )}
            </div>

            {deletingId === a.id && (
              <div className="animate-in fade-in mt-3 flex items-center justify-between gap-2 rounded-md border border-red-500/30 bg-red-500/10 p-2 duration-150">
                <span className="text-xs font-medium text-red-400">
                  {t.broker_delete_inline_confirm}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => onConfirmDelete(a.id)}
                    className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30"
                  >
                    <Check className="size-3" />
                    {t.broker_confirm_btn}
                  </button>
                  <button
                    type="button"
                    onClick={onCancelDelete}
                    className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
                  >
                    <X className="size-3" />
                    {t.broker_cancel_btn}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 데스크톱 테이블 뷰 (>= sm) */}
      <div className="hidden overflow-x-auto rounded-lg border border-zinc-800/80 sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/40 text-xs whitespace-nowrap text-zinc-400">
              <th className="px-3 py-2.5 text-left font-medium">
                {t.broker_col_nickname}
              </th>
              <th className="px-3 py-2.5 text-left font-medium">
                {t.broker_col_broker}
              </th>
              <th className="px-3 py-2.5 text-left font-medium">
                {t.broker_col_type}
              </th>
              <th className="px-3 py-2.5 text-left font-medium">
                {t.broker_col_country}
              </th>
              <th className="px-3 py-2.5 text-right font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {accounts.map((a) => (
              <tr
                key={a.id}
                className="whitespace-nowrap transition-colors hover:bg-zinc-900/40"
              >
                <td
                  className="max-w-35 truncate px-3 py-2.5 font-medium text-zinc-100"
                  title={a.nickname}
                >
                  {a.nickname}
                </td>
                <td
                  className="max-w-30 truncate px-3 py-2.5 text-zinc-400"
                  title={a.broker}
                >
                  {a.broker || "—"}
                </td>
                <td className="px-3 py-2.5">
                  {a.accountType ? (
                    <span
                      className={cn(
                        "inline-block rounded-full border px-2 py-0.5 text-xs font-medium",
                        getAccountTypeBadgeStyle(a.accountType),
                      )}
                    >
                      {a.accountType}
                    </span>
                  ) : (
                    <span className="text-xs text-zinc-600">—</span>
                  )}
                </td>
                <td className="px-3 py-2.5 font-mono text-xs text-zinc-400">
                  {a.country}
                </td>
                <td className="px-3 py-2.5 text-right">
                  {deletingId === a.id ? (
                    <div className="animate-in fade-in flex items-center justify-end gap-1.5 duration-150">
                      <span className="text-xs font-medium text-red-400">
                        {t.broker_delete_inline_confirm}
                      </span>
                      <button
                        type="button"
                        onClick={() => onConfirmDelete(a.id)}
                        className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30"
                      >
                        <Check className="size-3" />
                        {t.broker_confirm_btn}
                      </button>
                      <button
                        type="button"
                        onClick={onCancelDelete}
                        className="flex items-center gap-1 rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-400 transition-colors hover:text-zinc-200"
                      >
                        <X className="size-3" />
                        {t.broker_cancel_btn}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => onOpenEdit(a)}
                        title={t.broker_edit_btn}
                        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onStartDelete(a.id)}
                        title={t.broker_delete_btn}
                        className="flex size-7 items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-red-500/15 hover:text-red-400"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
