import { Fragment, useState } from "react";
import { useIntl } from "react-intl";
import { CollapsibleSection } from "../../../src/components/CollapsibleSection";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import GenericModal from "../../../src/components/GenericModal/GenericModal";
import { Optional } from "../../../src/util/types/types";
import {
  FactionSummary,
  GameCounts,
  HistogramData,
  ObjectiveGameCounts,
} from "./types";
import styles from "./FactionModal.module.scss";

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
          width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
          justifyContent: "flex-start",
          height: `calc(100dvh - 24px)`,
        }}
      >
        <div
          className="flexRow centered extraLargeFont"
          style={{
            backgroundColor: "#222",
            padding: `4px 8px`,
            borderRadius: "4px",
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
            width: `clamp(80vw, 1200px, calc(100vw - 24px))`,
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
                  }}
                >
                  Objectives
                  <button
                    style={{ fontSize: "10px" }}
                    className={objectiveType === "STAGE ONE" ? "selected" : ""}
                    onClick={(event) => {
                      setObjectiveType("STAGE ONE");
                      event.preventDefault();
                    }}
                  >
                    Stage I
                  </button>
                  <button
                    style={{ fontSize: "10px" }}
                    className={objectiveType === "STAGE TWO" ? "selected" : ""}
                    onClick={(event) => {
                      setObjectiveType("STAGE TWO");
                      event.preventDefault();
                    }}
                  >
                    Stage II
                  </button>
                  <button
                    style={{ fontSize: "10px" }}
                    className={objectiveType === "OTHER" ? "selected" : ""}
                    onClick={(event) => {
                      setObjectiveType("OTHER");
                      event.preventDefault();
                    }}
                  >
                    Other
                  </button>
                </div>
              }
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  gap: "4px",
                  padding: `0 4px 4px`,
                  fontSize: "14px",
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
                  Techs
                </div>
              }
            >
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  gap: "4px",
                  padding: `0 4px 4px`,
                  fontSize: "14px",
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
          {/* <FactionPanelContent faction={faction} options={options} /> */}
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
  // const stageTwoObjectives = orderedObjectives.filter(
  //   ([_, info]) => info.type === "STAGE TWO" && info.games >= 2
  // );

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
              Custodians Token taken in{" "}
              {Math.floor(
                ((1.0 * custodians.scored) / objectiveGames) * 10000
              ) / 100}
              % of games ({custodians.scored} of {objectiveGames})
            </div>
            <div>
              Win % with Custodians Token:{" "}
              {custodians.scored === 0
                ? 0
                : Math.floor(
                    ((1.0 * custodians.wins) / custodians.scored) * 10000
                  ) / 100}
              % ({custodians.wins} of {custodians.scored})
            </div>
          </>
        ) : null}
        {imperialPoints ? (
          <div>
            Imperial Points per game:{" "}
            {Math.floor(
              ((1.0 * imperialPoints.scored) / objectiveGames) * 100
            ) / 100}{" "}
            per game ({imperialPoints.scored} in {objectiveGames})
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <table style={{ fontSize: "12px", width: "100%", borderSpacing: "0" }}>
      <tbody>
        {/* {stageOneObjectives.length > 0 ? (
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              STAGE I
            </td>
          </tr>
        ) : null} */}
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
                <div style={{ fontFamily: "Source Sans", fontSize: "10px" }}>
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
        {/* {stageTwoObjectives.length > 0 ? (
          <tr>
            <td style={{ textAlign: "center" }} colSpan={2}>
              STAGE II
            </td>
          </tr>
        ) : null} */}
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
    <table style={{ fontSize: "12px", width: "100%" }}>
      <thead style={{ textAlign: "left", fontSize: "14px" }}>
        <tr>
          <th style={{ fontWeight: "normal" }}></th>
          <th style={{ fontWeight: "normal" }}>Research %</th>
          <th style={{ fontWeight: "normal" }}>Win % w/</th>
          <th style={{ fontWeight: "normal" }}>Win % w/o</th>
          <th style={{ fontWeight: "normal" }}>Points w/</th>
          <th style={{ fontWeight: "normal" }}>Points w/o</th>
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
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(((1.0 * info.wins) / info.games) * 10000) / 100}
                    % ({info.wins} of {info.games})
                  </td>
                )}
                {techGames - info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(
                      ((1.0 * (techWins - info.wins)) /
                        (techGames - info.games)) *
                        10000
                    ) / 100}
                    % ({techWins - info.wins} of {techGames - info.games})
                  </td>
                )}
                {info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
                    -
                  </td>
                ) : (
                  <td>
                    {Math.floor(((1.0 * info.points) / info.games) * 100) / 100}
                  </td>
                )}
                {techGames - info.games < 3 ? (
                  <td style={{ fontSize: "10px", fontFamily: "Source Sans" }}>
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
