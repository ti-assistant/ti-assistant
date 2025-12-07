import { IntlShape } from "react-intl";
import { antiFighterBarrage, production } from "../../../src/util/strings";

export default function getThundersEdgeTechs(
  intl: IntlShape
): Record<ThundersEdge.TechId, BaseTech> {
  return {
    // Council Keleres
    "Executive Order": {
      description: intl.formatMessage({
        id: "Council Keleres.Techs.Executive Order.Description",
        description: "Description for Tech: Executive Order",
        defaultMessage:
          "ACTION: Reveal the top or bottom card of the agenda deck and vote on it, being speaker. You may use trade goods to vote.",
      }),
      expansion: "THUNDERS EDGE",
      faction: "Council Keleres",
      id: "Executive Order",
      name: intl.formatMessage({
        id: "Council Keleres.Techs.Executive Order.Title",
        description: "Title of Tech: Executive Order",
        defaultMessage: "Executive Order",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    // Crimson Rebellion
    "Subatomic Splicer": {
      description: intl.formatMessage({
        id: "Crimson Rebellion.Techs.Subatomic Splicer.Description",
        description: "Description for Tech: Subatomic Splicer",
        defaultMessage:
          "When one of your ships is destroyed, you may produce a ship of the same type at a space dock in your home system.",
      }),
      expansion: "THUNDERS EDGE",
      faction: "Crimson Rebellion",
      id: "Subatomic Splicer",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Techs.Subatomic Splicer.Title",
        description: "Title of Tech: Subatomic Splicer",
        defaultMessage: "Subatomic Splicer",
      }),
      prereqs: ["YELLOW"],
      type: "YELLOW",
    },
    "Exile II": {
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      description: intl.formatMessage({
        id: "Crimson Rebellion.Techs.Exile II.Description",
        description: "Description for Tech: Exile II",
        defaultMessage:
          "At the end of any player's combat in this unit's system or up to 2 systems away, you may place 1 active or inactive breach in that system.",
      }),
      expansion: "THUNDERS EDGE",
      faction: "Crimson Rebellion",
      id: "Exile II",
      name: intl.formatMessage({
        id: "Crimson Rebellion.Techs.Exile II.Title",
        description: "Title of Tech: Exile II",
        defaultMessage: "Exile II",
      }),
      prereqs: ["RED", "RED"],
      replaces: "Destroyer II",
      stats: {
        cost: 1,
        combat: 7,
        move: 2,
      },
      type: "UPGRADE",
      unitType: "Destroyer",
    },
    // Deepwrought Scholarate
    "Hydrothermal Mining": {
      description: intl.formatMessage({
        id: "Deepwrought Scholarate.Techs.Hydrothermal Mining.Description",
        description: "Description for Tech: Hydrothermal Mining",
        defaultMessage:
          "At the start of the status phase, gain 1 trade good for each ocean card in play.",
      }),
      expansion: "THUNDERS EDGE",
      faction: "Deepwrought Scholarate",
      id: "Hydrothermal Mining",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Techs.Hydrothermal Mining.Title",
        description: "Title of Tech: Hydrothermal Mining",
        defaultMessage: "Hydrothermal Mining",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    },
    "Radical Advancement": {
      description: intl.formatMessage({
        id: "Deepwrought Scholarate.Techs.Radical Advancement.Description",
        description: "Description for Tech: Radical Advancement",
        defaultMessage:
          "At the start of the status phase, you may replace one of your non-unit upgrade technologies with a technology of the same color that has exactly 1 more prerequisite.",
      }),
      expansion: "THUNDERS EDGE",
      faction: "Deepwrought Scholarate",
      id: "Radical Advancement",
      name: intl.formatMessage({
        id: "Deepwrought Scholarate.Techs.Radical Advancement.Title",
        description: "Title of Tech: Radical Advancement",
        defaultMessage: "Radical Advancement",
      }),
      prereqs: ["GREEN"],
      type: "GREEN",
    },
    // Firmament
    "Neural Parasite": {
      description: intl.formatMessage(
        {
          id: "Firmament.Techs.Neural Parasite.Description",
          description: "Description for Tech: Neural Parasite",
          defaultMessage:
            "At the start of the status phase, you may place 1 infantry from your reinforcements on a planet you control in your home system.{br}Flip this card if the Obsidian faction is in play.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Firmament",
      id: "Neural Parasite",
      name: intl.formatMessage({
        id: "Firmament.Techs.Neural Parasite.Title",
        description: "Title of Tech: Neural Parasite",
        defaultMessage: "Neural Parasite",
      }),
      prereqs: ["GREEN", "GREEN"],
      type: "GREEN",
    },
    Planesplitter: {
      description: intl.formatMessage(
        {
          id: "Firmament.Techs.Planesplitter.Description",
          description: "Description for Tech: Planesplitter",
          defaultMessage:
            "When you gain this card, put The Fracture into play.{br}Flip this card if the Obsidian faction is in play.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Firmament",
      id: "Planesplitter",
      name: intl.formatMessage({
        id: "Firmament.Techs.Planesplitter.Title",
        description: "Title of Tech: Planesplitter",
        defaultMessage: "Planesplitter",
      }),
      prereqs: ["YELLOW", "YELLOW"],
      type: "YELLOW",
    },
    // Last Bastion
    "Proxima Targeting VI": {
      description: intl.formatMessage(
        {
          id: "Last Bastion.Techs.Proxima Targeting VI.Description",
          description: "Description for Tech: Proxima Targeting VI",
          defaultMessage:
            "Cancel 1 hit produced by BOMBARDMENT rolls made against your ground forces for each of your galvanized units present.{br}At the start of a round of ground combat, you may resolve BOMBARDMENT 8 (x3) against your opponent's ground forces; if you do, make an identical roll against your own ground forces.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Last Bastion",
      id: "Proxima Targeting VI",
      name: intl.formatMessage({
        id: "Last Bastion.Techs.Proxima Targeting VI.Title",
        description: "Title of Tech: Proxima Targeting VI",
        defaultMessage: "Proxima Targeting VI",
      }),
      prereqs: ["RED"],
      type: "RED",
    },
    "4X4IC Helios V2": {
      abilities: [production("X", intl)],
      description: intl.formatMessage(
        {
          id: "Techs.4X4IC Helios V2.Description",
          description: "Description for Tech: 4X4IC Helios V2",
          defaultMessage:
            "This unit's PRODUCTION value is equal to 4 more than the resource value of this planet.{br}The resource value of this planet is increased by 2.{br}Up to 3 fighters in this system do not count against your ships' capacity.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Last Bastion",
      id: "4X4IC Helios V2",
      name: intl.formatMessage({
        id: "Techs.4X4IC Helios V2.Title",
        description: "Title of Tech: 4X4IC Helios V2",
        defaultMessage: '4X4IC "Helios" V2',
      }),
      prereqs: ["YELLOW", "YELLOW"],
      replaces: "Space Dock II",
      stats: {},
      type: "UPGRADE",
      unitType: "Space Dock",
    },
    // Obsidian
    "Neural Parasite (Obsidian)": {
      description: intl.formatMessage(
        {
          id: "Obsidian.Techs.Neural Parasite (Obsidian).Description",
          description: "Description for Tech: Neural Parasite (Obsidian)",
          defaultMessage:
            "At the start of your turn, destroy 1 of another player's infantry in or adjacent to a system that contains your infantry.{br}This technology cannot be researched.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Obsidian",
      id: "Neural Parasite (Obsidian)",
      locked: true,
      name: intl.formatMessage({
        id: "Obsidian.Techs.Neural Parasite (Obsidian).Title",
        description: "Title of Tech: Neural Parasite (Obsidian)",
        defaultMessage: "Neural Parasite",
      }),
      prereqs: [],
      type: "GREEN",
    },
    "Planesplitter (Obsidian)": {
      description: intl.formatMessage(
        {
          id: "Obsidian.Techs.Planesplitter (Obsidian).Description",
          description: "Description for Tech: Planesplitter (Obsidian)",
          defaultMessage:
            "At the start of your strategic actions, you may move an ingress token into a system that contains or is adjacent to your units.{br}This technology cannot be researched.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Obsidian",
      id: "Planesplitter (Obsidian)",
      locked: true,
      name: intl.formatMessage({
        id: "Obsidian.Techs.Planesplitter (Obsidian).Title",
        description: "Title of Tech: Planesplitter (Obsidian)",
        defaultMessage: "Planesplitter",
      }),
      prereqs: [],
      type: "YELLOW",
    },
    // Ral Nel Consortium
    "Linkship II": {
      abilities: [antiFighterBarrage("6 (x3)", intl)],
      description: intl.formatMessage(
        {
          id: "Ral Nel Consortium.Techs.Linkship II.Description",
          description: "Description for Tech: Linkship II",
          defaultMessage:
            "This unit can use the SPACE CANNON ability of one of your structures in its space area; each linkship can trigger the same structure.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Ral Nel Consortium",
      id: "Linkship II",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Techs.Linkship II.Title",
        description: "Title of Tech: Linkship II",
        defaultMessage: "Linkship II",
      }),
      replaces: "Destroyer II",
      prereqs: ["RED", "RED"],
      stats: {
        cost: 1,
        combat: 8,
        move: 4,
      },
      type: "UPGRADE",
      unitType: "Destroyer",
    },
    Nanomachines: {
      description: intl.formatMessage(
        {
          id: "Ral Nel Consortium.Techs.Nanomachines.Description",
          description: "Description for Tech: Nanomachines",
          defaultMessage:
            "ACTION: Exhaust this card to place 1 PDS on a planet you control.{br}ACTION: Exhaust this card to repair all of your damaged units.{br}ACTION: Exhaust this card and discard 1 action card to draw 1 action card.",
        },
        { br: "\n\n" }
      ),
      expansion: "THUNDERS EDGE",
      faction: "Ral Nel Consortium",
      id: "Nanomachines",
      name: intl.formatMessage({
        id: "Ral Nel Consortium.Techs.Nanomachines.Title",
        description: "Title of Tech: Nanomachines",
        defaultMessage: "Nanomachines",
      }),
      prereqs: ["RED"],
      type: "RED",
    },
  };
}
