"use client";

import React from "react";

type Props = { spinning?: boolean };

export default function RouletteWheelIcon({ spinning = false }: Props) {
  return (
    <svg
      className={`roulette ${spinning ? "spinning" : ""}`}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Roulette"
    >
      {/* outer ring */}
      <circle cx="50" cy="50" r="46" fill="#1e1e1e" stroke="#111" strokeWidth="2" />
      {/* segments */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a0 = (i * Math.PI) / 4;
        const a1 = ((i + 1) * Math.PI) / 4;
        const x0 = 50 + 40 * Math.cos(a0);
        const y0 = 50 + 40 * Math.sin(a0);
        const x1 = 50 + 40 * Math.cos(a1);
        const y1 = 50 + 40 * Math.sin(a1);
        const d = `M50,50 L${x0},${y0} A40,40 0 0 1 ${x1},${y1} Z`;
        const colors = ["#e53935", "#43a047"]; // red/green
        return <path key={i} d={d} fill={colors[i % 2]} opacity="0.96" />;
      })}
      {/* inner ring */}
      <circle cx="50" cy="50" r="26" fill="#2b2b2b" stroke="#000" strokeWidth="2" />
      {/* hub */}
      <circle cx="50" cy="50" r="6" fill="#ffd54f" stroke="#000" strokeWidth="1.5" />
      {/* pointer */}
      <polygon points="50,2 46,10 54,10" fill="#ffd54f" stroke="#000" strokeWidth="1" />
    </svg>
  );
}
