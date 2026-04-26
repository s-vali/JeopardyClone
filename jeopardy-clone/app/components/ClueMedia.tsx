"use client";

import { ClueMedia as ClueMediaType } from "@/app/types/game";

interface Props {
  media: ClueMediaType;
}

export default function ClueMedia({ media }: Props) {
  return (
    <div className="my-4 flex flex-col items-center gap-2 w-full">
      {media.type === "image" && (
        <img
          src={media.src}
          alt={media.alt ?? "Clue image"}
          className="max-h-52 max-w-full rounded-lg object-contain border border-yellow-400/30"
        />
      )}

      {media.type === "audio" && (
        <audio controls autoPlay className="w-full" src={media.src} />
      )}

      {media.type === "video" && (
        <video
          controls
          autoPlay
          muted
          className="max-h-52 max-w-full rounded-lg border border-yellow-400/30"
          src={media.src}
        />
      )}

      {media.caption && (
        <p className="text-white/60 text-xs tracking-wide italic">
          {media.caption}
        </p>
      )}
    </div>
  );
}
