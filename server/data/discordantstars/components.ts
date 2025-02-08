export const DISCORDANT_STARS_COMPONENTS: Record<
  DiscordantStars.ComponentId,
  BaseComponent | BaseTechComponent
> = {
  "Algorithmic Replication": {
    description:
      "Choose 1 action card from the action card discard pile and add it to your hand. Then, purge this card.",
    expansion: "DISCORDANT STARS",
    faction: "Savages of Cymiae",
    id: "Algorithmic Replication",
    name: "Algorithmic Replication",
    type: "PROMISSORY",
  },
  "Emergency Deployment": {
    description:
      "Exhaust this card to place or move 1 of your space docks onto a planet you control.",
    expansion: "DISCORDANT STARS",
    faction: "Shipwrights of Axis",
    id: "Emergency Deployment",
    name: "Emergency Deployment",
    type: "TECH",
  },
  // "Encryption Key": {
  //   description:
  //     "Attach this card to a non-home planet you control.\n\nThis planet has 1 technology specialty of any color.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Bentor Conglomerate",
  //   id: "Encryption Key",
  //   name: "Encryption Key",
  //   type: "PROMISSORY",
  // },
  "Impressment Programs": {
    description:
      "Exhaust this card and 1 planet you control to explore that planet.",
    expansion: "DISCORDANT STARS",
    faction: "Dih-Mohn Flotilla",
    id: "Impressment Programs",
    name: "Impressment Programs",
    type: "TECH",
  },
  "Gledge Base": {
    description:
      "ACTION: Attach this card to a non-home planet you control.\n\nThis planet's resource value is increased by 2.",
    expansion: "DISCORDANT STARS",
    faction: "Gledge Union",
    id: "Gledge Base",
    name: "Gledge Base",
    type: "PROMISSORY",
  },
  // "Mantle Cracking": {
  //   description:
  //     'Place 1 "Core" token on a non-home planet you control other than Mecatol Rex that does not already contain a Core token to gain a number of trade goods equal to that planet\'s combined resource and influence values.',
  //   expansion: "DISCORDANT STARS",
  //   faction: "Gledge Union",
  //   id: "Mantle Cracking",
  //   name: "Mantle Cracking",
  //   type: "ABILITY",
  // },
  "Read the Fates": {
    description:
      "Place this face up in your play area.\n\nWhile this card is in your play area, you may look at the public objective card on the Ilyxum player's faction sheet.\n\nIf you activate a system that contains 1 or more of the Ilyxum player's units, return this card to the Ilyxum player.",
    expansion: "DISCORDANT STARS",
    faction: "Augurs of Ilyxum",
    id: "Read the Fates",
    name: "Read the Fates",
    type: "PROMISSORY",
  },
  "Seeker Drones": {
    description:
      "Exhaust this card to choose 1 of your neighbors that has 1 or more relic fragments. That player gains 2 trade goods and must give you 1 of those relic fragments of your choice.",
    expansion: "DISCORDANT STARS",
    faction: "Kollecc Society",
    id: "Seeker Drones",
    name: "Seeker Drones",
    type: "TECH",
  },
  // Meditation: {
  //   description:
  //     "Spend 1 command token from your strategy pool to ready 1 of your technologies.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Monks of Kolume",
  //   id: "Meditation",
  //   name: "Meditation",
  //   type: "ABILITY",
  // },
  // "Applied Biothermics": {
  //   description: "Exhaust this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Monks of Kolume",
  //   id: "Applied Biothermics",
  //   name: "Applied Biothermics",
  //   type: "TECH",
  // },
  "Blessing of the Queens": {
    description:
      "Place this card face up in your play area and remove 1 of your command tokens from the game board.\n\nAt the start of the status phase, return this card to the Kortali player.",
    expansion: "DISCORDANT STARS",
    faction: "Kortali Tribunal",
    id: "Blessing of the Queens",
    name: "Blessing of the Queens",
    type: "PROMISSORY",
  },
  // "Spark Thrusters": {
  //   description:
  //     "Spend 1 command token from your strategy pool or purge 1 relic fragment to move 1 of your ships to an adjacent system that contains no other player's ships. If you spent a command token, exhaust this card.",
  //   expansion: "DISCORDANT STARS",
  //   faction: "Lanefir Remnants",
  //   id: "Spark Thrusters",
  //   name: "Spark Thrusters",
  //   type: "TECH",
  // },
  "Gift of Insight": {
    description:
      "Place this card face up in your play area.\n\nWhile this card is in your play area, once per turn, after you roll a die, you may reroll that die.\n\nIf you activate a system that contains 1 or more of the Myko-Mentori player's units, return this card to the Myko-Mentori player.",
    expansion: "DISCORDANT STARS",
    faction: "Myko-Mentori",
    id: "Gift of Insight",
    name: "Gift of Insight",
    type: "PROMISSORY",
  },
  "Incite Revolution": {
    description:
      "Place this card face up in your play area to choose and exhaust 1 planet you control. Then, ready 1 non-home planet you control other than Mecatol Rex.\n\nAt the start of the status phase, return this card to the Olradin player.",
    expansion: "DISCORDANT STARS",
    faction: "Olradin League",
    id: "Incite Revolution",
    name: "Incite Revolution",
    type: "PROMISSORY",
  },

  // Action Cards
  "Free Trade Initiative": {
    description:
      "For each planet trait, if you control a planet of that trait, gain 2 commodities or convert 2 of your commodities to trade goods.",
    expansion: "DISCORDANT STARS",
    id: "Free Trade Initiative",
    name: "Free Trade Initiative",
    type: "CARD",
  },
  "Micrometeoroid Storm": {
    description:
      "Choose 1 system that contains another player's ships. Roll 1 die for each fighter in that system. For each result of 6 or greater, destroy 1 of those units.",
    expansion: "DISCORDANT STARS",
    id: "Micrometeoroid Storm",
    name: "Micrometeoroid Storm",
    type: "CARD",
  },
  "Neural Hammer": {
    description:
      "Choose 1 player with the most victory points. Look at up to 1 of their unscored secret objectives, at random.",
    expansion: "DISCORDANT STARS",
    id: "Neural Hammer",
    name: "Neural Hammer",
    type: "CARD",
  },
  "Personnel Writ": {
    description:
      "Ready your agent or spend 1 command token from your strategy pool to unlock your commander.",
    expansion: "DISCORDANT STARS",
    id: "Personnel Writ",
    name: "Personnel Writ",
    type: "CARD",
  },
  "Planetary Rigs": {
    description:
      "Choose 1 non-home planet you control other than Mecatol Rex. Reveal cards from that planet's corresponding exploration deck until you reveal an attachment; attach that attachment to that planet and discard the rest.",
    expansion: "DISCORDANT STARS",
    id: "Planetary Rigs",
    name: "Planetary Rigs",
    type: "CARD",
  },
  Preparation: {
    description: "Draw 1 action card.",
    expansion: "DISCORDANT STARS",
    id: "Preparation",
    name: "Preparation",
    type: "CARD",
  },
  "Professional Archaeologists": {
    description:
      "For each exploration deck, look at the top card of that deck; if that card is a relic fragment, reveal and gain that card, otherwise discard that card and gain 1 commodity.",
    expansion: "DISCORDANT STARS",
    id: "Professional Archaeologists",
    name: "Professional Archaeologists",
    type: "CARD",
  },
  "Remnant Collection": {
    description:
      "Purge any number of your relic fragments to draw an equal number of action cards.",
    expansion: "DISCORDANT STARS",
    id: "Remnant Collection",
    name: "Remnant Collection",
    type: "CARD",
  },
  "Secured Trove": {
    description: "Purge any 2 of your relic fragments to gain 1 relic.",
    expansion: "DISCORDANT STARS",
    id: "Secured Trove",
    name: "Secured Trove",
    type: "CARD",
  },

  // Exploration Cards
  "Star Chart": {
    description:
      "Purge 2 of your Star Charts to draw 1 system tile with a blue-colored back at random; place that tile at the edge of the game board, adjacent to at least 2 other systems.",
    expansion: "DISCORDANT STARS",
    id: "Star Chart",
    name: "Star Chart",
    type: "EXPLORATION",
  },
};
