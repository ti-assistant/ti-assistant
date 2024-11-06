import { Fragment, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { CollapsibleSection } from "../../../src/components/CollapsibleSection";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import GenericModal from "../../../src/components/GenericModal/GenericModal";
import { objectiveTypeString } from "../../../src/util/strings";
import { Optional } from "../../../src/util/types/types";
import { rem } from "../../../src/util/util";
import styles from "./FactionModal.module.scss";
import { FactionSummary, GameCounts, ObjectiveGameCounts } from "./types";
import Chip from "../../../src/components/Chip/Chip";

export default function FactionModal({
  baseData,
  closeFn,
  faction,
  info,
}: {
  baseData: BaseData;
  closeFn: () => void;
  faction: Optional<FactionId>;
  info: Optional<FactionSummary>;
}) {
  const intl = useIntl();
  const [objectiveType, setObjectiveType] =
    useState<ObjectiveType>("STAGE ONE");

  const id = info?.id ?? "Vuil'raith Cabal";
  const name = info?.name ?? "Vuil'raith Cabal";

  return (
    <GenericModal visible={!!faction} closeMenu={closeFn}>
      <div
        className="flexColumn"
        style={{
          whiteSpace: "normal",
          textShadow: "none",
          width: `clamp(80vw, ${rem(1200)}, calc(100vw - ${rem(24)}))`,
          justifyContent: "flex-start",
          height: `calc(100dvh - ${rem(24)})`,
        }}
      >
        <div
          className="flexRow centered extraLargeFont"
          style={{
            backgroundColor: "var(--background-color)",
            padding: `${rem(4)} ${rem(8)}`,
            borderRadius: rem(4),
            border: "1px solid var(--neutral-border)",
          }}
        >
          <FactionIcon factionId={id} size={36} />
          {name}
          <FactionIcon factionId={id} size={36} />
        </div>
        <div
          className="flexColumn largeFont"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: `clamp(80vw, ${rem(1200)}, calc(100vw - ${rem(24)}))`,
            justifyContent: "flex-start",
            overflow: "auto",
            height: "fit-content",
          }}
        >
          <div className={styles.FactionModal}>
            <CollapsibleSection
              openedByDefault
              title={
                <div
                  className="flexRow"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    gap: rem(4),
                  }}
                >
                  <FormattedMessage
                    id="5Bl4Ek"
                    description="Cards that define how to score victory points."
                    defaultMessage="Objectives"
                  />
                  <Chip
                    fontSize={10}
                    selected={objectiveType === "STAGE ONE"}
                    toggleFn={() => {
                      setObjectiveType("STAGE ONE");
                    }}
                  >
                    {objectiveTypeString("STAGE ONE", intl)}
                  </Chip>
                  <Chip
                    fontSize={10}
                    selected={objectiveType === "STAGE TWO"}
                    toggleFn={() => {
                      setObjectiveType("STAGE TWO");
                    }}
                  >
                    {objectiveTypeString("STAGE TWO", intl)}
                  </Chip>
                  <Chip
                    fontSize={10}
                    selected={objectiveType === "OTHER"}
                    toggleFn={() => {
                      setObjectiveType("OTHER");
                    }}
                  >
                    {objectiveTypeString("OTHER", intl)}
                  </Chip>
                </div>
              }
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  gap: rem(4),
                  padding: `0 ${rem(4)} ${rem(4)}`,
                  fontSize: rem(14),
                }}
              >
                {info ? (
                  <ObjectiveTable
                    objectives={info.objectives}
                    objectiveGames={info.objectiveGames.games}
                    objectiveType={objectiveType}
                    baseData={baseData}
                  />
                ) : null}
              </div>
            </CollapsibleSection>
            <CollapsibleSection
              title={
                <div
                  className="flexRow"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FormattedMessage
                    id="ys7uwX"
                    description="Shortened version of technologies."
                    defaultMessage="Techs"
                  />
                </div>
              }
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  gap: rem(4),
                  padding: `0 ${rem(4)} ${rem(4)}`,
                  fontSize: rem(14),
                }}
              >
                {info ? (
                  <TechTable
                    techs={info.techs}
                    techGames={info.techGames.games}
                    techWins={info.techGames.wins}
                    techPoints={info.techGames.points}
                    baseData={baseData}
                  />
                ) : null}
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </GenericModal>
  );
}

function ObjectiveTable({
  objectives,
  objectiveGames,
  objectiveType,
  baseData,
}: {
  objectives: Record<string, ObjectiveGameCounts>;
  objectiveGames: number;
  objectiveType: ObjectiveType;
  baseData: BaseData;
}) {
  const intl = useIntl();
  const baseObjectives = baseData.objectives;
  const orderedObjectives = Object.entries(objectives).sort((a, b) => {
    const aType = baseObjectives[a[0] as ObjectiveId].type;
    const bType = baseObjectives[b[0] as ObjectiveId].type;
    const aGames =
      aType === "STAGE ONE" || aType === "STAGE TWO"
        ? a[1].games
        : objectiveGames;
    const bGames =
      bType === "STAGE ONE" || bType === "STAGE TWO"
        ? b[1].games
        : objectiveGames;
    const aRatio = a[1].scored / aGames;
    const bRatio = b[1].scored / bGames;
    if (aRatio === bRatio) {
      return bGames - aGames;
    }
    return bRatio - aRatio;
  });
  const filteredObjectives = orderedObjectives.filter(([id, info]) => {
    const type = baseObjectives[id as ObjectiveId].type;
    return type === objectiveType && info.games >= 2;
  });

  if (objectiveType === "OTHER") {
    const custodians = objectives["Custodians Token"];
    const imperialPoints = objectives["Imperial Point"];

    return (
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        {custodians ? (
          <>
            <div>
              <FormattedMessage
                id="etE9Xc"
                defaultMessage="Custodians Token taken in {perc}% of games ({count} of {games})"
                description="Text for a stat about the number of times a faction claimed the custodians token."
                values={{
                  perc:
                    Math.round(
                      ((1.0 * custodians.scored) / objectiveGames) * 10000
                    ) / 100,
                  count: custodians.scored,
                  games: objectiveGames,
                }}
              />
            </div>
            <div>
              <FormattedMessage
                id="hicVw5"
                defaultMessage="Win Rate with Custodians Token: {perc}% ({count} of {games})"
                description="Text for a stat about the number of times a faction won with the custodians token."
                values={{
                  perc:
                    custodians.scored === 0
                      ? 0
                      : Math.round(
                          ((1.0 * custodians.wins) / custodians.scored) * 10000
                        ) / 100,
                  count: custodians.wins,
                  games: custodians.scored,
                }}
              />
            </div>
          </>
        ) : null}
        {imperialPoints ? (
          <div>
            <FormattedMessage
              id="CaHUOS"
              defaultMessage="Imperial Points per game: {perc}% ({count} of {games})"
              description="Text for a stat about the average number of imperial points per game."
              values={{
                perc:
                  Math.round(
                    ((1.0 * imperialPoints.scored) / objectiveGames) * 100
                  ) / 100,
                count: imperialPoints.scored,
                games: objectiveGames,
              }}
            />
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <table style={{ fontSize: rem(12), width: "100%", borderSpacing: "0" }}>
      <tbody>
        {filteredObjectives.map(([objective, info]) => {
          const type = baseObjectives[objective as ObjectiveId].type;
          const games =
            type === "STAGE ONE" || type === "STAGE TWO"
              ? info.games
              : objectiveGames;

          if (games < 2) {
            return null;
          }
          const baseObj = baseObjectives[objective as ObjectiveId];
          return (
            <tr key={objective} style={{ fontFamily: "Source Sans" }}>
              <td
                className="flexColumn"
                style={{
                  alignItems: "flex-start",
                  gap: 0,
                }}
              >
                <div>{baseObj.name}</div>
                <div style={{ fontFamily: "Source Sans", fontSize: rem(10) }}>
                  {baseObj.description}
                </div>
              </td>
              <td>
                {Math.floor(((1.0 * info.scored) / games) * 10000) / 100}% (
                {info.scored} of {games})
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

function TechTable({
  techs,
  techGames,
  techWins,
  techPoints,
  baseData,
}: {
  techs: Record<string, GameCounts>;
  techGames: number;
  techWins: number;
  techPoints: number;
  baseData: BaseData;
}) {
  const orderedTechs = Object.entries(techs).sort((a, b) => {
    return b[1].games - a[1].games;
  });
  return (
    <table style={{ fontSize: rem(12), width: "100%" }}>
      <thead style={{ textAlign: "left", fontSize: rem(14) }}>
        <tr style={{ textAlign: "left" }}>
          <th colSpan={2}></th>
          <th colSpan={2} style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="8ntyP0"
              defaultMessage="Win Rate"
              description="Label for a section describing the win rate."
            />
          </th>
          <th colSpan={2} style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="+zFNH+"
              defaultMessage="Average VPs"
              description="Label for a section describing the average number of VPs."
            />
          </th>
        </tr>
        <tr>
          <th></th>
          <th style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="+kc61r"
              defaultMessage="Research Rate"
              description="Label for a section describing the percentage that a tech was researched."
            />
          </th>
          <th style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="Qo4+d0"
              defaultMessage="w/ Tech"
              description="Label for a section for a stat with a tech."
            />
          </th>
          <th style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="AB4nOe"
              defaultMessage="w/o Tech"
              description="Label for a section for a stat without a tech."
            />
          </th>
          <th style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="Qo4+d0"
              defaultMessage="w/ Tech"
              description="Label for a section for a stat with a tech."
            />
          </th>
          <th style={{ fontWeight: "normal" }}>
            <FormattedMessage
              id="AB4nOe"
              defaultMessage="w/o Tech"
              description="Label for a section for a stat without a tech."
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {orderedTechs.map(([tech, info]) => {
          const baseTech = baseData.techs[tech as TechId];
          if (!baseTech) {
            return null;
          }
          return (
            <Fragment key={tech}>
              <tr key={tech} style={{ fontFamily: "Source Sans" }}>
                <td>{baseTech.name}</td>
                <td>
                  {Math.floor(((1.0 * info.games) / techGames) * 10000) / 100}%
                  ({info.games} of {techGames})
                </td>
                {info.games < 3 ? (
                  <td style={{ fontSize: rem(10), fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(((1.0 * info.wins) / info.games) * 10000) / 100}
                    %
                  </td>
                )}
                {techGames - info.games < 3 ? (
                  <td style={{ fontSize: rem(10), fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(
                      ((1.0 * (techWins - info.wins)) /
                        (techGames - info.games)) *
                        10000
                    ) / 100}
                    %
                  </td>
                )}
                {info.games < 3 ? (
                  <td style={{ fontSize: rem(10), fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(((1.0 * info.points) / info.games) * 100) / 100}
                  </td>
                )}
                {techGames - info.games < 3 ? (
                  <td style={{ fontSize: rem(10), fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(
                      ((1.0 * (techPoints - info.points)) /
                        (techGames - info.games)) *
                        100
                    ) / 100}
                  </td>
                )}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
