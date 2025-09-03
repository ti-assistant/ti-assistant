import { IntlShape } from "react-intl";

export default function getDiscordantStarsActionCards(
  intl: IntlShape
): Record<DiscordantStars.ActionCardId, BaseActionCard> {
  return {
    "Free Trade Initiative": {
      count: 1,
      description:
        "ACTION: For each planet trait, if you control a planet of that trait, gain 2 commodities or convert 2 of your commodities to trade goods.",
      expansion: "DISCORDANT STARS",
      id: "Free Trade Initiative",
      name: "Free Trade Initiative",
      timing: "COMPONENT_ACTION",
    },
    "Micrometeoroid Storm": {
      count: 1,
      description:
        "ACTION: Choose 1 system that contains another player's ships. Roll 1 die for each fighter in that system. For each result of 6 or greater, destroy 1 of those units.",
      expansion: "DISCORDANT STARS",
      id: "Micrometeoroid Storm",
      name: "Micrometeoroid Storm",
      timing: "COMPONENT_ACTION",
    },
    "Neural Hammer": {
      count: 1,
      description:
        "ACTION: Choose 1 player with the most victory points. Look at up to 1 of their unscored secret objectives, at random.",
      expansion: "DISCORDANT STARS",
      id: "Neural Hammer",
      name: "Neural Hammer",
      timing: "COMPONENT_ACTION",
    },
    "Personnel Writ": {
      count: 1,
      description:
        "ACTION: Ready your agent or spend 1 command token from your strategy pool to unlock your commander.",
      expansion: "DISCORDANT STARS",
      id: "Personnel Writ",
      name: "Personnel Writ",
      timing: "COMPONENT_ACTION",
    },
    "Planetary Rigs": {
      count: 1,
      description:
        "ACTION: Choose 1 non-home planet you control other than Mecatol Rex. Reveal cards from that planet's corresponding exploration deck until you reveal an attachment; attach that attachment to that planet and discard the rest.",
      expansion: "DISCORDANT STARS",
      id: "Planetary Rigs",
      name: "Planetary Rigs",
      timing: "COMPONENT_ACTION",
    },
    Preparation: {
      count: 1,
      description: "ACTION: Draw 1 action card.",
      expansion: "DISCORDANT STARS",
      id: "Preparation",
      name: "Preparation",
      timing: "COMPONENT_ACTION",
    },
    "Professional Archaeologists": {
      count: 1,
      description:
        "ACTION: For each exploration deck, look at the top card of that deck; if that card is a relic fragment, reveal and gain that card, otherwise discard that card and gain 1 commodity.",
      expansion: "DISCORDANT STARS",
      id: "Professional Archaeologists",
      name: "Professional Archaeologists",
      timing: "COMPONENT_ACTION",
    },
    "Remnant Collection": {
      count: 1,
      description:
        "ACTION: Purge any number of your relic fragments to draw an equal number of action cards.",
      expansion: "DISCORDANT STARS",
      id: "Remnant Collection",
      name: "Remnant Collection",
      timing: "COMPONENT_ACTION",
    },
    "Secured Trove": {
      count: 1,
      description:
        "ACTION: Purge any 2 of your relic fragments to gain 1 relic.",
      expansion: "DISCORDANT STARS",
      id: "Secured Trove",
      name: "Secured Trove",
      timing: "COMPONENT_ACTION",
    },
  };
}
