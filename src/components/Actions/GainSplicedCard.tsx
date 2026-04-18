import { CSSProperties } from "react";
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
import { rem } from "../../util/util";
import Card from "../Card/Card";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
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

interface GainAction {
  from?: FactionId | "ALL";
  to: FactionId;
}

export default function GainTFCard({
  factionId,
  style,
  numToGain,
  splice,
  action,
}: {
  factionId: FactionId;
  splice?: boolean;
  style?: CSSProperties;
  numToGain: NumberToGain;
  action: GainAction;
}) {
  const currentTurn = useCurrentTurn();

  const gainedCardsByType = getGainedTFCardsByType(currentTurn, action.to);

  const canGainMore = canGainMoreCards(numToGain, gainedCardsByType);

  return (
    <div
      className="flexColumn"
      style={{ width: "100%", alignItems: "flex-start", gap: "0.25rem" }}
    >
      <AbilitiesCard
        factionId={factionId}
        gainedCardsByType={gainedCardsByType}
        numToGain={numToGain}
        style={style}
        action={action}
      />
      <GenomesCard
        factionId={factionId}
        gainedCardsByType={gainedCardsByType}
        numToGain={numToGain}
        style={style}
        action={action}
      />
      <UpgradesCard
        factionId={factionId}
        gainedCardsByType={gainedCardsByType}
        numToGain={numToGain}
        style={style}
        action={action}
      />
      <ParadigmsCard
        factionId={factionId}
        gainedCardsByType={gainedCardsByType}
        numToGain={numToGain}
        style={style}
        action={action}
      />

      {splice && (canGainMore || gainedCardsByType.techs.length > 0) ? (
        <Card label="Gain Tech Instead">
          <TechResearchSection
            factionId={factionId}
            numTechs={canGainMore ? 2 : 0}
            hideWrapper
            gain
          />
        </Card>
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

function AbilitiesCard({
  factionId,
  gainedCardsByType,
  numToGain,
  style,
  action,
}: {
  factionId: FactionId;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToGain;
  style?: CSSProperties;
  action: GainAction;
}) {
  const abilities = useAbilities();
  const dataUpdate = useDataUpdate();
  const viewOnly = useViewOnly();

  const canGainMore = canGainMoreCards(numToGain, gainedCardsByType);
  const totalToGain = numToGain.abilities ?? 0;
  const abilitiesToGain = totalToGain - gainedCardsByType.abilities.length;

  if (
    (!canGainMore || abilitiesToGain < 1) &&
    gainedCardsByType.abilities.length < 1
  ) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="rojlVT"
          defaultMessage="Gain {count} {count, plural, one {Ability} other {Abilities}}"
          description="Label for a section used to gain abilities."
          values={{ count: totalToGain }}
        />
      }
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
                  Events.LoseTFCardEvent(action.to, {
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
        {canGainMore && abilitiesToGain > 0 ? (
          <GainAbilitySection
            factionId={factionId}
            gainedAbilities={gainedCardsByType.abilities}
            numToGain={totalToGain}
            action={action}
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
  numToGain,
  action,
  style,
}: {
  factionId: FactionId;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToGain;
  action: GainAction;
  style?: CSSProperties;
}) {
  const genomes = useGenomes();

  const canGainMore = canGainMoreCards(numToGain, gainedCardsByType);
  const totalToGain = numToGain.genomes ?? 0;
  const genomesToGain = totalToGain - gainedCardsByType.genomes.length;

  if (
    (!canGainMore || genomesToGain < 1) &&
    gainedCardsByType.genomes.length < 1
  ) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="3seFjE"
          defaultMessage="Gain {count} {count, plural, one {Genome} other {Genomes}}"
          description="Label for a section used to gain genomes."
          values={{ count: totalToGain }}
        />
      }
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
        {gainedCardsByType.genomes.map((genomeId) => {
          const genome = genomes[genomeId];
          if (!genome) {
            return null;
          }
          return <GenomeRow key={genome.id} genome={genome} />;
        })}
        {canGainMore && genomesToGain > 0 ? (
          <GainGenomeSection
            factionId={factionId}
            gainedGenomes={gainedCardsByType.genomes}
            numToGain={totalToGain}
            action={action}
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
  numToGain,
  action,
  style,
}: {
  factionId: FactionId;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToGain;
  action: GainAction;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  const canGainMore = canGainMoreCards(numToGain, gainedCardsByType);
  const totalToGain = numToGain.upgrades ?? 0;
  const upgradesToGain = totalToGain - gainedCardsByType.upgrades.length;

  if (
    (!canGainMore || upgradesToGain < 1) &&
    gainedCardsByType.upgrades.length < 1
  ) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="PXvHO0"
          defaultMessage="Gain {count} {count, plural, one {Unit Upgrade} other {Unit Upgrades}}"
          description="Label for a section used to gain unit upgrades."
          values={{ count: totalToGain }}
        />
      }
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
                  Events.LoseTFCardEvent(action.to, {
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
        {canGainMore && upgradesToGain > 0 ? (
          <GainUpgradeSection
            factionId={factionId}
            gainedUpgrades={gainedCardsByType.upgrades}
            numToGain={totalToGain}
            action={action}
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
  numToGain,
  action,
  style,
}: {
  factionId: FactionId;
  gainedCardsByType: GainedCardsByType;
  numToGain: NumberToGain;
  action: GainAction;
  style?: CSSProperties;
}) {
  const dataUpdate = useDataUpdate();
  const paradigms = useParadigms();
  const viewOnly = useViewOnly();

  const canGainMore = canGainMoreCards(numToGain, gainedCardsByType);
  const totalToGain = numToGain.paradigms ?? 0;
  const paradigmsToGain = totalToGain - gainedCardsByType.paradigms.length;

  if (
    (!canGainMore || paradigmsToGain < 1) &&
    gainedCardsByType.paradigms.length < 1
  ) {
    return null;
  }

  return (
    <Card
      label={
        <FormattedMessage
          id="rpByRO"
          defaultMessage="Gain {count} {count, plural, one {Paradigm} other {Paradigms}}"
          description="Label for a section used to gain paradigms."
          values={{ count: totalToGain }}
        />
      }
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
                  Events.LoseTFCardEvent(action.to, {
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
        {canGainMore && paradigmsToGain > 0 ? (
          <GainParadigmSection
            factionId={factionId}
            gainedParadigms={gainedCardsByType.paradigms}
            numToGain={totalToGain}
            style={style}
            action={action}
            hideIcon
          />
        ) : null}
      </div>
    </Card>
  );
}

export function GainAbilitySection({
  factionId,
  gainedAbilities,
  numToGain,
  style,
  hideIcon,
  action,
}: {
  factionId: FactionId;
  gainedAbilities: TFAbilityId[];
  numToGain?: number;
  style?: CSSProperties;
  hideIcon?: boolean;
  action: GainAction;
}) {
  const dataUpdate = useDataUpdate();

  const abilitiesToGain = (numToGain ?? 0) - gainedAbilities.length;

  if (abilitiesToGain < 1) {
    return null;
  }

  return (
    <AbilitySelectMenu
      filter={(ability) => {
        if (action.from) {
          if (!ability.owner) {
            return false;
          }
          if (action.from === "ALL") {
            return ability.owner !== action.to;
          }
          return ability.owner === action.from;
        }
        return !ability.owner;
      }}
      showOwnerIcon={action.from === "ALL"}
      label={
        action.from ? (
          action.from === factionId ? (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "1em" }}>
                  <AbilitySVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Give Ability.Title"
                description="Title of Component: Give Ability"
                defaultMessage="Give Ability"
              />
            </div>
          ) : (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "1em" }}>
                  <AbilitySVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Take Ability.Title"
                description="Title of Component: Take Ability"
                defaultMessage="Take Ability"
              />
            </div>
          )
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            {hideIcon ? null : (
              <span style={{ width: "1em" }}>
                <AbilitySVG />
              </span>
            )}
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
          Events.GainTFCardEvent(action.to, {
            ability,
            type: "ABILITY",
          }),
        );
      }}
      style={style}
    />
  );
}

// TODO: Add faction icons (simplified?).
export function GainGenomeSection({
  factionId,
  gainedGenomes,
  numToGain,
  style,
  hideIcon,
  action,
}: {
  factionId: FactionId;
  gainedGenomes: TFGenomeId[];
  numToGain?: number;
  style?: CSSProperties;
  hideIcon?: boolean;
  action: GainAction;
}) {
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const viewOnly = useViewOnly();

  let availableGenomes = Object.values(genomes)
    .filter((genome) => !genome.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (action.from) {
    availableGenomes = Object.values(genomes)
      .filter((genome) => {
        if (!genome.owner) {
          return false;
        }
        if (action.from === "ALL") {
          return genome.owner !== action.to;
        }
        return genome.owner === action.from;
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const genomesToGain = (numToGain ?? 0) - gainedGenomes.length;

  if (genomesToGain < 1) {
    return null;
  }

  return (
    <Selector
      hoverMenuLabel={
        action.from ? (
          action.from === factionId ? (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "0.61em" }}>
                  <GenomeSVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Give Genome.Title"
                description="Title of Component: Give Genome"
                defaultMessage="Give Genome"
              />
            </div>
          ) : (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "0.61em" }}>
                  <GenomeSVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Take Genome.Title"
                description="Title of Component: Take Genome"
                defaultMessage="Take Genome"
              />
            </div>
          )
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            {hideIcon ? null : (
              <span style={{ width: "0.61em" }}>
                <GenomeSVG />
              </span>
            )}
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
            Events.GainTFCardEvent(action.to, {
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
  style,
  hideIcon,
  action,
}: {
  factionId: FactionId;
  gainedParadigms: TFParadigmId[];
  numToGain?: number;
  style?: CSSProperties;
  hideIcon?: boolean;
  action: GainAction;
}) {
  const dataUpdate = useDataUpdate();
  const paradigms = useParadigms();
  const viewOnly = useViewOnly();

  let availableParadigms = Object.values(paradigms)
    .filter((paradigm) => !paradigm.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (!!action.from) {
    availableParadigms = Object.values(paradigms)
      .filter((paradigm) => {
        if (!paradigm.owner) {
          return false;
        }
        if (action.from === "ALL") {
          return paradigm.owner !== action.to;
        }
        return paradigm.owner === action.from;
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const paradigmsToGain = (numToGain ?? 0) - gainedParadigms.length;

  if (paradigmsToGain < 1) {
    return null;
  }

  return (
    <Selector
      hoverMenuLabel={
        action.from ? (
          action.from === factionId ? (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "0.61em" }}>
                  <ParadigmSVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Give Paradigm.Title"
                description="Title of Component: Give Paradigm"
                defaultMessage="Give Paradigm"
              />
            </div>
          ) : (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "0.61em" }}>
                  <ParadigmSVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Take Paradigm.Title"
                description="Title of Component: Take Paradigm"
                defaultMessage="Take Paradigm"
              />
            </div>
          )
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            {hideIcon ? null : (
              <span style={{ width: "0.64em" }}>
                <ParadigmSVG />
              </span>
            )}
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
            Events.GainTFCardEvent(action.to, {
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
  style,
  hideIcon,
  action,
}: {
  factionId: FactionId;
  gainedUpgrades: TFUnitUpgradeId[];
  numToGain?: number;
  style?: CSSProperties;
  hideIcon?: boolean;
  action: GainAction;
}) {
  const dataUpdate = useDataUpdate();
  const upgrades = useUpgrades();
  const viewOnly = useViewOnly();

  let availableUpgrades = Object.values(upgrades)
    .filter((upgrade) => !upgrade.owner)
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (!!action.from) {
    availableUpgrades = Object.values(upgrades)
      .filter((upgrade) => {
        if (!upgrade.owner) {
          return false;
        }
        if (action.from === "ALL") {
          return upgrade.owner !== action.to;
        }
        return upgrade.owner === action.from;
      })
      .sort((a, b) => (a.name > b.name ? 1 : -1));
  }
  const upgradesToGain = (numToGain ?? 0) - gainedUpgrades.length;

  if (upgradesToGain < 1) {
    return null;
  }

  const orderedUpgrades = availableUpgrades.sort((a, b) => {
    return a.name > b.name ? 1 : -1;
  });

  return (
    <ClientOnlyHoverMenu
      label={
        action.from ? (
          action.from === factionId ? (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "0.52em" }}>
                  <UpgradeSVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Give Unit Upgrade.Title"
                description="Title of Component: Give Unit Upgrade"
                defaultMessage="Give Unit Upgrade"
              />
            </div>
          ) : (
            <div className="flexRow" style={{ gap: rem(6) }}>
              {hideIcon ? null : (
                <span style={{ width: "0.52em" }}>
                  <UpgradeSVG />
                </span>
              )}
              <FormattedMessage
                id="Components.Take Unit Upgrade.Title"
                description="Title of Component: Take Unit Upgrade"
                defaultMessage="Take Unit Upgrade"
              />
            </div>
          )
        ) : (
          <div className="flexRow" style={{ gap: rem(6) }}>
            {hideIcon ? null : (
              <span style={{ width: "0.52em" }}>
                <UpgradeSVG />
              </span>
            )}
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
                    Events.GainTFCardEvent(action.to, {
                      type: "UNIT_UPGRADE",
                      upgrade: upgrade.id,
                    }),
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
