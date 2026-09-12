import { useState } from "react";
import { useBrokerStore } from "@/stores";
import { Button } from "@/components/common";
import { useT } from "@/hooks";
import type { BrokerAccount } from "@/types";
import {
  BrokerAccountList,
  BrokerAccountForm,
  EMPTY_FORM,
  isPresetType,
} from "./broker";
import type { EditingState } from "./broker";

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

  const handleDelete = (id: string) => {
    deleteAccount(id);
    setDeletingId(null);
  };

  return (
    <div className="space-y-4">
      {/* 계좌 목록 (카드 뷰 + 테이블 뷰) */}
      <BrokerAccountList
        accounts={accounts}
        deletingId={deletingId}
        onOpenEdit={openEdit}
        onStartDelete={(id) => setDeletingId(id)}
        onConfirmDelete={handleDelete}
        onCancelDelete={() => setDeletingId(null)}
      />

      {/* 추가/수정 폼 */}
      {editing ? (
        <BrokerAccountForm
          editing={editing}
          onUpdateEditing={setEditing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <Button type="button" variant="secondary" size="sm" onClick={openAdd}>
          + {t.broker_add_btn}
        </Button>
      )}
    </div>
  );
}
