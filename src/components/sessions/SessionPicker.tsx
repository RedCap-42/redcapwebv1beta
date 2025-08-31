"use client";

import React, { useEffect, useMemo, useState } from "react";
import { SessionRandomizer } from "@/utils/sessionRandomizer";

export type DifficultyKey = "facile" | "moyen" | "difficile";

export type SessionItem = {
  id: string;
  title: string;
  image: string;
  difficulties: Record<DifficultyKey, { label: string; desc?: string; image?: string }>;
};

export default function SessionPicker({ open, onSelect }: { open: boolean; onSelect?: (id: string, difficulty: DifficultyKey) => void;}) {
  const [items, setItems] = useState<SessionItem[]>([]);
  const [index, setIndex] = useState(0);
  const [difficulty, setDifficulty] = useState<DifficultyKey>("facile");
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [imageSrc, setImageSrc] = useState<string>("");
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [imageKey, setImageKey] = useState(0); // Force image re-render
  const [finalSelectionMade, setFinalSelectionMade] = useState(false);
  const [imageAspectRatio, setImageAspectRatio] = useState<number | null>(null);

  const difficulties: DifficultyKey[] = ["facile", "moyen", "difficile"];
  const currentDifficultyIndex = difficulties.indexOf(difficulty);

  // Function to get a truly random session and difficulty
  const getRandomSessionAndDifficulty = () => {
    if (items.length === 0) return { sessionIndex: 0, difficulty: "facile" as DifficultyKey };
    
    // Get recent selections from localStorage to avoid repetition
    const getRecentSelections = (): string[] => {
      try {
        const recent = localStorage.getItem('recentSessionSelections');
        return recent ? JSON.parse(recent) : [];
      } catch {
        return [];
      }
    };

    // Save selection to localStorage
    const saveSelection = (sessionId: string, difficulty: DifficultyKey) => {
      try {
        const selectionKey = `${sessionId}-${difficulty}`;
        const recent = getRecentSelections();
        const updated = [selectionKey, ...recent.filter(item => item !== selectionKey)].slice(0, 3); // Keep last 3
        localStorage.setItem('recentSessionSelections', JSON.stringify(updated));
      } catch {
        // localStorage not available, continue without saving
      }
    };

    const recentSelections = getRecentSelections();
    
    // Create all possible combinations with weighted difficulties
    const allCombinations: Array<{ sessionIndex: number, difficulty: DifficultyKey, key: string }> = [];
    items.forEach((session, sessionIndex) => {
      // Give different weights to difficulties to encourage variety
      // Facile: 1x, Moyen: 1.2x, Difficile: 1.1x (slight preference for medium)
      const difficultyWeights: Record<DifficultyKey, number> = {
        "facile": 1,
        "moyen": 1.2,
        "difficile": 1.1
      };

      difficulties.forEach(diff => {
        const key = `${session.id}-${diff}`;
        const weight = difficultyWeights[diff];
        // Add multiple entries based on weight
        const count = Math.round(weight * 10); // Convert to integer count
        for (let i = 0; i < count; i++) {
          allCombinations.push({ sessionIndex, difficulty: diff, key });
        }
      });
    });

    // Filter out recent selections if we have enough options
    const availableCombinations = allCombinations.filter(combo => 
      !recentSelections.includes(combo.key)
    );

    // If we filtered out too many, use all combinations
    const candidateCombinations = availableCombinations.length > 0 ? availableCombinations : allCombinations;
    
    // Select randomly from available combinations
    const randomIndex = Math.floor(Math.random() * candidateCombinations.length);
    const selected = candidateCombinations[randomIndex];
    
    // Save this selection for future reference
    const selectedSession = items[selected.sessionIndex];
    if (selectedSession) {
      saveSelection(selectedSession.id, selected.difficulty);
    }
    
    return { sessionIndex: selected.sessionIndex, difficulty: selected.difficulty };
  };

  // Function to randomize with animation
  const randomizeSelection = () => {
    if (items.length === 0) return;
    
    setIsRandomizing(true);
    setFinalSelectionMade(false);
    
    // Create animation effect by changing selection more slowly
    let animationStep = 0;
    const animationSteps = 8 + Math.floor(Math.random() * 4); // Fewer steps for slower animation (8-12 steps)
    const baseInterval = 150; // Increased base interval (was 80ms, now 150ms)
    
    const animate = () => {
      // Use a simple random for animation steps (not the smart algorithm)
      const tempRandomSessionIndex = Math.floor(Math.random() * items.length);
      const tempRandomDifficultyIndex = Math.floor(Math.random() * difficulties.length);
      
      setIndex(tempRandomSessionIndex);
      setDifficulty(difficulties[tempRandomDifficultyIndex]);
      
      animationStep++;
      if (animationStep < animationSteps) {
        // Gradually increase interval for a "slowing down" effect (slower progression)
        const currentInterval = baseInterval + (animationStep * 15); // Increased progression (was 5ms, now 15ms)
        setTimeout(animate, currentInterval);
      } else {
        // Final selection using the smart algorithm
        const finalRandom = getRandomSessionAndDifficulty();
        setIndex(finalRandom.sessionIndex);
        setDifficulty(finalRandom.difficulty);
        setFinalSelectionMade(true);
        
        // Force image update after final selection
        setTimeout(() => {
          setIsRandomizing(false);
        }, 500); // Increased delay for better visibility of final selection (was 300ms)
      }
    };
    
    animate();
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/sessions/catalog.json", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as SessionItem[];
          setItems(data);
        }
      } catch {}
    })();
  }, []);

  useEffect(() => {
    if (!open) return;
    if (items.length === 0) return;
    // Pick a truly random session AND difficulty when it opens
    randomizeSelection();
  }, [open, items.length]);

  const current = items[index];
  
  // Function to try multiple image formats
  const tryImageFormats = async (basePath: string): Promise<string> => {
    const extensions = ['png', 'jpg', 'jpeg'];
    const pathWithoutExtension = basePath.replace(/\.(png|jpg|jpeg)$/i, '');
    
    for (const ext of extensions) {
      const testPath = `${pathWithoutExtension}.${ext}`;
      try {
        const response = await fetch(testPath, { method: 'HEAD' });
        if (response.ok) {
          return testPath;
        }
      } catch {
        // Continue to next format
      }
    }
    // Return original path as fallback
    return basePath;
  };

  // Update image source when current session or difficulty changes
  useEffect(() => {
    if (current?.difficulties?.[difficulty]?.image || current?.image) {
      const imageToTry = current.difficulties?.[difficulty]?.image || current.image;
      tryImageFormats(imageToTry).then((newImageSrc) => {
        setImageSrc(newImageSrc);
        setImageKey(prev => prev + 1); // Force re-render
      });
    }
  }, [current, difficulty]);

  // Force image update when randomization ends
  useEffect(() => {
    if (finalSelectionMade && current) {
      const imageToTry = current.difficulties?.[difficulty]?.image || current.image;
      if (imageToTry) {
        tryImageFormats(imageToTry).then((newImageSrc) => {
          setImageSrc(newImageSrc);
          setImageKey(prev => prev + 1); // Force re-render
        });
      }
    }
  }, [finalSelectionMade, current, difficulty]);

  const currentImage = imageSrc;

  if (!open || !current) return null;

  const handleDifficulty = (key: DifficultyKey) => {
    setDifficulty(key);
    onSelect?.(current.id, key);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentDifficultyIndex < difficulties.length - 1) {
      const nextDifficulty = difficulties[currentDifficultyIndex + 1];
      handleDifficulty(nextDifficulty);
    }
    if (isRightSwipe && currentDifficultyIndex > 0) {
      const prevDifficulty = difficulties[currentDifficultyIndex - 1];
      handleDifficulty(prevDifficulty);
    }
  };

  const getDifficultyStyle = (difficultyIndex: number) => {
    const isSelected = difficultyIndex === currentDifficultyIndex;
    const isAdjacent = Math.abs(difficultyIndex - currentDifficultyIndex) === 1;
    
    if (isSelected) {
      return "pixel-font pixel-btn px-4 py-2 text-sm sm:px-6 sm:py-3 sm:text-base bg-[#ffe5ea] transform scale-110 opacity-100 transition-all duration-300";
    } else if (isAdjacent) {
      return "pixel-font pixel-btn px-3 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm bg-white transform scale-90 opacity-70 transition-all duration-300";
    } else {
      return "pixel-font pixel-btn px-2 py-1 text-xs sm:px-3 sm:py-1 sm:text-xs bg-white transform scale-75 opacity-40 transition-all duration-300";
    }
  };

  return (
    <div className="fixed inset-0 z-40 grid place-items-center px-4 pb-24">
      <div className="w-full max-w-[min(92vw,720px)] text-center">
        <div className="flex items-center justify-center gap-4 mb-3">
          <div className="pixel-font text-2xl sm:text-3xl">{current.title}</div>
          <button
            onClick={randomizeSelection}
            disabled={isRandomizing}
            className={`pixel-font pixel-btn px-3 py-2 text-sm bg-[#e8f4fd] hover:bg-[#d4e9f7] border-2 border-[#b8daf0] transition-all duration-200 ${
              isRandomizing ? 'opacity-50 cursor-not-allowed animate-pulse' : 'hover:scale-105'
            }`}
            title="Nouvelle sélection aléatoire"
          >
            🎲
          </button>
        </div>

        <div className={`relative mx-auto mb-4 session-image-container ${
          current.id === 'escalier' 
            ? 'escalier-container' // Use custom escalier styling - clean transparent background
            : 'rounded-lg'
        }`} style={
          current.id === 'escalier' 
            ? { 
                width: "100%", 
                maxWidth: imageAspectRatio && imageAspectRatio < 0.8 ? "300px" : "320px", // Narrower for very vertical images
                height: "320px"
              }
            : { width: "100%", aspectRatio: "16/9" } // Standard for others
        }>
          {/* Illustration that can vary by difficulty */}
          {currentImage && (
            <img 
              key={imageKey} // Force re-render with key
              src={currentImage} 
              alt={current.title} 
              className={`transition-opacity duration-300 ${
                isRandomizing ? 'opacity-50' : 'opacity-100'
              } ${
                current.id === 'escalier' 
                  ? 'session-image-escalier p-4' // Use optimized escalier class with more padding
                  : 'session-image-standard' // Use standard class
              }`}
              onLoad={(e) => {
                // Detect aspect ratio to optimize display
                const img = e.target as HTMLImageElement;
                const aspectRatio = img.naturalWidth / img.naturalHeight;
                setImageAspectRatio(aspectRatio);
              }}
              style={
                current.id === 'escalier'
                  ? { 
                      maxHeight: 'calc(100% - 32px)', // Account for increased padding
                      maxWidth: 'calc(100% - 32px)'
                    }
                  : {}
              }
              onError={(e) => {
                // Enhanced fallback for escalier images
                const img = e.target as HTMLImageElement;
                const basePath = img.src.replace(/\.(png|jpg|jpeg)$/i, '');
                const currentExt = img.src.match(/\.(png|jpg|jpeg)$/i)?.[1];
                
                // Try different extensions first
                const otherExts = ['png', 'jpg', 'jpeg', 'webp'].filter(ext => ext !== currentExt);
                
                if (otherExts.length > 0) {
                  img.src = `${basePath}.${otherExts[0]}`;
                } else if (current.id === 'escalier') {
                  // Fallback to a generic escalier image if specific one fails
                  const fallbackPath = `/sessions/images/escalier/facile/escalier_facile.png`;
                  if (img.src !== fallbackPath) {
                    img.src = fallbackPath;
                  }
                }
              }}
            />
          )}
        </div>

        {/* Mobile carousel for difficulties */}
        <div 
          className={`flex items-center justify-center gap-2 sm:gap-4 py-4 transition-opacity duration-300 ${
            isRandomizing ? 'opacity-50' : 'opacity-100'
          }`}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {difficulties.map((k, difficultyIndex) => (
            <button
              key={k}
              type="button"
              className={getDifficultyStyle(difficultyIndex)}
              aria-pressed={difficulty === k}
              onClick={() => !isRandomizing && handleDifficulty(k)}
              disabled={isRandomizing}
            >
              {current.difficulties[k].label}
            </button>
          ))}
        </div>

        {current.difficulties[difficulty]?.desc && (
          <div className={`text-font text-sm sm:text-base mt-4 text-neutral-800 font-medium leading-relaxed transition-opacity duration-300 ${
            isRandomizing ? 'opacity-50' : 'opacity-100'
          }`}>
            L'objectif de la séance est de courir et {current.difficulties[difficulty].desc.toLowerCase()}
          </div>
        )}

        {/* Random selection indicator */}
        {isRandomizing && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="text-sm text-neutral-600 animate-pulse">
              🎲 Sélection aléatoire en cours
            </div>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
