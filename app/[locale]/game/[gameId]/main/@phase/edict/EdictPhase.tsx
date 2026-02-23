import { FormattedMessage, useIntl } from "react-intl";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { useViewOnly } from "../../../../../../../src/context/dataHooks";
import { useFactionColor } from "../../../../../../../src/context/factionDataHooks";
import { useTyrant } from "../../../../../../../src/context/stateDataHooks";
import { LockedButtons } from "../../../../../../../src/LockedButton";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import { phaseString } from "../../../../../../../src/util/strings";
import { rem } from "../../../../../../../src/util/util";

export default function EdictPhase() {
  const dataUpdate = useDataUpdate();
  const intl = useIntl();
  const tyrant = useTyrant() ?? "A Sickening Lurch";
  const viewOnly = useViewOnly();
  const factionColor = useFactionColor(tyrant);

  return (
    <div
      className="flexColumn"
      style={{ alignItems: "center", width: "100%", paddingTop: rem(160) }}
    >
      <div style={{ fontSize: rem(24) }}>
        <FormattedMessage
          id="Irm2+w"
          defaultMessage="{phase} Phase"
          description="Text shown on side of screen during a specific phase"
          values={{ phase: phaseString("EDICT", intl) }}
        />
      </div>
      <LabeledDiv
        label={<FactionComponents.Name factionId={tyrant} />}
        color={factionColor}
        style={{ width: "fit-content" }}
      >
        <FormattedMessage
          id="BATnO1"
          defaultMessage="Draw 3 Edicts and choose 1 to resolve."
          description="Instructions for the Tyrant to resolve the Edict phase."
        />
      </LabeledDiv>
      <LockedButtons
        unlocked={true}
        style={{
          marginTop: rem(12),
          justifyContent: "center",
        }}
        buttons={[
          {
            text: intl.formatMessage({
              id: "5WXn8l",
              defaultMessage: "Start Next Round",
              description: "Text on a button that will start the next round.",
            }),
            style: {
              fontSize: rem(24),
            },
            onClick: () => dataUpdate(Events.AdvancePhaseEvent()),
          },
        ]}
        viewOnly={viewOnly}
      />
    </div>
  );
}
