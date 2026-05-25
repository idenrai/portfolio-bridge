import { create } from "zustand";
import { persist } from "zustand/middleware";
import { STORAGE_KEYS } from "@/constants";

export interface UserProfile {
  /** 구루가 부를 이름 */
  nickname: string;
  /** 나이 */
  age: number | null;
  /** 연봉 (baseCurrency 기준) */
  annualIncome: number | null;
  /** 매달 투자 가능 금액 (baseCurrency 기준) */
  monthlyBudget: number | null;
  /** 3년 계획 */
  plan3y: string;
  /** 5년 계획 */
  plan5y: string;
  /** 10년 계획 */
  plan10y: string;
}

interface ProfileState extends UserProfile {
  setProfile: (patch: Partial<UserProfile>) => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      nickname: "",
      age: null,
      annualIncome: null,
      monthlyBudget: null,
      plan3y: "",
      plan5y: "",
      plan10y: "",

      setProfile: (patch) => set(patch),
    }),
    {
      name: STORAGE_KEYS.PROFILE,
    },
  ),
);
