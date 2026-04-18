import { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { useOptions, useViewOnly } from "../../../context/dataHooks";
import { useAllFactionColors } from "../../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../../context/gameDataHooks";
import { useObjective } from "../../../context/objectiveDataHooks";
import RelicMenuSVG from "../../../icons/ui/RelicMenu";
import { useDataUpdate } from "../../../util/api/dataUpdate";
import { Events } from "../../../util/api/events";
import { Optional } from "../../../util/types/types";
import { rem } from "../../../util/util";
import Card from "../../Card/Card";
import Chip from "../../Chip/Chip";
import ChipGroup from "../../Chip/ChipGroup";
import FactionComponents from "../../FactionComponents/FactionComponents";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../../LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../ObjectiveRow/ObjectiveRow";
import styles from "../ObjectivePanel.module.scss";
import CustodiansToken from "./CustodiansToken";
import ScorableFactionIcon from "./ScorableFactionIcon";
import SimpleScorable from "./SimpleScorable";
import Styx from "./Styx";
import PromissoryMenuSVG from "../../../icons/ui/PromissoryMenu";

export default function OtherObjectivesGrid() {
  const orderedFactionIds = useOrderedFactionIds("MAP");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
        gap: rem(8),
        paddingBottom: rem(4),
        width: "100%",
      }}
    >
      <PlanetObjectives orderedFactionIds={orderedFactionIds} />
      <SupportForTheThrone orderedFactionIds={orderedFactionIds} />
      <ImperialPoints orderedFactionIds={orderedFactionIds} />
      <OtherObjectives orderedFactionIds={orderedFactionIds} />
      <RelicObjectives orderedFactionIds={orderedFactionIds} />
      <LawObjectives orderedFactionIds={orderedFactionIds} />
      <DirectiveObjectives orderedFactionIds={orderedFactionIds} />
      <TotalWar orderedFactionIds={orderedFactionIds} />
    </div>
  );
}

function PlanetObjectives({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  return (
    <div
      className="flexRow"
      style={{ gridColumn: "1 / 3", width: "100%", height: "100%" }}
    >
      <CustodiansToken />
      <Styx />
    </div>
  );
}

function SupportForTheThrone({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const dataUpdate = useDataUpdate();
  const supportForTheThrone = useObjective("Support for the Throne");
  const factionColors = useAllFactionColors();
  const viewOnly = useViewOnly();

  if (!supportForTheThrone) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="Objectives.Support for the Throne.Title"
          description="Title of Objective: Support for the Throne"
          defaultMessage="Support for the Throne"
        />
      }
      icon={
        <div style={{ width: "1.25em", height: "1em", position: "relative" }}>
          <PromissoryMenuSVG color="var(--muted-text)" />
        </div>
      }
      style={{ gridColumn: "3 / 9" }}
    >
      <div
        className="flexRow"
        style={{
          justifyContent: "space-evenly",
          width: "100%",
          height: "100%",
          alignItems: "center",
        }}
      >
        {orderedFactionIds.map((factionId) => {
          const scorers =
            (supportForTheThrone?.keyedScorers ?? {})[factionId] ?? [];
          const scorer = scorers[0] as Optional<FactionId>;
          return (
            <div
              key={factionId}
              className="flexColumn"
              style={{
                position: "relative",
                width: "fit-content",
                height: "100%",
              }}
            >
              <FactionSelectRadialMenu
                key={factionId}
                factions={orderedFactionIds}
                invalidFactions={orderedFactionIds.filter((destFactionId) => {
                  return destFactionId === factionId;
                })}
                selectedFaction={scorer}
                onSelect={(selectedFactionId) => {
                  if (scorer) {
                    dataUpdate(
                      Events.UnscoreObjectiveEvent(
                        scorer,
                        "Support for the Throne",
                        factionId,
                      ),
                    );
                  }
                  if (selectedFactionId) {
                    dataUpdate(
                      Events.ScoreObjectiveEvent(
                        selectedFactionId,
                        "Support for the Throne",
                        factionId,
                      ),
                    );
                  }
                }}
                tag={
                  <FactionComponents.Icon factionId={factionId} size="100%" />
                }
                tagBorderColor={factionColors[factionId]?.border}
                borderColor={scorer ? factionColors[scorer]?.border : undefined}
                viewOnly={viewOnly}
              />
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ImperialPoints({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const dataUpdate = useDataUpdate();
  const imperialPoint = useObjective("Imperial Point");
  const options = useOptions();
  const viewOnly = useViewOnly();

  return (
    <Card
      label={
        options.expansions.includes("TWILIGHTS FALL") ? (
          <FormattedMessage
            id="Xf1B6k"
            description="The title of points granted from using Aeterna."
            defaultMessage="Aeterna Points"
          />
        ) : (
          <FormattedMessage
            id="eGEjSH"
            description="The title of points granted from using Imperial."
            defaultMessage="Imperial Points"
          />
        )
      }
      style={{ gridColumn: "9 / 13" }}
    >
      <div className="flexRow" style={{ width: "100%", height: "100%" }}>
        {orderedFactionIds.map((faction) => {
          const imperialPoints = (imperialPoint?.scorers ?? []).filter(
            (name) => name === faction,
          ).length;
          return (
            <div
              key={faction}
              className="flexRow hiddenButtonParent"
              style={{
                position: "relative",
                width: rem(36),
                height: rem(36),
              }}
            >
              {!viewOnly && imperialPoints > 0 ? (
                <div
                  className="hiddenButton flexRow"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: rem(-4),
                    fontWeight: "bold",
                    height: rem(16),
                    width: rem(16),
                    borderRadius: "100%",
                    fontSize: rem(12),
                    backgroundColor: "var(--interactive-bg)",
                    boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    if (viewOnly) {
                      return;
                    }
                    dataUpdate(
                      Events.UnscoreObjectiveEvent(faction, "Imperial Point"),
                    );
                  }}
                >
                  -
                </div>
              ) : null}
              {viewOnly ? null : (
                <div
                  className="hiddenButton flexRow"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: rem(-4),
                    // border: `${"1px"} solid #333`,
                    fontWeight: "bold",
                    borderRadius: "100%",
                    height: rem(16),
                    width: rem(16),
                    fontSize: rem(12),
                    backgroundColor: "var(--interactive-bg)",
                    boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    if (viewOnly) {
                      return;
                    }
                    dataUpdate(
                      Events.ScoreObjectiveEvent(faction, "Imperial Point"),
                    );
                  }}
                >
                  +
                </div>
              )}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  opacity: imperialPoints === 0 ? 0.2 : undefined,
                }}
              >
                <FactionComponents.Icon factionId={faction} size="100%" />
                <div
                  className="flexRow"
                  style={{
                    position: "absolute",
                    backgroundColor: "var(--light-bg)",
                    borderRadius: "100%",
                    top: "45%",
                    left: "45%",
                    boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                    width: rem(24),
                    height: rem(24),
                    zIndex: 2,
                  }}
                >
                  {imperialPoints}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function OtherObjectives({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const options = useOptions();

  const zealousOrthodoxy = (options.events ?? []).includes("Zealous Orthodoxy");

  return (
    <div
      className="flexRow"
      style={{
        gridColumn: "1 / 3",
        fontSize: zealousOrthodoxy ? rem(12) : undefined,
      }}
    >
      {options.expansions.includes("TWILIGHTS FALL") ? (
        <SimpleScorable
          objectiveId="Unravel"
          orderedFactionIds={orderedFactionIds}
        />
      ) : (
        <SimpleScorable
          objectiveId="Imperial Rider"
          orderedFactionIds={orderedFactionIds}
        />
      )}
      {zealousOrthodoxy ? (
        <SimpleScorable
          objectiveId="Zealous Orthodoxy"
          orderedFactionIds={orderedFactionIds}
        />
      ) : null}
    </div>
  );
}

function RelicObjectives({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const options = useOptions();

  const includesPoK = options.expansions.includes("POK");
  const includesTE = options.expansions.includes("THUNDERS EDGE");

  if (!includesPoK && !includesTE) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="pPpzkR"
          description="The title of relic cards."
          defaultMessage="Relics"
        />
      }
      icon={
        <div style={{ width: "1.25em", height: "1.25em" }}>
          <RelicMenuSVG color="var(--muted-text)" />
        </div>
      }
      style={{
        width: "100%",
        height: "100%",
        gridColumn: includesPoK ? "3 / 6" : "3 / 5",
      }}
    >
      <div
        className="flexRow"
        style={{
          height: "100%",
          gap: 0,
          width: "100%",
          alignItems: "flex-start",
          fontSize: rem(12),
        }}
      >
        {includesPoK ? (
          <>
            <SimpleScorable
              objectiveId="Shard of the Throne"
              orderedFactionIds={orderedFactionIds}
            />
            <SimpleScorable
              objectiveId="Tomb + Crown of Emphidia"
              orderedFactionIds={orderedFactionIds}
            />
          </>
        ) : null}
        <SimpleScorable
          objectiveId="Book of Latvinia"
          orderedFactionIds={orderedFactionIds}
        />
        <SimpleScorable
          objectiveId="The Silver Flame"
          orderedFactionIds={orderedFactionIds}
        />
      </div>
    </Card>
  );
}

function LawObjectives({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const options = useOptions();

  const includesPoK = options.expansions.includes("POK");
  const includesTE = options.expansions.includes("THUNDERS EDGE");

  if (options.expansions.includes("TWILIGHTS FALL")) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="hMWeZX"
          description="Agendas that apply a continuing effect to the game."
          defaultMessage="Laws"
        />
      }
      style={{
        gridColumn: includesPoK ? "6/8" : includesTE ? "5/8" : "3/8",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        className="flexRow"
        style={{
          width: "100%",
          fontSize: !includesPoK ? rem(12) : undefined,
        }}
      >
        <SimpleScorable
          objectiveId="Holy Planet of Ixth"
          orderedFactionIds={orderedFactionIds}
        />
        {!includesPoK ? (
          <SimpleScorable
            objectiveId="Shard of the Throne"
            orderedFactionIds={orderedFactionIds}
          />
        ) : null}
        <SimpleScorable
          objectiveId="The Crown of Emphidia"
          orderedFactionIds={orderedFactionIds}
        />
        <SimpleScorable
          objectiveId="Political Censure"
          orderedFactionIds={orderedFactionIds}
        />
      </div>
    </Card>
  );
}

function DirectiveObjectives({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const options = useOptions();

  const totalWar = (options.events ?? []).includes("Total War");

  if (options.expansions.includes("TWILIGHTS FALL")) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="t6v2oN"
          description="Agenda cards that do not have an ongoing effect."
          defaultMessage="{count, plural, one {Directive} other {Directives}}"
          values={{ count: 2 }}
        />
      }
      style={{
        gridColumn: totalWar ? "8 / 11" : " 8 / 13",
        width: "100%",
        height: "100%",
      }}
    >
      <Mutiny orderedFactionIds={orderedFactionIds} />
      <SeedOfAnEmpire orderedFactionIds={orderedFactionIds} />
    </Card>
  );
}

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

function Mutiny({ orderedFactionIds }: { orderedFactionIds: FactionId[] }) {
  const dataUpdate = useDataUpdate();
  const intl = useIntl();
  const mutiny = useObjective("Mutiny");
  const viewOnly = useViewOnly();

  if (!mutiny) {
    return null;
  }

  const mutinyDirection = mutiny?.points === 1 ? "[For]" : "[Against]";

  return (
    <div
      className="flexColumn mediumFont"
      style={{
        width: "100%",
        gap: rem(2),
      }}
    >
      <div
        className="flexRow"
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: (mutiny.scorers ?? []).length === 0 ? 0.25 : undefined,
        }}
      >
        <ObjectiveRow objectiveId="Mutiny" />
        {viewOnly ? (
          mutinyDirection === "[For]" ? (
            `[${intl.formatMessage({
              id: "ymJxS0",
              defaultMessage: "For",
              description: "Outcome choosing to pass a law.",
            })}]`
          ) : (
            `[${intl.formatMessage({
              id: "SOC2Bh",
              defaultMessage: "Against",
              description: "Outcome choosing to vote down a law.",
            })}]`
          )
        ) : (
          <ChipGroup style={{ gap: rem(4) }}>
            <Chip
              selected={mutinyDirection === "[For]"}
              toggleFn={() =>
                dataUpdate(Events.SetObjectivePointsEvent("Mutiny", 1))
              }
            >
              [
              {intl.formatMessage({
                id: "ymJxS0",
                defaultMessage: "For",
                description: "Outcome choosing to pass a law.",
              })}
              ]
            </Chip>
            <Chip
              selected={mutinyDirection !== "[For]"}
              toggleFn={() =>
                dataUpdate(Events.SetObjectivePointsEvent("Mutiny", -1))
              }
            >
              [
              {intl.formatMessage({
                id: "SOC2Bh",
                defaultMessage: "Against",
                description: "Outcome choosing to vote down a law.",
              })}
              ]
            </Chip>
          </ChipGroup>
        )}
      </div>
      <div
        className={styles.factionIconRow}
        style={
          {
            "--num-factions": orderedFactionIds.length,
          } as NumFactionsCSS
        }
      >
        {Object.values(orderedFactionIds).map((factionId) => {
          return (
            <ScorableFactionIcon
              key={factionId}
              factionId={factionId}
              objective={mutiny}
            />
          );
        })}
      </div>
    </div>
  );
}

function SeedOfAnEmpire({
  orderedFactionIds,
}: {
  orderedFactionIds: FactionId[];
}) {
  const seed = useObjective("Seed of an Empire");

  if (!seed) {
    return null;
  }

  return (
    <div
      className="flexColumn mediumFont"
      style={{
        width: "100%",
        gap: rem(2),
      }}
    >
      <span
        style={{
          opacity: (seed.scorers ?? []).length === 0 ? 0.25 : undefined,
        }}
      >
        <ObjectiveRow objectiveId="Seed of an Empire" />
      </span>
      <div
        className={styles.factionIconRow}
        style={
          {
            "--num-factions": orderedFactionIds.length,
          } as NumFactionsCSS
        }
      >
        {Object.values(orderedFactionIds).map((factionId) => {
          return (
            <ScorableFactionIcon
              key={factionId}
              factionId={factionId}
              objective={seed}
            />
          );
        })}
      </div>
    </div>
  );
}

function TotalWar({ orderedFactionIds }: { orderedFactionIds: FactionId[] }) {
  const dataUpdate = useDataUpdate();
  const options = useOptions();
  const totalWarObjective = useObjective("Total War");
  const viewOnly = useViewOnly();

  const totalWar = (options.events ?? []).includes("Total War");

  if (!totalWar) {
    return null;
  }

  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="Events.Total War.Title"
          description="Title of Event: Total War"
          defaultMessage="Total War"
        />
      }
      style={{
        gridColumn: "11 / 13",
        width: "100%",
        height: "100%",
      }}
      innerStyle={{
        padding: 0,
      }}
    >
      <div
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: `repeat(${Math.ceil(
            orderedFactionIds.length / 2,
          )}, 1fr)`,
          alignItems: "center",
          justifyItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        {orderedFactionIds.map((faction) => {
          const totalWarPoints = (totalWarObjective?.scorers ?? []).filter(
            (name) => name === faction,
          ).length;
          return (
            <div
              key={faction}
              className="flexRow hiddenButtonParent"
              style={{
                position: "relative",
                width: rem(36),
                height: rem(36),
              }}
            >
              {!viewOnly && totalWarPoints > 0 ? (
                <div
                  className="hiddenButton flexRow"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: rem(-4),
                    fontWeight: "bold",
                    height: rem(16),
                    width: rem(16),
                    borderRadius: "100%",
                    fontSize: rem(12),
                    backgroundColor: "var(--interactive-bg)",
                    boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    if (viewOnly) {
                      return;
                    }
                    dataUpdate(
                      Events.UnscoreObjectiveEvent(faction, "Total War"),
                    );
                  }}
                >
                  -
                </div>
              ) : null}
              {viewOnly ? null : (
                <div
                  className="hiddenButton flexRow"
                  style={{
                    position: "absolute",
                    right: 0,
                    top: rem(-4),
                    // border: `${"1px"} solid #333`,
                    fontWeight: "bold",
                    borderRadius: "100%",
                    height: rem(16),
                    width: rem(16),
                    fontSize: rem(12),
                    backgroundColor: "var(--interactive-bg)",
                    boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                    cursor: "pointer",
                    zIndex: 2,
                  }}
                  onClick={() => {
                    if (viewOnly) {
                      return;
                    }
                    dataUpdate(
                      Events.ScoreObjectiveEvent(faction, "Total War"),
                    );
                  }}
                >
                  +
                </div>
              )}
              <FactionComponents.Icon factionId={faction} size="100%" />
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "var(--light-bg)",
                  borderRadius: "100%",
                  marginLeft: "60%",
                  marginTop: "60%",
                  boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                  width: rem(24),
                  height: rem(24),
                  zIndex: 2,
                }}
              >
                {totalWarPoints}
              </div>
            </div>
          );
        })}
      </div>
    </LabeledDiv>
  );
}
