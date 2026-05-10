
import type { Ad, GameState, PurchaseResult, ShopItem, SolveResult } from "../src/types/game";
import { getGutFeelingScore } from "../src/utils/scoring";
import { getRiskLevel } from "../src/utils/probability";
import type { RiskLevel } from "../src/utils/probability";
import { decodeMessage } from "../src/utils/decoder";

const normalizeAd = (ad: Ad): Ad => ({
  ...ad,
  message: decodeMessage(ad.message, ad.encrypted),
  probability: decodeMessage(ad.probability, ad.encrypted),
});

const API_BASE =
  process.env.API_BASE?.replace(/\/$/, "") ??
  "https://dragonsofmugloar.com/api/v2";

// Otherwise might clog api
const MIN_DELAY_MS = 50

// When at 3 lives, allow a riskier ad if gut beats the safest top pick by this much per extra risk tier.
const AGGRESSIVE_GUT_MULTIPLIER_ONE_RISK_STEP = 1.15;
const AGGRESSIVE_GUT_MULTIPLIER_TWO_RISK_STEPS = 1.3;

const HEALTH_POTION_ITEM_ID = "hpot";

const FULL_LIVES = 3;

const RISK_ORDER: RiskLevel[] = ["safe", "moderate", "risky", "deadly"];

const riskStep = (probability: string): number =>
  RISK_ORDER.indexOf(getRiskLevel(probability));

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const delay = async () => {
  if (MIN_DELAY_MS > 0) await sleep(MIN_DELAY_MS);
};

const sleepForRateLimit = async (response: Response) => {
  const retryAfterSeconds = Number(response.headers.get("retry-after") ?? "2");
  await sleep(
    Math.min(60_000, Math.max(1000, retryAfterSeconds * 1000))
  );
};

async function apiRequest<T>(
  path: string,
  options: { method?: "GET" | "POST"; body?: unknown } = {}
): Promise<T> {
  const { method = "GET", body } = options;
  const url = `${API_BASE}${path}`;
  const init: RequestInit = {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  };

  let response = await fetch(url, init);
  while (response.status === 429 || response.status === 503) {
    await sleepForRateLimit(response);
    response = await fetch(url, init);
  }

  if (!response.ok) {
    throw new Error(
      `API ${method} ${path} failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<T>;
}

async function trySolveAd(
  gameId: string,
  adId: string
): Promise<SolveResult | null> {
  const sanitized = adId.replace(/=+$/, "");
  const url = `${API_BASE}/${gameId}/solve/${sanitized}`;
  const init: RequestInit = { method: "POST" };

  let response = await fetch(url, init);
  while (response.status === 429 || response.status === 503) {
    await sleepForRateLimit(response);
    response = await fetch(url, init);
  }

  if (response.status >= 400 && response.status < 500) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `API POST solve failed: ${response.status} ${response.statusText}`
    );
  }

  return response.json() as Promise<SolveResult>;
}

const startGame = (): Promise<GameState> =>
  apiRequest<GameState>("/game/start", { method: "POST" });

const fetchAds = (gameId: string): Promise<Ad[]> =>
  apiRequest<Ad[]>(`/${gameId}/messages`);

const fetchShop = (gameId: string): Promise<ShopItem[]> =>
  apiRequest<ShopItem[]>(`/${gameId}/shop`);

const buyItem = (
  gameId: string,
  itemId: string
): Promise<PurchaseResult> =>
  apiRequest<PurchaseResult>(`/${gameId}/shop/buy/${itemId}`, {
    method: "POST",
  });

const sortAdsByGutDescending = (ads: Ad[], lives: number): Ad[] =>
  [...ads].sort(
    (left, right) =>
      getGutFeelingScore(right, lives) - getGutFeelingScore(left, lives)
  );

const pickAggressiveAd = (
  adsSortedByGutDescending: Ad[],
  lives: number
): Ad => {
  const topAdByGutFeeling = adsSortedByGutDescending[0];
  const safestPickByGutFeeling = getGutFeelingScore(topAdByGutFeeling, lives);
  let chosenAd = topAdByGutFeeling;
  let chosenGutFeeling = safestPickByGutFeeling;

  for (const candidate of adsSortedByGutDescending.slice(1)) {
    const extraRiskSteps =
      riskStep(candidate.probability) -
      riskStep(topAdByGutFeeling.probability);
    const candidateGutFeeling = getGutFeelingScore(candidate, lives);

    const requiredGutScoreForOneExtraRiskStep =
      safestPickByGutFeeling * AGGRESSIVE_GUT_MULTIPLIER_ONE_RISK_STEP;
    const requiredGutScoreForTwoExtraRiskSteps =
      safestPickByGutFeeling * AGGRESSIVE_GUT_MULTIPLIER_TWO_RISK_STEPS;

    const isOneRiskStepRiskier = extraRiskSteps === 1;
    const isTwoRiskStepsRiskier = extraRiskSteps === 2;

    const meetsGutForOneExtraStep =
      isOneRiskStepRiskier &&
      candidateGutFeeling >= requiredGutScoreForOneExtraRiskStep;

    const meetsGutForTwoExtraSteps =
      isTwoRiskStepsRiskier &&
      candidateGutFeeling >= requiredGutScoreForTwoExtraRiskSteps;

    const worthTakingExtraRisk =
      meetsGutForOneExtraStep || meetsGutForTwoExtraSteps;

    if (worthTakingExtraRisk && candidateGutFeeling > chosenGutFeeling) {
      chosenAd = candidate;
      chosenGutFeeling = candidateGutFeeling;
    }
  }
  return chosenAd;
};


const mergePurchaseIntoGame = (
  game: GameState,
  purchase: PurchaseResult
): GameState => ({
  ...game,
  gold: purchase.gold,
  lives: purchase.lives,
  level: purchase.level,
  turn: purchase.turn,
});


const shopForItems = async (game: GameState): Promise<GameState> => {
  if (game.lives <= 0) return game;

  await delay();
  let shopItems: ShopItem[];
  try {
    shopItems = await fetchShop(game.gameId);
  } catch {
    return game;
  }

  let nextGame = game;

  const healthPotion = shopItems.find(
    (item) => item.id === HEALTH_POTION_ITEM_ID
  );
  if (
    healthPotion &&
    nextGame.lives < FULL_LIVES &&
    healthPotion.cost <= nextGame.gold
  ) {
    await delay();
    try {
      const purchase = await buyItem(nextGame.gameId, healthPotion.id);
      if (purchase.shoppingSuccess) {
        nextGame = mergePurchaseIntoGame(nextGame, purchase);
        console.log(
          "Bought",
          healthPotion.name,
          `(${healthPotion.id})`,
          "for",
          healthPotion.cost,
          "gold →",
          nextGame.gold,
          "gold,",
          nextGame.lives,
          "lives"
        );
      }
    } catch {
      return nextGame;
    }
  }

  const maxGearPurchasesThisTurn = 24;
  for (let i = 0; i < maxGearPurchasesThisTurn; i += 1) {
    await delay();
    try {
      shopItems = await fetchShop(nextGame.gameId);
    } catch {
      break;
    }

    const affordableGear = shopItems
      .filter(
        (item) =>
          item.id !== HEALTH_POTION_ITEM_ID &&
          item.cost <= nextGame.gold
      )
      .sort((left, right) => left.cost - right.cost);

    if (affordableGear.length === 0) break;

    const cheapestGear = affordableGear[0];
    try {
      const purchase = await buyItem(nextGame.gameId, cheapestGear.id);
      if (!purchase.shoppingSuccess) break;
      nextGame = mergePurchaseIntoGame(nextGame, purchase);
      console.log(
        "Bought",
        cheapestGear.name,
        `(${cheapestGear.id})`,
        "for",
        cheapestGear.cost,
        "gold →",
        nextGame.gold,
        "gold,",
        nextGame.lives,
        "lives"
      );
    } catch {
      break;
    }
  }

  return nextGame;
};

const run = async () => {
  let game = await startGame();
  await delay();
  console.log("Started game", game.gameId, "lives", game.lives);

  let messageCache: Ad[] = [];
  // ignore ads that have failed to be solved twice
  const ignoredAdIds = new Set<string>();

  while (game.lives > 0) {
    if (messageCache.length === 0) {
      const rawAdsFromApi = await fetchAds(game.gameId);
      if (rawAdsFromApi.length === 0) {
        console.warn("No ads from API; waiting before refetch.");
        await sleep(2000);
      }
      messageCache = rawAdsFromApi.map(normalizeAd);
      // Drop ignore entries for ids no longer on the board; keep ignores for ids
      // that reappear so broken ads are not picked again after each refetch.
      for (const ignoredId of [...ignoredAdIds]) {
        if (!messageCache.some((ad) => ad.adId === ignoredId)) {
          ignoredAdIds.delete(ignoredId);
        }
      }
      await delay();
      console.log("Fetched ads:", messageCache.length);
    }

    const availableAds = messageCache.filter((ad) => !ignoredAdIds.has(ad.adId));

    if (messageCache.length > 0 && availableAds.length === 0) {
      messageCache = messageCache.filter((ad) => !ignoredAdIds.has(ad.adId));
      ignoredAdIds.clear();
      console.warn(
        "Every cached ad was skipped as broken; clearing cache to refetch."
      );
      continue;
    }

    const rankedByGut = sortAdsByGutDescending(availableAds, game.lives);

    if (
      rankedByGut.length === 0 ||
      getGutFeelingScore(rankedByGut[0], game.lives) < 0
    ) {
      messageCache = [];
      continue;
    }

    const adToSolve =
      game.lives === 3
        ? pickAggressiveAd(rankedByGut, game.lives)
        : rankedByGut[0];

    await delay();
    let result = await trySolveAd(game.gameId, adToSolve.adId);
    if (result === null) {
      await delay();
      result = await trySolveAd(game.gameId, adToSolve.adId);
    }

    if (result === null) {
      ignoredAdIds.add(adToSolve.adId);
      console.warn(
        "Solve failed twice (likely broken); ignoring for picks:",
        `${adToSolve.adId.slice(0, 12)}…`
      );
      continue;
    }

    game = {
      ...game,
      lives: result.lives,
      gold: result.gold,
      score: result.score,
      highScore: result.highScore,
      turn: result.turn,
    };

    messageCache = messageCache.filter((ad) => ad.adId !== adToSolve.adId);
    console.log(
      "Solved",
      `${adToSolve.adId.slice(0, 12)}…`,
      "success",
      result.success,
      "score",
      game.score,
      "lives",
      game.lives
    );

    game = await shopForItems(game);
  }

  console.log("Game over. Final score:", game.score, "high:", game.highScore);
  if (game.score < 1000) {
    console.warn("Did not reach 1000 points on this run.");
    process.exitCode = 1;
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});