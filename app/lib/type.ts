export type IPlayerDetails = {
  walletId: string;
  depositAmount: number;
  id?: string;
  gameId?: string;
};

export type GameState = "started" | "loading" | "ended";

export type IGameDetails = {
  id: string;
  gameState: GameState;
  winnerWallet?: string;
  endTimestamp: Date;
};

export type IWheelUI = {
  x: string; // walletId
  y: number; // depositAmount
  name: string;
};
