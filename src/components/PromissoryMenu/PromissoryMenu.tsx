import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import { useViewOnly } from "../../context/dataHooks";
import {
  useAllFactionAlliances,
  useFactionColors,
} from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import { useObjective } from "../../context/objectiveDataHooks";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import PromissoryMenuSVG from "../../icons/ui/PromissoryMenu";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { objectEntries, rem } from "../../util/util";
import FactionIcon from "../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledLine from "../LabeledLine/LabeledLine";
import styles from "./PromissoryMenu.module.scss";

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

function getAlliancePartner(
  factionId: FactionId,
  allAlliances: Partial<Record<FactionId, FactionId[]>>,
) {
  for (const [id, alliances] of objectEntries(allAlliances)) {
    if (factionId === id) {
      continue;
    }
    if (alliances.includes(factionId)) {
      return id;
    }
  }
  return;
}

export default function PromissoryMenu({
  factionId,
}: {
  factionId: FactionId;
}) {
  const dataUpdate = useDataUpdate();
  const factionAlliances = useAllFactionAlliances();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const factionColors = useFactionColors();
  const supportForTheThrone = useObjective("Support for the Throne");
  const viewOnly = useViewOnly();

  if (!supportForTheThrone) {
    return null;
  }

  const supportGivenTo = getSupportScorer(factionId, supportForTheThrone);
  const allianceGivenTo = getAlliancePartner(factionId, factionAlliances);

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
            factions={mapOrderedFactionIds}
            invalidFactions={[factionId]}
            selectedFaction={supportGivenTo}
            size={32}
            onSelect={(newSupport) => {
              if (supportGivenTo) {
                dataUpdate(
                  Events.UnscoreObjectiveEvent(
                    supportGivenTo,
                    "Support for the Throne",
                    factionId,
                  ),
                );
              }
              if (newSupport) {
                dataUpdate(
                  Events.ScoreObjectiveEvent(
                    newSupport,
                    "Support for the Throne",
                    factionId,
                  ),
                );
              }
            }}
            tag={<FactionIcon factionId={factionId} size="100%" />}
            tagBorderColor={factionColors[factionId]}
            borderColor={
              supportGivenTo ? factionColors[supportGivenTo] : undefined
            }
            viewOnly={viewOnly}
          />
        </div>
        {factionId !== "Mahact Gene-Sorcerers" ? (
          <div
            className="flexRow"
            style={{ width: "100%", justifyContent: "flex-start" }}
          >
            <FormattedMessage
              id="Promissories.Alliance.Title"
              defaultMessage="{count, plural, one {Alliance} other {Alliances}}"
              description="Title of Promissory: Alliance"
              values={{ count: 1 }}
            />
            :{" "}
            <FactionSelectRadialMenu
              factions={mapOrderedFactionIds}
              invalidFactions={[factionId, "Mahact Gene-Sorcerers"]}
              selectedFaction={allianceGivenTo}
              size={32}
              onSelect={(newAlliance, prevAlliance) => {
                if (newAlliance) {
                  dataUpdate(Events.GainAllianceEvent(newAlliance, factionId));
                } else if (prevAlliance) {
                  dataUpdate(Events.LoseAllianceEvent(prevAlliance, factionId));
                }
              }}
              tag={<FactionIcon factionId={factionId} size="100%" />}
              tagBorderColor={factionColors[factionId]}
              borderColor={
                allianceGivenTo ? factionColors[allianceGivenTo] : undefined
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
                "--num-factions": mapOrderedFactionIds.length - 1,
              } as NumFactionsCSS
            }
          >
            {mapOrderedFactionIds.map((id) => {
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
                            dataUpdate(
                              Events.UnscoreObjectiveEvent(
                                factionId,
                                "Support for the Throne",
                                id,
                              ),
                            );
                          } else {
                            dataUpdate(
                              Events.ScoreObjectiveEvent(
                                factionId,
                                "Support for the Throne",
                                id,
                              ),
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
                        "--color": factionColors[id],
                      } as ExtendedCSS
                    }
                  >
                    <FactionIcon factionId={id} size="100%" />
                  </div>
                </div>
              );
            })}
          </div>
          {factionId !== "Mahact Gene-Sorcerers" ? (
            <FormattedMessage
              id="Promissories.Alliance.Title"
              defaultMessage="{count, plural, one {Alliance} other {Alliances}}"
              description="Title of Promissory: Alliance"
              values={{ count: 2 }}
            />
          ) : (
            <FormattedMessage
              id="LkSYQA"
              defaultMessage="Fleet Pool Tokens"
              description="Tokens that determine how many non-fighter ships can be in a system."
            />
          )}
          <div
            className={styles.factionIconRow}
            style={
              {
                "--num-factions": mapOrderedFactionIds.length - 1,
              } as NumFactionsCSS
            }
          >
            {mapOrderedFactionIds.map((id) => {
              if (id === factionId || id === "Mahact Gene-Sorcerers") {
                return null;
              }
              const owned =
                getAlliancePartner(id, factionAlliances) === factionId;
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
                            dataUpdate(Events.LoseAllianceEvent(factionId, id));
                          } else {
                            dataUpdate(Events.GainAllianceEvent(factionId, id));
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
                        "--color": factionColors[id],
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
