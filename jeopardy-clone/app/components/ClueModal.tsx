"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { CATEGORIES, VALUES } from "@/app/data/questions";
import { ModalState } from "@/app/types/game";
import { formatCurrency } from "@/app/utils/format";
import ClueMedia from "@/app/components/ClueMedia";

const PLAYERS = ["Player 1", "Player 2", "Player 3"];
const TRANSITION_MS = 250;
const FLIP_HALF_MS = 200; // half-duration of the 3D flip

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

  // ── Modal enter/exit fade+scale ──────────────────────────
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const makeExitHandler = useCallback(
    (fn: () => void) => () => {
      setVisible(false);
      setTimeout(fn, TRANSITION_MS);
    },
    []
  );

  // ── 3D horizontal flip (question → answer) ───────────────
  // flipState drives the inline rotateY value:
  //   "resting"  →  rotateY(0deg)      visible, flat
  //   "exit"     →  rotateY(90deg)     edge-on, disappearing
  //   "enter"    →  rotateY(-90deg)    edge-on, about to appear
  type FlipState = "resting" | "exit" | "enter";
  const [flipState, setFlipState] = useState<FlipState>("resting");
  const [displayPhase, setDisplayPhase] = useState<ModalState["phase"]>(
    modal.phase
  );
  const flipRef = useRef(false); // guard against double-fire

  // Keep displayPhase in sync when parent changes phase WITHOUT a flip
  // (e.g. dd-wager → question)
  useEffect(() => {
    if (modal.phase !== "answer") {
      setDisplayPhase(modal.phase);
    }
  }, [modal.phase]);

  const handleRevealAnswer = useCallback(() => {
    if (flipRef.current) return;
    flipRef.current = true;

    // 1. Rotate current face out (0 → 90deg)
    setFlipState("exit");

    setTimeout(() => {
      // 2. Swap content while card is edge-on (invisible)
      setDisplayPhase("answer");
      // 3. Position new face at -90deg (other side)
      setFlipState("enter");

      // Small rAF so the browser commits the -90deg before transitioning
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // 4. Rotate new face into view (−90 → 0deg)
          setFlipState("resting");
          flipRef.current = false;
        });
      });
    }, FLIP_HALF_MS);

    // Also notify parent so modal.phase updates
    onRevealAnswer();
  }, [onRevealAnswer]);

  // Derive the inline rotateY from flipState
  const rotateY =
    flipState === "exit"
      ? "rotateY(90deg)"
      : flipState === "enter"
      ? "rotateY(-90deg)"
      : "rotateY(0deg)";

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
    // Backdrop: fade in/out
    <div
      className={`fixed inset-0 flex items-center justify-center z-50
                  transition-opacity duration-250 ease-in-out
                  ${
                    visible ? "bg-black/80 opacity-100" : "bg-black/0 opacity-0"
                  }`}
    >
      {/*
        Perspective wrapper — required for the 3D flip to look correct.
        Matches: .md-effect-8 { perspective: 1300px }
      */}
      {/* Card */}
      <div
        className={`border-4 border-yellow-400 rounded-lg px-10 py-8 w-full text-center
              bg-linear-to-br from-blue-700 to-blue-900
              shadow-[0_0_50px_rgba(255,215,0,0.5)]
              transition-[opacity,transform] ease-in-out
              min-h-120 max-w-5xl flex flex-col justify-between  {/* ← add these */}
              ${visible ? "opacity-100 scale-100" : "opacity-0 scale-[0.7]"}`}
        style={{
          perspective: "1300px",
          transformStyle: "preserve-3d",
          // Merge the modal enter/exit scale with the flip rotateY.
          // We can't use both Tailwind scale classes and an inline rotateY
          // simultaneously without one overwriting the other, so we apply
          // the flip via a CSS variable and compose them here.
          transform: `${visible ? "scale(1)" : "scale(0.7)"} ${rotateY}`,
          // Exit half uses FLIP_HALF_MS; enter half also uses FLIP_HALF_MS.
          // Modal open/close uses TRANSITION_MS for the scale fade.
          transitionDuration:
            flipState !== "resting"
              ? `${FLIP_HALF_MS}ms`
              : `${TRANSITION_MS}ms`,
        }}
      >
        {/* ── DAILY DOUBLE WAGER ── */}
        {displayPhase === "dd-wager" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-3">
            <p
              className="text-yellow-400 text-4xl animate-pulse"
              style={{
                fontFamily: "'Anton', sans-serif",
                textShadow: "0 0 20px rgba(255,215,0,0.8)",
              }}
            >
              Daily Double!
            </p>
            <p className="text-yellow-400 text-sm tracking-widest uppercase">
              {cat.name}
            </p>
            <p className="text-white/60 text-sm">
              Max wager: {formatCurrency(maxWager)}
            </p>
            <input
              type="number"
              min={5}
              max={maxWager}
              value={wagerInput}
              onChange={(e) => setWagerInput(e.target.value)}
              className="bg-black/50 border-2 border-yellow-400 rounded
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
          </div>
        )}

        {/* ── QUESTION ── */}
        {displayPhase === "question" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-yellow-400 text-sm tracking-widest uppercase">
              {cat.name}
            </p>
            <p
              className="text-yellow-400 text-3xl"
              style={{
                fontFamily: "'Anton', sans-serif",
                textShadow: "0 0 10px rgba(255,215,0,0.5)",
              }}
            >
              {clue.isDailyDouble ? "Daily Double — " : ""}
              {formatCurrency(displayValue)}
            </p>
            <p className="text-white text-xl leading-relaxed">
              {clue.question}
            </p>

            {clue.media && <ClueMedia media={clue.media} />}

            <button
              onClick={handleRevealAnswer}
              className="border border-white/30 bg-white/10 text-white uppercase
                   tracking-widest text-sm px-6 py-2 rounded hover:bg-white/20 transition-colors"
              style={{ fontFamily: "'Oswald', sans-serif" }}
            >
              Reveal Answer
            </button>
          </div>
        )}

        {/* ── ANSWER ── */}
        {displayPhase === "answer" && (
          <div className="flex flex-col items-center justify-center flex-1 gap-4">
            <p className="text-yellow-400 text-sm tracking-widest uppercase">
              {cat.name}
            </p>
            <p
              className="text-yellow-400 text-3xl"
              style={{ fontFamily: "'Anton', sans-serif" }}
            >
              {formatCurrency(displayValue)}
            </p>
            <p className="text-white text-xl leading-relaxed">
              {clue.question}
            </p>
            <div className="bg-black/40 border border-yellow-400/40 rounded px-6 py-3 inline-block">
              <span className="text-yellow-400 text-lg tracking-wide">
                What is: {clue.answer}?
              </span>
            </div>

            {clue.isDailyDouble ? (
              <div className="flex gap-3 justify-center">
                <button
                  onClick={makeExitHandler(() => onAward(true))}
                  className="bg-green-700 border-2 border-green-400 text-white font-bold
                       uppercase tracking-widest p-4 rounded-full hover:bg-green-600 transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    width={20}
                    height={20}
                    fill="currentColor"
                  >
                    <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" />
                  </svg>
                </button>
                <button
                  onClick={makeExitHandler(() => onAward(false))}
                  className="bg-red-800 border-2 border-red-500 text-white font-bold
                       uppercase tracking-widests p-4 rounded-full hover:bg-red-700 transition-colors"
                  style={{ fontFamily: "'Oswald', sans-serif" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 640 640"
                    width={20}
                    height={20}
                    fill="currentColor"
                  >
                    <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
                  </svg>
                </button>
              </div>
            ) : (
              <>
                <p className="text-white/60 text-xs tracking-widest uppercase">
                  Who got it right?
                </p>
                <div className="flex gap-2 justify-center">
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
                    onClick={makeExitHandler(() => onAward(true))}
                    disabled={modal.selectedPlayer === null}
                    className="bg-green-700 border-2 border-green-400 text-white font-bold
                         uppercase tracking-widest p-4 rounded-full hover:bg-green-600
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      width={20}
                      height={20}
                      fill="currentColor"
                    >
                      <path d="M530.8 134.1C545.1 144.5 548.3 164.5 537.9 178.8L281.9 530.8C276.4 538.4 267.9 543.1 258.5 543.9C249.1 544.7 240 541.2 233.4 534.6L105.4 406.6C92.9 394.1 92.9 373.8 105.4 361.3C117.9 348.8 138.2 348.8 150.7 361.3L252.2 462.8L486.2 141.1C496.6 126.8 516.6 123.6 530.9 134z" />
                    </svg>
                  </button>
                  <button
                    onClick={makeExitHandler(() => onAward(false))}
                    disabled={modal.selectedPlayer === null}
                    className="bg-red-800 border-2 border-red-500 text-white font-bold
                         uppercase tracking-widest p-4 rounded-full hover:bg-red-700
                         disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      width={20}
                      height={20}
                      fill="currentColor"
                    >
                      <path d="M504.6 148.5C515.9 134.9 514.1 114.7 500.5 103.4C486.9 92.1 466.7 93.9 455.4 107.5L320 270L184.6 107.5C173.3 93.9 153.1 92.1 139.5 103.4C125.9 114.7 124.1 134.9 135.4 148.5L278.3 320L135.4 491.5C124.1 505.1 125.9 525.3 139.5 536.6C153.1 547.9 173.3 546.1 184.6 532.5L320 370L455.4 532.5C466.7 546.1 486.9 547.9 500.5 536.6C514.1 525.3 515.9 505.1 504.6 491.5L361.7 320L504.6 148.5z" />
                    </svg>
                  </button>
                  <button
                    onClick={makeExitHandler(onSkip)}
                    className="border border-white/30 bg-white/10 text-white uppercase
                         tracking-widest text-sm p-4 rounded-full hover:bg-white/20 transition-colors"
                    style={{ fontFamily: "'Oswald', sans-serif" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 640"
                      width={20}
                      height={20}
                      fill="currentColor"
                    >
                      <path d="M431.2 476.5L163.5 208.8C141.1 240.2 128 278.6 128 320C128 426 214 512 320 512C361.5 512 399.9 498.9 431.2 476.5zM476.5 431.2C498.9 399.8 512 361.4 512 320C512 214 426 128 320 128C278.5 128 240.1 141.1 208.8 163.5L476.5 431.2zM64 320C64 178.6 178.6 64 320 64C461.4 64 576 178.6 576 320C576 461.4 461.4 576 320 576C178.6 576 64 461.4 64 320z" />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
