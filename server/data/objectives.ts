import { BaseObjective } from "../../src/util/api/objectives";

export type ObjectiveId =
  | "Achieve Supremacy"
  | "Adapt New Strategies"
  | "Amass Wealth"
  | "Become a Legend"
  | "Become a Martyr"
  | "Become the Gatekeeper"
  | "Betray a Friend"
  | "Brave the Void"
  | "Build Defenses"
  | "Centralize Galactic Trade"
  | "Command an Armada"
  | "Conquer the Weak"
  | "Construct Massive Cities"
  | "Control the Borderlands"
  | "Control the Region"
  | "Corner the Market"
  | "Crown of Emphidia"
  | "Custodians Token"
  | "Cut Supply Lines"
  | "Darken the Skies"
  | "Defy Space and Time"
  | "Demonstrate Your Power"
  | "Destroy Heretical Works"
  | "Destroy Their Greatest Ship"
  | "Develop Weaponry"
  | "Dictate Policy"
  | "Discover Lost Outposts"
  | "Diversify Research"
  | "Drive the Debate"
  | "Engineer a Marvel"
  | "Erect a Monument"
  | "Establish Hegemony"
  | "Establish a Perimeter"
  | "Expand Borders"
  | "Explore Deep Space"
  | "Fight With Precision"
  | "Forge an Alliance"
  | "Form Galactic Brain Trust"
  | "Form a Spy Network"
  | "Foster Cohesion"
  | "Found Research Outposts"
  | "Found a Golden Age"
  | "Fuel the War Machine"
  | "Galvanize the People"
  | "Gather a Mighty Fleet"
  | "Hoard Raw Materials"
  | "Hold Vast Reserves"
  | "Holy Planet of Ixth"
  | "Imperial Point"
  | "Imperial Rider"
  | "Improve Infrastructure"
  | "Intimidate Council"
  | "Lead from the Front"
  | "Learn the Secrets of the Cosmos"
  | "Make History"
  | "Make an Example of Their World"
  | "Manipulate Galactic Law"
  | "Master the Laws of Physics"
  | "Master the Sciences"
  | "Mechanize the Military"
  | "Mine Rare Metals"
  | "Monopolize Production"
  | "Mutiny"
  | "Negotiate Trade Routes"
  | "Occupy the Fringe"
  | "Occupy the Seat of the Empire"
  | "Patrol Vast Territories"
  | "Political Censure"
  | "Populate the Outer Rim"
  | "Produce En Masse"
  | "Protect the Border"
  | "Prove Endurance"
  | "Push Boundaries"
  | "Raise a Fleet"
  | "Reclaim Ancient Monuments"
  | "Revolutionize Warfare"
  | "Rule Distant Lands"
  | "Seed of an Empire"
  | "Seize an Icon"
  | "Shard of the Throne"
  | "Spark a Rebellion"
  | "Stake your Claim"
  | "Strengthen Bonds"
  | "Subdue the Galaxy"
  | "Support for the Throne"
  | "Sway the Council"
  | "Threaten Enemies"
  | "Tomb + Crown of Emphidia"
  | "Turn Their Fleets to Dust"
  | "Unify the Colonies"
  | "Unveil Flagship";

export const BASE_OBJECTIVES: Record<ObjectiveId, BaseObjective> = {
  "Achieve Supremacy": {
    description:
      "Have your flagship or a war sun in another player's home system or the Mecatol Rex system",
    expansion: "POK",
    name: "Achieve Supremacy",
    points: 2,
    type: "STAGE TWO",
  },
  "Adapt New Strategies": {
    description:
      "Own 2 faction technologies (Valefar Assimilator technologies do not count toward this objective)",
    expansion: "BASE",
    name: "Adapt New Strategies",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Amass Wealth": {
    description: "Spend 3 influence, 3 resources, and 3 trade goods",
    expansion: "POK",
    name: "Amass Wealth",
    points: 1,
    type: "STAGE ONE",
  },
  "Become a Legend": {
    description:
      "Have units in 4 systems that contain legendary planets, Mecatol Rex, or anomalies",
    expansion: "POK",
    name: "Become a Legend",
    points: 2,
    type: "STAGE TWO",
  },
  "Become a Martyr": {
    description: "Lose control of a planet in a home system",
    expansion: "POK",
    name: "Become a Martyr",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Become the Gatekeeper": {
    description:
      "Have 1 or more ships in a system that contains an alpha wormhole and 1 or more ships in a system that contains a beta wormhole",
    expansion: "BASE",
    name: "Become the Gatekeeper",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Betray a Friend": {
    description:
      "Win a combat against a player whose promissory note you had in your play area at the start of your tactical action",
    expansion: "POK",
    name: "Betray a Friend",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Brave the Void": {
    description: "Win a combat in an anomaly",
    expansion: "POK",
    name: "Brave the Void",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Build Defenses": {
    description: "Have 4 or more structures",
    expansion: "POK",
    name: "Build Defenses",
    points: 1,
    type: "STAGE ONE",
  },
  "Centralize Galactic Trade": {
    description: "Spend 10 trade goods",
    expansion: "BASE",
    name: "Centralize Galactic Trade",
    points: 2,
    type: "STAGE TWO",
  },
  "Command an Armada": {
    description: "Have 8 or more non-fighter ships in 1 system",
    expansion: "POK",
    name: "Command an Armada",
    points: 2,
    type: "STAGE TWO",
  },
  "Conquer the Weak": {
    description: "Control 1 planet that is in another player's home system",
    expansion: "BASE",
    name: "Conquer the Weak",
    points: 2,
    type: "STAGE TWO",
  },
  "Construct Massive Cities": {
    description: "Have 7 or more structures",
    expansion: "POK",
    name: "Construct Massive Cities",
    points: 2,
    type: "STAGE TWO",
  },
  "Control the Borderlands": {
    description:
      "Have units in 5 systems on the edge of the game board other than your home system",
    expansion: "POK",
    name: "Control the Borderlands",
    points: 2,
    type: "STAGE TWO",
  },
  "Control the Region": {
    description: "Have 1 or more ships in 6 systems",
    expansion: "BASE",
    name: "Control the Region",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Corner the Market": {
    description: "Control 4 planets that each have the same planet trait",
    expansion: "BASE",
    name: "Corner the Market",
    points: 1,
    type: "STAGE ONE",
  },
  "Crown of Emphidia": {
    description: "Given to the current holder of the Crown of Emphidia",
    expansion: "BASE",
    max: 2,
    repeatable: true,
    name: "Crown of Emphidia",
    points: 1,
    type: "OTHER",
  },
  "Custodians Token": {
    description: "Pay 6 influence to remove the token from Mecatol Rex",
    expansion: "BASE",
    max: 1,
    name: "Custodians Token",
    points: 1,
    type: "OTHER",
  },
  "Cut Supply Lines": {
    description:
      "Have 1 or more ships in the same system as another player's space dock",
    expansion: "BASE",
    name: "Cut Supply Lines",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Darken the Skies": {
    description: "Win a combat in another player's home system",
    expansion: "POK",
    name: "Darken the Skies",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Defy Space and Time": {
    description: "Have units in the wormhole nexus",
    expansion: "POK",
    name: "Defy Space and Time",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Demonstrate Your Power": {
    description:
      "Have 3 or more non-fighter ships in the active system at the end of a space combat",
    expansion: "POK",
    name: "Demonstrate Your Power",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Destroy Heretical Works": {
    description: "Purge 2 of your relic fragments of any type",
    expansion: "POK",
    name: "Destroy Heretical Works",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Destroy Their Greatest Ship": {
    description: "Destroy another player's war sun or flagship",
    expansion: "BASE",
    name: "Destroy Their Greatest Ship",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Develop Weaponry": {
    description: "Own 2 unit upgrade technologies",
    expansion: "BASE",
    name: "Develop Weaponry",
    points: 1,
    type: "STAGE ONE",
  },
  "Dictate Policy": {
    description: "There are 3 or more laws in play",
    expansion: "POK",
    name: "Dictate Policy",
    phase: "AGENDA",
    points: 1,
    type: "SECRET",
  },
  "Discover Lost Outposts": {
    description: "Control 2 planets that have attachments",
    expansion: "POK",
    name: "Discover Lost Outposts",
    points: 1,
    type: "STAGE ONE",
  },
  "Diversify Research": {
    description: "Own 2 technologies in each of 2 colors",
    expansion: "BASE",
    name: "Diversify Research",
    points: 1,
    type: "STAGE ONE",
  },
  "Drive the Debate": {
    description: "You or a planet you control are elected by an agenda",
    expansion: "POK",
    name: "Drive the Debate",
    phase: "AGENDA",
    points: 1,
    type: "SECRET",
  },
  "Engineer a Marvel": {
    description: "Have your flagship or a war sun on the game board",
    expansion: "POK",
    name: "Engineer a Marvel",
    points: 1,
    type: "STAGE ONE",
  },
  "Erect a Monument": {
    description: "Spend 8 resources",
    expansion: "BASE",
    name: "Erect a Monument",
    points: 1,
    type: "STAGE ONE",
  },
  "Establish Hegemony": {
    description:
      "Control planets that have a combined influence value of at least 12",
    expansion: "POK",
    name: "Establish Hegemony",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Establish a Perimeter": {
    description: "Have 4 PDS units on the game board",
    expansion: "BASE",
    name: "Establish a Perimeter",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Expand Borders": {
    description: "Control 6 planets in non-home systems",
    expansion: "BASE",
    name: "Expand Borders",
    points: 1,
    type: "STAGE ONE",
  },
  "Explore Deep Space": {
    description: "Have units in 3 systems that do not contain planets",
    expansion: "POK",
    name: "Explore Deep Space",
    points: 1,
    type: "STAGE ONE",
  },
  "Fight With Precision": {
    description:
      "Use ANTI-FIGHTER BARRAGE to destroy the last of a player's fighters in a system",
    expansion: "POK",
    name: "Fight With Precision",
    omega: {
      description:
        "Destroy the last of a player's fighters in the active system during the anti-fighter barrage step",
      expansion: "CODEX THREE",
    },
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Forge an Alliance": {
    description: "Control 4 cultural planets",
    expansion: "BASE",
    name: "Forge an Alliance",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Form Galactic Brain Trust": {
    description: "Control 5 planets that have technology specialties",
    expansion: "BASE",
    name: "Form Galactic Brain Trust",
    points: 2,
    type: "STAGE TWO",
  },
  "Form a Spy Network": {
    description: "Discard 5 Action Cards",
    expansion: "BASE",
    name: "Form a Spy Network",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Foster Cohesion": {
    description: "Be neighbors with all other players",
    expansion: "POK",
    name: "Foster Cohesion",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Found Research Outposts": {
    description: "Control 3 planets that have technology specialties",
    expansion: "BASE",
    name: "Found Research Outposts",
    points: 1,
    type: "STAGE ONE",
  },
  "Found a Golden Age": {
    description: "Spend 16 resources",
    expansion: "BASE",
    name: "Found a Golden Age",
    points: 2,
    type: "STAGE TWO",
  },
  "Fuel the War Machine": {
    description: "Have 3 space docks on the game board",
    expansion: "BASE",
    name: "Fuel the War Machine",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Galvanize the People": {
    description:
      "Spend a total of 6 tokens from your tactic and/or strategy pools",
    expansion: "BASE",
    name: "Galvanize the People",
    points: 2,
    type: "STAGE TWO",
  },
  "Gather a Mighty Fleet": {
    description: "Have 5 dreadnoughts on the game board",
    expansion: "BASE",
    name: "Gather a Mighty Fleet",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Hoard Raw Materials": {
    description:
      "Control planets that have a combined resource value of at least 12",
    expansion: "POK",
    name: "Hoard Raw Materials",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Hold Vast Reserves": {
    description: "Spend 6 influence, 6 resources, and 6 trade goods",
    expansion: "POK",
    name: "Hold Vast Reserves",
    points: 2,
    type: "STAGE TWO",
  },
  "Holy Planet of Ixth": {
    description: "Given to the current owner of the Holy Planet of Ixth",
    expansion: "BASE ONLY",
    max: 2,
    repeatable: true,
    name: "Holy Planet of Ixth",
    points: 1,
    type: "OTHER",
  },
  "Imperial Point": {
    description:
      "Use the primary ability of Imperial while in control of Mecatol Rex",
    expansion: "BASE",
    name: "Imperial Point",
    points: 1,
    repeatable: true,
    type: "OTHER",
  },
  "Imperial Rider": {
    description:
      "Correctly predict the outcome of an agenda using an Imperial Rider",
    expansion: "BASE",
    max: 2,
    name: "Imperial Rider",
    points: 1,
    repeatable: true,
    type: "OTHER",
  },
  "Improve Infrastructure": {
    description: "Have structures on 3 planets outside of your home system",
    expansion: "POK",
    name: "Improve Infrastructure",
    points: 1,
    type: "STAGE ONE",
  },
  "Intimidate Council": {
    description:
      "Have 1 or more ships in 2 systems that are adjacent to Mecatol Rex's System",
    expansion: "BASE",
    name: "Intimidate Council",
    points: 1,
    type: "STAGE ONE",
  },
  "Lead from the Front": {
    description:
      "Spend a total of 3 tokens from your tactic and/or strategy pools",
    expansion: "BASE",
    name: "Lead from the Front",
    points: 1,
    type: "STAGE ONE",
  },
  "Learn the Secrets of the Cosmos": {
    description:
      "Have 1 or more ships in 3 systems that are each adjacent to an anomaly",
    expansion: "BASE",
    name: "Learn the Secrets of the Cosmos",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Make History": {
    description:
      "Have units in 2 systems that contain legendary planets, Mecatol Rex, or anomalies",
    expansion: "POK",
    name: "Make History",
    points: 1,
    type: "STAGE ONE",
  },
  "Make an Example of Their World": {
    description:
      "Use BOMBARDMENT to destroy the last of a player's ground forces on a planet",
    expansion: "BASE",
    name: "Make an Example of Their World",
    omega: {
      description:
        "Destroy the last of a player's ground forces on a planet during the bombardment step",
      expansion: "CODEX THREE",
    },
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Manipulate Galactic Law": {
    description: "Spend 16 influence",
    expansion: "BASE",
    name: "Manipulate Galactic Law",
    points: 2,
    type: "STAGE TWO",
  },
  "Master the Laws of Physics": {
    description: "Own 4 technologies of the same color",
    expansion: "BASE",
    name: "Master the Laws of Physics",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Master the Sciences": {
    description: "Own 2 technologies in each of 4 colors",
    expansion: "BASE",
    name: "Master the Sciences",
    points: 2,
    type: "STAGE TWO",
  },
  "Mechanize the Military": {
    description: "Have 1 mech on each of 4 planets",
    expansion: "POK",
    name: "Mechanize the Military",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Mine Rare Metals": {
    description: "Control 4 hazardous planets",
    expansion: "BASE",
    name: "Mine Rare Metals",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Monopolize Production": {
    description: "Control 4 industrial planets",
    expansion: "BASE",
    name: "Monopolize Production",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  Mutiny: {
    description:
      'FOR: Each player who voted "For" gains 1 victory point.\n\nAGAINST: Each player who voted "For" loses 1 victory point.',
    expansion: "BASE",
    name: "Mutiny",
    points: 1,
    type: "OTHER",
  },
  "Negotiate Trade Routes": {
    description: "Spend 5 trade goods",
    expansion: "BASE",
    name: "Negotiate Trade Routes",
    points: 1,
    type: "STAGE ONE",
  },
  "Occupy the Fringe": {
    description:
      "Have 9 or more ground forces on a planet that does not contain 1 of your space docks",
    expansion: "POK",
    name: "Occupy the Fringe",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Occupy the Seat of the Empire": {
    description: "Control Mecatol Rex and have 3 or more ships in its system",
    expansion: "BASE",
    name: "Occupy the Seat of the Empire",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Patrol Vast Territories": {
    description: "Have units in 5 systems that do not contain planets",
    expansion: "POK",
    name: "Patrol Vast Territories",
    points: 2,
    type: "STAGE TWO",
  },
  "Political Censure": {
    description: "Given to the player elected for Political Censure",
    expansion: "POK",
    max: 1,
    name: "Political Censure",
    points: 1,
    type: "OTHER",
  },
  "Populate the Outer Rim": {
    description:
      "Have units in 3 systems on the edge of the game board other than your home system",
    expansion: "POK",
    name: "Populate the Outer Rim",
    points: 1,
    type: "STAGE ONE",
  },
  "Produce En Masse": {
    description:
      "Have units with a combined PRODUCTION value of at least 8 in a single system",
    expansion: "POK",
    name: "Produce En Masse",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Protect the Border": {
    description: "Have structures on 5 planets outside of your home system",
    expansion: "POK",
    name: "Protect the Border",
    points: 2,
    type: "STAGE TWO",
  },
  "Prove Endurance": {
    description: "Be the last player to pass during a game round",
    expansion: "POK",
    name: "Prove Endurance",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Push Boundaries": {
    description: "Control more planets than each of 2 of your neighbors",
    expansion: "POK",
    name: "Push Boundaries",
    points: 1,
    type: "STAGE ONE",
  },
  "Raise a Fleet": {
    description: "Have 5 or more non-fighter ships in 1 system",
    expansion: "POK",
    name: "Raise a Fleet",
    points: 1,
    type: "STAGE ONE",
  },
  "Reclaim Ancient Monuments": {
    description: "Control 3 planets that have attachments",
    expansion: "POK",
    name: "Reclaim Ancient Monuments",
    points: 2,
    type: "STAGE TWO",
  },
  "Revolutionize Warfare": {
    description: "Own 3 unit upgrade technologies",
    expansion: "BASE",
    name: "Revolutionize Warfare",
    points: 2,
    type: "STAGE TWO",
  },
  "Rule Distant Lands": {
    description:
      "Control 2 planets that are each in or adjacent to a different, other player's home system",
    expansion: "POK",
    name: "Rule Distant Lands",
    points: 2,
    type: "STAGE TWO",
  },
  "Seed of an Empire": {
    description:
      "Have the most victory points when Seed of an Empire passes or the least victory points when Seed of an Empire fails",
    expansion: "BASE",
    name: "Seed of an Empire",
    points: 1,
    type: "OTHER",
  },
  "Seize an Icon": {
    description: "Control a legendary planet",
    expansion: "POK",
    name: "Seize an Icon",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Shard of the Throne": {
    description: "Given to the current holder of the Shard of the Throne",
    expansion: "BASE",
    max: 2,
    repeatable: true,
    name: "Shard of the Throne",
    points: 1,
    type: "OTHER",
  },
  "Spark a Rebellion": {
    description:
      "Win a combat against a player who has the most victory points",
    expansion: "BASE",
    name: "Spark a Rebellion",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Stake your Claim": {
    description:
      "Control a planet in a system that contains a planet controlled by another player",
    expansion: "POK",
    name: "Stake your Claim",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Strengthen Bonds": {
    description: "Have another player's promissory note in your play area",
    expansion: "POK",
    name: "Strengthen Bonds",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Subdue the Galaxy": {
    description: "Control 11 planets in non-home systems",
    expansion: "BASE",
    name: "Subdue the Galaxy",
    points: 2,
    type: "STAGE TWO",
  },
  "Support for the Throne": {
    description:
      "Have another player's Support for the Throne in your play area",
    expansion: "BASE",
    name: "Support for the Throne",
    points: 1,
    repeatable: true,
    type: "OTHER",
  },
  "Sway the Council": {
    description: "Spend 8 influence",
    expansion: "BASE",
    name: "Sway the Council",
    points: 1,
    type: "STAGE ONE",
  },
  "Threaten Enemies": {
    description:
      "Have 1 or more ships in a system that is adjacent to another player's home system",
    expansion: "BASE",
    name: "Threaten Enemies",
    phase: "STATUS",
    points: 1,
    type: "SECRET",
  },
  "Tomb + Crown of Emphidia": {
    description:
      "Use the Crown of Emphidia at the end of the status phase while in control of the Tomb of Emphidia",
    expansion: "POK",
    max: 1,
    name: "Tomb + Crown of Emphidia",
    points: 1,
    replaces: "Crown of Emphidia",
    type: "OTHER",
  },
  "Turn Their Fleets to Dust": {
    description:
      "Use SPACE CANNON to destroy the last of a player's ships in a system",
    expansion: "BASE",
    name: "Turn Their Fleets to Dust",
    omega: {
      description:
        "Destroy the last of a player's non-fighter ships in the active system during the space cannon offense step",
      expansion: "CODEX THREE",
    },
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
  "Unify the Colonies": {
    description: "Control 6 planets that each have the same planet trait",
    expansion: "BASE",
    name: "Unify the Colonies",
    points: 2,
    type: "STAGE TWO",
  },
  "Unveil Flagship": {
    description:
      "Win a space combat in a system that contains your flagship. You cannot score this objective if your flagship is destroyed in the combat",
    expansion: "BASE",
    name: "Unveil Flagship",
    phase: "ACTION",
    points: 1,
    type: "SECRET",
  },
};
