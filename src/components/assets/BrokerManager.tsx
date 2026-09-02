import { useState } from "react";
import { Landmark, Pencil, Trash2, Check, X } from "lucide-react";
import { useBrokerStore } from "@/stores";
import { Button, Input, CustomSelect, Label } from "@/components/common";
import { useT } from "@/hooks";
import { cn } from "@/utils/cn";
import {
  ACCOUNT_TYPES_BY_COUNTRY,
  getAccountTypeBadgeStyle,
} from "@/constants";
import type { BrokerAccount, Market } from "@/types";

const COUNTRY_OPTIONS: { value: Market; label: string }[] = [
  { value: "KR", label: "한국 (KR)" },
  { value: "JP", label: "日本 (JP)" },
  { value: "US", label: "US (US)" },
  { value: "EU", label: "EU (EU)" },
  { value: "OTHER", label: "기타 / Other" },
];

type EditingState = {
  id: string | null; // null = 신규 추가
  country: Market;
  broker: string;
  accountType: string;
  isCustomType: boolean;
  nickname: string;
};

const EMPTY_FORM: EditingState = {
  id: null,
  country: "JP",
  broker: "",
  accountType: "",
  isCustomType: false,
  nickname: "",
};

function isPresetType(type: string, country: Market): boolean {
  if (!type) return true;
  return ACCOUNT_TYPES_BY_COUNTRY[country]?.some((opt) => opt.value === type) ?? false;
}

export function BrokerManager() {
  const accounts = useBrokerStore((s) => s.accounts);
  const addAccount = useBrokerStore((s) => s.addAccount);
  const updateAccount = useBrokerStore((s) => s.updateAccount);
  const deleteAccount = useBrokerStore((s) => s.deleteAccount);
  const t = useT();
  const [editing, setEditing] = useState<EditingState | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const openAdd = () => {
    setDeletingId(null);
    setEditing({ ...EMPTY_FORM });
  };

  const openEdit = (a: BrokerAccount) => {
    setDeletingId(null);
    const custom = !isPresetType(a.accountType, a.country);
    setEditing({
      id: a.id,
      country: a.country,
      broker: a.broker,
      accountType: a.accountType,
      isCustomType: custom,
      nickname: a.nickname,
    });
  };

  const handleCountryChange = (newCountry: Market) => {
    if (!editing) return;
    const currentType = editing.accountType;
    const stillPreset = ACCOUNT_TYPES_BY_COUNTRY[newCountry]?.some(
      (opt) => opt.value === currentType,
    );
    setEditing({
      ...editing,
      country: newCountry,
      isCustomType: currentType !== "" && !stillPreset,
    });
  };

  const handleTypeSelect = (selectedVal: string) => {
    if (!editing) return;
    if (selectedVal === "__CUSTOM__") {
      setEditing({
        ...editing,
        isCustomType: true,
        accountType: isPresetType(editing.accountType, editing.country)
          ? ""
          : editing.accountType,
      });
    } else {
      setEditing({
        ...editing,
        isCustomType: false,
        accountType: selectedVal,
      });
    }
  };

  const handleSave = () => {
    if (!editing) return;
    const { id, isCustomType: _, ...data } = editing;
    if (!data.nickname.trim()) return;
    if (id) {
      updateAccount(id, data);
    } else {
      addAccount(data);
    }
    setEditing(null);
  };

  const currentCountryPresets = editing
    ? ACCOUNT_TYPES_BY_COUNTRY[editing.country] ?? []
    : [];

  const typeOptions = [
    { value: "", label: t.broker_type_none },
    ...currentCountryPresets.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    { value: "__CUSTOM__", label: t.broker_type_custom },
  ];

  const selectedTypeValue = editing?.isCustomType
    ? "__CUSTOM__"
    : (editing?.accountType ?? "");

  const formatSuggestedNickname = (broker: string, accountType: string): string => {
    const b = broker.trim();
    const act = accountType.trim();
    if (!b && !act) return "";
    if (!b) return act;
    if (!act) return b;
    if (act === "NISA (성장)") return `${b} NISA 성장`;
    if (act === "NISA (적립)") return `${b} NISA 적립`;
    return `${b} ${act}`;
  };

  const suggestedNickname = editing
    ? formatSuggestedNickname(editing.broker, editing.accountType)
    : "";

  return (
    <div className="space-y-4">
      {/* 계좌 목록 */}
      {accounts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-800/80 bg-zinc-900/20 py-8 text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-full bg-zinc-900 text-zinc-500">
            <Landmark className="size-5" />
          </div>
          <p className="text-sm font-medium text-zinc-400">
            {t.broker_empty}
          </p>
        </div>
      ) : (
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
                        onClick={() => openEdit(a)}
                        title={t.broker_edit_btn}
                        className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(a.id)}
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
                        onClick={() => {
                          deleteAccount(a.id);
                          setDeletingId(null);
                        }}
                        className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30"
                      >
                        <Check className="size-3" />
                        {t.broker_confirm_btn}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
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
                            onClick={() => {
                              deleteAccount(a.id);
                              setDeletingId(null);
                            }}
                            className="flex items-center gap-1 rounded bg-red-500/20 px-2 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/30"
                          >
                            <Check className="size-3" />
                            {t.broker_confirm_btn}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
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
                            onClick={() => openEdit(a)}
                            title={t.broker_edit_btn}
                            className="flex size-7 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                          >
                            <Pencil className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(a.id)}
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
      )}

      {/* 추가/수정 폼 */}
      {editing ? (
        <div className="animate-in fade-in space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 duration-150">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold tracking-wide text-zinc-300 uppercase">
              {editing.id ? t.broker_edit_btn : t.broker_add_btn}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="block">
              <Label>{t.broker_country_label}</Label>
              <CustomSelect<Market>
                value={editing.country}
                onChange={handleCountryChange}
                options={COUNTRY_OPTIONS}
              />
            </div>
            <div className="block">
              <Label>{t.broker_name_label}</Label>
              <Input
                type="text"
                value={editing.broker}
                onChange={(e) =>
                  setEditing({ ...editing, broker: e.target.value })
                }
                placeholder={t.broker_name_placeholder}
              />
            </div>
            <div className="block">
              <Label>{t.broker_type_label}</Label>
              <CustomSelect<string>
                value={selectedTypeValue}
                onChange={handleTypeSelect}
                options={typeOptions}
              />
              {editing.isCustomType && (
                <div className="animate-in fade-in mt-2 duration-150">
                  <Input
                    type="text"
                    value={editing.accountType}
                    onChange={(e) =>
                      setEditing({ ...editing, accountType: e.target.value })
                    }
                    placeholder={t.broker_type_custom_placeholder}
                    autoFocus
                  />
                </div>
              )}
            </div>
            <div className="block">
              <Label>{t.broker_nickname_label} *</Label>
              <Input
                type="text"
                value={editing.nickname}
                autoFocus={!editing.isCustomType}
                onChange={(e) =>
                  setEditing({ ...editing, nickname: e.target.value })
                }
                placeholder={suggestedNickname ? `예: ${suggestedNickname}` : t.broker_nickname_placeholder}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setEditing(null)}
            >
              {t.broker_cancel_btn}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              disabled={!editing.nickname.trim()}
            >
              {t.broker_save_btn}
            </Button>
          </div>
        </div>
      ) : (
        <Button type="button" variant="secondary" size="sm" onClick={openAdd}>
          + {t.broker_add_btn}
        </Button>
      )}
    </div>
  );
}

