"use client";

import { formatCurrency } from "@/app/utils/format";

const PLAYERS = ["Player 1", "Player 2", "Player 3"];

interface EndScreenProps {
  scores: number[];
  onPlayAgain: () => void;
}

export default function EndScreen({ scores, onPlayAgain }: EndScreenProps) {
  const maxScore = Math.max(...scores);

  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-black px-6 py-12 text-center">
      <h2
        className="text-yellow-400 text-5xl tracking-widest mb-2"
        style={{
          fontFamily: "'Anton', sans-serif",
          textShadow: "0 0 20px rgba(255,215,0,0.7)",
        }}
      >
        Game Over!
      </h2>
      <p className="text-white/60 text-sm tracking-widest uppercase mb-6">
        Final Scores
      </p>

      <div className="flex gap-5 justify-center flex-wrap mb-10">
        {PLAYERS.map((name, i) => {
          const isWinner = scores[i] === maxScore;
          return (
            <div
              key={i}
              className={`border-2 rounded-lg px-8 py-5 min-w-30 transition-all
                ${
                  isWinner
                    ? "border-white bg-yellow-400/15 shadow-[0_0_20px_rgba(255,215,0,0.4)]"
                    : "border-yellow-400/50 bg-white/5"
                }`}
            >
              <p className="text-yellow-400 text-xs tracking-widest uppercase mb-1">
                {name}
              </p>
              <p
                className={`text-3xl font-bold ${
                  scores[i] < 0 ? "text-red-400" : "text-white"
                }`}
                style={{ fontFamily: "'Anton', sans-serif" }}
              >
                {formatCurrency(scores[i])}
              </p>
              {isWinner && (
                <p className="text-yellow-400 text-xs tracking-widest mt-2 uppercase">
                  Winner!
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onPlayAgain}
        className="bg-yellow-400 text-black font-bold uppercase tracking-widest
                   px-10 py-3 rounded text-lg hover:bg-yellow-300 transition-colors"
        style={{ fontFamily: "'Oswald', sans-serif" }}
      >
        Play Again
      </button>
    </div>
  );
}
