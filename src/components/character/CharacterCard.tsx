"use client";

import React, { useEffect, useState } from "react";

type Props = {
  messagesUrl?: string;
  className?: string;
};

async function fetchLines(url: string): Promise<string[]> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return [];
    const txt = await res.text();
    return txt
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default function CharacterCard({ messagesUrl = "/character-messages.txt", className = "" }: Props) {
  const [message, setMessage] = useState("Coucou, merci d'être venu sur mon site");

  useEffect(() => {
    (async () => {
      const lines = await fetchLines(messagesUrl);
      if (lines.length > 0) {
        const choice = lines[Math.floor(Math.random() * lines.length)];
        setMessage(choice);
      }
    })();
  }, [messagesUrl]);

  return (
    <div className={["w-full flex items-center justify-center", className].join(" ")}> 
      <div className="flex items-center gap-4">
        {/* Character placeholder */}
        <div className="w-14 h-14 bg-neutral-200 border-4 border-neutral-900 pixel-outline" aria-label="personnage" />
        {/* Speech bubble */}
        <div className="relative">
          <div className="text-font text-[14px] leading-tight bg-white border-4 border-neutral-900 px-3 py-2 max-w-[70vw] sm:max-w-md">
            {message}
          </div>
          <div className="absolute -left-3 top-4 w-3 h-3 bg-white border-l-4 border-b-4 border-neutral-900 rotate-45" aria-hidden />
        </div>
      </div>
    </div>
  );
}
