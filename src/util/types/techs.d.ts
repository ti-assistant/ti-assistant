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
  omega?: OmegaTech[];
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
  omega?: OmegaTech[];
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
  | "AI Development Algorithm"
  | "Advanced Carrier II"
  | "Aerie Hololattice"
  | "Aetherstream"
  | "Agency Supply Network"
  | "Antimass Deflectors"
  | "Assault Cannon"
  | "Bio-Stims"
  | "Bioplasmosis"
  | "Carrier II"
  | "Chaos Mapping"
  | "Crimson Legionnaire II"
  | "Cruiser II"
  | "Daxcive Animators"
  | "Dark Energy Tap"
  | "Destroyer II"
  | "Dimensional Splicer"
  | "Dimensional Tear II"
  | "Dreadnought II"
  | "Duranium Armor"
  | "E-Res Siphons"
  | "Exotrireme II"
  | "Fighter II"
  | "Fleet Logistics"
  | "Floating Factory II"
  | "Genetic Recombination"
  | "Graviton Laser System"
  | "Gravity Drive"
  | "Hegemonic Trade Policy"
  | "Hel Titan II"
  | "Hybrid Crystal Fighter II"
  | "Hyper Metabolism"
  | "IIHQ Modernization"
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
  | "Memoria II"
  | "Mirror Computing"
  | "Neural Motivator"
  | "Neuroglaive"
  | "Non-Euclidean Shielding"
  | "Nullification Field"
  | "PDS II"
  | "Plasma Scoring"
  | "Pre-Fab Arcologies"
  | "Predictive Intelligence"
  | "Production Biomes"
  | "Prototype War Sun II"
  | "Psychoarchaeology"
  | "Quantum Datahub Node"
  | "Salvage Operations"
  | "Sarween Tools"
  | "Saturn Engine II"
  | "Scanlink Drone Network"
  | "Self Assembly Routines"
  | "Sling Relay"
  | "Space Dock II"
  | "Spacial Conduit Cylinder"
  | "Spec Ops II"
  | "Strike Wing Alpha II"
  | "Super-Dreadnought II"
  | "Supercharge"
  | "Temporal Command Suite"
  | "Transit Diodes"
  | "Transparasteel Plating"
  | "Valkyrie Particle Weave"
  | "Voidwatch"
  | "Vortex"
  | "War Sun"
  | "Wormhole Generator"
  | "X-89 Bacterial Weapon"
  | "Yin Spinner"
  | DiscordantStars.TechId;
