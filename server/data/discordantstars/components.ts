import { BaseComponent } from "../../../src/util/api/components";

export const DISCORDANT_STARS_COMPONENTS: Record<
  DiscordantStars.ComponentId,
  BaseComponent
> = {
  "Algorithmic Replication": {
    description:
      "Choose 1 action card from the action card discard pile and add it to your hand. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    name: "Algorithmic Replication",
    type: "PROMISSORY",
  },
  "Emergency Deployment": {
    description:
      "Exhaust this card to place or move 1 of your space docks onto a planet you control.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    name: "Emergency Deployment",
    type: "TECH",
  },
  // "Encryption Key": {
  //   description:
  //     "Attach this card to a non-home planet you control.\n\nThis planet has 1 technology specialty of any color.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Bentor Conglomerate",
  //   name: "Encryption Key",
  //   type: "PROMISSORY",
  // },
  "Impressment Programs": {
    description:
      "Exhaust this card and 1 planet you control to explore that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Dih-Mohn Flotilla",
    name: "Impressment Programs",
    type: "TECH",
  },
  // "Gledge Base": {
  //   description:
  //     "Attach this card to a non-home planet you control.\n\nThis planet's resource value is increased by 2.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Gledge Union",
  //   name: "Gledge Base",
  //   type: "PROMISSORY",
  // },
  // "Mantle Cracking": {
  //   description:
  //     'Place 1 "Core" token on a non-home planet you control other than Mecatol Rex that does not already contain a Core token to gain a number of trade goods equal to that planet\'s combined resource and influence values.',
  //   expansion: "DISCORDANT STARS",
  //   faction: "Gledge Union",
  //   name: "Mantle Cracking",
  //   type: "ABILITY",
  // },
  "Read the Fates": {
    description:
      "Place this face up in your play area.\n\nWhile this card is in your play area, you may look at the public objective card on the Ilyxum player's faction sheet.\n\nIf you activate a system that contains 1 or more of the Ilyxum player's units, return this card to the Ilyxum player.",
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    name: "Read the Fates",
    type: "PROMISSORY",
  },
  "Seeker Drones": {
    description:
      "Exhaust this card to choose 1 of your neighbors that has 1 or more relic fragments. That player gains 2 trade goods and must give you 1 of those relic fragments of your choice.",
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    name: "Seeker Drones",
    type: "TECH",
  },
  // Meditation: {
  //   description:
  //     "Spend 1 command token from your strategy pool to ready 1 of your technologies.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Monks of Kolume",
  //   name: "Meditation",
  //   type: "ABILITY",
  // },
  // "Applied Biothermics": {
  //   description: "Exhaust this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Monks of Kolume",
  //   name: "Applied Biothermics",
  //   type: "TECH",
  // },
  "Blessing of the Queens": {
    description:
      "Place this card face up in your play area and remove 1 of your command tokens from the game board.\n\nAt the start of the status phase, return this card to the Kortali player.",
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    name: "Blessing of the Queens",
    type: "PROMISSORY",
  },
  // "Spark Thrusters": {
  //   description:
  //     "Spend 1 command token from your strategy pool or purge 1 relic fragment to move 1 of your ships to an adjacent system that contains no other player's ships. If you spent a command token, exhaust this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Lanefir Remnants",
  //   name: "Spark Thrusters",
  //   type: "TECH",
  // },
  "Gift of Insight": {
    description:
      "Place this card face up in your play area.\n\nWhile this card is in your play area, once per turn, after you roll a die, you may reroll that die.\n\nIf you activate a system that contains 1 or more of the Myko-Mentori player's units, return this card to the Myko-Mentori player.",
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    name: "Gift of Insight",
    type: "PROMISSORY",
  },
  "Incite Revolution": {
    description:
      "Place this card face up in your play area to choose and exhaust 1 planet you control. Then, ready 1 non-home planet you control other than Mecatol Rex.\n\nAt the start of the status phase, return this card to the Olradin player.",
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    name: "Incite Revolution",
    type: "PROMISSORY",
  },
};
