import { PropsWithChildren, ReactNode, use } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ModalContext } from "../context/contexts";
import {
  useGameId,
  useLeaders,
  useTechs,
  useViewOnly,
} from "../context/dataHooks";
import { useFaction } from "../context/factionDataHooks";
import {
  addTechAsync,
  removeTechAsync,
  updateBreakthroughStateAsync,
  updateLeaderStateAsync,
} from "../dynamic/api";
import HitSVG from "../icons/ui/Hit";
import SynergySVG from "../icons/ui/Synergy";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { leaderTypeString } from "../util/strings";
import { sortTechs } from "../util/techs";
import { Optional } from "../util/types/types";
import { rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import styles from "./FactionPanel.module.scss";
import FormattedDescription from "./FormattedDescription/FormattedDescription";
import LabeledLine from "./LabeledLine/LabeledLine";
import TechIcon from "./TechIcon/TechIcon";
import UnitIcon from "./Units/Icons";
import UnitStats from "./UnitStats/UnitStats";

export function UnitStat({
  name,
  stat,
}: {
  name: ReactNode;
  stat: number | string | ReactNode;
}) {
  return (
    <div
      className="centered"
      style={{
        width: rem(82),
        boxSizing: "border-box",
        border: "1px solid #eee",
        borderRadius: rem(10),
      }}
    >
      <div
        style={{
          fontSize: rem(24),
          borderBottom: "1px solid #eee",
        }}
      >
        {stat}
      </div>
      <div
        style={{
          lineHeight: rem(18),
          fontSize: rem(11),
          padding: `0 ${rem(6)}`,
        }}
      >
        {name}
      </div>
    </div>
  );
}

function UnitCost({
  cost,
  type,
}: {
  cost: Optional<string | number>;
  type: UnitType;
}) {
  if (typeof cost === "string") {
    if (cost.includes("(x2)")) {
      return (
        <div
          className="flexRow"
          style={{ gap: rem(12), justifyContent: "center" }}
        >
          {cost.replace("(x2)", "")}
          <div className="flexColumn" style={{ gap: 0 }}>
            <UnitIcon type={type} size={12} />
            <UnitIcon type={type} size={12} />
          </div>
        </div>
      );
    }
  }
  return cost;
}

function UnitCombat({ combat }: { combat: Optional<string | number> }) {
  if (typeof combat === "string") {
    if (combat.includes("(x2)")) {
      return (
        <div
          className="flexRow"
          style={{ gap: rem(8), justifyContent: "center" }}
        >
          {combat.replace("(x2)", "")}
          <div className="flexColumn" style={{ gap: 0, width: rem(12) }}>
            <HitSVG />
            <HitSVG />
          </div>
        </div>
      );
    } else if (combat.includes("(x3)")) {
      return (
        <div
          className="flexRow"
          style={{ gap: rem(4), justifyContent: "center" }}
        >
          {combat.replace("(x3)", "")}
          <div
            className="flexColumn"
            style={{
              gap: 0,
              width: rem(24),
              flexWrap: "wrap",
              height: rem(24),
            }}
          >
            <span style={{ width: rem(12) }}>
              <HitSVG />
            </span>
            <span style={{ width: rem(12) }}>
              <HitSVG />
            </span>
            <span style={{ width: rem(12) }}>
              <HitSVG />
            </span>
          </div>
        </div>
      );
    }
  }
  return combat;
}

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

function FactionTech({
  tech,
  faction,
  viewOnly,
}: {
  tech: Tech;
  faction: Faction;
  viewOnly?: boolean;
}) {
  const gameId = useGameId();
  return (
    <AbilitySection
      key={tech.id}
      leftLabel={
        <div className="flexRow" style={{ gap: rem(4) }}>
          {tech.name}
          <div className="flexRow" style={{ gap: rem(4) }}>
            {tech.prereqs.map((prereq, index) => {
              return <TechIcon key={index} type={prereq} size={18} />;
            })}
          </div>
        </div>
      }
      rightLabel={
        tech.type === "UPGRADE" ? (
          <UnitIcon
            type={tech.unitType}
            size={18}
            color="var(--neutral-border)"
          />
        ) : null
      }
    >
      <FormattedDescription description={tech.description} />
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
                return <div key={ability}>{ability.toUpperCase()}</div>;
              })}
            </div>
          ) : null}
          <UnitStats stats={tech.stats} type={tech.unitType} size={rem(82)} />
          {!viewOnly ? (
            <div className="flexRow" style={{ width: "100%" }}>
              <button
                style={{
                  fontSize: rem(12),
                  display: "flex",
                  flexDirection: "row",
                  gap: rem(8),
                }}
                onClick={() => removeTechAsync(gameId, faction.id, tech.id)}
                disabled={viewOnly}
              >
                Downgrade
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </AbilitySection>
  );
}

function FactionUnit({
  unit,
  faction,
  viewUpgrade,
  viewOnly,
}: {
  unit: Unit;
  faction: Faction;
  viewUpgrade: boolean;
  viewOnly?: boolean;
}) {
  const gameId = useGameId();
  const techs = useTechs();
  const abilities = unit.abilities ?? [];
  const upgradeTech = unit.upgrade ? techs[unit.upgrade] : undefined;

  if (upgradeTech && viewUpgrade) {
    return (
      <FactionTech tech={upgradeTech} faction={faction} viewOnly={viewOnly} />
    );
  }
  return (
    <AbilitySection
      key={unit.name}
      leftLabel={
        <div className="flexRow" style={{ height: "100%" }}>
          {unit.name}
          {upgradeTech ? (
            <div className="flexRow" style={{ gap: rem(2) }}>
              {upgradeTech.prereqs.map((prereq, index) => {
                return <TechIcon key={index} type={prereq} size={18} />;
              })}
            </div>
          ) : null}
        </div>
      }
      rightLabel={
        <UnitIcon type={unit.type} color="var(--neutral-border)" size={18} />
      }
    >
      <FormattedDescription description={unit.description} />
      {abilities.length > 0 ? (
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
          {abilities.map((ability) => {
            return <div key={ability}>{ability.toUpperCase()}</div>;
          })}
        </div>
      ) : null}
      <UnitStats stats={unit.stats} type={unit.type} size={rem(82)} />
      {!viewOnly && upgradeTech ? (
        <div className="flexRow" style={{ width: "100%" }}>
          <button
            style={{
              fontSize: rem(12),
              display: "flex",
              flexDirection: "row",
              gap: rem(8),
            }}
            onClick={() => addTechAsync(gameId, faction.id, upgradeTech.id)}
            disabled={viewOnly}
          >
            Upgrade
          </button>
        </div>
      ) : null}
    </AbilitySection>
  );
}

function UnitStatBlock({ stats, type }: { stats?: UnitStats; type: UnitType }) {
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
            stat={stats.cost ? <UnitCost cost={stats.cost} type={type} /> : "-"}
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
            stat={stats.combat ? <UnitCombat combat={stats.combat} /> : "-"}
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
  const innerFaction = useFaction(faction.id);
  // let faction: BaseFaction | Faction = buildFaction(factionId, options, intl);
  const gameId = useGameId();
  const leaders = useLeaders();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  if (!innerFaction) {
    return null;
  }

  if (!innerFaction) {
    return null;
  }

  const factionTechs = Object.values(techs).filter(
    (tech) => tech.faction === faction.id && tech.type !== "UPGRADE"
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

                let innerContent = (
                  <div
                    className="flexColumn"
                    style={{
                      gap: 0,
                      justifyContent: "flex-start",
                      alignItems: "flex-start",
                      width: "100%",
                    }}
                  >
                    {leader.type !== "AGENT" ? (
                      <>
                        <FormattedDescription
                          description={`${intl.formatMessage({
                            id: "frzrrT",
                            defaultMessage: "UNLOCK:",
                            description:
                              "Text that gets pre-fixed to a leader unlock condition.",
                          })} ${
                            leader.unlock ??
                            intl.formatMessage({
                              id: "Leaders.Hero.Unlock",
                              defaultMessage: "Have 3 scored objectives.",
                              description: "Unlock condition for all heroes.",
                            })
                          }`}
                        />
                        <hr
                          style={{
                            width: "100%",
                            borderColor: "#555",
                            margin: `${rem(4)} 0`,
                          }}
                        />
                      </>
                    ) : null}
                    <div
                      className="flexColumn"
                      style={{
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                      }}
                    >
                      <FormattedDescription description={leader.description} />
                    </div>
                  </div>
                );
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
                        {gameId && !viewOnly && leader.type !== "AGENT" ? (
                          <div
                            className="flexRow"
                            style={{
                              gap: rem(4),
                              cursor: "pointer",
                            }}
                            onClick={() => {
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
                    break;
                  case "locked":
                    leftLabel = (
                      <div className="flexRow">
                        {leader.name}
                        {viewOnly ? null : (
                          <div
                            className="flexRow"
                            style={{
                              gap: "4px",
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
                            &#128274;
                          </div>
                        )}
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
                              cursor: viewOnly ? "default" : "pointer",
                            }}
                            onClick={
                              viewOnly
                                ? undefined
                                : () => {
                                    updateLeaderStateAsync(
                                      gameId,
                                      leader.id,
                                      "readied"
                                    );
                                  }
                            }
                          >
                            UNPURGE
                          </div>
                        </div>
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
      </div>
      <div
        className="flexColumn"
        style={{ width: "100%", justifyContent: "flex-start" }}
      >
        <CollapsibleSection
          title={
            <FormattedMessage
              id="I54oy6"
              defaultMessage="{count, plural, one {Ability} other {Abilities}}"
              description="Header for a section listing out abilities."
              values={{
                count:
                  faction.abilities.length +
                  (options.expansions.includes("THUNDERS EDGE") ? 1 : 0),
              }}
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
            {faction.abilities.map((ability) => {
              return (
                <AbilitySection
                  key={ability.name}
                  leftLabel={ability.name.toUpperCase()}
                >
                  <FormattedDescription description={ability.description} />
                </AbilitySection>
              );
            })}
            {options.expansions.includes("THUNDERS EDGE") &&
            faction.breakthrough.name ? (
              <AbilitySection
                leftLabel={
                  <div className="flexRow">
                    {faction.breakthrough.name.toUpperCase()}
                    {!viewOnly ? (
                      <div
                        className="flexRow"
                        onClick={() => {
                          const state: ComponentState =
                            !faction.breakthrough.state ||
                            faction.breakthrough.state === "locked"
                              ? "readied"
                              : "locked";
                          updateBreakthroughStateAsync(
                            gameId,
                            faction.id,
                            state
                          );
                        }}
                        style={{
                          gap: rem(4),
                          cursor: "pointer",
                        }}
                      >
                        {!faction.breakthrough.state ||
                        faction.breakthrough.state === "locked" ? (
                          <>&#128274;</>
                        ) : (
                          <>&#128275;</>
                        )}
                      </div>
                    ) : null}
                  </div>
                }
                rightLabel={
                  faction.breakthrough.synergy ? (
                    <div className="flexRow" style={{ gap: rem(2) }}>
                      <TechIcon
                        type={faction.breakthrough.synergy.left}
                        size={16}
                      />
                      <div className="flexRow" style={{ width: rem(24) }}>
                        <SynergySVG />
                      </div>
                      <TechIcon
                        type={faction.breakthrough.synergy.right}
                        size={16}
                      />
                    </div>
                  ) : null
                }
              >
                <FormattedDescription
                  description={faction.breakthrough.description}
                />
              </AbilitySection>
            ) : null}
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
              padding: `0 ${rem(4)} ${rem(4)}`,
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
                  <FormattedDescription description={promissory.description} />
                </AbilitySection>
              );
            })}
          </div>
        </CollapsibleSection>
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
                padding: `0 ${rem(4)} ${rem(4)}`,
                fontSize: rem(14),
              }}
            >
              {factionTechs.map((tech) => {
                return (
                  <FactionTech
                    key={tech.id}
                    tech={tech}
                    faction={innerFaction}
                    viewOnly={viewOnly}
                  />
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
              padding: `0 ${rem(4)} ${rem(4)}`,
              fontSize: rem(14),
            }}
          >
            {faction.units.map((unit, index) => {
              const unitUpgradeTech = unit.upgrade
                ? techs[unit.upgrade]
                : undefined;
              const showUpgrade =
                (unit.upgrade && hasTech(innerFaction, unitUpgradeTech)) ??
                false;
              return (
                <FactionUnit
                  key={unit.name}
                  unit={unit}
                  faction={faction}
                  viewUpgrade={showUpgrade}
                  viewOnly={viewOnly}
                />
              );
            })}
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}

export default function FactionPanel({
  factionId,
  options,
}: {
  factionId: FactionId;
  options: Options;
}) {
  const { openModal } = use(ModalContext);

  return (
    <>
      <div
        className="popupIcon"
        style={{
          fontSize: rem(16),
          zIndex: 1,
        }}
        onClick={() =>
          openModal(
            <FactionPanelModal factionId={factionId} options={options} />
          )
        }
      >
        &#x24D8;
      </div>
    </>
  );
}

function FactionPanelModal({
  factionId,
  options,
}: {
  factionId: FactionId;
  options: Options;
}) {
  const faction = useFaction(factionId);
  if (!faction) {
    return null;
  }
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
        className="flexRow centered extraLargeFont"
        style={{
          backgroundColor: "var(--background-color)",
          border: `1px solid ${getFactionColor(faction)}`,
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
  );
}
