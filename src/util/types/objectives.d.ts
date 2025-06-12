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
  | "Achieve Supremacy"
  | "Adapt New Strategies"
  | "Amass Wealth"
  | "Become a Legend"
  | "Become a Martyr"
  | "Become the Gatekeeper"
  | "Betray a Friend"
  | "Brave the Void"
  | "Build Defenses"
  | "Centralize Galactic Trade"
  | "Command an Armada"
  | "Conquer the Weak"
  | "Construct Massive Cities"
  | "Control the Borderlands"
  | "Control the Region"
  | "Corner the Market"
  | "The Crown of Emphidia"
  | "Custodians Token"
  | "Cut Supply Lines"
  | "Darken the Skies"
  | "Defy Space and Time"
  | "Demonstrate Your Power"
  | "Destroy Heretical Works"
  | "Destroy Their Greatest Ship"
  | "Develop Weaponry"
  | "Dictate Policy"
  | "Discover Lost Outposts"
  | "Diversify Research"
  | "Drive the Debate"
  | "Engineer a Marvel"
  | "Erect a Monument"
  | "Establish Hegemony"
  | "Establish a Perimeter"
  | "Expand Borders"
  | "Explore Deep Space"
  | "Fight With Precision"
  | "Forge an Alliance"
  | "Form Galactic Brain Trust"
  | "Form a Spy Network"
  | "Foster Cohesion"
  | "Found Research Outposts"
  | "Found a Golden Age"
  | "Fuel the War Machine"
  | "Galvanize the People"
  | "Gather a Mighty Fleet"
  | "Hoard Raw Materials"
  | "Hold Vast Reserves"
  | "Holy Planet of Ixth"
  | "Imperial Point"
  | "Imperial Rider"
  | "Improve Infrastructure"
  | "Intimidate Council"
  | "Lead from the Front"
  | "Learn the Secrets of the Cosmos"
  | "Make History"
  | "Make an Example of Their World"
  | "Manipulate Galactic Law"
  | "Master the Laws of Physics"
  | "Master the Sciences"
  | "Mechanize the Military"
  | "Mine Rare Metals"
  | "Monopolize Production"
  | "Mutiny"
  | "Negotiate Trade Routes"
  | "Occupy the Fringe"
  | "Occupy the Seat of the Empire"
  | "Patrol Vast Territories"
  | "Political Censure"
  | "Populate the Outer Rim"
  | "Produce En Masse"
  | "Protect the Border"
  | "Prove Endurance"
  | "Push Boundaries"
  | "Raise a Fleet"
  | "Reclaim Ancient Monuments"
  | "Revolutionize Warfare"
  | "Rule Distant Lands"
  | "Seed of an Empire"
  | "Seize an Icon"
  | "Shard of the Throne"
  | "Spark a Rebellion"
  | "Stake your Claim"
  | "Strengthen Bonds"
  | "Subdue the Galaxy"
  | "Support for the Throne"
  | "Sway the Council"
  | "Threaten Enemies"
  | "Tomb + Crown of Emphidia"
  | "Turn Their Fleets to Dust"
  | "Unify the Colonies"
  | "Unveil Flagship"
  | CodexFour.ObjectiveId;
