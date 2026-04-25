export type ModalPhase = "dd-wager" | "question" | "answer";
export type MediaType = "image" | "video" | "audio";

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

export interface ClueMedia {
  type: MediaType;
  src: string; // path relative to /public, e.g. "/media/clue1.jpg"
  alt?: string; // for images: screen-reader text
  caption?: string; // optional label shown below the media
}
