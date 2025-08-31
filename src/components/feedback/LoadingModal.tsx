"use client";

import React, { useEffect, useMemo, useState } from "react";

type LoadingModalProps = {
  open: boolean;
  onClose?: () => void;
  durationMs?: number;
};

async function fetchMessages(): Promise<string[]> {
  try {
    const res = await fetch("/messages.txt", { cache: "no-store" });
    if (!res.ok) return ["Chargement..."];
    const text = await res.text();
    return text
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
  } catch {
    return ["Chargement..."];
  }
}

export default function LoadingModal({ open, onClose }: LoadingModalProps) {
  const [visible, setVisible] = useState(open);
  const [messages, setMessages] = useState<string[] | null>(null);
  const [message, setMessage] = useState<string>("Chargement...");
  
  const appearTime = 3000; // 3s pour apparaître
  const pauseTime = 6000;  // 6s de pause
  const dissolveTime = 3000; // 3s pour disparaître
  const totalTime = appearTime + pauseTime + dissolveTime; // 12s total

  // Modal appearance timing
  const modalAppearStart = appearTime; // Modal appears after background
  const modalAppearDuration = 400; // 400ms for modal to appear
  const modalDisappearStart = appearTime + pauseTime - 400; // Start disappearing 400ms before dissolve
  const modalDisappearDuration = 400; // 400ms for modal to disappear
  
  // Pixel grid animation for modal background overlay (separate from the modal card itself)
  const rows = 8, cols = 12;
  const total = rows * cols;
  const modalDelays = useMemo(() => {
    const centerRow = Math.floor(rows / 2);
    const centerCol = Math.floor(cols / 2);
    const maxDist = Math.sqrt(centerRow * centerRow + centerCol * centerCol);
    
    return Array.from({ length: total }, (_, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const dist = Math.sqrt((row - centerRow) ** 2 + (col - centerCol) ** 2);
      const normalizedDist = dist / maxDist;
      
      // Modal card appears from center outward after background is done
      const appearDelay = modalAppearStart + normalizedDist * modalAppearDuration;
      // Modal card dissolves from outside inward before background dissolve
      const dissolveDelay = modalDisappearStart + (1 - normalizedDist) * modalDisappearDuration;
      
      return { appearDelay, dissolveDelay };
    });
  }, [modalAppearStart, modalAppearDuration, modalDisappearStart, modalDisappearDuration, total]);

  useEffect(() => {
    let timer: number | undefined;
    if (open) {
      setVisible(true);
      (async () => {
        const list = await fetchMessages();
        setMessages(list);
        const choice = list[Math.floor(Math.random() * list.length)] ?? "Chargement...";
        setMessage(choice);
      })();
      timer = window.setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, totalTime);
    } else {
      setVisible(false);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [open, onClose, totalTime]);

  if (!visible) return null;

  return (
    <div role="dialog" aria-modal className="modal-backdrop">      
      <div 
        className="modal-card" 
        style={{ 
          position: "relative", 
          zIndex: 1,
          opacity: 0,
          animation: `fadeIn 50ms ease-out ${modalAppearStart}ms forwards, fadeOut 50ms ease-in ${modalDisappearStart + modalDisappearDuration}ms forwards`
        }}
      >
        {/* Modal pixel grid overlay for the card itself */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "grid",
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            pointerEvents: "none",
            zIndex: 2,
            gap: 0,
          }}
        >
          {Array.from({ length: total }).map((_, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                border: "1px solid rgba(200, 200, 200, 0.3)",
                opacity: 0,
                transform: "scale(0)",
                animation: `pixelAppear 100ms ease-out ${modalDelays[i].appearDelay}ms forwards, pixelDissolve 100ms ease-in ${modalDelays[i].dissolveDelay}ms forwards`,
              }}
            />
          ))}
        </div>
        
        <div className="modal-body" style={{ 
          position: "relative", 
          zIndex: 3,
          opacity: 0,
          animation: `fadeIn 200ms ease-out ${modalAppearStart + modalAppearDuration + 100}ms forwards, fadeOut 200ms ease-in ${modalDisappearStart - 100}ms forwards`
        }}>
          <div className="text-font text-[14px] leading-snug mb-3">{message}</div>
          <div className="progress">
            <div className="bar" style={{ 
              animationDuration: `${pauseTime}ms`,
              animationDelay: `${modalAppearStart + modalAppearDuration}ms`
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
