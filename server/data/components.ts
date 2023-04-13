import { BaseComponent } from "../../src/util/api/components";

export type ComponentId =
  | "Archaeological Expedition"
  | "Black Market Forgery"
  | "Blood Pact"
  | "Cripple Defenses"
  | "Dark Pact"
  | "Divert Funding"
  | "Economic Initiative"
  | "Enigmatic Device"
  | "Exploration Probe"
  | "Fabrication"
  | "Fighter Conscription"
  | "Fires of the Gashlai"
  | "Focused Research"
  | "Frontline Deployment"
  | "Gain Relic"
  | "Ghost Ship"
  | "Impersonation"
  | "Industrial Initiative"
  | "Insubordination"
  | "Lazax Gate Folding"
  | "Lucky Shot"
  | "Mageon Implants"
  | "Mining Initiative"
  | "Orbital Drop"
  | "Plagiarize"
  | "Plague"
  | "Production Biomes"
  | "Promise of Protection"
  | "Reactor Meltdown"
  | "Refit Troops"
  | "Repeal Law"
  | "Rise of a Messiah"
  | "Scuttle"
  | "Seize Artifact"
  | "Signal Jamming"
  | "Sling Relay"
  | "Spy"
  | "Stall Tactics"
  | "Star Forge"
  | "Stymie"
  | "Tactical Bombardment"
  | "Terraform"
  | "The Inferno"
  | "Trade Convoys"
  | "Unexpected Action"
  | "Unstable Planet"
  | "Uprising"
  | "Vortex"
  | "War Effort"
  | "Wormhole Generator"
  | "X-89 Bacterial Weapon";

export const BASE_COMPONENTS: Record<ComponentId, BaseComponent> = {
  "Archaeological Expedition": {
    description:
      "Reveal the top 3 cards of an exploration deck that matches a planet you control; gain any relic fragments that you reveal and discard the rest",
    expansion: "POK",
    name: "Archaeological Expedition",
    type: "CARD",
  },
  "Black Market Forgery": {
    description:
      "Purge 2 of your relic fragments of the same type to gain 1 relic.\n\nThen return this card to the Naaz-Rokha player.",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Black Market Forgery",
    type: "PROMISSORY",
  },
  "Blood Pact": {
    description:
      "Place this card face up in your play area.\n\nWhen you and the Empyrean player cast votes for the same outcome, cast 4 additional votes for that outcome.\n\nIf you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
    expansion: "POK",
    faction: "Empyrean",
    name: "Blood Pact",
    type: "PROMISSORY",
  },
  "Cripple Defenses": {
    description: "Choose 1 planet. Destroy each PDS on that planet",
    expansion: "BASE",
    name: "Cripple Defenses",
    type: "CARD",
  },
  "Dark Pact": {
    description:
      "Place this card face up in your play area.\n\nWhen you give a number of commodities to the Empyrean player equal to your maximum commodity value, you each gain 1 trade good.\n\nIf you activate a system that contains 1 or more of the Empyrean player's units, return this card to the Empyrean player.",
    expansion: "POK",
    faction: "Empyrean",
    name: "Dark Pact",
    type: "PROMISSORY",
  },
  "Divert Funding": {
    description:
      "Return a non-unit upgrade, non-faction technology that you own to your technology deck. Then, research another technology",
    expansion: "POK",
    name: "Divert Funding",
    type: "CARD",
  },
  "Economic Initiative": {
    description: "Ready each cultural planet you control",
    expansion: "BASE",
    name: "Economic Initiative",
    type: "CARD",
  },
  "Enigmatic Device": {
    description:
      "You may spend 6 resources and purge this card to research 1 technology",
    expansion: "POK",
    name: "Enigmatic Device",
    type: "EXPLORATION",
  },
  "Exploration Probe": {
    description:
      "Explore a frontier token that is in or adjacent to a system that contains 1 or more of your ships",
    expansion: "POK",
    name: "Exploration Probe",
    type: "CARD",
  },
  Fabrication: {
    description:
      "Either purge 2 of your relic fragments of the same type to gain 1 relic; or purge 1 of your relic fragments to gain 1 command token",
    expansion: "POK",
    faction: "Naaz-Rokha Alliance",
    name: "Fabrication",
    type: "ABILITY",
  },
  "Fighter Conscription": {
    description:
      "	Place 1 fighter from your reinforcements in each system that contains 1 or more of your space docks or units that have capacity; they cannot be placed in systems that contain other players' ships",
    expansion: "CODEX ONE",
    name: "Fighter Conscription",
    type: "CARD",
  },
  "Fires of the Gashlai": {
    description:
      "Remove 1 token from the Muaat player's fleet pool and return it to their reinforcements. Then, gain your war sun unit upgrade technology card\n\nThen, return this card to the Muaat player",
    expansion: "BASE",
    faction: "Embers of Muaat",
    name: "Fires of the Gashlai",
    type: "PROMISSORY",
  },
  "Focused Research": {
    description: "Spend 4 trade goods to research 1 technology",
    expansion: "BASE",
    name: "Focused Research",
    type: "CARD",
  },
  "Frontline Deployment": {
    description:
      "Place 3 infantry from your reinforcements on 1 planet you control",
    expansion: "BASE",
    name: "Frontline Deployment",
    type: "CARD",
  },
  "Gain Relic": {
    description:
      "Purge 3 of your relic fragments of the same type to gain 1 Relic",
    expansion: "POK",
    name: "Gain Relic",
    type: "EXPLORATION",
  },
  "Ghost Ship": {
    description:
      "Place 1 destroyer from your reinforcements in a non-home system that contains a wormhole and does not contain other players' ships",
    expansion: "BASE",
    name: "Ghost Ship",
    type: "CARD",
  },
  Impersonation: {
    description: "Spend 3 influence to draw 1 secret objective",
    expansion: "CODEX ONE",
    name: "Impersonation",
    type: "CARD",
  },
  "Industrial Initiative": {
    description: "Gain 1 trade good for each industrial planet you control",
    expansion: "BASE",
    name: "Industrial Initiative",
    type: "CARD",
  },
  Insubordination: {
    description:
      "Remove 1 token from another player's tactic pool and return it to their reinforcements",
    expansion: "BASE",
    name: "Insubordination",
    type: "CARD",
  },
  "Lazax Gate Folding": {
    description:
      "If you control Mecatol Rex, exhaust this card to place 1 infantry from your reinforcements on Mecatol Rex",
    expansion: "BASE",
    faction: "Winnu",
    name: "Lazax Gate Folding",
    type: "TECH",
  },
  "Lucky Shot": {
    description:
      "Destroy 1 dreadnought, cruiser, or destroyer in a system that contains a planet you control",
    expansion: "BASE",
    name: "Lucky Shot",
    type: "CARD",
  },
  "Mageon Implants": {
    description:
      "Exhaust this card to look at another player's hand of action cards.  Choose 1 of those cards and add it to your hand",
    expansion: "BASE",
    faction: "Yssaril Tribes",
    name: "Mageon Implants",
    type: "TECH",
  },
  "Mining Initiative": {
    description:
      "Gain trade goods equal to the resource value of 1 planet you control",
    expansion: "BASE",
    name: "Mining Initiative",
    type: "CARD",
  },
  "Orbital Drop": {
    description:
      "Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control",
    expansion: "BASE",
    faction: "Federation of Sol",
    name: "Orbital Drop",
    type: "ABILITY",
  },
  Plagiarize: {
    description:
      "Spend 5 influence and choose a non-faction technology owned by 1 of your neighbors; gain that technology",
    expansion: "CODEX ONE",
    name: "Plagiarize",
    type: "CARD",
  },
  Plague: {
    description:
      "Choose 1 planet that is controlled by another player. Roll 1 die for each infantry on that planet. For each result of 6 or greater, destroy 1 of those units",
    expansion: "BASE",
    name: "Plague",
    type: "CARD",
  },
  "Production Biomes": {
    description:
      "Exhaust this card and spend 1 token from your strategy pool to gain 4 trade goods and choose 1 other player; that player gains 2 trade goods",
    expansion: "BASE",
    faction: "Emirates of Hacan",
    name: "Production Biomes",
    type: "TECH",
  },
  "Promise of Protection": {
    description:
      "Place this card face-up in your play area\n\nWhile this card is in your play area, the Mentak player cannot use their Pillage faction ability against you\n\nIf you activate a system that contains 1 or more of the Mentak player's units, return this card to the Mentak player",
    expansion: "BASE",
    faction: "Mentak Coalition",
    name: "Promise of Protection",
    type: "PROMISSORY",
  },
  "Reactor Meltdown": {
    description: "Destroy 1 space dock in a non-home system",
    expansion: "BASE",
    name: "Reactor Meltdown",
    type: "CARD",
  },
  "Refit Troops": {
    description:
      "Choose 1 or 2 of your infantry on the game board; replace each of those infantry with mechs",
    expansion: "POK",
    name: "Refit Troops",
    type: "CARD",
  },
  "Repeal Law": {
    description: "Discard 1 law from play",
    expansion: "BASE",
    name: "Repeal Law",
    type: "CARD",
  },
  "Rise of a Messiah": {
    description:
      "Place 1 infantry from your reinforcements on each planet you control",
    expansion: "BASE",
    name: "Rise of a Messiah",
    type: "CARD",
  },
  Scuttle: {
    description:
      "Choose 1 or 2 of your non-fighter ships on the game board and return them to your reinforcements; gain trade goods equal to the combined cost of those ships",
    expansion: "POK",
    name: "Scuttle",
    type: "CARD",
  },
  "Seize Artifact": {
    description:
      "Choose 1 of your neighbors that has 1 or more relic fragments. That player must give you 1 relic fragment of your choice",
    expansion: "POK",
    name: "Seize Artifact",
    type: "CARD",
  },
  "Signal Jamming": {
    description:
      "Chose 1 non-home system that contains or is adjacent to 1 of your ships. Place a command token from another player's reinforcements in that system",
    expansion: "BASE",
    name: "Signal Jamming",
    type: "CARD",
  },
  "Sling Relay": {
    description:
      "Exhaust this card to produce 1 ship in any system that contains one of your space docks",
    expansion: "POK",
    name: "Sling Relay",
    type: "TECH",
  },
  Spy: {
    description:
      "Choose 1 player. That player gives you 1 random action card from their hand",
    expansion: "BASE",
    name: "Spy",
    type: "CARD",
  },
  "Stall Tactics": {
    description: "Discard 1 action card from your hand",
    expansion: "BASE",
    faction: "Yssaril Tribes",
    name: "Stall Tactics",
    type: "ABILITY",
  },
  "Star Forge": {
    description:
      "Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your war suns",
    expansion: "BASE",
    faction: "Embers of Muaat",
    name: "Star Forge",
    type: "ABILITY",
  },
  Stymie: {
    description:
      "Place this card face up in your play area\n\nWhile this card is in your play area, the Arborec player cannot produce units in or adjacent to non-home systems that contain 1 or more of your units\n\nIf you activate a system that contains 1 or more of the Arborec player's units, return this card to the Arborec player",
    expansion: "BASE ONLY",
    faction: "Arborec",
    name: "Stymie",
    type: "PROMISSORY",
  },
  "Tactical Bombardment": {
    description:
      "Choose 1 system that contains 1 or more of your units that have Bombardment. Exhaust each planet controlled by other players in that system",
    expansion: "BASE",
    name: "Tactical Bombardment",
    type: "CARD",
  },
  Terraform: {
    description:
      "Attach this card to a non-home planet you control other than Mecatol Rex.\n\nIts resource and influence values are each increased by 1 and it is treated as having all 3 planet traits (Cultural, Hazardous, and Industrial).",
    expansion: "POK",
    faction: "Titans of Ul",
    name: "Terraform",
    type: "PROMISSORY",
  },
  "The Inferno": {
    description:
      "Spend 1 token from your strategy pool to place 1 cruiser in this unit's system",
    expansion: "BASE",
    faction: "Embers of Muaat",
    name: "The Inferno",
    type: "FLAGSHIP",
  },
  "Trade Convoys": {
    description:
      "Place this card face-up in your play area\n\nWhile this card is in your play area, you may negotiate transactions with players who are not your neighbor\n\nIf you activate a system that contains 1 or more of the Hacan player's units, return this card to the Hacan player",
    expansion: "BASE",
    faction: "Emirates of Hacan",
    name: "Trade Convoys",
    type: "PROMISSORY",
  },
  "Unexpected Action": {
    description:
      "Remove 1 of your command tokens from the game board and return it to your reinforcements",
    expansion: "BASE",
    name: "Unexpected Action",
    type: "CARD",
  },
  "Unstable Planet": {
    description:
      "Choose 1 hazardous planet. Exhaust that planet and destroy up to 3 infantry on it",
    expansion: "BASE",
    name: "Unstable Planet",
    type: "CARD",
  },
  Uprising: {
    description:
      "Exhaust 1 non-home planet controlled by another player. Then gain trade goods equal to its resource value",
    expansion: "BASE",
    name: "Uprising",
    type: "CARD",
  },
  Vortex: {
    description:
      "Exhaust this card to choose another player's non-structure unit in a system that is adjacent to 1 or more of your space docks. Capture 1 unit of that type from that player's reinforcements",
    expansion: "POK",
    faction: "Vuil'raith Cabal",
    name: "Vortex",
    type: "TECH",
  },
  "War Effort": {
    description:
      "Place 1 cruiser from your reinforcements in a system that contains 1 or more of your ships",
    expansion: "BASE",
    name: "War Effort",
    type: "CARD",
  },
  "Wormhole Generator": {
    description:
      "Exhaust this card to place or move a Creuss wormhole token into either a system that contains a planet you control or a non-home system that does not contain another player's ships",
    expansion: "CODEX ONE",
    faction: "Ghosts of Creuss",
    name: "Wormhole Generator Ω",
    type: "TECH",
  },
  "X-89 Bacterial Weapon": {
    description:
      "Exhaust this card and choose 1 planet in a system that contains 1 or more of your ships that have BOMBARDMENT; destroy all infantry on that planet",
    expansion: "BASE ONLY",
    name: "X-89 Bacterial Weapon",
    type: "TECH",
  },
};
