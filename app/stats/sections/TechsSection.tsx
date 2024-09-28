import { useState } from "react";
import { CollapsibleSection } from "../../../src/components/CollapsibleSection";
import GenericModal from "../../../src/components/GenericModal/GenericModal";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import TechIcon from "../../../src/components/TechIcon/TechIcon";
import { Optional } from "../../../src/util/types/types";
import { objectEntries } from "../../../src/util/util";
import { ProcessedGame } from "../processor";
import { PointsHistogram } from "./Histogram";
import { HistogramData } from "./types";
import styles from "./TechsSection.module.scss";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";

interface FactionTechInfo {
  games: number;
  researched: number;
  wins: number;
  points: number;
}

export default function TechsSection({
  games,
  baseData,
  points,
}: {
  games: Record<string, ProcessedGame>;
  baseData: BaseData;
  points: number;
}) {
  const [tab, setTab] = useState("Non-Faction");
  const [shownModal, setShownModal] = useState<Optional<TechId>>();
  const techInfo: Partial<
    Record<
      TechId,
      {
        researchers: number;
        winners: number;
        owners: number;
        ownedWinners: number;
        histogram: HistogramData;
        ownedHistogram: HistogramData;
        factionInfo: Partial<Record<FactionId, FactionTechInfo>>;
      }
    >
  > = {};
  const baseTechs = baseData.techs;
  let techGames = 0;
  let factionGames: Partial<Record<FactionId, number>> = {};
  Object.values(games).forEach((game) => {
    const factions = game.factions;

    if (!game.isTechGame) {
      return;
    }
    techGames++;

    objectEntries(factions).forEach(([factionId, faction]) => {
      let factionGame = factionGames[factionId] ?? 0;
      factionGame++;
      factionGames[factionId] = factionGame;

      for (const techId of faction.endingTechs) {
        const baseTech = baseTechs[techId];

        if (!baseTech) {
          continue;
        }
        if (tab === "Non-Faction" && baseTech.faction) {
          continue;
        }
        if (tab === "Faction" && !baseTech.faction) {
          continue;
        }
        // Ignore Nekro for now
        if (baseTech.faction && factionId !== baseTech.faction) {
          continue;
        }
        let tech = techInfo[techId] ?? {
          winners: 0,
          researchers: 0,
          owners: 0,
          ownedWinners: 0,
          histogram: {},
          ownedHistogram: {},
          factionInfo: {},
        };
        const factionPoints = faction.points ?? 0;
        const info = tech.factionInfo[factionId] ?? {
          researched: 0,
          games: 0,
          wins: 0,
          points: 0,
        };
        if (faction.startingTechs.includes(techId)) {
          if (factionId === game.winner) {
            tech.ownedWinners++;
          }
          tech.owners++;
          let sum = tech.ownedHistogram[factionPoints] ?? 0;
          sum++;
          tech.ownedHistogram[factionPoints] = sum;
        } else {
          info.researched++;
          info.points += factionPoints;
          if (factionId === game.winner) {
            tech.ownedWinners++;
            tech.winners++;
            info.wins++;
          }
          let sum = tech.histogram[factionPoints] ?? 0;
          sum++;
          tech.histogram[factionPoints] = sum;
          let ownedSum = tech.ownedHistogram[factionPoints] ?? 0;
          ownedSum++;
          tech.ownedHistogram[factionPoints] = ownedSum;
          tech.researchers++;
          tech.owners++;
        }
        if (info.researched > 0) {
          tech.factionInfo[factionId] = info;
        }
        techInfo[techId] = tech;
      }
    });
  });

  const orderedInfo = objectEntries(techInfo).sort(([_, a], [__, b]) => {
    const aWinRate = (1.0 * a.winners) / a.researchers;
    const bWinRate = (1.0 * b.winners) / b.researchers;
    return bWinRate - aWinRate;
  });

  const modalTech = shownModal ? techInfo[shownModal] : undefined;

  return (
    <div className={styles.TechsSection}>
      <div className="flexRow">
        <button
          style={{ fontSize: "14px" }}
          className={tab === "Non-Faction" ? "selected" : ""}
          onClick={() => setTab("Non-Faction")}
        >
          Non-Faction
        </button>
        <button
          style={{ fontSize: "14px" }}
          className={tab === "Faction" ? "selected" : ""}
          onClick={() => setTab("Faction")}
        >
          Faction
        </button>
      </div>

      <GenericModal
        visible={!!modalTech}
        closeMenu={() => setShownModal(undefined)}
      >
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
            className="flexColumn centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `4px 8px`,
              borderRadius: "4px",
              gap: 0,
            }}
          >
            {shownModal}
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
            <div className={styles.TechModal}>
              <div></div>
              <CollapsibleSection openedByDefault title="Factions">
                <div
                  className="flexColumn"
                  style={{
                    width: "100%",
                    padding: `0 4px 4px`,
                    fontSize: "14px",
                  }}
                >
                  <FactionsTechTable
                    factions={modalTech ? modalTech.factionInfo : {}}
                    factionGames={factionGames}
                  />
                </div>
              </CollapsibleSection>
            </div>
          </div>
        </div>
      </GenericModal>
      {orderedInfo.map(([id, info]) => {
        const tech = baseTechs[id];
        if (!tech) {
          return null;
        }
        let numGames = techGames;
        if (tab === "Faction") {
          if (!tech.faction) {
            return null;
          }
          numGames = factionGames[tech.faction] ?? 0;
        }
        return (
          <LabeledDiv
            key={id}
            label={
              <div className="flexRow" style={{ gap: "4px" }}>
                {tech.type !== "UPGRADE" ? (
                  <TechIcon type={tech.type} size={20} />
                ) : null}
                {tech.name}
                {tech.type !== "UPGRADE" ? (
                  <TechIcon type={tech.type} size={20} />
                ) : null}
              </div>
            }
            style={{ gap: 0 }}
          >
            <div
              className="flexColumn"
              style={{
                fontFamily: "Source Sans",
                justifyContent: "flex-start",
                alignItems: "flex-start",
                gap: 0,
                width: "100%",
              }}
            >
              <div>
                Win Rate:{" "}
                {Math.floor(((1.0 * info.winners) / info.researchers) * 10000) /
                  100}
                % ({info.winners} of {info.researchers})
              </div>
              <div>
                Researched by Winner in{" "}
                {Math.floor(((1.0 * info.winners) / numGames) * 10000) / 100}%
                of Games ({info.winners} of {numGames})
              </div>
              {info.winners !== info.ownedWinners ? (
                <div style={{ fontSize: "14px" }}>
                  Owned by Winner in{" "}
                  {Math.floor(((1.0 * info.ownedWinners) / numGames) * 10000) /
                    100}
                  % of Games ({info.ownedWinners} of {numGames})
                </div>
              ) : null}
              <div className={styles.HistogramSection}>
                <PointsHistogram
                  histogram={info.histogram}
                  suffix="when researched"
                  points={points}
                />
                {info.winners !== info.ownedWinners ? (
                  <PointsHistogram
                    histogram={info.ownedHistogram}
                    suffix="when owned"
                    points={points}
                  />
                ) : null}
              </div>
            </div>
            {tab === "Faction" ? (
              <div>
                Researched in{" "}
                {Math.floor(((1.0 * info.researchers) / numGames) * 10000) /
                  100}
                % of games ({info.researchers} of {numGames})
              </div>
            ) : (
              <div
                className="flexColumn"
                style={{
                  fontFamily: "Source Sans",
                  justifyContent: "flex-start",
                  alignItems: "flex-start",
                  gap: 0,
                }}
              >
                <div>
                  Average Researchers per Game:{" "}
                  {Math.floor(((1.0 * info.researchers) / numGames) * 100) /
                    100}{" "}
                  ({info.researchers} in {numGames})
                </div>
              </div>
            )}

            {tab !== "Faction" ? (
              <button
                style={{ fontSize: "10px", marginTop: "4px" }}
                onClick={() => setShownModal(id)}
              >
                More Stats
              </button>
            ) : null}
          </LabeledDiv>
        );
      })}
    </div>
  );
}

function FactionsTechTable({
  factions,
  factionGames,
}: {
  factions: Partial<Record<FactionId, FactionTechInfo>>;
  factionGames: Partial<Record<FactionId, number>>;
}) {
  const orderedFactions = objectEntries(factions).sort((a, b) => {
    const aRatio = a[1].researched / (factionGames[a[0]] ?? 1);
    const bRatio = b[1].researched / (factionGames[b[0]] ?? 1);
    if (aRatio === bRatio) {
      return b[1].games - a[1].games;
    }
    return bRatio - aRatio;
  });
  // const stageTwoObjectives = orderedObjectives.filter(
  //   ([_, info]) => info.type === "STAGE TWO" && info.games >= 2
  // );
  return (
    <table style={{ fontSize: "12px", width: "100%", borderSpacing: "0" }}>
      <thead>
        <tr>
          <th></th>
          <th>Research Rate</th>
          <th>Win Rate</th>
          <th>Average Points</th>
        </tr>
      </thead>
      <tbody>
        {orderedFactions.map(([factionId, info]) => {
          let games = factionGames[factionId] ?? 1;
          return (
            <tr key={factionId} style={{ fontFamily: "Source Sans" }}>
              <td
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "8px",
                  alignItems: "flex-start",
                }}
              >
                <FactionIcon factionId={factionId} size={18} />
                <div>{factionId}</div>
              </td>
              <td>
                {Math.floor(((1.0 * info.researched) / games) * 10000) / 100}% (
                {info.researched} of {games})
              </td>
              <td>
                {Math.floor(((1.0 * info.wins) / info.researched) * 10000) /
                  100}
                % ({info.wins} of {info.researched})
              </td>
              <td>
                {Math.floor(((1.0 * info.points) / info.researched) * 100) /
                  100}{" "}
                ({info.points} in {info.researched})
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
