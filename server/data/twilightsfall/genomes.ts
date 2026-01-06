import { IntlShape } from "react-intl";

export default function getTwilightsFallGenomes(
  intl: IntlShape
): Record<TwilightsFall.TFGenomeId, TFBaseGenome> {
  return {
    "Action Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Action Genome.Text",
          description: "Text of Twilight's Fall Genome: Action Genome",
          defaultMessage:
            "At any time:{br}You may exhaust this card to allow any player to spend commodities as if they were trade goods.",
        },
        { br: "\n\n" }
      ),
      id: "Action Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Action Genome.Name",
        description: "Name of Twilight's Fall Genome: Action Genome",
        defaultMessage: "Action Genome",
      }),
      origin: "Council Keleres",
      subName: "Efficiency",
      timing: "OTHER",
    },
    "Altruistic Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Altruistic Genome.Text",
          description: "Text of Twilight's Fall Genome: Altruistic Genome",
          defaultMessage:
            "When a hit is produced against a unit:{br}You may exhaust this card to cancel that hit.",
        },
        { br: "\n\n" }
      ),
      id: "Altruistic Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Altruistic Genome.Name",
        description: "Name of Twilight's Fall Genome: Altruistic Genome",
        defaultMessage: "Altruistic Genome",
      }),
      origin: "Titans of Ul",
      subName: "Mettle",
      timing: "OTHER",
    },
    "Aristocratic Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Aristocratic Genome.Text",
          description: "Text of Twilight's Fall Genome: Aristocratic Genome",
          defaultMessage:
            "At the start of a space combat round:{br}You may exhaust this card to choose 1 ship in the active system; that ship rolls 1 additional die during this combat round.",
        },
        { br: "\n\n" }
      ),
      id: "Aristocratic Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Aristocratic Genome.Name",
        description: "Name of Twilight's Fall Genome: Aristocratic Genome",
        defaultMessage: "Aristocratic Genome",
      }),
      origin: "Barony of Letnev",
      subName: "Dominance",
      timing: "OTHER",
    },
    "Breach Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Breach Genome.Text",
          description: "Text of Twilight's Fall Genome: Breach Genome",
          defaultMessage:
            "ACTION: Exhaust this card to choose 1 player. That player may swap the position of 2 of their ships in any systems; they may transport units when they swap.",
        },
        { br: "\n\n" }
      ),
      id: "Breach Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Breach Genome.Name",
        description: "Name of Twilight's Fall Genome: Breach Genome",
        defaultMessage: "Breach Genome",
      }),
      origin: "Crimson Rebellion",
      subName: "Instability",
      timing: "COMPONENT_ACTION",
    },
    "Brutal Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Brutal Genome.Text",
          description: "Text of Twilight's Fall Genome: Brutal Genome",
          defaultMessage:
            "After a player activates a system:{br}You may exhaust this card to allow that player to replace 1 of their infantry in the active system with 1 mech from their reinforcements.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Brutal Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Brutal Genome.Name",
        description: "Name of Twilight's Fall Genome: Brutal Genome",
        defaultMessage: "Brutal Genome",
      }),
      origin: "L1Z1X Mindnet",
      subName: "Severity",
      timing: "OTHER",
    },
    "Captains Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Captain's Genome.Text",
          description: "Text of Twilight's Fall Genome: Captain's Genome",
          defaultMessage:
            "After a player activates a system:{br}You may exhaust this card to increase the move value of 1 of that player's ships to match the move value of the ship on the game board that has the highest move value.",
        },
        { br: "\n\n" }
      ),
      id: "Captains Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Captain's Genome.Name",
        description: "Name of Twilight's Fall Genome: Captain's Genome",
        defaultMessage: "Captain's Genome",
      }),
      origin: "Clan of Saar",
      subName: "Momentum",
      timing: "OTHER",
    },
    "Clever Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Clever Genome.Text",
          description: "Text of Twilight's Fall Genome: Clever Genome",
          defaultMessage:
            "This card has the text ability of each other player's genomes, even if those genomes are exhausted.",
        },
        { br: "\n\n" }
      ),
      id: "Clever Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Clever Genome.Name",
        description: "Name of Twilight's Fall Genome: Clever Genome",
        defaultMessage: "Clever Genome",
      }),
      origin: "Yssaril Tribes",
      subName: "Acuity",
      timing: "OTHER",
    },
    "Cosmic Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Cosmic Genome.Text",
          description: "Text of Twilight's Fall Genome: Cosmic Genome",
          defaultMessage:
            "After a player moves ships into a system that does not contain any planets:{br}You may exhaust this card; that player gains 1 command token.",
        },
        { br: "\n\n" }
      ),
      id: "Cosmic Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Cosmic Genome.Name",
        description: "Name of Twilight's Fall Genome: Cosmic Genome",
        defaultMessage: "Cosmic Genome",
      }),
      origin: "Empyrean",
      subName: "Enlightenment",
      timing: "OTHER",
    },
    "Courier Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Courier Genome.Text",
          description: "Text of Twilight's Fall Genome: Courier Genome",
          defaultMessage:
            "ACTION: Exhaust this card to draw 2 action cards; give 1 of those cards to another player.",
        },
        { br: "\n\n" }
      ),
      id: "Courier Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Courier Genome.Name",
        description: "Name of Twilight's Fall Genome: Courier Genome",
        defaultMessage: "Courier Genome",
      }),
      origin: "Ral Nel Consortium",
      subName: "Reliability",
      timing: "COMPONENT_ACTION",
    },
    "Curious Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Curious Genome.Text",
          description: "Text of Twilight's Fall Genome: Curious Genome",
          defaultMessage:
            "At the end of a player's turn:{br}You may exhaust this card to allow that player to explore 1 of their planets.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Curious Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Curious Genome.Name",
        description: "Name of Twilight's Fall Genome: Curious Genome",
        defaultMessage: "Curious Genome",
      }),
      origin: "Naaz-Rokha Alliance",
      subName: "Perseverence",
      timing: "OTHER",
    },
    "Deployment Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Deployment Genome.Text",
          description: "Text of Twilight's Fall Genome: Deployment Genome",
          defaultMessage:
            "At the end of a player's turn:{br}You may exhaust this card to allow that player to remove up to 2 of their ground forces from the game board and place them on planets they control in the active system.",
        },
        { br: "\n\n" }
      ),
      id: "Deployment Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Deployment Genome.Name",
        description: "Name of Twilight's Fall Genome: Deployment Genome",
        defaultMessage: "Deployment Genome",
      }),
      origin: "Nomad",
      subName: "Echo of Conflict",
      timing: "OTHER",
    },
    "Diplomatic Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Diplomatic Genome.Text",
          description: "Text of Twilight's Fall Genome: Diplomatic Genome",
          defaultMessage:
            "ACTION: Exhaust this card to ready any planet; if that planet is in a system that is adjacent to a planet you control, you may remove 1 infantry from that planet and return it to its reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Diplomatic Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Diplomatic Genome.Name",
        description: "Name of Twilight's Fall Genome: Diplomatic Genome",
        defaultMessage: "Diplomatic Genome",
      }),
      origin: "Xxcha Kingdom",
      subName: "Serenity",
      timing: "COMPONENT_ACTION",
    },
    "Divine Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Divine Genome.Text",
          description: "Text of Twilight's Fall Genome: Divine Genome",
          defaultMessage:
            "When 1 or more of a player's units use PRODUCTION:{br}You may exhaust this card to reduce the combined cost of the produced units by 2.",
        },
        { br: "\n\n" }
      ),
      id: "Divine Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Divine Genome.Name",
        description: "Name of Twilight's Fall Genome: Divine Genome",
        defaultMessage: "Divine Genome",
      }),
      origin: "Winnu",
      subName: "Sovereignity",
      timing: "OTHER",
    },
    "Enigmatic Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Enigmatic Genome.Text",
          description: "Text of Twilight's Fall Genome: Enigmatic Genome",
          defaultMessage:
            "After a player activates a non-home system that contains a wormhole:{br}You may exhaust this card; if you do, that system is adjacent to all other systems that contain a wormhole during this tactical action.",
        },
        { br: "\n\n" }
      ),
      id: "Enigmatic Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Enigmatic Genome.Name",
        description: "Name of Twilight's Fall Genome: Enigmatic Genome",
        defaultMessage: "Enigmatic Genome",
      }),
      origin: "Ghosts of Creuss",
      subName: "Mystery",
      timing: "OTHER",
    },
    "Experimental Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Experimental Genome.Text",
          description: "Text of Twilight's Fall Genome: Experimental Genome",
          defaultMessage:
            "When a player spends resources:{br}You may exhaust this card to allow that player to remove any number of their infantry from the game board. For each unit removed, reduce the resources spent by 1.",
        },
        { br: "\n\n" }
      ),
      id: "Experimental Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Experimental Genome.Name",
        description: "Name of Twilight's Fall Genome: Experimental Genome",
        defaultMessage: "Experimental Genome",
      }),
      origin: "Universities of Jol-Nar",
      subName: "Sacrifice",
      timing: "OTHER",
    },
    "Human Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Human Genome.Text",
          description: "Text of Twilight's Fall Genome: Human Genome",
          defaultMessage:
            "At the start of a ground combat round:{br}You may exhaust this card to choose 1 ground force in the active system; that ground force rolls 1 additional die during this combat round.",
        },
        { br: "\n\n" }
      ),
      id: "Human Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Human Genome.Name",
        description: "Name of Twilight's Fall Genome: Human Genome",
        defaultMessage: "Human Genome",
      }),
      origin: "Federation of Sol",
      subName: "Adaptability",
      timing: "OTHER",
    },
    "Hyper Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Hyper Genome.Text",
          description: "Text of Twilight's Fall Genome: Hyper Genome",
          defaultMessage:
            "At any time:{br}You may exhaust this card and choose another player; that player gives you 1 trade good, if able, then you each draw 1 action card.",
        },
        { br: "\n\n" }
      ),
      id: "Hyper Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Hyper Genome.Name",
        description: "Name of Twilight's Fall Genome: Hyper Genome",
        defaultMessage: "Hyper Genome",
      }),
      origin: "Mentak Coalition",
      subName: "Energy",
      timing: "OTHER",
    },
    "Investment Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Investment Genome.Text",
          description: "Text of Twilight's Fall Genome: Investment Genome",
          defaultMessage:
            "When you gain trade goods from the supply:{br}You may exhaust this card to place an equal number of trade goods on this card. When this card readies, gain the trade goods on this card.",
        },
        { br: "\n\n" }
      ),
      id: "Investment Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Investment Genome.Name",
        description: "Name of Twilight's Fall Genome: Investment Genome",
        defaultMessage: "Investment Genome",
      }),
      origin: "Nomad",
      subName: "Echo of Means",
      timing: "OTHER",
    },
    "Limit Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Limit Genome.Text",
          description: "Text of Twilight's Fall Genome: Limit Genome",
          defaultMessage:
            "After any player's command token is placed in a system:{br}You may exhaust this card to return that token to that player's reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Limit Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Limit Genome.Name",
        description: "Name of Twilight's Fall Genome: Limit Genome",
        defaultMessage: "Limit Genome",
      }),
      origin: "Naalu Collective",
      subName: "Unbound",
      timing: "OTHER",
    },
    "Mirror Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Mirror Genome.Text",
          description: "Text of Twilight's Fall Genome: Mirror Genome",
          defaultMessage:
            "When a player moves ships:{br}You may exhaust this card; if you do, SPACE CANNON cannot be used against those ships; if they are not transporting units, they can also move through other players' ships.",
        },
        { br: "\n\n" }
      ),
      id: "Mirror Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Mirror Genome.Name",
        description: "Name of Twilight's Fall Genome: Mirror Genome",
        defaultMessage: "Mirror Genome",
      }),
      origin: "Firmament",
      subName: "Deception",
      timing: "OTHER",
    },
    "Molten Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Molten Genome.Text",
          description: "Text of Twilight's Fall Genome: Molten Genome",
          defaultMessage:
            "ACTION: Exhaust this card to choose a player; that player may produce up to 2 units that each have a cost of 4 or less in a system that contains one of their war suns or their flagship.",
        },
        { br: "\n\n" }
      ),
      id: "Molten Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Molten Genome.Name",
        description: "Name of Twilight's Fall Genome: Molten Genome",
        defaultMessage: "Molten Genome",
      }),
      origin: "Embers of Muaat",
      subName: "Intensity",
      timing: "COMPONENT_ACTION",
    },
    "Pacific Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Pacific Genome.Text",
          description: "Text of Twilight's Fall Genome: Pacific Genome",
          defaultMessage:
            "ACTION: Exhaust this card and choose any player's non-fighter ship; that player may replace that ship with one from their reinforcements that costs up to 2 more than the replaced ship.",
        },
        { br: "\n\n" }
      ),
      id: "Pacific Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Pacific Genome.Name",
        description: "Name of Twilight's Fall Genome: Pacific Genome",
        defaultMessage: "Pacific Genome",
      }),
      origin: "Arborec",
      subName: "Abundance",
      timing: "COMPONENT_ACTION",
    },
    "Ravenous Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Ravenous Genome.Text",
          description: "Text of Twilight's Fall Genome: Ravenous Genome",
          defaultMessage:
            "After another player replenishes commodities:{br}You may exhaust this card to convert their commodities to trade goods and capture 1 unit from their reinforcements that has a cost equal to or lower than their commodity value.",
        },
        { br: "\n\n" }
      ),
      id: "Ravenous Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Ravenous Genome.Name",
        description: "Name of Twilight's Fall Genome: Ravenous Genome",
        defaultMessage: "Ravenous Genome",
      }),
      origin: "Vuil'raith Cabal",
      subName: "Hunger",
      timing: "OTHER",
    },
    "Recursive Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Recursive Genome.Text",
          description: "Text of Twilight's Fall Genome: Recursive Genome",
          defaultMessage:
            "During the action phase:{br}You may exhaust this card to choose a player; that player may discard 1 action card or spend 1 command token from their command sheet to gain 2 trade goods.",
        },
        { br: "\n\n" }
      ),
      id: "Recursive Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Recursive Genome.Name",
        description: "Name of Twilight's Fall Genome: Recursive Genome",
        defaultMessage: "Recursive Genome",
      }),
      origin: "Nekro Virus",
      subName: "_ERROR_ERROR_ERROR_ERROR_",
      timing: "OTHER",
    },
    "Research Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Research Genome.Text",
          description: "Text of Twilight's Fall Genome: Research Genome",
          defaultMessage:
            "When a player initiates a splice:{br}You may exhaust this card to add 3 additional cards to that splice.",
        },
        { br: "\n\n" }
      ),
      id: "Research Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Research Genome.Name",
        description: "Name of Twilight's Fall Genome: Research Genome",
        defaultMessage: "Research Genome",
      }),
      origin: "Deepwrought Scholarate",
      subName: "Erudition",
      timing: "OTHER",
    },
    "Scornful Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Scornful Genome.Text",
          description: "Text of Twilight's Fall Genome: Scornful Genome",
          defaultMessage:
            "When a player produces ground forces in a system:{br}You may exhaust this card; that player may place those units on any planets they control in that system and any adjacent systems.",
        },
        { br: "\n\n" }
      ),
      id: "Scornful Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Scornful Genome.Name",
        description: "Name of Twilight's Fall Genome: Scornful Genome",
        defaultMessage: "Scornful Genome",
      }),
      origin: "Argent Flight",
      subName: "Zeal",
      timing: "OTHER",
    },
    "Silver Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Silver Genome.Text",
          description: "Text of Twilight's Fall Genome: Silver Genome",
          defaultMessage:
            "During the action phase:{br}You may exhaust this card to gain 2 commodities or replenish another player's commodities.",
        },
        { br: "\n\n" }
      ),
      id: "Silver Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Silver Genome.Name",
        description: "Name of Twilight's Fall Genome: Silver Genome",
        defaultMessage: "Silver Genome",
      }),
      origin: "Emirates of Hacan",
      subName: "Prosperity",
      timing: "OTHER",
    },
    "Splitting Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Splitting Genome.Text",
          description: "Text of Twilight's Fall Genome: Splitting Genome",
          defaultMessage:
            "After a player's destroyer or cruiser is destroyed:{br}You may exhaust this card. If you do, that player may place up to 2 fighters from their reinforcements in that unit's system.",
        },
        { br: "\n\n" }
      ),
      id: "Splitting Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Splitting Genome.Name",
        description: "Name of Twilight's Fall Genome: Splitting Genome",
        defaultMessage: "Splitting Genome",
      }),
      origin: "Yin Brotherhood",
      subName: "Replication",
      timing: "OTHER",
    },
    "Swarm Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Swarm Genome.Text",
          description: "Text of Twilight's Fall Genome: Swarm Genome",
          defaultMessage:
            "At the end of a player's tactical action:{br}You may exhaust this card; if you do, that player may place 2 infantry from their reinforcements on a planet they control in the active system.",
        },
        { br: "\n\n" }
      ),
      id: "Swarm Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Swarm Genome.Name",
        description: "Name of Twilight's Fall Genome: Swarm Genome",
        defaultMessage: "Swarm Genome",
      }),
      origin: "Sardakk N'orr",
      subName: "Fervor",
      timing: "OTHER",
    },
    "Temporal Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Temporal Genome.Text",
          description: "Text of Twilight's Fall Genome: Temporal Genome",
          defaultMessage:
            'After the "Roll Dice" step of combat:{br}You may exhaust this card. If you do, hits are not assigned to either players\' units. Return to the start of this combat round\'s "Roll Dice" step.',
        },
        { br: "\n\n" }
      ),
      id: "Temporal Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Temporal Genome.Name",
        description: "Name of Twilight's Fall Genome: Temporal Genome",
        defaultMessage: "Temporal Genome",
      }),
      origin: "Nomad",
      subName: "Echo of Time",
      timing: "OTHER",
    },
    "Valiant Genome": {
      description: intl.formatMessage(
        {
          id: "TF.Genome.Valiant Genome.Text",
          description: "Text of Twilight's Fall Genome: Valiant Genome",
          defaultMessage:
            "When a player's unit is destroyed during combat:{br}You may exhaust this card to roll 1 die. If the result is equal to or greater than that unit's combat value, their opponent must choose and destroy 1 of their units.",
        },
        { br: "\n\n" }
      ),
      id: "Valiant Genome",
      name: intl.formatMessage({
        id: "TF.Genome.Valiant Genome.Name",
        description: "Name of Twilight's Fall Genome: Valiant Genome",
        defaultMessage: "Valiant Genome",
      }),
      origin: "Last Bastion",
      subName: "Courage",
      timing: "OTHER",
    },
  };
}
