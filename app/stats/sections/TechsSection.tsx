import { use, useState } from "react";
import { FormattedMessage } from "react-intl";
import Chip from "../../../src/components/Chip/Chip";
import { CollapsibleSection } from "../../../src/components/CollapsibleSection";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import LabeledDiv from "../../../src/components/LabeledDiv/LabeledDiv";
import TechIcon from "../../../src/components/TechIcon/TechIcon";
import { ModalContext } from "../../../src/context/contexts";
import { Optional } from "../../../src/util/types/types";
import { objectEntries, rem } from "../../../src/util/util";
import { ProcessedGame } from "../processor";
import { PointsHistogram } from "./Histogram";
import styles from "./TechsSection.module.scss";
import { HistogramData } from "./types";

interface FactionTechInfo {
  games: number;
  researched: number;
  wins: number;
  points: number;
}

interface TechInfo {
  researchers: number;
  winners: number;
  owners: number;
  ownedWinners: number;
  histogram: HistogramData;
  ownedHistogram: HistogramData;
  factionInfo: Partial<Record<FactionId, FactionTechInfo>>;
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
  const { openModal } = use(ModalContext);
  const techInfo: Partial<Record<TechId, TechInfo>> = {};
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

  return (
    <div className={styles.TechsSection}>
      <div
        className="flexRow"
        style={{
          gap: rem(4),
          position: "sticky",
          top: 0,
          backgroundColor: "var(--background-color)",
          zIndex: 1,
          width: "100%",
          justifyContent: "center",
          paddingBottom: rem(8),
        }}
      >
        <Chip
          fontSize={14}
          selected={tab === "Non-Faction"}
          toggleFn={() => setTab("Non-Faction")}
        >
          <FormattedMessage
            id="nYgb4V"
            defaultMessage="Non-Faction"
            description="Techs that are not specific to any faction."
          />
        </Chip>
        <Chip
          fontSize={14}
          selected={tab === "Faction"}
          toggleFn={() => setTab("Faction")}
        >
          <FormattedMessage
            id="LuWjGl"
            defaultMessage="Faction"
            description="Techs that are specific to a faction."
          />
        </Chip>
      </div>

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
              <div className="flexRow" style={{ gap: rem(4) }}>
                {tech.type !== "UPGRADE" ? (
                  <TechIcon type={tech.type} size={20} />
                ) : null}
                {tech.name}
                {tech.type !== "UPGRADE" ? (
                  <TechIcon type={tech.type} size={20} />
                ) : null}
              </div>
            }
            innerStyle={{ gap: 0 }}
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
                <FormattedMessage
                  id="8ntyP0"
                  defaultMessage="Win Rate"
                  description="Label for a section describing the win rate."
                />
                :{" "}
                {Math.round(((1.0 * info.winners) / info.researchers) * 10000) /
                  100}
                % ({info.winners} of {info.researchers})
              </div>
              <div>
                <FormattedMessage
                  id="M9w8hd"
                  defaultMessage="Researched by winner in {perc}% of games ({wins} of {games})"
                  description="Statistic about how frequently a tech was researched by the winner."
                  values={{
                    perc:
                      Math.round(((1.0 * info.winners) / numGames) * 10000) /
                      100,
                    wins: info.winners,
                    games: numGames,
                  }}
                />
              </div>
              {/* {info.winners !== info.ownedWinners ? (
                <div style={{ fontSize: rem(14) }}>
                  Owned by Winner in{" "}
                  {Math.round(((1.0 * info.ownedWinners) / numGames) * 10000) /
                    100}
                  % of Games ({info.ownedWinners} of {numGames})
                </div>
              ) : null} */}
              <div className={styles.HistogramSection}>
                <PointsHistogram histogram={info.histogram} points={points} />
              </div>
            </div>
            {tab === "Faction" ? (
              <div>
                <FormattedMessage
                  id="mYdPrP"
                  defaultMessage="Researched in {perc}% of games ({count} of {games})"
                  description="Statistic about how frequently a faction tech was researched."
                  values={{
                    perc:
                      Math.round(
                        ((1.0 * info.researchers) / numGames) * 10000
                      ) / 100,
                    count: info.researchers,
                    games: numGames,
                  }}
                />
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
                  <FormattedMessage
                    id="6Dhyu4"
                    defaultMessage="Average researchers per game: {num} ({count} of {games})"
                    description="Statistic about the average number of researchers of a tech."
                    values={{
                      num:
                        Math.round(
                          ((1.0 * info.researchers) / numGames) * 100
                        ) / 100,
                      count: info.researchers,
                      games: numGames,
                    }}
                  />
                </div>
              </div>
            )}

            {tab !== "Faction" ? (
              <button
                style={{ fontSize: rem(10), marginTop: rem(4) }}
                onClick={() =>
                  openModal(
                    <TechModalContent
                      title={id}
                      tech={techInfo[id]}
                      factionGames={factionGames}
                    />
                  )
                }
              >
                <FormattedMessage
                  id="8NMXES"
                  defaultMessage="More Stats"
                  description="Text on a button that opens a modal with more statistics."
                />
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
    <table style={{ fontSize: rem(12), width: "100%", borderSpacing: "0" }}>
      <thead>
        <tr>
          <th></th>
          <th>
            <FormattedMessage
              id="+kc61r"
              defaultMessage="Research Rate"
              description="Label for a section describing the percentage that a tech was researched."
            />
          </th>
          <th>
            <FormattedMessage
              id="8ntyP0"
              defaultMessage="Win Rate"
              description="Label for a section describing the win rate."
            />
          </th>
          <th>
            <FormattedMessage
              id="+zFNH+"
              defaultMessage="Average VPs"
              description="Label for a section describing the average number of VPs."
            />
          </th>
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
                  gap: rem(8),
                  alignItems: "flex-start",
                }}
              >
                <FactionIcon factionId={factionId} size={18} />
                <div>{factionId}</div>
              </td>
              <td>
                {Math.round(((1.0 * info.researched) / games) * 10000) / 100}% (
                {info.researched} of {games})
              </td>
              <td>
                {Math.round(((1.0 * info.wins) / info.researched) * 10000) /
                  100}
                % ({info.wins} of {info.researched})
              </td>
              <td>
                {Math.round(((1.0 * info.points) / info.researched) * 100) /
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

function TechModalContent({
  title,
  tech,
  factionGames,
}: {
  title: string;
  tech: Optional<TechInfo>;
  factionGames: Partial<Record<FactionId, number>>;
}) {
  return (
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
        className="flexColumn centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          padding: `${rem(4)} ${rem(8)}`,
          borderRadius: rem(4),
          gap: 0,
          border: "1px solid var(--neutral-border)",
        }}
      >
        {title}
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
        <div className={styles.TechModal}>
          <div></div>
          <CollapsibleSection
            openedByDefault
            title={
              <FormattedMessage
                id="r2htpd"
                description="Text on a button that will randomize factions."
                defaultMessage="Factions"
              />
            }
          >
            <div
              className="flexColumn"
              style={{
                width: "100%",
                padding: `0 ${rem(4)} ${rem(4)}`,
                fontSize: rem(14),
              }}
            >
              <FactionsTechTable
                factions={tech ? tech.factionInfo : {}}
                factionGames={factionGames}
              />
            </div>
          </CollapsibleSection>
        </div>
      </div>
    </div>
  );
}
