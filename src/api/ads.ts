import { apiRequest } from "./client";
import type { Ad, SolveResult } from "@/types/game";

export const fetchAds = (gameId: string): Promise<Ad[]> =>
  apiRequest<Ad[]>(`/${gameId}/messages`);

export const solveAd = (
  gameId: string,
  adId: string
): Promise<SolveResult> => {
  // Encrypted ads can come back with base64-padded IDs ("...="). The API
  // rejects those when they end up in the URL path, so strip trailing "=".
  const sanitizedAdId = adId.replace(/=+$/, "");
  return apiRequest<SolveResult>(`/${gameId}/solve/${sanitizedAdId}`, {
    method: "POST",
  });
};
