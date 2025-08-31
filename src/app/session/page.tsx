"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SessionItem, DifficultyKey } from "@/components/sessions/SessionPicker";
import Button from "@/components/ui/Button";
import OptimizedImage from "@/components/ui/OptimizedImage";

export default function SessionPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">Chargement de la séance...</div>
        </div>
      </div>
    }>
      <SessionPageContent />
    </Suspense>
  );
}

function SessionPageContent() {
  const searchParams = useSearchParams();
  const [session, setSession] = useState<SessionItem | null>(null);
  const [difficulty, setDifficulty] = useState<DifficultyKey>("facile");
  const [loading, setLoading] = useState(true);

  const sessionId = searchParams.get("id");
  const sessionDifficulty = searchParams.get("difficulty") as DifficultyKey;

  useEffect(() => {
    const loadSession = async () => {
      try {
        const res = await fetch("/sessions/catalog.json", { cache: "no-store" });
        if (res.ok) {
          const sessions = (await res.json()) as SessionItem[];
          const foundSession = sessions.find(s => s.id === sessionId);
          if (foundSession) {
            setSession(foundSession);
            if (sessionDifficulty && ["facile", "moyen", "difficile"].includes(sessionDifficulty)) {
              setDifficulty(sessionDifficulty);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load session:", error);
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      loadSession();
    } else {
      setLoading(false);
    }
  }, [sessionId, sessionDifficulty]);

  if (loading) {
    return (
      <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <div className="text-lg">Chargement de la séance...</div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-[calc(100dvh-120px)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Séance non trouvée</h1>
          <p className="text-gray-600 mb-6">
            La séance demandée n&apos;existe pas ou n&apos;a pas pu être chargée.
          </p>
          <Button onClick={() => window.history.back()}>
            Retour
          </Button>
        </div>
      </div>
    );
  }

  const currentDifficulty = session.difficulties[difficulty];
  const imageToShow = currentDifficulty?.image || session.image;

  return (
    <div className="min-h-[calc(100dvh-120px)] py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="daydream-font text-3xl sm:text-4xl mb-2">{session.title}</h1>
          <div className="pixel-font text-lg text-gray-600">
            Difficulté: {currentDifficulty.label}
          </div>
        </div>

        {/* Session Image */}
        {imageToShow && (
          <div className="mb-8 flex justify-center">
            <div className={`relative ${
              session.id === 'escalier' 
                ? 'w-full max-w-sm h-80' 
                : 'w-full max-w-2xl aspect-video'
            }`}>
              <OptimizedImage
                src={imageToShow}
                alt={session.title}
                sessionType={session.id}
                className={`${
                  session.id === 'escalier' 
                    ? 'object-contain p-4' 
                    : 'object-cover rounded-lg'
                } w-full h-full`}
              />
            </div>
          </div>
        )}

        {/* Description */}
        {currentDifficulty.desc && (
          <div className="bg-white rounded-lg border-2 border-neutral-200 p-6 mb-8">
            <h2 className="pixel-font text-xl mb-4">Objectif de la séance</h2>
            <p className="text-font text-lg leading-relaxed">
              L&apos;objectif de la séance est de courir et {currentDifficulty.desc.toLowerCase()}
            </p>
          </div>
        )}

        {/* Difficulty Selector */}
        <div className="bg-neutral-50 rounded-lg p-6 mb-8">
          <h3 className="pixel-font text-lg mb-4 text-center">Changer de difficulté</h3>
          <div className="flex justify-center gap-4">
            {(["facile", "moyen", "difficile"] as DifficultyKey[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`pixel-font pixel-btn px-4 py-2 text-sm transition-all duration-200 ${
                  difficulty === diff
                    ? "bg-[#ffe5ea] transform scale-110"
                    : "bg-white hover:bg-neutral-100 transform scale-100"
                }`}
              >
                {session.difficulties[diff].label}
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => window.history.back()}>
            Retour à l&apos;accueil
          </Button>
          <Button 
            onClick={() => {
              // Here you could add functionality to start the session
              alert("Bonne séance de course !");
            }}
            className="bg-green-500 hover:bg-green-600"
          >
            Commencer la séance
          </Button>
        </div>
      </div>
    </div>
  );
}