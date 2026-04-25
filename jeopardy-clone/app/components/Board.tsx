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
      className="grid gap-1 p-1 bg-black flex-1 rounded-sm"
      style={{ gridTemplateColumns: `repeat(${CATEGORIES.length}, 1fr)` }}
    >
      {/* Category Headers */}
      {CATEGORIES.map((cat, ci) => (
        <div
          key={ci}
          className="bg-linear-to-b from-blue-900 to-blue-700 border border-t-white border-blue-500/60
                     flex items-center justify-center text-center 
                     text-white text-xl uppercase tracking-wide rounded-sm"
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
              className={`min-h-18 flex items-center justify-center border border-blue-500/60
                transition-colors duration-100
                ${
                  isUsed
                    ? "bg-blue-950 cursor-default"
                    : "bg-linear-to-b from-blue-600 to-blue-900 border cursor-pointer transition-all duration-300 hover:bg-linear-to-t hover:from-blue-600 hover:to-blue-600 hover:border-yellow-400 rounded-sm hover:inset-shadow-md hover: inset-shadow-yellow-500"
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
