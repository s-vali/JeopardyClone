"use client";

import { formatCurrency } from "@/app/utils/format";

const PLAYERS = ["Player 1", "Player 2", "Player 3"];

interface ScoreBarProps {
  scores: number[];
  currentPlayer: number;
  usedCount: number;
  totalCells: number;
}

export default function ScoreBar({
  scores,
  currentPlayer,
  usedCount,
  totalCells,
}: ScoreBarProps) {
  return (
    <header className="bg-linear-to-b from-indigo-950 to-blue-800 border-b-4 border-yellow-400 px-4 py-3 flex items-center justify-between gap-4">
      <h1
        className="text-yellow-400 tracking-widest text-6xl drop-shadow-xl"
        style={{
          fontFamily: "'Anton', sans-serif",
          textShadow: "6px 6px 0 #000",
        }}
      >
        Jeopardy!
      </h1>

      <div className="flex items-center gap-2">
        <span className="text-yellow-400/70 text-xs tracking-widest hidden sm:block">
          {usedCount}/{totalCells} clues used
        </span>
        <div className="flex gap-3">
          {PLAYERS.map((name, i) => (
            <div
              key={i}
              className={`text-center border rounded px-3 py-1 min-w-22.5 transition-all duration-200 ${
                i === currentPlayer
                  ? "border-white bg-yellow-400/15 shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                  : "border-yellow-400/60 bg-black/40"
              }`}
            >
              <p className="text-yellow-400 text-[11px] tracking-widest uppercase">
                {name}
              </p>
              <p
                className={`text-lg font-bold ${
                  scores[i] < 0 ? "text-red-400" : "text-white"
                }`}
              >
                {formatCurrency(scores[i])}
              </p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
