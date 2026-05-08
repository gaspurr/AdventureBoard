export type GameState = {
  gameId: string;
  lives: number;
  gold: number;
  level: number;
  score: number;
  highScore: number;
  turn: number;
};

export type Reputation = {
  people: number;
  state: number;
  underworld: number;
};

export type Ad = {
  adId: string;
  message: string;
  reward: number;
  expiresIn: number;
  // 1 = base64, 2 = ROT13, null = plaintext.
  encrypted: number | null;
  probability: string;
};

export type SolveResult = {
  success: boolean;
  lives: number;
  gold: number;
  score: number;
  highScore: number;
  turn: number;
  message: string;
};

export type ShopItem = {
  id: string;
  name: string;
  cost: number;
};

export type PurchaseResult = {
  shoppingSuccess: boolean;
  gold: number;
  lives: number;
  level: number;
  turn: number;
};
