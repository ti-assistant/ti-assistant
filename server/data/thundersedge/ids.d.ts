namespace ThundersEdge {
  type ActionCardId =
    | "Black Market Dealings"
    | "Brilliance"
    | "Crash Landing"
    | "Crisis"
    | "Exchange Program"
    | "Extreme Duress"
    | "Lie in Wait"
    | "Mercenary Contract"
    | "Overrule"
    | "Pirate Contract"
    | "Pirate Fleet"
    | "Puppets on a String"
    | "Rescue"
    | "Strategize";

  type BreakthroughId =
    | "Psychospore" // Arborec
    | "Wing Transfer" // Argent Flight
    | "Gravleash Maneuvers" // Barony of Letnev
    | "Resonance Generator" // Crimson Rebellion
    | "Deorbit Barrage" // Clan of Saar
    | "IIHQ Modernization" // Council Keleres
    | "Visionaria Select" // Deepwrought Scholarate
    | "Stellar Genesis" // Embers of Muaat
    | "Auto-Factories" // Emirates of Hacan
    | "Void Tether" // Empyrean
    | "Bellum Gloriosum" // Federation of Sol
    | "The Sowing" // Firmament
    | "Particle Synthesis" // Ghosts of Creuss
    | "The Icon" // Last Bastion
    | "Fealty Uplink" // L1Z1X Mindnet
    | "Vaults of the Heir" // Mahact Gene-Sorcerers
    | "The Table's Grace" // Mentak Coalition
    | "Mindsieve" // Naalu Collective
    | "Absolute Synergy" // Naaz-Rokha Alliance
    | "Valefar Assimilator Z" // Nekro Virus
    | "Thunder's Paradox" // Nomad
    | "The Reaping" // Obsidian
    | "Data Skimmer" // Ral Nel Consortium
    | "N'orr Supremacy" // Sardakk N'orr
    | "Slumberstate Computing" // Titans of Uls
    | "Specialized Compounds" // Universities of Jol-Nar
    | "Al'raith Ix Ianovar" // Vuil'raith Cabal
    | "Imperator" // Winnu
    | "Archon's Gift" // Xxcha Kingdom
    | "Yin Ascendant" // Yin Brotherhood
    | "Deepgloom Executable" // Yssaril Tribes
    | "Dummy Breakthrough"; // Used for DS factions.

  type ComponentId =
    | "Avernus"
    | "Conventions of War Abandoned"
    | "Mercenaries for Hire"
    | "Share Knowledge"
    | "Stellar Atomics"
    | "Puppets of the Blade";

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
    | "Sharsiss"
    // Last Bastion
    | "Dame Briar"
    | "Nip and Tuck"
    | "Entity 4X41A Apollo"
    // Obsidian
    | "Vos Hollow"
    | "Aroz Hollow"
    | "Sharsiss Hollow"
    // Ral Nel Consortium
    | "Kan Kip Rel"
    | "Watchful Ojz"
    | "TODO: Name";

  type PlanetId =
    // 97
    | "Faunus"
    // 98
    | "Garbozia"
    // 99
    | "Emelpar"
    // 100
    | "Tempesta"
    // 101
    | "Olergodt"
    // 102
    | "Andeara"
    // 103
    | "ViraPics III"
    // 104
    | "Lesab"
    // 105
    | "New Terra"
    | "Tinnes"
    // 106
    | "Cresius"
    | "Lazul Rex"
    // 107
    | "Tiamat"
    | "Hercalor"
    // 108
    | "Kostboth"
    | "Capha"
    // 109
    | "Bellatrix"
    | "Tsion Station"
    // 110
    | "Horizon"
    | "Elnath"
    | "Luthien VI"
    // 111
    | "Tarana"
    | "Oluz Station"
    // 115
    | "Industrex"
    // 116
    | "Lemox"
    // 117
    | "The Watchtower"

    // Factions
    // Embers of Muaat
    | "Avernus"
    // Last Bastion - 92
    | "Ordinian"
    | "Revelation"
    // Ral Nel Consortium - 93
    | "Mez Lo Orz Fei Zsha"
    | "Rep Lo Orz Oet"
    // Deepwrought Scholarate - 95
    | "Ikatena"
    // Firmament/Obsidian - 96A/96B
    | "Cronos"
    | "Tallin"
    | "Cronos Hollow"
    | "Tallin Hollow"
    // Crimson Rebellion
    | "Ahk Creuxx"
    // Fracture
    | "Cocytus"
    | "Lethe"
    | "Phlegethon"
    | "Styx"
    // Special
    | "Thunder's Edge"
    // Oceans
    | "Deep Abyss"
    | "Brine Pool"
    | "Coral Reef"
    | "Ice Shelf"
    | "Lost Fleet"
    // Synthetic
    | "The Triad";

  type ObjectiveId = "Styx" | "The Silver Flame";

  type RelicId =
    | "Heart of Ixth"
    | "Lightrail Ordnance"
    | "Metali Void Armaments"
    | "Metali Void Shielding"
    | "The Quantumcore"
    | "The Silver Flame"
    | "The Triad";

  type SystemId =
    | 92
    | 93
    | 94
    | 95
    | "96A"
    | "96B"
    | 97
    | 98
    | 99
    | 100
    | 101
    | 102
    | 103
    | 104
    | 105
    | 106
    | 107
    | 108
    | 109
    | 110
    | 111
    | 112
    | 115
    | 116
    | 117
    | 118
    | "119A"
    | "119B"
    | "120A"
    | "120B"
    | "121A"
    | "121B"
    | "122A"
    | "122B"
    | "123A"
    | "123B"
    | "124A"
    | "124B"
    | 666
    | 667
    | 668; // Used for fracture

  type TechId =
    // Council Keleres
    | "Executive Order"
    // Crimson Rebellion
    | "Subatomic Splicer"
    | "Exile II"
    // Deepwrought Scholarate
    | "Hydrothermal Mining"
    | "Radical Advancement"
    // Firmament
    | "Neural Parasite"
    | "Planesplitter"
    // Last Bastion
    | "Proxima Targeting VI"
    | "4X4IC Helios VI II"
    // Obsidian
    | "Planesplitter (Obsidian)"
    | "Neural Parasite (Obsidian)"
    // Ral Nel Consortium
    | "Linkship II"
    | "Nanomachines";

  type EventId =
    | "Advent of the War Sun"
    | "Age of Fighters"
    | "Call of the Void"
    | "Civilized Society"
    | "Conventions of War Abandoned"
    | "Cosmic Phenomenae"
    | "Cultural Exchange Program"
    | "Dangerous Wilds"
    | "Hidden Agenda"
    | "Mercenaries for Hire"
    | "Monuments to the Ages"
    | "Rapid Mobilization"
    | "Stellar Atomics"
    | "Weird Wormholes"
    | "Wild Wild Galaxy"
    | "Zealous Orthodoxy";
}
