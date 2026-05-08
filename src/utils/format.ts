export const formatGold = (gold: number): string => `${gold} gold`;

export const formatScore = (score: number): string => score.toLocaleString();

export const formatLives = (lives: number): string =>
  lives > 0 ? "❤".repeat(lives) : "—";
