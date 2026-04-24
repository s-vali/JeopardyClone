"use client";

import { useState } from "react";
import { CATEGORIES, VALUES } from "@/app/data/questions";
import { ModalState } from "@/app/types/game";
import { formatCurrency } from "@/app/utils/format";

const PLAYERS = ["Player 1", "Player 2", "Player 3"];

interface ClueModalProps {
  modal: ModalState;
  scores: number[];
  currentPlayer: number;
  onRevealAnswer: () => void;
  onSubmitWager: (wager: number) => void;
  onSelectPlayer: (idx: number) => void;
  onAward: (correct: boolean) => void;
  onSkip: () => void;
}

export default function ClueModal({
  modal,
  scores,
  currentPlayer,
  onRevealAnswer,
  onSubmitWager,
  onSelectPlayer,
  onAward,
  onSkip,
}: ClueModalProps) {
  const [wagerInput, setWagerInput] = useState<string>(
    String(VALUES[modal.clueIdx])
  );

  const cat = CATEGORIES[modal.catIdx];
  const clue = cat.clues[modal.clueIdx];
  const baseValue = VALUES[modal.clueIdx];
  const displayValue = modal.wager ?? baseValue;
  const maxWager = Math.max(baseValue, scores[currentPlayer]);

  const handleWagerSubmit = () => {
    const parsed = parseInt(wagerInput, 10);
    const clamped = isNaN(parsed)
      ? baseValue
      : Math.max(5, Math.min(parsed, maxWager));
    onSubmitWager(clamped);
  };

  return (
    <div className="fixed inset-0 bg-black/88 flex items-center justify-center z-50">
      <div
        className="bg-linear-to-br from-blue-700 to-blue-900 border-4 border-yellow-400
                   rounded-lg px-10 py-8 max-w-xl w-[90%] text-center
                   shadow-[0_0_50px_rgba(255,215,0,0.2)]"
      >
        {/* Daily Double Wager Phase */}
        {modal.phase === "dd-wager" && (
          <>
            <p
              className="text-yellow-400 text-4xl mb-4 animate-pulse"
              style={{
                fontFamily: "'Anton', sans-serif",
                textShadow: "0 0 20px rgba(255,215,0,0.8)",
              }}
            >
              Daily Double!
            </p>
            <p className="text-yellow-400 text-sm tracking-widest uppercase mb-1">
              {cat.name}
            </p>
            <p className="text-white/60 text-sm mb-3">
              Max wager: {formatCurrency(maxWager)}
            </p>
            <input
              type="number"
              min={5}
              max={maxWager}
              value={wagerInput}
              onChange={(e) => setWagerInput(e.target.value)}
              className="block mx-auto mb-4 bg-black/50 border-2 border-yellow-400 rounded
                         text-white text-2xl text-center px-4 py-2 w-40
                         focus:outline-none focus:border-yellow-300"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            />
            <button
              onClick={handleWagerSubmit}
              className="bg-yellow-400 text-black font-bold uppercase tracking-widest
                         px-8 py-3 rounded hover:bg-yellow-300 transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Place Wager
            </button>
          </>
        )}

        {/* Question Phase */}
        {modal.phase === "question" && (
          <>
            <p className="text-yellow-400 text-sm tracking-widest uppercase mb-1">
              {cat.name}
            </p>
            <p
              className="text-yellow-400 text-3xl mb-5"
              style={{
                fontFamily: "'Anton', sans-serif",
                textShadow: "0 0 10px rgba(255,215,0,0.5)",
              }}
            >
              {clue.isDailyDouble ? "Daily Double — " : ""}
              {formatCurrency(displayValue)}
            </p>
            <p className="text-white text-xl leading-relaxed mb-7 min-h-[60px]">
              {clue.question}
            </p>
            <button
              onClick={onRevealAnswer}
              className="border border-white/30 bg-white/10 text-white uppercase
                         tracking-widest text-sm px-6 py-2 rounded hover:bg-white/20 transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Reveal Answer
            </button>
          </>
        )}

        {/* Answer Phase */}
        {modal.phase === "answer" && (
          <>
            <p className="text-yellow-400 text-sm tracking-widest uppercase mb-1">
              {cat.name}
            </p>
            <p
              className="text-yellow-400 text-3xl mb-4"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {formatCurrency(displayValue)}
            </p>
            <p className="text-white text-xl leading-relaxed mb-4 min-h-[60px]">
              {clue.question}
            </p>
            <div className="bg-black/40 border border-yellow-400/40 rounded px-6 py-3 mb-5 inline-block">
              <span className="text-yellow-400 text-lg tracking-wide">
                What is: {clue.answer}?
              </span>
            </div>

            {clue.isDailyDouble ? (
              /* Daily Double — only current player scores */
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => onAward(true)}
                  className="bg-green-700 border-2 border-green-400 text-white font-bold
                             uppercase tracking-widest px-6 py-2 rounded hover:bg-green-600 transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Correct ✓
                </button>
                <button
                  onClick={() => onAward(false)}
                  className="bg-red-800 border-2 border-red-500 text-white font-bold
                             uppercase tracking-widest px-6 py-2 rounded hover:bg-red-700 transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  Wrong ✗
                </button>
              </div>
            ) : (
              /* Normal clue — select who answered */
              <>
                <p className="text-white/60 text-xs tracking-widest uppercase mb-2">
                  Who got it right?
                </p>
                <div className="flex gap-2 justify-center mb-4">
                  {PLAYERS.map((name, i) => (
                    <button
                      key={i}
                      onClick={() => onSelectPlayer(i)}
                      className={`px-4 py-1 border-2 rounded font-bold uppercase text-sm tracking-widest
                                  transition-colors
                                  ${
                                    modal.selectedPlayer === i
                                      ? "bg-yellow-400 text-black border-yellow-400"
                                      : "bg-yellow-400/10 text-yellow-400 border-yellow-400/40 hover:bg-yellow-400/25"
                                  }`}
                      style={{ fontFamily: "'Oswald', sans-serif" }}
                    >
                      {name}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => onAward(true)}
                    disabled={modal.selectedPlayer === null}
                    className="bg-green-700 border-2 border-green-400 text-white font-bold
                               uppercase tracking-widest px-5 py-2 rounded hover:bg-green-600
                               disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Correct ✓
                  </button>
                  <button
                    onClick={() => onAward(false)}
                    disabled={modal.selectedPlayer === null}
                    className="bg-red-800 border-2 border-red-500 text-white font-bold
                               uppercase tracking-widest px-5 py-2 rounded hover:bg-red-700
                               disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    Wrong ✗
                  </button>
                  <button
                    onClick={onSkip}
                    className="border border-white/30 bg-white/10 text-white uppercase
                               tracking-widest text-sm px-5 py-2 rounded hover:bg-white/20 transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    No one
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
