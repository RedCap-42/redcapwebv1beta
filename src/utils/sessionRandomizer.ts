import { DifficultyKey, SessionItem } from "@/components/sessions/SessionPicker";

export interface RandomizerOptions {
  avoidRecentSelections?: boolean;
  maxRecentSelections?: number;
  difficultyWeights?: Record<DifficultyKey, number>;
}

export interface RandomSelectionResult {
  sessionIndex: number;
  difficulty: DifficultyKey;
  sessionId: string;
}

export class SessionRandomizer {
  private static readonly STORAGE_KEY = 'recentSessionSelections';
  private static readonly DEFAULT_WEIGHTS: Record<DifficultyKey, number> = {
    "facile": 1,
    "moyen": 1.2,
    "difficile": 1.1
  };

  static getRecentSelections(maxCount: number = 3): string[] {
    try {
      const recent = localStorage.getItem(this.STORAGE_KEY);
      return recent ? JSON.parse(recent).slice(0, maxCount) : [];
    } catch {
      return [];
    }
  }

  static saveSelection(sessionId: string, difficulty: DifficultyKey, maxCount: number = 3): void {
    try {
      const selectionKey = `${sessionId}-${difficulty}`;
      const recent = this.getRecentSelections(maxCount);
      const updated = [selectionKey, ...recent.filter(item => item !== selectionKey)].slice(0, maxCount);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available, continue without saving
    }
  }

  static clearRecentSelections(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {
      // localStorage not available
    }
  }

  static getRandomSelection(
    sessions: SessionItem[], 
    difficulties: DifficultyKey[],
    options: RandomizerOptions = {}
  ): RandomSelectionResult {
    if (sessions.length === 0) {
      return { sessionIndex: 0, difficulty: "facile", sessionId: "" };
    }

    const {
      avoidRecentSelections = true,
      maxRecentSelections = 3,
      difficultyWeights = this.DEFAULT_WEIGHTS
    } = options;

    const recentSelections = avoidRecentSelections ? this.getRecentSelections(maxRecentSelections) : [];

    // Create weighted combinations
    const allCombinations: Array<{ sessionIndex: number, difficulty: DifficultyKey, key: string }> = [];
    
    sessions.forEach((session, sessionIndex) => {
      difficulties.forEach(diff => {
        const key = `${session.id}-${diff}`;
        const weight = difficultyWeights[diff] || 1;
        // Add multiple entries based on weight
        const count = Math.round(weight * 10);
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
    
    const selectedSession = sessions[selected.sessionIndex];
    
    // Save this selection for future reference
    if (selectedSession && avoidRecentSelections) {
      this.saveSelection(selectedSession.id, selected.difficulty, maxRecentSelections);
    }
    
    return { 
      sessionIndex: selected.sessionIndex, 
      difficulty: selected.difficulty,
      sessionId: selectedSession?.id || ""
    };
  }

  static getRandomSessionOnly(sessions: SessionItem[]): number {
    if (sessions.length === 0) return 0;
    return Math.floor(Math.random() * sessions.length);
  }

  static getRandomDifficulty(difficulties: DifficultyKey[], weights?: Record<DifficultyKey, number>): DifficultyKey {
    if (difficulties.length === 0) return "facile";
    
    if (!weights) {
      return difficulties[Math.floor(Math.random() * difficulties.length)];
    }

    // Create weighted array
    const weightedDifficulties: DifficultyKey[] = [];
    difficulties.forEach(diff => {
      const weight = weights[diff] || 1;
      const count = Math.round(weight * 10);
      for (let i = 0; i < count; i++) {
        weightedDifficulties.push(diff);
      }
    });

    return weightedDifficulties[Math.floor(Math.random() * weightedDifficulties.length)];
  }
}
