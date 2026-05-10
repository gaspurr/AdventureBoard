import { useCallback, useEffect, useState } from "react";
import { fetchAds } from "@/api/ads";
import type { Ad } from "@/types/game";

export const useAds = (gameId: string | null) => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!gameId) return;
    setIsLoading(true);
    setError(null);
    try {
      const fetched = await fetchAds(gameId);
      setAds(fetched);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch ads");
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    if (gameId) refresh();
  }, [gameId, refresh]);

  return { ads, isLoading, error, refresh };
};
