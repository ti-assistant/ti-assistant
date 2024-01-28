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
        defaultMessage: "End of Game",
      });
  }
}
