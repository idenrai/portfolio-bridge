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
        <p className="text-sm text-slate-400 py-4 text-center">
          {t.broker_empty}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-slate-500 border-b border-slate-100">
                <th className="text-left font-medium py-2 pr-3">
                  {t.broker_col_nickname}
                </th>
                <th className="text-left font-medium py-2 pr-3">
                  {t.broker_col_broker}
                </th>
                <th className="text-left font-medium py-2 pr-3">
                  {t.broker_col_type}
                </th>
                <th className="text-left font-medium py-2 pr-3">
                  {t.broker_col_country}
                </th>
                <th className="py-2" />
              </tr>
            </thead>
            <tbody>
              {accounts.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-slate-50 hover:bg-slate-50"
                >
                  <td className="py-2 pr-3 font-medium text-slate-800">
                    {a.nickname}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{a.broker}</td>
                  <td className="py-2 pr-3">
                    {a.accountType && (
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-100">
                        {a.accountType}
                      </span>
                    )}
                  </td>
                  <td className="py-2 pr-3 text-slate-500">{a.country}</td>
                  <td className="py-2 text-right">
                    <div className="flex gap-1 justify-end">
                      <button
                        type="button"
                        onClick={() => openEdit(a)}
                        className="text-xs text-blue-600 hover:underline px-1"
                      >
                        {t.broker_edit_btn}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(a.id)}
                        className="text-xs text-red-500 hover:underline px-1"
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
        <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
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
