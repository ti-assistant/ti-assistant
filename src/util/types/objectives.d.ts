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
  | "Adapt New Strategies"
  | "Become the Gatekeeper"
  | "Centralize Galactic Trade"
  | "Conquer the Weak"
  | "Control the Region"
  | "Corner the Market"
  | "The Crown of Emphidia"
  | "Custodians Token"
  | "Cut Supply Lines"
  | "Destroy Their Greatest Ship"
  | "Develop Weaponry"
  | "Diversify Research"
  | "Erect a Monument"
  | "Establish a Perimeter"
  | "Expand Borders"
  | "Forge an Alliance"
  | "Form Galactic Brain Trust"
  | "Form a Spy Network"
  | "Found Research Outposts"
  | "Found a Golden Age"
  | "Fuel the War Machine"
  | "Galvanize the People"
  | "Gather a Mighty Fleet"
  | "Holy Planet of Ixth"
  | "Imperial Point"
  | "Imperial Rider"
  | "Intimidate Council"
  | "Lead from the Front"
  | "Learn the Secrets of the Cosmos"
  | "Make an Example of Their World"
  | "Manipulate Galactic Law"
  | "Master the Laws of Physics"
  | "Master the Sciences"
  | "Mine Rare Metals"
  | "Monopolize Production"
  | "Mutiny"
  | "Negotiate Trade Routes"
  | "Occupy the Seat of the Empire"
  | "Revolutionize Warfare"
  | "Seed of an Empire"
  | "Shard of the Throne"
  | "Spark a Rebellion"
  | "Subdue the Galaxy"
  | "Support for the Throne"
  | "Sway the Council"
  | "Threaten Enemies"
  | "Turn Their Fleets to Dust"
  | "Unify the Colonies"
  | "Unveil Flagship"
  | ProphecyOfKings.ObjectiveId
  | CodexFour.ObjectiveId;
