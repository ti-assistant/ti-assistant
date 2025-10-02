namespace ThundersEdge {
  type BreakthroughId =
    | "Psychospore" // Arborec
    | "Resonance Generator" // Crimson Rebellion
    | "Deorbit Barrage" // Clan of Saar
    | "Visionaria Select" // Deepwrought Scholarate
    | "Stellar Genesis" // Embers of Muaat
    | "Bellum Gloriosum" // Federation of Sol
    | "The Sowing" // Firmament
    | "The Icon" // Last Bastion
    | "Fealty Uplink" // L1Z1X Mindnet
    | "Absolute Synergy" // Naaz-Rokha Alliance
    | "The Reaping" // Obsidian
    | "Data Skimmer" // Ral Nel Consortium
    | "N'orr Supremacy" // Sardakk N'orr
    | "Al'raith Ix Ianovar" // Vuil'raith Cabal
    | "Imperator" // Winnu
    | "Yin Ascendant"; // Yin Brotherhood

  type ComponentId = "Avernus" | "Share Knowledge" | "Puppets of the Blade";

  type FactionId =
    | "Crimson Rebellion"
    | "Deepwrought Scholarate"
    | "Firmament"
    | "Last Bastion"
    | "Obsidian"
    | "Ral Nel Consortium";

  type LeaderId =
    // Crimson Rebellion
    | "Ahk Ravin"
    | "Ahk Siever"
    | "TODO: Fragment Reality"
    // Deepwrought Scholarate
    | "Doctor Carrina"
    | "Aello"
    | "Ta Zern (Deepwrought)"
    // Firmament
    | "Myru Vos"
    | "Captain Aroz"
    | "TODO: The Blade Beckons"
    // Last Bastion
    | "Dame Briar"
    | "Nip and Tuck"
    | "Entity 4X41A Apollo"
    // Obsidian
    | "Vos Hollow"
    | "Aroz Hollow"
    | "TODO: The Blade Revealed"
    // Ral Nel Consortium
    | "Kan Kip Rel"
    | "Watchful Ojz"
    | "TODO: Name";

  type PlanetId =
    | "Avernus"
    | "Ikatena"
    | "Cocytus"
    | "Lethe"
    | "Phlegethon"
    | "Styx"
    | "Thunder's Edge";

  type ObjectiveId = "Styx";

  // TODO: Change if fracture has actual system numbers.
  type SystemId = 666 | 667 | 668; // Used for fracture

  type TechId =
    // Crimson Rebellion
    | "Subatomic Splicer"
    // Deepwrought Scholarate
    | "Hydrothermal Mining"
    | "Radical Advancement"
    // Firmament
    | "Neural Parasite"
    | "Planesplitter"
    // Last Bastion
    | "Proxima Targeting VI"
    // Obsidian
    | "Planesplitter (Obsidian)"
    | "Neural Parasite (Obsidian)"
    // Ral Nel Consortium
    | "Linkship II"
    | "Nanomachines";

  type EventId =
    | "Age of Fighters"
    | "Call of the Void"
    | "Civilized Society"
    | "Dangerous Wilds"
    | "Hidden Agenda"
    | "Stellar Atomics";
}
