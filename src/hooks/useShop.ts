import { useCallback, useEffect, useState } from "react";
import { fetchShop, buyItem } from "@/api/shop";
import type { ShopItem, PurchaseResult } from "@/types/game";

export type LastPurchase = {
  item: ShopItem;
  result: PurchaseResult;
};

export const useShop = (gameId: string | null) => {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [buyingItemId, setBuyingItemId] = useState<string | null>(null);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [lastPurchase, setLastPurchase] = useState<LastPurchase | null>(null);

  const refresh = useCallback(async () => {
    if (!gameId) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const fetched = await fetchShop(gameId);
      setItems(fetched);
    } catch (err) {
      setLoadError(
        err instanceof Error ? err.message : "Failed to load shop"
      );
    } finally {
      setIsLoading(false);
    }
  }, [gameId]);

  useEffect(() => {
    if (gameId) refresh();
  }, [gameId, refresh]);

  const buy = useCallback(
    async (itemId: string): Promise<PurchaseResult | null> => {
      if (!gameId) return null;
      const item = items.find((i) => i.id === itemId);
      if (!item) return null;

      setBuyingItemId(itemId);
      setBuyError(null);
      try {
        const result = await buyItem(gameId, itemId);
        setLastPurchase({ item, result });
        return result;
      } catch (err) {
        setBuyError(
          err instanceof Error ? err.message : "Failed to buy item"
        );
        return null;
      } finally {
        setBuyingItemId(null);
      }
    },
    [gameId, items]
  );

  const clearLastPurchase = useCallback(() => setLastPurchase(null), []);

  return {
    items,
    isLoading,
    loadError,
    refresh,
    buy,
    buyingItemId,
    buyError,
    lastPurchase,
    clearLastPurchase,
  };
};
