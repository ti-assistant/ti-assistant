import { useState } from "react";
import { FormattedMessage, IntlShape, useIntl } from "react-intl";
import Chip from "../../../../../../../src/components/Chip/Chip";
import FactionDiv from "../../../../../../../src/components/LabeledDiv/FactionDiv";
import InauguralSplice from "../../../../../../../src/components/StartingComponents/InauguralSplice";
import StartingComponents from "../../../../../../../src/components/StartingComponents/StartingComponents";
import { useOptions } from "../../../../../../../src/context/dataHooks";
import { useOrderedFactionIds } from "../../../../../../../src/context/gameDataHooks";
import { objectiveTypeString } from "../../../../../../../src/util/strings";
import { rem } from "../../../../../../../src/util/util";
import FinishPhaseButton from "./FinishPhaseButton";
import styles from "./SetupPhase.module.scss";
import SetupSteps from "./SetupSteps";

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

export function setupPhaseComplete(
  factions: Partial<Record<FactionId, Faction>>,
  revealedObjectives: string[],
  options: Options,
): boolean {
  const hideObjectives = options.hide?.includes("OBJECTIVES");
  const hideTechs = options.hide?.includes("TECHS");
  return (
    factionSubFactionChoicesComplete(factions) &&
    (factionTechChoicesComplete(factions) || !!hideTechs) &&
    (revealedObjectives.length === 2 || !!hideObjectives)
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

export default function SetupPhase() {
  const options = useOptions();

  const orderedFactionIds = useOrderedFactionIds("SPEAKER");

  const intl = useIntl();

  const [showInauguralSplice, setShowInauguralSplice] =
    useState<boolean>(false);

  return (
    <>
      <SetupSteps intl={intl} />
      <div className={`flexColumn ${styles.MainColumn}`}>
        <div
          className="flexColumn"
          style={{
            alignItems: "center",
            justifyContent: "space-evenly",
            boxSizing: "border-box",
            margin: 0,
            whiteSpace: "nowrap",
            gap: rem(8),
            width: "100%",
          }}
        >
          <div
            className="flexRow"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {options.expansions.includes("TWILIGHTS FALL") &&
            !options.hide?.includes("TECHS") ? (
              <>
                <Chip
                  toggleFn={() => setShowInauguralSplice(false)}
                  selected={!showInauguralSplice}
                  fontSize={16}
                >
                  <FormattedMessage
                    id="rlGbdz"
                    description="A label for a section of components that a faction starts with."
                    defaultMessage="Starting Components"
                  />
                </Chip>
                <Chip
                  toggleFn={() => setShowInauguralSplice(true)}
                  selected={showInauguralSplice}
                  fontSize={16}
                >
                  <FormattedMessage
                    id="fHRZ5N"
                    description="A step in the setup phase: The inaugural splice."
                    defaultMessage="Inaugural Splice"
                  />
                </Chip>
              </>
            ) : (
              <FormattedMessage
                id="rlGbdz"
                description="A label for a section of components that a faction starts with."
                defaultMessage="Starting Components"
              />
            )}
          </div>
          <div
            style={{
              display: "grid",
              width: "100%",
              gridAutoFlow: "row",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              // gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              gap: rem(8),
              paddingTop: rem(6),
            }}
          >
            {Object.values(orderedFactionIds).map((factionId) => {
              if (showInauguralSplice) {
                return (
                  <InauguralSpliceDiv key={factionId} factionId={factionId} />
                );
              }
              return (
                <StartingComponentDiv key={factionId} factionId={factionId} />
              );
            })}
          </div>
          <FinishPhaseButton />
        </div>
      </div>
    </>
  );
}

function InauguralSpliceDiv({ factionId }: { factionId: FactionId }) {
  return (
    <FactionDiv factionId={factionId}>
      <div
        className="flexColumn"
        style={{
          alignItems: "flex-start",
          height: "100%",
          width: "100%",
        }}
      >
        <InauguralSplice factionId={factionId} />
      </div>
    </FactionDiv>
  );
}

function StartingComponentDiv({ factionId }: { factionId: FactionId }) {
  return (
    <FactionDiv factionId={factionId}>
      <div
        className="flexColumn"
        style={{
          alignItems: "flex-start",
          height: "100%",
          width: "100%",
        }}
      >
        <StartingComponents factionId={factionId} showFactionIcon />
      </div>
    </FactionDiv>
  );
}
