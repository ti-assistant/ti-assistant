namespace ProphecyOfKings {
  type ActionCardId =
    | "Archaeological Expedition"
    | "Confounding Legal Text"
    | "Coup d'Etat"
    | "Deadly Plot"
    | "Decoy Operation"
    | "Diplomatic Pressure"
    | "Divert Funding"
    | "Exploration Probe"
    | "Manipulate Investments"
    | "Nav Suite"
    | "Refit Troops"
    | "Reveal Prototype"
    | "Reverse Engineer"
    | "Rout"
    | "Scuttle"
    | "Seize Artifact"
    | "Waylay";

  type AgendaId =
    | "Armed Forces Standardization"
    | "Articles of War"
    | "Checks and Balances"
    | "Covert Legislation"
    | "Galactic Crisis Pact"
    | "Minister of Antiques"
    | "Nexus Sovereignty"
    | "Political Censure"
    | "Rearmament Agreement"
    | "Research Grant Reallocation"
    | "Search Warrant";

  type AttachmentId =
    | "Biotic Research Facility"
    | "Cybernetic Research Facility"
    | "Dyson Sphere"
    | "Lazax Survivors"
    | "Mining World"
    | "Paradise World"
    | "Propulsion Research Facility"
    | "Rich World"
    | "Terraform"
    | "Tomb of Emphidia"
    | "Ul the Progenitor"
    | "Warfare Research Facility";

  type ComponentId =
    | "Black Market Forgery"
    | "Blood Pact"
    | "Dark Pact"
    | "Enigmatic Device"
    | "Fabrication"
    | "Gain Relic"
    | "Sling Relay"
    | "Terraform"
    | "Vortex";

  type FactionId =
    | "Argent Flight"
    | "Empyrean"
    | "Mahact Gene-Sorcerers"
    | "Naaz-Rokha Alliance"
    | "Nomad"
    | "Titans of Ul"
    | "Vuil'raith Cabal";

  type LeaderId =
    | "2RAM"
    | "Acamar"
    | "Adjudicator Ba'al"
    | "Airo Shir Aur"
    | "Ahk-Syl Siven"
    | "Artuno the Betrayer"
    | "Berekar Berekon"
    | "Brother Milor"
    | "Brother Omar"
    | "Captain Mendosa"
    | "Carth of Golden Sands"
    | "Claire Gibson"
    | "Conservator Procyon"
    | "Dannel of the Tenth"
    | "Darktalon Treilla"
    | "Dart and Tai"
    | "Dirzuga Rophal"
    | "Doctor Sucaban"
    | "Elder Qanoj"
    | "Emissary Taivra"
    | "Evelyn Delouis"
    | "Field Marshal Mercer"
    | "Garv and Gunn"
    | "Ggrocuto Rinn"
    | "G'hom Sek'kus"
    | "Gila the Silvertongue"
    | "Gurno Aggero"
    | "Harrugh Gefhara"
    | "Hesh and Prit"
    | "I48S"
    | "Il Na Viroset"
    | "Ipswitch Loose Cannon"
    | "It Feeds on Carrion"
    | "Jace X 4th Air Legion"
    | "Jae Mir Kan"
    | "Kyver Blade and Key"
    | "Letani Miasmiala"
    | "Letani Ospha"
    | "M'aban"
    | "Magmus"
    | "Mathis Mathinus"
    | "Mirik Aun Sissiri"
    | "Navarch Feng"
    | "Nekro Acidos"
    | "Nekro Malleon"
    | "Rear Admiral Farran"
    | "Rickar Rickani"
    | "Riftwalker Meian"
    | "Rin The Master's Legacy"
    | "Rowl Sarrig"
    | "Sai Seravus"
    | "Sh'val Harbinger"
    | "So Ata"
    | "Ssruu"
    | "S'Ula Mentarion"
    | "Suffi An"
    | "Ta Zern"
    | "Tellurian"
    | "That Which Molds Flesh"
    | "The Helmsman"
    | "The Oracle"
    | "The Stillness of Stars"
    | "The Thundarian"
    | "T'ro"
    | "Trrakan Aun Zulok"
    | "Trillossa Aun Mirik"
    | "Tungstantus"
    | "Ul the Progenitor"
    | "Umbat"
    | "UNITDSGNFLAYESH"
    | "Viscount Unlenn"
    | "Xuange"
    | "Xxekir Grom"
    | "Z'eu";

  type ObjectiveId =
    | "Achieve Supremacy"
    | "Amass Wealth"
    | "Become a Legend"
    | "Become a Martyr"
    | "Betray a Friend"
    | "Brave the Void"
    | "Build Defenses"
    | "Command an Armada"
    | "Construct Massive Cities"
    | "Control the Borderlands"
    | "Darken the Skies"
    | "Defy Space and Time"
    | "Demonstrate Your Power"
    | "Destroy Heretical Works"
    | "Dictate Policy"
    | "Discover Lost Outposts"
    | "Drive the Debate"
    | "Engineer a Marvel"
    | "Establish Hegemony"
    | "Explore Deep Space"
    | "Fight With Precision"
    | "Foster Cohesion"
    | "Hoard Raw Materials"
    | "Hold Vast Reserves"
    | "Improve Infrastructure"
    | "Make History"
    | "Mechanize the Military"
    | "Occupy the Fringe"
    | "Patrol Vast Territories"
    | "Political Censure"
    | "Populate the Outer Rim"
    | "Produce En Masse"
    | "Protect the Border"
    | "Prove Endurance"
    | "Push Boundaries"
    | "Raise a Fleet"
    | "Reclaim Ancient Monuments"
    | "Rule Distant Lands"
    | "Seize an Icon"
    | "Stake your Claim"
    | "Strengthen Bonds"
    | "Tomb + Crown of Emphidia";

  type PlanetId =
    | "Abaddon"
    | "Accoen"
    | "Acheron"
    | "Alio Prima"
    | "Ang"
    | "Archon Vail"
    | "Arcturus"
    | "Ashtroth"
    | "Atlas"
    | "Avar"
    | "Ba'kal"
    | "Cealdri"
    | "Cormund"
    | "Elysium"
    | "Everra"
    | "Hope's End"
    | "Ixth"
    | "Jeol Ir"
    | "Kraag"
    | "Lisis"
    | "Loki"
    | "Mallice"
    | "Mirage"
    | "Naazir"
    | "Perimeter"
    | "Primor"
    | "Rigel I"
    | "Rigel II"
    | "Rigel III"
    | "Rokha"
    | "Sem-Lore"
    | "Siig"
    | "The Dark"
    | "Valk"
    | "Vega Major"
    | "Vega Minor"
    | "Velnor"
    | "Vorhal"
    | "Xanhact"
    | "Ylir";

  type RelicId =
    | "Dominus Orb"
    | "Maw of Worlds"
    | "Scepter of Emelpar"
    | "Shard of the Throne"
    | "Stellar Converter"
    | "The Codex"
    | "The Crown of Emphidia"
    | "The Crown of Thalnos"
    | "The Obsidian"
    | "The Prophet's Tears";

  type SystemId =
    | 52
    | 53
    | 54
    | 55
    | 56
    | 57
    | 58
    | 59
    | 60
    | 61
    | 62
    | 63
    | 64
    | 65
    | 66
    | 67
    | 68
    | 69
    | 70
    | 71
    | 72
    | 73
    | 74
    | 75
    | 76
    | 77
    | 78
    | 79
    | 80
    | 81
    | "82A"
    | "82B"
    | "83A"
    | "83B"
    | "84A"
    | "84B"
    | "85A"
    | "85B"
    | "86A"
    | "86B"
    | "87A"
    | "87B"
    | "88A"
    | "88B"
    | "89A"
    | "89B"
    | "90A"
    | "90B"
    | "91A"
    | "91B";

  type TechId =
    | "AI Development Algorithm"
    | "Aerie Hololattice"
    | "Aetherstream"
    | "Bio-Stims"
    | "Crimson Legionnaire II"
    | "Dark Energy Tap"
    | "Dimensional Tear II"
    | "Genetic Recombination"
    | "Hel Titan II"
    | "Memoria II"
    | "Pre-Fab Arcologies"
    | "Predictive Intelligence"
    | "Psychoarchaeology"
    | "Saturn Engine II"
    | "Scanlink Drone Network"
    | "Self Assembly Routines"
    | "Sling Relay"
    | "Strike Wing Alpha II"
    | "Supercharge"
    | "Temporal Command Suite"
    | "Voidwatch"
    | "Vortex";
}
