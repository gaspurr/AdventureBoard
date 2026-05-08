import { useCallback, useState } from "react";
import { solveAd as solveAdRequest } from "@/api/ads";
import type { SolveResult } from "@/types/game";

export const useSolveAd = (gameId: string | null) => {
  const [solvingAdId, setSolvingAdId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<SolveResult | null>(null);

  const solve = useCallback(
    async (adId: string): Promise<SolveResult | null> => {
      if (!gameId) return null;
      setSolvingAdId(adId);
      setError(null);
      try {
        const result = await solveAdRequest(gameId, adId);
        setLastResult(result);
        return result;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to solve ad"
        );
        return null;
      } finally {
        setSolvingAdId(null);
      }
    },
    [gameId]
  );

  const clearLastResult = useCallback(() => setLastResult(null), []);

  return { solve, solvingAdId, error, lastResult, clearLastResult };
};
