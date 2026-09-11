import {
  useAssetStore,
  useSettingsStore,
  useProfileStore,
  useSnapshotStore,
  useBrokerStore,
  useFireStore,
  useCustomGuruStore,
  useGuruSessionStore,
  useLanguageStore,
  type PortfolioSnapshot,
} from "@/stores";
import type { Asset, BrokerAccount } from "@/types";
import type { Lang } from "@/i18n";

export interface FullPortfolioBackup {
  app: "PortfolioBridge";
  version: 1;
  exportedAt: string;
  data: {
    assets: Asset[];
    settings: {
      baseCurrency: string;
      targetAllocations: unknown[];
    };
    profile: {
      nickname: string;
      age: number | null;
      annualIncome: number | null;
      monthlyBudget: number | null;
      plan3y: string;
      plan5y: string;
      plan10y: string;
      notes: string;
    };
    snapshots: unknown[];
    brokerAccounts: unknown[];
    fire: {
      mode: string;
      monthlySavings: number;
      expectedReturnRate: number;
      targetAmount: number;
      monthlyExpense: number;
      safeWithdrawalRate: number;
      currentAge: number | null;
      usePortfolioAssets: boolean;
      manualCurrentAssets: number;
    };
    customGuru?: unknown;
    guruSessions?: Record<string, unknown>;
    lang: Lang;
  };
}

/** 모든 로컬 스토어 상태를 추출하여 통합 백업 데이터 생성 */
export function createFullBackup(): FullPortfolioBackup {
  const { assets } = useAssetStore.getState();
  const { baseCurrency, targetAllocations } = useSettingsStore.getState();
  const { nickname, age, annualIncome, monthlyBudget, plan3y, plan5y, plan10y, notes } =
    useProfileStore.getState();
  const { snapshots } = useSnapshotStore.getState();
  const { accounts: brokerAccounts } = useBrokerStore.getState();
  const {
    mode,
    monthlySavings,
    expectedReturnRate,
    targetAmount,
    monthlyExpense,
    safeWithdrawalRate,
    currentAge,
    usePortfolioAssets,
    manualCurrentAssets,
  } = useFireStore.getState();
  const { config: customGuru } = useCustomGuruStore.getState();
  const { sessions: guruSessions } = useGuruSessionStore.getState();
  const { lang } = useLanguageStore.getState();

  return {
    app: "PortfolioBridge",
    version: 1,
    exportedAt: new Date().toISOString(),
    data: {
      assets,
      settings: {
        baseCurrency,
        targetAllocations: targetAllocations ?? [],
      },
      profile: {
        nickname,
        age,
        annualIncome,
        monthlyBudget,
        plan3y,
        plan5y,
        plan10y,
        notes,
      },
      snapshots,
      brokerAccounts,
      fire: {
        mode,
        monthlySavings,
        expectedReturnRate,
        targetAmount,
        monthlyExpense,
        safeWithdrawalRate,
        currentAge,
        usePortfolioAssets,
        manualCurrentAssets,
      },
      customGuru,
      guruSessions,
      lang,
    },
  };
}

/** 전체 포트폴리오 데이터를 JSON 파일로 다운로드 */
export function exportFullBackupAsJson(
  filename = `portfolio-bridge-backup-${new Date().toISOString().slice(0, 10)}.json`,
): void {
  const backup = createFullBackup();
  const json = JSON.stringify(backup, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** 백업 데이터 스키마 유효성 검증 (Type Guard) */
export function validateBackupData(obj: unknown): obj is FullPortfolioBackup {
  if (!obj || typeof obj !== "object") return false;
  const b = obj as Record<string, unknown>;
  if (b.app !== "PortfolioBridge" || b.version !== 1 || !b.data || typeof b.data !== "object") {
    return false;
  }
  const data = b.data as Record<string, unknown>;
  if (!Array.isArray(data.assets) || !data.settings || typeof data.settings !== "object") {
    return false;
  }
  return true;
}

/** 백업 데이터 내 개별 자산 레코드의 유효성을 검증하고 오염된 데이터를 필터링 (Zero-Trust) */
export function sanitizeAssets(rawAssets: unknown[]): Asset[] {
  if (!Array.isArray(rawAssets)) return [];
  return rawAssets.filter((item): item is Asset => {
    if (!item || typeof item !== "object") return false;
    const a = item as Record<string, unknown>;
    return (
      typeof a.id === "string" &&
      a.id.trim().length > 0 &&
      typeof a.name === "string" &&
      a.name.trim().length > 0 &&
      typeof a.type === "string" &&
      typeof a.market === "string" &&
      typeof a.currency === "string" &&
      typeof a.quantity === "number" &&
      !Number.isNaN(a.quantity) &&
      typeof a.avgBuyPrice === "number" &&
      !Number.isNaN(a.avgBuyPrice) &&
      typeof a.currentPrice === "number" &&
      !Number.isNaN(a.currentPrice) &&
      Array.isArray(a.categories)
    );
  });
}

/** 백업 데이터 내 스냅샷 레코드의 유효성을 검증하고 오염된 데이터를 필터링 (Zero-Trust) */
export function sanitizeSnapshots(rawSnapshots: unknown[]): PortfolioSnapshot[] {
  if (!Array.isArray(rawSnapshots)) return [];
  return rawSnapshots.filter((item): item is PortfolioSnapshot => {
    if (!item || typeof item !== "object") return false;
    const s = item as Record<string, unknown>;
    return (
      typeof s.date === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(s.date) &&
      typeof s.totalValueKRW === "number" &&
      !Number.isNaN(s.totalValueKRW) &&
      typeof s.totalCostKRW === "number" &&
      !Number.isNaN(s.totalCostKRW)
    );
  });
}

/** 백업 데이터 내 브로커 계좌 레코드의 유효성을 검증하고 오염된 데이터를 필터링 (Zero-Trust) */
export function sanitizeBrokerAccounts(rawAccounts: unknown[]): BrokerAccount[] {
  if (!Array.isArray(rawAccounts)) return [];
  return rawAccounts.filter((item): item is BrokerAccount => {
    if (!item || typeof item !== "object") return false;
    const b = item as Record<string, unknown>;
    return (
      typeof b.id === "string" &&
      b.id.trim().length > 0 &&
      typeof b.country === "string" &&
      b.country.trim().length > 0 &&
      typeof b.broker === "string" &&
      b.broker.trim().length > 0
    );
  });
}

/** JSON 문자열로부터 전체 백업 복원 */
export function importFullBackupFromJson(jsonString: string): {
  success: boolean;
  error?: "invalid_format" | "quota_exceeded" | string;
} {
  try {
    // 브라우저 localStorage 한도(~5MB) 사전 방어 (UTF-16 기준 4.5MB 초과 시 차단)
    const estimatedBytes = jsonString.length * 2;
    if (estimatedBytes > 4.5 * 1024 * 1024) {
      return { success: false, error: "quota_exceeded" };
    }

    const parsed = JSON.parse(jsonString);
    if (!validateBackupData(parsed)) {
      return { success: false, error: "invalid_format" };
    }

    const { data } = parsed;

    // 1. 자산 복원 (유효한 필드를 갖춘 레코드만 필터링)
    if (Array.isArray(data.assets)) {
      const sanitizedAssets = sanitizeAssets(data.assets);
      useAssetStore.setState({ assets: sanitizedAssets });
    }

    // 2. 설정 복원
    if (data.settings) {
      if (data.settings.baseCurrency) {
        useSettingsStore.getState().setBaseCurrency(data.settings.baseCurrency as never, true);
      }
      if (Array.isArray(data.settings.targetAllocations)) {
        useSettingsStore.getState().setTargetAllocations(data.settings.targetAllocations as never);
      }
    }

    // 3. 프로필 복원
    if (data.profile) {
      useProfileStore.getState().setProfile(data.profile);
    }

    // 4. 스냅샷 복원 (유효한 필드를 갖춘 레코드만 필터링)
    if (Array.isArray(data.snapshots)) {
      const sanitizedSnapshots = sanitizeSnapshots(data.snapshots);
      useSnapshotStore.setState({ snapshots: sanitizedSnapshots });
    }

    // 5. 브로커 계좌 복원 (유효한 필드를 갖춘 레코드만 필터링)
    if (Array.isArray(data.brokerAccounts)) {
      const sanitizedBrokers = sanitizeBrokerAccounts(data.brokerAccounts);
      useBrokerStore.setState({ accounts: sanitizedBrokers });
    }

    // 6. FIRE 계획 복원
    if (data.fire) {
      useFireStore.setState({
        mode: (data.fire.mode as never) ?? "expense",
        monthlySavings: data.fire.monthlySavings ?? 1000000,
        expectedReturnRate: data.fire.expectedReturnRate ?? 7,
        targetAmount: data.fire.targetAmount ?? 1000000000,
        monthlyExpense: data.fire.monthlyExpense ?? 3000000,
        safeWithdrawalRate: data.fire.safeWithdrawalRate ?? 4,
        currentAge: data.fire.currentAge ?? null,
        usePortfolioAssets: data.fire.usePortfolioAssets ?? true,
        manualCurrentAssets: data.fire.manualCurrentAssets ?? 0,
      });
    }

    // 7. 커스텀 구루 복원
    if (data.customGuru && typeof data.customGuru === "object") {
      useCustomGuruStore.getState().updateConfig(data.customGuru as never);
    }

    // 8. 구루 세션 복원
    if (data.guruSessions && typeof data.guruSessions === "object") {
      useGuruSessionStore.setState({ sessions: data.guruSessions as never });
    }

    // 9. 언어 설정 복원
    if (data.lang) {
      useLanguageStore.getState().setLang(data.lang as never);
    }

    return { success: true };
  } catch (e) {
    if (e instanceof DOMException && e.name === "QuotaExceededError") {
      return { success: false, error: "quota_exceeded" };
    }
    return { success: false, error: String(e) };
  }
}
