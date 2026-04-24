"use client";

import { CATEGORIES, VALUES } from "@/app/data/questions";
import { formatCurrency } from "@/app/utils/format";

interface BoardProps {
  used: boolean[][];
  onSelectClue: (catIdx: number, clueIdx: number) => void;
}

export default function Board({ used, onSelectClue }: BoardProps) {
  return (
    <div
      className="grid gap-[3px] p-[3px] bg-black flex-1"
      style={{ gridTemplateColumns: `repeat(${CATEGORIES.length}, 1fr)` }}
    >
      {/* Category Headers */}
      {CATEGORIES.map((cat, ci) => (
        <div
          key={ci}
          className="bg-linear-to-b from-blue-900 to-blue-700 border border-blue-500/60
                     flex items-center justify-center text-center px-2 py-3 min-h-[70px]
                     text-white font-bold text-[13px] uppercase tracking-wide"
          style={{ textShadow: "1px 1px 3px rgba(0,0,0,0.8)" }}
        >
          {cat.name}
        </div>
      ))}

      {/* Clue Cells — row by row */}
      {VALUES.map((val, ri) =>
        CATEGORIES.map((_, ci) => {
          const isUsed = used[ci][ri];
          return (
            <button
              key={`${ci}-${ri}`}
              onClick={() => !isUsed && onSelectClue(ci, ri)}
              disabled={isUsed}
              className={`min-h-[72px] flex items-center justify-center border border-blue-500/60
                transition-colors duration-100
                ${
                  isUsed
                    ? "bg-blue-950 cursor-default"
                    : "bg-blue-700 hover:bg-blue-600 cursor-pointer"
                }`}
            >
              {!isUsed && (
                <span
                  className="text-yellow-400 text-2xl"
                  style={{
                    fontFamily: "'Anton', sans-serif",
                    textShadow: "1px 1px 0 rgba(0,0,0,0.6)",
                  }}
                >
                  {formatCurrency(val)}
                </span>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}
