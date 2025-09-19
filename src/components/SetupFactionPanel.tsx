import { useSearchParams } from "next/navigation";
import { PropsWithChildren, ReactNode } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { buildBaseLeaders, buildBaseTechs } from "../data/GameData";
import { useSharedModal } from "../data/SharedModal";
import SynergySVG from "../icons/ui/Synergy";
import { leaderTypeString } from "../util/strings";
import { rem } from "../util/util";
import { CollapsibleSection } from "./CollapsibleSection";
import FactionIcon from "./FactionIcon/FactionIcon";
import FormattedDescription from "./FormattedDescription/FormattedDescription";
import LabeledLine from "./LabeledLine/LabeledLine";
import styles from "./SetupFactionPanel.module.scss";
import TechIcon from "./TechIcon/TechIcon";
import UnitIcon from "./Units/Icons";
import UnitType from "./Units/Types";
import UnitStats from "./UnitStats/UnitStats";

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

function FactionPanelContent({
  faction,
  options,
}: {
  faction: BaseFaction;
  options: Options;
}) {
  const searchParams = useSearchParams();
  const gameId = searchParams?.get("gameid");
  const intl = useIntl();
  const techs = buildBaseTechs(options, intl);
  const leaders = buildBaseLeaders(options, intl);

  const factionTechs = Object.values(techs).filter(
    (tech) => tech.faction === faction.id
  );
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
                let state: LeaderState = "readied";
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
                            borderColor: "var(--neutral-border)",
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
                    leftLabel = (
                      <div className="flexRow" style={{ gap: rem(6) }}>
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
                              gap: rem(4),
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              if (!gameId) {
                                return;
                              }
                              // updateLeaderStateAsync(
                              //   gameId,
                              //   factionId,
                              //   leader.type,
                              //   "locked"
                              // );
                            }}
                          >
                            &#128275;
                          </div>
                        ) : null}
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
                      </div>
                    }
                    label={
                      tech.type === "UPGRADE" ? (
                        <UnitIcon
                          type={tech.unitType}
                          size={18}
                          color="var(--neutral-border)"
                        />
                      ) : null
                    }
                    rightLabel={
                      <div className="flexRow" style={{ gap: rem(4) }}>
                        {tech.prereqs.map((prereq, index) => {
                          return (
                            <TechIcon key={index} type={prereq} size={20} />
                          );
                        })}
                      </div>
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
                              return (
                                <div key={ability}>{ability.toUpperCase()}</div>
                              );
                            })}
                          </div>
                        ) : null}
                        <UnitStats
                          stats={tech.stats}
                          type={tech.unitType}
                          size={rem(82)}
                        />
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
              // display: "grid",
              // gridAutoFlow: "row",
              // gridTemplateRows: `repeat(${faction.abilities.length}, 1fr)`,
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
                  <FormattedDescription description={ability.description} />
                </AbilitySection>
              );
            })}
            {options.expansions.includes("THUNDERS EDGE") &&
            faction.breakthrough?.name ? (
              <AbilitySection
                leftLabel={
                  <div className="flexRow">
                    {faction.breakthrough.name.toUpperCase()}
                  </div>
                }
                rightLabel={
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
                  <FormattedDescription description={promissory.description} />
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
            if (
              unit.expansion !== "BASE" &&
              !options.expansions.includes(unit.expansion)
            ) {
              return null;
            }
            let leftLabel: ReactNode = unit.name;
            return (
              <AbilitySection
                key={index}
                leftLabel={leftLabel}
                label={
                  <UnitIcon
                    type={unit.type}
                    color="var(--neutral-border)"
                    size={18}
                  />
                }
                rightLabel={<UnitType type={unit.type} />}
              >
                <FormattedDescription description={localUnit.description} />
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
                <UnitStats
                  stats={localUnit.stats}
                  type={localUnit.type}
                  size={rem(82)}
                />
              </AbilitySection>
            );
          })}
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default function SetupFactionPanel({
  faction,
  options,
}: {
  faction: BaseFaction;
  options: Options;
}) {
  const { openModal } = useSharedModal();

  return (
    <>
      <div
        className="popupIcon"
        style={{
          fontSize: rem(16),
        }}
        onClick={() =>
          openModal(
            <SetupFactionPanelModal faction={faction} options={options} />
          )
        }
      >
        &#x24D8;
      </div>
    </>
  );
}

function SetupFactionPanelModal({
  faction,
  options,
}: {
  faction: BaseFaction;
  options: Options;
}) {
  return (
    <div
      className="flexColumn"
      style={{
        whiteSpace: "normal",
        textShadow: "none",
        width: `clamp(80vw, ${rem(1200)}, calc(100vw - ${rem(24)}}))`,
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
        }}
      >
        <FactionIcon factionId={faction.id} size={36} />
        {faction.name}
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
