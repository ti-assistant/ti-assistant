import { IntlShape } from "react-intl";

export default function getProphecyOfKingsObjectives(
  intl: IntlShape,
): Record<ProphecyOfKings.ObjectiveId, BaseObjective> {
  return {
    "Achieve Supremacy": {
      description: intl.formatMessage({
        id: "Objectives.Achieve Supremacy.Description",
        description: "Description for Objective: Achieve Supremacy",
        defaultMessage:
          "Have your flagship or a war sun in another player's home system or the Mecatol Rex system.",
      }),
      expansion: "POK",
      id: "Achieve Supremacy",
      name: intl.formatMessage({
        id: "Objectives.Achieve Supremacy.Title",
        description: "Title of Objective: Achieve Supremacy",
        defaultMessage: "Achieve Supremacy",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Amass Wealth": {
      description: intl.formatMessage({
        id: "Objectives.Amass Wealth.Description",
        description: "Description for Objective: Amass Wealth",
        defaultMessage: "Spend 3 influence, 3 resources, and 3 trade goods.",
      }),
      expansion: "POK",
      id: "Amass Wealth",
      name: intl.formatMessage({
        id: "Objectives.Amass Wealth.Title",
        description: "Title of Objective: Amass Wealth",
        defaultMessage: "Amass Wealth",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Become a Legend": {
      description: intl.formatMessage({
        id: "Objectives.Become a Legend.Description",
        description: "Description for Objective: Become a Legend",
        defaultMessage:
          "Have units in 4 systems that contain legendary planets, Mecatol Rex, or anomalies.",
      }),
      expansion: "POK",
      id: "Become a Legend",
      name: intl.formatMessage({
        id: "Objectives.Become a Legend.Title",
        description: "Title of Objective: Become a Legend",
        defaultMessage: "Become a Legend",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Become a Martyr": {
      description: intl.formatMessage({
        id: "Objectives.Become a Martyr.Description",
        description: "Description for Objective: Become a Martyr",
        defaultMessage: "Lose control of a planet in a home system.",
      }),
      expansion: "POK",
      id: "Become a Martyr",
      name: intl.formatMessage({
        id: "Objectives.Become a Martyr.Title",
        description: "Title of Objective: Become a Martyr",
        defaultMessage: "Become a Martyr",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Betray a Friend": {
      description: intl.formatMessage({
        id: "Objectives.Betray a Friend.Description",
        description: "Description for Objective: Betray a Friend",
        defaultMessage:
          "Win a combat against a player whose promissory note you had in your play area at the start of your tactical action.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Betray a Friend",
      name: intl.formatMessage({
        id: "Objectives.Betray a Friend.Title",
        description: "Title of Objective: Betray a Friend",
        defaultMessage: "Betray a Friend",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Brave the Void": {
      description: intl.formatMessage({
        id: "Objectives.Brave the Void.Description",
        description: "Description for Objective: Brave the Void",
        defaultMessage: "Win a combat in an anomaly.",
      }),
      expansion: "POK",
      id: "Brave the Void",
      name: intl.formatMessage({
        id: "Objectives.Brave the Void.Title",
        description: "Title of Objective: Brave the Void",
        defaultMessage: "Brave the Void",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Build Defenses": {
      description: intl.formatMessage({
        id: "Objectives.Build Defenses.Description",
        description: "Description for Objective: Build Defenses",
        defaultMessage: "Have 4 or more structures.",
      }),
      expansion: "POK",
      id: "Build Defenses",
      name: intl.formatMessage({
        id: "Objectives.Build Defenses.Title",
        description: "Title of Objective: Build Defenses",
        defaultMessage: "Build Defenses",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Command an Armada": {
      description: intl.formatMessage({
        id: "Objectives.Command an Armada.Description",
        description: "Description for Objective: Command an Armada",
        defaultMessage: "Have 8 or more non-fighter ships in 1 system.",
      }),
      expansion: "POK",
      id: "Command an Armada",
      name: intl.formatMessage({
        id: "Objectives.Command an Armada.Title",
        description: "Title of Objective: Command an Armada",
        defaultMessage: "Command an Armada",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Construct Massive Cities": {
      description: intl.formatMessage({
        id: "Objectives.Construct Massive Cities.Description",
        description: "Description for Objective: Construct Massive Cities",
        defaultMessage: "Have 7 or more structures.",
      }),
      expansion: "POK",
      id: "Construct Massive Cities",
      name: intl.formatMessage({
        id: "Objectives.Construct Massive Cities.Title",
        description: "Title of Objective: Construct Massive Cities",
        defaultMessage: "Construct Massive Cities",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Control the Borderlands": {
      description: intl.formatMessage({
        id: "Objectives.Control the Borderlands.Description",
        description: "Description for Objective: Control the Borderlands",
        defaultMessage:
          "Have units in 5 systems on the edge of the game board other than your home system.",
      }),
      expansion: "POK",
      id: "Control the Borderlands",
      name: intl.formatMessage({
        id: "Objectives.Control the Borderlands.Title",
        description: "Title of Objective: Control the Borderlands",
        defaultMessage: "Control the Borderlands",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Darken the Skies": {
      description: intl.formatMessage({
        id: "Objectives.Darken the Skies.Description",
        description: "Description for Objective: Darken the Skies",
        defaultMessage: "Win a combat in another player's home system.",
      }),
      expansion: "POK",
      id: "Darken the Skies",
      name: intl.formatMessage({
        id: "Objectives.Darken the Skies.Title",
        description: "Title of Objective: Darken the Skies",
        defaultMessage: "Darken the Skies",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Defy Space and Time": {
      description: intl.formatMessage({
        id: "Objectives.Defy Space and Time.Description",
        description: "Description for Objective: Defy Space and Time",
        defaultMessage: "Have units in the wormhole nexus.",
      }),
      expansion: "POK",
      id: "Defy Space and Time",
      name: intl.formatMessage({
        id: "Objectives.Defy Space and Time.Title",
        description: "Title of Objective: Defy Space and Time",
        defaultMessage: "Defy Space and Time",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Demonstrate Your Power": {
      description: intl.formatMessage({
        id: "Objectives.Demonstrate Your Power.Description",
        description: "Description for Objective: Demonstrate Your Power",
        defaultMessage:
          "Have 3 or more non-fighter ships in the active system at the end of a space combat.",
      }),
      expansion: "POK",
      id: "Demonstrate Your Power",
      name: intl.formatMessage({
        id: "Objectives.Demonstrate Your Power.Title",
        description: "Title of Objective: Demonstrate Your Power",
        defaultMessage: "Demonstrate Your Power",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Destroy Heretical Works": {
      description: intl.formatMessage({
        id: "Objectives.Destroy Heretical Works.Description",
        description: "Description for Objective: Destroy Heretical Works",
        defaultMessage: "Purge 2 of your relic fragments of any type.",
      }),
      expansion: "POK",
      id: "Destroy Heretical Works",
      name: intl.formatMessage({
        id: "Objectives.Destroy Heretical Works.Title",
        description: "Title of Objective: Destroy Heretical Works",
        defaultMessage: "Destroy Heretical Works",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Dictate Policy": {
      description: intl.formatMessage({
        id: "Objectives.Dictate Policy.Description",
        description: "Description for Objective: Dictate Policy",
        defaultMessage: "There are 3 or more laws in play.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Dictate Policy",
      name: intl.formatMessage({
        id: "Objectives.Dictate Policy.Title",
        description: "Title of Objective: Dictate Policy",
        defaultMessage: "Dictate Policy",
      }),
      phase: "AGENDA",
      points: 1,
      type: "SECRET",
    },
    "Discover Lost Outposts": {
      description: intl.formatMessage({
        id: "Objectives.Discover Lost Outposts.Description",
        description: "Description for Objective: Discover Lost Outposts",
        defaultMessage: "Control 2 planets that have attachments.",
      }),
      expansion: "POK",
      id: "Discover Lost Outposts",
      name: intl.formatMessage({
        id: "Objectives.Discover Lost Outposts.Title",
        description: "Title of Objective: Discover Lost Outposts",
        defaultMessage: "Discover Lost Outposts",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Drive the Debate": {
      description: intl.formatMessage({
        id: "Objectives.Drive the Debate.Description",
        description: "Description for Objective: Drive the Debate",
        defaultMessage: "You or a planet you control are elected by an agenda.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Drive the Debate",
      name: intl.formatMessage({
        id: "Objectives.Drive the Debate.Title",
        description: "Title of Objective: Drive the Debate",
        defaultMessage: "Drive the Debate",
      }),
      phase: "AGENDA",
      points: 1,
      type: "SECRET",
    },
    "Engineer a Marvel": {
      description: intl.formatMessage({
        id: "Objectives.Engineer a Marvel.Description",
        description: "Description for Objective: Engineer a Marvel",
        defaultMessage: "Have your flagship or a war sun on the game board.",
      }),
      expansion: "POK",
      id: "Engineer a Marvel",
      name: intl.formatMessage({
        id: "Objectives.Engineer a Marvel.Title",
        description: "Title of Objective: Engineer a Marvel",
        defaultMessage: "Engineer a Marvel",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Establish Hegemony": {
      description: intl.formatMessage({
        id: "Objectives.Establish Hegemony.Description",
        description: "Description for Objective: Establish Hegemony",
        defaultMessage:
          "Control planets that have a combined influence value of at least 12.",
      }),
      expansion: "POK",
      id: "Establish Hegemony",
      name: intl.formatMessage({
        id: "Objectives.Establish Hegemony.Title",
        description: "Title of Objective: Establish Hegemony",
        defaultMessage: "Establish Hegemony",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Explore Deep Space": {
      description: intl.formatMessage({
        id: "Objectives.Explore Deep Space.Description",
        description: "Description for Objective: Explore Deep Space",
        defaultMessage: "Have units in 3 systems that do not contain planets.",
      }),
      expansion: "POK",
      id: "Explore Deep Space",
      name: intl.formatMessage({
        id: "Objectives.Explore Deep Space.Title",
        description: "Title of Objective: Explore Deep Space",
        defaultMessage: "Explore Deep Space",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Fight With Precision": {
      description: intl.formatMessage({
        id: "Objectives.Fight With Precision.Description",
        description: "Description for Objective: Fight With Precision",
        defaultMessage:
          "Use ANTI-FIGHTER BARRAGE to destroy the last of a player's fighters in a system.",
      }),
      expansion: "POK",
      id: "Fight With Precision",
      name: intl.formatMessage({
        id: "Objectives.Fight With Precision.Title",
        description: "Title of Objective: Fight With Precision",
        defaultMessage: "Fight With Precision",
      }),
      omegas: [
        {
          description: intl.formatMessage({
            id: "Objectives.Fight With Precision.Omega.Description",
            description: "Description for Objective: Fight With Precision Ω",
            defaultMessage:
              "Destroy the last of a player's fighters in the active system during the anti-fighter barrage step",
          }),
          name: intl.formatMessage({
            id: "Objectives.Fight With Precision.Omega.Title",
            description: "Title of Objective: Fight With Precision Ω",
            defaultMessage: "Fight With Precision Ω",
          }),
          expansion: "CODEX THREE",
        },
        {
          expansion: "THUNDERS EDGE",
          name: intl.formatMessage({
            id: "Objectives.Fight With Precision.Title",
            description: "Title of Objective: Fight With Precision",
            defaultMessage: "Fight With Precision",
          }),
        },
      ],
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Foster Cohesion": {
      description: intl.formatMessage({
        id: "Objectives.Foster Cohesion.Description",
        description: "Description for Objective: Foster Cohesion",
        defaultMessage: "Be neighbors with all other players.",
      }),
      expansion: "POK",
      id: "Foster Cohesion",
      name: intl.formatMessage({
        id: "Objectives.Foster Cohesion.Title",
        description: "Title of Objective: Foster Cohesion",
        defaultMessage: "Foster Cohesion",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Hoard Raw Materials": {
      description: intl.formatMessage({
        id: "Objectives.Hoard Raw Materials.Description",
        description: "Description for Objective: Hoard Raw Materials",
        defaultMessage:
          "Control planets that have a combined resource value of at least 12.",
      }),
      expansion: "POK",
      id: "Hoard Raw Materials",
      name: intl.formatMessage({
        id: "Objectives.Hoard Raw Materials.Title",
        description: "Title of Objective: Hoard Raw Materials",
        defaultMessage: "Hoard Raw Materials",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Hold Vast Reserves": {
      description: intl.formatMessage({
        id: "Objectives.Hold Vast Reserves.Description",
        description: "Description for Objective: Hold Vast Reserves",
        defaultMessage: "Spend 6 influence, 6 resources, and 6 trade goods.",
      }),
      expansion: "POK",
      id: "Hold Vast Reserves",
      name: intl.formatMessage({
        id: "Objectives.Hold Vast Reserves.Title",
        description: "Title of Objective: Hold Vast Reserves",
        defaultMessage: "Hold Vast Reserves",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Improve Infrastructure": {
      description: intl.formatMessage({
        id: "Objectives.Improve Infrastructure.Description",
        description: "Description for Objective: Improve Infrastructure",
        defaultMessage:
          "Have structures on 3 planets outside of your home system.",
      }),
      expansion: "POK",
      id: "Improve Infrastructure",
      name: intl.formatMessage({
        id: "Objectives.Improve Infrastructure.Title",
        description: "Title of Objective: Improve Infrastructure",
        defaultMessage: "Improve Infrastructure",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Make History": {
      description: intl.formatMessage({
        id: "Objectives.Make History.Description",
        description: "Description for Objective: Make History",
        defaultMessage:
          "Have units in 2 systems that contain legendary planets, Mecatol Rex, or anomalies.",
      }),
      expansion: "POK",
      id: "Make History",
      name: intl.formatMessage({
        id: "Objectives.Make History.Title",
        description: "Title of Objective: Make History",
        defaultMessage: "Make History",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Mechanize the Military": {
      description: intl.formatMessage({
        id: "Objectives.Mechanize the Military.Description",
        description: "Description for Objective: Mechanize the Military",
        defaultMessage: "Have 1 mech on each of 4 planets.",
      }),
      expansion: "POK",
      id: "Mechanize the Military",
      name: intl.formatMessage({
        id: "Objectives.Mechanize the Military.Title",
        description: "Title of Objective: Mechanize the Military",
        defaultMessage: "Mechanize the Military",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Occupy the Fringe": {
      description: intl.formatMessage({
        id: "Objectives.Occupy the Fringe.Description",
        description: "Description for Objective: Occupy the Fringe",
        defaultMessage:
          "Have 9 or more ground forces on a planet that does not contain 1 of your space docks.",
      }),
      expansion: "POK",
      id: "Occupy the Fringe",
      name: intl.formatMessage({
        id: "Objectives.Occupy the Fringe.Title",
        description: "Title of Objective: Occupy the Fringe",
        defaultMessage: "Occupy the Fringe",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Patrol Vast Territories": {
      description: intl.formatMessage({
        id: "Objectives.Patrol Vast Territories.Description",
        description: "Description for Objective: Patrol Vast Territories",
        defaultMessage: "Have units in 5 systems that do not contain planets.",
      }),
      expansion: "POK",
      id: "Patrol Vast Territories",
      name: intl.formatMessage({
        id: "Objectives.Patrol Vast Territories.Title",
        description: "Title of Objective: Patrol Vast Territories",
        defaultMessage: "Patrol Vast Territories",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Political Censure": {
      description: intl.formatMessage({
        id: "Agendas.Political Censure.Description",
        description: "Description for Agenda Card: Political Censure",
        defaultMessage:
          "The elected player gains this card and 1 victory point.{br}The elected player cannot play action cards.{br}If the owner of this card loses this card, they lose 1 victory point.",
      }),
      expansion: "POK",
      max: 1,
      id: "Political Censure",
      name: intl.formatMessage({
        id: "Agendas.Political Censure.Title",
        description: "Title of Agenda Card: Political Censure",
        defaultMessage: "Political Censure",
      }),
      points: 1,
      type: "OTHER",
    },
    "Populate the Outer Rim": {
      description: intl.formatMessage({
        id: "Objectives.Populate the Outer Rim.Description",
        description: "Description for Objective: Populate the Outer Rim",
        defaultMessage:
          "Have units in 3 systems on the edge of the game board other than your home system.",
      }),
      expansion: "POK",
      id: "Populate the Outer Rim",
      name: intl.formatMessage({
        id: "Objectives.Populate the Outer Rim.Title",
        description: "Title of Objective: Populate the Outer Rim",
        defaultMessage: "Populate the Outer Rim",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Produce En Masse": {
      description: intl.formatMessage({
        id: "Objectives.Produce En Masse.Description",
        description: "Description for Objective: Produce En Masse",
        defaultMessage:
          "Have units with a combined PRODUCTION value of at least 8 in a single system.",
      }),
      expansion: "POK",
      id: "Produce En Masse",
      name: intl.formatMessage({
        id: "Objectives.Produce En Masse.Title",
        description: "Title of Objective: Produce En Masse",
        defaultMessage: "Produce En Masse",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Protect the Border": {
      description: intl.formatMessage({
        id: "Objectives.Protect the Border.Description",
        description: "Description for Objective: Protect the Border",
        defaultMessage:
          "Have structures on 5 planets outside of your home system.",
      }),
      expansion: "POK",
      id: "Protect the Border",
      name: intl.formatMessage({
        id: "Objectives.Protect the Border.Title",
        description: "Title of Objective: Protect the Border",
        defaultMessage: "Protect the Border",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Prove Endurance": {
      description: intl.formatMessage({
        id: "Objectives.Prove Endurance.Description",
        description: "Description for Objective: Prove Endurance",
        defaultMessage: "Be the last player to pass during a game round.",
      }),
      expansion: "POK",
      id: "Prove Endurance",
      name: intl.formatMessage({
        id: "Objectives.Prove Endurance.Title",
        description: "Title of Objective: Prove Endurance",
        defaultMessage: "Prove Endurance",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Push Boundaries": {
      description: intl.formatMessage({
        id: "Objectives.Push Boundaries.Description",
        description: "Description for Objective: Push Boundaries",
        defaultMessage:
          "Control more planets than each of 2 of your neighbors.",
      }),
      expansion: "POK",
      id: "Push Boundaries",
      name: intl.formatMessage({
        id: "Objectives.Push Boundaries.Title",
        description: "Title of Objective: Push Boundaries",
        defaultMessage: "Push Boundaries",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Raise a Fleet": {
      description: intl.formatMessage({
        id: "Objectives.Raise a Fleet.Description",
        description: "Description for Objective: Raise a Fleet",
        defaultMessage: "Have 5 or more non-fighter ships in 1 system.",
      }),
      expansion: "POK",
      id: "Raise a Fleet",
      name: intl.formatMessage({
        id: "Objectives.Raise a Fleet.Title",
        description: "Title of Objective: Raise a Fleet",
        defaultMessage: "Raise a Fleet",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Reclaim Ancient Monuments": {
      description: intl.formatMessage({
        id: "Objectives.Reclaim Ancient Monuments.Description",
        description: "Description for Objective: Reclaim Ancient Monuments",
        defaultMessage: "Control 3 planets that have attachments.",
      }),
      expansion: "POK",
      id: "Reclaim Ancient Monuments",
      name: intl.formatMessage({
        id: "Objectives.Reclaim Ancient Monuments.Title",
        description: "Title of Objective: Reclaim Ancient Monuments",
        defaultMessage: "Reclaim Ancient Monuments",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Rule Distant Lands": {
      description: intl.formatMessage({
        id: "Objectives.Rule Distant Lands.Description",
        description: "Description for Objective: Rule Distant Lands",
        defaultMessage:
          "Control 2 planets that are each in or adjacent to a different, other player's home system.",
      }),
      expansion: "POK",
      id: "Rule Distant Lands",
      name: intl.formatMessage({
        id: "Objectives.Rule Distant Lands.Title",
        description: "Title of Objective: Rule Distant Lands",
        defaultMessage: "Rule Distant Lands",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Seize an Icon": {
      description: intl.formatMessage({
        id: "Objectives.Seize an Icon.Description",
        description: "Description for Objective: Seize an Icon",
        defaultMessage: "Control a legendary planet.",
      }),
      expansion: "POK",
      id: "Seize an Icon",
      name: intl.formatMessage({
        id: "Objectives.Seize an Icon.Title",
        description: "Title of Objective: Seize an Icon",
        defaultMessage: "Seize an Icon",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Stake your Claim": {
      description: intl.formatMessage({
        id: "Objectives.Stake your Claim.Description",
        description: "Description for Objective: Stake your Claim",
        defaultMessage:
          "Control a planet in a system that contains a planet controlled by another player.",
      }),
      expansion: "POK",
      id: "Stake your Claim",
      name: intl.formatMessage({
        id: "Objectives.Stake your Claim.Title",
        description: "Title of Objective: Stake your Claim",
        defaultMessage: "Stake your Claim",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Strengthen Bonds": {
      description: intl.formatMessage({
        id: "Objectives.Strengthen Bonds.Description",
        description: "Description for Objective: Strengthen Bonds",
        defaultMessage:
          "Have another player's promissory note in your play area.",
      }),
      expansion: "POK",
      removedIn: "TWILIGHTS FALL",
      id: "Strengthen Bonds",
      name: intl.formatMessage({
        id: "Objectives.Strengthen Bonds.Title",
        description: "Title of Objective: Strengthen Bonds",
        defaultMessage: "Strengthen Bonds",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Tomb + Crown of Emphidia": {
      description: intl.formatMessage({
        id: "Relics.The Crown of Emphidia.Description",
        description: "Description for Relic: The Crown of Emphidia",
        defaultMessage:
          'After you perform a tactical action, you may exhaust this card to explore 1 planet you control.{br}At the end of the status phase, if you control the "Tomb of Emphidia", you may purge this card to gain 1 Victory Point.',
      }),
      expansion: "POK",
      max: 1,
      id: "Tomb + Crown of Emphidia",
      name: intl.formatMessage({
        id: "Relics.The Crown of Emphidia.Title",
        description: "Title of Relic: The Crown of Emphidia",
        defaultMessage: "The Crown of Emphidia",
      }),
      points: 1,
      replaces: "The Crown of Emphidia",
      type: "OTHER",
    },
  };
}
