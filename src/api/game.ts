import { apiRequest } from "./client";
import type { GameState, Reputation } from "@/types/game";

export const startGame = (): Promise<GameState> =>
  apiRequest<GameState>("/game/start", { method: "POST" });

export const investigateReputation = (gameId: string): Promise<Reputation> =>
  apiRequest<Reputation>(`/${gameId}/investigate/reputation`, {
    method: "POST",
  });
