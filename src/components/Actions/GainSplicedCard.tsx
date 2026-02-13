import { CSSProperties } from "react";
import { FormattedMessage, useIntl } from "react-intl";
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
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import AbilitySVG from "../../icons/twilightsfall/ability";
import GenomeSVG from "../../icons/twilightsfall/genome";
import ParadigmSVG from "../../icons/twilightsfall/paradigm";
import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import { InfoRow } from "../../InfoRow";
import { SelectableRow } from "../../SelectableRow";
import { getGainedTFCardsByType } from "../../util/actionLog";
import { getTechTypeColor } from "../../util/techs";
import { rem } from "../../util/util";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import IconDiv from "../LabeledDiv/IconDiv";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import AbilityIcon from "../PlanetIcons/AbilityIcon";
import GenomeIcon from "../PlanetIcons/GenomeIcon";
import ParadigmIcon from "../PlanetIcons/ParadigmIcon";
import UpgradeIcon from "../PlanetIcons/UpgradeIcon";
import { Selector } from "../Selector/Selector";
import UnitIcon from "../Units/Icons";
import UnitStats from "../UnitStats/UnitStats";
import styles from "./GainSplicedCard.module.scss";
import FactionComponents from "../FactionComponents/FactionComponents";
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
    cardsByType.upgrades.length;
  if (numToGain.total) {
    return totalGained < numToGain.total;
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
}: {
  factionId: FactionId;
  steal?: boolean;
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
                  loseTFCardAsync(gameId, factionId, {
                    ability: abilityId,
                    type: "ABILITY",
                  })
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
                  loseTFCardAsync(gameId, factionId, {
                    upgrade: upgradeId,
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
                  loseTFCardAsync(gameId, factionId, {
                    paradigm: paradigmId,
                    type: "PARADIGM",
                  })
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
  const abilities = useAbilities();
  const gameId = useGameId();
  const intl = useIntl();

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

  const redAbilities = availableAbilities.filter(
    (ability) => ability.type === "RED",
  );
  const yellowAbilities = availableAbilities.filter(
    (ability) => ability.type === "YELLOW",
  );
  const blueAbilities = availableAbilities.filter(
    (ability) => ability.type === "BLUE",
  );
  const greenAbilities = availableAbilities.filter(
    (ability) => ability.type === "GREEN",
  );

  function selectAbility(ability: TFAbility) {
    gainTFCardAsync(gameId, factionId, {
      ability: ability.id,
      type: "ABILITY",
    });
  }

  return (
    <ClientOnlyHoverMenu
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
      style={{ whiteSpace: "nowrap" }}
      buttonStyle={{ fontSize: rem(14) }}
      renderProps={(outerCloseFn) => (
        <div
          className={styles.OuterTechSelectMenu}
          style={{
            padding: rem(8),
            alignItems: "flex-start",
            overflow: "visible",
          }}
        >
          <InnerAbilitySelectMenu
            abilities={greenAbilities}
            label={intl.formatMessage({
              id: "2I5JBO",
              description: "Title of green techs.",
              defaultMessage: "Biotic",
            })}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
          <InnerAbilitySelectMenu
            abilities={blueAbilities}
            label={intl.formatMessage({
              id: "Nr4DLa",
              description: "Title of blue techs.",
              defaultMessage: "Propulsion",
            })}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
          <InnerAbilitySelectMenu
            abilities={yellowAbilities}
            label={intl.formatMessage({
              id: "W9OGxl",
              description: "Title of yellow techs.",
              defaultMessage: "Cybernetic",
            })}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
          <InnerAbilitySelectMenu
            abilities={redAbilities}
            label={intl.formatMessage({
              id: "ZqAjEi",
              description: "Title of red techs.",
              defaultMessage: "Warfare",
            })}
            selectAbility={selectAbility}
            outerCloseFn={outerCloseFn}
          />
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}

// TODO: Add faction icons (simplified?).
function InnerAbilitySelectMenu({
  abilities,
  label,
  selectAbility,
  outerCloseFn,
}: {
  abilities: TFAbility[];
  label: string;
  selectAbility: (ability: TFAbility) => void;
  outerCloseFn: () => void;
}) {
  const viewOnly = useViewOnly();

  if (abilities.length === 0) {
    return null;
  }

  return (
    <ClientOnlyHoverMenu
      label={label}
      buttonStyle={{ fontSize: rem(14) }}
      borderColor={getTechTypeColor(abilities[0]?.type ?? "UPGRADE")}
      renderProps={(innerCloseFn) => (
        <div
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(8, abilities.length)}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {abilities.map((ability) => {
            return (
              <button
                key={ability.id}
                onClick={() => {
                  innerCloseFn();
                  outerCloseFn();
                  selectAbility(ability);
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
                {ability.name}
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
          style={{
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(
              availableUpgrades.length,
              11,
            )}, auto)`,
            padding: rem(8),
            gap: rem(4),
            alignItems: "stretch",
            maxWidth: "88vw",
            overflowX: "auto",
          }}
        >
          {availableUpgrades.map((upgrade) => {
            return (
              <button
                key={upgrade.id}
                onClick={() => {
                  innerCloseFn();
                  gainTFCardAsync(gameId, factionId, {
                    upgrade: upgrade.id,
                    type: "UNIT_UPGRADE",
                  });
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
