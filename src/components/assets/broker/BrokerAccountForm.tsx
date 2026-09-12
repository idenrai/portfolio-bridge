import { Button, Input, CustomSelect, Label } from "@/components/common";
import { useT } from "@/hooks";
import type { Market } from "@/types";
import { ACCOUNT_TYPES_BY_COUNTRY } from "@/constants";
import {
  COUNTRY_OPTIONS,
  type EditingState,
  isPresetType,
  formatSuggestedNickname,
} from "./brokerHelpers";

interface Props {
  editing: EditingState;
  onUpdateEditing: (updated: EditingState) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function BrokerAccountForm({
  editing,
  onUpdateEditing,
  onSave,
  onCancel,
}: Props) {
  const t = useT();

  const handleCountryChange = (newCountry: Market) => {
    const currentType = editing.accountType;
    const stillPreset = isPresetType(currentType, newCountry);
    onUpdateEditing({
      ...editing,
      country: newCountry,
      isCustomType: currentType !== "" && !stillPreset,
    });
  };

  const handleTypeSelect = (selectedVal: string) => {
    if (selectedVal === "__CUSTOM__") {
      onUpdateEditing({
        ...editing,
        isCustomType: true,
        accountType: isPresetType(editing.accountType, editing.country)
          ? ""
          : editing.accountType,
      });
    } else {
      onUpdateEditing({
        ...editing,
        isCustomType: false,
        accountType: selectedVal,
      });
    }
  };

  const currentCountryPresets =
    ACCOUNT_TYPES_BY_COUNTRY[editing.country] ?? [];

  const typeOptions = [
    { value: "", label: t.broker_type_none },
    ...currentCountryPresets.map((opt) => ({
      value: opt.value,
      label: opt.label,
    })),
    { value: "__CUSTOM__", label: t.broker_type_custom },
  ];

  const selectedTypeValue = editing.isCustomType
    ? "__CUSTOM__"
    : editing.accountType;

  const suggestedNickname = formatSuggestedNickname(
    editing.broker,
    editing.accountType,
  );

  return (
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
              onUpdateEditing({ ...editing, broker: e.target.value })
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
                  onUpdateEditing({
                    ...editing,
                    accountType: e.target.value,
                  })
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
              onUpdateEditing({ ...editing, nickname: e.target.value })
            }
            placeholder={
              suggestedNickname
                ? `예: ${suggestedNickname}`
                : t.broker_nickname_placeholder
            }
          />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-1">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={onCancel}
        >
          {t.broker_cancel_btn}
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onSave}
          disabled={!editing.nickname.trim()}
        >
          {t.broker_save_btn}
        </Button>
      </div>
    </div>
  );
}
