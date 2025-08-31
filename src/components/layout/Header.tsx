import React from "react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b-4 border-neutral-900 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 text-center">
        <h1 className="daydream-font text-[20px] sm:text-[24px] leading-none text-neutral-900">CasquetteRouge</h1>
      </div>
    </header>
  );
}
