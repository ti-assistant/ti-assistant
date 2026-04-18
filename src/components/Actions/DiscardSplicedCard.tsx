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
  getDiscardedTFCardsByType,
  getDiscardedTFCardsByTypeWithFaction,
  getGainedTFCardsByType,
} from "../../util/actionLog";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { getTechTypeColor } from "../../util/techs";
import { rem } from "../../util/util";
import Card from "../Card/Card";
import FactionIcon from "../FactionIcon/FactionIcon";
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
}: {
  factionId: FactionId;
  other?: boolean;
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
      <AbilitiesCard
        factionId={factionId}
        allDiscarded={allDiscarded}
        gainedCardsByType={discardedCardsByType}
        numToGain={numToDiscard}
        steal={other}
        style={style}
      />
      <GenomesCard
        factionId={factionId}
        allDiscarded={allDiscarded}
        gainedCardsByType={discardedCardsByType}
        numToGain={numToDiscard}
        steal={other}
        style={style}
      />
      <UpgradesCard
        factionId={factionId}
        allDiscarded={allDiscarded}
        gainedCardsByType={discardedCardsByType}
        numToGain={numToDiscard}
        steal={other}
        style={style}
      />
      <ParadigmsCard
        factionId={factionId}
        allDiscarded={allDiscarded}
        gainedCardsByType={discardedCardsByType}
        numToGain={numToDiscard}
        steal={other}
        style={style}
      />
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

function AbilitiesCard({
  factionId,
  gainedCardsByType,
  allDiscarded,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  allDiscarded: GainedCards;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToDiscard;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const abilities = useAbilities();
  const dataUpdate = useDataUpdate();
  const viewOnly = useViewOnly();

  let canGainMore = canDiscardMoreCards(numToGain, gainedCardsByType);
  let discardedCount = gainedCardsByType.abilities.length;
  let availableAbilities = Object.values(abilities)
    .filter((ability) => ability.owner === factionId)
    .filter((ability) => !gainedCardsByType.abilities.includes(ability.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (steal) {
    canGainMore = canDiscardMoreCards(numToGain, allDiscarded);
    discardedCount = allDiscarded.abilities.length;
    availableAbilities = Object.values(abilities)
      .filter((ability) => !!ability.owner && ability.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const totalToGain = numToGain.abilities ?? 0;
  const abilitiesToGain = totalToGain - discardedCount;

  if ((!canGainMore || abilitiesToGain < 1) && discardedCount < 1) {
    return null;
  }

  if (availableAbilities.length === 0 && discardedCount === 0) {
    return null;
  }

  const label =
    totalToGain > 100 || totalToGain === 0 ? (
      <FormattedMessage
        id="Nwro0F"
        defaultMessage="Discard any number of Abilities"
        description="Label for a section used to discard abilities."
      />
    ) : (
      <FormattedMessage
        id="9k9JtR"
        defaultMessage="Discard {count} {count, plural, one {Ability} other {Abilities}}"
        description="Label for a section used to discard abilities."
        values={{ count: totalToGain }}
      />
    );

  return (
    <Card
      label={label}
      icon={
        <div
          style={{
            position: "relative",
            width: "1em",
            height: "1em",
          }}
        >
          <AbilitySVG color="var(--muted-text)" />
        </div>
      }
    >
      <div
        className="flexColumn"
        style={{ gap: "0.25rem", alignItems: "flex-start" }}
      >
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
                    <FactionIcon factionId={abilityEvent.factionId} size={16} />
                  ) : null}
                  <div style={{ color: getTechTypeColor(ability.type) }}>
                    {ability.name}
                  </div>
                </InfoRow>
              </div>
            </SelectableRow>
          );
        })}
        {canGainMore && abilitiesToGain > 0 ? (
          <GainAbilitySection
            factionId={factionId}
            discardedAbilities={gainedCardsByType.abilities}
            numToGain={totalToGain}
            steal={steal}
            style={style}
            hideIcon
          />
        ) : null}
      </div>
    </Card>
  );
}

function GenomesCard({
  factionId,
  gainedCardsByType,
  allDiscarded,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  allDiscarded: GainedCards;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToDiscard;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const viewOnly = useViewOnly();

  let canGainMore = canDiscardMoreCards(numToGain, gainedCardsByType);
  let discardedCount = gainedCardsByType.genomes.length;
  let availableGenomes = Object.values(genomes)
    .filter((genome) => genome.owner === factionId)
    .filter((genome) => !gainedCardsByType.genomes.includes(genome.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (steal) {
    canGainMore = canDiscardMoreCards(numToGain, allDiscarded);
    discardedCount = allDiscarded.genomes.length;
    availableGenomes = Object.values(genomes)
      .filter((genome) => !!genome.owner && genome.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const totalToGain = numToGain.genomes ?? 0;
  const genomesToGain = totalToGain - discardedCount;

  if ((!canGainMore || genomesToGain < 1) && discardedCount < 1) {
    return null;
  }

  if (availableGenomes.length === 0 && discardedCount === 0) {
    return null;
  }

  const label =
    totalToGain > 100 || totalToGain === 0 ? (
      <FormattedMessage
        id="z3Fj4q"
        defaultMessage="Discard any number of Genomes"
        description="Label for a section used to discard genomes."
      />
    ) : (
      <FormattedMessage
        id="XIEHjL"
        defaultMessage="Discard {count} {count, plural, one {Genome} other {Genomes}}"
        description="Label for a section used to discard genomes."
        values={{ count: totalToGain }}
      />
    );

  return (
    <Card
      label={label}
      icon={
        <div
          style={{
            position: "relative",
            width: "1em",
            height: "1em",
          }}
        >
          <GenomeSVG color="var(--muted-text)" />
        </div>
      }
    >
      <div
        className="flexColumn"
        style={{ gap: "0.25rem", alignItems: "flex-start" }}
      >
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
                    <FactionIcon factionId={genomeEvent.factionId} size={16} />
                  ) : null}
                  {genome.name}
                </InfoRow>
              </div>
            </SelectableRow>
          );
        })}
        {canGainMore && genomesToGain > 0 ? (
          <GainGenomeSection
            factionId={factionId}
            discardedGenomes={gainedCardsByType.genomes}
            numToGain={totalToGain}
            steal={steal}
            style={style}
            hideIcon
          />
        ) : null}
      </div>
    </Card>
  );
}

function UpgradesCard({
  factionId,
  gainedCardsByType,
  allDiscarded,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  allDiscarded: GainedCards;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToDiscard;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  let canGainMore = canDiscardMoreCards(numToGain, gainedCardsByType);
  const totalToGain = numToGain.upgrades ?? 0;
  let discardedCount = gainedCardsByType.upgrades.length;
  let availableUpgrades = Object.values(upgrades)
    .filter((upgrade) => upgrade.owner === factionId)
    .filter((upgrade) => !gainedCardsByType.upgrades.includes(upgrade.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (steal) {
    canGainMore = canDiscardMoreCards(numToGain, allDiscarded);
    discardedCount = allDiscarded.upgrades.length;
    availableUpgrades = Object.values(upgrades)
      .filter((upgrade) => !!upgrade.owner && upgrade.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }

  const upgradesToGain = totalToGain - discardedCount;

  if ((!canGainMore || upgradesToGain < 1) && discardedCount < 1) {
    return null;
  }

  if (availableUpgrades.length === 0 && discardedCount === 0) {
    return null;
  }

  const label =
    totalToGain > 100 || totalToGain === 0 ? (
      <FormattedMessage
        id="SqFE9l"
        defaultMessage="Discard any number of Unit Upgrades"
        description="Label for a section used to discard unit upgrades."
      />
    ) : (
      <FormattedMessage
        id="xps7l+"
        defaultMessage="Discard {count} {count, plural, one {Unit Upgrade} other {Unit Upgrades}}"
        description="Label for a section used to discard unit upgrades."
        values={{ count: totalToGain }}
      />
    );

  return (
    <Card
      label={label}
      icon={
        <div
          style={{
            position: "relative",
            width: "1em",
            height: "1em",
          }}
        >
          <UpgradeSVG color="var(--muted-text)" />
        </div>
      }
    >
      <div
        className="flexColumn"
        style={{ gap: "0.25rem", alignItems: "flex-start" }}
      >
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
        {canGainMore && upgradesToGain > 0 ? (
          <GainUpgradeSection
            factionId={factionId}
            gainedUpgrades={gainedCardsByType.upgrades}
            numToGain={totalToGain}
            steal={steal}
            style={style}
            hideIcon
          />
        ) : null}
      </div>
    </Card>
  );
}

function ParadigmsCard({
  factionId,
  gainedCardsByType,
  allDiscarded,
  numToGain,
  steal,
  style,
}: {
  factionId: FactionId;
  allDiscarded: GainedCards;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToDiscard;
  steal?: boolean;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const paradigms = useParadigms();
  const viewOnly = useViewOnly();

  let canGainMore = canDiscardMoreCards(numToGain, gainedCardsByType);
  let discardedCount = gainedCardsByType.paradigms.length;
  let availableParadigms = Object.values(paradigms)
    .filter((paradigm) => paradigm.owner === factionId)
    .filter((paradigm) => !gainedCardsByType.paradigms.includes(paradigm.id))
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  if (steal) {
    canGainMore = canDiscardMoreCards(numToGain, allDiscarded);
    discardedCount = allDiscarded.paradigms.length;
    availableParadigms = Object.values(paradigms)
      .filter((paradigm) => !!paradigm.owner && paradigm.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const totalToGain = numToGain.paradigms ?? 0;
  const paradigmsToGain = totalToGain - discardedCount;

  if ((!canGainMore || paradigmsToGain < 1) && discardedCount < 1) {
    return null;
  }

  if (availableParadigms.length === 0 && discardedCount === 0) {
    return null;
  }

  const label =
    totalToGain > 100 || totalToGain === 0 ? (
      <FormattedMessage
        id="WV1Cwe"
        defaultMessage="Discard any number of Paradigms"
        description="Label for a section used to discard paradigms."
      />
    ) : (
      <FormattedMessage
        id="9INv4t"
        defaultMessage="Discard {count} {count, plural, one {Paradigm} other {Paradigms}}"
        description="Label for a section used to discard paradigms."
        values={{ count: totalToGain }}
      />
    );

  return (
    <Card
      label={label}
      icon={
        <div
          style={{
            position: "relative",
            width: "1em",
            height: "1em",
          }}
        >
          <ParadigmSVG color="var(--muted-text)" />
        </div>
      }
    >
      <div
        className="flexColumn"
        style={{ gap: "0.25rem", alignItems: "flex-start" }}
      >
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
        {canGainMore && paradigmsToGain > 0 ? (
          <GainParadigmSection
            factionId={factionId}
            gainedParadigms={gainedCardsByType.paradigms}
            numToGain={totalToGain}
            steal={steal}
            style={style}
            hideIcon
          />
        ) : null}
      </div>
    </Card>
  );
}

export function GainAbilitySection({
  factionId,
  discardedAbilities,
  numToGain,
  steal,
  style,
  hideIcon,
}: {
  factionId: FactionId;
  discardedAbilities: TFAbilityId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
  hideIcon?: boolean;
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
          {hideIcon ? null : (
            <span style={{ width: "1em" }}>
              <AbilitySVG />
            </span>
          )}
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
  hideIcon,
}: {
  factionId: FactionId;
  discardedGenomes: TFGenomeId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
  hideIcon?: boolean;
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
          {hideIcon ? null : (
            <span style={{ width: "0.61em" }}>
              <GenomeSVG />
            </span>
          )}
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
  hideIcon,
}: {
  factionId: FactionId;
  gainedParadigms: TFParadigmId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
  hideIcon?: boolean;
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
          {hideIcon ? null : (
            <span style={{ width: "0.64em" }}>
              <ParadigmSVG />
            </span>
          )}
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
  hideIcon,
}: {
  factionId: FactionId;
  gainedUpgrades: TFUnitUpgradeId[];
  numToGain?: number;
  steal?: boolean;
  style?: CSSProperties;
  hideIcon?: boolean;
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

  const orderedUpgrades = availableUpgrades.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  return (
    <ClientOnlyHoverMenu
      label={
        <div className="flexRow" style={{ gap: rem(6) }}>
          {hideIcon ? null : (
            <span style={{ width: "0.52em" }}>
              <UpgradeSVG />
            </span>
          )}
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
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(11, orderedUpgrades.length)}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {orderedUpgrades.map((upgrade) => {
            return (
              <button
                key={upgrade.id}
                onClick={() => {
                  innerCloseFn();
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
                <div className="flexRow" style={{ gap: rem(4) }}>
                  <UnitIcon type={upgrade.unitType} size={16} />
                </div>
              </button>
            );
          })}
        </div>
      )}
      style={style}
    ></ClientOnlyHoverMenu>
  );
}
