import { useMemo } from "react";
import { Box, Button } from "@mui/material";
import { useGame } from "@/hooks/useGame";
import { useAds } from "@/hooks/useAds";
import { useSolveAd } from "@/hooks/useSolveAd";
import { useShop } from "@/hooks/useShop";
import { buildGutFeelingMap } from "@/utils/scoring";
import { StartScreen } from "@/components/StartScreen/StartScreen";
import { GameHeader } from "@/components/GameHeader/GameHeader";
import { AdsTable } from "@/components/AdsTable/AdsTable";
import { ShopTable } from "@/components/ShopTable/ShopTable";
import { SolveResultSnackbar } from "@/components/SolveResultSnackbar/SolveResultSnackbar";
import { PurchaseResultSnackbar } from "@/components/PurchaseResultSnackbar/PurchaseResultSnackbar";
import { GameOverDialog } from "@/components/GameOverDialog/GameOverDialog";
import "./MainPage.scss";

export const MainPage = () => {
  const {
    game,
    isStarting,
    error: startError,
    startGame,
    setGame,
    resetGame,
  } = useGame();

  const {
    ads,
    isLoading: isLoadingAds,
    error: adsError,
    refresh: refreshAds,
  } = useAds(game?.gameId ?? null);

  const {
    solve,
    solvingAdId,
    error: solveError,
    lastResult,
    clearLastResult,
  } = useSolveAd(game?.gameId ?? null);

  const {
    items: shopItems,
    isLoading: isLoadingShop,
    loadError: shopLoadError,
    refresh: refreshShop,
    buy,
    buyingItemId,
    buyError,
    lastPurchase,
    clearLastPurchase,
  } = useShop(game?.gameId ?? null);

  const gutFeelingMap = useMemo(
    () => buildGutFeelingMap(ads, game?.lives ?? 0),
    [ads, game?.lives]
  );

  const handleSolve = async (adId: string) => {
    const result = await solve(adId);
    if (!result) return;

    setGame((prev) =>
      prev
        ? {
            ...prev,
            lives: result.lives,
            gold: result.gold,
            score: result.score,
            highScore: result.highScore,
            turn: result.turn,
          }
        : prev
    );

    refreshAds();
  };

  const handleBuy = async (itemId: string) => {
    const result = await buy(itemId);
    if (!result) return;

    setGame((prev) =>
      prev
        ? {
            ...prev,
            lives: result.lives,
            gold: result.gold,
            level: result.level,
            turn: result.turn,
          }
        : prev
    );

    refreshAds();
  };

  const handleRestart = () => {
    clearLastResult();
    clearLastPurchase();
    resetGame();
    startGame();
  };

  if (!game) {
    return (
      <StartScreen
        onStart={startGame}
        isStarting={isStarting}
        error={startError}
      />
    );
  }

  const isGameOver = game.lives <= 0;
  const adsTableError = adsError ?? solveError;
  const shopTableError = shopLoadError ?? buyError;

  return (
    <Box className="main-page">
      <GameHeader game={game} />

      <Box className="main-page__content">
        <Box className="main-page__section">
          <AdsTable
            ads={ads}
            isLoading={isLoadingAds}
            error={adsTableError}
            onRefresh={refreshAds}
            onSolve={handleSolve}
            solvingAdId={solvingAdId}
            gutFeelingMap={gutFeelingMap}
          />
        </Box>

        <Box className="main-page__section">
          <ShopTable
            items={shopItems}
            isLoading={isLoadingShop}
            error={shopTableError}
            onRefresh={refreshShop}
            onBuy={handleBuy}
            buyingItemId={buyingItemId}
            gold={game.gold}
          />
        </Box>
      </Box>

      <Box className="main-page__footer">
        <Button variant="outlined" color="warning" onClick={resetGame}>
          End game
        </Button>
      </Box>

      <SolveResultSnackbar result={lastResult} onClose={clearLastResult} />
      <PurchaseResultSnackbar
        purchase={lastPurchase}
        onClose={clearLastPurchase}
      />

      <GameOverDialog
        open={isGameOver}
        game={game}
        onRestart={handleRestart}
      />
    </Box>
  );
};
