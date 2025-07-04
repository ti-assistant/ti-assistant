import { IntlShape } from "react-intl";

export default function getBaseObjectives(
  intl: IntlShape
): Record<BaseGame.ObjectiveId, BaseObjective> {
  return {
    "Adapt New Strategies": {
      description: intl.formatMessage({
        id: "Objectives.Adapt New Strategies.Description",
        description: "Description for Objective: Adapt New Strategies",
        defaultMessage:
          "Own 2 faction technologies. (Valefar Assimilator technologies do not count toward this objective)",
      }),
      expansion: "BASE",
      id: "Adapt New Strategies",
      name: intl.formatMessage({
        id: "Objectives.Adapt New Strategies.Title",
        description: "Title of Objective: Adapt New Strategies",
        defaultMessage: "Adapt New Strategies",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Become the Gatekeeper": {
      description: intl.formatMessage({
        id: "Objectives.Become the Gatekeeper.Description",
        description: "Description for Objective: Become the Gatekeeper",
        defaultMessage:
          "Have 1 or more ships in a system that contains an alpha wormhole and 1 or more ships in a system that contains a beta wormhole.",
      }),
      expansion: "BASE",
      id: "Become the Gatekeeper",
      name: intl.formatMessage({
        id: "Objectives.Become the Gatekeeper.Title",
        description: "Title of Objective: Become the Gatekeeper",
        defaultMessage: "Become the Gatekeeper",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Centralize Galactic Trade": {
      description: intl.formatMessage({
        id: "Objectives.Centralize Galactic Trade.Description",
        description: "Description for Objective: Centralize Galactic Trade",
        defaultMessage: "Spend 10 trade goods.",
      }),
      expansion: "BASE",
      id: "Centralize Galactic Trade",
      name: intl.formatMessage({
        id: "Objectives.Centralize Galactic Trade.Title",
        description: "Title of Objective: Centralize Galactic Trade",
        defaultMessage: "Centralize Galactic Trade",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Conquer the Weak": {
      description: intl.formatMessage({
        id: "Objectives.Conquer the Weak.Description",
        description: "Description for Objective: Conquer the Weak",
        defaultMessage:
          "Control 1 planet that is in another player's home system.",
      }),
      expansion: "BASE",
      id: "Conquer the Weak",
      name: intl.formatMessage({
        id: "Objectives.Conquer the Weak.Title",
        description: "Title of Objective: Conquer the Weak",
        defaultMessage: "Conquer the Weak",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Control the Region": {
      description: intl.formatMessage({
        id: "Objectives.Control the Region.Description",
        description: "Description for Objective: Control the Region",
        defaultMessage: "Have 1 or more ships in 6 systems.",
      }),
      expansion: "BASE",
      id: "Control the Region",
      name: intl.formatMessage({
        id: "Objectives.Control the Region.Title",
        description: "Title of Objective: Control the Region",
        defaultMessage: "Control the Region",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Corner the Market": {
      description: intl.formatMessage({
        id: "Objectives.Corner the Market.Description",
        description: "Description for Objective: Corner the Market",
        defaultMessage:
          "Control 4 planets that each have the same planet trait.",
      }),
      expansion: "BASE",
      id: "Corner the Market",
      name: intl.formatMessage({
        id: "Objectives.Corner the Market.Title",
        description: "Title of Objective: Corner the Market",
        defaultMessage: "Corner the Market",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "The Crown of Emphidia": {
      description: intl.formatMessage({
        id: "Objectives.The Crown of Emphidia.Description",
        description: "Description for Objective: The Crown of Emphidia",
        defaultMessage: "Given to the current holder of the Crown of Emphidia.",
      }),
      expansion: "BASE",
      max: 2,
      repeatable: true,
      id: "The Crown of Emphidia",
      name: intl.formatMessage({
        id: "Objectives.The Crown of Emphidia.Title",
        description: "Title of Objective: The Crown of Emphidia",
        defaultMessage: "The Crown of Emphidia",
      }),
      points: 1,
      type: "OTHER",
    },
    "Custodians Token": {
      description: intl.formatMessage({
        id: "Objectives.Custodians Token.Description",
        description: "Description for Objective: Custodians Token",
        defaultMessage: "Pay 6 influence to remove the token from Mecatol Rex.",
      }),
      expansion: "BASE",
      max: 1,
      id: "Custodians Token",
      name: intl.formatMessage({
        id: "Objectives.Custodians Token.Title",
        description: "Title of Objective: Custodians Token",
        defaultMessage: "Custodians Token",
      }),
      points: 1,
      type: "OTHER",
    },
    "Cut Supply Lines": {
      description: intl.formatMessage({
        id: "Objectives.Cut Supply Lines.Description",
        description: "Description for Objective: Cut Supply Lines",
        defaultMessage:
          "Have 1 or more ships in the same system as another player's space dock.",
      }),
      expansion: "BASE",
      id: "Cut Supply Lines",
      name: intl.formatMessage({
        id: "Objectives.Cut Supply Lines.Title",
        description: "Title of Objective: Cut Supply Lines",
        defaultMessage: "Cut Supply Lines",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Destroy Their Greatest Ship": {
      description: intl.formatMessage({
        id: "Objectives.Destroy Their Greatest Ship.Description",
        description: "Description for Objective: Destroy Their Greatest Ship",
        defaultMessage: "Destroy another player's war sun or flagship.",
      }),
      expansion: "BASE",
      id: "Destroy Their Greatest Ship",
      name: intl.formatMessage({
        id: "Objectives.Destroy Their Greatest Ship.Title",
        description: "Title of Objective: Destroy Their Greatest Ship",
        defaultMessage: "Destroy Their Greatest Ship",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Develop Weaponry": {
      description: intl.formatMessage({
        id: "Objectives.Develop Weaponry.Description",
        description: "Description for Objective: Develop Weaponry",
        defaultMessage: "Own 2 unit upgrade technologies.",
      }),
      expansion: "BASE",
      id: "Develop Weaponry",
      name: intl.formatMessage({
        id: "Objectives.Develop Weaponry.Title",
        description: "Title of Objective: Develop Weaponry",
        defaultMessage: "Develop Weaponry",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Diversify Research": {
      description: intl.formatMessage({
        id: "Objectives.Diversify Research.Description",
        description: "Description for Objective: Diversify Research",
        defaultMessage: "Own 2 technologies in each of 2 colors.",
      }),
      expansion: "BASE",
      id: "Diversify Research",
      name: intl.formatMessage({
        id: "Objectives.Diversify Research.Title",
        description: "Title of Objective: Diversify Research",
        defaultMessage: "Diversify Research",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Erect a Monument": {
      description: intl.formatMessage({
        id: "Objectives.Erect a Monument.Description",
        description: "Description for Objective: Erect a Monument",
        defaultMessage: "Spend 8 resources.",
      }),
      expansion: "BASE",
      id: "Erect a Monument",
      name: intl.formatMessage({
        id: "Objectives.Erect a Monument.Title",
        description: "Title of Objective: Erect a Monument",
        defaultMessage: "Erect a Monument",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Establish a Perimeter": {
      description: intl.formatMessage({
        id: "Objectives.Establish a Perimeter.Description",
        description: "Description for Objective: Establish a Perimeter",
        defaultMessage: "Have 4 PDS units on the game board.",
      }),
      expansion: "BASE",
      id: "Establish a Perimeter",
      name: intl.formatMessage({
        id: "Objectives.Establish a Perimeter.Title",
        description: "Title of Objective: Establish a Perimeter",
        defaultMessage: "Establish a Perimeter",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Expand Borders": {
      description: intl.formatMessage({
        id: "Objectives.Expand Borders.Description",
        description: "Description for Objective: Expand Borders",
        defaultMessage: "Control 6 planets in non-home systems.",
      }),
      expansion: "BASE",
      id: "Expand Borders",
      name: intl.formatMessage({
        id: "Objectives.Expand Borders.Title",
        description: "Title of Objective: Expand Borders",
        defaultMessage: "Expand Borders",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Forge an Alliance": {
      description: intl.formatMessage({
        id: "Objectives.Forge an Alliance.Description",
        description: "Description for Objective: Forge an Alliance",
        defaultMessage: "Control 4 cultural planets.",
      }),
      expansion: "BASE",
      id: "Forge an Alliance",
      name: intl.formatMessage({
        id: "Objectives.Forge an Alliance.Title",
        description: "Title of Objective: Forge an Alliance",
        defaultMessage: "Forge an Alliance",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Form Galactic Brain Trust": {
      description: intl.formatMessage({
        id: "Objectives.Form Galactic Brain Trust.Description",
        description: "Description for Objective: Form Galactic Brain Trust",
        defaultMessage: "Control 5 planets that have technology specialties.",
      }),
      expansion: "BASE",
      id: "Form Galactic Brain Trust",
      name: intl.formatMessage({
        id: "Objectives.Form Galactic Brain Trust.Title",
        description: "Title of Objective: Form Galactic Brain Trust",
        defaultMessage: "Form Galactic Brain Trust",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Form a Spy Network": {
      description: intl.formatMessage({
        id: "Objectives.Form a Spy Network.Description",
        description: "Description for Objective: Form a Spy Network",
        defaultMessage: "Discard 5 Action Cards.",
      }),
      expansion: "BASE",
      id: "Form a Spy Network",
      name: intl.formatMessage({
        id: "Objectives.Form a Spy Network.Title",
        description: "Title of Objective: Form a Spy Network",
        defaultMessage: "Form a Spy Network",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Found Research Outposts": {
      description: intl.formatMessage({
        id: "Objectives.Found Research Outposts.Description",
        description: "Description for Objective: Found Research Outposts",
        defaultMessage: "Control 3 planets that have technology specialties.",
      }),
      expansion: "BASE",
      id: "Found Research Outposts",
      name: intl.formatMessage({
        id: "Objectives.Found Research Outposts.Title",
        description: "Title of Objective: Found Research Outposts",
        defaultMessage: "Found Research Outposts",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Found a Golden Age": {
      description: intl.formatMessage({
        id: "Objectives.Found a Golden Age.Description",
        description: "Description for Objective: Found a Golden Age",
        defaultMessage: "Spend 16 resources.",
      }),
      expansion: "BASE",
      id: "Found a Golden Age",
      name: intl.formatMessage({
        id: "Objectives.Found a Golden Age.Title",
        description: "Title of Objective: Found a Golden Age",
        defaultMessage: "Found a Golden Age",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Fuel the War Machine": {
      description: intl.formatMessage({
        id: "Objectives.Fuel the War Machine.Description",
        description: "Description for Objective: Fuel the War Machine",
        defaultMessage: "Have 3 space docks on the game board.",
      }),
      expansion: "BASE",
      id: "Fuel the War Machine",
      name: intl.formatMessage({
        id: "Objectives.Fuel the War Machine.Title",
        description: "Title of Objective: Fuel the War Machine",
        defaultMessage: "Fuel the War Machine",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Galvanize the People": {
      description: intl.formatMessage({
        id: "Objectives.Galvanize the People.Description",
        description: "Description for Objective: Galvanize the People",
        defaultMessage:
          "Spend a total of 6 tokens from your tactic and/or strategy pools.",
      }),
      expansion: "BASE",
      id: "Galvanize the People",
      name: intl.formatMessage({
        id: "Objectives.Galvanize the People.Title",
        description: "Title of Objective: Galvanize the People",
        defaultMessage: "Galvanize the People",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Gather a Mighty Fleet": {
      description: intl.formatMessage({
        id: "Objectives.Gather a Mighty Fleet.Description",
        description: "Description for Objective: Gather a Mighty Fleet",
        defaultMessage: "Have 5 dreadnoughts on the game board.",
      }),
      expansion: "BASE",
      id: "Gather a Mighty Fleet",
      name: intl.formatMessage({
        id: "Objectives.Gather a Mighty Fleet.Title",
        description: "Title of Objective: Gather a Mighty Fleet",
        defaultMessage: "Gather a Mighty Fleet",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Holy Planet of Ixth": {
      description: intl.formatMessage({
        id: "Objectives.Holy Planet of Ixth.Description",
        description: "Description for Objective: Holy Planet of Ixth",
        defaultMessage:
          "Given to the current owner of the Holy Planet of Ixth.",
      }),
      expansion: "BASE ONLY",
      max: 2,
      repeatable: true,
      id: "Holy Planet of Ixth",
      name: intl.formatMessage({
        id: "Objectives.Holy Planet of Ixth.Title",
        description: "Title of Objective: Holy Planet of Ixth",
        defaultMessage: "Holy Planet of Ixth",
      }),
      points: 1,
      type: "OTHER",
    },
    "Imperial Point": {
      description: intl.formatMessage({
        id: "Objectives.Imperial Point.Description",
        description: "Description for Objective: Imperial Point",
        defaultMessage:
          "Use the primary ability of Imperial while in control of Mecatol Rex.",
      }),
      expansion: "BASE",
      id: "Imperial Point",
      name: intl.formatMessage({
        id: "Objectives.Imperial Point.Title",
        description: "Title of Objective: Imperial Point",
        defaultMessage: "Imperial Point",
      }),
      points: 1,
      repeatable: true,
      type: "OTHER",
    },
    "Imperial Rider": {
      description: intl.formatMessage({
        id: "Objectives.Imperial Rider.Description",
        description: "Description for Objective: Imperial Rider",
        defaultMessage:
          "Correctly predict the outcome of an agenda using Imperial Rider.",
      }),
      expansion: "BASE",
      max: 2,
      id: "Imperial Rider",
      name: intl.formatMessage({
        id: "Objectives.Imperial Rider.Title",
        description: "Title of Objective: Imperial Rider",
        defaultMessage: "Imperial Rider",
      }),
      points: 1,
      repeatable: true,
      type: "OTHER",
    },
    "Intimidate Council": {
      description: intl.formatMessage({
        id: "Objectives.Intimidate Council.Description",
        description: "Description for Objective: Intimidate Council",
        defaultMessage:
          "Have 1 or more ships in 2 systems that are adjacent to Mecatol Rex's System.",
      }),
      expansion: "BASE",
      id: "Intimidate Council",
      name: intl.formatMessage({
        id: "Objectives.Intimidate Council.Title",
        description: "Title of Objective: Intimidate Council",
        defaultMessage: "Intimidate Council",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Lead from the Front": {
      description: intl.formatMessage({
        id: "Objectives.Lead from the Front.Description",
        description: "Description for Objective: Lead from the Front",
        defaultMessage:
          "Spend a total of 3 tokens from your tactic and/or strategy pools.",
      }),
      expansion: "BASE",
      id: "Lead from the Front",
      name: intl.formatMessage({
        id: "Objectives.Lead from the Front.Title",
        description: "Title of Objective: Lead from the Front",
        defaultMessage: "Lead from the Front",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Learn the Secrets of the Cosmos": {
      description: intl.formatMessage({
        id: "Objectives.Learn the Secrets of the Cosmos.Description",
        description:
          "Description for Objective: Learn the Secrets of the Cosmos",
        defaultMessage:
          "Have 1 or more ships in 3 systems that are each adjacent to an anomaly.",
      }),
      expansion: "BASE",
      id: "Learn the Secrets of the Cosmos",
      name: intl.formatMessage({
        id: "Objectives.Learn the Secrets of the Cosmos.Title",
        description: "Title of Objective: Learn the Secrets of the Cosmos",
        defaultMessage: "Learn the Secrets of the Cosmos",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Make an Example of Their World": {
      description: intl.formatMessage({
        id: "Objectives.Make an Example of Their World.Description",
        description:
          "Description for Objective: Make an Example of Their World",
        defaultMessage:
          "Use BOMBARDMENT to destroy the last of a player's ground forces on a planet.",
      }),
      expansion: "BASE",
      id: "Make an Example of Their World",
      name: intl.formatMessage({
        id: "Objectives.Make an Example of Their World.Title",
        description: "Title of Objective: Make an Example of Their World",
        defaultMessage: "Make an Example of Their World",
      }),
      omega: {
        description: intl.formatMessage({
          id: "Objectives.Make an Example of Their World.Omega.Description",
          description:
            "Description for Objective: Make an Example of Their World Ω",
          defaultMessage:
            "Destroy the last of a player's ground forces on a planet during the bombardment step",
        }),
        expansion: "CODEX THREE",
        name: intl.formatMessage({
          id: "Objectives.Make an Example of Their World.Omega.Title",
          description: "Title of Objective: Make an Example of Their World Ω",
          defaultMessage: "Make an Example of Their World Ω",
        }),
      },
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Manipulate Galactic Law": {
      description: intl.formatMessage({
        id: "Objectives.Manipulate Galactic Law.Description",
        description: "Description for Objective: Manipulate Galactic Law",
        defaultMessage: "Spend 16 influence.",
      }),
      expansion: "BASE",
      id: "Manipulate Galactic Law",
      name: intl.formatMessage({
        id: "Objectives.Manipulate Galactic Law.Title",
        description: "Title of Objective: Manipulate Galactic Law",
        defaultMessage: "Manipulate Galactic Law",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Master the Laws of Physics": {
      description: intl.formatMessage({
        id: "Objectives.Master the Laws of Physics.Description",
        description: "Description for Objective: Master the Laws of Physics",
        defaultMessage: "Own 4 technologies of the same color.",
      }),
      expansion: "BASE",
      id: "Master the Laws of Physics",
      name: intl.formatMessage({
        id: "Objectives.Master the Laws of Physics.Title",
        description: "Title of Objective: Master the Laws of Physics",
        defaultMessage: "Master the Laws of Physics",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Master the Sciences": {
      description: intl.formatMessage({
        id: "Objectives.Master the Sciences.Description",
        description: "Description for Objective: Master the Sciences",
        defaultMessage: "Own 2 technologies in each of 4 colors.",
      }),
      expansion: "BASE",
      id: "Master the Sciences",
      name: intl.formatMessage({
        id: "Objectives.Master the Sciences.Title",
        description: "Title of Objective: Master the Sciences",
        defaultMessage: "Master the Sciences",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Mine Rare Metals": {
      description: intl.formatMessage({
        id: "Objectives.Mine Rare Metals.Description",
        description: "Description for Objective: Mine Rare Metals",
        defaultMessage: "Control 4 hazardous planets.",
      }),
      expansion: "BASE",
      id: "Mine Rare Metals",
      name: intl.formatMessage({
        id: "Objectives.Mine Rare Metals.Title",
        description: "Title of Objective: Mine Rare Metals",
        defaultMessage: "Mine Rare Metals",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Monopolize Production": {
      description: intl.formatMessage({
        id: "Objectives.Monopolize Production.Description",
        description: "Description for Objective: Monopolize Production",
        defaultMessage: "Control 4 industrial planets.",
      }),
      expansion: "BASE",
      id: "Monopolize Production",
      name: intl.formatMessage({
        id: "Objectives.Monopolize Production.Title",
        description: "Title of Objective: Monopolize Production",
        defaultMessage: "Monopolize Production",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    Mutiny: {
      description: intl.formatMessage(
        {
          id: "Objectives.Mutiny.Description",
          description: "Description for Objective: Mutiny",
          defaultMessage:
            'FOR: Each player who voted "For" gains 1 victory point.{br}AGAINST: Each player who voted "For" loses 1 victory point.',
        },
        { br: "\n\n" }
      ),
      expansion: "BASE",
      id: "Mutiny",
      name: intl.formatMessage({
        id: "Objectives.Mutiny.Title",
        description: "Title of Objective: Mutiny",
        defaultMessage: "Mutiny",
      }),
      points: 1,
      type: "OTHER",
    },
    "Negotiate Trade Routes": {
      description: intl.formatMessage({
        id: "Objectives.Negotiate Trade Routes.Description",
        description: "Description for Objective: Negotiate Trade Routes",
        defaultMessage: "Spend 5 trade goods.",
      }),
      expansion: "BASE",
      id: "Negotiate Trade Routes",
      name: intl.formatMessage({
        id: "Objectives.Negotiate Trade Routes.Title",
        description: "Title of Objective: Negotiate Trade Routes",
        defaultMessage: "Negotiate Trade Routes",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Occupy the Seat of the Empire": {
      description: intl.formatMessage({
        id: "Objectives.Occupy the Seat of the Empire.Description",
        description: "Description for Objective: Occupy the Seat of the Empire",
        defaultMessage:
          "Control Mecatol Rex and have 3 or more ships in its system.",
      }),
      expansion: "BASE",
      id: "Occupy the Seat of the Empire",
      name: intl.formatMessage({
        id: "Objectives.Occupy the Seat of the Empire.Title",
        description: "Title of Objective: Occupy the Seat of the Empire",
        defaultMessage: "Occupy the Seat of the Empire",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Revolutionize Warfare": {
      description: intl.formatMessage({
        id: "Objectives.Revolutionize Warfare.Description",
        description: "Description for Objective: Revolutionize Warfare",
        defaultMessage: "Own 3 unit upgrade technologies.",
      }),
      expansion: "BASE",
      id: "Revolutionize Warfare",
      name: intl.formatMessage({
        id: "Objectives.Revolutionize Warfare.Title",
        description: "Title of Objective: Revolutionize Warfare",
        defaultMessage: "Revolutionize Warfare",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Seed of an Empire": {
      description: intl.formatMessage({
        id: "Objectives.Seed of an Empire.Description",
        description: "Description for Objective: Seed of an Empire",
        defaultMessage:
          "Have the most victory points when Seed of an Empire passes or the least victory points when Seed of an Empire fails.",
      }),
      expansion: "BASE",
      id: "Seed of an Empire",
      name: intl.formatMessage({
        id: "Objectives.Seed of an Empire.Title",
        description: "Title of Objective: Seed of an Empire",
        defaultMessage: "Seed of an Empire",
      }),
      points: 1,
      type: "OTHER",
    },
    "Shard of the Throne": {
      description: intl.formatMessage({
        id: "Objectives.Shard of the Throne.Description",
        description: "Description for Objective: Shard of the Throne",
        defaultMessage:
          "Given to the current holder of the Shard of the Throne.",
      }),
      expansion: "BASE",
      max: 2,
      repeatable: true,
      id: "Shard of the Throne",
      name: intl.formatMessage({
        id: "Objectives.Shard of the Throne.Title",
        description: "Title of Objective: Shard of the Throne",
        defaultMessage: "Shard of the Throne",
      }),
      points: 1,
      type: "OTHER",
    },
    "Spark a Rebellion": {
      description: intl.formatMessage({
        id: "Objectives.Spark a Rebellion.Description",
        description: "Description for Objective: Spark a Rebellion",
        defaultMessage:
          "Win a combat against a player who has the most victory points.",
      }),
      expansion: "BASE",
      id: "Spark a Rebellion",
      name: intl.formatMessage({
        id: "Objectives.Spark a Rebellion.Title",
        description: "Title of Objective: Spark a Rebellion",
        defaultMessage: "Spark a Rebellion",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Subdue the Galaxy": {
      description: intl.formatMessage({
        id: "Objectives.Subdue the Galaxy.Description",
        description: "Description for Objective: Subdue the Galaxy",
        defaultMessage: "Control 11 planets in non-home systems.",
      }),
      expansion: "BASE",
      id: "Subdue the Galaxy",
      name: intl.formatMessage({
        id: "Objectives.Subdue the Galaxy.Title",
        description: "Title of Objective: Subdue the Galaxy",
        defaultMessage: "Subdue the Galaxy",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Support for the Throne": {
      description: intl.formatMessage({
        id: "Objectives.Support for the Throne.Description",
        description: "Description for Objective: Support for the Throne",
        defaultMessage:
          "Have another player's Support for the Throne in your play area.",
      }),
      expansion: "BASE",
      id: "Support for the Throne",
      name: intl.formatMessage({
        id: "Objectives.Support for the Throne.Title",
        description: "Title of Objective: Support for the Throne",
        defaultMessage: "Support for the Throne",
      }),
      points: 1,
      repeatable: true,
      type: "OTHER",
    },
    "Sway the Council": {
      description: intl.formatMessage({
        id: "Objectives.Sway the Council.Description",
        description: "Description for Objective: Sway the Council",
        defaultMessage: "Spend 8 influence.",
      }),
      expansion: "BASE",
      id: "Sway the Council",
      name: intl.formatMessage({
        id: "Objectives.Sway the Council.Title",
        description: "Title of Objective: Sway the Council",
        defaultMessage: "Sway the Council",
      }),
      points: 1,
      type: "STAGE ONE",
    },
    "Threaten Enemies": {
      description: intl.formatMessage({
        id: "Objectives.Threaten Enemies.Description",
        description: "Description for Objective: Threaten Enemies",
        defaultMessage:
          "Have 1 or more ships in a system that is adjacent to another player's home system.",
      }),
      expansion: "BASE",
      id: "Threaten Enemies",
      name: intl.formatMessage({
        id: "Objectives.Threaten Enemies.Title",
        description: "Title of Objective: Threaten Enemies",
        defaultMessage: "Threaten Enemies",
      }),
      phase: "STATUS",
      points: 1,
      type: "SECRET",
    },
    "Turn Their Fleets to Dust": {
      description: intl.formatMessage({
        id: "Objectives.Turn Their Fleets to Dust.Description",
        description: "Description for Objective: Turn Their Fleets to Dust",
        defaultMessage:
          "Use SPACE CANNON to destroy the last of a player's ships in a system.",
      }),
      expansion: "BASE",
      id: "Turn Their Fleets to Dust",
      name: intl.formatMessage({
        id: "Objectives.Turn Their Fleets to Dust.Title",
        description: "Title of Objective: Turn Their Fleets to Dust",
        defaultMessage: "Turn Their Fleets to Dust",
      }),
      omega: {
        description: intl.formatMessage({
          id: "Objectives.Turn Their Fleets to Dust.Omega.Description",
          description: "Description for Objective: Turn Their Fleets to Dust Ω",
          defaultMessage:
            "Destroy the last of a player's non-fighter ships in the active system during the space cannon offense step.",
        }),
        expansion: "CODEX THREE",
        name: intl.formatMessage({
          id: "Objectives.Turn Their Fleets to Dust.Omega.Title",
          description: "Title of Objective: Turn Their Fleets to Dust Ω",
          defaultMessage: "Turn Their Fleets to Dust Ω",
        }),
      },
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
    "Unify the Colonies": {
      description: intl.formatMessage({
        id: "Objectives.Unify the Colonies.Description",
        description: "Description for Objective: Unify the Colonies",
        defaultMessage:
          "Control 6 planets that each have the same planet trait.",
      }),
      expansion: "BASE",
      id: "Unify the Colonies",
      name: intl.formatMessage({
        id: "Objectives.Unify the Colonies.Title",
        description: "Title of Objective: Unify the Colonies",
        defaultMessage: "Unify the Colonies",
      }),
      points: 2,
      type: "STAGE TWO",
    },
    "Unveil Flagship": {
      description: intl.formatMessage({
        id: "Objectives.Unveil Flagship.Description",
        description: "Description for Objective: Unveil Flagship",
        defaultMessage:
          "Win a space combat in a system that contains your flagship. You cannot score this objective if your flagship is destroyed in the combat.",
      }),
      expansion: "BASE",
      id: "Unveil Flagship",
      name: intl.formatMessage({
        id: "Objectives.Unveil Flagship.Title",
        description: "Title of Objective: Unveil Flagship",
        defaultMessage: "Unveil Flagship",
      }),
      phase: "ACTION",
      points: 1,
      type: "SECRET",
    },
  };
}
