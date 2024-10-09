import parse from "html-react-parser";
import { PropsWithChildren, ReactNode, useContext, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { UnitStat } from "../TechRow";
import { GameIdContext } from "../context/Context";
import { useLeaders, useTechs } from "../context/dataHooks";
import { updateLeaderStateAsync } from "../dynamic/api";
import { getFactionName } from "../util/factions";
import { leaderTypeString, unitTypeString } from "../util/strings";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import styles from "./FactionPanel.module.scss";
import GenericModal from "./GenericModal/GenericModal";
import LabeledLine from "./LabeledLine/LabeledLine";
import TechIcon from "./TechIcon/TechIcon";
import { sortTechs } from "../util/techs";
import { rem } from "../util/util";

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
        gap: rem(4),
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
          padding: `0 ${rem(8)}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

const KEYWORDS = [
  // ACTION
  "ACTION:",
  "AKTION:",
  // DEPLOY
  "DEPLOY:",
  "EINSATZ:",
  // UNLOCK
  "UNLOCK:",
];

const ABILITY_REGEX = [
  // PRODUCTION
  /PRODUCTION( [1-9]| X)?/gi,
  /PRODUKTION( [1-9]| X)?/gi,
  // ANTI-FIGHTER BARRAGE
  /ANTI-FIGHTER BARRAGE( [1-9] \(x[1-9]\))?/gi,
  // BOMBARDMENT
  /BOMBARDMENT( [1-9] \(x[1-9]\))?/gi,
  /BOMBARDEMENT( [1-9] \(x[1-9]\))?/gi,
  // SPACE CANNON
  /SPACE CANNON( [1-9]( \(x[1-9]\))?)?/gi,
  /WELTRAUMKANONE( [1-9]( \(x[1-9]\))?)?/gi,
  // SUSTAIN DAMAGE
  /SUSTAIN DAMAGE/gi,
  /SCHADENSRESISTENZ/gi,
  // PLANETARY SHIELD
  /PLANETARY SHIELD/gi,
  /PLANETARER SCHILD/gi,
  // Faction specific keywords
  /MITOSIS/gi,
  /ZELLTEILUNG/gi,
  /AWAKEN/gi,
  /ERWECKEN/gi,
  /STAR FORGE/gi,
  /STERNENSCHMIEDE/gi,
  /ORBITAL DROP/gi,
  /ORBITALE LANDUNG/gi,
  /PILLAGE/gi,
  /PLÜNDERN/gi,
  /TELEPATHIC/gi,
  /TELEPATHIE/gi,
  /TECHNOLOGICAL SINGULARITY/gi,
  /TECHNOLOGISCHE SINGULARITÄT/gi,
  /FRAGILE/gi,
  /ZERBRECHLICH/gi,
  /INDOCTRINATION/gi,
  /MISSIONIEREN/gi,
  /STALL TACTICS/gi,
  /VERZÖGERUNGSTAKTIK/gi,
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
          gap: rem(4),
          fontFamily: "Slider",
          width: "fit-content",
          boxSizing: "border-box",
        }}
      >
        {stats.cost ? (
          <UnitStat
            name={
              <FormattedMessage
                id="Unit.Stats.Cost"
                defaultMessage="COST"
                description="Label for unit stat block - cost of the unit."
              />
            }
            stat={stats.cost ?? "-"}
          />
        ) : (
          <div></div>
        )}
        {stats.combat ? (
          <UnitStat
            name={
              <FormattedMessage
                id="Unit.Stats.Combat"
                defaultMessage="COMBAT"
                description="Label for unit stat block - combat value of the unit."
              />
            }
            stat={stats.combat ?? "-"}
          />
        ) : (
          <div></div>
        )}
        {stats.move ? (
          <UnitStat
            name={
              <FormattedMessage
                id="Unit.Stats.Move"
                defaultMessage="MOVE"
                description="Label for unit stat block - move value of the unit."
              />
            }
            stat={stats.move ?? "-"}
          />
        ) : (
          <div></div>
        )}
        {stats.capacity ? (
          <UnitStat
            name={
              <FormattedMessage
                id="Unit.Stats.Capacity"
                defaultMessage="CAPACITY"
                description="Label for unit stat block - capacity value of the unit."
              />
            }
            stat={stats.capacity ?? "-"}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

function FactionPanelContent({
  faction,
  options,
}: {
  faction: Faction;
  options: Options;
}) {
  const intl = useIntl();
  // let faction: BaseFaction | Faction = buildFaction(factionId, options, intl);
  const gameId = useContext(GameIdContext);
  const leaders = useLeaders();
  const techs = useTechs();

  const factionTechs = Object.values(techs).filter(
    (tech) => tech.faction === faction.id
  );
  sortTechs(factionTechs);
  const factionLeaders = Object.values(leaders)
    .filter((leader) => leader.faction === faction.id)
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
          <CollapsibleSection
            title={
              <FormattedMessage
                id="/MkeMw"
                defaultMessage="Leaders"
                description="Agent, commander, and hero cards."
              />
            }
            style={{ width: "100%" }}
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
              {factionLeaders.map((leader) => {
                let state = leader.state;
                if (!state) {
                  switch (leader.type) {
                    case "AGENT":
                      state = "readied";
                      break;
                    case "COMMANDER":
                    case "HERO":
                      state = "locked";
                      break;
                  }
                }

                let innerContent = undefined;
                let leftLabel = undefined;
                switch (state) {
                  case "readied":
                  case "exhausted":
                    leftLabel = (
                      <div className="flexRow" style={{ gap: rem(6) }}>
                        {leader.name}
                        {leader.subFaction ? (
                          <FactionIcon
                            factionId={leader.subFaction}
                            size={16}
                          />
                        ) : null}
                        {gameId && state === "exhausted" ? (
                          <span
                            style={{
                              fontSize: rem(12),
                            }}
                          >
                            [Exhausted]
                          </span>
                        ) : null}
                        {gameId && leader.type !== "AGENT" ? (
                          <div
                            className="flexRow"
                            style={{
                              gap: rem(4),
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!gameId) {
                                return;
                              }
                              updateLeaderStateAsync(
                                gameId,
                                leader.id,
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
                            gap: "4px",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            if (!gameId) {
                              return;
                            }
                            updateLeaderStateAsync(
                              gameId,
                              leader.id,
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
                              leader.id,
                              "readied"
                            );
                          }}
                        >
                          {formatDescription(
                            intl.formatMessage({
                              id: "frzrrT",
                              defaultMessage: "UNLOCK:",
                              description:
                                "Text that gets pre-fixed to a leader unlock condition.",
                            })
                          ).map((val, index) => (
                            <span key={index}>{val}</span>
                          ))}
                        </span>{" "}
                        {formatDescription(
                          leader.unlock ??
                            intl.formatMessage({
                              id: "Leaders.Hero.Unlock",
                              defaultMessage: "Have 3 scored objectives.",
                              description: "Unlock condition for all heroes.",
                            })
                        ).map((val, index) => (
                          <span key={index}>{val}</span>
                        ))}
                      </div>
                    );
                    break;
                  case "purged":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        <div className="flexRow" style={{ gap: "4px" }}>
                          <div
                            style={{
                              fontSize: rem(8),
                              color: "#eee",
                              border: "1px solid #eee",
                              padding: rem(2),
                              borderRadius: rem(2),
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              updateLeaderStateAsync(
                                gameId,
                                leader.id,
                                "readied"
                              );
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
                          fontSize: rem(20),
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
                    rightLabel={leaderTypeString(
                      leader.type,
                      intl
                    ).toUpperCase()}
                  >
                    {innerContent}
                  </AbilitySection>
                );
              })}
            </div>
          </CollapsibleSection>
        ) : null}

        {factionTechs.length > 0 ? (
          <CollapsibleSection
            title={
              <FormattedMessage
                id="yctdL8"
                defaultMessage="Faction Techs"
                description="Header for a section listing out various faction technologies."
              />
            }
          >
            <div
              className="flexColumn"
              style={{
                gap: rem(4),
                padding: rem(4),
                fontSize: rem(14),
              }}
            >
              {factionTechs.map((tech) => {
                return (
                  <AbilitySection
                    key={tech.id}
                    leftLabel={
                      <div className="flexRow" style={{ gap: rem(4) }}>
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
                              paddingLeft: rem(8),
                              rowGap: rem(2),
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
        <CollapsibleSection
          title={
            <FormattedMessage
              id="2dmEIv"
              defaultMessage="Abilities"
              description="Header for a section listing out abilities."
            />
          }
          style={{ width: "100%" }}
        >
          <div
            className="flexColumn"
            style={{
              width: "100%",
              gap: rem(4),
              padding: rem(4),
              fontSize: rem(14),
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
        <CollapsibleSection
          title={
            <FormattedMessage
              id="yXj5iL"
              defaultMessage="Promissory {count, plural, one {Note} other {Notes}}"
              description="Header for a section listing out promissory notes."
              values={{ count: faction.promissories.length }}
            />
          }
          style={{ width: "100%" }}
        >
          <div
            className="flexColumn"
            style={{
              gap: rem(4),
              padding: rem(4),
              fontSize: rem(14),
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
      <CollapsibleSection
        title={
          <FormattedMessage
            id="9eqKm5"
            defaultMessage="Unique {count, plural, one {Unit} other {Units}}"
            description="Header for section listing out unique units."
            values={{ count: faction.units.length }}
          />
        }
      >
        <div
          className="flexColumn"
          style={{
            gap: rem(4),
            padding: rem(4),
            fontSize: rem(14),
          }}
        >
          {faction.units.map((unit, index) => {
            const localUnit = { ...unit };
            let leftLabel: ReactNode = unit.name;
            return (
              <AbilitySection
                key={index}
                leftLabel={leftLabel}
                rightLabel={unitTypeString(localUnit.type, intl).toUpperCase()}
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
                      paddingLeft: rem(8),
                      rowGap: rem(2),
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

export default function FactionPanel({
  faction,
  options,
}: {
  faction: Faction;
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
            width: `clamp(80vw, ${rem(1200)}, calc(100vw - ${rem(24)}))`,
            justifyContent: "flex-start",
            height: `calc(100dvh - ${rem(24)})`,
          }}
        >
          <div
            className="flexRow centered extraLargeFont"
            style={{
              backgroundColor: "#222",
              padding: `${rem(4)} ${rem(8)}`,
              borderRadius: rem(4),
            }}
          >
            <FactionIcon factionId={faction.id} size={36} />
            {getFactionName(faction)}
            <FactionIcon factionId={faction.id} size={36} />
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
            <FactionPanelContent faction={faction} options={options} />
          </div>
        </div>
      </GenericModal>
      <div
        className="popupIcon"
        style={{
          fontSize: rem(16),
        }}
        onClick={() => setShowPanel(true)}
      >
        &#x24D8;
      </div>
    </>
  );
}
