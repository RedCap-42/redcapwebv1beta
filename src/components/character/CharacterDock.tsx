"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";

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

export default function CharacterDock({ messagesUrl = "/character-messages.txt", size = 48 }: { messagesUrl?: string; size?: number }) {
  const [message, setMessage] = useState("Coucou, merci d'être venu sur mon site");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const lines = await fetchLines(messagesUrl);
      if (lines.length > 0) {
        const choice = lines[Math.floor(Math.random() * lines.length)];
        setMessage(choice);
      }
    })();
  }, [messagesUrl]);

  useEffect(() => {
    // Try to find an avatar inside /character with common extensions
    (async () => {
      const exts = ["png", "svg", "jpg", "jpeg", "webp"];
      for (const ext of exts) {
        const url = `/character/avatar.${ext}`;
        try {
          const res = await fetch(url, { method: "HEAD", cache: "no-store" });
          if (res.ok) {
            setAvatarSrc(url);
            return;
          }
        } catch {
          // ignore and try next
        }
      }
      setAvatarSrc(null);
    })();
  }, []);

  return (
    <div className="flex flex-col items-center">
      {/* Speech bubble above */}
      <div className="relative mb-3">
        <div className="text-font text-[14px] leading-tight bg-white border-4 border-neutral-900 px-3 py-2 max-w-[78vw] sm:max-w-md text-center">
          {message}
        </div>
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-3 h-3 bg-white border-b-4 border-r-4 border-neutral-900 rotate-45" aria-hidden />
      </div>
    {/* Character sitting on the bar (no fallback square) */}
      {avatarSrc ? (
        <Image
          src={avatarSrc}
          alt="personnage"
          width={size}
          height={size}
          className="pixel-img object-contain"
          style={{ width: size, height: size }}
          priority
        />
      ) : null}
    </div>
  );
}
