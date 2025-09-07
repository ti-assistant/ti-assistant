import { IntlShape } from "react-intl";

export default function getProphecyOfKingsLeaders(
  intl: IntlShape
): Record<ProphecyOfKings.LeaderId, BaseLeader> {
  return {
    "2RAM": {
      description: intl.formatMessage({
        id: "L1Z1X Mindnet.Leaders.2RAM.Description",
        description: "Description for L1Z1X Commander: 2RAM",
        defaultMessage:
          "Units that have PLANETARY SHIELD do not prevent you from using BOMBARDMENT.",
      }),
      expansion: "POK",
      faction: "L1Z1X Mindnet",
      id: "2RAM",
      name: intl.formatMessage({
        id: "L1Z1X Mindnet.Leaders.2RAM.Name",
        description: "Name of L1Z1X Commander: 2RAM",
        defaultMessage: "2RAM",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "L1Z1X Mindnet.Leaders.2RAM.Unlock",
        description: "Unlock condition for L1Z1X Commander: 2RAM",
        defaultMessage: "Have 4 dreadnoughts on the Board.",
      }),
    },
    Acamar: {
      description: intl.formatMessage(
        {
          id: "Empyrean.Leaders.Acamar.Description",
          description: "Description for Empyrean Agent: Acamar",
          defaultMessage:
            "After a player moves ships into a system that does not contain any planets:{br}You may exhaust this card; that player gains 1 command token.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Empyrean",
      id: "Acamar",
      name: intl.formatMessage({
        id: "Empyrean.Leaders.Acamar.Name",
        description: "Name for Empyrean Agent: Acamar",
        defaultMessage: "Acamar",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Adjudicator Ba'al": {
      abilityName: intl.formatMessage({
        id: "Embers of Muaat.Leaders.Adjudicator Ba'al.AbilityName",
        description: "Ability name for Muaat Hero: Adjudicator Ba'al",
        defaultMessage: "NOVA SEED",
      }),
      description: intl.formatMessage(
        {
          id: "Embers of Muaat.Leaders.Adjudicator Ba'al.Description",
          description: "Description for Muaat Hero: Adjudicator Ba'al",
          defaultMessage:
            "After you move a war sun into a non-home system other than Mecatol Rex:{br}You may destroy all other players' units in that system and replace that system tile with the Muaat supernova tile. If you do, purge this card and each planet card that corresponds to the replaced system tile.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Embers of Muaat",
      id: "Adjudicator Ba'al",
      name: intl.formatMessage({
        id: "Embers of Muaat.Leaders.Adjudicator Ba'al.Name",
        description: "Name of Muaat Hero: Adjudicator Ba'al",
        defaultMessage: "Adjudicator Ba'al",
      }),
      timing: "TACTICAL_ACTION",
      type: "HERO",
    },
    "Airo Shir Aur": {
      abilityName: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Leaders.Airo Shir Aur.AbilityName",
        description: "Ability name for Mahact Hero: Airo Shir Aur",
        defaultMessage: "BENEDICTION",
      }),
      description: intl.formatMessage(
        {
          id: "Mahact Gene-Sorcerers.Leaders.Airo Shir Aur.Description",
          description: "Description for Mahact Hero: Airo Shir Aur",
          defaultMessage:
            "ACTION: Move all units in the space area of any system to an adjacent system that contains a different player's ships. Space Combat is resolved in that system; neither player can retreat or resolve abilities that would move their ships{br}Then, purge this card",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Mahact Gene-Sorcerers",
      id: "Airo Shir Aur",
      name: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Leaders.Airo Shir Aur.Name",
        description: "Name of Mahact Hero: Airo Shir Aur",
        defaultMessage: "Airo Shir Aur",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Ahk-Syl Siven": {
      abilityName: intl.formatMessage({
        id: "Nomad.Leaders.Ahk-Syl Siven.AbilityName",
        description: "Ability name for Nomad Hero: Ahk-Syl Siven",
        defaultMessage: "PROBABILITY MATRIX",
      }),
      description: intl.formatMessage(
        {
          id: "Nomad.Leaders.Ahk-Syl Siven.Description",
          description: "Description for Nomad Hero: Ahk-Syl Siven",
          defaultMessage:
            "ACTION: Place this card near the game board; your flagship and units it transports can move out of systems that contain your command tokens during this game round{br}At the end of that game round, purge this card",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nomad",
      id: "Ahk-Syl Siven",
      name: intl.formatMessage({
        id: "Nomad.Leaders.Ahk-Syl Siven.Name",
        description: "Name of Nomad Hero: Ahk-Syl Siven",
        defaultMessage: "Ahk-Syl Siven",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Artuno the Betrayer": {
      description: intl.formatMessage(
        {
          id: "Nomad.Leaders.Artuno the Betrayer.Description",
          description: "Description for Nomad Agent: Artuno the Betrayer",
          defaultMessage:
            "When you gain trade goods from the supply:{br}You may exhaust this card to place an equal number of trade goods on this card. When this card readies, gain the trade goods on this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nomad",
      id: "Artuno the Betrayer",
      name: intl.formatMessage({
        id: "Nomad.Leaders.Artuno the Betrayer.Name",
        description: "Name of Nomad Agent: Artuno the Betrayer",
        defaultMessage: "Artuno the Betrayer",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Berekar Berekon": {
      description: intl.formatMessage(
        {
          id: "Winnu.Leaders.Berekar Berekon.Description",
          description: "Description for Winnu Agent: Berekar Berekon",
          defaultMessage:
            "When 1 or more of a player's units use PRODUCTION:{br}You may exhaust this card to reduce the combined cost of the produced units by 2.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Winnu",
      id: "Berekar Berekon",
      name: intl.formatMessage({
        id: "Winnu.Leaders.Berekar Berekon.Name",
        description: "Name of Winnu Agent: Berekar Berekon",
        defaultMessage: "Berekar Berekon",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Brother Milor": {
      description: intl.formatMessage(
        {
          id: "Yin Brotherhood.Leaders.Brother Milor.Description",
          description: "Description for Yin Agent: Brother Milor",
          defaultMessage:
            "After a player's destroyer or cruiser is destroyed:{br}You may exhaust this card; if you do, that player may place up to 2 fighters from their reinforcements in that unit's system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Yin Brotherhood",
      id: "Brother Milor",
      name: intl.formatMessage({
        id: "Yin Brotherhood.Leaders.Brother Milor.Name",
        description: "Name of Yin Agent: Brother Milor",
        defaultMessage: "Brother Milor",
      }),
      omegas: [
        {
          description: intl.formatMessage(
            {
              id: "Yin Brotherhood.Leaders.Brother Milor.Omega.Description",
              description: "Description for Yin Agent: Brother Milor Ω",
              defaultMessage:
                "After a player's unit is destroyed:{br}You may exhaust this card to allow that player to place 2 fighters in the destroyed unit's system if it was a ship, or 2 infantry on its planet if it was a ground force.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Leaders.Brother Milor.Omega.Name",
            description: "Name of Yin Agent: Brother Milor Ω",
            defaultMessage: "Brother Milor Ω",
          }),
        },
      ],
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Brother Omar": {
      description: intl.formatMessage(
        {
          id: "Yin Brotherhood.Leaders.Brother Omar.Description",
          description: "Description for Yin Commander: Brother Omar",
          defaultMessage:
            "This card satisfies a green technology prerequisite.{br}You may produce 1 additional infantry for their cost. These infantry do not count against your production limit.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Yin Brotherhood",
      id: "Brother Omar",
      name: intl.formatMessage({
        id: "Yin Brotherhood.Leaders.Brother Omar.Name",
        description: "Name of Yin Commander: Brother Omar",
        defaultMessage: "Brother Omar",
      }),
      omegas: [
        {
          description: intl.formatMessage(
            {
              id: "Yin Brotherhood.Leaders.Brother Omar.Omega.Description",
              description: "Description for Yin Commander: Brother Omar Ω",
              defaultMessage:
                "This card satisfies a green technology prerequisite.{br}When you research a technology owned by another player, you may return 1 of your infantry to reinforcements to ignore its prerequisites.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Leaders.Brother Omar.Omega.Name",
            description: "Name of Yin Commander: Brother Omar Ω",
            defaultMessage: "Brother Omar Ω",
          }),
          unlock: intl.formatMessage({
            id: "Yin Brotherhood.Leaders.Brother Omar.Omega.Unlock",
            description: "Unlock condition for Yin Commander: Brother Omar Ω",
            defaultMessage: "Use one of your faction abilities.",
          }),
        },
      ],
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Yin Brotherhood.Leaders.Brother Omar.Unlock",
        description: "Unlock condition for Yin Commander: Brother Omar",
        defaultMessage: "Use your INDOCTRINATION faction ability.",
      }),
    },
    "Captain Mendosa": {
      description: intl.formatMessage(
        {
          id: "Clan of Saar.Leaders.Captain Mendosa.Description",
          description: "Description for Saar Agent: Captain Mendosa",
          defaultMessage:
            "After a player activates a system:{br}You may exhaust this card to increase the move value of 1 of that player's ships to match the move value of the ship on the game board that has the highest move value.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Clan of Saar",
      id: "Captain Mendosa",
      name: intl.formatMessage({
        id: "Clan of Saar.Leaders.Captain Mendosa.Name",
        description: "Name of Saar Agent: Captain Mendosa",
        defaultMessage: "Captain Mendosa",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Carth of Golden Sands": {
      description: intl.formatMessage(
        {
          id: "Emirates of Hacan.Leaders.Carth of Golden Sands.Description",
          description: "Description for Hacan Agent: Carth of Golden Sands",
          defaultMessage:
            "During the action phase:{br}You may exhaust this card to gain 2 commodities or replenish another player's commodities.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Emirates of Hacan",
      id: "Carth of Golden Sands",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Leaders.Carth of Golden Sands.Name",
        description: "Name of Hacan Agent: Carth of Golden Sands",
        defaultMessage: "Carth of Golden Sands",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Claire Gibson": {
      description: intl.formatMessage(
        {
          id: "Federation of Sol.Leaders.Claire Gibson.Description",
          description: "Description for Sol Commander: Claire Gibson",
          defaultMessage:
            "At the start of a ground combat on a planet you control:{br}You may place 1 infantry from your reinforcements on that planet.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Federation of Sol",
      id: "Claire Gibson",
      name: intl.formatMessage({
        id: "Federation of Sol.Leaders.Claire Gibson.Name",
        description: "Name of Sol Commander: Claire Gibson",
        defaultMessage: "Claire Gibson",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Federation of Sol.Leaders.Claire Gibson.Unlock",
        description: "Unlock condition for Sol Commander: Claire Gibson",
        defaultMessage:
          "Control planets that have a combined total of at least 12 resources.",
      }),
    },
    "Conservator Procyon": {
      abilityName: intl.formatMessage({
        id: "Empyrean.Leaders.Conservator Procyon.AbilityName",
        description: "Ability name for Empyrean Hero: Conservator Procyon",
        defaultMessage: "MULTIVERSE SHIFT",
      }),
      description: intl.formatMessage(
        {
          id: "Empyrean.Leaders.Conservator Procyon.Description",
          description: "Description for Empyrean Hero: Conservator Procyon",
          defaultMessage:
            "ACTION: Place 1 frontier token in each system that does not contain any planets and does not already have a frontier token. Then, explore each frontier token that is in a system that contains 1 or more of your ships.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Empyrean",
      id: "Conservator Procyon",
      name: intl.formatMessage({
        id: "Empyrean.Leaders.Conservator Procyon.Name",
        description: "Name of Empyrean Hero: Conservator Procyon",
        defaultMessage: "Conservator Procyon",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Dannel of the Tenth": {
      abilityName: intl.formatMessage({
        id: "Yin Brotherhood.Leaders.Dannel of the Tenth.AbilityName",
        description: "Ability name for Yin Hero: Dannel of the Tenth",
        defaultMessage: "SPINNER OVERDRIVE",
      }),
      description: intl.formatMessage(
        {
          id: "Yin Brotherhood.Leaders.Dannel of the Tenth.Description",
          description: "Description for Yin Hero: Dannel of the Tenth",
          defaultMessage:
            "ACTION: For each planet that contains any number of your infantry, either ready that planet or place an equal number of infantry from your reinforcements on that planet.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Yin Brotherhood",
      id: "Dannel of the Tenth",
      name: intl.formatMessage({
        id: "Yin Brotherhood.Leaders.Dannel of the Tenth.Name",
        description: "Name of Yin Hero: Dannel of the Tenth",
        defaultMessage: "Dannel of the Tenth",
      }),
      omegas: [
        {
          abilityName: intl.formatMessage({
            id: "Yin Brotherhood.Leaders.Dannel of the Tenth.Omega.AbilityName",
            description: "Ability name for Yin Hero: Dannel of the Tenth Ω",
            defaultMessage: "QUANTUM DISSEMINATION Ω",
          }),
          description: intl.formatMessage(
            {
              id: "Yin Brotherhood.Leaders.Dannel of the Tenth.Omega.Description",
              description: "Description for Yin Hero: Dannel of the Tenth Ω",
              defaultMessage:
                "ACTION: Commit up to 3 infantry from your reinforcements to any non-home planets and resolve invasions on those planets; players cannot use SPACE CANNON against those units.{br}Then, purge this card.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Yin Brotherhood.Leaders.Dannel of the Tenth.Omega.Name",
            description: "Name of Yin Hero: Dannel of the Tenth Ω",
            defaultMessage: "Dannel of the Tenth Ω",
          }),
        },
      ],
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Darktalon Treilla": {
      abilityName: intl.formatMessage({
        id: "Barony of Letnev.Leaders.Darktalon Treilla.AbilityName",
        description: "Ability name for Letnev Hero: Darktalon Treilla",
        defaultMessage: "DARK MATTER AFFINITY",
      }),
      description: intl.formatMessage(
        {
          id: "Barony of Letnev.Leaders.Darktalon Treilla.Description",
          description: "Description for Letnev Hero: Darktalon Treilla",
          defaultMessage:
            "ACTION: Place this card near the game board; the number of non-fighter ships you can have in systems is not limited by laws or by the number of command tokens in your fleet pool during this game round.{br}At the end of that game round, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Barony of Letnev",
      id: "Darktalon Treilla",
      name: intl.formatMessage({
        id: "Barony of Letnev.Leaders.Darktalon Treilla.Name",
        description: "Name of Letnev Hero: Darktalon Treilla",
        defaultMessage: "Darktalon Treilla",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Dart and Tai": {
      description: intl.formatMessage(
        {
          id: "Naaz-Rokha Alliance.Leaders.Dart and Tai.Description",
          description: "Description for Naaz-Rokha Commander: Dart and Tai",
          defaultMessage:
            "After you gain control of a planet that was controlled by another player:{br}You may explore that planet.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Naaz-Rokha Alliance",
      id: "Dart and Tai",
      name: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Leaders.Dart and Tai.Name",
        description: "Name of Naaz-Rokha Commander: Dart and Tai",
        defaultMessage: "Dart and Tai",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Leaders.Dart and Tai.Unlock",
        description: "Unlock condition for Naaz-Rokha Commander: Dart and Tai",
        defaultMessage: "Have 3 mechs in 3 systems.",
      }),
    },
    "Dirzuga Rophal": {
      description: intl.formatMessage(
        {
          id: "Arborec.Leaders.Dirzuga Rophal.Description",
          description: "Description for Arborec Commander: Dirzuga Rophal",
          defaultMessage:
            "After another player activates a system that contains 1 or more of your units that have PRODUCTION:{br}You may produce 1 unit in that system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Arborec",
      id: "Dirzuga Rophal",
      name: intl.formatMessage({
        id: "Arborec.Leaders.Dirzuga Rophal.Name",
        description: "Name of Arborec Commander: Dirzuga Rophal",
        defaultMessage: "Dirzuga Rophal",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Arborec.Leaders.Dirzuga Rophal.Unlock",
        description: "Unlock condition for Arborec Commander: Dirzuga Rophal",
        defaultMessage: "Have 12 ground forces on planets you control.",
      }),
    },
    "Doctor Sucaban": {
      description: intl.formatMessage(
        {
          id: "Universities of Jol-Nar.Leaders.Doctor Sucaban.Description",
          description: "Description for Jol-Nar Agent: Doctor Sucaban",
          defaultMessage:
            "When a player spends resources to research:{br}You may exhaust this card to allow that player to remove any number of their infantry from the game board. For each unit removed, reduce the resources spent by 1.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Universities of Jol-Nar",
      id: "Doctor Sucaban",
      name: intl.formatMessage({
        id: "Universities of Jol-Nar.Leaders.Doctor Sucaban.Name",
        description: "Name of Jol-Nar Agent: Doctor Sucaban",
        defaultMessage: "Doctor Sucaban",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Elder Qanoj": {
      description: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Elder Qanoj.Description",
        description: "Description for Xxcha Commander: Elder Qanoj",
        defaultMessage:
          "Each planet you exhaust to cast votes provides 1 additional vote. Game effects cannot prevent you from voting on an agenda.",
      }),
      expansion: "POK",
      faction: "Xxcha Kingdom",
      id: "Elder Qanoj",
      name: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Elder Qanoj.Name",
        description: "Name of Xxcha Commander: Elder Qanoj",
        defaultMessage: "Elder Qanoj",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Elder Qanoj.Unlock",
        description: "Unlock condition for Xxcha Commander: Elder Qanoj",
        defaultMessage:
          "Control planets that have a combined value of at least 12 influence.",
      }),
    },
    "Emissary Taivra": {
      description: intl.formatMessage(
        {
          id: "Ghosts of Creuss.Leaders.Emissary Taivra.Description",
          description: "Description for Creuss Agent: Emissary Taivra",
          defaultMessage:
            "After a player activates a system that contains a non-delta wormhole:{br}You may exhaust this card; if you do, that system is adjacent to all other systems that contain a wormhole during this tactical action.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Ghosts of Creuss",
      id: "Emissary Taivra",
      name: intl.formatMessage({
        id: "Ghosts of Creuss.Leaders.Emissary Taivra.Name",
        description: "Name of Creuss Agent: Emissary Taivra",
        defaultMessage: "Emissary Taivra",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Evelyn Delouis": {
      description: intl.formatMessage(
        {
          id: "Federation of Sol.Leaders.Evelyn Delouis.Description",
          description: "Description for Sol Agent: Evelyn Delouis",
          defaultMessage:
            "At the start of a ground combat round:{br}You may exhaust this card to choose 1 ground force in the active system; that ground force rolls 1 additional die during that combat round.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Federation of Sol",
      id: "Evelyn Delouis",
      name: intl.formatMessage({
        id: "Federation of Sol.Leaders.Evelyn Delouis.Name",
        description: "Name of Sol Agent: Evelyn Delouis",
        defaultMessage: "Evelyn Delouis",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Field Marshal Mercer": {
      description: intl.formatMessage(
        {
          id: "Nomad.Leaders.Field Marshal Mercer.Description",
          description: "Description for Nomad Agent: Field Marshal Mercer",
          defaultMessage:
            "At the end of a player's turn:{br}You may exhaust this card to allow that player to remove up to 2 of their ground forces from the game board and place them on planets they control in the active system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nomad",
      id: "Field Marshal Mercer",
      name: intl.formatMessage({
        id: "Nomad.Leaders.Field Marshal Mercer.Name",
        description: "Name of Nomad Agent: Field Marshal Mercer",
        defaultMessage: "Field Marshal Mercer",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Garv and Gunn": {
      description: intl.formatMessage(
        {
          id: "Naaz-Rokha Alliance.Leaders.Garv and Gunn.Description",
          description: "Description for Naaz-Rokha Agent: Garv and Gunn",
          defaultMessage:
            "At the end of a player's turn:{br}You may exhaust this card to allow that player to explore 1 of their planets.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Naaz-Rokha Alliance",
      id: "Garv and Gunn",
      name: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Leaders.Garv and Gunn.Name",
        description: "Name of Naaz-Rokha Agent: Garv and Gunn",
        defaultMessage: "Garv and Gunn",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "G'hom Sek'kus": {
      description: intl.formatMessage(
        {
          id: "Sardakk N'orr.Leaders.G'hom Sek'kus.Description",
          description: "Description for N'orr Commander: G'hom Sek'kus",
          defaultMessage:
            'During the "Commit Ground Forces" step:{br}You can commit up to 1 ground force from each planet in the active system and each planet in adjacent systems that do not contain 1 of your command tokens.',
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Sardakk N'orr",
      id: "G'hom Sek'kus",
      name: intl.formatMessage({
        id: "Sardakk N'orr.Leaders.G'hom Sek'kus.Name",
        description: "Name of N'orr Commander: G'hom Sek'kus",
        defaultMessage: "G'hom Sek'kus",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Sardakk N'orr.Leaders.G'hom Sek'kus.Unlock",
        description: "Unlock condition for N'orr Commander: G'hom Sek'kus",
        defaultMessage: "Control 5 planets in non-home systems.",
      }),
    },
    "Ggrocuto Rinn": {
      description: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Ggrocuto Rinn.Description",
        description: "Description for Xxcha Agent: Ggrocuto Rinn",
        defaultMessage:
          "ACTION: Exhaust this card to ready any planet; if that planet is in a system that is adjacent to a planet you control, you may remove 1 infantry from that planet and return it to its reinforcements",
      }),
      expansion: "POK",
      faction: "Xxcha Kingdom",
      id: "Ggrocuto Rinn",
      name: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Ggrocuto Rinn.Name",
        description: "Name of Xxcha Agent: Ggrocuto Rinn",
        defaultMessage: "Ggrocuto Rinn",
      }),
      timing: "COMPONENT_ACTION",
      type: "AGENT",
    },
    "Gila the Silvertongue": {
      description: intl.formatMessage(
        {
          id: "Emirates of Hacan.Leaders.Gila the Silvertongue.Description",
          description: "Description for Hacan Commander: Gila the Silvertongue",
          defaultMessage:
            "When you cast votes:{br}You may spend any number of trade goods; cast 2 additional votes for each trade good spent.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Emirates of Hacan",
      id: "Gila the Silvertongue",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Leaders.Gila the Silvertongue.Name",
        description: "Name of Hacan Commander: Gila the Silvertongue",
        defaultMessage: "Gila the Silvertongue",
      }),
      timing: "AGENDA_PHASE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Emirates of Hacan.Leaders.Gila the Silvertongue.Unlock",
        description:
          "Unlock condition for Hacan Commander: Gila the Silvertongue",
        defaultMessage: "Have 10 trade goods.",
      }),
    },
    "Gurno Aggero": {
      abilityName: intl.formatMessage({
        id: "Clan of Saar.Leaders.Gurno Aggero.AbilityName",
        description: "Ability name for Saar Hero: Gurno Aggero",
        defaultMessage: "ARMAGEDDON RELAY",
      }),
      description: intl.formatMessage(
        {
          id: "Clan of Saar.Leaders.Gurno Aggero.Description",
          description: "Description for Saar Hero: Gurno Aggero",
          defaultMessage:
            "ACTION: Choose 1 system that is adjacent to 1 of your space docks. Destroy all other player's infantry and fighters in that system{br}Then, purge this card",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Clan of Saar",
      id: "Gurno Aggero",
      name: intl.formatMessage({
        id: "Clan of Saar.Leaders.Gurno Aggero.Name",
        description: "Name of Saar Hero: Gurno Aggero",
        defaultMessage: "Gurno Aggero",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Harrugh Gefhara": {
      abilityName: intl.formatMessage({
        id: "Emirates of Hacan.Leaders.Harrugh Gefhara.AbilityName",
        description: "Ability name for Hacan Hero: Harrugh Gefhara",
        defaultMessage: "GALACTIC SECURITIES NET",
      }),
      description: intl.formatMessage(
        {
          id: "Emirates of Hacan.Leaders.Harrugh Gefhara.Description",
          description: "Description for Hacan Hero: Harrugh Gefhara",
          defaultMessage:
            "When 1 or more of your units use PRODUCTION:{br}You may reduce the cost of each of your units to 0 during this use of PRODUCTION. If you do, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Emirates of Hacan",
      id: "Harrugh Gefhara",
      name: intl.formatMessage({
        id: "Emirates of Hacan.Leaders.Harrugh Gefhara.Name",
        description: "Name of Hacan Hero: Harrugh Gefhara",
        defaultMessage: "Harrugh Gefhara",
      }),
      timing: "OTHER",
      type: "HERO",
    },
    "Hesh and Prit": {
      abilityName: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Leaders.Hesh and Prit.AbilityName",
        description: "Ability name for Naaz-Rokha Hero: Hesh and Prit",
        defaultMessage: "PERFECT SYNTHESIS",
      }),
      description: intl.formatMessage(
        {
          id: "Naaz-Rokha Alliance.Leaders.Hesh and Prit.Description",
          description: "Description for Naaz-Rokha Hero: Hesh and Prit",
          defaultMessage:
            "ACTION: Gain 1 relic and perform the secondary ability of up to 2 readied or unchosen strategy cards; during this action, spend command tokens from your reinforcements instead of your strategy pool.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Naaz-Rokha Alliance",
      id: "Hesh and Prit",
      name: intl.formatMessage({
        id: "Naaz-Rokha Alliance.Leaders.Hesh and Prit.Name",
        description: "Name of Naaz-Rokha Hero: Hesh and Prit",
        defaultMessage: "Hesh and Prit",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    I48S: {
      description: intl.formatMessage(
        {
          id: "L1Z1X Mindnet.Leaders.I48S.Description",
          description: "Description for L1Z1X Agent: I48S",
          defaultMessage:
            "After a player activates a system:{br}You may exhaust this card to allow that player to replace 1 of their infantry in the active system with 1 mech from their reinforcements.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "L1Z1X Mindnet",
      id: "I48S",
      name: intl.formatMessage({
        id: "L1Z1X Mindnet.Leaders.I48S.Name",
        description: "Name of L1Z1X Agent: I48S",
        defaultMessage: "I48S",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Il Na Viroset": {
      description: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Leaders.Il Na Viroset.Description",
        description: "Description for Mahact Commander: Il Na Viroset",
        defaultMessage:
          "During your tactical actions, you can activate systems that contain your command tokens. If you do, return both command tokens to your reinforcements and end your turn.",
      }),
      expansion: "POK",
      faction: "Mahact Gene-Sorcerers",
      id: "Il Na Viroset",
      name: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Leaders.Il Na Viroset.Name",
        description: "Name of Mahact Commander: Il Na Viroset",
        defaultMessage: "Il Na Viroset",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Leaders.Il Na Viroset.Unlock",
        description: "Unlock condition for Mahact Commander: Il Na Viroset",
        defaultMessage:
          "Have 2 other factions' command tokens in your fleet pool.",
      }),
    },
    "Ipswitch Loose Cannon": {
      abilityName: intl.formatMessage({
        id: "Mentak Coalition.Leaders.Ipswitch, Loose Cannon.AbilityName",
        description: "Ability name for Mentak Hero: Ipswitch, Loose Cannon",
        defaultMessage: "SLEEPER CELL",
      }),
      description: intl.formatMessage(
        {
          id: "Mentak Coalition.Leaders.Ipswitch, Loose Cannon.Description",
          description: "Description for Mentak Hero: Ipswitch, Loose Cannon",
          defaultMessage:
            "At the start of space combat that you are participating in:{br}You may purge this card; if you do, for each other player's ship that is destroyed during this combat, place 1 ship of that type from your reinforcements in the active system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Mentak Coalition",
      id: "Ipswitch Loose Cannon",
      name: intl.formatMessage({
        id: "Mentak Coalition.Leaders.Ipswitch, Loose Cannon.Name",
        description: "Name of Mentak Hero: Ipswitch, Loose Cannon",
        defaultMessage: "Ipswitch, Loose Cannon",
      }),
      timing: "TACTICAL_ACTION",
      type: "HERO",
    },
    "It Feeds on Carrion": {
      abilityName: intl.formatMessage({
        id: "Vuil'raith Cabal.Leaders.It Feeds on Carrion.AbilityName",
        description: "Ability name for Vuil'raith Hero: It Feeds on Carrion",
        defaultMessage: "DIMENSIONAL ANCHOR",
      }),
      description: intl.formatMessage(
        {
          id: "Vuil'raith Cabal.Leaders.It Feeds on Carrion.Description",
          description: "Description for Vuil'raith Hero: It Feeds on Carrion",
          defaultMessage:
            "ACTION: Each other player rolls a die for each of their non-fighter ships that are in or adjacent to a system that contains a dimensional tear; on a 1-3, capture that unit. If this causes a player's ground forces or fighters to be removed, also capture those units{br}Then, purge this card",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Vuil'raith Cabal",
      id: "It Feeds on Carrion",
      name: intl.formatMessage({
        id: "Vuil'raith Cabal.Leaders.It Feeds on Carrion.Name",
        description: "Name of Vuil'raith Hero: It Feeds on Carrion",
        defaultMessage: "It Feeds on Carrion",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Jace X 4th Air Legion": {
      abilityName: intl.formatMessage({
        id: "Federation of Sol.Leaders.Jace X. 4th Air Legion.AbilityName",
        description: "Ability name for Sol Hero: Jace X. 4th Air Legion",
        defaultMessage: "HELIO COMMAND ARRAY",
      }),
      description: intl.formatMessage(
        {
          id: "Federation of Sol.Leaders.Jace X. 4th Air Legion.Description",
          description: "Description for Sol Hero: Jace X. 4th Air Legion",
          defaultMessage:
            "ACTION: Remove each of your command tokens from the game board and return them to your reinforcements.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Federation of Sol",
      id: "Jace X 4th Air Legion",
      name: intl.formatMessage({
        id: "Federation of Sol.Leaders.Jace X. 4th Air Legion.Name",
        description: "Name of Sol Hero: Jace X. 4th Air Legion",
        defaultMessage: "Jace X. 4th Air Legion",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Jae Mir Kan": {
      description: intl.formatMessage(
        {
          id: "Mahact Gene-Sorcerers.Leaders.Jae Mir Kan.Description",
          description: "Description for Mahact Agent: Jae Mir Kan",
          defaultMessage:
            "When you would spend a command token during the secondary ability of a strategic action:{br}You may exhaust this card to remove 1 of the active player's command tokens from the board and use it instead.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Mahact Gene-Sorcerers",
      id: "Jae Mir Kan",
      name: intl.formatMessage({
        id: "Mahact Gene-Sorcerers.Leaders.Jae Mir Kan.Name",
        description: "Name of Mahact Agent: Jae Mir Kan",
        defaultMessage: "Jae Mir Kan",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Kyver Blade and Key": {
      abilityName: intl.formatMessage({
        id: "Yssaril Tribes.Leaders.Kyver, Blade and Key.AbilityName",
        description: "Ability name for Yssaril Hero: Kyver, Blade and Key",
        defaultMessage: "GUILD OF SPIES",
      }),
      description: intl.formatMessage(
        {
          id: "Yssaril Tribes.Leaders.Kyver, Blade and Key.Description",
          description: "Description for Yssaril Hero: Kyver, Blade and Key",
          defaultMessage:
            "ACTION: Each other player shows you 1 action card from their hand. For each player, you may either take that card or force that player to discard 3 random action cards from their hand.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Yssaril Tribes",
      id: "Kyver Blade and Key",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Leaders.Kyver, Blade and Key.Name",
        description: "Name of Yssaril Hero: Kyver, Blade and Key",
        defaultMessage: "Kyver, Blade and Key",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Letani Miasmiala": {
      abilityName: intl.formatMessage({
        id: "Arborec.Leaders.Letani Miasmiala.AbilityName",
        description: "Ability name for Arborec Hero: Letani Miasmiala",
        defaultMessage: "ULTRASONIC EMITTER",
      }),
      description: intl.formatMessage(
        {
          id: "Arborec.Leaders.Letani Miasmiala.Description",
          description: "Description for Arborec Hero: Letani Miasmiala",
          defaultMessage:
            "ACTION: Produce any number of units in any number of systems that contain 1 or more of your ground forces.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Arborec",
      id: "Letani Miasmiala",
      name: intl.formatMessage({
        id: "Arborec.Leaders.Letani Miasmiala.Name",
        description: "Name of Arborec Hero: Letani Miasmiala",
        defaultMessage: "Letani Miasmiala",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Letani Ospha": {
      description: intl.formatMessage({
        id: "Arborec.Leaders.Letani Ospha.Description",
        description: "Description for Arborec Agent: Letani Ospha",
        defaultMessage:
          "ACTION: Exhaust this card and choose a player's non-fighter ship; that player may replace that ship with one from their reinforcements that costs up to 2 more than the replaced ship",
      }),
      expansion: "POK",
      faction: "Arborec",
      id: "Letani Ospha",
      name: intl.formatMessage({
        id: "Arborec.Leaders.Letani Ospha.Name",
        description: "Name of Arborec Agent: Letani Ospha",
        defaultMessage: "Letani Ospha",
      }),
      timing: "COMPONENT_ACTION",
      type: "AGENT",
    },
    "M'aban": {
      description: intl.formatMessage({
        id: "Naalu Collective.Leaders.M'aban.Description",
        description: "Description for Naalu Commander: M'aban",
        defaultMessage:
          "You may produce 1 additional fighter for their cost; these additional units do not count against your production limit.",
      }),
      expansion: "POK",
      faction: "Naalu Collective",
      id: "M'aban",
      name: intl.formatMessage({
        id: "Naalu Collective.Leaders.M'aban.Name",
        description: "Name of Naalu Commander: M'aban",
        defaultMessage: "M'aban",
      }),
      omegas: [
        {
          description: intl.formatMessage(
            {
              id: "Naalu Collective.Leaders.M'aban.Omega.Description",
              description: "Description for Naalu Commander: M'aban Ω",
              defaultMessage:
                "At any time:{br}You may look at your neighbours' hand of promissory notes and the top and bottom card of the agenda deck.",
            },
            { br: "\n\n" }
          ),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Naalu Collective.Leaders.M'aban.Omega.Name",
            description: "Name of Naalu Commander: M'aban Ω",
            defaultMessage: "M'aban Ω",
          }),
          unlock: intl.formatMessage({
            id: "Naalu Collective.Leaders.M'aban.Omega.Unlock",
            description: "Unlock condition for Naalu Commander: M'aban Ω",
            defaultMessage:
              "Have ground forces in or adjacent to the Mecatol Rex system.",
          }),
        },
      ],
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Naalu Collective.Leaders.M'aban.Unlock",
        description: "Unlock condition for Naalu Commander: M'aban",
        defaultMessage: "Have 12 fighters on the game board.",
      }),
    },
    Magmus: {
      description: intl.formatMessage(
        {
          id: "Embers of Muaat.Leaders.Magmus.Description",
          description: "Description for Muaat Commander: Magmus",
          defaultMessage:
            "After you spend a token from your strategy pool:{br}You may gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Embers of Muaat",
      id: "Magmus",
      name: intl.formatMessage({
        id: "Embers of Muaat.Leaders.Magmus.Name",
        description: "Name of Muaat Commander: Magmus",
        defaultMessage: "Magmus",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Embers of Muaat.Leaders.Magmus.Unlock",
        description: "Unlock condition for Muaat Commander: Magmus",
        defaultMessage: "Produce a War Sun.",
      }),
    },
    "Mathis Mathinus": {
      abilityName: intl.formatMessage({
        id: "Winnu.Leaders.Mathis Mathinus.AbilityName",
        description: "Ability name for Winnu Hero: Mathis Mathinus",
        defaultMessage: "IMPERIAL SEAL",
      }),
      description: intl.formatMessage(
        {
          id: "Winnu.Leaders.Mathis Mathinus.Description",
          description: "Description for Winnu Hero: Mathis Mathinus",
          defaultMessage:
            "ACTION: Perform the primary ability of any strategy card. Then, choose any number of other players. Those players may perform the secondary ability of that strategy card.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Winnu",
      id: "Mathis Mathinus",
      name: intl.formatMessage({
        id: "Winnu.Leaders.Mathis Mathinus.Name",
        description: "Name of Winnu Hero: Mathis Mathinus",
        defaultMessage: "Mathis Mathinus",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Mirik Aun Sissiri": {
      abilityName: intl.formatMessage({
        id: "Argent Flight.Leaders.Mirik Aun Sissiri.AbilityName",
        description: "Ability name for Argent Hero: Mirik Aun Sissiri",
        defaultMessage: "HELIX PROTOCOL",
      }),
      description: intl.formatMessage(
        {
          id: "Argent Flight.Leaders.Mirik Aun Sissiri.Description",
          description: "Description for Argent Hero: Mirik Aun Sissiri",
          defaultMessage:
            "ACTION: Move any number of your ships from any systems to any number of other systems that contain 1 of your command tokens and no other players' ships.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Argent Flight",
      id: "Mirik Aun Sissiri",
      name: intl.formatMessage({
        id: "Argent Flight.Leaders.Mirik Aun Sissiri.Name",
        description: "Name of Argent Hero: Mirik Aun Sissiri",
        defaultMessage: "Mirik Aun Sissiri",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Navarch Feng": {
      description: intl.formatMessage({
        id: "Nomad.Leaders.Navarch Feng.Description",
        description: "Description for Nomad Commander: Navarch Feng",
        defaultMessage:
          "You can produce your flagship without spending resources.",
      }),
      expansion: "POK",
      faction: "Nomad",
      id: "Navarch Feng",
      name: intl.formatMessage({
        id: "Nomad.Leaders.Navarch Feng.Name",
        description: "Name of Nomad Commander: Navarch Feng",
        defaultMessage: "Navarch Feng",
      }),
      timing: "OTHER",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Nomad.Leaders.Navarch Feng.Unlock",
        description: "Unlock condition for Nomad Commander: Navarch Feng",
        defaultMessage: "Have 1 scored secret objective.",
      }),
    },
    "Nekro Acidos": {
      description: intl.formatMessage(
        {
          id: "Nekro Virus.Leaders.Nekro Acidos.Description",
          description: "Description for Nekro Commander: Nekro Acidos",
          defaultMessage:
            "After you gain a technology:{br}You may draw 1 action card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nekro Virus",
      id: "Nekro Acidos",
      name: intl.formatMessage({
        id: "Nekro Virus.Leaders.Nekro Acidos.Name",
        description: "Name of Nekro Commander: Nekro Acidos",
        defaultMessage: "Nekro Acidos",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Nekro Virus.Leaders.Nekro Acidos.Unlock",
        description: "Unlock condition for Nekro Commander: Nekro Acidos",
        defaultMessage:
          'Own 3 technologies. A "Valefar Assimilator" technology counts only if its X or Y token is on a technology.',
      }),
    },
    "Nekro Malleon": {
      description: intl.formatMessage(
        {
          id: "Nekro Virus.Leaders.Nekro Malleon.Description",
          description: "Description for Nekro Agent: Nekro Malleon",
          defaultMessage:
            "During the action phase:{br}You may exhaust this card to choose a player; that player may discard 1 action card or spend 1 command token from their command sheet to gain 2 trade goods.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nekro Virus",
      id: "Nekro Malleon",
      name: intl.formatMessage({
        id: "Nekro Virus.Leaders.Nekro Malleon.Name",
        description: "Name of Nekro Agent: Nekro Malleon",
        defaultMessage: "Nekro Malleon",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "Rickar Rickani": {
      description: intl.formatMessage({
        id: "Winnu.Leaders.Rickar Rickani.Description",
        description: "Description for Winnu Commander: Rickar Rickani",
        defaultMessage:
          "During combat: Apply +2 to the result of each of your unit's combat rolls in the Mecatol Rex system, your home system, and each system that contains a legendary planet.",
      }),
      expansion: "POK",
      faction: "Winnu",
      id: "Rickar Rickani",
      name: intl.formatMessage({
        id: "Winnu.Leaders.Rickar Rickani.Name",
        description: "Name of Winnu Commander: Rickar Rickani",
        defaultMessage: "Rickar Rickani",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Winnu.Leaders.Rickar Rickani.Unlock",
        description: "Unlock condition for Winnu Commander: Rickar Rickani",
        defaultMessage:
          "Control Mecatol Rex or enter into a combat in the Mecatol Rex system.",
      }),
    },
    "Rear Admiral Farran": {
      description: intl.formatMessage(
        {
          id: "Barony of Letnev.Leaders.Rear Admiral Farran.Description",
          description: "Description for Letnev Commander: Rear Admiral Farran",
          defaultMessage:
            "After 1 of your units uses SUSTAIN DAMAGE:{br}You may gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Barony of Letnev",
      id: "Rear Admiral Farran",
      name: intl.formatMessage({
        id: "Barony of Letnev.Leaders.Rear Admiral Farran.Name",
        description: "Name of Letnev Commander: Rear Admiral Farran",
        defaultMessage: "Rear Admiral Farran",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Barony of Letnev.Leaders.Rear Admiral Farran.Unlock",
        description:
          "Unlock condition for Letnev Commander: Rear Admiral Farran",
        defaultMessage: "Have 5 non-fighter ships in 1 system.",
      }),
    },
    "Rin The Master's Legacy": {
      abilityName: intl.formatMessage({
        id: "Universities of Jol-Nar.Leaders.Rin, The Master's Legacy.AbilityName",
        description: "Ability name for Jol-Nar Hero: Rin, The Master's Legacy",
        defaultMessage: "GENETIC MEMORY",
      }),
      description: intl.formatMessage(
        {
          id: "Universities of Jol-Nar.Leaders.Rin, The Master's Legacy.Description",
          description: "Description for Jol-Nar Hero: Rin, The Master's Legacy",
          defaultMessage:
            "ACTION: For each non-unit upgrade technology you own, you may replace that technology with any technology of the same color from the deck.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Universities of Jol-Nar",
      id: "Rin The Master's Legacy",
      name: intl.formatMessage({
        id: "Universities of Jol-Nar.Leaders.Rin, The Master's Legacy.Name",
        description: "Name of Jol-Nar Hero: Rin, The Master's Legacy",
        defaultMessage: "Rin, The Master's Legacy",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Riftwalker Meian": {
      abilityName: intl.formatMessage({
        id: "Ghosts of Creuss.Leaders.Riftwalker Meian.AbilityName",
        description: "Ability name for Creuss Hero: Riftwalker Meian",
        defaultMessage: "SINGULARITY REACTOR",
      }),
      description: intl.formatMessage(
        {
          id: "Ghosts of Creuss.Leaders.Riftwalker Meian.Description",
          description: "Description for Creuss Hero: Riftwalker Meian",
          defaultMessage:
            "ACTION: Swap the positions of any 2 systems that contain wormholes or your units, other than the Creuss system and the Wormhole Nexus.{br}Then, purge this card",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Ghosts of Creuss",
      id: "Riftwalker Meian",
      name: intl.formatMessage({
        id: "Ghosts of Creuss.Leaders.Riftwalker Meian.Name",
        description: "Name of Creuss Hero: Riftwalker Meian",
        defaultMessage: "Riftwalker Meian",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Rowl Sarrig": {
      description: intl.formatMessage(
        {
          id: "Clan of Saar.Leaders.Rowl Sarrig.Description",
          description: "Description for Saar Commander: Rowl Sarrig",
          defaultMessage:
            "When you produce fighters or infantry:{br}You may place each of those units at any of your space docks that are not blockaded.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Clan of Saar",
      id: "Rowl Sarrig",
      name: intl.formatMessage({
        id: "Clan of Saar.Leaders.Rowl Sarrig.Name",
        description: "Name of Saar Commander: Rowl Sarrig",
        defaultMessage: "Rowl Sarrig",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Clan of Saar.Leaders.Rowl Sarrig.Unlock",
        description: "Unlock condition for Saar Hero: Rowl Sarrig",
        defaultMessage: "Have 3 space docks on the game board.",
      }),
    },
    "Sai Seravus": {
      description: intl.formatMessage(
        {
          id: "Ghosts of Creuss.Leaders.Sai Seravus.Description",
          description: "Description for Creuss Commander: Sai Seravus",
          defaultMessage:
            "After your ships move:{br}For each ship that has a capacity value and moved through 1 or more wormholes, you may place 1 fighter from your reinforcements with that ship if you have unused capacity in the active system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Ghosts of Creuss",
      id: "Sai Seravus",
      name: intl.formatMessage({
        id: "Ghosts of Creuss.Leaders.Sai Seravus.Name",
        description: "Name of Creuss Commander: Sai Seravus",
        defaultMessage: "Sai Seravus",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Ghosts of Creuss.Leaders.Sai Seravus.Unlock",
        description: "Unlock condition for Creuss Commander: Sai Seravus",
        defaultMessage:
          "Have units in 3 systems that contain alpha or beta wormholes.",
      }),
    },
    "Sh'val Harbinger": {
      abilityName: intl.formatMessage({
        id: "Sardakk N'orr.Leaders.Sh'val, Harbinger.AbilityName",
        description: "Ability name for N'orr Hero: Sh'val, Harbinger",
        defaultMessage: "TEKKLAR CONDITIONING",
      }),
      description: intl.formatMessage(
        {
          id: "Sardakk N'orr.Leaders.Sh'val, Harbinger.Description",
          description: "Description for N'orr Hero: Sh'val, Harbinger",
          defaultMessage:
            'After you move ships into the active system:{br}You may skip directly to the "Commit Ground Forces" step. If you do, after you commit ground forces to land on planets, purge this card and return each of your ships in the active system to your reinforcements.',
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Sardakk N'orr",
      id: "Sh'val Harbinger",
      name: intl.formatMessage({
        id: "Sardakk N'orr.Leaders.Sh'val, Harbinger.Name",
        description: "Name of N'orr Hero: Sh'val, Harbinger",
        defaultMessage: "Sh'val, Harbinger",
      }),
      timing: "TACTICAL_ACTION",
      type: "HERO",
    },
    "So Ata": {
      description: intl.formatMessage(
        {
          id: "Yssaril Tribes.Leaders.So Ata.Description",
          description: "Description for Yssaril Commander: So Ata",
          defaultMessage:
            "After another player activates a system that contains your units:{br}You may look at that player's action cards, promissory notes, or secret objectives.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Yssaril Tribes",
      id: "So Ata",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Leaders.So Ata.Name",
        description: "Name of Yssaril Commander: So Ata",
        defaultMessage: "So Ata",
      }),
      timing: "OTHER",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Yssaril Tribes.Leaders.So Ata.Unlock",
        description: "Unlock condition for Yssaril Commander: So Ata",
        defaultMessage: "Have 7 action cards.",
      }),
    },
    "S'Ula Mentarion": {
      description: intl.formatMessage(
        {
          id: "Mentak Coalition.Leaders.S'Ula Mentarion.Description",
          description: "Description for Mentak Commander: S'Ula Mentarion",
          defaultMessage:
            "After you win a space combat:{br}You may force your opponent to give you 1 promissory note from their hand.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Mentak Coalition",
      id: "S'Ula Mentarion",
      name: intl.formatMessage({
        id: "Mentak Coalition.Leaders.S'Ula Mentarion.Name",
        description: "Name of Mentak Commander: S'Ula Mentarion",
        defaultMessage: "S'Ula Mentarion",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Mentak Coalition.Leaders.S'Ula Mentarion.Unlock",
        description: "Unlock condition for Mentak Commander: S'Ula Mentarion",
        defaultMessage: "Have 4 cruisers on the game board.",
      }),
    },
    "Suffi An": {
      description: intl.formatMessage(
        {
          id: "Mentak Coalition.Leaders.Suffi An.Description",
          description: "Description for Mentak Agent: Suffi An",
          defaultMessage:
            "After the PILLAGE faction ability is used against another player:{br}You may exhaust this card; if you do, you and that player each draw 1 action card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Mentak Coalition",
      id: "Suffi An",
      name: intl.formatMessage({
        id: "Mentak Coalition.Leaders.Suffi An.Name",
        description: "Name of Mentak Agent: Suffi An",
        defaultMessage: "Suffi An",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    Ssruu: {
      description: intl.formatMessage({
        id: "Yssaril Tribes.Leaders.Ssruu.Description",
        description: "Description for Yssaril Agent: Ssruu",
        defaultMessage:
          "This card has the text ability of each other player's agent, even if that agent is exhausted",
      }),
      expansion: "POK",
      faction: "Yssaril Tribes",
      id: "Ssruu",
      name: intl.formatMessage({
        id: "Yssaril Tribes.Leaders.Ssruu.Name",
        description: "Name of Yssaril Agent: Ssruu",
        defaultMessage: "Ssruu",
      }),
      timing: "MULTIPLE",
      type: "AGENT",
    },
    "Ta Zern": {
      description: intl.formatMessage(
        {
          id: "Universities of Jol-Nar.Leaders.Ta Zern.Description",
          description: "Description for Jol-Nar Commander: Ta Zern",
          defaultMessage:
            "After you roll dice for a unit ability:{br}You may reroll any of those dice.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Universities of Jol-Nar",
      id: "Ta Zern",
      name: intl.formatMessage({
        id: "Universities of Jol-Nar.Leaders.Ta Zern.Name",
        description: "Name of Jol-Nar Commander: Ta Zern",
        defaultMessage: "Ta Zern",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Universities of Jol-Nar.Leaders.Ta Zern.Unlock",
        description: "Unlock condition for Jol-Nar Commander: Ta Zern",
        defaultMessage: "Own 8 technologies.",
      }),
    },
    Tellurian: {
      description: intl.formatMessage(
        {
          id: "Titans of Ul.Leaders.Tellurian.Description",
          description: "Description for Titans Agent: Tellurian",
          defaultMessage:
            "When a hit is produced against a unit:{br}You may exhaust this card to cancel that hit.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Titans of Ul",
      id: "Tellurian",
      name: intl.formatMessage({
        id: "Titans of Ul.Leaders.Tellurian.Name",
        description: "Name of Titans Agent: Tellurian",
        defaultMessage: "Tellurian",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "That Which Molds Flesh": {
      description: intl.formatMessage(
        {
          id: "Vuil'raith Cabal.Leaders.That Which Molds Flesh.Description",
          description:
            "Description for Vuil'raith Commander: That Which Molds Flesh",
          defaultMessage:
            "When you produce fighter or infantry units:{br}Up to 2 of those units do not count against your PRODUCTION limit.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Vuil'raith Cabal",
      id: "That Which Molds Flesh",
      name: intl.formatMessage({
        id: "Vuil'raith Cabal.Leaders.That Which Molds Flesh.Name",
        description: "Name of Vuil'raith Commander: That Which Molds Flesh",
        defaultMessage: "That Which Molds Flesh",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Vuil'raith Cabal.Leaders.That Which Molds Flesh.Unlock",
        description:
          "Unlock condition for Vuil'raith Commander: That Which Molds Flesh",
        defaultMessage: "Have units in 3 Gravity Rifts.",
      }),
    },
    "The Helmsman": {
      abilityName: intl.formatMessage({
        id: "L1Z1X Mindnet.Leaders.The Helmsman.AbilityName",
        description: "Ability name for L1Z1X Hero: The Helmsman",
        defaultMessage: "DARK SPACE NAVIGATION",
      }),
      description: intl.formatMessage(
        {
          id: "L1Z1X Mindnet.Leaders.The Helmsman.Description",
          description: "Description for L1Z1X Hero: The Helmsman",
          defaultMessage:
            "ACTION: Choose 1 system that does not contain other players' ships; you may move your flagship and any number of your dreadnoughts from other systems into the chosen system.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "L1Z1X Mindnet",
      id: "The Helmsman",
      name: intl.formatMessage({
        id: "L1Z1X Mindnet.Leaders.The Helmsman.Name",
        description: "Name of L1Z1X Hero: The Helmsman",
        defaultMessage: "The Helmsman",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "The Oracle": {
      abilityName: intl.formatMessage({
        id: "Naalu Collective.Leaders.The Oracle.AbilityName",
        description: "Ability name for Naalu Hero: The Oracle",
        defaultMessage: "C-RADIUM GEOMETRY",
      }),
      description: intl.formatMessage(
        {
          id: "Naalu Collective.Leaders.The Oracle.Description",
          description: "Description for Naalu Hero: The Oracle",
          defaultMessage:
            "At the end of the status phase:{br}You may force each other player to give you 1 promissory note from their hand. If you do, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Naalu Collective",
      id: "The Oracle",
      name: intl.formatMessage({
        id: "Naalu Collective.Leaders.The Oracle.Name",
        description: "Name of Naalu Hero: The Oracle",
        defaultMessage: "The Oracle",
      }),
      timing: "STATUS_PHASE_END",
      type: "HERO",
    },
    "The Stillness of Stars": {
      description: intl.formatMessage(
        {
          id: "Vuil'raith Cabal.Leaders.The Stillness of Stars.Description",
          description:
            "Description for Vuil'raith Agent: The Stillness of Stars",
          defaultMessage:
            "After another player replenishes commodities:{br}You may exhaust this card to convert their commodities to trade goods and capture 1 unit from their reinforcements that has a cost equal to or lower than their commodity value.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Vuil'raith Cabal",
      id: "The Stillness of Stars",
      name: intl.formatMessage({
        id: "Vuil'raith Cabal.Leaders.The Stillness of Stars.Name",
        description: "Name of Vuil'raith Agent: The Stillness of Stars",
        defaultMessage: "The Stillness of Stars",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    "The Thundarian": {
      description: intl.formatMessage(
        {
          id: "Nomad.Leaders.The Thundarian.Description",
          description: "Description for Nomad Agent: The Thundarian",
          defaultMessage:
            'After the "Roll Dice" step of combat:{br}You may exhaust this card. If you do, hits are not assigned to either players\' units. Return to the start of this combat round\'s "Roll Dice" step',
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nomad",
      id: "The Thundarian",
      name: intl.formatMessage({
        id: "Nomad.Leaders.The Thundarian.Name",
        description: "Name of Nomad Agent: The Thundarian",
        defaultMessage: "The Thundarian",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "T'ro": {
      description: intl.formatMessage(
        {
          id: "Sardakk N'orr.Leaders.T'ro.Description",
          description: "Description for N'orr Agent: T'ro",
          defaultMessage:
            "At the end of a player's tactical action:{br}You may exhaust this card; if you do, that player may place 2 infantry from their reinforcements on a planet they control in the active system.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Sardakk N'orr",
      id: "T'ro",
      name: intl.formatMessage({
        id: "Sardakk N'orr.Leaders.T'ro.Name",
        description: "Name of N'orr Agent: T'ro",
        defaultMessage: "T'ro",
      }),
      timing: "TACTICAL_ACTION",
      type: "AGENT",
    },
    "Trrakan Aun Zulok": {
      description: intl.formatMessage(
        {
          id: "Argent Flight.Leaders.Trrakan Aun Zulok.Description",
          description: "Description for Argent Commander: Trrakan Aun Zulok",
          defaultMessage:
            "When 1 or more of your units make a roll for a unit ability:{br}You may choose 1 of those units to roll 1 additional die.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Argent Flight",
      id: "Trrakan Aun Zulok",
      name: intl.formatMessage({
        id: "Argent Flight.Leaders.Trrakan Aun Zulok.Name",
        description: "Name of Argent Commander: Trrakan Aun Zulok",
        defaultMessage: "Trrakan Aun Zulok",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Argent Flight.Leaders.Trrakan Aun Zulok.Unlock",
        description: "Unlock condition for Argent Commander: Trrakan Aun Zulok",
        defaultMessage:
          "Have 6 units that have ANTI-FIGHTER BARRAGE, SPACE CANNON or BOMBARDMENT on the game board.",
      }),
    },
    "Trillossa Aun Mirik": {
      description: intl.formatMessage(
        {
          id: "Argent Flight.Leaders.Trillossa Aun Mirik.Description",
          description: "Description for Argent Agent: Trillossa Aun Mirik",
          defaultMessage:
            "When a player produces ground forces in a system:{br}You may exhaust this card; that player may place those units on any planets they control in that system and any adjacent systems.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Argent Flight",
      id: "Trillossa Aun Mirik",
      name: intl.formatMessage({
        id: "Argent Flight.Leaders.Trillossa Aun Mirik.Name",
        description: "Name of Argent Agent: Trillossa Aun Mirik",
        defaultMessage: "Trillossa Aun Mirik",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    Tungstantus: {
      description: intl.formatMessage(
        {
          id: "Titans of Ul.Leaders.Tungstantus.Description",
          description: "Description for Titans Commander: Tungstantus",
          defaultMessage:
            "When 1 or more of your units use PRODUCTION:{br}You may gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Titans of Ul",
      id: "Tungstantus",
      name: intl.formatMessage({
        id: "Titans of Ul.Leaders.Tungstantus.Name",
        description: "Name of Titans Commander: Tungstantus",
        defaultMessage: "Tungstantus",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Titans of Ul.Leaders.Tungstantus.Unlock",
        description: "Unlock condition for Titans Commander: Tungstantus",
        defaultMessage: "Have 5 structures on the game board.",
      }),
    },
    "Ul the Progenitor": {
      abilityName: intl.formatMessage({
        id: "Titans of Ul.Leaders.Ul the Progenitor.AbilityName",
        description: "Ability name for Titans Hero: Ul the Progenitor",
        defaultMessage: "GEOFORM",
      }),
      description: intl.formatMessage({
        id: "Titans of Ul.Leaders.Ul the Progenitor.Description",
        description: "Description for Titans Hero: Ul the Progenitor",
        defaultMessage:
          "ACTION: Ready Elysium and attach this card to it. Its resource and influence values are each increased by 3, and it gains the SPACE CANNON 5 (x3) ability as if it were a unit",
      }),
      expansion: "POK",
      faction: "Titans of Ul",
      id: "Ul the Progenitor",
      name: intl.formatMessage({
        id: "Titans of Ul.Leaders.Ul the Progenitor.Name",
        description: "Name of Titans Hero: Ul the Progenitor",
        defaultMessage: "Ul the Progenitor",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    Umbat: {
      description: intl.formatMessage({
        id: "Embers of Muaat.Leaders.Umbat.Description",
        description: "Description for Muaat Agent: Umbat",
        defaultMessage:
          "ACTION: Exhaust this card to choose a player; that player may produce up to 2 units that each have a cost of 4 or less in a system that contains one of their war suns or their flagship",
      }),
      expansion: "POK",
      faction: "Embers of Muaat",
      id: "Umbat",
      name: intl.formatMessage({
        id: "Embers of Muaat.Leaders.Umbat.Name",
        description: "Name of Muaat Agent: Umbat",
        defaultMessage: "Umbat",
      }),
      timing: "COMPONENT_ACTION",
      type: "AGENT",
    },
    UNITDSGNFLAYESH: {
      abilityName: intl.formatMessage({
        id: "Nekro Virus.Leaders.UNIT.DSGN.FLAYESH.AbilityName",
        description: "Ability name for Nekro Hero: UNIT.DSGN.FLAYESH",
        defaultMessage: "POLYMORPHIC ALGORITHM",
      }),
      description: intl.formatMessage(
        {
          id: "Nekro Virus.Leaders.UNIT.DSGN.FLAYESH.Description",
          description: "Description for Nekro Hero: UNIT.DSGN.FLAYESH",
          defaultMessage:
            "ACTION: Choose a planet that has a technology specialty in a system that contains your units. Destroy any other player's units on that planet. Gain trade goods equal to that planet's combined resource and influence values and gain 1 technology that matches the specialty of that planet.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Nekro Virus",
      id: "UNITDSGNFLAYESH",
      name: intl.formatMessage({
        id: "Nekro Virus.Leaders.UNIT.DSGN.FLAYESH.Name",
        description: "Name of Nekro Hero: UNIT.DSGN.FLAYESH",
        defaultMessage: "UNIT.DSGN.FLAYESH",
      }),
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Viscount Unlenn": {
      description: intl.formatMessage(
        {
          id: "Barony of Letnev.Leaders.Viscount Unlenn.Description",
          description: "Description for Letnev Agent: Viscount Unlenn",
          defaultMessage:
            "At the start of a Space Combat round:{br}You may exhaust this card to choose 1 ship in the active system. That ship rolls 1 additional die during this combat round.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Barony of Letnev",
      id: "Viscount Unlenn",
      name: intl.formatMessage({
        id: "Barony of Letnev.Leaders.Viscount Unlenn.Name",
        description: "Name of Letnev Agent: Viscount Unlenn",
        defaultMessage: "Viscount Unlenn",
      }),
      timing: "OTHER",
      type: "AGENT",
    },
    Xuange: {
      description: intl.formatMessage(
        {
          id: "Empyrean.Leaders.Xuange.Description",
          description: "Description for Empyrean Commander: Xuange",
          defaultMessage:
            "After another player moves ships into a system that contains 1 of your command tokens:{br}You may return that token to your reinforcements.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Empyrean",
      id: "Xuange",
      name: intl.formatMessage({
        id: "Empyrean.Leaders.Xuange.Name",
        description: "Name of Empyrean Commander: Xuange",
        defaultMessage: "Xuange",
      }),
      timing: "PASSIVE",
      type: "COMMANDER",
      unlock: intl.formatMessage({
        id: "Empyrean.Leaders.Xuange.Unlock",
        description: "Unlock condition for Empyrean Commander: Xuange",
        defaultMessage: "Be neighbors with all other players.",
      }),
    },
    "Xxekir Grom": {
      abilityName: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Xxekir Grom.AbilityName",
        description: "Ability name for Xxcha Hero: Xxekir Grom",
        defaultMessage: "POLITICAL DATA NEXUS",
      }),
      description: intl.formatMessage(
        {
          id: "Xxcha Kingdom.Leaders.Xxekir Grom.Description",
          description: "Description for Xxcha Hero: Xxekir Grom",
          defaultMessage:
            "ACTION: You may discard 1 law from play. Look at the top 5 cards of the agenda deck. Choose 2 to reveal, and resolve each as if you had cast 1 vote for an outcome of your choice; discard the rest. Other players cannot resolve abilities during this action.{br}Then, purge this card.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Xxcha Kingdom",
      id: "Xxekir Grom",
      name: intl.formatMessage({
        id: "Xxcha Kingdom.Leaders.Xxekir Grom.Name",
        description: "Name of Xxcha Hero: Xxekir Grom",
        defaultMessage: "Xxekir Grom",
      }),
      omegas: [
        {
          abilityName: intl.formatMessage({
            id: "Xxcha Kingdom.Leaders.Xxekir Grom.Omega.AbilityName",
            description: "Ability name for Xxcha Hero: Xxekir Grom Ω",
            defaultMessage: "POLITICAL DATA NEXUS Ω",
          }),
          description: intl.formatMessage({
            id: "Xxcha Kingdom.Leaders.Xxekir Grom.Omega.Description",
            description: "Description for Xxcha Hero: Xxekir Grom Ω",
            defaultMessage:
              "When you exhaust planets, combine the values of their resources and influence. Treat the combined value as if it were both resources and influence.",
          }),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Leaders.Xxekir Grom.Omega.Name",
            description: "Name of Xxcha Hero: Xxekir Grom Ω",
            defaultMessage: "Xxekir Grom Ω",
          }),
          timing: "PASSIVE",
        },
        {
          abilityName: intl.formatMessage({
            id: "Xxcha Kingdom.Leaders.Xxekir Grom.Thunders Edge.AbilityName",
            description: "Ability name for Xxcha Hero: Xxekir Grom",
            defaultMessage: "PLANETARY DEFENSE NEXUS",
          }),
          description: intl.formatMessage(
            {
              id: "Xxcha Kingdom.Leaders.Xxekir Grom.Thunders Edge.Description",
              description: "Description for Xxcha Hero: Xxekir Grom",
              defaultMessage:
                "ACTION: Place any combination of up to 4 PDS or mechs onto planets that you control; ready each planet that you place a unit on.{br}Then, purge this card.",
            },
            { br: "\n\n" }
          ),
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Xxcha Kingdom.Leaders.Xxekir Grom.Name",
            description: "Name of Xxcha Hero: Xxekir Grom",
            defaultMessage: "Xxekir Grom",
          }),
          timing: "COMPONENT_ACTION",
        },
      ],
      timing: "COMPONENT_ACTION",
      type: "HERO",
    },
    "Z'eu": {
      description: intl.formatMessage(
        {
          id: "Naalu Collective.Leaders.Z'eu.Description",
          description: "Description for Naalu Agent: Z'eu",
          defaultMessage:
            "After an agenda is revealed:{br}You may exhaust this card to look at the top card of the agenda deck. Then, you may show that card to 1 other player",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      faction: "Naalu Collective",
      id: "Z'eu",
      name: intl.formatMessage({
        id: "Naalu Collective.Leaders.Z'eu.Name",
        description: "Name of Naalu Agent: Z'eu",
        defaultMessage: "Z'eu",
      }),
      omegas: [
        {
          description: intl.formatMessage({
            id: "Naalu Collective.Leaders.Z'eu.Omega.Description",
            description: "Description for Naalu Agent: Z'eu Ω",
            defaultMessage:
              "ACTION: Exhaust this card and choose a player; that player may perform a tactical action in a non-home system without placing a command token; that system still counts as being activated",
          }),
          expansion: "CODEX THREE",
          name: intl.formatMessage({
            id: "Naalu Collective.Leaders.Z'eu.Omega.Name",
            description: "Name of Naalu Agent: Z'eu Ω",
            defaultMessage: "Z'eu Ω",
          }),
          timing: "COMPONENT_ACTION",
        },
      ],
      timing: "AGENDA_PHASE",
      type: "AGENT",
    },
  };
}
