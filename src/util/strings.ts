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
