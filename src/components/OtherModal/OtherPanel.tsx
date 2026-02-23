import { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { getFactions } from "../../../server/data/factions";
import {
  useExpedition,
  useOptions,
  useRelics,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactionColors, useFactions } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { useObjective } from "../../context/objectiveDataHooks";
import PromissoryMenuSVG from "../../icons/ui/PromissoryMenu";
import RelicMenuSVG from "../../icons/ui/RelicMenu";
import ThundersEdgeMenuSVG from "../../icons/ui/ThundersEdgeMenu";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { useUnplayComponent } from "../../util/api/playComponent";
import { buildMergeFunction } from "../../util/expansions";
import { getFactionColor } from "../../util/factions";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import { CollapsibleSection } from "../CollapsibleSection";
import ExpeditionIcon from "../Expedition/ExpeditionIcon";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionIcon from "../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import LabeledLine from "../LabeledLine/LabeledLine";
import OptionalLine from "../LineWithChildren/OptionalLine";
import styles from "./OtherPanel.module.scss";

function getSupportScorer(factionId: FactionId, support: Objective) {
  if (!support.keyedScorers) {
    return;
  }
  const scorers = support.keyedScorers[factionId];
  if (!scorers) {
    return;
  }
  return scorers[0];
}

export default function OtherPanel() {
  const options = useOptions();

  return (
    <div className={styles.ThundersEdgeGrid}>
      {options.expansions.includes("THUNDERS EDGE") &&
      !options.expansions.includes("TWILIGHTS FALL") ? (
        <ExpeditionSection />
      ) : null}
      <RelicsSection />
      <PromissoriesSection />
    </div>
  );
}

function ExpeditionSection() {
  return (
    <CollapsibleSection
      title={
        <div
          className="flexRow"
          style={{ justifyContent: "center", gap: rem(6) }}
        >
          <div className="flexRow" style={{ width: rem(18) }}>
            <ThundersEdgeMenuSVG />
          </div>
          <FormattedMessage
            id="1bUwOq"
            description="Text shown on a menu for selecting an expedition."
            defaultMessage="Thunder's Edge Expedition"
          />
          <div className="flexRow" style={{ width: rem(18) }}>
            <ThundersEdgeMenuSVG />
          </div>
        </div>
      }
      style={{ height: "fit-content", gridArea: "expedition" }}
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: "repeat(3, 1fr)",
          rowGap: rem(16),
          padding: rem(8),
        }}
      >
        <ExpeditionRadialSelector expeditionId="tradeGoods" />
        <ExpeditionRadialSelector expeditionId="resources" />
        <ExpeditionRadialSelector expeditionId="actionCards" />
        <ExpeditionRadialSelector expeditionId="techSkip" />
        <ExpeditionRadialSelector expeditionId="secrets" />
        <ExpeditionRadialSelector expeditionId="influence" />
      </div>
    </CollapsibleSection>
  );
}

function ExpeditionRadialSelector({
  expeditionId,
}: {
  expeditionId: ExpeditionId;
}) {
  const dataUpdate = useDataUpdate();
  const expedition = useExpedition();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useFactionColors();
  const viewOnly = useViewOnly();

  const selectedFactionId = expedition[expeditionId];

  return (
    <div className="flexColumn">
      <div
        className="flexRow"
        style={{
          position: "relative",
          height: rem(28),
          fontFamily: "var(--main-font)",
          gap: rem(4),
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ExpeditionIcon expedition={expeditionId} />
      </div>
      <FactionSelectRadialMenu
        borderColor={
          selectedFactionId ? factionColors[selectedFactionId] : undefined
        }
        factions={mapOrderedFactionIds}
        onSelect={(factionId) => {
          dataUpdate(Events.CommitToExpeditionEvent(expeditionId, factionId));
        }}
        selectedFaction={selectedFactionId}
        viewOnly={viewOnly}
      />
    </div>
  );
}

function RelicsSection() {
  const dataUpdate = useDataUpdate();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useFactionColors();
  const options = useOptions();
  const relics = useRelics();
  const viewOnly = useViewOnly();
  const unplayComponent = useUnplayComponent();

  if (options.hide?.includes("RELICS")) {
    return null;
  }

  const ownedRelics = Object.values(relics)
    .filter((relic) => relic.owner && relic.state !== "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const unownedRelics = Object.values(relics)
    .filter((relic) => !relic.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  const purgedRelics = Object.values(relics)
    .filter((relic) => relic.state === "purged")
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  return (
    <CollapsibleSection
      title={
        <div
          className="flexRow"
          style={{ justifyContent: "center", gap: rem(6) }}
        >
          <div className="flexRow" style={{ width: rem(18) }}>
            <RelicMenuSVG color="#efe383" />
          </div>
          <FormattedMessage
            id="pPpzkR"
            description="The title of relic cards."
            defaultMessage="Relics"
          />
          <div className="flexRow" style={{ width: rem(18) }}>
            <RelicMenuSVG color="#efe383" />
          </div>
        </div>
      }
      style={{
        height: "100%",
        gridArea: "left",
        padding: `${rem(8)}`,
        paddingTop: 0,
        overflowY: "scroll",
        overflowX: "hidden",
      }}
    >
      <div className="flexColumn" style={{ paddingBlockEnd: "0.5rem" }}>
        <OptionalLine label="Owned Relics">
          {ownedRelics.map((relic) => {
            const owner = relic.owner;
            if (!owner) {
              return null;
            }
            return (
              <div
                key={relic.id}
                className="flexRow"
                style={{
                  width: "100%",
                  padding: `0 ${rem(8)}`,
                }}
              >
                <SelectableRow
                  itemId={relic.id}
                  removeItem={() =>
                    dataUpdate(Events.LoseRelicEvent(owner, relic.id))
                  }
                  style={{ width: "100%" }}
                  viewOnly={viewOnly}
                >
                  <InfoRow
                    infoTitle={relic.name}
                    infoContent={
                      <FormattedDescription description={relic.description} />
                    }
                  >
                    {relic.name}
                  </InfoRow>
                </SelectableRow>
                <FactionCircle
                  borderColor={factionColors[owner]}
                  factionId={owner}
                  size={24}
                />
              </div>
            );
          })}
        </OptionalLine>
        <OptionalLine
          label={
            <FormattedMessage
              id="WkNCwM"
              defaultMessage="Unowned {count, plural, one {Relic} other {Relics}}"
              description="Relics which are not owned by anyone."
              values={{ count: 2 }}
            />
          }
        >
          {unownedRelics.map((relic) => {
            return (
              <div
                key={relic.id}
                className="flexRow"
                style={{
                  width: "100%",
                  padding: `0 ${rem(8)}`,
                  justifyContent: "space-between",
                }}
              >
                <InfoRow
                  infoTitle={relic.name}
                  infoContent={
                    <FormattedDescription description={relic.description} />
                  }
                >
                  {relic.name}
                </InfoRow>
                <FactionSelectRadialMenu
                  factions={mapOrderedFactionIds}
                  onSelect={(factionId, prevFaction) => {
                    if (factionId) {
                      dataUpdate(Events.GainRelicEvent(factionId, relic.id));
                    }
                    if (prevFaction) {
                      dataUpdate(Events.LoseRelicEvent(prevFaction, relic.id));
                    }
                  }}
                  selectedFaction={relic.owner}
                  size={24}
                  viewOnly={viewOnly}
                />
              </div>
            );
          })}
        </OptionalLine>
        <OptionalLine label="Purged Relics">
          {purgedRelics.length > 0 ? (
            <>
              {purgedRelics.map((relic) => {
                const owner = relic.owner as FactionId;
                return (
                  <div
                    key={relic.id}
                    className="flexRow"
                    style={{
                      width: "100%",
                      padding: `0 ${rem(8)}`,
                    }}
                  >
                    <SelectableRow
                      itemId={relic.id}
                      removeItem={() =>
                        // TODO: Replace with just updating the state.
                        unplayComponent(relic.id, owner)
                      }
                      style={{ width: "100%" }}
                      viewOnly={viewOnly}
                    >
                      <InfoRow
                        infoTitle={relic.name}
                        infoContent={
                          <FormattedDescription
                            description={relic.description}
                          />
                        }
                      >
                        {relic.name}
                      </InfoRow>
                    </SelectableRow>
                  </div>
                );
              })}
            </>
          ) : null}
        </OptionalLine>
      </div>
    </CollapsibleSection>
  );
}

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}
interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

function PromissoriesSection() {
  const dataUpdate = useDataUpdate();
  const factions = useFactions();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const options = useOptions();
  const viewOnly = useViewOnly();
  const intl = useIntl();
  const baseFactions = getFactions(intl);

  const omegaMergeFn = buildMergeFunction(options.expansions);
  const updatedBaseFactions = Object.values(baseFactions)
    .filter((faction) => {
      if (factions.Obsidian && faction.id === "Firmament") {
        return false;
      }
      if (factions.Firmament && faction.id === "Obsidian") {
        return false;
      }
      return (
        (faction.expansion === "BASE" ||
          options.expansions.includes(faction.expansion)) &&
        !factions[faction.id] &&
        faction.id !== "Mahact Gene-Sorcerers"
      );
    })
    .map((faction) => {
      const updatedFaction = omegaMergeFn(faction);
      if (updatedFaction.abilities) {
        updatedFaction.abilities = updatedFaction.abilities.map(omegaMergeFn);
      }
      if (updatedFaction.promissories) {
        updatedFaction.promissories =
          updatedFaction.promissories.map(omegaMergeFn);
      }
      updatedFaction.units = updatedFaction.units.map(omegaMergeFn);
      return updatedFaction;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const supportForTheThrone = useObjective("Support for the Throne");
  if (!supportForTheThrone) {
    return null;
  }

  const showYinBreakthroughs =
    factions["Yin Brotherhood"]?.breakthrough?.state === "readied";

  const numColumns =
    mapOrderedFactionIds.length > 4
      ? Math.ceil(mapOrderedFactionIds.length / 2)
      : mapOrderedFactionIds.length;

  return (
    <CollapsibleSection
      title={
        <div
          className="flexRow"
          style={{ justifyContent: "center", gap: rem(6) }}
        >
          <div className="flexRow" style={{ width: rem(18) }}>
            <PromissoryMenuSVG />
          </div>
          <FormattedMessage
            id="CH11Yw"
            description="The title of promissory notes."
            defaultMessage="Promissories"
          />
          <div className="flexRow" style={{ width: rem(18) }}>
            <PromissoryMenuSVG />
          </div>
        </div>
      }
      style={{
        height: "fit-content",
        gridArea: "right",
        padding: `${rem(8)}`,
        paddingTop: 0,
      }}
    >
      <div className="flexColumn">
        <LabeledLine
          leftLabel={
            <FormattedMessage
              id="Objectives.Support for the Throne.Title"
              description="Title of Objective: Support for the Throne"
              defaultMessage="Support for the Throne"
            />
          }
        />
        <div
          className="flexColumn"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
            gridAutoFlow: "row",
            width: "100%",
            justifyContent: "space-evenly",
            padding: `0 ${rem(24)}`,
          }}
        >
          {mapOrderedFactionIds.map((factionId) => {
            const supportHolder = getSupportScorer(
              factionId,
              supportForTheThrone,
            );
            return (
              <div
                key={factionId}
                className="flexRow"
                style={{
                  width: "100%",
                }}
              >
                <FactionSelectRadialMenu
                  factions={mapOrderedFactionIds}
                  invalidFactions={[factionId]}
                  onSelect={(newFaction, prevFaction) => {
                    if (newFaction) {
                      dataUpdate(
                        Events.ScoreObjectiveEvent(
                          newFaction,
                          "Support for the Throne",
                          factionId,
                        ),
                      );
                    }
                    if (prevFaction) {
                      dataUpdate(
                        Events.UnscoreObjectiveEvent(
                          prevFaction,
                          "Support for the Throne",
                          factionId,
                        ),
                      );
                    }
                  }}
                  selectedFaction={supportHolder}
                  borderColor={getFactionColor(
                    supportHolder ? factions[supportHolder] : undefined,
                  )}
                  tag={<FactionIcon factionId={factionId} size="100%" />}
                  tagBorderColor={getFactionColor(factions[factionId])}
                  // size={24}
                  viewOnly={viewOnly}
                />
              </div>
            );
          })}
        </div>
        <LabeledLine
          leftLabel={
            <FormattedMessage
              id="Promissories.Alliance.Title"
              defaultMessage="{count, plural, one {Alliance} other {Alliances}}"
              description="Title of Promissory: Alliance"
              values={{ count: 1 }}
            />
          }
        />
        <div className="flexColumn" style={{ gap: rem(12), width: "100%" }}>
          <div
            className="flexColumn"
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${numColumns}, 1fr)`,
              gridAutoFlow: "row",
              width: "100%",
              justifyContent: "space-evenly",
              padding: `0 ${rem(24)}`,
            }}
          >
            {mapOrderedFactionIds.map((factionId) => {
              const disabled = factionId === "Mahact Gene-Sorcerers";
              const owner = Object.values(factions).reduce(
                (owner: Optional<FactionId>, faction) => {
                  if (faction.id === "Mahact Gene-Sorcerers") {
                    return owner;
                  }
                  const alliances = faction.alliances ?? [];
                  if (alliances.includes(factionId)) {
                    return faction.id;
                  }
                  return owner;
                },
                undefined,
              );
              return (
                <div
                  key={factionId}
                  className="flexRow"
                  style={{
                    width: "100%",
                  }}
                >
                  <FactionSelectRadialMenu
                    factions={mapOrderedFactionIds}
                    invalidFactions={[factionId, "Mahact Gene-Sorcerers"]}
                    disabled={disabled}
                    onSelect={(newFaction, prevFaction) => {
                      if (newFaction) {
                        dataUpdate(
                          Events.GainAllianceEvent(newFaction, factionId),
                        );
                      } else if (prevFaction) {
                        dataUpdate(
                          Events.LoseAllianceEvent(prevFaction, factionId),
                        );
                      }
                    }}
                    selectedFaction={owner}
                    borderColor={
                      disabled
                        ? "#555"
                        : getFactionColor(owner ? factions[owner] : undefined)
                    }
                    tag={<FactionIcon factionId={factionId} size="100%" />}
                    tagBorderColor={getFactionColor(factions[factionId])}
                    // size={24}
                    viewOnly={viewOnly}
                  />
                </div>
              );
            })}
          </div>
          {mapOrderedFactionIds.includes("Mahact Gene-Sorcerers") ? (
            <LabeledDiv
              label={
                <div
                  className="flexRow"
                  style={{ fontSize: rem(16), gap: rem(4) }}
                >
                  <FactionIcon factionId="Mahact Gene-Sorcerers" size={16} />
                  <FormattedMessage
                    id="LkSYQA"
                    defaultMessage="Fleet Pool Tokens"
                    description="Tokens that determine how many non-fighter ships can be in a system."
                  />
                </div>
              }
            >
              <div
                className={styles.factionIconRow}
                style={
                  {
                    "--num-factions": mapOrderedFactionIds.length - 1,
                  } as NumFactionsCSS
                }
              >
                {mapOrderedFactionIds.map((factionId) => {
                  if (factionId === "Mahact Gene-Sorcerers") {
                    return null;
                  }
                  const selected = (
                    factions["Mahact Gene-Sorcerers"]?.alliances ?? []
                  ).includes(factionId);
                  return (
                    <div
                      key={factionId}
                      className={`flexRow ${styles.selected} ${
                        styles.factionIconWrapper
                      } ${viewOnly ? styles.viewOnly : ""}`}
                      onClick={
                        viewOnly
                          ? undefined
                          : () => {
                              if (selected) {
                                dataUpdate(
                                  Events.LoseAllianceEvent(
                                    "Mahact Gene-Sorcerers",
                                    factionId,
                                  ),
                                );
                              } else {
                                dataUpdate(
                                  Events.GainAllianceEvent(
                                    "Mahact Gene-Sorcerers",
                                    factionId,
                                  ),
                                );
                              }
                            }
                      }
                    >
                      <div
                        className={`
                  ${styles.factionIcon} ${selected ? styles.selected : ""} ${
                    viewOnly ? styles.viewOnly : ""
                  }`}
                        style={
                          {
                            "--color": getFactionColor(factions[factionId]),
                          } as ExtendedCSS
                        }
                      >
                        <FactionIcon factionId={factionId} size="100%" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </LabeledDiv>
          ) : null}
          {showYinBreakthroughs ? (
            <LabeledDiv
              label={
                <div
                  className="flexRow"
                  style={{ fontSize: rem(16), gap: rem(4) }}
                >
                  <FactionIcon factionId="Yin Brotherhood" size={16} />
                  <FormattedMessage
                    id="Promissories.Alliance.Title"
                    defaultMessage="{count, plural, one {Alliance} other {Alliances}}"
                    description="Title of Promissory: Alliance"
                    values={{ count: 2 }}
                  />
                </div>
              }
            >
              <div
                className={styles.factionIconRow}
                style={
                  {
                    "--num-factions": 8,
                  } as NumFactionsCSS
                }
              >
                {updatedBaseFactions.map((faction) => {
                  const selected = (
                    factions["Yin Brotherhood"]?.alliances ?? []
                  ).includes(faction.id);
                  return (
                    <div
                      key={faction.id}
                      className={`flexRow ${styles.selected} ${
                        styles.factionIconWrapper
                      } ${viewOnly ? styles.viewOnly : ""}`}
                      onClick={
                        viewOnly
                          ? undefined
                          : () => {
                              if (selected) {
                                dataUpdate(
                                  Events.LoseAllianceEvent(
                                    "Yin Brotherhood",
                                    faction.id,
                                  ),
                                );
                              } else {
                                dataUpdate(
                                  Events.GainAllianceEvent(
                                    "Yin Brotherhood",
                                    faction.id,
                                  ),
                                );
                              }
                            }
                      }
                    >
                      <div
                        className={`
                  ${styles.factionIcon} ${selected ? styles.selected : ""} ${
                    viewOnly ? styles.viewOnly : ""
                  }`}
                      >
                        <FactionIcon factionId={faction.id} size="100%" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </LabeledDiv>
          ) : null}
        </div>
        <OptionalLine label="Other"></OptionalLine>
      </div>
    </CollapsibleSection>
  );
}
