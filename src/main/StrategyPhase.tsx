import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import React, {
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";
import { ClientOnlyHoverMenu } from "../HoverMenu";
import { Loader } from "../Loader";
import { NumberedItem } from "../NumberedItem";
import { Selector } from "../Selector";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import FactionCard from "../components/FactionCard/FactionCard";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import {
  AgendaContext,
  FactionContext,
  StateContext,
  StrategyCardContext,
} from "../context/Context";
import {
  advancePhaseAsync,
  assignStrategyCardAsync,
  giftOfPrescienceAsync,
  swapStrategyCardsAsync,
} from "../dynamic/api";
import { hasTech } from "../util/api/techs";
import { getFactionColor, getFactionName } from "../util/factions";
import { getOnDeckFaction } from "../util/helpers";
import { responsivePixels } from "../util/util";
import FactionSelectRadialMenu from "../components/FactionSelectRadialMenu/FactionSelectRadialMenu";
import { StrategyCardElement } from "../components/StrategyCardElement/StrategyCardElement";
import styles from "./StrategyPhase.module.scss";

const Modal = dynamic(() => import("../components/Modal/Modal"), {
  loading: () => <Loader />,
});

function ChecksAndBalancesMenu({
  faction,
  factions,
  strategyCards,
  agendas,
  onSelect,
  mobile,
}: {
  faction: Faction | undefined;
  factions: Partial<Record<FactionId, Faction>>;
  strategyCards: StrategyCard[];
  agendas: Partial<Record<AgendaId, Agenda>>;
  onSelect: (factionId: FactionId) => void;
  mobile: boolean;
}) {
  const checksAndBalances = agendas["Checks and Balances"];
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
        fontSize: responsivePixels(16),
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
  faction: Faction | undefined;
  strategyCards: StrategyCard[];
}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const [quantum, setQuantum] = useState<{
    mainCard: StrategyCardId | undefined;
    otherCard: StrategyCardId | undefined;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });

  function quantumDatahubNode() {
    if (!gameid || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    const cardOne = strategyCards.find((card) => card.id === quantum.mainCard);
    const cardTwo = strategyCards.find((card) => card.id === quantum.otherCard);
    if (!cardOne || !cardTwo) {
      return;
    }

    swapStrategyCardsAsync(gameid, quantum.mainCard, quantum.otherCard);
  }

  if (!faction || !hasTech(faction, "Quantum Datahub Node")) {
    return null;
  }

  return (
    <LabeledDiv
      label={getFactionName(faction)}
      color={getFactionColor(faction)}
    >
      <ClientOnlyHoverMenu label="Quantum Datahub Node">
        <div
          className="flexColumn"
          style={{
            padding: responsivePixels(8),
            gap: responsivePixels(4),
            boxSizing: "border-box",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          Swap
          <Selector
            hoverMenuLabel="Strategy Card"
            autoSelect={true}
            options={strategyCards
              .filter((card) => card.faction === faction.id)
              .map((card) => card.id)}
            toggleItem={(cardId, add) => {
              const localCardName = add ? cardId : undefined;
              setQuantum((quantum) => {
                return { ...quantum, mainCard: localCardName };
              });
            }}
            selectedItem={quantum.mainCard}
          />
          for
          <Selector
            hoverMenuLabel="Strategy Card"
            options={strategyCards
              .filter((card) => card.faction && card.faction !== faction.id)
              .map((card) => card.id)}
            toggleItem={(cardId, add) => {
              const localCardName = add ? cardId : undefined;
              setQuantum((quantum) => {
                return { ...quantum, otherCard: localCardName };
              });
            }}
            selectedItem={quantum.otherCard}
          />
          <div
            className="flexColumn"
            style={{
              paddingTop: responsivePixels(4),
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
              Confirm Swap
            </button>
          </div>
        </div>
      </ClientOnlyHoverMenu>
    </LabeledDiv>
  );
}

function ImperialArbiter({ strategyCards }: { strategyCards: StrategyCard[] }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);

  const [quantum, setQuantum] = useState<{
    mainCard: StrategyCardId | undefined;
    otherCard: StrategyCardId | undefined;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });
  const arbiter = agendas["Imperial Arbiter"];

  function quantumDatahubNode() {
    if (!gameid || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    swapStrategyCardsAsync(gameid, quantum.mainCard, quantum.otherCard, true);
  }

  if (!arbiter || !arbiter.resolved) {
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
      <ClientOnlyHoverMenu label="Imperial Arbiter">
        <div
          className="flexColumn"
          style={{
            padding: responsivePixels(8),
            gap: responsivePixels(4),
            alignItems: "flex-start",
            boxSizing: "border-box",
            width: "100%",
          }}
        >
          Swap
          <Selector
            hoverMenuLabel="Strategy Card"
            autoSelect={true}
            options={strategyCards
              .filter((card) => card.faction === faction.id)
              .map((card) => card.id)}
            toggleItem={(cardId, add) => {
              const localCardName = add ? cardId : undefined;
              setQuantum((quantum) => {
                return { ...quantum, mainCard: localCardName };
              });
            }}
            selectedItem={quantum.mainCard}
          />
          for
          <Selector
            hoverMenuLabel="Strategy Card"
            options={strategyCards
              .filter((card) => card.faction && card.faction !== faction.id)
              .map((card) => card.id)}
            toggleItem={(cardId, add) => {
              const localCardName = add ? cardId : undefined;
              setQuantum((quantum) => {
                return { ...quantum, otherCard: localCardName };
              });
            }}
            selectedItem={quantum.otherCard}
          />
          <div
            className="flexColumn"
            style={{
              paddingTop: responsivePixels(4),
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
              Discard to Swap
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
        minWidth: "320px",
        padding: "4px",
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
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
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  function pickStrategyCard(
    card: StrategyCard,
    faction: Faction,
    pickedBy: FactionId
  ) {
    if (!gameid) {
      return;
    }

    assignStrategyCardAsync(gameid, faction.id, card.id, pickedBy);
  }

  const orderedStrategyCards = Object.values(strategyCards).sort(
    (a, b) => CARD_ORDER[a.id] - CARD_ORDER[b.id]
  );

  const activefaction =
    factions && state.activeplayer && state.activeplayer !== "None"
      ? factions[state?.activeplayer]
      : undefined;
  const cab = (agendas ?? {})["Checks and Balances"];

  const checksAndBalances = !!cab && !!cab.passed;

  return (
    <div
      style={{
        display: "grid",
        gridTemplate: "repeat(8, 1fr) / 14% 2fr 2fr 1fr",
        gridAutoFlow: "column",
        gap: responsivePixels(4),
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
              agendas={agendas ?? {}}
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

export function advanceToActionPhase(gameid: string) {
  advancePhaseAsync(gameid);
}

export default function StrategyPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);
  const strategyCards = useContext(StrategyCardContext);

  const [infoModal, setInfoModal] = useState<{
    show: boolean;
    title?: string;
    content?: ReactNode;
  }>({
    show: false,
  });

  function nextPhase() {
    if (!gameid) {
      return;
    }
    advanceToActionPhase(gameid);
  }

  function showInfoModal(title: string, content: ReactNode) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }

  interface Ability {
    name: string;
    description: string;
  }

  function getStartOfStrategyPhaseAbilities() {
    let abilities: Partial<Record<FactionId | "Every Player", Ability[]>> = {};
    abilities["Every Player"] = [];
    const aiRevolution = agendas
      ? agendas["Anti-Intellectual Revolution"]
      : undefined;
    if (
      aiRevolution &&
      aiRevolution.resolved &&
      aiRevolution.target === "Against" &&
      aiRevolution.activeRound === state?.round
    ) {
      abilities["Every Player"].push({
        name: "Anti-Intellectual Revolution [Against]",
        description: aiRevolution.failedText ?? aiRevolution.description,
      });
    }
    const armsReduction = agendas ? agendas["Arms Reduction"] : undefined;
    if (
      armsReduction &&
      armsReduction.resolved &&
      armsReduction.target === "Against" &&
      armsReduction.activeRound === state?.round
    ) {
      abilities["Every Player"].push({
        name: "Arms Reduction [Against]",
        description: armsReduction.failedText ?? armsReduction.description,
      });
    }
    const newConstitution = agendas ? agendas["New Constitution"] : undefined;
    if (
      newConstitution &&
      newConstitution.resolved &&
      newConstitution.target === "For" &&
      newConstitution.activeRound === state?.round
    ) {
      abilities["Every Player"].push({
        name: "New Constitution [For]",
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
          name: "Council Patronage",
          description: "Replenish your commodities, then gain 1 trade good",
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
    if (!agendas) {
      return false;
    }
    const arbiter = agendas["Imperial Arbiter"];
    if (arbiter && arbiter.resolved && arbiter.target) {
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

  function gift(factionId: FactionId | undefined) {
    if (!gameid) {
      return;
    }
    giftOfPrescienceAsync(gameid, factionId ?? "Naalu Collective");
  }

  const giftFaction = Object.values(strategyCards).reduce(
    (faction: FactionId | undefined, card) => {
      if (card.order === 0 && card.faction !== "Naalu Collective") {
        return card.faction;
      }
      return faction;
    },
    undefined
  );

  return (
    <React.Fragment>
      <Modal
        closeMenu={() => setInfoModal({ show: false })}
        visible={infoModal.show}
        title={
          <div style={{ fontSize: responsivePixels(40) }}>
            {infoModal.title}
          </div>
        }
      >
        <InfoContent>{infoModal.content}</InfoContent>
      </Modal>
      <div className={styles.LeftColumn}>
        {hasStartOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            Start of Strategy Phase
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
                                    showInfoModal(
                                      ability.name,
                                      ability.description
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
            End of Strategy Phase
            {factions && factions["Naalu Collective"] ? (
              <Selector<FactionId>
                hoverMenuLabel="Gift of Prescience"
                selectedLabel="Gift of Prescience"
                options={Object.values(factions ?? {})
                  .map((faction) => faction.id)
                  .filter((name) => name !== "Naalu Collective")}
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
          style={{ position: "relative", maxWidth: responsivePixels(420) }}
        >
          {activefaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              Active Player
              <FactionCard
                faction={activefaction}
                style={{ height: responsivePixels(80) }}
                opts={{
                  iconSize: responsivePixels(60),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    paddingBottom: responsivePixels(4),
                    height: "100%",
                  }}
                >
                  <FactionTimer
                    factionId={activefaction.id}
                    style={{ fontSize: responsivePixels(28) }}
                  />
                </div>
              </FactionCard>
            </div>
          ) : (
            <div
              style={{
                fontSize: responsivePixels(28),
                // paddingTop: responsivePixels(24),
              }}
            >
              Strategy Phase Complete
            </div>
          )}
          {onDeckFaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              On Deck
              <FactionCard
                faction={onDeckFaction}
                style={{ height: responsivePixels(64) }}
                opts={{
                  iconSize: responsivePixels(44),
                  fontSize: responsivePixels(24),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    paddingBottom: responsivePixels(4),
                    height: "100%",
                  }}
                >
                  <StaticFactionTimer
                    factionId={onDeckFaction.id}
                    style={{
                      fontSize: responsivePixels(18),
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
            gap: responsivePixels(4),
            alignItems: "stretch",
            marginTop: responsivePixels(8),
          }}
        >
          <StrategyCardSelectList mobile={false} />
        </div>
        {activefaction ? null : (
          <button
            style={{ fontSize: responsivePixels(20) }}
            onClick={() => nextPhase()}
          >
            Advance to Action Phase
          </button>
        )}
      </div>
    </React.Fragment>
  );
}
