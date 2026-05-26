import { useBrokerStore } from "@/stores";
import { useT } from "@/hooks";

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
    <label className="block">
      <span className="text-xs font-medium text-slate-600">
        {t.af_account_label}
      </span>
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
      >
        <option value="">{t.af_account_none}</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.nickname}
            {a.broker ? ` (${a.broker}` : ""}
            {a.accountType ? ` / ${a.accountType})` : a.broker ? ")" : ""}
          </option>
        ))}
      </select>
    </label>
  );
}
