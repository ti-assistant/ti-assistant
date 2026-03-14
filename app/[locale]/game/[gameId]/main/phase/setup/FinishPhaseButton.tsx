import { IntlShape, useIntl } from "react-intl";
import {
  useGameId,
  useLogEntries,
  useOptions,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useFactions } from "../../../../../../../src/context/factionDataHooks";
import { LockedButtons } from "../../../../../../../src/LockedButton";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import { objectiveTypeString } from "../../../../../../../src/util/strings";
import { rem } from "../../../../../../../src/util/util";
import { setupPhaseComplete } from "./SetupPhase";
import styles from "./SetupPhase.module.scss";

export default function FinishPhaseButton({
  embedded,
}: {
  embedded?: boolean;
}) {
  const dataUpdate = useDataUpdate();
  const factions = useFactions();
  const gameId = useGameId();
  const intl = useIntl();
  const options = useOptions();
  const viewOnly = useViewOnly();
  const revealedObjectives = useLogEntries<RevealObjectiveData>(
    "REVEAL_OBJECTIVE",
  ).map((entry) => entry.data.event.objective);

  return (
    <div className={`flexColumn ${embedded ? styles.Embedded : ""}`}>
      {!setupPhaseComplete(factions, revealedObjectives, options) ? (
        <div
          style={{
            color: "firebrick",
            fontFamily: "Myriad Pro",
            fontWeight: "bold",
          }}
        >
          {getSetupPhaseText(factions, revealedObjectives, intl, options)}
        </div>
      ) : null}
      <LockedButtons
        unlocked={setupPhaseComplete(factions, revealedObjectives, options)}
        buttons={[
          {
            text: intl.formatMessage({
              id: "lYD2yu",
              description: "Text on a button that will start a game.",
              defaultMessage: "Start Game",
            }),
            onClick: () => {
              dataUpdate(Events.AdvancePhaseEvent());
            },
            style: { fontSize: rem(40) },
          },
        ]}
        viewOnly={viewOnly}
      />
    </div>
  );
}

function getSetupPhaseText(
  factions: Partial<Record<FactionId, Faction>>,
  revealedObjectives: string[],
  intl: IntlShape,
  options: Options,
) {
  const hideObjectives = options.hide?.includes("OBJECTIVES");
  const hideTechs = options.hide?.includes("TECHS");
  const textSections = [];
  if (
    !factionSubFactionChoicesComplete(factions) ||
    (!factionTechChoicesComplete(factions) && !hideTechs)
  ) {
    textSections.push(
      intl.formatMessage({
        id: "xu0llf",
        defaultMessage: "Select all Faction Choices",
        description:
          "Error message telling the user to select all faction choices.",
      }),
    );
  }
  if (!hideObjectives && revealedObjectives.length !== 2) {
    textSections.push(
      intl.formatMessage(
        {
          id: "lDBTCO",
          description: "Instruction telling the speaker to reveal objectives.",
          defaultMessage:
            "Reveal {count, number} {type} {count, plural, one {objective} other {objectives}}",
        },
        {
          count: 2,
          type: objectiveTypeString("STAGE ONE", intl),
        },
      ),
    );
  }
  return textSections.join(
    ` ${intl
      .formatMessage({
        id: "+WkrHz",
        defaultMessage: "AND",
        description: "Text between two fields linking them together.",
      })
      .toLowerCase()} `,
  );
}

function factionTechChoicesComplete(
  factions: Partial<Record<FactionId, Faction>>,
): boolean {
  let complete = true;
  Object.values(factions).forEach((faction) => {
    if (faction.startswith?.choice) {
      const numSelected = (faction.startswith.techs ?? []).length;
      let numRequired = faction.startswith.choice.select;
      let numAvailable = faction.startswith.choice.options.length;
      if (faction.id === "Deepwrought Scholarate") {
        numRequired = 2;
        numAvailable = 2;
      }
      if (numSelected !== numRequired && numSelected !== numAvailable) {
        complete = false;
      }
    }
  });
  return complete;
}

function factionSubFactionChoicesComplete(
  factions: Partial<Record<FactionId, Faction>>,
): boolean {
  if (!factions["Council Keleres"]) {
    return true;
  }
  return (factions["Council Keleres"].startswith?.planets ?? []).length !== 0;
}
