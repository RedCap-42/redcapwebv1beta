"use client";
import Button from "@/components/ui/Button";
import DissolveOverlay from "@/components/effects/DissolveOverlay";
import SessionPicker from "@/components/sessions/SessionPicker";
import { useState } from "react";
import CharacterDock from "@/components/character/CharacterDock";

export default function Home() {
  const [dissolve, setDissolve] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleGenerate = () => {
    setDissolve(true);
  };

  const handleFullyCovered = () => {
    setShowPicker(true);
  };

  const handleAnimationEnd = () => {
    setDissolve(false);
  };

  return (
    <section className="relative min-h-[calc(100dvh-120px)]">{/* space for header */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-10 sm:py-16" />

      {/* Bottom fixed action */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-white/90 backdrop-blur safe-bottom border-t-4 border-neutral-100">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pt-3">
          <div className="w-full flex items-end justify-center mb-2">
            {!showPicker && <CharacterDock size={80} />}
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-3">
          <Button className="w-full daydream-font" onClick={handleGenerate}>
            generer une seance
          </Button>
        </div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 pb-2 text-center text-[11px] text-neutral-500 select-none">
          make by CasquetteRouge 2025
        </div>
      </div>

      {showPicker && <SessionPicker open={showPicker} />}
      <DissolveOverlay open={dissolve} onFullyCovered={handleFullyCovered} onAnimationEnd={handleAnimationEnd} />
    </section>
  );
}
