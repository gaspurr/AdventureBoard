import { useCallback, useState } from "react";
import { startGame as startGameRequest } from "@/api/game";
import type { GameState } from "@/types/game";

export const useGame = () => {
  const [game, setGame] = useState<GameState | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startGame = useCallback(async () => {
    setIsStarting(true);
    setError(null);
    try {
      const newGame = await startGameRequest();
      setGame(newGame);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start game");
    } finally {
      setIsStarting(false);
    }
  }, []);

  const resetGame = useCallback(() => {
    setGame(null);
    setError(null);
  }, []);

  return {
    game,
    isStarting,
    error,
    startGame,
    setGame,
    resetGame,
  };
};
