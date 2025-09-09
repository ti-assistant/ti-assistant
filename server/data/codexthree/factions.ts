import { IntlShape } from "react-intl";
import { sustainDamage } from "../../../src/util/strings";

export default function getCodexThreeFactions(
  intl: IntlShape
): Record<CodexThree.FactionId, BaseFaction> {
  return {
    "Council Keleres": {
      abilities: [
        {
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.The Tribunii.Title",
            description: "Title of Faction Ability: The Tribunii",
            defaultMessage: "The Tribunii",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.The Tribunii.Description",
            description: "Description for Faction Ability: The Tribunii",
            defaultMessage:
              "During setup, choose an unplayed faction from among the Mentak, the Xxcha and the Argent Flight; take that faction's home system, command tokens and control markers. Additionally, take the Keleres Hero that corresponds to that faction.",
          }),
          omegas: [
            {
              description: intl.formatMessage({
                id: "Council Keleres.Abilities.The Tribunii.Thunder's Edge.Description.",
                description: "Description for Faction Ability: The Tribunii",
                defaultMessage:
                  "During setup, choose a Keleres hero that corresponds to an unused faction; take that faction's home system, command tokens and control tokens. The unchosen Keleres heroes are not used.",
              }),
              expansion: "THUNDERS EDGE",
            },
          ],
        },
        {
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.Council Patronage.Title",
            description: "Title of Faction Ability: Council Patronage",
            defaultMessage: "Council Patronage",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.Council Patronage.Description",
            description: "Description for Faction Ability: Council Patronage",
            defaultMessage:
              "Replenish your commodities at the start of the strategy phase, then gain 1 trade good.",
          }),
        },
        {
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.Law's Order.Title",
            description: "Title of Faction Ability: Law's Order",
            defaultMessage: "Law's Order",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.Law's Order.Description",
            description: "Description for Faction Ability: Law's Order",
            defaultMessage:
              "You may spend 1 influence at the start of your turn to treat all laws as blank until the end of your turn.",
          }),
          omegas: [
            {
              description: intl.formatMessage({
                id: "Council Keleres.Abilities.Law's Order.Thunder's Edge.Description",
                description: "Description for Faction Ability: Law's Order",
                defaultMessage:
                  "You may spend 1 trade good or 1 commodity at the start of any player's turn to treat all laws as blank until the end of that turn.",
              }),
              expansion: "THUNDERS EDGE",
            },
          ],
        },
      ],
      colors: {
        Blue: 0.5,
        Orange: 0.35,
        Purple: 0.7,
        Yellow: 0.35,
      },
      colorList: [
        "Purple",
        "Blue",
        "Yellow",
        "Orange",
        "Red",
        "Green",
        "Purple",
        "Magenta",
      ],
      commodities: 2,
      expansion: "CODEX THREE",
      id: "Council Keleres",
      name: intl.formatMessage({
        id: "Council Keleres.Name",
        description: "Name of Faction: Council Keleres",
        defaultMessage: "Council Keleres",
      }),
      omegas: [
        {
          expansion: "THUNDERS EDGE",
        },
      ],
      promissories: [
        {
          name: intl.formatMessage({
            id: "Council Keleres.Promissories.Keleres Rider.Title",
            description: "Title of Faction Promissory: Keleres Rider",
            defaultMessage: "Keleres Rider",
          }),
          description: intl.formatMessage(
            {
              id: "Council Keleres.Promissories.Keleres Rider.Description",
              description: "Description for Faction Promissory: Keleres Rider",
              defaultMessage:
                "After an agenda is revealed:{br}You cannot vote on this agenda. Predict aloud an outcome of this agenda. If your prediction is correct, draw 1 action card and gain 2 trade goods.{br}Then, return this card to the Keleres player.",
            },
            { br: "\n\n" }
          ),
        },
      ],
      shortname: intl.formatMessage({
        id: "Council Keleres.Shortname",
        description: "Shortened version of Faction name: Council Keleres",
        defaultMessage: "Keleres",
      }),
      startswith: {
        choice: {
          options: [],
          select: 2,
        },
        planetchoice: {
          options: ["Argent Flight", "Mentak Coalition", "Xxcha Kingdom"],
        },
        units: {
          Carrier: 2,
          Cruiser: 1,
          Fighter: 2,
          Infantry: 2,
          "Space Dock": 1,
        },
      },
      units: [
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Council Keleres.Units.Artemiris.Description",
            description: "Description for Faction Unit: Artemiris",
            defaultMessage:
              "Other players must spend 2 influence to activate the system that contains this ship.",
          }),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Council Keleres.Units.Artemiris.Title",
            description: "Title of Faction Unit: Artemiris",
            defaultMessage: "Artemiris",
          }),
          omegas: [
            {
              expansion: "THUNDERS EDGE",
              description: intl.formatMessage({
                id: "Council Keleres.Units.Artemiris.Omega.Description",
                description: "Description for Faction Unit: Artemiris",
                defaultMessage:
                  "Other players must spend 2 influence to activate this system.",
              }),
            },
          ],
          stats: {
            cost: 8,
            combat: "7(x2)",
            move: 1,
            capacity: 6,
          },
          type: "Flagship",
        },
        {
          abilities: [sustainDamage(intl)],
          description: intl.formatMessage({
            id: "Council Keleres.Units.Omniopiares.Description",
            description: "Description for Faction Unit: Omniopiares",
            defaultMessage:
              "Other players must spend 1 influence to commit ground forces to the planet that contains this unit.",
          }),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Council Keleres.Units.Omniopiares.Title",
            description: "Title of Faction Unit: Omniopiares",
            defaultMessage: "Omniopiares",
          }),
          stats: {
            cost: 2,
            combat: 6,
          },
          type: "Mech",
        },
      ],
    },
  };
}
