import { CSSProperties, ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import {
  useAbilities,
  useCurrentTurn,
  useGenomes,
  useParadigms,
  useUpgrades,
  useViewOnly,
} from "../../context/dataHooks";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import AbilitySVG from "../../icons/twilightsfall/ability";
import GenomeSVG from "../../icons/twilightsfall/genome";
import ParadigmSVG from "../../icons/twilightsfall/paradigm";
import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { getGainedTFCardsByType } from "../../util/actionLog";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { getTechTypeColor } from "../../util/techs";
import { objectEntries, rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import IconDiv from "../LabeledDiv/IconDiv";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import AbilityIcon from "../PlanetIcons/AbilityIcon";
import GenomeIcon from "../PlanetIcons/GenomeIcon";
import ParadigmIcon from "../PlanetIcons/ParadigmIcon";
import UpgradeIcon from "../PlanetIcons/UpgradeIcon";
import { Selector } from "../Selector/Selector";
import AbilitySelectMenu from "../Splice/AbilitySelectMenu";
import TechResearchSection from "../TechResearchSection/TechResearchSection";
import UnitIcon from "../Units/Icons";
import UnitStats from "../UnitStats/UnitStats";
import styles from "./GainSplicedCard.module.scss";
import GenomeRow from "./GenomeRow";

interface NumberToGain {
  abilities?: number;
  genomes?: number;
  paradigms?: number;
  upgrades?: number;
  total?: number;
}

function canGainMoreCards(
  numToGain: NumberToGain,
  cardsByType: GainedCardsByType,
) {
  const totalGained =
    cardsByType.abilities.length +
    cardsByType.genomes.length +
    cardsByType.paradigms.length +
    cardsByType.upgrades.length +
    cardsByType.techs.length;
  if (numToGain.total) {
    return totalGained < numToGain.total;
  }

  const totalToGain =
    (numToGain.abilities ?? 0) +
    (numToGain.genomes ?? 0) +
    (numToGain.paradigms ?? 0) +
    (numToGain.upgrades ?? 0);

  if (totalGained === totalToGain) {
    return false;
  }

  if (
    numToGain.abilities &&
    cardsByType.abilities.length < numToGain.abilities
  ) {
    return true;
  }
  if (numToGain.genomes && cardsByType.genomes.length < numToGain.genomes) {
    return true;
  }
  if (
    numToGain.paradigms &&
    cardsByType.paradigms.length < numToGain.paradigms
  ) {
    return true;
  }
  if (numToGain.upgrades && cardsByType.upgrades.length < numToGain.upgrades) {
    return true;
  }
  return false;
}

export default function GainTFCard({
  factionId,
  steal,
  style,
  numToGain,
  splice,
}: {
  factionId: FactionId;
  steal?: boolean;
  splice?: boolean;
  style?: CSSProperties;
  numToGain: NumberToGain;
}) {
  const currentTurn = useCurrentTurn();

  const gainedCardsByType = getGainedTFCardsByType(currentTurn, factionId);

  const canGainMore = canGainMoreCards(numToGain, gainedCardsByType);

  return (
    <div
      className="flexColumn"
      style={{ width: "fit-content", alignItems: "flex-start" }}
    >
      <GainedCardsSection
        factionId={factionId}
        gainedCardsByType={gainedCardsByType}
        splice={splice}
      />
      {canGainMore ? (
        <div className="flexColumn" style={{ alignItems: "flex-start" }}>
          <GainAbilitySection
            gainedAbilities={gainedCardsByType.abilities}
            factionId={factionId}
            numToGain={numToGain.abilities}
            steal={steal}
            style={style}
          />
          <GainGenomeSection
            gainedGenomes={gainedCardsByType.genomes}
            factionId={factionId}
            numToGain={numToGain.genomes}
            steal={steal}
            style={style}
          />
          <GainParadigmSection
            gainedParadigms={gainedCardsByType.paradigms}
            factionId={factionId}
            numToGain={numToGain.paradigms}
            steal={steal}
            style={style}
          />
          <GainUpgradeSection
            gainedUpgrades={gainedCardsByType.upgrades}
            factionId={factionId}
            numToGain={numToGain.upgrades}
            steal={steal}
            style={style}
          />
          {splice ? (
            <TechResearchSection
              factionId={factionId}
              numTechs={2}
              hideResearchedTechs
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

interface GainedCardsByType {
  abilities: TFAbilityId[];
  genomes: TFGenomeId[];
  paradigms: TFParadigmId[];
  upgrades: TFUnitUpgradeId[];
  techs: TechId[];
}

function GainedCardsSection({
  factionId,
  gainedCardsByType,
  splice,
}: {
  factionId: FactionId;
  splice?: boolean;
  gainedCardsByType: GainedCardsByType;
}) {
  const abilities = useAbilities();
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const paradigms = useParadigms();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  if (
    gainedCardsByType.abilities.length === 0 &&
    gainedCardsByType.genomes.length === 0 &&
    gainedCardsByType.paradigms.length === 0 &&
    gainedCardsByType.upgrades.length === 0 &&
    (!splice || gainedCardsByType.techs.length === 0)
  ) {
    return null;
  }

  const innerContent = (
    <>
      {gainedCardsByType.abilities.length > 0 ? (
        <IconDiv icon={<AbilityIcon />} blur>
          {gainedCardsByType.abilities.map((abilityId) => {
            const ability = abilities[abilityId];
            if (!ability) {
              return null;
            }
            return (
              <SelectableRow
                key={abilityId}
                itemId={abilityId}
                removeItem={() =>
                  dataUpdate(
                    Events.LoseTFCardEvent(factionId, {
                      ability: abilityId,
                      type: "ABILITY",
                    }),
                  )
                }
                viewOnly={viewOnly}
                style={{ width: "100%" }}
              >
                <div
                  className="flexRow"
                  style={{
                    justifyContent: "space-between",
                    width: "100%",
                    gap: rem(4),
                  }}
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
                </div>
              </SelectableRow>
            );
          })}
        </IconDiv>
      ) : null}
      {gainedCardsByType.genomes.length > 0 ? (
        <IconDiv icon={<GenomeIcon />} blur>
          {gainedCardsByType.genomes.map((genomeId) => {
            const genome = genomes[genomeId];
            if (!genome) {
              return null;
            }
            return <GenomeRow key={genome.id} genome={genome} />;
          })}
        </IconDiv>
      ) : null}
      {gainedCardsByType.upgrades.length > 0 ? (
        <IconDiv icon={<UpgradeIcon />} blur>
          {gainedCardsByType.upgrades.map((upgradeId) => {
            const upgrade = upgrades[upgradeId];
            if (!upgrade) {
              return null;
            }
            return (
              <SelectableRow
                key={upgradeId}
                itemId={upgradeId}
                removeItem={() =>
                  dataUpdate(
                    Events.LoseTFCardEvent(factionId, {
                      upgrade: upgradeId,
                      type: "UNIT_UPGRADE",
                    }),
                  )
                }
                viewOnly={viewOnly}
              >
                <InfoRow
                  infoTitle={
                    <div
                      className="flexRow"
                      style={{ fontSize: rem(40), gap: rem(20) }}
                    >
                      {upgrade.name}
                      <UnitIcon type={upgrade.unitType} size="1em" />
                    </div>
                  }
                  infoContent={
                    <div
                      className="flexColumn"
                      style={{
                        width: "100%",
                        padding: rem(4),
                        whiteSpace: "pre-line",
                        textAlign: "center",
                        fontSize: rem(32),
                        gap: rem(32),
                      }}
                    >
                      <FormattedDescription description={upgrade.description} />
                      <div className="flexColumn" style={{ width: "100%" }}>
                        {upgrade.abilities.length > 0 ? (
                          <div
                            className={styles.UpgradeTechAbilities}
                            style={{
                              whiteSpace: "nowrap",
                              fontFamily: "var(--main-font)",

                              paddingLeft: rem(8),
                              rowGap: rem(2),
                              width: "100%",
                            }}
                          >
                            {upgrade.abilities.map((ability) => {
                              return (
                                <div key={ability}>{ability.toUpperCase()}</div>
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
                    style={{ position: "relative", gap: rem(8) }}
                  >
                    {upgrade.name}
                    <UnitIcon type={upgrade.unitType} size="1em" />
                  </div>
                </InfoRow>
              </SelectableRow>
            );
          })}
        </IconDiv>
      ) : null}
      {gainedCardsByType.paradigms.length > 0 ? (
        <IconDiv icon={<ParadigmIcon />} blur>
          {gainedCardsByType.paradigms.map((paradigmId) => {
            const paradigm = paradigms[paradigmId];
            if (!paradigm) {
              return null;
            }
            return (
              <SelectableRow
                key={paradigmId}
                itemId={paradigmId}
                removeItem={() =>
                  dataUpdate(
                    Events.LoseTFCardEvent(factionId, {
                      paradigm: paradigmId,
                      type: "PARADIGM",
                    }),
                  )
                }
                viewOnly={viewOnly}
                style={{ width: "100%" }}
              >
                <InfoRow
                  infoTitle={paradigm.name}
                  infoContent={
                    <FormattedDescription description={paradigm.description} />
                  }
                >
                  {paradigm.name}
                </InfoRow>
              </SelectableRow>
            );
          })}
        </IconDiv>
      ) : null}
      {splice && gainedCardsByType.techs.length > 0 ? (
        <TechResearchSection
          factionId={factionId}
          numTechs={gainedCardsByType.techs.length}
        />
      ) : null}
    </>
  );

  // if (hideWrapper) {
  return <div className="flexColumn">{innerContent}</div>;
  // }

  return <LabeledDiv label="TODO">{innerContent}</LabeledDiv>;
}

export function GainAbilitySection({
  factionId,
  gainedAbilities,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  gainedAbilities: TFAbilityId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();

  const abilitiesToGain = (numToGain ?? 0) - gainedAbilities.length;

  if (abilitiesToGain < 1) {
    return null;
  }

  return (
    <AbilitySelectMenu
      filter={(ability) => {
        if (steal) {
          return !!ability.owner && ability.owner !== factionId;
        }
        return !ability.owner;
      }}
      label={
        steal ? (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "1em" }}>
              <AbilitySVG />
            </span>
            <FormattedMessage
              id="Components.Steal Ability.Title"
              description="Title of Component: Steal Ability"
              defaultMessage="Steal Ability"
            />
          </div>
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "1em" }}>
              <AbilitySVG />
            </span>
            <FormattedMessage
              id="Components.Gain Ability.Title"
              description="Title of Component: Gain Ability"
              defaultMessage="Gain Ability"
            />
          </div>
        )
      }
      selectAbility={(ability: TFAbilityId) => {
        dataUpdate(
          Events.GainTFCardEvent(factionId, {
            ability,
            type: "ABILITY",
          }),
        );
      }}
      style={style}
    />
  );
}

function InnerUpgradeSelectMenu({
  upgrades,
  label,
  selectUpgrade,
  outerCloseFn,
}: {
  upgrades: TFUnitUpgrade[];
  label: ReactNode;
  selectUpgrade: (upgrade: TFUnitUpgrade) => void;
  outerCloseFn: () => void;
}) {
  const viewOnly = useViewOnly();

  if (upgrades.length === 0) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={label}
      buttonStyle={{ fontSize: rem(14) }}
      borderColor={getTechTypeColor("UPGRADE")}
      renderProps={(innerCloseFn) => (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(8, upgrades.length)}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {upgrades.map((upgrade) => {
            return (
              <button
                key={upgrade.id}
                onClick={(e) => {
                  e.stopPropagation();
                  innerCloseFn();
                  outerCloseFn();
                  selectUpgrade(upgrade);
                }}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: rem(16),
                  gap: rem(8),
                }}
                disabled={viewOnly}
              >
                {upgrade.name}
                <UnitIcon type={upgrade.unitType} size={16} />
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}

// TODO: Add faction icons (simplified?).
export function GainGenomeSection({
  factionId,
  gainedGenomes,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  gainedGenomes: TFGenomeId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const viewOnly = useViewOnly();

  let availableGenomes = Object.values(genomes)
    .filter((genome) => !genome.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableGenomes = Object.values(genomes)
      .filter((genome) => !!genome.owner && genome.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const genomesToGain = (numToGain ?? 0) - gainedGenomes.length;

  if (genomesToGain < 1) {
    return null;
  }

  return (
    <Selector
      hoverMenuLabel={
        steal ? (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "0.61em" }}>
              <GenomeSVG />
            </span>
            <FormattedMessage
              id="Components.Steal Genome.Title"
              description="Title of Component: Steal Genome"
              defaultMessage="Steal Genome"
            />
          </div>
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "0.61em" }}>
              <GenomeSVG />
            </span>
            <FormattedMessage
              id="Components.Gain Genome.Title"
              description="Title of Component: Gain Genome"
              defaultMessage="Gain Genome"
            />
          </div>
        )
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableGenomes}
      toggleItem={(genomeId, add) => {
        if (add) {
          dataUpdate(
            Events.GainTFCardEvent(factionId, {
              genome: genomeId,
              type: "GENOME",
            }),
          );
        }
      }}
      viewOnly={viewOnly}
      style={style}
      itemsPerColumn={11}
    />
  );
}

// TODO: Add faction icons.
export function GainParadigmSection({
  factionId,
  gainedParadigms,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  gainedParadigms: TFParadigmId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const paradigms = useParadigms();
  const viewOnly = useViewOnly();

  let availableParadigms = Object.values(paradigms)
    .filter((paradigm) => !paradigm.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableParadigms = Object.values(paradigms)
      .filter((paradigm) => !!paradigm.owner && paradigm.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const paradigmsToGain = (numToGain ?? 0) - gainedParadigms.length;

  if (paradigmsToGain < 1) {
    return null;
  }

  return (
    <Selector
      hoverMenuLabel={
        steal ? (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "0.61em" }}>
              <ParadigmSVG />
            </span>
            <FormattedMessage
              id="Components.Steal Paradigm.Title"
              description="Title of Component: Steal Paradigm"
              defaultMessage="Steal Paradigm"
            />
          </div>
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "0.64em" }}>
              <ParadigmSVG />
            </span>
            <FormattedMessage
              id="Components.Gain Paradigm.Title"
              description="Title of Component: Gain Paradigm"
              defaultMessage="Gain Paradigm"
            />
          </div>
        )
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableParadigms}
      toggleItem={(paradigmId, add) => {
        if (add) {
          dataUpdate(
            Events.GainTFCardEvent(factionId, {
              paradigm: paradigmId,
              type: "PARADIGM",
            }),
          );
        }
      }}
      viewOnly={viewOnly}
      style={style}
      itemsPerColumn={11}
    />
  );
}

// TODO: Add unit icons and faction icons.
export function GainUpgradeSection({
  factionId,
  gainedUpgrades,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  gainedUpgrades: TFUnitUpgradeId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const upgrades = useUpgrades();

  let availableUpgrades = Object.values(upgrades)
    .filter((upgrade) => !upgrade.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableUpgrades = Object.values(upgrades)
      .filter((upgrade) => !!upgrade.owner && upgrade.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const upgradesToGain = (numToGain ?? 0) - gainedUpgrades.length;

  if (upgradesToGain < 1) {
    return null;
  }

  const upgradesByType: Partial<Record<UnitType, TFUnitUpgrade[]>> = {};
  availableUpgrades.forEach((upgrade) => {
    const units = upgradesByType[upgrade.unitType] ?? [];
    units.push(upgrade);
    upgradesByType[upgrade.unitType] = units;
  });

  const orderedUpgrades = objectEntries(upgradesByType).sort((a, b) => {
    return a[0] > b[0] ? 1 : -1;
  });

  return (
    <ClientOnlyHoverMenu
      label={
        steal ? (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "0.52em" }}>
              <UpgradeSVG />
            </span>
            <FormattedMessage
              id="Components.Steal Unit Upgrade.Title"
              description="Title of Component: Steal Unit Upgrade"
              defaultMessage="Steal Unit Upgrade"
            />
          </div>
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            <span style={{ width: "0.52em" }}>
              <UpgradeSVG />
            </span>
            <FormattedMessage
              id="Components.Gain Unit Upgrade.Title"
              description="Title of Component: Gain Unit Upgrade"
              defaultMessage="Gain Unit Upgrade"
            />
          </div>
        )
      }
      buttonStyle={{ fontSize: rem(14) }}
      renderProps={(innerCloseFn) => (
        <div
          className={styles.OuterTechSelectMenu}
          style={{
            padding: rem(8),
            alignItems: "flex-start",
            overflow: "visible",
          }}
        >
          {orderedUpgrades.map(([unitType, upgrades]) => {
            return (
              <InnerUpgradeSelectMenu
                upgrades={upgrades}
                selectUpgrade={(upgrade) => {
                  dataUpdate(
                    Events.GainTFCardEvent(factionId, {
                      upgrade: upgrade.id,
                      type: "UNIT_UPGRADE",
                    }),
                  );
                }}
                outerCloseFn={innerCloseFn}
                label={<UnitIcon type={unitType} size="1.25em" />}
              />
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
