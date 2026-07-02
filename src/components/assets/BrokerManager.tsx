import { useState } from "react";
import { useBrokerStore } from "@/stores";
import { Button, Input, Select, Label } from "@/components/common";
import { useT } from "@/hooks";
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
  nickname: string;
};

const EMPTY_FORM: EditingState = {
  id: null,
  country: "JP",
  broker: "",
  accountType: "",
  nickname: "",
};

export function BrokerManager() {
  const { accounts, addAccount, updateAccount, deleteAccount } =
    useBrokerStore();
  const t = useT();
  const [editing, setEditing] = useState<EditingState | null>(null);

  const openAdd = () => setEditing({ ...EMPTY_FORM });

  const openEdit = (a: BrokerAccount) =>
    setEditing({
      id: a.id,
      country: a.country,
      broker: a.broker,
      accountType: a.accountType,
      nickname: a.nickname,
    });

  const handleSave = () => {
    if (!editing) return;
    const { id, ...data } = editing;
    if (!data.nickname.trim()) return;
    if (id) {
      updateAccount(id, data);
    } else {
      addAccount(data);
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm(t.broker_delete_confirm)) return;
    deleteAccount(id);
  };

  
  return (
    <div className="space-y-4">
      {/* 계좌 목록 */}
      {accounts.length === 0 ? (
        <p className="py-4 text-center text-sm text-zinc-400">
          {t.broker_empty}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs whitespace-nowrap text-zinc-500">
                <th className="py-2 pr-3 text-left font-medium">
                  {t.broker_col_nickname}
                </th>
                <th className="py-2 pr-3 text-left font-medium">
                  {t.broker_col_broker}
                </th>
                <th className="py-2 pr-3 text-left font-medium">
                  {t.broker_col_type}
                </th>
                <th className="py-2 pr-3 text-left font-medium">
                  {t.broker_col_country}
                </th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-zinc-800 whitespace-nowrap hover:bg-zinc-900/50"
                >
                  <td
                    className="max-w-[120px] truncate py-2 pr-3 font-medium text-zinc-100"
                    title={a.nickname}
                  >
                    {a.nickname}
                  </td>
                  <td
                    className="max-w-[100px] truncate py-2 pr-3 text-zinc-400"
                    title={a.broker}
                  >
                    {a.broker}
                  </td>
                  <td className="py-2 pr-3">
                    {a.accountType && (
                      <span className="rounded-full border border-zinc-700 bg-zinc-800/50 px-2 py-0.5 text-xs text-zinc-300">
                        {a.accountType}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-zinc-500">{a.country}</td>
                  <td className="py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="px-1 text-xs text-zinc-400 transition-colors hover:text-zinc-100"
                      >
                        {t.broker_edit_btn}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        className="px-1 text-xs text-red-500 hover:underline"
                      >
                        {t.broker_delete_btn}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 추가/수정 폼 */}
      {editing ? (
        <div className="space-y-3 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
          <p className="text-xs font-semibold tracking-wide text-zinc-400 uppercase">
            {editing.id ? t.broker_edit_btn : t.broker_add_btn}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="block">
              <Label>
                {t.broker_country_label}
              </Label>
              <Select
                value={editing.country}
                onChange={(e) =>
                  setEditing({ ...editing, country: e.target.value as Market })
                }
                
              >
                {COUNTRY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="block">
              <Label>
                {t.broker_name_label}
              </Label>
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
              <Label>
                {t.broker_type_label}
              </Label>
              <Input
                type="text"
                value={editing.accountType}
                onChange={(e) =>
                  setEditing({ ...editing, accountType: e.target.value })
                }
                placeholder={t.broker_type_placeholder}
                
              />
            </div>
            <div className="block">
              <Label>
                {t.broker_nickname_label} *
              </Label>
              <Input
                type="text"
                value={editing.nickname}
                autoFocus
                onChange={(e) =>
                  setEditing({ ...editing, nickname: e.target.value })
                }
                placeholder={t.broker_nickname_placeholder}
                
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
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
