export type ModalPhase = "dd-wager" | "question" | "answer";

export interface ModalState {
  catIdx: number;
  clueIdx: number;
  phase: ModalPhase;
  wager: number | null;
  selectedPlayer: number | null;
}

export interface GameState {
  scores: number[];
  used: boolean[][];
  currentPlayer: number;
  modal: ModalState | null;
  gameOver: boolean;
  usedCount: number;
}
