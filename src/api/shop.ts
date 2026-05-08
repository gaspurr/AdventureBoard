import { apiRequest } from "./client";
import type { ShopItem, PurchaseResult } from "@/types/game";

export const fetchShop = (gameId: string): Promise<ShopItem[]> =>
  apiRequest<ShopItem[]>(`/${gameId}/shop`);

export const buyItem = (
  gameId: string,
  itemId: string
): Promise<PurchaseResult> =>
  apiRequest<PurchaseResult>(`/${gameId}/shop/buy/${itemId}`, {
    method: "POST",
  });
