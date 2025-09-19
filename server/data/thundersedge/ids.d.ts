namespace ThundersEdge {
  type BreakthroughId =
    | "Psychospore" // Arborec
    | "Stellar Genesis" // Embers of Muaat
    | "Bellum Gloriosum" // Federation of Sol
    | "Fealty Uplink" // L1Z1X Mindnet
    | "N'orr Supremacy" // Sardakk N'orr
    | "Al'raith Ix Ianovar" // Vuil'raith Cabal
    | "Yin Ascendant"; // Yin Brotherhood

  type FactionId = "Last Bastion";

  type PlanetId =
    | "Cocytus"
    | "Lethe"
    | "Phlegethon"
    | "Styx"
    | "Thunder's Edge";

  type ObjectiveId = "Styx";

  // TODO: Change if fracture has actual system numbers.
  type SystemId = 666 | 667 | 668; // Used for fracture

  type EventId =
    | "Age of Fighters"
    | "Call of the Void"
    | "Civilized Society"
    | "Dangerous Wilds"
    | "Hidden Agenda"
    | "Stellar Atomics";
}
