import { useCallback } from "react";
import { useForm } from "react-hook-form";

export type RiskThreshold = "all" | "risky" | "moderate" | "safe";

export type AdFiltersValues = {
  minReward: number;
  minExpiresIn: number;
  riskThreshold: RiskThreshold;
};

export const DEFAULT_AD_FILTERS: AdFiltersValues = {
  minReward: 0,
  minExpiresIn: 0,
  riskThreshold: "all",
};

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
