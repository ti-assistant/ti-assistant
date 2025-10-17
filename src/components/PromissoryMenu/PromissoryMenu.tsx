import Image from "next/image";
import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import { useGameId, useViewOnly } from "../../context/dataHooks";
import { useObjectives } from "../../context/objectiveDataHooks";
import { useFactions } from "../../context/factionDataHooks";
import {
  gainAllianceAsync,
  loseAllianceAsync,
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../dynamic/api";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { getFactionColor } from "../../util/factions";
import { rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledLine from "../LabeledLine/LabeledLine";
import styles from "./PromissoryMenu.module.scss";
import PromissoryMenuSVG from "../../icons/ui/PromissoryMenu";
import { Optional } from "../../util/types/types";

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

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

function getAllianceHolder(
  factionId: FactionId,
  factions: Partial<Record<FactionId, Faction>>
) {
  return Object.values(factions).reduce(
    (owner: Optional<FactionId>, faction) => {
      if (faction.id === factionId || faction.id === "Mahact Gene-Sorcerers") {
        return owner;
      }
      const alliances = faction.alliances ?? [];
      if (alliances.includes(factionId)) {
        return faction.id;
      }
      return owner;
    },
    undefined
  );
}

export default function PromissoryMenu({
  factionId,
}: {
  factionId: FactionId;
}) {
  const factions = useFactions();
  const gameId = useGameId();
  const objectives = useObjectives();
  const viewOnly = useViewOnly();

  let orderedFactions = Object.values(factions).sort((a, b) => {
    if (a.mapPosition < b.mapPosition) {
      return -1;
    }
    return 1;
  });
  const orderedFactionIds = orderedFactions.map((faction) => faction.id);

  const supportForTheThrone = objectives["Support for the Throne"];
  if (!supportForTheThrone) {
    return null;
  }

  const supportGivenTo = getSupportScorer(factionId, supportForTheThrone);
  const allianceGivenTo = getAllianceHolder(factionId, factions);

  return (
    <ClientOnlyHoverMenu
      label={
        <div
          className="flexRow"
          style={{ position: "relative", width: rem(18), height: rem(14) }}
        >
          <PromissoryMenuSVG />
        </div>
      }
    >
      <div
        className="flexColumn"
        style={{
          padding: rem(8),
          gap: 0,
          fontSize: rem(12),
        }}
      >
        <div
          className="flexRow"
          style={{ width: "100%", justifyContent: "flex-start" }}
        >
          <FormattedMessage
            id="Objectives.Support for the Throne.Title"
            description="Title of Objective: Support for the Throne"
            defaultMessage="Support for the Throne"
          />
          :{" "}
          <FactionSelectRadialMenu
            factions={orderedFactionIds}
            invalidFactions={[factionId]}
            selectedFaction={supportGivenTo}
            size={32}
            onSelect={(newSupport) => {
              if (supportGivenTo) {
                unscoreObjectiveAsync(
                  gameId,
                  supportGivenTo,
                  "Support for the Throne",
                  factionId
                );
              }
              if (newSupport) {
                scoreObjectiveAsync(
                  gameId,
                  newSupport,
                  "Support for the Throne",
                  factionId
                );
              }
            }}
            tag={<FactionIcon factionId={factionId} size="100%" />}
            tagBorderColor={getFactionColor(factions[factionId])}
            borderColor={
              supportGivenTo
                ? getFactionColor(factions[supportGivenTo])
                : undefined
            }
            viewOnly={viewOnly}
          />
        </div>
        {factionId !== "Mahact Gene-Sorcerers" ? (
          <div
            className="flexRow"
            style={{ width: "100%", justifyContent: "flex-start" }}
          >
            Alliance:{" "}
            <FactionSelectRadialMenu
              factions={orderedFactionIds}
              invalidFactions={[factionId, "Mahact Gene-Sorcerers"]}
              selectedFaction={allianceGivenTo}
              size={32}
              onSelect={(newAlliance, prevAlliance) => {
                if (newAlliance) {
                  gainAllianceAsync(gameId, newAlliance, factionId);
                } else if (prevAlliance) {
                  loseAllianceAsync(gameId, prevAlliance, factionId);
                }
              }}
              tag={<FactionIcon factionId={factionId} size="100%" />}
              tagBorderColor={getFactionColor(factions[factionId])}
              borderColor={
                allianceGivenTo
                  ? getFactionColor(factions[allianceGivenTo])
                  : undefined
              }
              viewOnly={viewOnly}
            />
          </div>
        ) : null}
        <LabeledLine
          leftLabel={<div style={{ fontSize: rem(12) }}>Play Area</div>}
        />
        <div className="flexColumn" style={{ gap: rem(4), width: "100%" }}>
          <FormattedMessage
            id="Objectives.Support for the Throne.Title"
            description="Title of Objective: Support for the Throne"
            defaultMessage="Support for the Throne"
          />
          <div
            className={styles.factionIconRow}
            style={
              {
                "--num-factions": orderedFactionIds.length - 1,
              } as NumFactionsCSS
            }
          >
            {orderedFactionIds.map((id) => {
              if (id === factionId) {
                return null;
              }
              const scored =
                getSupportScorer(id, supportForTheThrone) === factionId;
              return (
                <div
                  key={id}
                  className={`flexRow ${styles.factionIconWrapper} ${
                    viewOnly ? styles.viewOnly : ""
                  }`}
                  onClick={
                    viewOnly
                      ? undefined
                      : () => {
                          if (scored) {
                            unscoreObjectiveAsync(
                              gameId,
                              factionId,
                              "Support for the Throne",
                              id
                            );
                          } else {
                            scoreObjectiveAsync(
                              gameId,
                              factionId,
                              "Support for the Throne",
                              id
                            );
                          }
                        }
                  }
                >
                  <div
                    className={`${styles.factionIcon} ${
                      scored ? styles.selected : ""
                    }  ${viewOnly ? styles.viewOnly : ""}`}
                    style={
                      {
                        "--color": getFactionColor(factions[id]),
                      } as ExtendedCSS
                    }
                  >
                    <FactionIcon factionId={id} size="100%" />
                  </div>
                </div>
              );
            })}
          </div>
          {factionId !== "Mahact Gene-Sorcerers"
            ? "Alliances"
            : "Fleet Pool Tokens"}
          <div
            className={styles.factionIconRow}
            style={
              {
                "--num-factions": orderedFactionIds.length - 1,
              } as NumFactionsCSS
            }
          >
            {orderedFactionIds.map((id) => {
              if (id === factionId || id === "Mahact Gene-Sorcerers") {
                return null;
              }
              const owned = getAllianceHolder(id, factions) === factionId;
              return (
                <div
                  key={id}
                  className={`flexRow ${styles.factionIconWrapper} ${
                    viewOnly ? styles.viewOnly : ""
                  }`}
                  onClick={
                    viewOnly
                      ? undefined
                      : () => {
                          if (owned) {
                            loseAllianceAsync(gameId, factionId, id);
                          } else {
                            gainAllianceAsync(gameId, factionId, id);
                          }
                        }
                  }
                >
                  <div
                    className={`${styles.factionIcon} ${
                      owned ? styles.selected : ""
                    }  ${viewOnly ? styles.viewOnly : ""}`}
                    style={
                      {
                        "--color": getFactionColor(factions[id]),
                      } as ExtendedCSS
                    }
                  >
                    <FactionIcon factionId={id} size="100%" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ClientOnlyHoverMenu>
  );
}
