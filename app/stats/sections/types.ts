export type HistogramData = Record<number, number>;

export interface GameCounts {
  games: number;
  wins: number;
  points: number;
}

export type GameCountsWithHistogram = GameCounts & { histogram: HistogramData };

export type ObjectiveGameCounts = GameCounts & { scored: number };

export interface FactionSummary {
  // Metadata
  id: FactionId;
  name: string;

  games: GameCountsWithHistogram;
  techGames: GameCounts;
  objectiveGames: GameCounts;
  planetGames: GameCounts;

  techs: Partial<Record<TechId, GameCounts>>;

  objectives: Partial<Record<ObjectiveId, ObjectiveGameCounts>>;

  scoredSecrets: number;
  imperialPoints: number;

  planetsByRound: Record<
    number,
    { all: number; home: number; mecatol: number }
  >;
  lostPlanetsByRound: Record<
    number,
    { all: number; home: number; mecatol: number }
  >;
  aggressionScore: number;
}
