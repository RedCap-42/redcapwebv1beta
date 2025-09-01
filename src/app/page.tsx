"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RouletteWheelIcon from "@/components/features/session-generator/RouletteWheelIcon";

export default function HomeHub() {
  const router = useRouter();
  const [spinning, setSpinning] = useState(false);

  const openSessionGenerator = () => {
    if (spinning) return;
    setSpinning(true);
    // Let the wheel spin briefly then navigate to the app
    setTimeout(() => router.push("/apps/session-generator"), 1400);
  };

  return (
    <main className="hub">
      <section className="hub-grid">
        <button
          className="app-tile"
          onClick={openSessionGenerator}
          aria-label="Ouvrir Générateur de séance"
        >
          <div className="app-icon">
            <RouletteWheelIcon spinning={spinning} />
          </div>
          <div className="app-title text-font">Générateur de séance</div>
        </button>
        {/* D'autres apps viendront ici plus tard */}
      </section>
    </main>
  );
}
