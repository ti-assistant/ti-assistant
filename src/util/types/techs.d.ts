type TechType = "RED" | "BLUE" | "YELLOW" | "GREEN" | "UPGRADE";

interface UnitStats {
  capacity?: number;
  combat?: number | string;
  cost?: number | string;
  move?: number;
}

interface OmegaTech {
  description: string;
  expansion: Expansion;
  name: string;
}

interface BaseNormalTech {
  description: string;
  expansion: Expansion;
  faction?: FactionId;
  id: TechId;
  name: string;
  omegas?: OmegaTech[];
  prereqs: TechType[];
  type: "RED" | "GREEN" | "BLUE" | "YELLOW";
}

interface BaseUpgradeTech {
  abilities: string[];
  description?: string;
  expansion: Expansion;
  faction?: FactionId;
  id: TechId;
  name: string;
  omegas?: OmegaTech[];
  prereqs: TechType[];
  replaces?: TechId;
  stats: UnitStats;
  type: "UPGRADE";
}

type BaseTech = BaseNormalTech | BaseUpgradeTech;

interface GameTech {
  ready?: boolean;
}

type Tech = BaseTech & GameTech;

type TechId =
  | "Advanced Carrier II"
  | "Antimass Deflectors"
  | "Assault Cannon"
  | "Bioplasmosis"
  | "Carrier II"
  | "Chaos Mapping"
  | "Cruiser II"
  | "Daxcive Animators"
  | "Destroyer II"
  | "Dimensional Splicer"
  | "Dreadnought II"
  | "Duranium Armor"
  | "E-Res Siphons"
  | "Exotrireme II"
  | "Fighter II"
  | "Fleet Logistics"
  | "Floating Factory II"
  | "Graviton Laser System"
  | "Gravity Drive"
  | "Hegemonic Trade Policy"
  | "Hybrid Crystal Fighter II"
  | "Hyper Metabolism"
  | "Impulse Core"
  | "Infantry II"
  | "Inheritance Systems"
  | "Instinct Training"
  | "Integrated Economy"
  | "L4 Disruptors"
  | "Lazax Gate Folding"
  | "Letani Warrior II"
  | "LightWave Deflector"
  | "Magen Defense Grid"
  | "Mageon Implants"
  | "Magmus Reactor"
  | "Mirror Computing"
  | "Neural Motivator"
  | "Neuroglaive"
  | "Non-Euclidean Shielding"
  | "Nullification Field"
  | "PDS II"
  | "Plasma Scoring"
  | "Production Biomes"
  | "Prototype War Sun II"
  | "Quantum Datahub Node"
  | "Salvage Operations"
  | "Sarween Tools"
  | "Space Dock II"
  | "Spacial Conduit Cylinder"
  | "Spec Ops II"
  | "Super-Dreadnought II"
  | "Transit Diodes"
  | "Transparasteel Plating"
  | "Valkyrie Particle Weave"
  | "War Sun"
  | "Wormhole Generator"
  | "X-89 Bacterial Weapon"
  | "Yin Spinner"
  | ProphecyOfKings.TechId
  | CodexThree.TechId
  | DiscordantStars.TechId;
