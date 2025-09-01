"use client";

import SessionPicker from "@/components/sessions/SessionPicker";

export default function SessionGeneratorPage() {
  return (
    <section className="min-h-[calc(100dvh-120px)] px-4 py-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="daydream-font text-2xl sm:text-3xl mb-4 text-center">Générateur de séance</h1>
        <SessionPicker open={true} />
      </div>
    </section>
  );
}
