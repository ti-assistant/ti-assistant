import { FormattedMessage, useIntl } from "react-intl";
import GainRelic from "../../../../../../../src/components/Actions/GainRelic";
import GainTFCard from "../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../src/components/FactionComponents/FactionComponents";
import FactionIcon from "../../../../../../../src/components/FactionIcon/FactionIcon";
import FormattedDescription from "../../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../../src/components/LabeledDiv/LabeledDiv";
import LabeledLine from "../../../../../../../src/components/LabeledLine/LabeledLine";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useCurrentPhase,
  useEdicts,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import {
  useAllFactionColors,
  useFaction,
  useFactionColors,
} from "../../../../../../../src/context/factionDataHooks";
import { useTyrant } from "../../../../../../../src/context/stateDataHooks";
import { InfoRow } from "../../../../../../../src/InfoRow";
import { LockedButtons } from "../../../../../../../src/LockedButton";
import { SelectableRow } from "../../../../../../../src/SelectableRow";
import { getLogEntries } from "../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import {
  getFactionBorder,
  getFactionColor,
} from "../../../../../../../src/util/factions";
import { phaseString } from "../../../../../../../src/util/strings";
import { rem } from "../../../../../../../src/util/util";
import Arbitrate from "./Arbitrate";
import Convene from "./Convene";
import LegacyOfIxth from "./LegacyOfIxth";
import Splice from "./Splice";

export default function EdictPhase() {
  const currentPhase = useCurrentPhase();
  const dataUpdate = useDataUpdate();
  const edicts = useEdicts();
  const intl = useIntl();
  const tyrant = useTyrant();
  const viewOnly = useViewOnly();
  const colors = useAllFactionColors();
  const aur = useFaction("Radiant Aur");

  const selectedEdicts = getLogEntries<ChooseEdictData>(
    currentPhase,
    "CHOOSE_EDICT",
  );

  const lastAction = currentPhase[currentPhase.length - 1];

  const aurEdict = selectedEdicts.filter(
    (entry) => !entry.data.event.tyrant,
  )[0];
  const canRemoveAur =
    lastAction?.data.action === "CHOOSE_EDICT" && !lastAction.data.event.tyrant;
  const tyrantEdict = selectedEdicts.filter(
    (entry) => entry.data.event.tyrant,
  )[0];
  const canRemoveTyrant =
    lastAction?.data.action === "CHOOSE_EDICT" && lastAction.data.event.tyrant;

  return (
    <div
      className="flexColumn"
      style={{
        width: "100%",
        paddingTop: rem(40),
        marginBlockEnd: rem(100),
      }}
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
                <LabeledLine
                  leftLabel={
                    <SelectableRow
                      removeItem={
                        canRemoveAur
                          ? () => {
                              dataUpdate(Events.HideEdictEvent(edictId, false));
                            }
                          : undefined
                      }
                      itemId={edictId}
                      style={{
                        fontFamily: "var(--main-font)",
                      }}
                    >
                      <InfoRow
                        infoTitle={edict.name}
                        infoContent={
                          <FormattedDescription
                            description={edict.description}
                          />
                        }
                      >
                        {edict.name}
                      </InfoRow>
                    </SelectableRow>
                  }
                />
              );
            }}
            options={Object.values(edicts)}
          />
          {aurEdict?.data.event.edictId ? (
            <EdictDetails
              edictId={aurEdict.data.event.edictId}
              factionId="Radiant Aur"
              finished={!!tyrantEdict}
            />
          ) : null}
        </LabeledDiv>
      ) : null}
      {tyrant ? (
        <LabeledDiv
          label={
            <div className="flexRow" style={{ gap: "0.25rem" }}>
              <FactionIcon factionId={tyrant} size={16} />
              <FactionComponents.Name factionId={tyrant} />
            </div>
          }
          color={colors[tyrant]?.color}
          borderColor={colors[tyrant]?.border}
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
                <LabeledLine
                  leftLabel={
                    <SelectableRow
                      removeItem={
                        canRemoveTyrant
                          ? () => {
                              dataUpdate(Events.HideEdictEvent(edictId, true));
                            }
                          : undefined
                      }
                      itemId={edictId}
                      style={{
                        fontFamily: "var(--main-font)",
                      }}
                    >
                      <InfoRow
                        infoTitle={edict.name}
                        infoContent={
                          <FormattedDescription
                            description={edict.description}
                          />
                        }
                      >
                        {edict.name}
                      </InfoRow>
                    </SelectableRow>
                  }
                />
              );
            }}
            options={Object.values(edicts)}
          />
          {tyrantEdict?.data.event.edictId ? (
            <EdictDetails
              edictId={tyrantEdict.data.event.edictId}
              factionId={tyrant}
            />
          ) : null}
        </LabeledDiv>
      ) : null}
      <LockedButtons
        unlocked={!tyrant || !!tyrantEdict}
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

function EdictDetails({
  edictId,
  factionId,
  finished,
}: {
  edictId: TFEdictId;
  factionId: FactionId;
  finished?: boolean;
}) {
  const edicts = useEdicts();
  const edict = edicts[edictId];
  if (finished || !edict) {
    return null;
  }
  switch (edictId) {
    case "Arbitrate":
      return (
        <>
          <div
            style={{
              fontSize: "0.75em",
              color: "var(--muted-text)",
              lineHeight: "1.25em",
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            <FormattedDescription description={edict.description} />
          </div>
          <Arbitrate factionId={factionId} />
        </>
      );
    case "Artifice":
      return (
        <>
          <div
            style={{
              fontSize: "0.75em",
              color: "var(--muted-text)",
              lineHeight: "1.25em",
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            <FormattedDescription description={edict.description} />
          </div>
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <GainRelic factionId={factionId} />
            <GainTFCard
              factionId={factionId}
              action={{ to: factionId }}
              numToGain={{
                paradigms: 1,
              }}
            />
          </div>
        </>
      );
    case "Convene":
      return (
        <>
          <div
            style={{
              fontSize: "0.75em",
              color: "var(--muted-text)",
              lineHeight: "1.25em",
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            <FormattedDescription description={edict.description} />
          </div>
          <Convene factionId={factionId} />
        </>
      );
    case "Legacy of Ixth":
      return (
        <>
          <div
            style={{
              fontSize: "0.75em",
              color: "var(--muted-text)",
              lineHeight: "1.25em",
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            <FormattedDescription description={edict.description} />
          </div>
          <LegacyOfIxth factionId={factionId} />
        </>
      );
    case "Splice":
      return (
        <>
          <div
            style={{
              fontSize: "0.75em",
              color: "var(--muted-text)",
              lineHeight: "1.25em",
              whiteSpace: "normal",
              textAlign: "left",
            }}
          >
            <FormattedDescription description={edict.description} />
          </div>
          <Splice factionId={factionId} />
        </>
      );

    case "Arise":
    case "Bless":
    case "Censure":
    case "Execute":
    case "Foretell":
      return (
        <div
          style={{
            fontSize: "0.75em",
            color: "var(--muted-text)",
            lineHeight: "1.25em",
            whiteSpace: "normal",
            textAlign: "left",
          }}
        >
          <FormattedDescription description={edict.description} />
        </div>
      );
  }
}
