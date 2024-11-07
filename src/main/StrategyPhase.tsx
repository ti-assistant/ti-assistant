import React, { PropsWithChildren, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { NumberedItem } from "../NumberedItem";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import FactionCard from "../components/FactionCard/FactionCard";
import FactionSelectRadialMenu from "../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import { ModalContent } from "../components/Modal/Modal";
import { Selector } from "../components/Selector/Selector";
import { StrategyCardElement } from "../components/StrategyCardElement/StrategyCardElement";
import {
  useAgenda,
  useFactions,
  useGameId,
  useGameState,
  useStrategyCards,
} from "../context/dataHooks";
import { useSharedModal } from "../data/SharedModal";
import {
  advancePhaseAsync,
  assignStrategyCardAsync,
  giftOfPrescienceAsync,
  swapStrategyCardsAsync,
} from "../dynamic/api";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getOnDeckFaction } from "../util/helpers";
import { phaseString } from "../util/strings";
import { Optional } from "../util/types/types";
import { rem } from "../util/util";
import styles from "./StrategyPhase.module.scss";

function ChecksAndBalancesMenu({
  faction,
  factions,
  strategyCards,
  onSelect,
  mobile,
}: {
  faction: Optional<Faction>;
  factions: Partial<Record<FactionId, Faction>>;
  strategyCards: StrategyCard[];
  onSelect: (factionId: FactionId) => void;
  mobile: boolean;
}) {
  const checksAndBalances = useAgenda("Checks and Balances");
  if (!faction || !checksAndBalances || !checksAndBalances.passed) {
    return null;
  }

  const numPlayers = Object.keys(factions).length;

  const cardsPerFaction: Partial<Record<FactionId, number>> = {};
  strategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    let cardCount = cardsPerFaction[card.faction] ?? 0;
    cardCount++;
    cardsPerFaction[card.faction] = cardCount;
  });
  const otherFactions = Object.values(factions)
    .filter((otherFaction) => {
      if (faction.id === otherFaction.id) {
        return false;
      }
      const numCards = cardsPerFaction[otherFaction.id] ?? 0;
      if (numPlayers > 4) {
        return numCards < 1;
      }
      return numCards < 2;
    })
    .map((otherFaction) => otherFaction.id);

  // If no other factions remaining, allow picking it yourself
  if (otherFactions.length === 0) {
    otherFactions.push(faction.id);
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
      />
    </div>
  );
}

function QuantumDatahubNode({
  faction,
  strategyCards,
}: {
  faction: Optional<Faction>;
  strategyCards: StrategyCard[];
}) {
  const gameId = useGameId();
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

    const cardOne = strategyCards.find((card) => card.id === quantum.mainCard);
    const cardTwo = strategyCards.find((card) => card.id === quantum.otherCard);
    if (!cardOne || !cardTwo) {
      return;
    }

    swapStrategyCardsAsync(gameId, quantum.mainCard, quantum.otherCard);
  }

  if (!faction || !hasTech(faction, "Quantum Datahub Node")) {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
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
                    .filter((card) => card.faction === faction.id)
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
                      (card) => card.faction && card.faction !== faction.id
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
              disabled={!quantum.mainCard || !quantum.otherCard}
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
  const factions = useFactions();

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

  if (!arbiter || !arbiter.resolved || !arbiter.passed) {
    return null;
  }

  const faction = arbiter.target
    ? factions[arbiter.target as FactionId]
    : undefined;

  if (!faction) {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
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
                    .filter((card) => card.faction === faction.id)
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
                      (card) => card.faction && card.faction !== faction.id
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
              disabled={!quantum.mainCard || !quantum.otherCard}
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

const CARD_ORDER: Record<StrategyCardId, number> = {
  Leadership: 1,
  Diplomacy: 2,
  Politics: 3,
  Construction: 4,
  Trade: 5,
  Warfare: 6,
  Technology: 7,
  Imperial: 8,
};

export function StrategyCardSelectList({ mobile }: { mobile: boolean }) {
  const gameId = useGameId();
  const checksAndBalancesAgenda = useAgenda("Checks and Balances");
  const factions = useFactions();
  const state = useGameState();
  const strategyCards = useStrategyCards();

  function pickStrategyCard(
    card: StrategyCard,
    faction: Faction,
    pickedBy: FactionId
  ) {
    if (!gameId) {
      return;
    }

    assignStrategyCardAsync(gameId, faction.id, card.id, pickedBy);
  }

  const orderedStrategyCards = Object.values(strategyCards).sort(
    (a, b) => CARD_ORDER[a.id] - CARD_ORDER[b.id]
  );

  const activefaction =
    factions && state.activeplayer && state.activeplayer !== "None"
      ? factions[state?.activeplayer]
      : undefined;

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
              card.faction || !activefaction || card.invalid ? false : true
            }
            onClick={
              checksAndBalances ||
              card.faction ||
              !activefaction ||
              card.invalid
                ? undefined
                : () => pickStrategyCard(card, activefaction, activefaction.id)
            }
            fontSize={mobile ? 20 : 24}
          >
            <ChecksAndBalancesMenu
              faction={activefaction}
              factions={factions ?? {}}
              strategyCards={orderedStrategyCards}
              mobile={mobile}
              onSelect={(factionId) => {
                const faction = (factions ?? {})[factionId];
                if (!faction || !activefaction) {
                  return;
                }
                pickStrategyCard(card, faction, activefaction.id);
              }}
            />
          </StrategyCardElement>
        );
      })}
    </div>
  );
}

export function advanceToActionPhase(gameId: string) {
  advancePhaseAsync(gameId);
}

export default function StrategyPhase() {
  const gameId = useGameId();
  // Agendas
  const aiRevolution = useAgenda("Anti-Intellectual Revolution");
  const armsReduction = useAgenda("Arms Reduction");
  const imperialArbiter = useAgenda("Imperial Arbiter");
  const newConstitution = useAgenda("New Constitution");

  const factions = useFactions();
  const state = useGameState();
  const strategyCards = useStrategyCards();
  const intl = useIntl();

  const { openModal } = useSharedModal();

  function nextPhase() {
    if (!gameId) {
      return;
    }
    advanceToActionPhase(gameId);
  }

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
      aiRevolution.activeRound === state?.round
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
      armsReduction.activeRound === state?.round
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
      newConstitution.activeRound === state?.round
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
    for (const faction of Object.values(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (faction.id === "Council Keleres") {
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
        abilities[faction.id] = factionAbilities;
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
    if (!factions) {
      return false;
    }
    if (factions["Naalu Collective"]) {
      return true;
    }
    const hacan = factions["Emirates of Hacan"];
    if (hacan && hasTech(hacan, "Quantum Datahub Node")) {
      return true;
    }
    const nekro = factions["Nekro Virus"];
    if (nekro && hasTech(nekro, "Quantum Datahub Node")) {
      return true;
    }
    if (imperialArbiter && imperialArbiter.resolved && imperialArbiter.target) {
      return true;
    }
    return false;
  }

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions ?? {}).length;
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

  if (!state) {
    return null;
  }

  const activefaction =
    factions && state.activeplayer && state.activeplayer !== "None"
      ? factions[state?.activeplayer]
      : undefined;
  const onDeckFaction = getOnDeckFaction(state, factions ?? {}, strategyCards);
  const updatedStrategyCards = Object.values(strategyCards).map((card) => {
    const updatedCard = structuredClone(card);

    return updatedCard;
  });

  const orderedStrategyCards = updatedStrategyCards.sort(
    (a, b) => a.order - b.order
  );

  function gift(factionId: Optional<FactionId>) {
    if (!gameId) {
      return;
    }
    giftOfPrescienceAsync(gameId, factionId ?? "Naalu Collective");
  }

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
              {Object.entries(getStartOfStrategyPhaseAbilities()).map(
                ([factionId, abilities]) => {
                  if (abilities.length === 0) {
                    return null;
                  }
                  const label =
                    factions && factionId !== "Every Player"
                      ? getFactionName(factions[factionId as FactionId])
                      : factionId;
                  return (
                    <NumberedItem key={factionId}>
                      <LabeledDiv
                        label={label}
                        color={
                          factions
                            ? getFactionColor(
                                factionId !== "Every Player"
                                  ? factions[factionId as FactionId]
                                  : undefined
                              )
                            : "#eee"
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
                                          {ability.description}
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
            {factions && factions["Naalu Collective"] ? (
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
                options={Object.values(factions)
                  .filter((faction) => faction.id !== "Naalu Collective")
                  .map((faction) => {
                    return { id: faction.id, name: faction.name };
                  })}
                toggleItem={(factionId, add) => {
                  const localFactionName = add ? factionId : undefined;
                  gift(localFactionName);
                }}
                selectedItem={giftFaction}
              />
            ) : null}
            <QuantumDatahubNode
              faction={(factions ?? {})["Emirates of Hacan"]}
              strategyCards={orderedStrategyCards}
            />
            <QuantumDatahubNode
              faction={(factions ?? {})["Nekro Virus"]}
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
          {activefaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              <FormattedMessage
                id="vTtJ6S"
                description="Label showing that the specific player is the current player."
                defaultMessage="Active Player"
              />
              <FactionCard
                faction={activefaction}
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
                    factionId={activefaction.id}
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
          {onDeckFaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              <FormattedMessage
                id="S0vXJt"
                description="Label showing that the specific player is up next."
                defaultMessage="On Deck"
              />
              <FactionCard
                faction={onDeckFaction}
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
                    factionId={onDeckFaction.id}
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
        {activefaction ? null : (
          <button style={{ fontSize: rem(20) }} onClick={() => nextPhase()}>
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
