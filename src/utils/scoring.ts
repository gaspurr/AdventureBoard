import { getProbabilityScore } from "./probability";
import type { Ad } from "@/types/game";

const numericReward = (ad: Ad): number => Number(ad.reward);

// Naive expected value — used as a baseline metric and for sorting.
export const getExpectedValue = (ad: Ad): number =>
  numericReward(ad) * getProbabilityScore(ad.probability);

export const sortByExpectedValue = (ads: Ad[]): Ad[] =>
  [...ads].sort((a, b) => getExpectedValue(b) - getExpectedValue(a));

export const findRecommendedAd = (ads: Ad[]): Ad | null =>
  ads.length === 0 ? null : sortByExpectedValue(ads)[0];

// =============================================================================
// Gut feeling — a richer rating that factors in lives, urgency, reward, risk.
// =============================================================================

// More lives → losing one is cheap → can take bigger gambles.
// One life left → losing means game over → only sure things make sense.
const lifeValueFor = (lives: number): number => {
  if (lives <= 1) return 200;
  if (lives === 2) return 60;
  return 30;
};

// Ads about to expire get a small boost — use them or lose them.
const urgencyMultiplier = (expiresIn: number): number => {
  if (expiresIn <= 1) return 1.15;
  if (expiresIn <= 2) return 1.05;
  return 1;
};

// Risk-adjusted utility:  expected_reward − expected_life_cost,  scaled by urgency.
export const getGutFeelingScore = (ad: Ad, lives: number): number => {
  const probability = getProbabilityScore(ad.probability);
  const reward = numericReward(ad);
  const failureProbability = 1 - probability;
  const lifeValue = lifeValueFor(lives);
  const utility = probability * reward - failureProbability * lifeValue;
  return utility * urgencyMultiplier(ad.expiresIn);
};

export type GutFeelingLabel =
  | "Top pick"
  | "Solid"
  | "OK"
  | "Risky"
  | "Skip";

export type GutFeeling = {
  label: GutFeelingLabel;
  score: number;
};

export type GutFeelingMap = Map<string, GutFeeling>;

// Rank ads by gut-feeling score and bucket each by rank.
// Negative-utility ads are always labelled "Skip" regardless of rank.
export const buildGutFeelingMap = (
  ads: Ad[],
  lives: number
): GutFeelingMap => {
  const scored = ads.map((ad) => ({
    adId: ad.adId,
    score: getGutFeelingScore(ad, lives),
  }));

  scored.sort((a, b) => b.score - a.score);

  const map: GutFeelingMap = new Map();
  scored.forEach((entry, index) => {
    let label: GutFeelingLabel;
    if (entry.score < 0) {
      label = "Skip";
    } else if (index === 0) {
      label = "Top pick";
    } else if (index < 3) {
      label = "Solid";
    } else if (index < 6) {
      label = "OK";
    } else {
      label = "Risky";
    }
    map.set(entry.adId, { label, score: entry.score });
  });

  return map;
};

export type GutFeelingChipColor =
  | "success"
  | "primary"
  | "info"
  | "warning"
  | "error";

export const gutFeelingChipColor = (
  label: GutFeelingLabel
): GutFeelingChipColor => {
  switch (label) {
    case "Top pick":
      return "success";
    case "Solid":
      return "primary";
    case "OK":
      return "info";
    case "Risky":
      return "warning";
    case "Skip":
      return "error";
  }
};
