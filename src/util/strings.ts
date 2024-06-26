import { IntlShape } from "react-intl";

export function sustainDamage(intl: IntlShape) {
  return intl.formatMessage({
    id: "H3n/oR",
    description: "A unit ability that allows a unit to cancel a hit.",
    defaultMessage: "SUSTAIN DAMAGE",
  });
}

export function planetaryShield(intl: IntlShape) {
  return intl.formatMessage({
    id: "hIFcXI",
    description: "A unit ability that prevents BOMBARDMENT.",
    defaultMessage: "PLANETARY SHIELD",
  });
}

export function production(value: string, intl: IntlShape) {
  return intl.formatMessage(
    {
      id: "Oozdq1",
      description: "A unit ability that allows a unit to produce other units.",
      defaultMessage: "PRODUCTION {value}",
    },
    { value }
  );
}

export function spaceCannon(value: string, intl: IntlShape) {
  return intl.formatMessage(
    {
      id: "K1ks2a",
      description: "A unit ability that allows a unit to use SPACE CANNON.",
      defaultMessage: "SPACE CANNON {value}",
    },
    { value }
  );
}

export function bombardment(value: string, intl: IntlShape) {
  return intl.formatMessage(
    {
      id: "nryRrR",
      description:
        "A unit ability that allows a unit to bombard ground forces.",
      defaultMessage: "BOMBARDMENT {value}",
    },
    { value }
  );
}

export function antiFighterBarrage(value: string, intl: IntlShape) {
  return intl.formatMessage(
    {
      id: "D82kvD",
      description: "A unit ability that allows a unit to destroy fighters.",
      defaultMessage: "ANTI-FIGHTER BARRAGE {value}",
    },
    { value }
  );
}

export function mapStyleString(style: MapStyle, intl: IntlShape) {
  switch (style) {
    case "large":
      return intl.formatMessage({
        id: "0rSMZW",
        description:
          "Text on a button specifying that the map style should be large.",
        defaultMessage: "Large",
      });
    case "skinny":
      return intl.formatMessage({
        id: "Ecx237",
        description:
          "Text on a button specifying that the map style should be skinny.",
        defaultMessage: "Skinny",
      });
    case "standard":
      return intl.formatMessage({
        id: "4wSR75",
        description:
          "Text on a button specifying that the map style should be standard.",
        defaultMessage: "Standard",
      });
    case "warp":
      return intl.formatMessage({
        id: "4V92Jv",
        description:
          "Text on a button specifying that the map style should be warp.",
        defaultMessage: "Warp",
      });
  }
}

export function gameIdString(intl: IntlShape) {
  return intl.formatMessage({
    id: "FHUFoZ",
    description: "Label for the ID used to identify a specific game.",
    defaultMessage: "Game ID",
  });
}

export function phaseString(phase: Phase, intl: IntlShape) {
  switch (phase) {
    case "UNKNOWN":
      return intl.formatMessage({
        id: "Phase.Unknown",
        description: "Phase text shown while game is loading.",
        defaultMessage: "Unknown",
      });
    case "SETUP":
      return intl.formatMessage({
        id: "Phase.Setup",
        description: "Phase title for Setup phase.",
        defaultMessage: "Setup",
      });
    case "STRATEGY":
      return intl.formatMessage({
        id: "Phase.Strategy",
        description: "Phase title for Strategy phase.",
        defaultMessage: "Strategy",
      });
    case "ACTION":
      return intl.formatMessage({
        id: "Phase.Action",
        description: "Phase title for Action phase.",
        defaultMessage: "Action",
      });
    case "STATUS":
      return intl.formatMessage({
        id: "Phase.Status",
        description: "Phase title for Status phase.",
        defaultMessage: "Status",
      });
    case "AGENDA":
      return intl.formatMessage({
        id: "Phase.Agenda",
        description: "Phase title for Agenda phase.",
        defaultMessage: "Agenda",
      });
    case "END":
      return intl.formatMessage({
        id: "Phase.End",
        description: "Phase title for end of game.",
        defaultMessage: "Results",
      });
  }
}

export function objectiveTypeString(type: ObjectiveType, intl: IntlShape) {
  switch (type) {
    case "STAGE ONE":
      return intl.formatMessage({
        id: "J21D/U",
        description:
          "The title of public objectives that grant 1 victory point.",
        defaultMessage: "Stage I",
      });
    case "STAGE TWO":
      return intl.formatMessage({
        id: "Z6gLCK",
        description:
          "The title of public objectives that grant 2 victory points.",
        defaultMessage: "Stage II",
      });
    case "SECRET":
      return intl.formatMessage({
        id: "QrrIrN",
        description: "The title of secret objectives.",
        defaultMessage: "Secrets",
      });
    case "OTHER":
      return intl.formatMessage({
        id: "sgqLYB",
        description: "Text on a button used to select a non-listed value",
        defaultMessage: "Other",
      });
  }
}

export function leaderTypeString(type: LeaderType, intl: IntlShape) {
  switch (type) {
    case "AGENT":
      return intl.formatMessage({
        id: "eO0b2t",
        description:
          "The title of an agent: a leader that can get used once per round.",
        defaultMessage: "Agent",
      });
    case "COMMANDER":
      return intl.formatMessage({
        id: "fxKsk7",
        description:
          "The title of a commander: a leader that provides a passive ability.",
        defaultMessage: "Commander",
      });
    case "HERO":
      return intl.formatMessage({
        id: "Sw+CbI",
        description:
          "The title of a hero: a leader that gets used once per game.",
        defaultMessage: "Hero",
      });
  }
}

export function outcomeString(type: OutcomeType, intl: IntlShape) {
  switch (type) {
    case "For/Against":
      return intl.formatMessage({
        id: "Outcomes.For/Against",
        description: "Outcome type: For/Against",
        defaultMessage: "For/Against",
      });
    case "Planet":
      return intl.formatMessage({
        id: "Outcomes.Planet",
        description: "Outcome type: Planet",
        defaultMessage: "Planet",
      });
    case "Cultural Planet":
      return intl.formatMessage({
        id: "Outcomes.Cultural Planet",
        description: "Outcome type: Cultural Planet",
        defaultMessage: "Cultural Planet",
      });
    case "Hazardous Planet":
      return intl.formatMessage({
        id: "Outcomes.Hazardous Planet",
        description: "Outcome type: Hazardous Planet",
        defaultMessage: "Hazardous Planet",
      });
    case "Industrial Planet":
      return intl.formatMessage({
        id: "Outcomes.Industrial Planet",
        description: "Outcome type: Industrial Planet",
        defaultMessage: "Industrial Planet",
      });
    case "Player":
      return intl.formatMessage({
        id: "Outcomes.Player",
        description: "Outcome type: Player",
        defaultMessage: "Player",
      });
    case "Strategy Card":
      return intl.formatMessage({
        id: "Outcomes.Strategy Card",
        description: "Outcome type: Strategy Card",
        defaultMessage: "Strategy Card",
      });
    case "Law":
      return intl.formatMessage({
        id: "Outcomes.Law",
        description: "Outcome type: Law",
        defaultMessage: "Law",
      });
    case "Scored Secret Objective":
      return intl.formatMessage({
        id: "Outcomes.Scored Secret Objective",
        description: "Outcome type: Scored Secret Objective",
        defaultMessage: "Scored Secret Objective",
      });
    case "Non-Home Planet Other Than Mecatol Rex":
      return intl.formatMessage({
        id: "Outcomes.Non-Home Planet Other Than Mecatol Rex",
        description: "Outcome type: Non-Home Planet Other Than Mecatol Rex",
        defaultMessage: "Non-Home Planet Other Than Mecatol Rex",
      });
  }
  return "";
}

export function riderString(rider: string, intl: IntlShape) {
  switch (rider) {
    case "Galactic Threat":
      return intl.formatMessage({
        id: "Riders.Galactic Threat.Title",
        description: "Title of Rider: Galactic Threat",
        defaultMessage: "Galactic Threat",
      });
    case "Leadership Rider":
      return intl.formatMessage({
        id: "Riders.Leadership Rider.Title",
        description: "Title of Rider: Leadership Rider",
        defaultMessage: "Leadership Rider",
      });
    case "Diplomacy Rider":
      return intl.formatMessage({
        id: "Riders.Diplomacy Rider.Title",
        description: "Title of Rider: Diplomacy Rider",
        defaultMessage: "Diplomacy Rider",
      });
    case "Politics Rider":
      return intl.formatMessage({
        id: "Riders.Politics Rider.Title",
        description: "Title of Rider: Politics Rider",
        defaultMessage: "Politics Rider",
      });
    case "Construction Rider":
      return intl.formatMessage({
        id: "Riders.Construction Rider.Title",
        description: "Title of Rider: Construction Rider",
        defaultMessage: "Construction Rider",
      });
    case "Trade Rider":
      return intl.formatMessage({
        id: "Riders.Trade Rider.Title",
        description: "Title of Rider: Trade Rider",
        defaultMessage: "Trade Rider",
      });
    case "Warfare Rider":
      return intl.formatMessage({
        id: "Riders.Warfare Rider.Title",
        description: "Title of Rider: Warfare Rider",
        defaultMessage: "Warfare Rider",
      });
    case "Technology Rider":
      return intl.formatMessage({
        id: "Riders.Technology Rider.Title",
        description: "Title of Rider: Technology Rider",
        defaultMessage: "Technology Rider",
      });
    case "Imperial Rider":
      return intl.formatMessage({
        id: "Riders.Imperial Rider.Title",
        description: "Title of Rider: Imperial Rider",
        defaultMessage: "Imperial Rider",
      });
    case "Sanction":
      return intl.formatMessage({
        id: "Riders.Sanction.Title",
        description: "Title of Rider: Sanction",
        defaultMessage: "Sanction",
      });
    case "Keleres Rider":
      return intl.formatMessage({
        id: "Riders.Keleres Rider.Title",
        description: "Title of Rider: Keleres Rider",
        defaultMessage: "Keleres Rider",
      });
  }
  return "";
}

export function techTypeString(type: TechType, intl: IntlShape) {
  switch (type) {
    case "BLUE":
      return intl.formatMessage({
        id: "Nr4DLa",
        defaultMessage: "Propulsion",
        description: "Title of blue techs.",
      });
    case "GREEN":
      return intl.formatMessage({
        id: "2I5JBO",
        defaultMessage: "Biotic",
        description: "Title of green techs.",
      });
    case "RED":
      return intl.formatMessage({
        id: "ZqAjEi",
        defaultMessage: "Warfare",
        description: "Title of red techs.",
      });
    case "YELLOW":
      return intl.formatMessage({
        id: "W9OGxl",
        defaultMessage: "Cybernetic",
        description: "Title of yellow techs.",
      });
    case "UPGRADE":
      return intl.formatMessage({
        id: "2hHU0G",
        defaultMessage: "Unit Upgrades",
        description: "Title of uprade techs.",
      });
  }
}

export function unitTypeString(type: UnitType, intl: IntlShape) {
  switch (type) {
    case "Carrier":
      return intl.formatMessage({
        id: "Units.Carrier",
        defaultMessage: "Carrier",
        description: "Title of Carrier.",
      });
    case "Cruiser":
      return intl.formatMessage({
        id: "Units.Cruiser",
        defaultMessage: "Cruiser",
        description: "Title of Cruiser.",
      });
    case "Destroyer":
      return intl.formatMessage({
        id: "Units.Destroyer",
        defaultMessage: "Destroyer",
        description: "Title of Destroyer.",
      });
    case "Dreadnought":
      return intl.formatMessage({
        id: "Units.Dreadnought",
        defaultMessage: "Dreadnought",
        description: "Title of Dreadnought.",
      });
    case "Fighter":
      return intl.formatMessage({
        id: "Units.Fighter",
        defaultMessage: "Fighter",
        description: "Title of Fighter.",
      });
    case "Flagship":
      return intl.formatMessage({
        id: "Units.Flagship",
        defaultMessage: "Flagship",
        description: "Title of Flagship.",
      });
    case "Infantry":
      return intl.formatMessage({
        id: "Units.Infantry",
        defaultMessage: "Infantry",
        description: "Title of Infantry.",
      });
    case "Mech":
      return intl.formatMessage({
        id: "Units.Mech",
        defaultMessage: "Mech",
        description: "Title of Mech.",
      });
    case "PDS":
      return intl.formatMessage({
        id: "Units.PDS",
        defaultMessage: "PDS",
        description: "Title of PDS.",
      });
    case "Space Dock":
      return intl.formatMessage({
        id: "Units.Space Dock",
        defaultMessage: "Space Dock",
        description: "Title of Space Dock.",
      });
    case "War Sun":
      return intl.formatMessage({
        id: "Units.War Sun",
        defaultMessage: "War Sun",
        description: "Title of War Sun.",
      });
  }
}

export function agendaTypeString(type: AgendaType, intl: IntlShape) {
  switch (type) {
    case "DIRECTIVE":
      return intl.formatMessage({
        id: "tM6gjG",
        defaultMessage: "Directive",
        description: "Agenda type that does not have an ongoing effect.",
      });
    case "LAW":
      return intl.formatMessage({
        id: "5/RTAm",
        defaultMessage: "Law",
        description: "Agenda type that has an ongoing effect if passed.",
      });
  }
}
