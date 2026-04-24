/* OLD
import { Clue } from "@/app/types/game";

type Props = {
  clue: Clue;
  onClick: (clue: Clue) => void;
};

export default function Tile({ clue, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(clue)}
      disabled={clue.revealed}
      className={`
        w-full h-24 flex items-center justify-center
        border border-blue-600
        text-yellow-300 font-bold text-3xl
        bg-linear-to-b from-blue-700 to-blue-900
        enabled:hover:bg-blue-600
        active:scale-95 transition-transform duration-150
        disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed
      `}
    >
      {clue.revealed ? <div className="bg-blue-900"></div> : `$${clue.value}`}
    </button>
  );
}
*/
