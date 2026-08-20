import { useBrokerStore } from "@/stores";
import { useT } from "@/hooks";
import { CustomSelect, Label } from "@/components/common";

interface Props {
  value: string | undefined;
  onChange: (id: string | undefined) => void;
}

/**
 * 등록된 증권사 계좌를 선택하는 셀렉트박스.
 * 계좌가 하나도 없으면 렌더링하지 않는다.
 */
export function AccountSelect({ value, onChange }: Props) {
  const accounts = useBrokerStore((s) => s.accounts);
  const t = useT();

  if (accounts.length === 0) return null;

  return (
    <div className="block">
      <Label>
        {t.af_account_label}
      </Label>
      <CustomSelect<string>
        value={value ?? ""}
        onChange={(val) => onChange(val || undefined)}
        options={[
          { value: "", label: t.af_account_none },
          ...accounts.map((a) => ({
            value: a.id,
            label: `${a.nickname}${a.broker ? ` (${a.broker}` : ""}${a.accountType ? ` / ${a.accountType})` : a.broker ? ")" : ""}`,
          })),
        ]}
      />
    </div>
  );
}
