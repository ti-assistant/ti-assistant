import parse from "html-react-parser";
import { PropsWithChildren, ReactNode, useContext, useState } from "react";
import { FactionContext } from "../context/Context";
import { buildBaseTechs, buildFaction, buildLeaders } from "../data/GameData";
import { getFactionName } from "../util/factions";
import { responsivePixels } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import styles from "./FactionPanel.module.scss";
import GenericModal from "./GenericModal/GenericModal";
import LabeledLine from "./LabeledLine/LabeledLine";
import TechIcon from "./TechIcon/TechIcon";
import { updateLeaderStateAsync } from "../dynamic/api";
import { useRouter } from "next/router";
import { useIntl } from "react-intl";

function AbilitySection({
  leftLabel,
  label,
  rightLabel,
  children,
}: PropsWithChildren<{
  leftLabel: ReactNode;
  label?: ReactNode;
  rightLabel?: ReactNode;
}>) {
  return (
    <div
      className="flexColumn"
      style={{
        position: "relative",
        width: "100%",
        gap: responsivePixels(4),
      }}
    >
      <LabeledLine
        leftLabel={leftLabel}
        label={label}
        rightLabel={rightLabel}
      />
      <div
        className="flexColumn"
        style={{
          fontFamily: "Myriad Pro",
          alignItems: "flex-start",
          width: "100%",
          padding: `0 ${responsivePixels(8)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const KEYWORDS = ["ACTION:", "DEPLOY:", "UNLOCK:"];

const ABILITY_REGEX = [
  /PRODUCTION( [1-9]| X)?/gi,
  /ANTI-FIGHTER BARRAGE( [1-9] \(x[1-9]\))?/gi,
  /BOMBARDMENT( [1-9] \(x[1-9]\))?/gi,
  /SPACE CANNON( [1-9]( \(x[1-9]\))?)?/gi,
  /SUSTAIN DAMAGE/gi,
  /PLANETARY SHIELD/gi,
  // Faction specific keywords
  /MITOSIS/gi,
  /AWAKEN/gi,
  /STAR FORGE/gi,
  /ORBITAL DROP/gi,
  /PILLAGE/gi,
  /TELEPATHIC/gi,
  /TECHNOLOGICAL SINGULARITY/gi,
  /FRAGILE/gi,
  /INDOCTRINATION/gi,
  /STALL TACTICS/gi,
  // DS Faction specific keywords
  /RALLY TO THE CAUSE/gi,
  /RECYCLED MATERIALS/gi,
  /AUTONETIC MEMORY/gi,
];

function formatDescription(description: string) {
  const parsedSections = [];
  const sections = description.split("\n\n");
  for (const section of sections) {
    let updated = section;
    for (const keyword of KEYWORDS) {
      updated = updated.replaceAll(
        keyword,
        `<i class="keyword">${keyword}</i>`
      );
    }
    for (const regex of ABILITY_REGEX) {
      updated = updated.replaceAll(regex, `<span class="ability">$&</span>`);
    }
    if (updated.endsWith(":")) {
      updated = `<b>${updated}</b>`;
    }
    parsedSections.push(parse(updated));
  }
  return parsedSections;
}

function UnitStatBlock({ stats }: { stats?: UnitStats }) {
  if (!stats) {
    return null;
  }
  return (
    <div className="flexRow" style={{ width: "100%" }}>
      <div
        className="flexRow"
        style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: responsivePixels(4),
          fontFamily: "Slider",
          width: "fit-content",
          boxSizing: "border-box",
        }}
      >
        {stats.cost ? (
          <UnitStat name="COST" stat={stats.cost ?? "-"} />
        ) : (
          <div></div>
        )}
        {stats.combat ? (
          <UnitStat name="COMBAT" stat={stats.combat ?? "-"} />
        ) : (
          <div></div>
        )}
        {stats.move ? (
          <UnitStat name="MOVE" stat={stats.move ?? "-"} />
        ) : (
          <div></div>
        )}
        {stats.capacity ? (
          <UnitStat name="CAPACITY" stat={stats.capacity ?? "-"} />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}
function UnitStat({ name, stat }: { name: string; stat: number | string }) {
  return (
    <div
      className="centered"
      style={{
        width: responsivePixels(80),
        border: "1px solid #eee",
        borderRadius: "10px",
      }}
    >
      <div
        style={{
          fontSize: responsivePixels(24),
          borderBottom: "1px solid #eee",
        }}
      >
        {stat}
      </div>
      <div style={{ fontSize: responsivePixels(14), padding: "0px 6px" }}>
        {name}
      </div>
    </div>
  );
}

function FactionPanelContent({
  factionId,
  options,
}: {
  factionId: FactionId;
  options: Options;
}) {
  const router = useRouter();
  const { game: gameId }: { game?: string } = router.query;
  const intl = useIntl();
  const techs = buildBaseTechs(options);
  const leaders = buildLeaders(options, intl);
  let faction: BaseFaction | Faction = buildFaction(factionId, options, intl);
  const factions = useContext(FactionContext);
  const gameFaction = factions[factionId];
  if (gameFaction) {
    faction = gameFaction;
  }

  if (!faction) {
    return null;
  }

  const factionTechs = Object.values(techs).filter(
    (tech) => tech.faction === factionId
  );
  const factionLeaders = Object.values(leaders)
    .filter((leader) => leader.faction === factionId)
    .filter((leader) =>
      faction.startswith.faction && leader.subFaction
        ? leader.subFaction === faction.startswith.faction
        : true
    )
    .sort((a, b) => {
      if (a.type !== b.type) {
        if (a.type === "HERO") {
          return 1;
        }
        if (b.type === "HERO") {
          return -1;
        }
        if (a.type === "AGENT") {
          return -1;
        }
        if (b.type === "AGENT") {
          return 1;
        }
      }
      return a.name > b.name ? 1 : -1;
    });

  if (!faction) {
    return null;
  }

  return (
    <div className={styles.factionInfoGrid}>
      <div
        className="flexColumn"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        {factionLeaders.length > 0 ? (
          <CollapsibleSection title="Leaders" style={{ width: "100%" }}>
            <div
              className="flexColumn"
              style={{
                width: "100%",
                gap: responsivePixels(4),
                padding: `0 ${responsivePixels(4)} ${responsivePixels(4)}`,
                fontSize: responsivePixels(14),
              }}
            >
              {factionLeaders.map((leader) => {
                let state: LeaderState = "readied";
                switch (leader.type) {
                  case "COMMANDER":
                    if ("commander" in faction) {
                      state = faction.commander;
                    }
                    break;
                  case "HERO":
                    if ("hero" in faction) {
                      state = faction.hero;
                    }
                    break;
                }
                let innerContent = undefined;
                let leftLabel = undefined;
                switch (state) {
                  case "readied":
                    leftLabel = (
                      <div
                        className="flexRow"
                        style={{ gap: responsivePixels(6) }}
                      >
                        {leader.name}
                        {leader.subFaction ? (
                          <FactionIcon
                            factionId={leader.subFaction}
                            size={16}
                          />
                        ) : null}
                        {gameId && leader.type !== "AGENT" ? (
                          <div
                            className="flexRow"
                            style={{
                              gap: responsivePixels(4),
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!gameId) {
                                return;
                              }
                              updateLeaderStateAsync(
                                gameId,
                                factionId,
                                leader.type,
                                "locked"
                              );
                            }}
                          >
                            &#128275;
                          </div>
                        ) : null}
                      </div>
                    );
                    innerContent = (
                      <div
                        className="flexColumn"
                        style={{ width: "100%", alignItems: "flex-start" }}
                      >
                        {formatDescription(leader.description).map(
                          (section, index) => {
                            return <div key={index}>{section}</div>;
                          }
                        )}
                      </div>
                    );
                    break;
                  case "locked":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div
                          className="flexRow"
                          style={{
                            gap: responsivePixels(4),
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (!gameId) {
                              return;
                            }
                            updateLeaderStateAsync(
                              gameId,
                              factionId,
                              leader.type,
                              "readied"
                            );
                          }}
                        >
                          &#128274;
                        </div>
                      </div>
                    );
                    innerContent = (
                      <div>
                        <span
                          onClick={() => {
                            if (!gameId) {
                              return;
                            }
                            updateLeaderStateAsync(
                              gameId,
                              factionId,
                              leader.type,
                              "readied"
                            );
                          }}
                        >
                          {formatDescription("UNLOCK: ")}
                        </span>
                        {formatDescription(
                          leader.unlock ?? "Have 3 scored objectives"
                        )}
                      </div>
                    );
                    break;
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div
                          className="flexRow"
                          style={{ gap: responsivePixels(4) }}
                        >
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              alert("WIP - Will lock later");
                            }}
                          >
                            LOCK
                          </div>
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              alert("WIP - Will purge later");
                            }}
                          >
                            PURGE
                          </div>
                        </div>
                      </div>
                    );
                    innerContent = (
                      <div
                        className="flexColumn"
                        style={{ width: "100%", alignItems: "flex-start" }}
                      >
                        {formatDescription(leader.description).map(
                          (section, index) => {
                            return <div key={index}>{section}</div>;
                          }
                        )}
                      </div>
                    );
                    break;
                  case "purged":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div
                          className="flexRow"
                          style={{ gap: responsivePixels(4) }}
                        >
                          <div
                            style={{
                              fontSize: responsivePixels(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: "2px 2px",
                              borderRadius: "2px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              alert("WIP - Will unpurge later");
                            }}
                          >
                            UNPURGE
                          </div>
                        </div>
                      </div>
                    );
                    innerContent = (
                      <div
                        className="flexRow"
                        style={{
                          width: "100%",
                          fontSize: responsivePixels(20),
                          fontFamily: "Slider",
                        }}
                      >
                        PURGED
                      </div>
                    );
                    break;
                }
                return (
                  <AbilitySection
                    key={leader.name}
                    leftLabel={leftLabel}
                    rightLabel={leader.type}
                  >
                    {innerContent}
                  </AbilitySection>
                );
              })}
            </div>
          </CollapsibleSection>
        ) : null}

        {factionTechs.length > 0 ? (
          <CollapsibleSection title="Faction Tech">
            <div
              className="flexColumn"
              style={{
                gap: responsivePixels(4),
                padding: responsivePixels(4),
                fontSize: responsivePixels(14),
              }}
            >
              {factionTechs.map((tech) => {
                return (
                  <AbilitySection
                    key={tech.id}
                    leftLabel={
                      <div
                        className="flexRow"
                        style={{ gap: responsivePixels(4) }}
                      >
                        {tech.name}
                        {tech.prereqs.map((prereq, index) => {
                          return (
                            <TechIcon key={index} type={prereq} size={20} />
                          );
                        })}
                      </div>
                    }
                  >
                    {tech.description
                      ? formatDescription(tech.description).map(
                          (section, index) => {
                            return <div key={index}>{section}</div>;
                          }
                        )
                      : null}
                    {tech.type === "UPGRADE" ? (
                      <>
                        {tech.abilities.length > 0 ? (
                          <div
                            style={{
                              display: "grid",
                              gridAutoFlow: "row",
                              whiteSpace: "nowrap",
                              gridTemplateColumns: "repeat(2, 1fr)",
                              fontFamily: "Slider",
                              paddingLeft: responsivePixels(8),
                              rowGap: responsivePixels(2),
                              width: "100%",
                            }}
                          >
                            {tech.abilities.map((ability) => {
                              return (
                                <div key={ability}>{ability.toUpperCase()}</div>
                              );
                            })}
                          </div>
                        ) : null}
                        <UnitStatBlock stats={tech.stats} />
                      </>
                    ) : null}
                  </AbilitySection>
                );
              })}
            </div>
          </CollapsibleSection>
        ) : null}
      </div>
      <div
        className="flexColumn"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        <CollapsibleSection title="Abilities" style={{ width: "100%" }}>
          <div
            className="flexColumn"
            style={{
              width: "100%",
              // display: "grid",
              // gridAutoFlow: "row",
              // gridTemplateRows: `repeat(${faction.abilities.length}, 1fr)`,
              gap: responsivePixels(4),
              padding: responsivePixels(4),
              fontSize: responsivePixels(14),
            }}
          >
            {faction.abilities.map((ability) => {
              return (
                <AbilitySection
                  key={ability.name}
                  leftLabel={ability.name.toUpperCase()}
                >
                  {formatDescription(ability.description).map(
                    (section, index) => {
                      return <div key={index}>{section}</div>;
                    }
                  )}
                </AbilitySection>
              );
            })}
          </div>
        </CollapsibleSection>
        <CollapsibleSection title="Promissory Note" style={{ width: "100%" }}>
          <div
            className="flexColumn"
            style={{
              gap: responsivePixels(4),
              padding: responsivePixels(4),
              fontSize: responsivePixels(14),
              width: "100%",
            }}
          >
            {faction.promissories.map((promissory) => {
              return (
                <AbilitySection
                  key={promissory.name}
                  leftLabel={promissory.name}
                >
                  {formatDescription(promissory.description).map(
                    (section, index) => {
                      return <div key={index}>{section}</div>;
                    }
                  )}
                </AbilitySection>
              );
            })}
          </div>
        </CollapsibleSection>
      </div>
      <CollapsibleSection title="Faction Unique Units">
        <div
          className="flexColumn"
          style={{
            gap: responsivePixels(4),
            padding: responsivePixels(4),
            fontSize: responsivePixels(14),
          }}
        >
          {faction.units.map((unit, index) => {
            const localUnit = { ...unit };
            let leftLabel: ReactNode = unit.name;
            return (
              <AbilitySection
                key={index}
                leftLabel={leftLabel}
                rightLabel={localUnit.type.toUpperCase()}
              >
                {localUnit.description
                  ? formatDescription(localUnit.description).map(
                      (section, index) => {
                        return <div key={index}>{section}</div>;
                      }
                    )
                  : null}
                {(localUnit.abilities ?? []).length > 0 ? (
                  <div
                    style={{
                      display: "grid",
                      gridAutoFlow: "row",
                      whiteSpace: "nowrap",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      fontFamily: "Slider",
                      paddingLeft: responsivePixels(8),
                      rowGap: responsivePixels(2),
                      width: "100%",
                    }}
                  >
                    {localUnit.abilities?.map((ability) => {
                      return <div key={ability}>{ability.toUpperCase()}</div>;
                    })}
                  </div>
                ) : null}
                <UnitStatBlock stats={localUnit.stats} />
              </AbilitySection>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export function FactionPanel({
  faction,
  options,
}: {
  faction: Faction | SetupFaction;
  options: Options;
}) {
  const [showPanel, setShowPanel] = useState(false);

  return (
    <>
      <GenericModal visible={showPanel} closeMenu={() => setShowPanel(false)}>
        <div
          className="flexColumn"
          style={{
            whiteSpace: "normal",
            textShadow: "none",
            width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(24)}))`,
            justifyContent: "flex-start",
            height: `calc(100dvh - ${responsivePixels(24)})`,
          }}
        >
          <div
            className="flexRow centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              borderRadius: responsivePixels(4),
            }}
          >
            <FactionIcon factionId={faction.id} size={36} />
            {"shortname" in faction ? getFactionName(faction) : faction.name}
            <FactionIcon factionId={faction.id} size={36} />
          </div>
          <div
            className="flexColumn largeFont"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(
                24
              )}))`,
              justifyContent: "flex-start",
              overflow: "auto",
              height: "fit-content",
            }}
          >
            <FactionPanelContent
              factionId={
                "shortname" in faction
                  ? faction.id
                  : (faction.name as FactionId)
              }
              options={options}
            />
          </div>
        </div>
      </GenericModal>
      <div
        className="popupIcon"
        style={{
          fontSize: responsivePixels(16),
        }}
        onClick={() => setShowPanel(true)}
      >
        &#x24D8;
      </div>
    </>
  );
}
