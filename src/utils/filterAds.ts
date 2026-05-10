import { getProbabilityScore } from "./probability";
import type { Ad } from "@/types/game";
import type {
  AdFiltersValues,
  RiskThreshold,
} from "@/hooks/useAdFiltersForm";

// Minimum probability score required for an ad to clear each threshold.
const RISK_THRESHOLD_SCORE: Record<RiskThreshold, number> = {
  all: 0,
  risky: 0.25,
  moderate: 0.5,
  safe: 0.75,
};

export const applyAdFilters = (
  ads: Ad[],
  filters: AdFiltersValues
): Ad[] => {
  const minProbability = RISK_THRESHOLD_SCORE[filters.riskThreshold];

  return ads.filter((ad) => {
    if (Number(ad.reward) < filters.minReward) return false;
    if (ad.expiresIn < filters.minExpiresIn) return false;
    if (getProbabilityScore(ad.probability) < minProbability) return false;
    return true;
  });
};
