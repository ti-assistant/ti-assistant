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
import {
  GainedCards,
  getDiscardedTFCards,
  getDiscardedTFCardsByType,
  getDiscardedTFCardsByTypeWithFaction,
  getGainedTFCardsByType,
} from "../../util/actionLog";
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
import FactionIcon from "../FactionIcon/FactionIcon";

interface NumberToDiscard {
  abilities?: number;
  genomes?: number;
  paradigms?: number;
  upgrades?: number;
  total?: number;
}

function canDiscardMoreCards(
  numToDiscard: NumberToDiscard,
  cardsByType: GainedCardsByType | GainedCards,
) {
  const totalDiscarded =
    cardsByType.abilities.length +
    cardsByType.genomes.length +
    cardsByType.paradigms.length +
    cardsByType.upgrades.length +
    cardsByType.techs.length;
  if (numToDiscard.total) {
    return totalDiscarded < numToDiscard.total;
  }

  const totalToDiscard =
    (numToDiscard.abilities ?? 0) +
    (numToDiscard.genomes ?? 0) +
    (numToDiscard.paradigms ?? 0) +
    (numToDiscard.upgrades ?? 0);

  if (totalDiscarded === totalToDiscard) {
    return false;
  }

  if (
    numToDiscard.abilities &&
    cardsByType.abilities.length < numToDiscard.abilities
  ) {
    return true;
  }
  if (
    numToDiscard.genomes &&
    cardsByType.genomes.length < numToDiscard.genomes
  ) {
    return true;
  }
  if (
    numToDiscard.paradigms &&
    cardsByType.paradigms.length < numToDiscard.paradigms
  ) {
    return true;
  }
  if (
    numToDiscard.upgrades &&
    cardsByType.upgrades.length < numToDiscard.upgrades
  ) {
    return true;
  }
  return false;
}

export default function DiscardTFCard({
  factionId,
  other,
  style,
  numToDiscard,
  splice,
}: {
  factionId: FactionId;
  other?: boolean;
  splice?: boolean;
  style?: CSSProperties;
  numToDiscard: NumberToDiscard;
}) {
  const currentTurn = useCurrentTurn();

  const discardedCardsByType = getDiscardedTFCardsByType(
    currentTurn,
    factionId,
  );

  const allDiscarded = getDiscardedTFCardsByTypeWithFaction(currentTurn);

  let canDiscardMore = canDiscardMoreCards(numToDiscard, discardedCardsByType);

  if (other) {
    canDiscardMore = canDiscardMoreCards(numToDiscard, allDiscarded);
  }

  return (
    <div
      className="flexColumn"
      style={{ width: "fit-content", alignItems: "flex-start" }}
    >
      <GainedCardsSection
        factionId={factionId}
        allDiscarded={allDiscarded}
        gainedCardsByType={discardedCardsByType}
        splice={splice}
        steal={other}
      />
      {canDiscardMore ? (
        <div
          className={`flexColumn ${styles.GainContainer}`}
          style={{ alignItems: "flex-start" }}
        >
          <GainAbilitySection
            discardedAbilities={discardedCardsByType.abilities}
            factionId={factionId}
            numToGain={numToDiscard.abilities}
            steal={other}
            style={style}
          />
          <GainGenomeSection
            discardedGenomes={discardedCardsByType.genomes}
            factionId={factionId}
            numToGain={numToDiscard.genomes}
            steal={other}
            style={style}
          />
          <GainParadigmSection
            gainedParadigms={discardedCardsByType.paradigms}
            factionId={factionId}
            numToGain={numToDiscard.paradigms}
            steal={other}
            style={style}
          />
          <GainUpgradeSection
            gainedUpgrades={discardedCardsByType.upgrades}
            factionId={factionId}
            numToGain={numToDiscard.upgrades}
            steal={other}
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
  allDiscarded,
  factionId,
  gainedCardsByType,
  splice,
  steal,
}: {
  allDiscarded: GainedCards;
  factionId: FactionId;
  splice?: boolean;
  gainedCardsByType: GainedCardsByType;
  steal?: boolean;
}) {
  const abilities = useAbilities();
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const paradigms = useParadigms();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  if (
    !steal &&
    gainedCardsByType.abilities.length === 0 &&
    gainedCardsByType.genomes.length === 0 &&
    gainedCardsByType.paradigms.length === 0 &&
    gainedCardsByType.upgrades.length === 0 &&
    (!splice || gainedCardsByType.techs.length === 0)
  ) {
    return null;
  }

  if (
    steal &&
    allDiscarded.abilities.length === 0 &&
    allDiscarded.genomes.length === 0 &&
    allDiscarded.paradigms.length === 0 &&
    allDiscarded.upgrades.length === 0 &&
    (!splice || allDiscarded.techs.length === 0)
  ) {
    return null;
  }
  const innerContent = (
    <>
      {allDiscarded.abilities.length > 0 ? (
        <IconDiv icon={<AbilityIcon />} blur>
          {allDiscarded.abilities.map((abilityEvent) => {
            if (!steal && abilityEvent.factionId !== factionId) {
              return null;
            }
            const ability = abilities[abilityEvent.id];
            if (!ability) {
              return null;
            }
            return (
              <SelectableRow
                key={abilityEvent.id}
                itemId={abilityEvent.id}
                removeItem={() =>
                  dataUpdate(
                    Events.GainTFCardEvent(
                      abilityEvent.factionId,
                      {
                        ability: abilityEvent.id,
                        type: "ABILITY",
                      },
                      true,
                    ),
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
                    {steal ? (
                      <FactionIcon
                        factionId={abilityEvent.factionId}
                        size={16}
                      />
                    ) : null}
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
      {allDiscarded.genomes.length > 0 ? (
        <IconDiv icon={<GenomeIcon />} blur>
          {allDiscarded.genomes.map((genomeEvent) => {
            if (!steal && genomeEvent.factionId !== factionId) {
              return null;
            }
            const genome = genomes[genomeEvent.id];
            if (!genome) {
              return null;
            }
            return (
              <SelectableRow
                key={genomeEvent.id}
                itemId={genomeEvent.id}
                removeItem={() =>
                  dataUpdate(
                    Events.GainTFCardEvent(
                      genomeEvent.factionId,
                      {
                        genome: genomeEvent.id,
                        type: "GENOME",
                      },
                      true,
                    ),
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
                    infoTitle={genome.name}
                    infoContent={
                      <FormattedDescription description={genome.description} />
                    }
                  >
                    {steal ? (
                      <FactionIcon
                        factionId={genomeEvent.factionId}
                        size={16}
                      />
                    ) : null}
                    {genome.name}
                  </InfoRow>
                </div>
              </SelectableRow>
            );
          })}
        </IconDiv>
      ) : null}
      {allDiscarded.upgrades.length > 0 ? (
        <IconDiv icon={<UpgradeIcon />} blur>
          {allDiscarded.upgrades.map((upgradeEvent) => {
            if (!steal && upgradeEvent.factionId !== factionId) {
              return null;
            }
            const upgrade = upgrades[upgradeEvent.id];
            if (!upgrade) {
              return null;
            }
            return (
              <SelectableRow
                key={upgradeEvent.id}
                itemId={upgradeEvent.id}
                removeItem={() =>
                  dataUpdate(
                    Events.GainTFCardEvent(
                      upgradeEvent.factionId,
                      {
                        upgrade: upgradeEvent.id,
                        type: "UNIT_UPGRADE",
                      },
                      true,
                    ),
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
                      <UnitIcon type={upgrade.unitType} size={20} />
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
      {allDiscarded.paradigms.length > 0 ? (
        <IconDiv icon={<ParadigmIcon />} blur>
          {allDiscarded.paradigms.map((paradigmEvent) => {
            if (!steal && paradigmEvent.factionId !== factionId) {
              return null;
            }
            const paradigm = paradigms[paradigmEvent.id];
            if (!paradigm) {
              return null;
            }
            return (
              <SelectableRow
                key={paradigmEvent.id}
                itemId={paradigmEvent.id}
                removeItem={() =>
                  dataUpdate(
                    Events.GainTFCardEvent(
                      paradigmEvent.factionId,
                      {
                        paradigm: paradigmEvent.id,
                        type: "PARADIGM",
                      },
                      true,
                    ),
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
  discardedAbilities,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  discardedAbilities: TFAbilityId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();

  const gainedCards = getGainedTFCardsByType(currentTurn, factionId);

  const abilitiesToGain = (numToGain ?? 0) - discardedAbilities.length;

  if (abilitiesToGain < 1) {
    return null;
  }

  return (
    <AbilitySelectMenu
      filter={(ability) => {
        if (steal) {
          return !!ability.owner && ability.owner !== factionId;
        }
        return (
          ability.owner === factionId &&
          !gainedCards.abilities.includes(ability.id)
        );
      }}
      label={
        <div className="flexRow" style={{ gap: rem(6) }}>
          <span style={{ width: "1em" }}>
            <AbilitySVG />
          </span>
          <FormattedMessage
            id="Components.Discard Ability.Title"
            description="Title of Component: Discard Ability"
            defaultMessage="Discard Ability"
          />
        </div>
      }
      selectAbility={(ability: TFAbilityId) => {
        dataUpdate(
          Events.LoseTFCardEvent(
            factionId,
            {
              ability,
              type: "ABILITY",
            },
            true,
          ),
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
  discardedGenomes,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  discardedGenomes: TFGenomeId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const viewOnly = useViewOnly();

  const gainedCards = getGainedTFCardsByType(currentTurn, factionId);

  let availableGenomes = Object.values(genomes)
    .filter((genome) => genome.owner === factionId)
    .filter((genome) => !gainedCards.genomes.includes(genome.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableGenomes = Object.values(genomes)
      .filter((genome) => !!genome.owner && genome.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const genomesToGain = (numToGain ?? 0) - discardedGenomes.length;

  if (genomesToGain < 1 || availableGenomes.length === 0) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={
        <div className="flexRow" style={{ gap: rem(6) }}>
          <span style={{ width: "0.61em" }}>
            <GenomeSVG />
          </span>
          <FormattedMessage
            id="Components.Discard Genome.Title"
            description="Title of Component: Discard Genome"
            defaultMessage="Discard Genome"
          />
        </div>
      }
      buttonStyle={{ fontSize: rem(14) }}
      renderProps={(innerCloseFn) => (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(8, availableGenomes.length)}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {availableGenomes.map((genome) => {
            return (
              <button
                key={genome.id}
                onClick={(e) => {
                  e.stopPropagation();
                  innerCloseFn();
                  dataUpdate(
                    Events.LoseTFCardEvent(
                      steal ? (genome.owner as FactionId) : factionId,
                      {
                        genome: genome.id,
                        type: "GENOME",
                      },
                      true,
                    ),
                  );
                }}
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  fontSize: rem(16),
                  gap: rem(8),
                }}
                disabled={viewOnly}
              >
                {steal ? (
                  <FactionIcon factionId={genome.owner} size={16} />
                ) : null}
                {genome.name}
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );

  return (
    <Selector
      hoverMenuLabel={
        <div className="flexRow" style={{ gap: rem(6) }}>
          <span style={{ width: "0.61em" }}>
            <GenomeSVG />
          </span>
          <FormattedMessage
            id="Components.Discard Genome.Title"
            description="Title of Component: Discard Genome"
            defaultMessage="Discard Genome"
          />
        </div>
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableGenomes}
      toggleItem={(genomeId, add) => {
        if (add) {
          dataUpdate(
            Events.LoseTFCardEvent(
              factionId,
              {
                genome: genomeId,
                type: "GENOME",
              },
              true,
            ),
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
    .filter((paradigm) => paradigm.owner === factionId)
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
        <div className="flexRow" style={{ gap: rem(6) }}>
          <span style={{ width: "0.64em" }}>
            <ParadigmSVG />
          </span>
          <FormattedMessage
            id="Components.Discard Paradigm.Title"
            description="Title of Component: Discard Paradigm"
            defaultMessage="Discard Paradigm"
          />
        </div>
      }
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableParadigms}
      toggleItem={(paradigmId, add) => {
        if (add) {
          dataUpdate(
            Events.LoseTFCardEvent(
              factionId,
              {
                paradigm: paradigmId,
                type: "PARADIGM",
              },
              true,
            ),
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
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  const gainedCards = getGainedTFCardsByType(currentTurn, factionId);

  let availableUpgrades = Object.values(upgrades)
    .filter((upgrade) => upgrade.owner === factionId)
    .filter((upgrade) => !gainedCards.upgrades.includes(upgrade.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableUpgrades = Object.values(upgrades)
      .filter((upgrade) => !!upgrade.owner && upgrade.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const upgradesToGain = (numToGain ?? 0) - gainedUpgrades.length;

  if (upgradesToGain < 1 || availableUpgrades.length === 0) {
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
        <div className="flexRow" style={{ gap: rem(6) }}>
          <span style={{ width: "0.52em" }}>
            <UpgradeSVG />
          </span>
          <FormattedMessage
            id="Components.Discard Unit Upgrade.Title"
            description="Title of Component: Discard Unit Upgrade"
            defaultMessage="Discard Unit Upgrade"
          />
        </div>
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
                    Events.LoseTFCardEvent(
                      factionId,
                      {
                        upgrade: upgrade.id,
                        type: "UNIT_UPGRADE",
                      },
                      true,
                    ),
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
