"use client";

import { useState, useCallback } from "react";
import { CATEGORIES, VALUES } from "@/app/data/questions";
import { GameState, ModalState } from "@/app/types/game";
import ScoreBar from "@/app/components/ScoreBar";
import Board from "@/app/components/Board";
import ClueModal from "@/app/components/ClueModal";
import EndScreen from "@/app/components/EndScreen";

const TOTAL_CELLS = CATEGORIES.length * VALUES.length;

function createInitialState(): GameState {
  return {
    scores: [0, 0, 0],
    used: Array(CATEGORIES.length)
      .fill(null)
      .map(() => Array(VALUES.length).fill(false)),
    currentPlayer: 0,
    modal: null,
    gameOver: false,
    usedCount: 0,
  };
}

export default function JeopardyGame() {
  const [game, setGame] = useState<GameState>(createInitialState);

  const openClue = useCallback((catIdx: number, clueIdx: number) => {
    const clue = CATEGORIES[catIdx].clues[clueIdx];
    const modal: ModalState = {
      catIdx,
      clueIdx,
      phase: clue.isDailyDouble ? "dd-wager" : "question",
      wager: null,
      selectedPlayer: null,
    };
    setGame((prev) => ({ ...prev, modal }));
  }, []);

  const handleSubmitWager = useCallback((wager: number) => {
    setGame((prev) => {
      if (!prev.modal) return prev;
      return {
        ...prev,
        modal: { ...prev.modal, wager, phase: "question" },
      };
    });
  }, []);

  const handleRevealAnswer = useCallback(() => {
    setGame((prev) => {
      if (!prev.modal) return prev;
      return { ...prev, modal: { ...prev.modal, phase: "answer" } };
    });
  }, []);

  const handleSelectPlayer = useCallback((idx: number) => {
    setGame((prev) => {
      if (!prev.modal) return prev;
      return { ...prev, modal: { ...prev.modal, selectedPlayer: idx } };
    });
  }, []);

  const closeModal = useCallback((newScores: number[], nextPlayer: number) => {
    setGame((prev) => {
      if (!prev.modal) return prev;
      const { catIdx, clueIdx } = prev.modal;
      const newUsed = prev.used.map((col, ci) =>
        ci === catIdx ? col.map((v, ri) => (ri === clueIdx ? true : v)) : col
      );
      const newUsedCount = prev.usedCount + 1;
      return {
        ...prev,
        scores: newScores,
        used: newUsed,
        currentPlayer: nextPlayer,
        modal: null,
        usedCount: newUsedCount,
        gameOver: newUsedCount >= TOTAL_CELLS,
      };
    });
  }, []);

  const handleAward = useCallback(
    (correct: boolean) => {
      setGame((prev) => {
        if (!prev.modal) return prev;
        const { catIdx, clueIdx, wager, selectedPlayer } = prev.modal;
        const clue = CATEGORIES[catIdx].clues[clueIdx];
        const value = wager ?? VALUES[clueIdx];

        const newScores = [...prev.scores];

        if (clue.isDailyDouble) {
          // Daily Double — applies to current player only
          newScores[prev.currentPlayer] += correct ? value : -value;
          const nextPlayer = (prev.currentPlayer + 1) % 3;
          return closeModalImmediately(prev, newScores, nextPlayer);
        } else {
          // Normal clue — applies to selected player
          if (selectedPlayer === null) return prev;
          newScores[selectedPlayer] += correct ? value : -value;
          const nextPlayer = correct
            ? (selectedPlayer + 1) % 3
            : (prev.currentPlayer + 1) % 3;
          return closeModalImmediately(prev, newScores, nextPlayer);
        }
      });
    },
    [] // eslint-disable-line
  );

  const handleSkip = useCallback(() => {
    setGame((prev) => {
      if (!prev.modal) return prev;
      const nextPlayer = (prev.currentPlayer + 1) % 3;
      return closeModalImmediately(prev, prev.scores, nextPlayer);
    });
  }, []);

  const handlePlayAgain = useCallback(() => {
    setGame(createInitialState());
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {game.gameOver ? (
        <EndScreen scores={game.scores} onPlayAgain={handlePlayAgain} />
      ) : (
        <>
          <ScoreBar
            scores={game.scores}
            currentPlayer={game.currentPlayer}
            usedCount={game.usedCount}
            totalCells={TOTAL_CELLS}
          />
          <div className="text-yellow-400/70 text-xs tracking-widest uppercase text-right px-3 py-1 bg-blue-950">
            {["Player 1", "Player 2", "Player 3"][game.currentPlayer]}'s Turn
          </div>
          <Board used={game.used} onSelectClue={openClue} />

          {game.modal && (
            <ClueModal
              modal={game.modal}
              scores={game.scores}
              currentPlayer={game.currentPlayer}
              onRevealAnswer={handleRevealAnswer}
              onSubmitWager={handleSubmitWager}
              onSelectPlayer={handleSelectPlayer}
              onAward={handleAward}
              onSkip={handleSkip}
            />
          )}
        </>
      )}
    </div>
  );
}

/** Pure helper used inside setGame to avoid stale closure issues */
function closeModalImmediately(
  prev: GameState,
  newScores: number[],
  nextPlayer: number
): GameState {
  if (!prev.modal) return prev;
  const { catIdx, clueIdx } = prev.modal;
  const newUsed = prev.used.map((col, ci) =>
    ci === catIdx ? col.map((v, ri) => (ri === clueIdx ? true : v)) : col
  );
  const newUsedCount = prev.usedCount + 1;
  return {
    ...prev,
    scores: newScores,
    used: newUsed,
    currentPlayer: nextPlayer,
    modal: null,
    usedCount: newUsedCount,
    gameOver: newUsedCount >= TOTAL_CELLS,
  };
}
