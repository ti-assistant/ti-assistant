namespace BaseGame {
  type AgendaId =
    | "Anti-Intellectual Revolution"
    | "Archived Secret"
    | "Arms Reduction"
    | "Clandestine Operations"
    | "Classified Document Leaks"
    | "Colonial Redistribution"
    | "Committee Formation"
    | "Compensated Disarmament"
    | "Conventions of War"
    | "Core Mining"
    | "Demilitarized Zone"
    | "Economic Equality"
    | "Enforced Travel Ban"
    | "Executive Sanctions"
    | "Fleet Regulations"
    | "Holy Planet of Ixth"
    | "Homeland Defense Act"
    | "Imperial Arbiter"
    | "Incentive Program"
    | "Ixthian Artifact"
    | "Judicial Abolishment"
    | "Minister of Commerce"
    | "Minister of Exploration"
    | "Minister of Industry"
    | "Minister of Peace"
    | "Minister of Policy"
    | "Minister of Sciences"
    | "Minister of War"
    | "Miscount Disclosed"
    | "Mutiny"
    | "New Constitution"
    | "Prophecy of Ixth"
    | "Public Execution"
    | "Publicize Weapon Schematics"
    | "Regulated Conscription"
    | "Representative Government"
    | "Research Team: Biotic"
    | "Research Team: Cybernetic"
    | "Research Team: Propulsion"
    | "Research Team: Warfare"
    | "Seed of an Empire"
    | "Senate Sanctuary"
    | "Shard of the Throne"
    | "Shared Research"
    | "Swords to Plowshares"
    | "Terraforming Initiative"
    | "The Crown of Emphidia"
    | "The Crown of Thalnos"
    | "Unconventional Measures"
    | "Wormhole Reconstruction"
    | "Wormhole Research";

  type AttachmentId =
    | "Core Mining"
    | "Demilitarized Zone"
    | "Holy Planet of Ixth"
    | "Research Team: Biotic"
    | "Research Team: Cybernetic"
    | "Research Team: Propulsion"
    | "Research Team: Warfare"
    | "Senate Sanctuary"
    | "Terraforming Initiative";

  type ComponentId =
    | "Cripple Defenses"
    | "Economic Initiative"
    | "Fires of the Gashlai"
    | "Focused Research"
    | "Frontline Deployment"
    | "Ghost Ship"
    | "Industrial Initiative"
    | "Insubordination"
    | "Lazax Gate Folding"
    | "Lucky Shot"
    | "Mageon Implants"
    | "Mining Initiative"
    | "Orbital Drop"
    | "Plague"
    | "Production Biomes"
    | "Promise of Protection"
    | "Reactor Meltdown"
    | "Repeal Law"
    | "Rise of a Messiah"
    | "Signal Jamming"
    | "Spy"
    | "Stall Tactics"
    | "Star Forge"
    | "Stymie"
    | "Tactical Bombardment"
    | "The Inferno"
    | "Trade Convoys"
    | "Unexpected Action"
    | "Unstable Planet"
    | "Uprising"
    | "War Effort"
    | "X-89 Bacterial Weapon";

  type FactionId =
    | "Arborec"
    | "Barony of Letnev"
    | "Clan of Saar"
    | "Embers of Muaat"
    | "Emirates of Hacan"
    | "Federation of Sol"
    | "Ghosts of Creuss"
    | "L1Z1X Mindnet"
    | "Mentak Coalition"
    | "Naalu Collective"
    | "Nekro Virus"
    | "Sardakk N'orr"
    | "Universities of Jol-Nar"
    | "Winnu"
    | "Xxcha Kingdom"
    | "Yin Brotherhood"
    | "Yssaril Tribes";

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
    | "Unveil Flagship";

  type PlanetId =
    | "000"
    | "Abyz"
    | "Arc Prime"
    | "Archon Ren"
    | "Archon Tau"
    | "Arinam"
    | "Arnor"
    | "Arretze"
    | "Bereg"
    | "Centauri"
    | "Corneeq"
    | "Creuss"
    | "Dal Bootha"
    | "Darien"
    | "Druaa"
    | "Fria"
    | "Gral"
    | "Hercant"
    | "Jol"
    | "Jord"
    | "Kamdorn"
    | "Lazar"
    | "Lirta IV"
    | "Lisis II"
    | "Lodor"
    | "Lor"
    | "Maaluuk"
    | "Mecatol Rex"
    | "Meer"
    | "Mehar Xull"
    | "Mellon"
    | "Moll Primus"
    | "Mordai II"
    | "Muaat"
    | "Nar"
    | "Nestphar"
    | "New Albion"
    | "Quann"
    | "Qucen'n"
    | "Quinarra"
    | "Ragh"
    | "Rarron"
    | "Resculon"
    | "Retillion"
    | "Sakulag"
    | "Saudor"
    | "Shalloq"
    | "Starpoint"
    | "Tar'Mann"
    | "Tequ'ran"
    | "Thibah"
    | "Torkan"
    | "Tren'lak"
    | "Vefut II"
    | "Wellon"
    | "Winnu"
    | "Wren Terra"
    | "Xxehan"
    | "Zohbat";

  type StrategyCardId =
    | "Leadership"
    | "Diplomacy"
    | "Politics"
    | "Construction"
    | "Trade"
    | "Warfare"
    | "Technology"
    | "Imperial";

  type SystemId =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16
    | 17
    | 18
    | 19
    | 20
    | 21
    | 22
    | 23
    | 24
    | 25
    | 26
    | 27
    | 28
    | 29
    | 30
    | 31
    | 32
    | 33
    | 34
    | 35
    | 36
    | 37
    | 38
    | 39
    | 40
    | 41
    | 42
    | 43
    | 44
    | 45
    | 46
    | 47
    | 48
    | 49
    | 50
    | 51;

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
    | "Yin Spinner";
}
