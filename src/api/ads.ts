import { apiRequest } from "./client";
import type { Ad, SolveResult } from "@/types/game";

export const fetchAds = (gameId: string): Promise<Ad[]> =>
  apiRequest<Ad[]>(`/${gameId}/messages`);

export const solveAd = (
  gameId: string,
  adId: string
): Promise<SolveResult> => {

  //strip trailing "=" from adId since they caused failing API calls
  const sanitizedAdId = adId.replace(/=+$/, "");
  return apiRequest<SolveResult>(`/${gameId}/solve/${sanitizedAdId}`, {
    method: "POST",
  });
};
