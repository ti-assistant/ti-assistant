import { FormattedMessage, useIntl } from "react-intl";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useCurrentTurn,
  useEdicts,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import {
  useFaction,
  useFactionColors,
} from "../../../../../../../src/context/factionDataHooks";
import { useTyrant } from "../../../../../../../src/context/stateDataHooks";
import { LockedButtons } from "../../../../../../../src/LockedButton";
import { getLogEntries } from "../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import { phaseString } from "../../../../../../../src/util/strings";
import { rem } from "../../../../../../../src/util/util";
import { SelectableRow } from "../../../../../../../src/SelectableRow";
import { InfoRow } from "../../../../../../../src/InfoRow";
import FormattedDescription from "../../../../../../../src/components/FormattedDescription/FormattedDescription";
import {
  getFactionBorder,
  getFactionColor,
} from "../../../../../../../src/util/factions";
import FactionIcon from "../../../../../../../src/components/FactionIcon/FactionIcon";

export default function EdictPhase() {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const edicts = useEdicts();
  const intl = useIntl();
  const tyrant = useTyrant() ?? "A Sickening Lurch";
  const viewOnly = useViewOnly();
  const colors = useFactionColors(tyrant);
  const aur = useFaction("Radiant Aur");

  const selectedEdicts = getLogEntries<ChooseEdictData>(
    currentTurn,
    "CHOOSE_EDICT",
  );

  const aurEdict = selectedEdicts.filter(
    (entry) => !entry.data.event.tyrant,
  )[0];
  const tyrantEdict = selectedEdicts.filter(
    (entry) => entry.data.event.tyrant,
  )[0];

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
      {aur ? (
        <LabeledDiv
          label={
            <div className="flexRow" style={{ gap: "0.25rem" }}>
              <FactionIcon factionId="Radiant Aur" size={16} />
              <FactionComponents.Name factionId="Radiant Aur" />
            </div>
          }
          color={getFactionColor(aur)}
          borderColor={getFactionBorder(aur)}
          style={{ width: "fit-content" }}
        >
          {intl.formatMessage({
            id: "6ZifFF",
            description: "Instructions for Radiant Aur Edict Phase",
            defaultMessage:
              "At the start of the edict phase, if your flagship is on the game board, draw and resolve 1 edict.",
          })}
          <Selector
            selectedItem={aurEdict?.data.event.edictId}
            hoverMenuLabel="Draw Edict"
            toggleItem={(edictId, add) => {
              if (add) {
                dataUpdate(Events.ChooseEdictEvent(edictId, false));
              } else {
                dataUpdate(Events.HideEdictEvent(edictId, false));
              }
            }}
            renderItem={(edictId) => {
              const edict = edicts[edictId];
              if (!edict) {
                return null;
              }
              return (
                <SelectableRow
                  removeItem={() => {
                    dataUpdate(Events.HideEdictEvent(edictId, false));
                  }}
                  itemId={edictId}
                >
                  <InfoRow
                    infoTitle={edict.name}
                    infoContent={
                      <FormattedDescription description={edict.description} />
                    }
                  >
                    {edict.name}
                  </InfoRow>
                </SelectableRow>
              );
            }}
            options={Object.values(edicts)}
          />
        </LabeledDiv>
      ) : null}
      <LabeledDiv
        label={
          <div className="flexRow" style={{ gap: "0.25rem" }}>
            <FactionIcon factionId={tyrant} size={16} />
            <FactionComponents.Name factionId={tyrant} />
          </div>
        }
        color={colors.color}
        borderColor={colors.border}
        style={{ width: "fit-content" }}
      >
        <FormattedMessage
          id="BATnO1"
          defaultMessage="Draw 3 Edicts and choose 1 to resolve."
          description="Instructions for the Tyrant to resolve the Edict phase."
        />
        <Selector
          selectedItem={tyrantEdict?.data.event.edictId}
          hoverMenuLabel="Choose Edict"
          toggleItem={(edictId, add) => {
            if (add) {
              dataUpdate(Events.ChooseEdictEvent(edictId, true));
            } else {
              dataUpdate(Events.HideEdictEvent(edictId, true));
            }
          }}
          renderItem={(edictId) => {
            const edict = edicts[edictId];
            if (!edict) {
              return null;
            }
            return (
              <SelectableRow
                removeItem={() => {
                  dataUpdate(Events.HideEdictEvent(edictId, true));
                }}
                itemId={edictId}
              >
                <InfoRow
                  infoTitle={edict.name}
                  infoContent={
                    <FormattedDescription description={edict.description} />
                  }
                >
                  {edict.name}
                </InfoRow>
              </SelectableRow>
            );
          }}
          options={Object.values(edicts)}
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
            primary: true,
          },
        ]}
        viewOnly={viewOnly}
      />
    </div>
  );
}
