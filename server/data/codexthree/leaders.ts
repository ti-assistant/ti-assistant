import { IntlShape } from "react-intl";

export default function getCodexThreeLeaders(
  intl: IntlShape
): Record<CodexThree.LeaderId, BaseLeader> {
  return {
    "Harka Leeds": {
      abilityName: intl.formatMessage({
        id: "Council Keleres.Leaders.Harka Leeds.AbilityName",
        description: "Ability name for Keleres Hero: Harka Leeds",
        defaultMessage: "ERWAN'S COVENANT",
      }),
      description: intl.formatMessage(
        {
          id: "Council Keleres.Leaders.Harka Leeds.Description",
          description: "Description for Keleres Hero: Harka Leeds",
          defaultMessage:
            "ACTION: Reveal cards from the action card deck until you reveal 3 action cards that have component actions. Draw those cards and shuffle the rest back into the action card deck{br}Then, purge this card",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "Harka Leeds",
      name: intl.formatMessage({
        id: "Council Keleres.Leaders.Harka Leeds.Name",
        description: "Name of Keleres Hero: Harka Leeds",
        defaultMessage: "Harka Leeds",
      }),
      subFaction: "Mentak Coalition",
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Kuuasi Aun Jalatai": {
      abilityName: intl.formatMessage({
        id: "Council Keleres.Leaders.Kuuasi Aun Jalatai.AbilityName",
        description: "Ability name for Keleres Hero: Kuuasi Aun Jalatai",
        defaultMessage: "OVERWING ZETA",
      }),
      description: intl.formatMessage(
        {
          id: "Council Keleres.Leaders.Kuuasi Aun Jalatai.Description",
          description: "Description for Keleres Hero: Kuuasi Aun Jalatai",
          defaultMessage:
            "At the start of a round of space combat in a system that contains a planet you control: Place your flagship and up to a total of 2 cruisers and/or destroyers from your reinforcements in the active system.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "Kuuasi Aun Jalatai",
      name: intl.formatMessage({
        id: "Council Keleres.Leaders.Kuuasi Aun Jalatai.Name",
        description: "Name of Keleres Hero: Kuuasi Aun Jalatai",
        defaultMessage: "Kuuasi Aun Jalatai",
      }),
      subFaction: "Argent Flight",
      timing: "TACTICAL_ACTION",
      type: "HERO",
    },
    "Odlynn Myrr": {
      abilityName: intl.formatMessage({
        id: "Council Keleres.Leaders.Odlynn Myrr.AbilityName",
        description: "Ability name for Keleres Hero: Odlynn Myrr",
        defaultMessage: "OPERATION ARCHON",
      }),
      description: intl.formatMessage(
        {
          id: "Council Keleres.Leaders.Odlynn Myrr.Description",
          description: "Description for Keleres Hero: Odlynn Myrr",
          defaultMessage:
            "After an agenda is revealed:{br}You may cast up to 6 additional votes on this agenda. Predict aloud an outcome for this agenda. For each player that votes for another outcome, gain 1 trade good and 1 command token.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "Odlynn Myrr",
      name: intl.formatMessage({
        id: "Council Keleres.Leaders.Odlynn Myrr.Name",
        description: "Name of Keleres Hero: Odlynn Myrr",
        defaultMessage: "Odlynn Myrr",
      }),
      subFaction: "Xxcha Kingdom",
      timing: "AGENDA_PHASE",
      type: "HERO",
    },
    "Suffi An (Council)": {
      description: intl.formatMessage(
        {
          id: "Council Keleres.Leaders.Suffi An.Description",
          description: "Description for Keleres Commander: Suffi An",
          defaultMessage:
            "After you perform a component action:{br}You may perform an additional action.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "Suffi An (Council)",
      name: intl.formatMessage({
        id: "Council Keleres.Leaders.Suffi An.Name",
        description: "Name of Keleres Commander: Suffi An",
        defaultMessage: "Suffi An",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Council Keleres.Leaders.Suffi An.Unlock",
        description: "Unlock condition for Keleres Commander: Suffi An",
        defaultMessage:
          "Spend 1 trade good after you play an action card that has a component action.",
      }),
    },
    "Xander Alexin Victori III": {
      description: intl.formatMessage(
        {
          id: "Council Keleres.Leaders.Xander Alexin Victori III.Description",
          description:
            "Description for Keleres Agent: Xander Alexin Victori III",
          defaultMessage:
            "At any time:{br}You may exhaust this card to allow any player to spend commodities as if they were trade goods.",
        },
        { br: "\n\n" }
      ),
      expansion: "CODEX THREE",
      faction: "Council Keleres",
      id: "Xander Alexin Victori III",
      name: intl.formatMessage({
        id: "Council Keleres.Leaders.Xander Alexin Victori III.Name",
        description: "Name of Keleres Agent: Xander Alexin Victori III",
        defaultMessage: "Xander Alexin Victori III",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
  };
}
