
export const PROBABILITY_SCORE: Record<string, number> = {
  "Piece of cake": 0.95,
  "Sure thing": 0.9,
  "Walk in the park": 0.85,
  "Quite likely": 0.75,
  "Hmmm....": 0.55,
  "Gamble": 0.5,
  "Risky": 0.4,
  "Rather detrimental": 0.25,
  "Playing with fire": 0.2,
  "Suicide mission": 0.1,
  "Impossible": 0.05,
};

export const getProbabilityScore = (probability: string): number => {
  const score = PROBABILITY_SCORE[probability];
  if (score === undefined) {
    console.warn(`Unknown probability string: "${probability}"`);
    return 0.3;
  }
  return score;
};

export type RiskLevel = "safe" | "moderate" | "risky" | "deadly";

export const getRiskLevel = (probability: string): RiskLevel => {
  const score = getProbabilityScore(probability);
  if (score >= 0.75) return "safe";
  if (score >= 0.5) return "moderate";
  if (score >= 0.25) return "risky";
  return "deadly";
};
