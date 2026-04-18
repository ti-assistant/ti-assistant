import { ReactNode } from "react";
import { FormattedMessage } from "react-intl";
import {
  useAbilities,
  useActionCard,
  useCurrentTurn,
  useGenomes,
  useUpgrades,
  useViewOnly,
} from "../../context/dataHooks";
import {
  useAllFactionColors,
  useFactions,
} from "../../context/factionDataHooks";
import { useOrderedFactionIds } from "../../context/gameDataHooks";
import AbilitySVG from "../../icons/twilightsfall/ability";
import GenomeSVG from "../../icons/twilightsfall/genome";
import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import InfoModal from "../../InfoModal";
import FullScreenModal from "../../modals/FullScreenModal";
import { SelectableRow } from "../../SelectableRow";
import {
  getActionCardTargets,
  getAddTechEvents,
  getGainedTFCards,
  getRevealedTFCards,
  getSpliceParticipants,
  wasGenomeUsed,
} from "../../util/actionLog";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import {
  getAntimatterForFaction,
  getWavelengthForFaction,
} from "../../util/techs";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import { CollapsibleSection } from "../CollapsibleSection";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionIcon from "../FactionIcon/FactionIcon";
import FactionSelectRadialMenu from "../FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "../FormattedDescription/FormattedDescription";
import { Selector } from "../Selector/Selector";
import TechIcon from "../TechIcon/TechIcon";
import Toggle from "../Toggle/Toggle";
import UnitIcon from "../Units/Icons";
import UnitStats from "../UnitStats/UnitStats";
import AbilitySelectMenu from "./AbilitySelectMenu";
import styles from "./SpliceModal.module.scss";
import UpgradeSelectMenu from "./UpgradeSelectMenu";

function entriesEqual(
  a: ActionLogEntry<GainTFCardData>,
  b: ActionLogEntry<RevealTFCardData>,
) {
  if (a.data.event.type !== b.data.event.type) {
    return false;
  }
  switch (a.data.event.type) {
    case "ABILITY":
      if (b.data.event.type !== "ABILITY") {
        return false;
      }
      return a.data.event.ability === b.data.event.ability;
    case "GENOME":
      if (b.data.event.type !== "GENOME") {
        return false;
      }
      return a.data.event.genome === b.data.event.genome;
    case "UNIT_UPGRADE":
      if (b.data.event.type !== "UNIT_UPGRADE") {
        return false;
      }
      return a.data.event.upgrade === b.data.event.upgrade;
  }
}

export default function SpliceModal({
  allPlayers,
  activeFactionId,
  type,
}: {
  activeFactionId: FactionId;
  allPlayers?: boolean;
  type: "ABILITY" | "GENOME" | "UNIT_UPGRADE";
}) {
  let title = "";
  switch (type) {
    case "ABILITY":
      title = "Ability Splice";
      break;
    case "GENOME":
      title = "Genome Splice";
      break;
    case "UNIT_UPGRADE":
      title = "Unit Upgrade Splice";
      break;
  }

  return (
    <FullScreenModal title={title}>
      <SpliceModalContent
        activeFactionId={activeFactionId}
        allPlayers={allPlayers}
        type={type}
      />
    </FullScreenModal>
  );
}

function EngineerButton({
  initiatorId,
  isSpliceStarted,
}: {
  initiatorId: FactionId;
  isSpliceStarted: boolean;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const engineer = useActionCard("Engineer");

  if (!engineer) {
    return null;
  }

  const engineerPlayed =
    getActionCardTargets(currentTurn, "Engineer").length > 0;

  return (
    <Toggle
      selected={engineerPlayed}
      toggleFn={(prevValue) => {
        if (prevValue) {
          dataUpdate(Events.UnplayActionCardEvent("Engineer", initiatorId));
        } else {
          dataUpdate(Events.PlayActionCardEvent("Engineer", initiatorId));
        }
      }}
      info={{
        title: engineer.name,
        description: (
          <FormattedDescription description={engineer.description} />
        ),
      }}
      disabled={isSpliceStarted}
    >
      {engineer.name}
    </Toggle>
  );
}

function ResearchGenomeButton({
  isSpliceStarted,
}: {
  isSpliceStarted: boolean;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const researchGenome = useGenomes()["Research Genome"];

  if (!researchGenome || !researchGenome.owner) {
    return null;
  }

  const genomeUsed = wasGenomeUsed(currentTurn, "Research Genome");

  return (
    <Toggle
      selected={genomeUsed}
      toggleFn={(prevValue) => {
        if (prevValue) {
          dataUpdate(Events.UndoGenomeEvent("Research Genome"));
        } else {
          dataUpdate(Events.UseGenomeEvent("Research Genome"));
        }
      }}
      info={{
        title: researchGenome.name,
        description: (
          <FormattedDescription description={researchGenome.description} />
        ),
      }}
      disabled={isSpliceStarted}
    >
      {researchGenome.name}
    </Toggle>
  );
}

function ReverseButton({ isSpliceStarted }: { isSpliceStarted: boolean }) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const reverse = useActionCard("Reverse");

  if (!reverse) {
    return null;
  }

  const reversePlayed = getActionCardTargets(currentTurn, "Reverse").length > 0;

  return (
    <Toggle
      selected={reversePlayed}
      toggleFn={(prevValue) => {
        if (prevValue) {
          dataUpdate(Events.UnplayActionCardEvent("Reverse", "None"));
        } else {
          dataUpdate(Events.PlayActionCardEvent("Reverse", "None"));
        }
      }}
      info={{
        title: reverse.name,
        description: <FormattedDescription description={reverse.description} />,
      }}
      disabled={isSpliceStarted}
    >
      {reverse.name}
    </Toggle>
  );
}

function ThieveButton({
  isSpliceFinished,
  possibleThieves,
}: {
  isSpliceFinished: boolean;
  possibleThieves: FactionId[];
}) {
  const currentTurn = useCurrentTurn();

  const dataUpdate = useDataUpdate();
  const thieve = useActionCard("Thieve");

  if (!thieve || possibleThieves.length === 0) {
    return null;
  }

  let thievePlayer = getActionCardTargets(currentTurn, "Thieve")[0];
  if (thievePlayer === "None") {
    thievePlayer = undefined;
  }

  return (
    <div
      className="flexRow"
      style={{
        color: !isSpliceFinished
          ? "var(--muted-text)"
          : "var(--foreground-color)",
      }}
    >
      {thieve.name}
      <InfoModal
        title={thieve.name}
        style={{
          color: !isSpliceFinished
            ? "var(--muted-text)"
            : "var(--foreground-color)",
        }}
      >
        <FormattedDescription description={thieve.description} />
      </InfoModal>
      <FactionSelectRadialMenu
        factions={possibleThieves}
        selectedFaction={thievePlayer}
        size={32}
        onSelect={(factionId) => {
          if (!factionId && thievePlayer) {
            dataUpdate(Events.UnplayActionCardEvent("Thieve", thievePlayer));
          } else if (factionId) {
            dataUpdate(Events.PlayActionCardEvent("Thieve", factionId));
          }
        }}
        disabled={!isSpliceFinished}
      />
    </div>
  );
}

function SpliceModalContent({
  activeFactionId,
  allPlayers,
  type,
}: {
  activeFactionId: FactionId;
  allPlayers?: boolean;
  type: "ABILITY" | "GENOME" | "UNIT_UPGRADE";
}) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId,
  );
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const factions = useFactions();
  let spliceParticipants = new Set(getSpliceParticipants(currentTurn));
  if (allPlayers) {
    spliceParticipants = new Set(orderedFactionIds);
    spliceParticipants.delete(activeFactionId);
  }
  const reversePlayed = getActionCardTargets(currentTurn, "Reverse").length > 0;

  const localOrder = [...orderedFactionIds];
  localOrder.shift();
  if (!reversePlayed) {
    localOrder.reverse();
  }
  localOrder.unshift(activeFactionId);
  const factionColors = useAllFactionColors();

  const engineerPlayed =
    getActionCardTargets(currentTurn, "Engineer").length > 0;

  const genomeUsed = wasGenomeUsed(currentTurn, "Research Genome");
  const revealedTFCards = getRevealedTFCards(currentTurn).filter(
    (log) => log.data.event.type === type,
  );
  const gainedTFCards = getGainedTFCards(currentTurn).filter(
    (log) => log.data.event.type === type,
  );
  const gainedTechs = getAddTechEvents(currentTurn);

  const currentIndex = gainedTFCards.length + gainedTechs.length;

  const isSpliceStarted = currentIndex > 0;
  const totalCards =
    spliceParticipants.size +
    2 +
    (engineerPlayed && !isSpliceStarted ? 2 : 0) +
    (genomeUsed ? 3 : 0);

  const remaining = Math.max(0, totalCards - revealedTFCards.length);

  const factionsToPick = [
    activeFactionId,
    ...localOrder.filter((factionId) => spliceParticipants.has(factionId)),
  ];
  const theiveFactions = localOrder.filter((factionId) => {
    return factionId !== activeFactionId && !spliceParticipants.has(factionId);
  });
  // If getting an extra card for Magus.
  if (spliceParticipants.has(activeFactionId)) {
    factionsToPick.shift();
    factionsToPick.push(activeFactionId);
  }

  let currentFaction = factionsToPick[currentIndex];

  let isThieve = false;
  if (!currentFaction) {
    let thievePlayer = getActionCardTargets(currentTurn, "Thieve")[0];
    currentFaction = thievePlayer === "None" ? undefined : thievePlayer;
    isThieve = !!thievePlayer;
  }

  const hasAntimatter = !currentFaction
    ? false
    : !!factions[currentFaction]?.techs[
        getAntimatterForFaction(currentFaction)
      ];
  const hasWavelength = !currentFaction
    ? false
    : !!factions[currentFaction]?.techs[
        getWavelengthForFaction(currentFaction)
      ];

  return (
    <div>
      <div
        className="flexRow"
        style={{
          display: "grid",
          gridAutoFlow: "row",
          gridTemplateColumns: "1fr 2fr 1fr",
          alignItems: "stretch",
          marginBlockEnd: "0.5rem",
        }}
      >
        <CollapsibleSection
          title="Start of Splice"
          style={{ paddingInline: "0.25rem" }}
        >
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <ResearchGenomeButton isSpliceStarted={isSpliceStarted} />
            <EngineerButton
              initiatorId={activeFactionId}
              isSpliceStarted={isSpliceStarted}
            />
            <ReverseButton isSpliceStarted={isSpliceStarted} />
          </div>
        </CollapsibleSection>
        <CollapsibleSection title="Participants">
          <div
            className="flexRow"
            style={{
              width: "100%",
              justifyContent: "center",
            }}
          >
            <div
              className="flexRow"
              style={{ width: "fit-content", alignItems: "flex-start" }}
            >
              {factionsToPick.map((factionId, index) => {
                const hasPicked = currentIndex > index;
                return (
                  <div
                    className="flexColumn"
                    key={index}
                    style={{ gap: 0, justifyContent: "flex-start" }}
                  >
                    <FactionCircle
                      factionId={factionId}
                      borderColor={factionColors[factionId]?.border}
                      fade={hasPicked}
                    />
                    {index === currentIndex ? "Active" : null}
                  </div>
                );
              })}
            </div>
          </div>
        </CollapsibleSection>
        {allPlayers ? null : (
          <CollapsibleSection title="End of Splice">
            <div
              className="flexRow"
              style={{
                width: "100%",
                justifyContent: "center",
              }}
            >
              <ThieveButton
                isSpliceFinished={!currentFaction}
                possibleThieves={theiveFactions}
              />
            </div>
          </CollapsibleSection>
        )}
      </div>
      <div
        style={{
          display: "grid",
          gridAutoFlow: "row",
          justifyContent: "center",
          gridTemplateColumns:
            "repeat(auto-fill, minmax(clamp(240px, 19rem, 98vw), 1fr))",
          width: "98vw",
          gap: "0.5rem",
        }}
      >
        {revealedTFCards.map((card) => {
          let cardId: Optional<TFAbilityId | TFGenomeId | TFUnitUpgradeId>;
          switch (card.data.event.type) {
            case "ABILITY":
              cardId = card.data.event.ability;
              break;
            case "GENOME":
              cardId = card.data.event.genome;
              break;
            case "UNIT_UPGRADE":
              cardId = card.data.event.upgrade;
              break;
          }
          return (
            <SpliceCard
              key={cardId}
              cardId={cardId}
              factionId={currentFaction}
              selectedBy={gainedTFCards.reduce(
                (gained: Optional<FactionId>, curr) => {
                  if (entriesEqual(curr, card)) {
                    return curr.data.event.faction;
                  }
                  return gained;
                },
                undefined,
              )}
              type={type}
              isThieve={isThieve}
            />
          );
        })}
        {Array(remaining)
          .fill(0)
          .map((_, index) => {
            return (
              <SpliceCard
                key={index + revealedTFCards.length}
                factionId={currentFaction}
                type={type}
                isThieve={isThieve}
              />
            );
          })}
        {
          <CollapsibleSection title="Gain Tech Instead">
            <div className="flexColumn">
              <button
                className="outline flexRow"
                onClick={() => {
                  if (!currentFaction) {
                    return;
                  }
                  dataUpdate(
                    Events.AddTechEvent(
                      currentFaction,
                      getAntimatterForFaction(currentFaction),
                    ),
                  );
                }}
                disabled={!currentFaction || isThieve || hasAntimatter}
              >
                Antimatter
                {currentFaction && !isThieve && !hasAntimatter ? (
                  <FactionIcon factionId={currentFaction} size={16} />
                ) : null}
              </button>
              <div className="flexRow">
                {gainedTechs.map((techEvent) => {
                  if (!techEvent.data.event.tech.includes("Antimatter")) {
                    return null;
                  }
                  return (
                    <FactionIcon
                      key={techEvent.data.event.faction}
                      factionId={techEvent.data.event.faction}
                      size={30}
                    />
                  );
                })}
              </div>
              <button
                className="outline flexRow"
                onClick={() => {
                  if (!currentFaction) {
                    return;
                  }
                  dataUpdate(
                    Events.AddTechEvent(
                      currentFaction,
                      getWavelengthForFaction(currentFaction),
                    ),
                  );
                }}
                disabled={!currentFaction || isThieve || hasWavelength}
              >
                Wavelength
                {currentFaction && !isThieve && !hasWavelength ? (
                  <FactionIcon factionId={currentFaction} size={16} />
                ) : null}
              </button>
              <div className="flexRow">
                {gainedTechs.map((techEvent) => {
                  if (!techEvent.data.event.tech.includes("Wavelength")) {
                    return null;
                  }
                  return (
                    <FactionIcon
                      key={techEvent.data.event.faction}
                      factionId={techEvent.data.event.faction}
                      size={30}
                    />
                  );
                })}
              </div>
            </div>
          </CollapsibleSection>
        }
      </div>
    </div>
  );
}

function SpliceCard({
  cardId,
  factionId,
  selectedBy,
  type,
  isThieve,
}: {
  cardId?: TFAbilityId | TFGenomeId | TFUnitUpgradeId;
  factionId?: FactionId;
  selectedBy?: FactionId;
  type: "ABILITY" | "GENOME" | "UNIT_UPGRADE";
  isThieve: boolean;
}) {
  const abilities = useAbilities();
  const genomes = useGenomes();
  const dataUpdate = useDataUpdate();
  const upgrades = useUpgrades();

  if (!cardId) {
    if (!factionId) {
      return null;
    }
    return (
      <CollapsibleSection
        title={<GenomeSelector type={type} />}
      ></CollapsibleSection>
    );
  }
  let card: Optional<TFGenome | TFAbility | TFUnitUpgrade>;
  switch (type) {
    case "ABILITY":
      card = abilities[cardId as TFAbilityId];
      break;
    case "GENOME":
      card = genomes[cardId as TFGenomeId];
      break;
    case "UNIT_UPGRADE":
      card = upgrades[cardId as TFUnitUpgradeId];
      break;
  }
  if (!card) {
    return null;
  }

  return (
    <CollapsibleSection
      title={
        <SelectableRow
          itemId={card.id}
          removeItem={
            selectedBy || !factionId
              ? undefined
              : () => {
                  switch (type) {
                    case "ABILITY":
                      dataUpdate(
                        Events.HideTFCardEvent({
                          type: type,
                          ability: card.id as TFAbilityId,
                        }),
                      );
                      break;
                    case "GENOME":
                      dataUpdate(
                        Events.HideTFCardEvent({
                          type: type,
                          genome: card.id as TFGenomeId,
                        }),
                      );
                      break;
                    case "UNIT_UPGRADE":
                      dataUpdate(
                        Events.HideTFCardEvent({
                          type: type,
                          upgrade: card.id as TFUnitUpgradeId,
                        }),
                      );
                      break;
                  }
                }
          }
          style={{
            width: "100%",
            justifyContent: "center",
            fontFamily: "var(--main-font)",

            paddingInline: "0.25rem",
          }}
        >
          <span
            className="flexRow"
            style={{
              fontSize: "1.25rem",
              justifyContent: "center",
            }}
          >
            {card.owner ? (
              <FactionIcon factionId={card.owner} size={16} />
            ) : null}
            {card.name}
            {type === "UNIT_UPGRADE" ? (
              <UnitIcon type={(card as TFUnitUpgrade).unitType} />
            ) : null}
            {type === "ABILITY" ? (
              <TechIcon type={(card as TFAbility).type} size="1em" />
            ) : null}
            <span style={{ filter: "grayscale(1)" }}>
              <FactionIcon factionId={card.origin} size={16} />
            </span>
          </span>
        </SelectableRow>
      }
    >
      <div
        className="flexColumn"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          padding: "0.25rem 0.5rem",
          height: "100%",
          fontSize: "1rem",
        }}
      >
        <div
          className="flexColumn"
          style={{
            alignItems: "flex-start",
            marginBlockEnd: "auto",
            width: "100%",
          }}
        >
          <FormattedDescription description={card.description} />
        </div>
        {type === "UNIT_UPGRADE" ? (
          <div className="flexColumn" style={{ width: "100%" }}>
            {(card as TFUnitUpgrade).abilities.length > 0 ? (
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
                {(card as TFUnitUpgrade).abilities.map((ability) => {
                  return <div key={ability}>{ability.toUpperCase()}</div>;
                })}
              </div>
            ) : null}
            <UnitStats
              stats={(card as TFUnitUpgrade).stats}
              type={(card as TFUnitUpgrade).unitType}
              className={styles.UnitStats}
            />
          </div>
        ) : null}
        {selectedBy ? (
          <FactionIcon factionId={selectedBy} size={30} />
        ) : (
          <button
            className="outline"
            style={{ marginInline: "auto" }}
            onClick={() => {
              if (!factionId) {
                return;
              }
              switch (type) {
                case "ABILITY":
                  dataUpdate(
                    Events.GainTFCardEvent(factionId, {
                      type,
                      ability: card.id as TFAbilityId,
                    }),
                  );
                  break;
                case "GENOME":
                  dataUpdate(
                    Events.GainTFCardEvent(factionId, {
                      type,
                      genome: card.id as TFGenomeId,
                    }),
                  );
                  break;
                case "UNIT_UPGRADE":
                  dataUpdate(
                    Events.GainTFCardEvent(factionId, {
                      type,
                      upgrade: card.id as TFUnitUpgradeId,
                    }),
                  );
                  break;
              }
            }}
            disabled={!factionId}
          >
            <div className="flexRow">
              <div className="flexColumn" style={{ gap: 0 }}>
                Gain{" "}
                {type === "ABILITY"
                  ? "Ability"
                  : type === "GENOME"
                    ? "Genome"
                    : "Unit Upgrade"}
                {!isThieve && factionId === "A Sickening Lurch" ? (
                  <span style={{ fontSize: "0.75em" }}>
                    and capture Infantry
                  </span>
                ) : null}
                {!isThieve && factionId === "Avarice Rex" ? (
                  <span style={{ fontSize: "0.75em" }}>
                    and gain/convert commodities
                  </span>
                ) : null}
              </div>
              {!factionId ? null : (
                <FactionIcon factionId={factionId} size={16} />
              )}
            </div>
          </button>
        )}
      </div>
    </CollapsibleSection>
  );
}

function GenomeSelector({
  type,
}: {
  type: "ABILITY" | "GENOME" | "UNIT_UPGRADE";
}) {
  const dataUpdate = useDataUpdate();
  const genomes = useGenomes();
  const viewOnly = useViewOnly();
  const currentTurn = useCurrentTurn();
  const revealedTFCards = getRevealedTFCards(currentTurn);

  let label: Optional<ReactNode>;
  let icon: Optional<ReactNode>;
  switch (type) {
    case "ABILITY":
      label = "Reveal Ability";
      icon = <AbilitySVG />;
      break;
    case "GENOME":
      label = (
        <FormattedMessage
          id="cxkvcc"
          description="Text on a button that will reveal a Genome card"
          defaultMessage="Reveal Genome"
        />
      );
      icon = <GenomeSVG />;
      break;
    case "UNIT_UPGRADE":
      label = "Reveal Unit Upgrade";
      icon = <UpgradeSVG />;
      break;
  }

  let availableGenomes = Object.values(genomes)
    .filter((genome) => !genome.owner)
    .filter((genome) => {
      for (const revealedCard of revealedTFCards) {
        if (
          revealedCard.data.event.type === "GENOME" &&
          revealedCard.data.event.genome === genome.id
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => (a.name > b.name ? 1 : -1));
  if (type === "GENOME") {
    return (
      <div
        className="flexRow"
        style={{ textAlign: "left", fontSize: "1.5rem" }}
      >
        <Selector
          hoverMenuLabel={
            <div
              className="flexRow"
              style={{ gap: rem(6), width: "fit-content", fontSize: "1.25rem" }}
            >
              <span style={{ width: "0.61em" }}>{icon}</span>
              {label}
            </div>
          }
          hoverMenuStyle={{ fontSize: rem(14) }}
          options={availableGenomes}
          toggleItem={(genomeId, add) => {
            if (add) {
              dataUpdate(
                Events.RevealTFCardEvent({
                  type: type,
                  genome: genomeId,
                }),
              );
            }
          }}
          viewOnly={viewOnly}
          itemsPerColumn={11}
        />
      </div>
    );
  }
  if (type === "ABILITY") {
    return (
      <div
        className="flexRow"
        style={{ textAlign: "left", fontSize: "1.5rem" }}
      >
        <AbilitySelectMenu
          label={
            <div
              className="flexRow"
              style={{ gap: rem(6), width: "fit-content", fontSize: "1.25rem" }}
            >
              <span style={{ width: "0.61em" }}>{icon}</span>
              {label}
            </div>
          }
          filter={(ability) => {
            if (ability.owner) {
              return false;
            }
            for (const revealedCard of revealedTFCards) {
              if (
                revealedCard.data.event.type === "ABILITY" &&
                revealedCard.data.event.ability === ability.id
              ) {
                return false;
              }
            }
            return true;
          }}
          selectAbility={(ability) =>
            dataUpdate(
              Events.RevealTFCardEvent({
                type: type,
                ability,
              }),
            )
          }
        />
      </div>
    );
  }
  if (type === "UNIT_UPGRADE") {
    return (
      <div
        className="flexRow"
        style={{ textAlign: "left", fontSize: "1.5rem" }}
      >
        <UpgradeSelectMenu
          label={
            <div
              className="flexRow"
              style={{ gap: rem(6), width: "fit-content", fontSize: "1.25rem" }}
            >
              <span style={{ width: "0.61em" }}>{icon}</span>
              {label}
            </div>
          }
          filter={(upgrade) => {
            for (const revealedCard of revealedTFCards) {
              if (
                revealedCard.data.event.type === "UNIT_UPGRADE" &&
                revealedCard.data.event.upgrade === upgrade.id
              ) {
                return false;
              }
            }
            return true;
          }}
          selectUpgrade={(upgrade) =>
            dataUpdate(
              Events.RevealTFCardEvent({
                type: type,
                upgrade,
              }),
            )
          }
        />
      </div>
    );
  }
}
