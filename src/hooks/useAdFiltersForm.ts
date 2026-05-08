import { useCallback } from "react";
import { useForm } from "react-hook-form";

export type RiskThreshold = "all" | "risky" | "moderate" | "safe";

export type AdFiltersValues = {
  search: string;
  minReward: number;
  minExpiresIn: number;
  riskThreshold: RiskThreshold;
};

export const DEFAULT_AD_FILTERS: AdFiltersValues = {
  search: "",
  minReward: 0,
  minExpiresIn: 0,
  riskThreshold: "all",
};

// RHF form hook only — no derived state or side effects live here. Filtering
// logic is in utils/filterAds.ts so the form stays focused on form concerns.
export const useAdFiltersForm = () => {
  const form = useForm<AdFiltersValues>({
    defaultValues: DEFAULT_AD_FILTERS,
    mode: "onChange",
  });

  const reset = useCallback(() => {
    form.reset(DEFAULT_AD_FILTERS);
  }, [form]);

  return { form, reset };
};
