import React, { CSSProperties, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import {
  useAbilities,
  useGameId,
  useGenomes,
  useOptions,
  useParadigms,
  useTech,
  useTechs,
  useUpgrades,
  useViewOnly,
} from "../../context/dataHooks";
import { useFaction, useFactions } from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import {
  useFactionsWithTech,
  useOrderedTechIds,
  useTechState,
} from "../../context/techDataHooks";
import {
  addTechAsync,
  loseTFCardAsync,
  removeTechAsync,
} from "../../dynamic/api";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { TechRow } from "../../TechRow";
import { hasTech, isTechPurged } from "../../util/api/techs";
import {
  getColorForFaction,
  getFactionColor,
  getFactionName,
} from "../../util/factions";
import { techTypeString } from "../../util/strings";
import {
  ableToResearchTech,
  getTechTypeColor,
  sortByTechOrder,
  sortTechs,
} from "../../util/techs";
import { Optional } from "../../util/types/types";
import { objectEntries, objectKeys, rem } from "../../util/util";
import {
  GainAbilitySection,
  GainGenomeSection,
  GainParadigmSection,
  GainUpgradeSection,
} from "../Actions/GainSplicedCard";
import { CollapsibleSection } from "../CollapsibleSection";
import FactionComponents from "../FactionComponents/FactionComponents";
import FactionIcon from "../FactionIcon/FactionIcon";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { Selector } from "../Selector/Selector";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./TechPanel.module.scss";
import TechSelectHoverMenu from "../TechSelectHoverMenu/TechSelectHoverMenu";
import { FullTechSummary, FullTFTechSummary } from "../TechSummary/TechSummary";
import Toggle from "../Toggle/Toggle";
import UnitIcon from "../Units/Icons";
import UnitStats from "../UnitStats/UnitStats";

function FactionTechSection({ openedByDefault }: { openedByDefault: boolean }) {
  const factions = useFactions();
  const gameId = useGameId();
  const techs = useTechs();
  const viewOnly = useViewOnly();
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  const typedTechs = Object.values(techs).filter(
    (tech) => tech.faction && !!factions[tech.faction]
  );
  sortTechs(typedTechs);

  const orderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  const nekroFactionTechIds = objectKeys(factions["Nekro Virus"]?.techs ?? {})
    .filter((id) => {
      const techId = id;
      const techObj = techs[techId];
      if (!techObj) {
        return false;
      }
      return !!techObj.faction;
    })
    .map((id) => id);
  const availableNekroTechs = Object.values(techs ?? {}).filter((tech) => {
    const isResearched = orderedFactions.reduce((isResearched, faction) => {
      return isResearched || hasTech(faction, tech);
    }, false);
    return (
      isResearched &&
      tech.faction &&
      !!factions[tech.faction] &&
      tech.id !== "IIHQ Modernization"
    );
  });

  return (
    <div className={styles.factionTechsColumn}>
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <FormattedMessage
          id="yctdL8"
          defaultMessage="Faction Techs"
          description="Header for a section listing out various faction technologies."
        />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {mapOrderedFactionIds.map((factionId) => {
            const factionTechs = typedTechs.filter(
              (tech) => tech.faction === factionId
            );

            return (
              <LabeledDiv
                key={factionId}
                label={<FactionComponents.Name factionId={factionId} />}
                color={getColorForFaction(factionId)}
                opts={{ fixedWidth: true }}
              >
                <div
                  className="flexRow"
                  style={{
                    left: 0,
                    top: 0,
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      height: "90%",
                      position: "absolute",
                      aspectRatio: 1,
                      opacity: 0.3,
                    }}
                  >
                    <FactionIcon factionId={factionId} size="100%" />
                  </div>
                </div>
                <div
                  className="flexColumn"
                  style={{
                    gap: rem(4),
                    alignItems: "stretch",
                    width: "100%",
                  }}
                >
                  {factionId === "Nekro Virus" ? (
                    <>
                      <Selector
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs.filter(
                          (tech) => tech.id !== nekroFactionTechIds[1]
                        )}
                        toggleItem={(techId, add) => {
                          if (viewOnly) {
                            return;
                          }
                          if (add) {
                            addTechAsync(gameId, factionId, techId);
                          } else {
                            removeTechAsync(gameId, factionId, techId);
                          }
                        }}
                        renderItem={(techId) => {
                          return (
                            <div
                              onClick={
                                viewOnly
                                  ? undefined
                                  : () =>
                                      removeTechAsync(gameId, factionId, techId)
                              }
                            >
                              <TechRow
                                className={`${styles.factionTechRow} ${
                                  styles.selected
                                } ${viewOnly ? styles.viewOnly : ""}`}
                                techId={techId}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechIds[0]}
                      />
                      <Selector
                        hoverMenuLabel="Valefar Assimilator"
                        options={availableNekroTechs.filter(
                          (tech) => tech.id !== nekroFactionTechIds[0]
                        )}
                        toggleItem={(techId, add) => {
                          if (viewOnly) {
                            return;
                          }
                          if (add) {
                            addTechAsync(gameId, factionId, techId);
                          } else {
                            removeTechAsync(gameId, factionId, techId);
                          }
                        }}
                        renderItem={(techId) => {
                          return (
                            <div
                              onClick={
                                viewOnly
                                  ? undefined
                                  : () =>
                                      removeTechAsync(gameId, factionId, techId)
                              }
                            >
                              <TechRow
                                className={`${styles.factionTechRow} ${
                                  styles.selected
                                } ${viewOnly ? styles.viewOnly : ""}`}
                                techId={techId}
                                opts={{ hideSymbols: true, hideIcon: true }}
                              />
                            </div>
                          );
                        }}
                        selectedItem={nekroFactionTechIds[1]}
                      />
                    </>
                  ) : (
                    factionTechs.map((tech) => {
                      const faction = factions[factionId];
                      if (!faction) {
                        return null;
                      }
                      const factionHasTech = hasTech(faction, tech);
                      return (
                        <div
                          key={tech.id}
                          onClick={() => {
                            if (viewOnly) {
                              return;
                            }
                            if (factionHasTech) {
                              removeTechAsync(gameId, factionId, tech.id);
                            } else {
                              addTechAsync(gameId, factionId, tech.id);
                            }
                          }}
                          style={{ maxWidth: "100%" }}
                        >
                          <TechRow
                            className={`${styles.factionTechRow} ${
                              factionHasTech ? styles.selected : ""
                            } ${viewOnly ? styles.viewOnly : ""}`}
                            techId={tech.id}
                            opts={{
                              hideSymbols: true,
                              hideIcon: true,
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </div>
              </LabeledDiv>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface NumFactionsCSS extends CSSProperties {
  "--num-factions": number;
}

function TechUpdateRow({ techId }: { techId: TechId }) {
  const factionsWithTech = useFactionsWithTech(techId);
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const techState = useTechState(techId);

  const numFactions = mapOrderedFactionIds.length;

  const isResearched = factionsWithTech.size > 0 && techState !== "purged";

  return (
    <React.Fragment>
      <TechRow
        techId={techId}
        opts={{
          hideSymbols: true,
          fade: techState === "purged" || !isResearched,
        }}
      />
      {techState === "purged" ? (
        <div style={{ opacity: 0.5 }}>PURGED</div>
      ) : (
        <div
          className={styles.factionIconRow}
          style={
            {
              "--num-factions": numFactions,
            } as NumFactionsCSS
          }
        >
          {mapOrderedFactionIds.map((factionId) => {
            return (
              <TechUpdateIcon
                key={factionId}
                factionId={factionId}
                techId={techId}
              />
            );
          })}
        </div>
      )}
    </React.Fragment>
  );
}

function TechUpdateIcon({
  factionId,
  techId,
}: {
  factionId: FactionId;
  techId: TechId;
}) {
  // const factionTechs = useFactionTechs(factionId);
  const faction = useFaction(factionId);
  const factionIds = useOrderedFactionIds("MAP");
  const tech = useTech(techId);
  // const canResearch = useCanResearch(factionId, techId);
  // const factionHasTech = useFactionHasTech(factionId, techId);
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  const factionHasTech = hasTech(faction, tech);
  const canResearch = ableToResearchTech(tech, faction, factionIds);

  const ableToResearch = factionHasTech || canResearch;
  if (!ableToResearch) {
    return <div key={factionId}></div>;
  }
  return (
    <div
      key={factionId}
      className={`flexRow ${styles.selected} ${styles.factionIconWrapper} ${
        viewOnly ? styles.viewOnly : ""
      }`}
      onClick={
        viewOnly
          ? undefined
          : () => {
              if (factionHasTech) {
                removeTechAsync(gameId, factionId, techId);
              } else {
                addTechAsync(gameId, factionId, techId);
              }
            }
      }
    >
      <div
        className={`
                  ${styles.factionIcon} ${
          factionHasTech ? styles.selected : ""
        } ${viewOnly ? styles.viewOnly : ""}`}
        style={
          {
            "--color": getColorForFaction(factionId),
          } as ExtendedCSS
        }
      >
        <FactionIcon factionId={factionId} size="100%" />
      </div>
    </div>
  );
}

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

function TechSection({
  type,
  openedByDefault = false,
}: {
  type: TechType;
  openedByDefault?: boolean;
}) {
  const orderedTechIds = useOrderedTechIds(
    (tech) => tech.type === type && !tech.faction
  );
  const intl = useIntl();

  const [collapsed, setCollapsed] = useState(!openedByDefault);

  return (
    <div
      className={styles.techColumn}
      style={
        {
          "--color": getTechTypeColor(type),
        } as ExtendedCSS
      }
    >
      <div
        className={styles.techTitle}
        onClick={() => setCollapsed(!collapsed)}
      >
        <TechIcon type={type} size={20} />
        {techTypeString(type, intl)}
        <TechIcon type={type} size={20} />
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {orderedTechIds.map((techId) => {
            return <TechUpdateRow key={techId} techId={techId} />;
          })}
        </div>
      </div>
    </div>
  );
}

function UpgradeTechSection() {
  const upgradeTechIds = useOrderedTechIds(
    (tech) => tech.type === "UPGRADE" && !tech.faction
  );
  const intl = useIntl();

  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={`${styles.techColumn} ${styles.lastColumn}`}>
      <div
        className="centered largeFont"
        onClick={() => setCollapsed(!collapsed)}
      >
        {techTypeString("UPGRADE", intl)}
      </div>
      <div
        className={`${styles.collapsible} ${collapsed ? styles.collapsed : ""}`}
      >
        <div className={styles.collapsibleTechColumn}>
          {upgradeTechIds.map((techId) => {
            return <TechUpdateRow key={techId} techId={techId} />;
          })}
        </div>
      </div>
    </div>
  );
}

function TechsByFaction({
  factionId,
  openedByDefault,
}: {
  factionId: FactionId;
  openedByDefault: boolean;
}) {
  const abilities = useAbilities();
  const genomes = useGenomes();
  const paradigms = useParadigms();
  const upgrades = useUpgrades();
  const factions = useFactions();
  const techs = useTechs();
  const options = useOptions();
  const gameId = useGameId();
  const intl = useIntl();
  const viewOnly = useViewOnly();

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const ownedTechs = objectEntries(faction.techs ?? {})
    .filter(([_, tech]) => {
      return tech.state !== "purged";
    })
    .map(([techId, _]) => techId);
  const factionTechs = objectEntries(faction.techs ?? {})
    .filter(([_, tech]) => {
      return tech.state !== "purged";
    })
    .map(([techId, _]) => techs[techId])
    .filter((tech) => !!tech && tech.state !== "purged") as Tech[];

  sortTechs(factionTechs);

  const factionAbilities = Object.values(abilities).filter(
    (ability) => ability.owner === factionId
  );
  const factionGenomes = Object.values(genomes).filter(
    (genome) => genome.owner === factionId
  );
  const factionUpgrades = Object.values(upgrades).filter(
    (upgrade) => upgrade.owner === factionId
  );
  const factionParadigms = Object.values(paradigms).filter(
    (paradigm) => paradigm.owner === factionId
  );

  function getResearchableTechs(faction: Faction) {
    if (faction.id === "Nekro Virus") {
      const nekroTechs = new Set<TechId>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        objectKeys(otherFaction.techs).forEach((id) => {
          const tech = techs[id];
          if (hasTech(otherFaction, tech) && !hasTech(faction, tech)) {
            nekroTechs.add(id);
          }
        });
      });
      return Array.from(nekroTechs).map((techId) => techs[techId] as Tech);
    }
    const replaces: TechId[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (isTechPurged(faction, tech)) {
        return false;
      }
      if (hasTech(faction, tech)) {
        return false;
      }
      if (
        faction.id !== "Nekro Virus" &&
        tech.faction &&
        faction.id !== tech.faction
      ) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    return availableTechs.filter((tech) => !replaces.includes(tech.id));
  }

  return (
    <CollapsibleSection
      title={
        <div
          className="flexRow"
          style={{
            justifyContent: "center",
            fontSize: rem(18),
            whiteSpace: "nowrap",
          }}
        >
          <FactionIcon factionId={factionId} size={20} />
          {getFactionName(faction)}
          <FactionIcon factionId={factionId} size={20} />
        </div>
      }
      openedByDefault={openedByDefault}
      style={{ border: `1px solid ${getFactionColor(faction)}` }}
    >
      <div
        className="flexColumn"
        style={{
          position: "relative",
          height: "100%",
          justifyContent: "flex-start",
          padding: `0 ${rem(4)}`,
        }}
      >
        <div
          className="flexRow"
          style={{
            top: 0,
            left: 0,
            position: "absolute",
            width: "100%",
            height: "100%",
            opacity: 0.1,
            userSelect: "none",
            zIndex: 0,
          }}
        >
          <FactionIcon factionId={factionId} size={120} />
        </div>
        <div
          className="flexRow"
          style={{
            width: "100%",
            zIndex: 1,
            borderBottom: "1px solid #555",
          }}
        >
          {options.expansions.includes("TWILIGHTS FALL") ? (
            <FullTFTechSummary
              techs={techs}
              ownedTechs={ownedTechs}
              factionId={factionId}
            />
          ) : (
            <FullTechSummary
              techs={techs}
              ownedTechs={ownedTechs}
              factionId={factionId}
            />
          )}
        </div>
        {options.expansions.includes("TWILIGHTS FALL") ? (
          <TFTechList factionId={factionId} />
        ) : (
          <TechList factionId={factionId} />
        )}
      </div>
    </CollapsibleSection>
  );
}

function TechList({ factionId }: { factionId: FactionId }) {
  const factions = useFactions();
  const gameId = useGameId();
  const intl = useIntl();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const factionTechs = objectEntries(faction.techs ?? {})
    .filter(([_, tech]) => {
      return tech.state !== "purged";
    })
    .map(([techId, _]) => techs[techId])
    .filter((tech) => !!tech && tech.state !== "purged") as Tech[];

  sortTechs(factionTechs);

  function getResearchableTechs(faction: Faction) {
    if (faction.id === "Nekro Virus") {
      const nekroTechs = new Set<TechId>();
      Object.values(factions ?? {}).forEach((otherFaction) => {
        objectKeys(otherFaction.techs).forEach((id) => {
          const tech = techs[id];
          if (hasTech(otherFaction, tech) && !hasTech(faction, tech)) {
            nekroTechs.add(id);
          }
        });
      });
      return Array.from(nekroTechs).map((techId) => techs[techId] as Tech);
    }
    const replaces: TechId[] = [];
    const availableTechs = Object.values(techs ?? {}).filter((tech) => {
      if (isTechPurged(faction, tech)) {
        return false;
      }
      if (hasTech(faction, tech)) {
        return false;
      }
      if (
        faction.id !== "Nekro Virus" &&
        tech.faction &&
        faction.id !== tech.faction
      ) {
        return false;
      }
      if (tech.type === "UPGRADE" && tech.replaces) {
        replaces.push(tech.replaces);
      }
      return true;
    });
    return availableTechs.filter((tech) => !replaces.includes(tech.id));
  }

  return (
    <>
      <div className={styles.factionTechList}>
        {factionTechs.map((tech) => {
          return (
            <TechRow
              key={tech.id}
              techId={tech.id}
              removeTech={
                viewOnly
                  ? undefined
                  : (techId) => {
                      removeTechAsync(gameId, factionId, techId);
                    }
              }
              opts={{ hideSymbols: true }}
            />
          );
        })}
      </div>
      {viewOnly ? null : (
        <div
          className="flexRow"
          style={{
            justifyContent: "flex-start",
            alignItems: "flex-start",
            paddingLeft: rem(8),
            width: "100%",
          }}
        >
          <TechSelectHoverMenu
            factionId={factionId}
            label={intl.formatMessage({
              id: "3qIvsL",
              description: "Label on a hover menu used to research tech.",
              defaultMessage: "Research Tech",
            })}
            techs={getResearchableTechs(faction)}
            selectTech={(tech) => {
              addTechAsync(gameId, factionId, tech.id);
            }}
          />
        </div>
      )}
    </>
  );
}

function TFTechList({ factionId }: { factionId: FactionId }) {
  const abilities = useAbilities();
  const factions = useFactions();
  const gameId = useGameId();
  const genomes = useGenomes();
  const paradigms = useParadigms();
  const techs = useTechs();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  const faction = factions[factionId];
  if (!faction) {
    return null;
  }

  const factionAbilities = Object.values(abilities).filter(
    (ability) => ability.owner === factionId
  );
  sortByTechOrder(factionAbilities);
  const factionGenomes = Object.values(genomes).filter(
    (genome) => genome.owner === factionId
  );
  const factionUpgrades = Object.values(upgrades).filter(
    (upgrade) => upgrade.owner === factionId
  );
  const factionParadigms = Object.values(paradigms).filter(
    (paradigm) => paradigm.owner === factionId
  );

  let antimatter: Optional<Tech>;
  let wavelength: Optional<Tech>;
  for (const tech of Object.values(techs)) {
    if (tech.faction === factionId) {
      if (tech.id.includes("Antimatter")) {
        antimatter = tech;
      }
      if (tech.id.includes("Wavelength")) {
        wavelength = tech;
      }
    }
  }

  return (
    <>
      <div className="flexRow" style={{ zIndex: 1 }}>
        {antimatter ? (
          <Toggle
            selected={hasTech(faction, antimatter)}
            toggleFn={(prevValue) => {
              if (prevValue) {
                removeTechAsync(gameId, factionId, antimatter.id);
              } else {
                addTechAsync(gameId, factionId, antimatter.id);
              }
            }}
          >
            {antimatter.name}
          </Toggle>
        ) : null}
        {wavelength ? (
          <Toggle
            selected={hasTech(faction, wavelength)}
            toggleFn={(prevValue) => {
              if (prevValue) {
                removeTechAsync(gameId, factionId, wavelength.id);
              } else {
                addTechAsync(gameId, factionId, wavelength.id);
              }
            }}
          >
            {wavelength.name}
          </Toggle>
        ) : null}
      </div>
      <div className={styles.TFFactionTechList}>
        <div className="flexColumn" style={{ width: "100%" }}>
          <div className={styles.TFFactionAbilityList}>
            {factionAbilities.map((ability) => {
              return (
                <SelectableRow
                  key={ability.id}
                  itemId={ability.id}
                  removeItem={
                    viewOnly
                      ? undefined
                      : () =>
                          loseTFCardAsync(gameId, factionId, {
                            ability: ability.id,
                            type: "ABILITY",
                          })
                  }
                  viewOnly={viewOnly}
                  style={{ fontSize: rem(12) }}
                >
                  <InfoRow
                    infoTitle={ability.name}
                    infoContent={
                      <FormattedDescription description={ability.description} />
                    }
                  >
                    <div style={{ color: getTechTypeColor(ability.type) }}>
                      {ability.name}
                    </div>
                  </InfoRow>
                </SelectableRow>
              );
            })}
          </div>
          <GainAbilitySection
            factionId={factionId}
            gainedAbilities={[]}
            numToGain={1}
          />
        </div>
        <div className="flexColumn" style={{ width: "100%" }}>
          <div className={styles.TFFactionAbilityList}>
            {factionGenomes.map((genome) => {
              return (
                <SelectableRow
                  key={genome.id}
                  itemId={genome.id}
                  removeItem={
                    viewOnly
                      ? undefined
                      : () =>
                          loseTFCardAsync(gameId, factionId, {
                            genome: genome.id,
                            type: "GENOME",
                          })
                  }
                  viewOnly={viewOnly}
                  style={{ fontSize: rem(12) }}
                >
                  <InfoRow
                    infoTitle={genome.name}
                    infoContent={
                      <FormattedDescription description={genome.description} />
                    }
                  >
                    {genome.name}
                  </InfoRow>
                </SelectableRow>
              );
            })}
          </div>
          <GainGenomeSection
            factionId={factionId}
            gainedGenomes={[]}
            numToGain={1}
          />
        </div>
        <div className="flexColumn" style={{ width: "100%" }}>
          <div className={styles.TFFactionAbilityList}>
            {factionUpgrades.map((upgrade) => {
              return (
                <SelectableRow
                  key={upgrade.id}
                  itemId={upgrade.id}
                  removeItem={
                    viewOnly
                      ? undefined
                      : () =>
                          loseTFCardAsync(gameId, factionId, {
                            upgrade: upgrade.id,
                            type: "UNIT_UPGRADE",
                          })
                  }
                  viewOnly={viewOnly}
                  style={{ fontSize: rem(12) }}
                >
                  <InfoRow
                    infoTitle={
                      <div
                        className="flexRow"
                        style={{ fontSize: rem(40), gap: rem(20) }}
                      >
                        {upgrade.name}
                        <UnitIcon type={upgrade.unitType} size={40} />
                      </div>
                    }
                    infoContent={
                      <div
                        className="myriadPro flexColumn"
                        style={{
                          width: "100%",
                          padding: rem(4),
                          whiteSpace: "pre-line",
                          textAlign: "center",
                          fontSize: rem(32),
                          gap: rem(32),
                        }}
                      >
                        <FormattedDescription
                          description={upgrade.description}
                        />
                        <div className="flexColumn" style={{ width: "100%" }}>
                          {upgrade.abilities.length > 0 ? (
                            <div
                              className={styles.UpgradeTechAbilities}
                              style={{
                                whiteSpace: "nowrap",
                                fontFamily: "Slider",
                                paddingLeft: rem(8),
                                rowGap: rem(2),
                                width: "100%",
                              }}
                            >
                              {upgrade.abilities.map((ability) => {
                                return (
                                  <div key={ability}>
                                    {ability.toUpperCase()}
                                  </div>
                                );
                              })}
                            </div>
                          ) : null}
                          <UnitStats
                            stats={upgrade.stats}
                            type={upgrade.unitType}
                            className={styles.UnitStats}
                          />
                        </div>
                      </div>
                    }
                  >
                    <div
                      className="flexRow"
                      style={{ position: "relative", gap: rem(4) }}
                    >
                      {upgrade.name}
                      <UnitIcon type={upgrade.unitType} size="1em" />
                    </div>
                  </InfoRow>
                </SelectableRow>
              );
            })}
          </div>
          <GainUpgradeSection
            factionId={factionId}
            gainedUpgrades={[]}
            numToGain={1}
          />
        </div>
        <div className="flexColumn" style={{ width: "100%" }}>
          <div className={styles.TFFactionAbilityList}>
            {factionParadigms.map((paradigm) => {
              return (
                <SelectableRow
                  key={paradigm.id}
                  itemId={paradigm.id}
                  removeItem={
                    viewOnly
                      ? undefined
                      : () =>
                          loseTFCardAsync(gameId, factionId, {
                            paradigm: paradigm.id,
                            type: "PARADIGM",
                          })
                  }
                  viewOnly={viewOnly}
                  style={{ fontSize: rem(12) }}
                >
                  <InfoRow
                    infoTitle={paradigm.name}
                    infoContent={
                      <FormattedDescription
                        description={paradigm.description}
                      />
                    }
                  >
                    {paradigm.name}
                  </InfoRow>
                </SelectableRow>
              );
            })}
          </div>
          <GainParadigmSection
            factionId={factionId}
            gainedParadigms={[]}
            numToGain={1}
          />
        </div>
      </div>
    </>
  );
}

interface TechGridProperties extends CSSProperties {
  "--num-columns": number;
}

export default function TechPanel({ byFaction }: { byFaction: boolean }) {
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");

  const techGridProperties: TechGridProperties = {
    "--num-columns": byFaction ? Math.ceil(mapOrderedFactionIds.length / 2) : 4,
  };
  return (
    <div className={styles.techGrid} style={techGridProperties}>
      {byFaction ? (
        mapOrderedFactionIds.map((factionId, index) => {
          return (
            <TechsByFaction
              key={factionId}
              factionId={factionId}
              openedByDefault={index === 0}
            />
          );
        })
      ) : (
        <>
          <FactionTechSection openedByDefault />
          <TechSection type="GREEN" />
          <TechSection type="BLUE" />
          <TechSection type="YELLOW" />
          <TechSection type="RED" />
          <UpgradeTechSection />
        </>
      )}
    </div>
  );
}
