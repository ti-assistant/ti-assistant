type ObjectiveType = "STAGE ONE" | "STAGE TWO" | "SECRET" | "OTHER";

interface BaseObjective {
  description: string;
  expansion: Expansion;
  id: ObjectiveId;
  name: string;
  points: number;
  type: ObjectiveType;
  // Optional
  max?: number;
  omega?: {
    description: string;
    expansion: Expansion;
    name: string;
  };
  phase?: Phase;
  repeatable?: boolean;
  replaces?: ObjectiveId;
}

interface GameObjective {
  factions?: string[];
  scorers?: FactionId[];
  selected?: boolean;
  keyedScorers?: Partial<Record<FactionId, FactionId[]>>;
  revealOrder?: number;
  points?: number;
}

type Objective = BaseObjective & GameObjective;

type ObjectiveId =
  | BaseGame.ObjectiveId
  | ProphecyOfKings.ObjectiveId
  | CodexFour.ObjectiveId;
