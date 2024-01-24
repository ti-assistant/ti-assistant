import { DISCORDANT_STARS_COMPONENTS } from "./discordantstars/components";

export const BASE_COMPONENTS: Record<
  ComponentId,
  BaseComponent | BaseTechComponent
> = {
  "Archaeological Expedition": {
    description:
      "Reveal the top 3 cards of an exploration deck that matches a planet you control; gain any relic fragments that you reveal and discard the rest",
    expansion: "POK",
    id: "Archaeological Expedition",
    name: "Archaeological Expedition",
    type: "CARD",
  },
  "Black Market Forgery": {
    description:
      "Purge 2 of your relic fragments of the same type to gain 1 relic.\n\nThen return this card to the Naaz-Rokha player.",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    id: "Black Market Forgery",
    name: "Black Market Forgery",
    type: "PROMISSORY",
  },
  "Blood Pact": {
    description:
      "Place this card face up in your play area.\n\nWhen you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome.\n\nIf you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
    expansion: "POK",
    faction: "Empyrean",
    id: "Blood Pact",
    name: "Blood Pact",
    type: "PROMISSORY",
  },
  "Cripple Defenses": {
    description: "Choose 1 planet. Destroy each PDS on that planet",
    expansion: "BASE",
    id: "Cripple Defenses",
    name: "Cripple Defenses",
    type: "CARD",
  },
  "Dark Pact": {
    description:
      "Place this card face up in your play area.\n\nWhen you give a number of commodities to the Empyrean player equal to your maximum commodity value, you each gain 1 trade good.\n\nIf you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
    expansion: "POK",
    faction: "Empyrean",
    id: "Dark Pact",
    name: "Dark Pact",
    type: "PROMISSORY",
  },
  "Divert Funding": {
    description:
      "Return a non-unit upgrade, non-faction technology that you own to your technology deck. Then, research another technology",
    expansion: "POK",
    id: "Divert Funding",
    name: "Divert Funding",
    type: "CARD",
  },
  "Economic Initiative": {
    description: "Ready each cultural planet you control",
    expansion: "BASE",
    id: "Economic Initiative",
    name: "Economic Initiative",
    type: "CARD",
  },
  "Enigmatic Device": {
    description:
      "You may spend 6 resources and purge this card to research 1 technology",
    expansion: "POK",
    id: "Enigmatic Device",
    name: "Enigmatic Device",
    type: "EXPLORATION",
  },
  "Exploration Probe": {
    description:
      "Explore a frontier token that is in or adjacent to a system that contains 1 or more of your ships",
    expansion: "POK",
    id: "Exploration Probe",
    name: "Exploration Probe",
    type: "CARD",
  },
  Fabrication: {
    description:
      "Either purge 2 of your relic fragments of the same type to gain 1 relic; or purge 1 of your relic fragments to gain 1 command token",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    id: "Fabrication",
    name: "Fabrication",
    type: "ABILITY",
  },
  "Fighter Conscription": {
    description:
      "	Place 1 fighter from your reinforcements in each system that contains 1 or more of your space docks or units that have capacity; they cannot be placed in systems that contain other players' ships",
    expansion: "CODEX ONE",
    id: "Fighter Conscription",
    name: "Fighter Conscription",
    type: "CARD",
  },
  "Fires of the Gashlai": {
    description:
      "Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card\n\nThen, return this card to the Muaat player",
    expansion: "BASE",
    faction: "Embers of Muaat",
    id: "Fires of the Gashlai",
    name: "Fires of the Gashlai",
    type: "PROMISSORY",
  },
  "Focused Research": {
    description: "Spend 4 trade goods to research 1 technology",
    expansion: "BASE",
    id: "Focused Research",
    name: "Focused Research",
    type: "CARD",
  },
  "Frontline Deployment": {
    description:
      "Place 3 infantry from your reinforcements on 1 planet you control",
    expansion: "BASE",
    id: "Frontline Deployment",
    name: "Frontline Deployment",
    type: "CARD",
  },
  "Gain Relic": {
    description:
      "Purge 3 of your relic fragments of the same type to gain 1 Relic",
    expansion: "POK",
    id: "Gain Relic",
    name: "Gain Relic",
    type: "EXPLORATION",
  },
  "Ghost Ship": {
    description:
      "Place 1 destroyer from your reinforcements in a non-home system that contains a wormhole and does not contain other players' ships",
    expansion: "BASE",
    id: "Ghost Ship",
    name: "Ghost Ship",
    type: "CARD",
  },
  Impersonation: {
    description: "Spend 3 influence to draw 1 secret objective",
    expansion: "CODEX ONE",
    id: "Impersonation",
    name: "Impersonation",
    type: "CARD",
  },
  "Industrial Initiative": {
    description: "Gain 1 trade good for each industrial planet you control",
    expansion: "BASE",
    id: "Industrial Initiative",
    name: "Industrial Initiative",
    type: "CARD",
  },
  Insubordination: {
    description:
      "Remove 1 token from another player's tactic pool and return it to their reinforcements",
    expansion: "BASE",
    id: "Insubordination",
    name: "Insubordination",
    type: "CARD",
  },
  "Lazax Gate Folding": {
    description:
      "If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex",
    expansion: "BASE",
    faction: "Winnu",
    id: "Lazax Gate Folding",
    name: "Lazax Gate Folding",
    type: "TECH",
  },
  "Lucky Shot": {
    description:
      "Destroy 1 dreadnought, cruiser, or destroyer in a system that contains a planet you control",
    expansion: "BASE",
    id: "Lucky Shot",
    name: "Lucky Shot",
    type: "CARD",
  },
  "Mageon Implants": {
    description:
      "Exhaust this card to look at another player's hand of action cards.  Choose 1 of those cards and add it to your hand",
    expansion: "BASE",
    faction: "Yssaril Tribes",
    id: "Mageon Implants",
    name: "Mageon Implants",
    type: "TECH",
  },
  "Mining Initiative": {
    description:
      "Gain trade goods equal to the resource value of 1 planet you control",
    expansion: "BASE",
    id: "Mining Initiative",
    name: "Mining Initiative",
    type: "CARD",
  },
  "Orbital Drop": {
    description:
      "Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control",
    expansion: "BASE",
    faction: "Federation of Sol",
    id: "Orbital Drop",
    name: "Orbital Drop",
    type: "ABILITY",
  },
  Plagiarize: {
    description:
      "Spend 5 influence and choose a non-faction technology owned by 1 of your neighbors; gain that technology",
    expansion: "CODEX ONE",
    id: "Plagiarize",
    name: "Plagiarize",
    type: "CARD",
  },
  Plague: {
    description:
      "Choose 1 planet that is controlled by another player. Roll 1 die for each infantry on that planet. For each result of 6 or greater, destroy 1 of those units",
    expansion: "BASE",
    id: "Plague",
    name: "Plague",
    type: "CARD",
  },
  "Production Biomes": {
    description:
      "Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods",
    expansion: "BASE",
    faction: "Emirates of Hacan",
    id: "Production Biomes",
    name: "Production Biomes",
    type: "TECH",
  },
  "Promise of Protection": {
    description:
      "Place this card face-up in your play area\n\nWhile this card is in your play area, the Mentak player cannot use their Pillage faction ability against you\n\nIf you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player",
    expansion: "BASE",
    faction: "Mentak Coalition",
    id: "Promise of Protection",
    name: "Promise of Protection",
    type: "PROMISSORY",
  },
  "Reactor Meltdown": {
    description: "Destroy 1 space dock in a non-home system",
    expansion: "BASE",
    id: "Reactor Meltdown",
    name: "Reactor Meltdown",
    type: "CARD",
  },
  "Refit Troops": {
    description:
      "Choose 1 or 2 of your infantry on the game board; replace each of those infantry with mechs",
    expansion: "POK",
    id: "Refit Troops",
    name: "Refit Troops",
    type: "CARD",
  },
  "Repeal Law": {
    description: "Discard 1 law from play",
    expansion: "BASE",
    id: "Repeal Law",
    name: "Repeal Law",
    type: "CARD",
  },
  "Rise of a Messiah": {
    description:
      "Place 1 infantry from your reinforcements on each planet you control",
    expansion: "BASE",
    id: "Rise of a Messiah",
    name: "Rise of a Messiah",
    type: "CARD",
  },
  Scuttle: {
    description:
      "Choose 1 or 2 of your non-fighter ships on the game board and return them to your reinforcements; gain trade goods equal to the combined cost of those ships",
    expansion: "POK",
    id: "Scuttle",
    name: "Scuttle",
    type: "CARD",
  },
  "Seize Artifact": {
    description:
      "Choose 1 of your neighbors that has 1 or more relic fragments. That player must give you 1 relic fragment of your choice",
    expansion: "POK",
    id: "Seize Artifact",
    name: "Seize Artifact",
    type: "CARD",
  },
  "Signal Jamming": {
    description:
      "Chose 1 non-home system that contains or is adjacent to 1 of your ships. Place a command token from another player's reinforcements in that system",
    expansion: "BASE",
    id: "Signal Jamming",
    name: "Signal Jamming",
    type: "CARD",
  },
  "Sling Relay": {
    description:
      "Exhaust this card to produce 1 ship in any system that contains one of your space docks",
    expansion: "POK",
    id: "Sling Relay",
    name: "Sling Relay",
    type: "TECH",
  },
  Spy: {
    description:
      "Choose 1 player. That player gives you 1 random action card from their hand",
    expansion: "BASE",
    id: "Spy",
    name: "Spy",
    type: "CARD",
  },
  "Stall Tactics": {
    description: "Discard 1 action card from your hand",
    expansion: "BASE",
    faction: "Yssaril Tribes",
    id: "Stall Tactics",
    name: "Stall Tactics",
    type: "ABILITY",
  },
  "Star Forge": {
    description:
      "Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns",
    expansion: "BASE",
    faction: "Embers of Muaat",
    id: "Star Forge",
    name: "Star Forge",
    type: "ABILITY",
  },
  Stymie: {
    description:
      "Place this card face up in your play area\n\nWhile this card is in your play area, the Arborec player cannot produce units in or adjacent to non-home systems that contain 1 or more of your units\n\nIf you activate a system that contains 1 or more of the Arborec player's units, return this card to the Arborec player",
    expansion: "BASE ONLY",
    faction: "Arborec",
    id: "Stymie",
    name: "Stymie",
    type: "PROMISSORY",
  },
  "Tactical Bombardment": {
    description:
      "Choose 1 system that contains 1 or more of your units that have Bombardment. Exhaust each planet controlled by other players in that system",
    expansion: "BASE",
    id: "Tactical Bombardment",
    name: "Tactical Bombardment",
    type: "CARD",
  },
  Terraform: {
    description:
      "Attach this card to a non-home planet you control other than Mecatol Rex.\n\nIts resource and influence values are each increased by 1 and it is treated as having all 3 planet traits (Cultural, Hazardous, and Industrial).",
    expansion: "POK",
    faction: "Titans of Ul",
    id: "Terraform",
    name: "Terraform",
    type: "PROMISSORY",
  },
  "The Inferno": {
    description:
      "Spend 1 token from your strategy pool to place 1 cruiser in this unit's system",
    expansion: "BASE",
    faction: "Embers of Muaat",
    id: "The Inferno",
    name: "The Inferno",
    type: "FLAGSHIP",
  },
  "Trade Convoys": {
    description:
      "Place this card face-up in your play area\n\nWhile this card is in your play area, you may negotiate transactions with players who are not your neighbor\n\nIf you activate a system that contains 1 or more of the Hacan player's units, return this card to the Hacan player",
    expansion: "BASE",
    faction: "Emirates of Hacan",
    id: "Trade Convoys",
    name: "Trade Convoys",
    type: "PROMISSORY",
  },
  "Unexpected Action": {
    description:
      "Remove 1 of your command tokens from the game board and return it to your reinforcements",
    expansion: "BASE",
    id: "Unexpected Action",
    name: "Unexpected Action",
    type: "CARD",
  },
  "Unstable Planet": {
    description:
      "Choose 1 hazardous planet. Exhaust that planet and destroy up to 3 infantry on it",
    expansion: "BASE",
    id: "Unstable Planet",
    name: "Unstable Planet",
    type: "CARD",
  },
  Uprising: {
    description:
      "Exhaust 1 non-home planet controlled by another player. Then gain trade goods equal to its resource value",
    expansion: "BASE",
    id: "Uprising",
    name: "Uprising",
    type: "CARD",
  },
  Vortex: {
    description:
      "Exhaust this card to choose another player's non-structure unit in a system that is adjacent to 1 or more of your space docks. Capture 1 unit of that type from that player's reinforcements",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    id: "Vortex",
    name: "Vortex",
    type: "TECH",
  },
  "War Effort": {
    description:
      "Place 1 cruiser from your reinforcements in a system that contains 1 or more of your ships",
    expansion: "BASE",
    id: "War Effort",
    name: "War Effort",
    type: "CARD",
  },
  "Wormhole Generator": {
    description:
      "Exhaust this card to place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
    expansion: "CODEX ONE",
    faction: "Ghosts of Creuss",
    id: "Wormhole Generator",
    name: "Wormhole Generator Ω",
    type: "TECH",
  },
  "X-89 Bacterial Weapon": {
    description:
      "Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet",
    expansion: "BASE ONLY",
    id: "X-89 Bacterial Weapon",
    name: "X-89 Bacterial Weapon",
    type: "TECH",
  },
  ...DISCORDANT_STARS_COMPONENTS,
};
