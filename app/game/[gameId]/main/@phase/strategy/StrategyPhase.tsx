import React, { PropsWithChildren, use, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../../../../../../src/HoverMenu";
import { NumberedItem } from "../../../../../../src/NumberedItem";
import { FactionTimer, StaticFactionTimer } from "../../../../../../src/Timer";
import FactionCard from "../../../../../../src/components/FactionCard/FactionCard";
import FactionComponents from "../../../../../../src/components/FactionComponents/FactionComponents";
import FactionSelectRadialMenu from "../../../../../../src/components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import FormattedDescription from "../../../../../../src/components/FormattedDescription/FormattedDescription";
import LabeledDiv from "../../../../../../src/components/LabeledDiv/LabeledDiv";
import { ModalContent } from "../../../../../../src/components/Modal/Modal";
import { Selector } from "../../../../../../src/components/Selector/Selector";
import { StrategyCardElement } from "../../../../../../src/components/StrategyCardElement/StrategyCardElement";
import { ModalContext } from "../../../../../../src/context/contexts";
import {
  useAgenda,
  useGameId,
  useStrategyCards,
  useViewOnly,
} from "../../../../../../src/context/dataHooks";
import {
  useFactionColor,
  useFactionHasTech,
} from "../../../../../../src/context/factionDataHooks";
import {
  useActiveFactionId,
  useOnDeckFactionId,
  useOrderedFactionIds,
} from "../../../../../../src/context/gameDataHooks";
import { useRound } from "../../../../../../src/context/stateDataHooks";
import {
  advancePhaseAsync,
  assignStrategyCardAsync,
  giftOfPrescienceAsync,
  swapStrategyCardsAsync,
} from "../../../../../../src/dynamic/api";
import { getColorForFaction } from "../../../../../../src/util/factions";
import { phaseString } from "../../../../../../src/util/strings";
import { Optional } from "../../../../../../src/util/types/types";
import { objectEntries, rem } from "../../../../../../src/util/util";
import styles from "./StrategyPhase.module.scss";

function ChecksAndBalancesMenu({
  factionId,
  strategyCards,
  onSelect,
}: {
  factionId: Optional<FactionId>;
  strategyCards: StrategyCard[];
  onSelect: (factionId: FactionId) => void;
}) {
  const checksAndBalances = useAgenda("Checks and Balances");
  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const viewOnly = useViewOnly();

  if (!factionId || !checksAndBalances || !checksAndBalances.passed) {
    return null;
  }

  const numPlayers = mapOrderedFactionIds.length;

  const cardsPerFaction: Partial<Record<FactionId, number>> = {};
  strategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    let cardCount = cardsPerFaction[card.faction] ?? 0;
    cardCount++;
    cardsPerFaction[card.faction] = cardCount;
  });
  const otherFactions = mapOrderedFactionIds.filter((otherFactionId) => {
    if (factionId === otherFactionId) {
      return false;
    }
    const numCards = cardsPerFaction[otherFactionId] ?? 0;
    if (numPlayers > 4) {
      return numCards < 1;
    }
    return numCards < 2;
  });

  // If no other factions remaining, allow picking it yourself
  if (otherFactions.length === 0) {
    otherFactions.push(factionId);
  }

  return (
    <div
      className="flexRow"
      style={{
        fontSize: rem(16),
        alignItems: "center",
        justifyContent: "flex-end",
        width: "100%",
      }}
    >
      Give to:
      <FactionSelectRadialMenu
        onSelect={(factionId) => {
          if (!factionId) {
            return;
          }
          onSelect(factionId);
        }}
        factions={otherFactions}
        size={32}
        viewOnly={viewOnly}
      />
    </div>
  );
}

function QuantumDatahubNode({
  factionId,
  strategyCards,
}: {
  factionId: FactionId;
  strategyCards: StrategyCard[];
}) {
  const factionColor = useFactionColor(factionId);
  const gameId = useGameId();
  const hasQuantum = useFactionHasTech(factionId, "Quantum Datahub Node");
  const viewOnly = useViewOnly();

  const [quantum, setQuantum] = useState<{
    mainCard: Optional<StrategyCardId>;
    otherCard: Optional<StrategyCardId>;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });

  if (!hasQuantum) {
    return null;
  }

  function quantumDatahubNode() {
    if (!quantum.mainCard || !quantum.otherCard) {
      return;
    }

    const cardOne = strategyCards.find((card) => card.id === quantum.mainCard);
    const cardTwo = strategyCards.find((card) => card.id === quantum.otherCard);
    if (!cardOne || !cardTwo) {
      return;
    }

    swapStrategyCardsAsync(gameId, quantum.mainCard, quantum.otherCard);
  }

  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={factionId} />}
      color={factionColor}
    >
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="Emirates of Hacan.Techs.Quantum Datahub Node.Title"
            description="Title of Tech: Quantum Datahub Node"
            defaultMessage="Quantum Datahub Node"
          />
        }
      >
        <div
          className="flexColumn"
          style={{
            padding: rem(8),
            gap: rem(4),
            boxSizing: "border-box",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          <FormattedMessage
            id="l6pQCt"
            description="Text describing which strategy card a player is swapping for a different card."
            defaultMessage="Swap {firstCard} for {secondCard}"
            values={{
              firstCard: (
                <Selector
                  hoverMenuLabel={
                    <FormattedMessage
                      id="0DDRZv"
                      description="Strategy card."
                      defaultMessage="Strategy Card"
                    />
                  }
                  autoSelect={true}
                  options={strategyCards
                    .filter((card) => card.faction === factionId)
                    .map((card) => {
                      return { id: card.id, name: card.name };
                    })}
                  toggleItem={(cardId, add) => {
                    const localCardName = add ? cardId : undefined;
                    setQuantum((quantum) => {
                      return { ...quantum, mainCard: localCardName };
                    });
                  }}
                  selectedItem={quantum.mainCard}
                  viewOnly={viewOnly}
                />
              ),
              secondCard: (
                <Selector
                  hoverMenuLabel={
                    <FormattedMessage
                      id="0DDRZv"
                      description="Strategy card."
                      defaultMessage="Strategy Card"
                    />
                  }
                  options={strategyCards
                    .filter(
                      (card) => card.faction && card.faction !== factionId
                    )
                    .map((card) => {
                      return { id: card.id, name: card.name };
                    })}
                  toggleItem={(cardId, add) => {
                    const localCardName = add ? cardId : undefined;
                    setQuantum((quantum) => {
                      return { ...quantum, otherCard: localCardName };
                    });
                  }}
                  selectedItem={quantum.otherCard}
                  viewOnly={viewOnly}
                />
              ),
            }}
          />
          <div
            className="flexColumn"
            style={{
              paddingTop: rem(4),
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <button
              disabled={viewOnly || !quantum.mainCard || !quantum.otherCard}
              onClick={() => {
                quantumDatahubNode();
                setQuantum({
                  mainCard: undefined,
                  otherCard: undefined,
                });
              }}
            >
              <FormattedMessage
                id="GFfdMB"
                description="Text on a button that will apply a Strategy Card swap."
                defaultMessage="Confirm Swap"
              />
            </button>
          </div>
        </div>
      </ClientOnlyHoverMenu>
    </LabeledDiv>
  );
}

function ImperialArbiter({ strategyCards }: { strategyCards: StrategyCard[] }) {
  const arbiter = useAgenda("Imperial Arbiter");
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  const [quantum, setQuantum] = useState<{
    mainCard: Optional<StrategyCardId>;
    otherCard: Optional<StrategyCardId>;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });

  function quantumDatahubNode() {
    if (!gameId || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    swapStrategyCardsAsync(gameId, quantum.mainCard, quantum.otherCard, true);
  }

  if (!arbiter || !arbiter.resolved || !arbiter.passed || !arbiter.target) {
    return null;
  }

  const factionId = arbiter.target as FactionId;

  return (
    <LabeledDiv
      label={<FactionComponents.Name factionId={factionId} />}
      color={getColorForFaction(factionId)}
    >
      <ClientOnlyHoverMenu
        label={
          <FormattedMessage
            id="Agendas.Imperial Arbiter.Title"
            description="Title of Agenda Card: Imperial Arbiter"
            defaultMessage="Imperial Arbiter"
          />
        }
      >
        <div
          className="flexColumn"
          style={{
            padding: rem(8),
            gap: rem(4),
            alignItems: "flex-start",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          <FormattedMessage
            id="l6pQCt"
            description="Text describing which strategy card a player is swapping for a different card."
            defaultMessage="Swap {firstCard} for {secondCard}"
            values={{
              firstCard: (
                <Selector
                  hoverMenuLabel={
                    <FormattedMessage
                      id="0DDRZv"
                      description="Strategy card."
                      defaultMessage="Strategy Card"
                    />
                  }
                  autoSelect={true}
                  options={strategyCards
                    .filter((card) => card.faction === factionId)
                    .map((card) => {
                      return { id: card.id, name: card.name };
                    })}
                  toggleItem={(cardId, add) => {
                    const localCardName = add ? cardId : undefined;
                    setQuantum((quantum) => {
                      return { ...quantum, mainCard: localCardName };
                    });
                  }}
                  selectedItem={quantum.mainCard}
                  viewOnly={viewOnly}
                />
              ),
              secondCard: (
                <Selector
                  hoverMenuLabel={
                    <FormattedMessage
                      id="0DDRZv"
                      description="Strategy card."
                      defaultMessage="Strategy Card"
                    />
                  }
                  options={strategyCards
                    .filter(
                      (card) => card.faction && card.faction !== factionId
                    )
                    .map((card) => {
                      return { id: card.id, name: card.name };
                    })}
                  toggleItem={(cardId, add) => {
                    const localCardName = add ? cardId : undefined;
                    setQuantum((quantum) => {
                      return { ...quantum, otherCard: localCardName };
                    });
                  }}
                  selectedItem={quantum.otherCard}
                  viewOnly={viewOnly}
                />
              ),
            }}
          />
          <div
            className="flexColumn"
            style={{
              paddingTop: rem(4),
              boxSizing: "border-box",
              width: "100%",
            }}
          >
            <button
              disabled={viewOnly || !quantum.mainCard || !quantum.otherCard}
              onClick={() => {
                quantumDatahubNode();
                setQuantum({
                  mainCard: undefined,
                  otherCard: undefined,
                });
              }}
            >
              <FormattedMessage
                id="YKkcsO"
                description="Text on a button that will apply a Imperial Arbiter Strategy Card swap."
                defaultMessage="Discard to Swap"
              />
            </button>
          </div>
        </div>
      </ClientOnlyHoverMenu>
    </LabeledDiv>
  );
}

function InfoContent({ children }: PropsWithChildren) {
  return (
    <div
      className="myriadPro"
      style={{
        minWidth: rem(320),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      {children}
    </div>
  );
}

export function StrategyCardSelectList({ mobile }: { mobile: boolean }) {
  const gameId = useGameId();
  const checksAndBalancesAgenda = useAgenda("Checks and Balances");
  const activeFactionId = useActiveFactionId();
  const strategyCards = useStrategyCards();
  const viewOnly = useViewOnly();

  const orderedStrategyCards = Object.values(strategyCards).sort((a, b) =>
    a.order > b.order ? 1 : -1
  );

  const checksAndBalances =
    !!checksAndBalancesAgenda && !!checksAndBalancesAgenda.passed;

  return (
    <div
      style={{
        display: "grid",
        gridTemplate: "repeat(8, 1fr) / 14% 2fr 2fr 1fr",
        gridAutoFlow: "column",
        gap: rem(4),
      }}
    >
      {orderedStrategyCards.map((card) => {
        return (
          <StrategyCardElement
            key={card.id}
            card={card}
            active={
              card.faction || !activeFactionId || card.invalid ? false : true
            }
            onClick={
              checksAndBalances ||
              card.faction ||
              !activeFactionId ||
              card.invalid ||
              viewOnly
                ? undefined
                : () =>
                    assignStrategyCardAsync(
                      gameId,
                      activeFactionId,
                      card.id,
                      activeFactionId
                    )
            }
            fontSize={mobile ? 20 : 24}
          >
            <ChecksAndBalancesMenu
              factionId={activeFactionId}
              strategyCards={orderedStrategyCards}
              onSelect={(factionId) => {
                if (!activeFactionId) {
                  return;
                }
                assignStrategyCardAsync(
                  gameId,
                  factionId,
                  card.id,
                  activeFactionId
                );
              }}
            />
          </StrategyCardElement>
        );
      })}
    </div>
  );
}

export default function StrategyPhase() {
  const gameId = useGameId();
  // Agendas
  const aiRevolution = useAgenda("Anti-Intellectual Revolution");
  const armsReduction = useAgenda("Arms Reduction");
  const imperialArbiter = useAgenda("Imperial Arbiter");
  const newConstitution = useAgenda("New Constitution");

  // Techs
  const hacanHasQuantum = useFactionHasTech(
    "Emirates of Hacan",
    "Quantum Datahub Node"
  );
  const nekroHasQuantum = useFactionHasTech(
    "Nekro Virus",
    "Quantum Datahub Node"
  );

  const mapOrderedFactionIds = useOrderedFactionIds("MAP");
  const strategyCards = useStrategyCards();
  const intl = useIntl();
  const viewOnly = useViewOnly();

  const activeFactionId = useActiveFactionId();
  const onDeckFactionId = useOnDeckFactionId();
  const round = useRound();

  const { openModal } = use(ModalContext);

  interface Ability {
    name: string;
    description: string;
  }

  function getStartOfStrategyPhaseAbilities() {
    let abilities: Partial<Record<FactionId | "Every Player", Ability[]>> = {};
    abilities["Every Player"] = [];
    if (
      aiRevolution &&
      aiRevolution.resolved &&
      aiRevolution.target === "Against" &&
      aiRevolution.activeRound === round
    ) {
      abilities["Every Player"].push({
        name: `${aiRevolution.name} [${intl.formatMessage({
          id: "SOC2Bh",
          defaultMessage: "Against",
          description: "Outcome choosing to vote down a law.",
        })}]`,
        description: aiRevolution.failedText ?? aiRevolution.description,
      });
    }
    if (
      armsReduction &&
      armsReduction.resolved &&
      armsReduction.target === "Against" &&
      armsReduction.activeRound === round
    ) {
      abilities["Every Player"].push({
        name: `${armsReduction.name} [${intl.formatMessage({
          id: "SOC2Bh",
          defaultMessage: "Against",
          description: "Outcome choosing to vote down a law.",
        })}]`,
        description: armsReduction.failedText ?? armsReduction.description,
      });
    }
    if (
      newConstitution &&
      newConstitution.resolved &&
      newConstitution.target === "For" &&
      newConstitution.activeRound === round
    ) {
      abilities["Every Player"].push({
        name: `${newConstitution.name} [${intl.formatMessage({
          id: "ymJxS0",
          defaultMessage: "For",
          description: "Outcome choosing to pass a law.",
        })}]`,
        description: newConstitution.passedText ?? newConstitution.description,
      });
    }
    if (abilities["Every Player"].length === 0) {
      delete abilities["Every Player"];
    }
    for (const factionId of mapOrderedFactionIds) {
      const factionAbilities: Ability[] = [];
      if (factionId === "Council Keleres") {
        factionAbilities.push({
          name: intl.formatMessage({
            id: "Council Keleres.Abilities.Council Patronage.Title",
            defaultMessage: "Council Patronage",
            description: "Title of Faction Ability: Council Patronage",
          }),
          description: intl.formatMessage({
            id: "Council Keleres.Abilities.Council Patronage.Description",
            defaultMessage:
              "Replenish your commodities at the start of the strategy phase, then gain 1 trade good.",
            description: "Description for Faction Ability: Council Patronage",
          }),
        });
      }
      if (factionAbilities.length > 0) {
        abilities[factionId] = factionAbilities;
      }
    }
    return abilities;
  }

  function hasStartOfStrategyPhaseAbilities() {
    for (const abilities of Object.values(getStartOfStrategyPhaseAbilities())) {
      if (abilities.length > 0) {
        return true;
      }
    }
    return false;
  }

  function hasEndOfStrategyPhaseAbilities() {
    if (mapOrderedFactionIds.includes("Naalu Collective")) {
      return true;
    }
    if (hacanHasQuantum) {
      return true;
    }
    if (nekroHasQuantum) {
      return true;
    }
    if (imperialArbiter && imperialArbiter.resolved && imperialArbiter.target) {
      return true;
    }
    return false;
  }

  function haveAllFactionsPicked() {
    const numFactions = mapOrderedFactionIds.length;
    let numPicked = Object.values(strategyCards).reduce((num, card) => {
      if (card.faction) {
        return num + 1;
      }
      return num;
    }, 0);
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }

  const updatedStrategyCards = Object.values(strategyCards).map((card) => {
    const updatedCard = structuredClone(card);

    return updatedCard;
  });

  const orderedStrategyCards = updatedStrategyCards.sort(
    (a, b) => a.order - b.order
  );

  const giftFaction = Object.values(strategyCards).reduce(
    (faction: Optional<FactionId>, card) => {
      if (card.order === 0 && card.faction !== "Naalu Collective") {
        return card.faction;
      }
      return faction;
    },
    undefined
  );

  return (
    <React.Fragment>
      <div className={styles.LeftColumn}>
        {hasStartOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            <FormattedMessage
              id="4PYolM"
              description="Text showing that something will occur at the start of a specific phase."
              defaultMessage="Start of {phase} Phase"
              values={{ phase: phaseString("STRATEGY", intl) }}
            />
            <ol className="flexColumn" style={{ alignItems: "stretch" }}>
              {objectEntries(getStartOfStrategyPhaseAbilities()).map(
                ([factionId, abilities]) => {
                  if (abilities.length === 0) {
                    return null;
                  }
                  const label =
                    factionId !== "Every Player" ? (
                      <FactionComponents.Name factionId={factionId} />
                    ) : (
                      factionId
                    );
                  return (
                    <NumberedItem key={factionId}>
                      <LabeledDiv
                        label={label}
                        color={
                          factionId !== "Every Player"
                            ? getColorForFaction(factionId)
                            : "#555"
                        }
                      >
                        <div
                          className="flexColumn"
                          style={{ width: "100%", alignItems: "flex-start" }}
                        >
                          {abilities.map((ability) => {
                            return (
                              <div key={ability.name} className="flexRow">
                                {ability.name}
                                <div
                                  className="popupIcon"
                                  onClick={() =>
                                    openModal(
                                      <ModalContent
                                        title={
                                          <div style={{ fontSize: rem(40) }}>
                                            {ability.name}
                                          </div>
                                        }
                                      >
                                        <InfoContent>
                                          <FormattedDescription
                                            description={ability.description}
                                          />
                                        </InfoContent>
                                      </ModalContent>
                                    )
                                  }
                                >
                                  &#x24D8;
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </LabeledDiv>
                    </NumberedItem>
                  );
                }
              )}
            </ol>
          </div>
        ) : null}
        {haveAllFactionsPicked() && hasEndOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            <FormattedMessage
              id="CG2MQj"
              description="Text showing that something will occur at the end of a specific phase."
              defaultMessage="End of {phase} Phase"
              values={{ phase: phaseString("STRATEGY", intl) }}
            />
            {mapOrderedFactionIds.includes("Naalu Collective") ? (
              <Selector
                hoverMenuLabel={
                  <FormattedMessage
                    id="Naalu Collective.Promissories.Gift of Prescience.Title"
                    description="Title of Faction Promissory: Gift of Prescience"
                    defaultMessage="Gift of Prescience"
                  />
                }
                selectedLabel={
                  <FormattedMessage
                    id="Naalu Collective.Promissories.Gift of Prescience.Title"
                    description="Title of Faction Promissory: Gift of Prescience"
                    defaultMessage="Gift of Prescience"
                  />
                }
                options={mapOrderedFactionIds
                  .filter((factionId) => factionId !== "Naalu Collective")
                  .map((factionId) => {
                    return { id: factionId, name: factionId };
                  })}
                toggleItem={(factionId, add) => {
                  const newFaction = add ? factionId : undefined;
                  giftOfPrescienceAsync(
                    gameId,
                    newFaction ?? "Naalu Collective"
                  );
                }}
                selectedItem={giftFaction}
                viewOnly={viewOnly}
              />
            ) : null}
            <QuantumDatahubNode
              factionId={"Emirates of Hacan"}
              strategyCards={orderedStrategyCards}
            />
            <QuantumDatahubNode
              factionId={"Nekro Virus"}
              strategyCards={orderedStrategyCards}
            />
            <ImperialArbiter strategyCards={orderedStrategyCards} />
          </div>
        ) : null}
      </div>
      <div className={styles.MainColumn}>
        <div
          className="flexRow"
          style={{ position: "relative", maxWidth: rem(420) }}
        >
          {activeFactionId ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              <FormattedMessage
                id="vTtJ6S"
                description="Label showing that the specific player is the current player."
                defaultMessage="Active Player"
              />
              <FactionCard
                factionId={activeFactionId}
                style={{ height: rem(80) }}
                opts={{
                  iconSize: rem(60),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    paddingBottom: rem(4),
                    height: "100%",
                  }}
                >
                  <FactionTimer
                    active
                    factionId={activeFactionId}
                    style={{ fontSize: rem(28) }}
                  />
                </div>
              </FactionCard>
            </div>
          ) : (
            <div
              style={{
                fontSize: rem(28),
              }}
            >
              <FormattedMessage
                id="Gns4AS"
                description="Text showing that the current phase is complete"
                defaultMessage="{phase} Phase Complete"
                values={{ phase: phaseString("STRATEGY", intl) }}
              />
            </div>
          )}
          {onDeckFactionId ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              <FormattedMessage
                id="S0vXJt"
                description="Label showing that the specific player is up next."
                defaultMessage="On Deck"
              />
              <FactionCard
                factionId={onDeckFactionId}
                style={{ height: rem(64) }}
                opts={{
                  iconSize: rem(44),
                  fontSize: rem(24),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    paddingBottom: rem(4),
                    height: "100%",
                  }}
                >
                  <StaticFactionTimer
                    active={false}
                    factionId={onDeckFactionId}
                    style={{
                      fontSize: rem(18),
                    }}
                    width={96}
                  />
                </div>
              </FactionCard>
            </div>
          ) : null}
        </div>
        <div
          className="flexColumn"
          style={{
            gap: rem(4),
            alignItems: "stretch",
            marginTop: rem(8),
          }}
        >
          <StrategyCardSelectList mobile={false} />
        </div>
        {activeFactionId ? null : (
          <button
            style={{ fontSize: rem(20) }}
            onClick={() => advancePhaseAsync(gameId)}
            disabled={viewOnly}
          >
            <FormattedMessage
              id="8/h2ME"
              description="Text on a button that will advance the game to a specific phase."
              defaultMessage="Advance to {phase} Phase"
              values={{ phase: phaseString("ACTION", intl) }}
            />
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
