import { IntlShape } from "react-intl";

export default function getTwilightsFallAbilities(
  intl: IntlShape
): Record<TwilightsFall.TFAbilityId, TFBaseAbility> {
  return {
    Abundance: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Abundance.Text",
          description: "Text of Twilight's Fall Ability: Abundance",
          defaultMessage:
            "When 1 or more of your units use PRODUCTION, you may gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      id: "Abundance",
      name: intl.formatMessage({
        id: "TF.Ability.Abundance.Name",
        description: "Name of Twilight's Fall Ability: Abundance",
        defaultMessage: "Abundance",
      }),
      origin: "Titans of Ul",
      timing: "OTHER",
      type: "YELLOW",
    },
    "Aerie Hololattice": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Aerie Hololattice.Text",
          description: "Text of Twilight's Fall Ability: Aerie Hololattice",
          defaultMessage:
            "Other players cannot move ships through systems that contain your structures.{br}Each planet that contains 1 or more of your structures gains the PRODUCTION 1 ability as if it were a unit.",
        },
        { br: "\n\n" }
      ),
      id: "Aerie Hololattice",
      name: intl.formatMessage({
        id: "TF.Ability.Aerie Hololattice.Name",
        description: "Name of Twilight's Fall Ability: Aerie Hololattice",
        defaultMessage: "Aerie Hololattice",
      }),
      origin: "Argent Flight",
      timing: "OTHER",
      type: "YELLOW",
    },
    Aetherstream: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Aetherstream.Text",
          description: "Text of Twilight's Fall Ability: Aetherstream",
          defaultMessage:
            "After you or one of your neighbors activates a system that is adjacent to an anomaly:{br}You may apply +1 to the move value of all of that player's ships during this tactical action.",
        },
        { br: "\n\n" }
      ),
      id: "Aetherstream",
      name: intl.formatMessage({
        id: "TF.Ability.Aetherstream.Name",
        description: "Name of Twilight's Fall Ability: Aetherstream",
        defaultMessage: "Aetherstream",
      }),
      origin: "Empyrean",
      timing: "OTHER",
      type: "BLUE",
    },
    "Agency Supply Network": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Agency Supply Network.Text",
          description: "Text of Twilight's Fall Ability: Agency Supply Network",
          defaultMessage:
            "Once per action, when you resolve a unit's PRODUCTION ability:{br}You may resolve another of your unit's PRODUCTION abilities in any system.",
        },
        { br: "\n\n" }
      ),
      id: "Agency Supply Network",
      name: intl.formatMessage({
        id: "TF.Ability.Agency Supply Network.Name",
        description: "Name of Twilight's Fall Ability: Agency Supply Network",
        defaultMessage: "Agency Supply Network",
      }),
      origin: "Council Keleres",
      timing: "OTHER",
      type: "YELLOW",
    },
    Amalgamation: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Amalgamation.Text",
          description: "Text of Twilight's Fall Ability: Amalgamation",
          defaultMessage:
            "Capture your opponent's non-structure units that are destroyed during combat.{br}When you produce a unit, you may return 1 captured unit of that type to produce that unit without spending resources.",
        },
        { br: "\n\n" }
      ),
      id: "Amalgamation",
      name: intl.formatMessage({
        id: "TF.Ability.Amalgamation.Name",
        description: "Name of Twilight's Fall Ability: Amalgamation",
        defaultMessage: "Amalgamation",
      }),
      origin: "Vuil'raith Cabal",
      timing: "OTHER",
      type: "RED",
    },
    Ambush: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Ambush.Text",
          description: "Text of Twilight's Fall Ability: Ambush",
          defaultMessage:
            "At the start of a space combat:{br}You may roll 1 die for each of up to 2 of your cruisers or destroyers in the system. For each result equal to or greater than that ship's combat value, produce 1 hit; your opponent must assign it to 1 of their ships.",
        },
        { br: "\n\n" }
      ),
      id: "Ambush",
      name: intl.formatMessage({
        id: "TF.Ability.Ambush.Name",
        description: "Name of Twilight's Fall Ability: Ambush",
        defaultMessage: "Ambush",
      }),
      origin: "Mentak Coalition",
      timing: "OTHER",
      type: "RED",
    },
    Armada: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Armada.Text",
          description: "Text of Twilight's Fall Ability: Armada",
          defaultMessage:
            "The maximum number of non-fighter ships you can have in each system is equal to 2 more than the number of tokens in your fleet pool.",
        },
        { br: "\n\n" }
      ),
      id: "Armada",
      name: intl.formatMessage({
        id: "TF.Ability.Armada.Name",
        description: "Name of Twilight's Fall Ability: Armada",
        defaultMessage: "Armada",
      }),
      origin: "Barony of Letnev",
      timing: "OTHER",
      type: "RED",
    },
    Assimilate: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Assimilate.Text",
          description: "Text of Twilight's Fall Ability: Assimilate",
          defaultMessage:
            "When you gain control of a planet:{br}Replace each structure on that planet with a matching unit from your reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Assimilate",
      name: intl.formatMessage({
        id: "TF.Ability.Assimilate.Name",
        description: "Name of Twilight's Fall Ability: Assimilate",
        defaultMessage: "Assimilate",
      }),
      origin: "L1Z1X Mindnet",
      timing: "OTHER",
      type: "YELLOW",
    },
    Awaken: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Awaken.Text",
          description: "Text of Twilight's Fall Ability: Awaken",
          defaultMessage:
            "After you activate a system that contains 1 or more of your infantry, you may replace 1 of those infantry with a PDS from your reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Awaken",
      name: intl.formatMessage({
        id: "TF.Ability.Awaken.Name",
        description: "Name of Twilight's Fall Ability: Awaken",
        defaultMessage: "Awaken",
      }),
      origin: "Titans of Ul",
      timing: "OTHER",
      type: "BLUE",
    },
    "BioSynthetic Synergy": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Bio-Synthetic Synergy.Text",
          description: "Text of Twilight's Fall Ability: Bio-Synthetic Synergy",
          defaultMessage:
            'Your action cards cannot be canceled by "Shatter" action cards.{br}Your other abilities cannot be taken, purged, or discarded by other players and cannot have singularity tokens placed on them.',
        },
        { br: "\n\n" }
      ),
      id: "BioSynthetic Synergy",
      name: intl.formatMessage({
        id: "TF.Ability.Bio-Synthetic Synergy.Name",
        description: "Name of Twilight's Fall Ability: Bio-Synthetic Synergy",
        defaultMessage: "Bio-Synthetic Synergy",
      }),
      origin: "Last Bastion",
      timing: "OTHER",
      type: "GREEN",
    },
    Bioplasmosis: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Bioplasmosis.Text",
          description: "Text of Twilight's Fall Ability: Bioplasmosis",
          defaultMessage:
            "At the start of the status phase:{br}You may remove any number of ground forces from planets you control and place them on 1 or more planets you control in the same or adjacent systems.",
        },
        { br: "\n\n" }
      ),
      id: "Bioplasmosis",
      name: intl.formatMessage({
        id: "TF.Ability.Bioplasmosis.Name",
        description: "Name of Twilight's Fall Ability: Bioplasmosis",
        defaultMessage: "Bioplasmosis",
      }),
      origin: "Arborec",
      timing: "OTHER",
      type: "GREEN",
    },
    "Chaos Mapping": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Chaos Mapping.Text",
          description: "Text of Twilight's Fall Ability: Chaos Mapping",
          defaultMessage:
            "At the start of your turn during the action phase:{br}You may produce 1 unit in a system that contains at least 1 of your units that has PRODUCTION.",
        },
        { br: "\n\n" }
      ),
      id: "Chaos Mapping",
      name: intl.formatMessage({
        id: "TF.Ability.Chaos Mapping.Name",
        description: "Name of Twilight's Fall Ability: Chaos Mapping",
        defaultMessage: "Chaos Mapping",
      }),
      origin: "Clan of Saar",
      timing: "OTHER",
      type: "BLUE",
    },
    Crafty: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Crafty.Text",
          description: "Text of Twilight's Fall Ability: Crafty",
          defaultMessage:
            "You can have any number of action cards in your hand. Game effects cannot prevent you from using this ability.{br}During your turn of the action phase, players that have passed cannot play action cards.",
        },
        { br: "\n\n" }
      ),
      id: "Crafty",
      name: intl.formatMessage({
        id: "TF.Ability.Crafty.Name",
        description: "Name of Twilight's Fall Ability: Crafty",
        defaultMessage: "Crafty",
      }),
      origin: "Yssaril Tribes",
      timing: "OTHER",
      type: "GREEN",
    },
    Crucible: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Crucible.Text",
          description: "Text of Twilight's Fall Ability: Crucible",
          defaultMessage:
            "Your ships do not roll for gravity rifts; apply an additional +1 to the move values of your ships that would move out of or through a gravity rift instead.",
        },
        { br: "\n\n" }
      ),
      id: "Crucible",
      name: intl.formatMessage({
        id: "TF.Ability.Crucible.Name",
        description: "Name of Twilight's Fall Ability: Crucible",
        defaultMessage: "Crucible",
      }),
      origin: "Vuil'raith Cabal",
      timing: "OTHER",
      type: "BLUE",
    },
    "Courier Transport": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Courier Transport.Text",
          description: "Text of Twilight's Fall Ability: Courier Transport",
          defaultMessage:
            "After you activate a system:{br}You may move your structures from adjacent systems that do not contain your command tokens onto planets you control in the active system.",
        },
        { br: "\n\n" }
      ),
      id: "Courier Transport",
      name: intl.formatMessage({
        id: "TF.Ability.Courier Transport.Name",
        description: "Name of Twilight's Fall Ability: Courier Transport",
        defaultMessage: "Courier Transport",
      }),
      origin: "Ral Nel Consortium",
      timing: "OTHER",
      type: "BLUE",
    },
    Devotion: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Devotion.Text",
          description: "Text of Twilight's Fall Ability: Devotion",
          defaultMessage:
            "After each space combat round:{br}You may destroy 1 of your cruisers or destroyers in the active system to produce 1 hit and assign it to 1 of your opponent's ships in that system.",
        },
        { br: "\n\n" }
      ),
      id: "Devotion",
      name: intl.formatMessage({
        id: "TF.Ability.Devotion.Name",
        description: "Name of Twilight's Fall Ability: Devotion",
        defaultMessage: "Devotion",
      }),
      origin: "Yin Brotherhood",
      timing: "OTHER",
      type: "BLUE",
    },
    "Dimensional Splicer": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Dimensional Splicer.Text",
          description: "Text of Twilight's Fall Ability: Dimensional Splicer",
          defaultMessage:
            "At the start of a space combat in a system that contains a wormhole and 1 or more of your ships:{br}You may produce 1 hit and assign it to 1 of your opponent's ships.",
        },
        { br: "\n\n" }
      ),
      id: "Dimensional Splicer",
      name: intl.formatMessage({
        id: "TF.Ability.Dimensional Splicer.Name",
        description: "Name of Twilight's Fall Ability: Dimensional Splicer",
        defaultMessage: "Dimensional Splicer",
      }),
      origin: "Ghosts of Creuss",
      timing: "OTHER",
      type: "RED",
    },
    "Dimensional Tear": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Dimensional Tear.Text",
          description: "Text of Twilight's Fall Ability: Dimensional Tear",
          defaultMessage:
            "Systems that contain your space docks are also gravity rifts; your ships do not roll for these gravity rifts. Place a dimensional tear token beneath your space docks as a reminder.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Dimensional Tear",
      name: intl.formatMessage({
        id: "TF.Ability.Dimensional Tear.Name",
        description: "Name of Twilight's Fall Ability: Dimensional Tear",
        defaultMessage: "Dimensional Tear",
      }),
      origin: "Vuil'raith Cabal",
      timing: "OTHER",
      type: "BLUE",
    },
    "Distant Suns": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Distant Suns.Text",
          description: "Text of Twilight's Fall Ability: Distant Suns",
          defaultMessage:
            "When you explore a planet that contains 1 of your mechs:{br}You may draw 1 additional card; choose 1 to resolve and discard the rest.",
        },
        { br: "\n\n" }
      ),
      id: "Distant Suns",
      expansion: "POK",
      name: intl.formatMessage({
        id: "TF.Ability.Distant Suns.Name",
        description: "Name of Twilight's Fall Ability: Distant Suns",
        defaultMessage: "Distant Suns",
      }),
      origin: "Naaz-Rokha Alliance",
      timing: "OTHER",
      type: "BLUE",
    },
    "ERes Siphons": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.E-Res Siphons.Text",
          description: "Text of Twilight's Fall Ability: E-Res Siphons",
          defaultMessage:
            "After another player activates a system that contains 1 or more of your ships:{br}Gain 4 trade goods.",
        },
        { br: "\n\n" }
      ),
      id: "ERes Siphons",
      name: intl.formatMessage({
        id: "TF.Ability.E-Res Siphons.Name",
        description: "Name of Twilight's Fall Ability: E-Res Siphons",
        defaultMessage: "E-Res Siphons",
      }),
      origin: "Universities of Jol-Nar",
      timing: "OTHER",
      type: "YELLOW",
    },
    "Entropic Harvest": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Entropic Harvest.Text",
          description: "Text of Twilight's Fall Ability: Entropic Harvest",
          defaultMessage:
            "At the end of any player's combat:{br}Gain 1 commodity or convert 1 of your commodities to a trade good.",
        },
        { br: "\n\n" }
      ),
      id: "Entropic Harvest",
      name: intl.formatMessage({
        id: "TF.Ability.Entropic Harvest.Name",
        description: "Name of Twilight's Fall Ability: Entropic Harvest",
        defaultMessage: "Entropic Harvest",
      }),
      origin: "Crimson Rebellion",
      timing: "OTHER",
      type: "YELLOW",
    },
    Fabrication: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Fabrication.Text",
          description: "Text of Twilight's Fall Ability: Fabrication",
          defaultMessage:
            "ACTION: Either purge 2 of your relic fragments of the same type to gain 1 relic or purge 1 of your relic fragments to gain 1 command token.",
        },
        { br: "\n\n" }
      ),
      expansion: "POK",
      id: "Fabrication",
      name: intl.formatMessage({
        id: "TF.Ability.Fabrication.Name",
        description: "Name of Twilight's Fall Ability: Fabrication",
        defaultMessage: "Fabrication",
      }),
      origin: "Naaz-Rokha Alliance",
      timing: "COMPONENT_ACTION",
      type: "YELLOW",
    },
    "Fleet Logistics": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Fleet Logistics.Text",
          description: "Text of Twilight's Fall Ability: Fleet Logistics",
          defaultMessage:
            "During each of your turns of the action phase, you may perform 2 actions instead of 1.",
        },
        { br: "\n\n" }
      ),
      id: "Fleet Logistics",
      name: intl.formatMessage({
        id: "TF.Ability.Fleet Logistics.Name",
        description: "Name of Twilight's Fall Ability: Fleet Logistics",
        defaultMessage: "Fleet Logistics",
      }),
      origin: "Council Keleres",
      timing: "OTHER",
      type: "BLUE",
    },
    Foresight: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Foresight.Text",
          description: "Text of Twilight's Fall Ability: Foresight",
          defaultMessage:
            "After another player moves ships into a system that contains 1 or more of your ships:{br}You may place 1 command token from your reinforcements in an adjacent system that does not contain another player's ships; move your ships from the active system into that system.",
        },
        { br: "\n\n" }
      ),
      id: "Foresight",
      name: intl.formatMessage({
        id: "TF.Ability.Foresight.Name",
        description: "Name of Twilight's Fall Ability: Foresight",
        defaultMessage: "Foresight",
      }),
      origin: "Naalu Collective",
      timing: "OTHER",
      type: "BLUE",
    },
    "Future Path": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Future Path.Text",
          description: "Text of Twilight's Fall Ability: Future Path",
          defaultMessage:
            'When you gain trade goods from choosing a previously unchosen strategy card or from the "Amicus" strategy card:{br}Triple those trade goods.',
        },
        { br: "\n\n" }
      ),
      id: "Future Path",
      name: intl.formatMessage({
        id: "TF.Ability.Future Path.Name",
        description: "Name of Twilight's Fall Ability: Future Path",
        defaultMessage: "Future Path",
      }),
      origin: "Nomad",
      timing: "OTHER",
      type: "BLUE",
    },
    "Genetic Research": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Genetic Research.Text",
          description: "Text of Twilight's Fall Ability: Genetic Research",
          defaultMessage:
            "At the start of the status phase:{br}Choose a technology color and gain trade goods equal to the number of abilities you own that have that technology color.",
        },
        { br: "\n\n" }
      ),
      id: "Genetic Research",
      name: intl.formatMessage({
        id: "TF.Ability.Genetic Research.Name",
        description: "Name of Twilight's Fall Ability: Genetic Research",
        defaultMessage: "Genetic Research",
      }),
      origin: "Deepwrought Scholarate",
      timing: "OTHER",
      type: "GREEN",
    },
    "Guild Ships": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Guild Ships.Text",
          description: "Text of Twilight's Fall Ability: Guild Ships",
          defaultMessage:
            "You can negotiate transactions with players who are not your neighbor.{br}You can exchange action cards with other players as part of transactions.",
        },
        { br: "\n\n" }
      ),
      id: "Guild Ships",
      name: intl.formatMessage({
        id: "TF.Ability.Guild Ships.Name",
        description: "Name of Twilight's Fall Ability: Guild Ships",
        defaultMessage: "Guild Ships",
      }),
      origin: "Emirates of Hacan",
      timing: "OTHER",
      type: "BLUE",
    },
    Harrow: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Harrow.Text",
          description: "Text of Twilight's Fall Ability: Harrow",
          defaultMessage:
            "At the end of each round of ground combat:{br}Your ships in the active system may use their BOMBARDMENT abilities against your opponent's ground forces on the planet.",
        },
        { br: "\n\n" }
      ),
      id: "Harrow",
      name: intl.formatMessage({
        id: "TF.Ability.Harrow.Name",
        description: "Name of Twilight's Fall Ability: Harrow",
        defaultMessage: "Harrow",
      }),
      origin: "L1Z1X Mindnet",
      timing: "OTHER",
      type: "RED",
    },
    "Hegemonic Trade Policy": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Hegemonic Trade Policy.Text",
          description:
            "Text of Twilight's Fall Ability: Hegemonic Trade Policy",
          defaultMessage:
            "When 1 or more of your units use PRODUCITON:{br}You may swap the resource and influence values of 1 planet you control during this use of PRODUCTION.",
        },
        { br: "\n\n" }
      ),
      id: "Hegemonic Trade Policy",
      name: intl.formatMessage({
        id: "TF.Ability.Hegemonic Trade Policy.Name",
        description: "Name of Twilight's Fall Ability: Hegemonic Trade Policy",
        defaultMessage: "Hegemonic Trade Policy",
      }),
      origin: "Winnu",
      timing: "OTHER",
      type: "YELLOW",
    },
    Indoctrination: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Indoctrination.Text",
          description: "Text of Twilight's Fall Ability: Indoctrination",
          defaultMessage:
            "At the start of a ground combat:{br}You may spend 2 influence to replace 1 of your opponent's participating infantry with 1 infantry from your reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Indoctrination",
      name: intl.formatMessage({
        id: "TF.Ability.Indoctrination.Name",
        description: "Name of Twilight's Fall Ability: Indoctrination",
        defaultMessage: "Indoctrination",
      }),
      origin: "Yin Brotherhood",
      timing: "OTHER",
      type: "GREEN",
    },
    "Inheritance Systems": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Inheritance Systems.Text",
          description: "Text of Twilight's Fall Ability: Inheritance Systems",
          defaultMessage:
            "During the status phase:{br}Draw 1 additional action card and gain 1 additional command token.",
        },
        { br: "\n\n" }
      ),
      id: "Inheritance Systems",
      name: intl.formatMessage({
        id: "TF.Ability.Inheritance Systems.Name",
        description: "Name of Twilight's Fall Ability: Inheritance Systems",
        defaultMessage: "Inheritance Systems",
      }),
      origin: "L1Z1X Mindnet",
      timing: "OTHER",
      type: "YELLOW",
    },
    "Instinct Training": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Instinct Training.Text",
          description: "Text of Twilight's Fall Ability: Instinct Training",
          defaultMessage:
            "When another player plays an action card:{br}You may spend 1 token from your strategy pool to cancel that action card.",
        },
        { br: "\n\n" }
      ),
      id: "Instinct Training",
      name: intl.formatMessage({
        id: "TF.Ability.Instinct Training.Name",
        description: "Name of Twilight's Fall Ability: Instinct Training",
        defaultMessage: "Instinct Training",
      }),
      origin: "Xxcha Kingdom",
      timing: "OTHER",
      type: "GREEN",
    },
    "Lazax Gate Folding": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Lazax Gate Folding.Text",
          description: "Text of Twilight's Fall Ability: Lazax Gate Folding",
          defaultMessage:
            "During your tactical actions:{br}Treat systems that contain legendary planets you do not control as if they contain both an alpha and beta wormhole.",
        },
        { br: "\n\n" }
      ),
      id: "Lazax Gate Folding",
      name: intl.formatMessage({
        id: "TF.Ability.Lazax Gate Folding.Name",
        description: "Name of Twilight's Fall Ability: Lazax Gate Folding",
        defaultMessage: "Lazax Gate Folding",
      }),
      origin: "Winnu",
      timing: "OTHER",
      type: "BLUE",
    },
    Liberate: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Liberate.Text",
          description: "Text of Twilight's Fall Ability: Liberate",
          defaultMessage:
            "When you gain control of a planet:{br}Ready that planet if it contains a number of your infantry equal to or greater than that planet's resource value; otherwise, place 1 infantry on that planet.",
        },
        { br: "\n\n" }
      ),
      id: "Liberate",
      name: intl.formatMessage({
        id: "TF.Ability.Liberate.Name",
        description: "Name of Twilight's Fall Ability: Liberate",
        defaultMessage: "Liberate",
      }),
      origin: "Last Bastion",
      timing: "OTHER",
      type: "RED",
    },
    "Magmus Reactor": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Magmus Reactor.Text",
          description: "Text of Twilight's Fall Ability: Magmus Reactor",
          defaultMessage:
            "Your units can move into and through supernovas.{br}Each supernova that does not contain other players' units and each system that contains 1 or more of your war suns gains the PRODUCTION 5 ability as if it were one of your units.",
        },
        { br: "\n\n" }
      ),
      id: "Magmus Reactor",
      name: intl.formatMessage({
        id: "TF.Ability.Magmus Reactor.Name",
        description: "Name of Twilight's Fall Ability: Magmus Reactor",
        defaultMessage: "Magmus Reactor",
      }),
      origin: "Embers of Muaat",
      timing: "OTHER",
      type: "BLUE",
    },
    "Mirror Computing": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Mirror Computing.Text",
          description: "Text of Twilight's Fall Ability: Mirror Computing",
          defaultMessage:
            "When you spend trade goods:{br}Each trade good is worth 2 resources or influence instead of 1.",
        },
        { br: "\n\n" }
      ),
      id: "Mirror Computing",
      name: intl.formatMessage({
        id: "TF.Ability.Mirror Computing.Name",
        description: "Name of Twilight's Fall Ability: Mirror Computing",
        defaultMessage: "Mirror Computing",
      }),
      origin: "Mentak Coalition",
      timing: "OTHER",
      type: "YELLOW",
    },
    Mitosis: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Mitosis.Text",
          description: "Text of Twilight's Fall Ability: Mitosis",
          defaultMessage:
            "At the start of the status phase:{br}Place 1 infantry from your reinforcements on any planet you control.",
        },
        { br: "\n\n" }
      ),
      id: "Mitosis",
      name: intl.formatMessage({
        id: "TF.Ability.Mitosis.Name",
        description: "Name of Twilight's Fall Ability: Mitosis",
        defaultMessage: "Mitosis",
      }),
      origin: "Arborec",
      timing: "OTHER",
      type: "GREEN",
    },
    "Munitions Reserves": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Munitions Reserves.Text",
          description: "Text of Twilight's Fall Ability: Munitions Reserves",
          defaultMessage:
            "At the start of each round of space combat:{br}You may spend 2 trade goods; you may reroll any number of your dice during this combat round.",
        },
        { br: "\n\n" }
      ),
      id: "Munitions Reserves",
      name: intl.formatMessage({
        id: "TF.Ability.Munitions Reserves.Name",
        description: "Name of Twilight's Fall Ability: Munitions Reserves",
        defaultMessage: "Munitions Reserves",
      }),
      origin: "Barony of Letnev",
      timing: "OTHER",
      type: "RED",
    },
    Nanomachines: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Nanomachines.Text",
          description: "Text of Twilight's Fall Ability: Nanomachines",
          defaultMessage:
            "ACTION: Exhaust this card to place 1 PDS on a planet you control.{br}ACTION: Exhaust this card to repair all of your damaged units.{br}ACTION: Exhaust this card and discard 1 action card to draw 1 action card.",
        },
        { br: "\n\n" }
      ),
      id: "Nanomachines",
      name: intl.formatMessage({
        id: "TF.Ability.Nanomachines.Name",
        description: "Name of Twilight's Fall Ability: Nanomachines",
        defaultMessage: "Nanomachines",
      }),
      origin: "Ral Nel Consortium",
      timing: "COMPONENT_ACTION",
      type: "RED",
    },
    "Neural Parasite": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Neural Parasite.Text",
          description: "Text of Twilight's Fall Ability: Neural Parasite",
          defaultMessage:
            "At the start of your turn:{br}Destroy 1 of another player's infantry in or adjacent to a system that contains your infantry.",
        },
        { br: "\n\n" }
      ),
      id: "Neural Parasite",
      name: intl.formatMessage({
        id: "TF.Ability.Neural Parasite.Name",
        description: "Name of Twilight's Fall Ability: Neural Parasite",
        defaultMessage: "Neural Parasite",
      }),
      origin: "Obsidian",
      timing: "OTHER",
      type: "GREEN",
    },
    Neuroglaive: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Neuroglaive.Text",
          description: "Text of Twilight's Fall Ability: Neuroglaive",
          defaultMessage:
            "After another player actvates a system that contains 1 or more of your ships:{br}That player removes 1 token from their fleet pool and returns it to their reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Neuroglaive",
      name: intl.formatMessage({
        id: "TF.Ability.Neuroglaive.Name",
        description: "Name of Twilight's Fall Ability: Neuroglaive",
        defaultMessage: "Neuroglaive",
      }),
      origin: "Naalu Collective",
      timing: "OTHER",
      type: "RED",
    },
    Nomadic: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Nomadic.Text",
          description: "Text of Twilight's Fall Ability: Nomadic",
          defaultMessage:
            "You can score objectives even if you do not control the planets in your home system.{br}Other players cannot activate asteroid fields that contain 1 or more of your ships.",
        },
        { br: "\n\n" }
      ),
      id: "Nomadic",
      name: intl.formatMessage({
        id: "TF.Ability.Nomadic.Name",
        description: "Name of Twilight's Fall Ability: Nomadic",
        defaultMessage: "Nomadic",
      }),
      origin: "Clan of Saar",
      timing: "OTHER",
      type: "BLUE",
    },
    "NonEuclidean Shielding": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Non-Euclidean Shielding.Text",
          description:
            "Text of Twilight's Fall Ability: Non-Euclidean Shielding",
          defaultMessage:
            "When 1 of your units uses SUSTAIN DAMAGE:{br}Cancel 2 hits instead of 1.",
        },
        { br: "\n\n" }
      ),
      id: "NonEuclidean Shielding",
      name: intl.formatMessage({
        id: "TF.Ability.Non-Euclidean Shielding.Name",
        description: "Name of Twilight's Fall Ability: Non-Euclidean Shielding",
        defaultMessage: "Non-Euclidean Shielding",
      }),
      origin: "Barony of Letnev",
      timing: "OTHER",
      type: "RED",
    },
    "Nullification Field": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Nullification Field.Text",
          description: "Text of Twilight's Fall Ability: Nullification Field",
          defaultMessage:
            "When another player activates a system that contains 1 or more of your ships:{br}You may exhaust this card and spend 1 token from your strategy pool to immediately end that player's turn.",
        },
        { br: "\n\n" }
      ),
      id: "Nullification Field",
      name: intl.formatMessage({
        id: "TF.Ability.Nullification Field.Name",
        description: "Name of Twilight's Fall Ability: Nullification Field",
        defaultMessage: "Nullification Field",
      }),
      origin: "Xxcha Kingdom",
      timing: "OTHER",
      type: "YELLOW",
    },
    "Orbital Drop": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Orbital Drop.Text",
          description: "Text of Twilight's Fall Ability: Orbital Drop",
          defaultMessage:
            "ACTION: Spend 1 token from your strategy pool to place 2 infantry from your reinforcements on 1 planet you control.",
        },
        { br: "\n\n" }
      ),
      id: "Orbital Drop",
      name: intl.formatMessage({
        id: "TF.Ability.Orbital Drop.Name",
        description: "Name of Twilight's Fall Ability: Orbital Drop",
        defaultMessage: "Orbital Drop",
      }),
      origin: "Federation of Sol",
      timing: "COMPONENT_ACTION",
      type: "GREEN",
    },
    Overwatch: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Overwatch.Text",
          description: "Text of Twilight's Fall Ability: Overwatch",
          defaultMessage:
            "After another player moves ships into a system that contains 1 of your command tokens:{br}You may return that token to your reinforcements.",
        },
        { br: "\n\n" }
      ),
      id: "Overwatch",
      name: intl.formatMessage({
        id: "TF.Ability.Overwatch.Name",
        description: "Name of Twilight's Fall Ability: Overwatch",
        defaultMessage: "Overwatch",
      }),
      origin: "Empyrean",
      timing: "OTHER",
      type: "RED",
    },
    Pacifist: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Pacifist.Text",
          description: "Text of Twilight's Fall Ability: Pacifist",
          defaultMessage:
            "When ground forces are committed:{br}If your units on that planet are not already coexisting, you may choose for your units to coexist.",
        },
        { br: "\n\n" }
      ),
      id: "Pacifist",
      name: intl.formatMessage({
        id: "TF.Ability.Pacifist.Name",
        description: "Name of Twilight's Fall Ability: Pacifist",
        defaultMessage: "Pacifist",
      }),
      origin: "Deepwrought Scholarate",
      timing: "OTHER",
      type: "GREEN",
    },
    "Peace Accords": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Peace Accords.Text",
          description: "Text of Twilight's Fall Ability: Peace Accords",
          defaultMessage:
            "After you spend a token from your strategy pool:{br}You may gain control of 1 planet that does not contain the custodians token or any units and is adjacent to a planet you control.",
        },
        { br: "\n\n" }
      ),
      id: "Peace Accords",
      name: intl.formatMessage({
        id: "TF.Ability.Peace Accords.Name",
        description: "Name of Twilight's Fall Ability: Peace Accords",
        defaultMessage: "Peace Accords",
      }),
      origin: "Xxcha Kingdom",
      timing: "OTHER",
      type: "YELLOW",
    },
    Pillage: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Pillage.Text",
          description: "Text of Twilight's Fall Ability: Pillage",
          defaultMessage:
            "After 1 of your neighbors gains trade goods or resolves a transaction:{br}If they have 3 or more trade goods, you may take 1 of their trade goods or commodities.",
        },
        { br: "\n\n" }
      ),
      id: "Pillage",
      name: intl.formatMessage({
        id: "TF.Ability.Pillage.Name",
        description: "Name of Twilight's Fall Ability: Pillage",
        defaultMessage: "Pillage",
      }),
      origin: "Mentak Coalition",
      timing: "OTHER",
      type: "YELLOW",
    },
    Planesplitter: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Planesplitter.Text",
          description: "Text of Twilight's Fall Ability: Planesplitter",
          defaultMessage:
            "When you gain this card, put The Fracture into play.{br}Apply +1 to the MOVE value of each of your ships that start its movement in The Fracture.{br}Apply +2 to the result of each of your units' combat rolls in The Fracture.",
        },
        { br: "\n\n" }
      ),
      id: "Planesplitter",
      name: intl.formatMessage({
        id: "TF.Ability.Planesplitter.Name",
        description: "Name of Twilight's Fall Ability: Planesplitter",
        defaultMessage: "Planesplitter",
      }),
      origin: "Obsidian",
      timing: "OTHER",
      type: "YELLOW",
    },
    "Proxima Targeting VI": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Proxima Targeting VI.Text",
          description: "Text of Twilight's Fall Ability: Proxima Targeting VI",
          defaultMessage:
            "Cancel 1 hit produced by each BOMBARDMENT roll against your units.{br}At the start of a round of ground combat, you may resolve BOMBARDMENT 7 (x3) against your opponent's ground forces; if you do, resolve BOMBARDMENT 7 (x3) against your own ground forces.",
        },
        { br: "\n\n" }
      ),
      id: "Proxima Targeting VI",
      name: intl.formatMessage({
        id: "TF.Ability.Proxima Targeting VI.Name",
        description: "Name of Twilight's Fall Ability: Proxima Targeting VI",
        defaultMessage: "Proxima Targeting VI",
      }),
      origin: "Last Bastion",
      timing: "OTHER",
      type: "RED",
    },
    "Puppet Council": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Puppet Council.Text",
          description: "Text of Twilight's Fall Ability: Puppet Council",
          defaultMessage:
            "At the start of the strategy phase:{br}Replenish your commodities, then gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      id: "Puppet Council",
      name: intl.formatMessage({
        id: "TF.Ability.Puppet Council.Name",
        description: "Name of Twilight's Fall Ability: Puppet Council",
        defaultMessage: "Puppet Council",
      }),
      origin: "Council Keleres",
      timing: "OTHER",
      type: "GREEN",
    },
    "Quantum Datahub Node": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Quantum Datahub Node.Text",
          description: "Text of Twilight's Fall Ability: Quantum Datahub Node",
          defaultMessage:
            "At the end of the strategy phase:{br}You may spend 1 token from your strategy pool and give another player 3 of your trade goods. If you do, give 1 of your strategy cards to that player and take 1 of their strategy cards.",
        },
        { br: "\n\n" }
      ),
      id: "Quantum Datahub Node",
      name: intl.formatMessage({
        id: "TF.Ability.Quantum Datahub Node.Name",
        description: "Name of Twilight's Fall Ability: Quantum Datahub Node",
        defaultMessage: "Quantum Datahub Node",
      }),
      origin: "Emirates of Hacan",
      timing: "OTHER",
      type: "YELLOW",
    },
    "Quantum Drive": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Quantum Drive.Text",
          description: "Text of Twilight's Fall Ability: Quantum Drive",
          defaultMessage:
            "You can produce your flagship without spending resources.",
        },
        { br: "\n\n" }
      ),
      id: "Quantum Drive",
      name: intl.formatMessage({
        id: "TF.Ability.Quantum Drive.Name",
        description: "Name of Twilight's Fall Ability: Quantum Drive",
        defaultMessage: "Quantum Drive",
      }),
      origin: "Nomad",
      timing: "OTHER",
      type: "BLUE",
    },
    "Quantum Entanglement": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Quantum Entanglement.Text",
          description: "Text of Twilight's Fall Ability: Quantum Entanglement",
          defaultMessage:
            "You treat all systems that contain either an alpha or beta wormhole as adjacent to each other. Game effects cannot prevent you from using this ability.",
        },
        { br: "\n\n" }
      ),
      id: "Quantum Entanglement",
      name: intl.formatMessage({
        id: "TF.Ability.Quantum Entanglement.Name",
        description: "Name of Twilight's Fall Ability: Quantum Entanglement",
        defaultMessage: "Quantum Entanglement",
      }),
      origin: "Ghosts of Creuss",
      timing: "OTHER",
      type: "BLUE",
    },
    "Radical Advancement": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Radical Advancement.Text",
          description: "Text of Twilight's Fall Ability: Radical Advancement",
          defaultMessage:
            "At the start of the status phase:{br}You may choose to replace 1 of your abilities; if you do, reveal abilities from the deck until you reveal another ability with the same technology color and gain it; shuffle the replaced ability and the other revealed cards back into the deck.",
        },
        { br: "\n\n" }
      ),
      id: "Radical Advancement",
      name: intl.formatMessage({
        id: "TF.Ability.Radical Advancement.Name",
        description: "Name of Twilight's Fall Ability: Radical Advancement",
        defaultMessage: "Radical Advancement",
      }),
      origin: "Deepwrought Scholarate",
      timing: "OTHER",
      type: "GREEN",
    },
    "Raid Formation": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Raid Formation.Text",
          description: "Text of Twilight's Fall Ability: Raid Formation",
          defaultMessage:
            "When 1 or more of your units uses ANTI-FIGHTER BARRAGE:{br}For each hit produced in excess of your opponent's fighters, choose 1 of your opponent's ships that has SUSTAIN DAMAGE to become damaged.",
        },
        { br: "\n\n" }
      ),
      id: "Raid Formation",
      name: intl.formatMessage({
        id: "TF.Ability.Raid Formation.Name",
        description: "Name of Twilight's Fall Ability: Raid Formation",
        defaultMessage: "Raid Formation",
      }),
      origin: "Argent Flight",
      timing: "OTHER",
      type: "RED",
    },
    Reclamation: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Reclamation.Text",
          description: "Text of Twilight's Fall Ability: Reclamation",
          defaultMessage:
            "After you resolve an action during which you gained control of a legendary planet:{br}You may place 1 PDS and 1 space dock from your reinforcements on that planet.",
        },
        { br: "\n\n" }
      ),
      id: "Reclamation",
      name: intl.formatMessage({
        id: "TF.Ability.Reclamation.Name",
        description: "Name of Twilight's Fall Ability: Reclamation",
        defaultMessage: "Reclamation",
      }),
      origin: "Winnu",
      timing: "OTHER",
      type: "YELLOW",
    },
    Scavenge: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Scavenge.Text",
          description: "Text of Twilight's Fall Ability: Scavenge",
          defaultMessage:
            "After you gain control of a planet:{br}Gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      id: "Scavenge",
      name: intl.formatMessage({
        id: "TF.Ability.Scavenge.Name",
        description: "Name of Twilight's Fall Ability: Scavenge",
        defaultMessage: "Scavenge",
      }),
      origin: "Clan of Saar",
      timing: "OTHER",
      type: "YELLOW",
    },
    Scheming: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Scheming.Text",
          description: "Text of Twilight's Fall Ability: Scheming",
          defaultMessage:
            "When you draw 1 or more action cards:{br}Draw 1 additional action card. Then, choose and discard 1 action card from your hand.",
        },
        { br: "\n\n" }
      ),
      id: "Scheming",
      name: intl.formatMessage({
        id: "TF.Ability.Scheming.Name",
        description: "Name of Twilight's Fall Ability: Scheming",
        defaultMessage: "Scheming",
      }),
      origin: "Yssaril Tribes",
      timing: "OTHER",
      type: "GREEN",
    },
    "Singularity X": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Singularity X.Text",
          description: "Text of Twilight's Fall Ability: Singularity X",
          defaultMessage:
            "Once per combat, after 1 of your opponent's units is destroyed:{br}You may place the \"Singularity X\" token on one of your opponent's abilities. While that token is on a card, this card gains that card's text. You cannot place a singularity token on a card that already has a singularity token.",
        },
        { br: "\n\n" }
      ),
      id: "Singularity X",
      name: intl.formatMessage({
        id: "TF.Ability.Singularity X.Name",
        description: "Name of Twilight's Fall Ability: Singularity X",
        defaultMessage: "Singularity X",
      }),
      origin: "Nekro Virus",
      timing: "OTHER",
      type: "GREEN",
    },
    "Singularity Y": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Singularity Y.Text",
          description: "Text of Twilight's Fall Ability: Singularity Y",
          defaultMessage:
            "Once per combat, after 1 of your opponent's units is destroyed:{br}You may place the \"Singularity Y\" token on one of your opponent's abilities. While that token is on a card, this card gains that card's text. You cannot place a singularity token on a card that already has a singularity token.",
        },
        { br: "\n\n" }
      ),
      id: "Singularity Y",
      name: intl.formatMessage({
        id: "TF.Ability.Singularity Y.Name",
        description: "Name of Twilight's Fall Ability: Singularity Y",
        defaultMessage: "Singularity Y",
      }),
      origin: "Nekro Virus",
      timing: "OTHER",
      type: "GREEN",
    },
    "Singularity Z": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Singularity Z.Text",
          description: "Text of Twilight's Fall Ability: Singularity Z",
          defaultMessage:
            "Once per combat, after 1 of your opponent's units is destroyed:{br}You may place the \"Singularity Z\" token on one of your opponent's abilities. While that token is on a card, this card gains that card's text. You cannot place a singularity token on a card that already has a singularity token.",
        },
        { br: "\n\n" }
      ),
      id: "Singularity Z",
      name: intl.formatMessage({
        id: "TF.Ability.Singularity Z.Name",
        description: "Name of Twilight's Fall Ability: Singularity Z",
        defaultMessage: "Singularity Z",
      }),
      origin: "Nekro Virus",
      timing: "OTHER",
      type: "GREEN",
    },
    "Sled Factories": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Sled Factories.Text",
          description: "Text of Twilight's Fall Ability: Sled Factories",
          defaultMessage:
            "When 1 or more of your units use PRODUCTION:{br}Reduce the combined cost of the produced units by 2.",
        },
        { br: "\n\n" }
      ),
      id: "Sled Factories",
      name: intl.formatMessage({
        id: "TF.Ability.Sled Factories.Name",
        description: "Name of Twilight's Fall Ability: Sled Factories",
        defaultMessage: "Sled Factories",
      }),
      origin: "Emirates of Hacan",
      timing: "OTHER",
      type: "YELLOW",
    },
    Slipstream: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Slipstream.Text",
          description: "Text of Twilight's Fall Ability: Slipstream",
          defaultMessage:
            "During your tactical actions:{br}Apply +1 to the move value of each of your ships that starts its movement in a system that contains a wormhole.",
        },
        { br: "\n\n" }
      ),
      id: "Slipstream",
      name: intl.formatMessage({
        id: "TF.Ability.Slipstream.Name",
        description: "Name of Twilight's Fall Ability: Slipstream",
        defaultMessage: "Slipstream",
      }),
      origin: "Ghosts of Creuss",
      timing: "OTHER",
      type: "BLUE",
    },
    "Smothering Presence": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Smothering Presence.Text",
          description: "Text of Twilight's Fall Ability: Smothering Presence",
          defaultMessage:
            "Other players' units in or adjacent to systems that contain your structures lose all of their unit abilities.",
        },
        { br: "\n\n" }
      ),
      id: "Smothering Presence",
      name: intl.formatMessage({
        id: "TF.Ability.Smothering Presence.Name",
        description: "Name of Twilight's Fall Ability: Smothering Presence",
        defaultMessage: "Smothering Presence",
      }),
      origin: "Crimson Rebellion",
      timing: "OTHER",
      type: "GREEN",
    },
    "Spatial Conduit Cylinder": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Spatial Conduit Cylinder.Text",
          description:
            "Text of Twilight's Fall Ability: Spatial Conduit Cylinder",
          defaultMessage:
            "After you activate a system that contains 1 or more of your units:{br}That system is adjacent to all other systems that contain 1 or more of your units during this action.",
        },
        { br: "\n\n" }
      ),
      id: "Spatial Conduit Cylinder",
      name: intl.formatMessage({
        id: "TF.Ability.Spatial Conduit Cylinder.Name",
        description:
          "Name of Twilight's Fall Ability: Spatial Conduit Cylinder",
        defaultMessage: "Spatial Conduit Cylinder",
      }),
      origin: "Universities of Jol-Nar",
      timing: "OTHER",
      type: "BLUE",
    },
    "Spec Ops Training": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Spec Ops Training.Text",
          description: "Text of Twilight's Fall Ability: Spec Ops Training",
          defaultMessage:
            "After 1 of your ground forces is destroyed:{br}Roll 1 die. If the result is 5 or greater, place the unit on this card. At the start of your next turn, place each unit that is on this card on a planet you control in your home system.",
        },
        { br: "\n\n" }
      ),
      id: "Spec Ops Training",
      name: intl.formatMessage({
        id: "TF.Ability.Spec Ops Training.Name",
        description: "Name of Twilight's Fall Ability: Spec Ops Training",
        defaultMessage: "Spec Ops Training",
      }),
      origin: "Federation of Sol",
      timing: "OTHER",
      type: "GREEN",
    },
    "Stall Tactics": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Stall Tactics.Text",
          description: "Text of Twilight's Fall Ability: Stall Tactics",
          defaultMessage: "	ACTION: Discard 1 action card from your hand.",
        },
        { br: "\n\n" }
      ),
      id: "Stall Tactics",
      name: intl.formatMessage({
        id: "TF.Ability.Stall Tactics.Name",
        description: "Name of Twilight's Fall Ability: Stall Tactics",
        defaultMessage: "Stall Tactics",
      }),
      origin: "Yssaril Tribes",
      timing: "COMPONENT_ACTION",
      type: "BLUE",
    },
    "Star Forge": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Star Forge.Text",
          description: "Text of Twilight's Fall Ability: Star Forge",
          defaultMessage:
            "ACTION: Spend 1 token from your strategy pool to place either 2 fighters or 1 destroyer from your reinforcements in a system that contains 1 or more of your ships.",
        },
        { br: "\n\n" }
      ),
      id: "Star Forge",
      name: intl.formatMessage({
        id: "TF.Ability.Star Forge.Name",
        description: "Name of Twilight's Fall Ability: Star Forge",
        defaultMessage: "Star Forge",
      }),
      origin: "Embers of Muaat",
      timing: "COMPONENT_ACTION",
      type: "YELLOW",
    },
    "Stellar Genesis": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Stellar Genesis.Text",
          description: "Text of Twilight's Fall Ability: Stellar Genesis",
          defaultMessage:
            "After you spend a token from your strategy pool:{br}You may gain 1 trade good.",
        },
        { br: "\n\n" }
      ),
      id: "Stellar Genesis",
      name: intl.formatMessage({
        id: "TF.Ability.Stellar Genesis.Name",
        description: "Name of Twilight's Fall Ability: Stellar Genesis",
        defaultMessage: "Stellar Genesis",
      }),
      origin: "Embers of Muaat",
      timing: "OTHER",
      type: "YELLOW",
    },
    Stymie: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Stymie.Text",
          description: "Text of Twilight's Fall Ability: Stymie",
          defaultMessage:
            "After another player moves ships into a system that contains 1 or more of your units:{br}You may place 1 command token from that player's reinforcements in any non-home system.",
        },
        { br: "\n\n" }
      ),
      id: "Stymie",
      name: intl.formatMessage({
        id: "TF.Ability.Stymie.Name",
        description: "Name of Twilight's Fall Ability: Stymie",
        defaultMessage: "Stymie",
      }),
      origin: "Arborec",
      timing: "OTHER",
      type: "GREEN",
    },
    "Subatomic Splicer": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Subatomic Splicer.Text",
          description: "Text of Twilight's Fall Ability: Subatomic Splicer",
          defaultMessage:
            "When one of your ships is destroyed:{br}You may produce a ship of the same type at a space dock in your home system.",
        },
        { br: "\n\n" }
      ),
      id: "Subatomic Splicer",
      name: intl.formatMessage({
        id: "TF.Ability.Subatomic Splicer.Name",
        description: "Name of Twilight's Fall Ability: Subatomic Splicer",
        defaultMessage: "Subatomic Splicer",
      }),
      origin: "Crimson Rebellion",
      timing: "OTHER",
      type: "YELLOW",
    },
    Supercharge: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Supercharge.Text",
          description: "Text of Twilight's Fall Ability: Supercharge",
          defaultMessage:
            "Before making a combat roll:{br}Choose 1 of your units and apply +2 to the results of its combat roll.",
        },
        { br: "\n\n" }
      ),
      id: "Supercharge",
      name: intl.formatMessage({
        id: "TF.Ability.Supercharge.Name",
        description: "Name of Twilight's Fall Ability: Supercharge",
        defaultMessage: "Supercharge",
      }),
      origin: "Naaz-Rokha Alliance",
      timing: "OTHER",
      type: "RED",
    },
    "Survival Instinct": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Survival Instinct.Text",
          description: "Text of Twilight's Fall Ability: Survival Instinct",
          defaultMessage:
            "After a player actives a system that contains your ships:{br}You may move up to 2 of your ships into the active system from adjacent systems that do not contain your command tokens.",
        },
        { br: "\n\n" }
      ),
      id: "Survival Instinct",
      name: intl.formatMessage({
        id: "TF.Ability.Survival Instinct.Name",
        description: "Name of Twilight's Fall Ability: Survival Instinct",
        defaultMessage: "Survival Instinct",
      }),
      origin: "Ral Nel Consortium",
      timing: "OTHER",
      type: "RED",
    },
    "Tactical Brilliance": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Tactical Brilliance.Text",
          description: "Text of Twilight's Fall Ability: Tactical Brilliance",
          defaultMessage:
            "After you roll dice for a unit ability:{br}You may reroll any of those dice.",
        },
        { br: "\n\n" }
      ),
      id: "Tactical Brilliance",
      name: intl.formatMessage({
        id: "TF.Ability.Tactical Brilliance.Name",
        description: "Name of Twilight's Fall Ability: Tactical Brilliance",
        defaultMessage: "Tactical Brilliance",
      }),
      origin: "Universities of Jol-Nar",
      timing: "OTHER",
      type: "RED",
    },
    Telepathic: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Telepathic.Text",
          description: "Text of Twilight's Fall Ability: Telepathic",
          defaultMessage:
            'At the end of the strategy phase:{br}Place the Naalu "0" token on your strategy card; you are first in initiative order.{br}This card cannot have a singularity token placed on it.',
        },
        { br: "\n\n" }
      ),
      id: "Telepathic",
      name: intl.formatMessage({
        id: "TF.Ability.Telepathic.Name",
        description: "Name of Twilight's Fall Ability: Telepathic",
        defaultMessage: "Telepathic",
      }),
      origin: "Naalu Collective",
      timing: "OTHER",
      type: "GREEN",
    },
    // TODO: Check for errata
    "Temporal Command Suite": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Temporal Command Suite.Text",
          description:
            "Text of Twilight's Fall Ability: Temporal Command Suite",
          defaultMessage:
            "After any player's genome becomes exhausted:{br}You may spend 3 influence to ready that genome; if you ready another player's genome, you may perform a transaction with that player.",
        },
        { br: "\n\n" }
      ),
      id: "Temporal Command Suite",
      name: intl.formatMessage({
        id: "TF.Ability.Temporal Command Suite.Name",
        description: "Name of Twilight's Fall Ability: Temporal Command Suite",
        defaultMessage: "Temporal Command Suite",
      }),
      origin: "Nomad",
      timing: "OTHER",
      type: "YELLOW",
    },
    Terraform: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Terraform.Text",
          description: "Text of Twilight's Fall Ability: Terraform",
          defaultMessage:
            "Planets that contain your structures are treated as having all 3 planet traits (cultural, hazardous, and industrial)",
        },
        { br: "\n\n" }
      ),
      id: "Terraform",
      name: intl.formatMessage({
        id: "TF.Ability.Terraform.Name",
        description: "Name of Twilight's Fall Ability: Terraform",
        defaultMessage: "Terraform",
      }),
      origin: "Titans of Ul",
      timing: "OTHER",
      type: "BLUE",
    },
    "The Burning Eye": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.The Burning Eye.Text",
          description: "Text of Twilight's Fall Ability: The Burning Eye",
          defaultMessage:
            "You can treat planets in systems that contain your ships as if you contolled them for the purpose of scoring secret objectives.",
        },
        { br: "\n\n" }
      ),
      id: "The Burning Eye",
      name: intl.formatMessage({
        id: "TF.Ability.The Burning Eye.Name",
        description: "Name of Twilight's Fall Ability: The Burning Eye",
        defaultMessage: "The Burning Eye",
      }),
      origin: "Obsidian",
      timing: "OTHER",
      type: "RED",
    },
    Unrelenting: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Unrelenting.Text",
          description: "Text of Twilight's Fall Ability: Unrelenting",
          defaultMessage:
            "Apply +1 to the result of each of your unit's combat rolls.",
        },
        { br: "\n\n" }
      ),
      id: "Unrelenting",
      name: intl.formatMessage({
        id: "TF.Ability.Unrelenting.Name",
        description: "Name of Twilight's Fall Ability: Unrelenting",
        defaultMessage: "Unrelenting",
      }),
      origin: "Sardakk N'orr",
      timing: "OTHER",
      type: "RED",
    },
    "Valkyrie Particle Weave": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Valkyrie Particle Weave.Text",
          description:
            "Text of Twilight's Fall Ability: Valkyrie Particle Weave",
          defaultMessage:
            "After making combat rolls during a round of ground combat:{br}If your opponent produced 1 or more hits, you produce 1 additional hit.",
        },
        { br: "\n\n" }
      ),
      id: "Valkyrie Particle Weave",
      name: intl.formatMessage({
        id: "TF.Ability.Valkyrie Particle Weave.Name",
        description: "Name of Twilight's Fall Ability: Valkyrie Particle Weave",
        defaultMessage: "Valkyrie Particle Weave",
      }),
      origin: "Sardakk N'orr",
      timing: "OTHER",
      type: "RED",
    },
    "Valkyrie Vanguard": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Valkyrie Vanguard.Text",
          description: "Text of Twilight's Fall Ability: Valkyrie Vanguard",
          defaultMessage:
            'During the "Commit Ground Forces" step:{br}You can commit up to 1 ground force from each planet in the active system and each planet in adjacent systems that do not contain 1 of your command tokens.',
        },
        { br: "\n\n" }
      ),
      id: "Valkyrie Vanguard",
      name: intl.formatMessage({
        id: "TF.Ability.Valkyrie Vanguard.Name",
        description: "Name of Twilight's Fall Ability: Valkyrie Vanguard",
        defaultMessage: "Valkyrie Vanguard",
      }),
      origin: "Sardakk N'orr",
      timing: "OTHER",
      type: "BLUE",
    },
    Versatile: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Versatile.Text",
          description: "Text of Twilight's Fall Ability: Versatile",
          defaultMessage:
            "When you gain command tokens during the status phase:{br}Gain 1 additional command token.",
        },
        { br: "\n\n" }
      ),
      id: "Versatile",
      name: intl.formatMessage({
        id: "TF.Ability.Versatile.Name",
        description: "Name of Twilight's Fall Ability: Versatile",
        defaultMessage: "Versatile",
      }),
      origin: "Federation of Sol",
      timing: "OTHER",
      type: "GREEN",
    },
    Voidborn: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Voidborn.Text",
          description: "Text of Twilight's Fall Ability: Voidborn",
          defaultMessage:
            "Nebulae do not affect your ships' movement.{br}You can allow other players to move their ships through systems that contain your ships.",
        },
        { br: "\n\n" }
      ),
      id: "Voidborn",
      name: intl.formatMessage({
        id: "TF.Ability.Voidborn.Name",
        description: "Name of Twilight's Fall Ability: Voidborn",
        defaultMessage: "Voidborn",
      }),
      origin: "Empyrean",
      timing: "OTHER",
      type: "BLUE",
    },
    "Yin Ascendant": {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Yin Ascendant.Text",
          description: "Text of Twilight's Fall Ability: Yin Ascendant",
          defaultMessage:
            "When you score an objective:{br}Draw 1 genome, ability,  or unit upgrade.",
        },
        { br: "\n\n" }
      ),
      id: "Yin Ascendant",
      name: intl.formatMessage({
        id: "TF.Ability.Yin Ascendant.Name",
        description: "Name of Twilight's Fall Ability: Yin Ascendant",
        defaultMessage: "Yin Ascendant",
      }),
      origin: "Yin Brotherhood",
      timing: "OTHER",
      type: "GREEN",
    },
    Zealous: {
      description: intl.formatMessage(
        {
          id: "TF.Ability.Zealous.Text",
          description: "Text of Twilight's Fall Ability: Zealous",
          defaultMessage:
            "When 1 or more of your units roll dice for a unit ability:{br}You may choose 1 of those units to roll 1 additional die.",
        },
        { br: "\n\n" }
      ),
      id: "Zealous",
      name: intl.formatMessage({
        id: "TF.Ability.Zealous.Name",
        description: "Name of Twilight's Fall Ability: Zealous",
        defaultMessage: "Zealous",
      }),
      origin: "Argent Flight",
      timing: "OTHER",
      type: "RED",
    },
  };
}
