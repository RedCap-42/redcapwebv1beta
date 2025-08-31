"use client";

import React, { useEffect, useMemo, useState } from "react";

export default function DissolveOverlay({ open, durationMs = 3000, rows = 10, cols = 10, onFullyCovered, onAnimationEnd }: { open: boolean; durationMs?: number; rows?: number; cols?: number; onFullyCovered?: () => void; onAnimationEnd?: () => void; }) {
  // Compute a grid that keeps cells square based on viewport ratio
  const [grid, setGrid] = useState({ rows, cols });

  useEffect(() => {
    const computeGrid = () => {
      const c = cols || 12;
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      const r = Math.max(1, Math.round((vh / vw) * c));
      setGrid({ rows: r, cols: c });
    };
    computeGrid();
    window.addEventListener("resize", computeGrid);
    window.addEventListener("orientationchange", computeGrid);
    return () => {
      window.removeEventListener("resize", computeGrid);
      window.removeEventListener("orientationchange", computeGrid);
    };
  }, [cols]);

  const total = grid.rows * grid.cols;
  const appearTime = 3000; // 3s pour apparaître
  const pauseTime = 2000;  // 2s de pause (réduit)
  const dissolveTime = 2000; // 2s pour disparaître
  const totalTime = appearTime + pauseTime + dissolveTime; // 7s total
  
  const delays = useMemo(() => {
    const centerRow = Math.floor(grid.rows / 2);
    const centerCol = Math.floor(grid.cols / 2);
    const maxDist = Math.sqrt(centerRow * centerRow + centerCol * centerCol) || 1;

    return Array.from({ length: total }, (_, i) => {
      const row = Math.floor(i / grid.cols);
      const col = i % grid.cols;
      const dist = Math.sqrt((row - centerRow) ** 2 + (col - centerCol) ** 2);
      const normalizedDist = dist / maxDist;

      // Appear from center outward (during first 3s)
      const appearDelay = normalizedDist * appearTime;
      // Dissolve from outside inward (during last 2s)
      const dissolveDelay = appearTime + pauseTime + (1 - normalizedDist) * dissolveTime;

      return { appearDelay, dissolveDelay, totalTime };
    });
  }, [grid.rows, grid.cols, appearTime, pauseTime, dissolveTime]);

  useEffect(() => {
    if (open && onFullyCovered) {
      const timer = setTimeout(onFullyCovered, appearTime);
      return () => clearTimeout(timer);
    }
  }, [open, onFullyCovered, appearTime]);

  useEffect(() => {
    if (open && onAnimationEnd) {
      const timer = setTimeout(onAnimationEnd, totalTime);
      return () => clearTimeout(timer);
    }
  }, [open, onAnimationEnd, totalTime]);

  if (!open) return null;

  return (
    <div
      className="dissolve-overlay"
      aria-hidden
      style={{
        gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
      }}
    >
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="dissolve-cell"
          style={{
            animation: `pixelAppear 200ms ease-out ${delays[i].appearDelay}ms forwards, pixelDissolve 300ms ease-in ${delays[i].dissolveDelay}ms forwards`,
            opacity: 0,
            transform: "scale(0)",
            // Safety to keep cells visually square if rounding makes them off a bit
            aspectRatio: "1 / 1",
          }}
        />
      ))}
    </div>
  );
}
