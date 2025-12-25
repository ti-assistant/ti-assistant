import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import {
  useAbilities,
  useCurrentTurn,
  useGameId,
  useGenomes,
  useParadigms,
  useUpgrades,
  useViewOnly,
} from "../../context/dataHooks";
import { gainTFCardAsync, loseTFCardAsync } from "../../dynamic/api";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { getGainedTFCardsByType } from "../../util/actionLog";
import { rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { Selector } from "../Selector/Selector";
import UnitIcon from "../Units/Icons";
import UnitStats from "../UnitStats/UnitStats";
import styles from "./GainSplicedCard.module.scss";

interface NumberToGain {
  abilities?: number;
  genomes?: number;
  paradigms?: number;
  upgrades?: number;
  total?: number;
}

export default function GainTFCard({
  factionId,
  steal,
  style,
  numToGain,
}: {
  factionId: FactionId;
  steal?: boolean;
  style?: CSSProperties;
  numToGain: NumberToGain;
}) {
  const currentTurn = useCurrentTurn();

  const gainedCardsByType = getGainedTFCardsByType(currentTurn, factionId);

  const totalGained =
    gainedCardsByType.abilities.length +
    gainedCardsByType.genomes.length +
    gainedCardsByType.paradigms.length +
    gainedCardsByType.upgrades.length;
  const canGainMore = !numToGain.total || totalGained < numToGain.total;

  return (
    <div style={{ width: "fit-content" }}>
      <GainedCardsSection
        factionId={factionId}
        gainedCardsByType={gainedCardsByType}
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
}

function GainedCardsSection({
  factionId,
  gainedCardsByType,
  hideWrapper,
}: {
  factionId: FactionId;
  steal?: boolean;
  hideWrapper?: boolean;
  gainedCardsByType: GainedCardsByType;
}) {
  const abilities = useAbilities();
  const gameId = useGameId();
  const genomes = useGenomes();
  const paradigms = useParadigms();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  if (
    gainedCardsByType.abilities.length === 0 &&
    gainedCardsByType.genomes.length === 0 &&
    gainedCardsByType.paradigms.length === 0 &&
    gainedCardsByType.upgrades.length === 0
  ) {
    return null;
  }

  const innerContent = (
    <>
      {gainedCardsByType.abilities.map((abilityId) => {
        const ability = abilities[abilityId];
        if (!ability) {
          return null;
        }
        return (
          <SelectableRow
            itemId={ability.id}
            removeItem={() =>
              loseTFCardAsync(gameId, factionId, {
                ability: ability.id,
                type: "ABILITY",
              })
            }
            viewOnly={viewOnly}
          >
            <InfoRow
              infoTitle={ability.name}
              infoContent={
                <FormattedDescription description={ability.description} />
              }
            >
              {ability.name}
            </InfoRow>
          </SelectableRow>
        );
      })}
      {gainedCardsByType.genomes.map((genomeId) => {
        const genome = genomes[genomeId];
        if (!genome) {
          return null;
        }
        return (
          <SelectableRow
            itemId={genome.id}
            removeItem={() =>
              loseTFCardAsync(gameId, factionId, {
                genome: genome.id,
                type: "GENOME",
              })
            }
            viewOnly={viewOnly}
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
      {gainedCardsByType.upgrades.map((upgradeId) => {
        const upgrade = upgrades[upgradeId];
        if (!upgrade) {
          return null;
        }
        return (
          <SelectableRow
            itemId={upgrade.id}
            removeItem={() =>
              loseTFCardAsync(gameId, factionId, {
                upgrade: upgrade.id,
                type: "UNIT_UPGRADE",
              })
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
                  <FormattedDescription description={upgrade.description} />
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
              {upgrade.name}
            </InfoRow>
          </SelectableRow>
        );
      })}
      {gainedCardsByType.paradigms.map((paradigmId) => {
        const paradigm = paradigms[paradigmId];
        if (!paradigm) {
          return null;
        }
        return (
          <SelectableRow
            itemId={paradigm.id}
            removeItem={() =>
              loseTFCardAsync(gameId, factionId, {
                paradigm: paradigm.id,
                type: "PARADIGM",
              })
            }
            viewOnly={viewOnly}
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
    </>
  );

  if (hideWrapper) {
    return innerContent;
  }

  return <LabeledDiv label="TODO">{innerContent}</LabeledDiv>;
}

function GainAbilitySection({
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
  const abilities = useAbilities();
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  let availableAbilities = Object.values(abilities)
    .filter((ability) => !ability.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (steal) {
    availableAbilities = Object.values(abilities)
      .filter((ability) => !!ability.owner && ability.owner !== factionId)
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const abilitiesToGain = (numToGain ?? 0) - gainedAbilities.length;

  if (abilitiesToGain < 1) {
    return null;
  }

  return (
    <Selector
      hoverMenuLabel={
        steal ? (
          <FormattedMessage
            id="Components.Steal Ability.Title"
            description="Title of Component: Steal Ability"
            defaultMessage="Steal Ability"
          />
        ) : (
          <FormattedMessage
            id="Components.Gain Ability.Title"
            description="Title of Component: Gain Ability"
            defaultMessage="Gain Ability"
          />
        )
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableAbilities}
      toggleItem={(abilityId, add) => {
        if (add) {
          gainTFCardAsync(gameId, factionId, {
            ability: abilityId,
            type: "ABILITY",
          });
        }
      }}
      viewOnly={viewOnly}
      style={style}
      itemsPerColumn={15}
    />
  );
}

function GainGenomeSection({
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
  const gameId = useGameId();
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
          <FormattedMessage
            id="Components.Steal Genome.Title"
            description="Title of Component: Steal Genome"
            defaultMessage="Steal Genome"
          />
        ) : (
          <FormattedMessage
            id="Components.Gain Genome.Title"
            description="Title of Component: Gain Genome"
            defaultMessage="Gain Genome"
          />
        )
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableGenomes}
      toggleItem={(genomeId, add) => {
        if (add) {
          gainTFCardAsync(gameId, factionId, {
            genome: genomeId,
            type: "GENOME",
          });
        }
      }}
      viewOnly={viewOnly}
      style={style}
      itemsPerColumn={11}
    />
  );
}

function GainParadigmSection({
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
  const gameId = useGameId();
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
          <FormattedMessage
            id="Components.Steal Paradigm.Title"
            description="Title of Component: Steal Paradigm"
            defaultMessage="Steal Paradigm"
          />
        ) : (
          <FormattedMessage
            id="Components.Gain Paradigm.Title"
            description="Title of Component: Gain Paradigm"
            defaultMessage="Gain Paradigm"
          />
        )
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableParadigms}
      toggleItem={(paradigmId, add) => {
        if (add) {
          gainTFCardAsync(gameId, factionId, {
            paradigm: paradigmId,
            type: "PARADIGM",
          });
        }
      }}
      viewOnly={viewOnly}
      style={style}
      itemsPerColumn={11}
    />
  );
}

function GainUpgradeSection({
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
  const gameId = useGameId();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

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

  return (
    <Selector
      hoverMenuLabel={
        steal ? (
          <FormattedMessage
            id="Components.Steal Unit Upgrade.Title"
            description="Title of Component: Steal Unit Upgrade"
            defaultMessage="Steal Unit Upgrade"
          />
        ) : (
          <FormattedMessage
            id="Components.Gain Unit Upgrade.Title"
            description="Title of Component: Gain Unit Upgrade"
            defaultMessage="Gain Unit Upgrade"
          />
        )
      }
      // icon={<RelicPlanetIcon />}
      hoverMenuStyle={{ fontSize: rem(14) }}
      options={availableUpgrades}
      toggleItem={(upgradeId, add) => {
        if (add) {
          gainTFCardAsync(gameId, factionId, {
            upgrade: upgradeId,
            type: "UNIT_UPGRADE",
          });
        }
      }}
      viewOnly={viewOnly}
      style={style}
      itemsPerColumn={11}
    />
  );
}
