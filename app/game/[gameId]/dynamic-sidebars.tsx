"use client";

import { useIntl } from "react-intl";
import Sidebars from "../../../src/components/Sidebars/Sidebars";
import { usePhase, useRound } from "../../../src/context/stateDataHooks";
import { phaseString } from "../../../src/util/strings";

export default function DynamicSidebars() {
  const intl = useIntl();
  const round = useRound();
  const phase = usePhase();

  return (
    <Sidebars
      left={intl
        .formatMessage(
          {
            id: "Irm2+w",
            defaultMessage: "{phase} Phase",
            description: "Text shown on side of screen during a specific phase",
          },
          { phase: phaseString(phase, intl).toUpperCase() }
        )
        .toUpperCase()}
      right={intl
        .formatMessage(
          {
            id: "hhm3kX",
            description: "The current round of the game.",
            defaultMessage: "Round {value}",
          },
          { value: round }
        )
        .toUpperCase()}
    />
  );
}
