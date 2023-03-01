import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { StrategyCardElement } from "../StrategyCard";
import { getOnDeckFaction } from "../util/helpers";
import { strategyCardOrder, StrategyCard } from "../util/api/cards";
import { Faction, readyAllFactions } from "../util/api/factions";
import { responsivePixels } from "../util/util";
import { fetcher, poster } from "../util/api/util";
import { FactionTimer, StaticFactionTimer } from "../Timer";
import { FactionCard } from "../FactionCard";
import { Modal } from "../Modal";
import React, { PropsWithChildren, ReactNode, useState } from "react";
import SummaryColumn from "./SummaryColumn";
import { LabeledDiv } from "../LabeledDiv";
import { getFactionColor, getFactionName } from "../util/factions";
import { NumberedItem } from "../NumberedItem";
import { hasTech } from "../util/api/techs";
import { Agenda, repealAgenda } from "../util/api/agendas";
import {
  GameState,
  nextPlayer,
  prevPlayer,
  StateUpdateData,
} from "../util/api/state";
import {
  finalizeSubState,
  pickSubStateStrategyCard,
  setSubStateOther,
  SubState,
  swapSubStateStrategyCards,
  undoSubStateStrategyCard,
} from "../util/api/subState";
import { getDefaultStrategyCards } from "../util/api/defaults";
import { ClientOnlyHoverMenu, HoverMenu } from "../HoverMenu";
import { Selector } from "../Selector";

function ChecksAndBalancesMenu({
  faction,
  factions,
  strategyCards,
  agendas,
  onSelect,
  mobile,
}: {
  faction: Faction | undefined;
  factions: Record<string, Faction>;
  strategyCards: StrategyCard[];
  agendas: Record<string, Agenda>;
  onSelect: (factionName: string) => void;
  mobile: boolean;
}) {
  const checksAndBalances = agendas["Checks and Balances"];
  if (!faction || !checksAndBalances || !checksAndBalances.passed) {
    return null;
  }

  const numPlayers = Object.keys(factions).length;

  const cardsPerFaction: Record<string, number> = {};
  strategyCards.forEach((card) => {
    if (!card.faction) {
      return;
    }
    if (!cardsPerFaction[card.faction]) {
      cardsPerFaction[card.faction] = 0;
    }
    cardsPerFaction[card.faction] += 1;
  });
  const otherFactions = Object.keys(factions).filter((factionName) => {
    if (faction.name === factionName) {
      return false;
    }
    const numCards = cardsPerFaction[factionName] ?? 0;
    if (numPlayers > 4) {
      return numCards < 1;
    }
    return numCards < 2;
  });

  // If no other factions remaining, allow picking it yourself
  if (otherFactions.length === 0) {
    otherFactions.push(faction.name);
  }

  return (
    <Selector
      buttonStyle={mobile ? { fontSize: responsivePixels(16) } : {}}
      hoverMenuLabel="Give to Faction"
      options={otherFactions}
      toggleItem={(factionName, _) => {
        onSelect(factionName);
      }}
    />
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
    mainCard: string | undefined;
    otherCard: string | undefined;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });

  function quantumDatahubNode() {
    if (!gameid || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    const cardOne = strategyCards.find(
      (card) => card.name === quantum.mainCard
    );
    const cardTwo = strategyCards.find(
      (card) => card.name === quantum.otherCard
    );
    if (!cardOne || !cardTwo) {
      return;
    }

    swapSubStateStrategyCards(gameid, cardOne, cardTwo);
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
              .filter((card) => card.faction === faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
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
              .filter((card) => card.faction && card.faction !== faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
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
  const { data: agendas = {} }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: factions = {} }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const [quantum, setQuantum] = useState<{
    mainCard: string | undefined;
    otherCard: string | undefined;
  }>({
    mainCard: undefined,
    otherCard: undefined,
  });
  const arbiter = agendas["Imperial Arbiter"];

  function quantumDatahubNode() {
    if (!gameid || !quantum.mainCard || !quantum.otherCard) {
      return;
    }

    const cardOne = strategyCards.find(
      (card) => card.name === quantum.mainCard
    );
    const cardTwo = strategyCards.find(
      (card) => card.name === quantum.otherCard
    );
    if (!cardOne || !cardTwo) {
      return;
    }

    swapSubStateStrategyCards(gameid, cardOne, cardTwo);
    repealAgenda(gameid, arbiter);
  }

  if (!arbiter || !arbiter.resolved) {
    return null;
  }

  const faction = factions[arbiter.target ?? ""];

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
              .filter((card) => card.faction === faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
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
              .filter((card) => card.faction && card.faction !== faction.name)
              .map((card) => card.name)}
            toggleItem={(cardName, add) => {
              const localCardName = add ? cardName : undefined;
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

export function StrategyCardSelectList({ mobile }: { mobile: boolean }) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher
  );

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions ?? {}).length;
    let numPicked = (subState.strategyCards ?? []).length;
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }
  function pickStrategyCard(card: StrategyCard, faction: Faction) {
    if (!gameid) {
      return;
    }
    pickSubStateStrategyCard(
      gameid,
      card.name,
      faction.name,
      Object.keys(factions ?? {}).length
    );
    nextPlayer(gameid, factions ?? {}, strategyCards, subState);
  }

  const updatedStrategyCards = Object.values(strategyCards).map((card) => {
    const updatedCard = structuredClone(card);
    for (const cardObj of subState?.strategyCards ?? []) {
      if (cardObj.cardName === card.name) {
        updatedCard.faction = cardObj.factionName;
      }
    }

    return updatedCard;
  });
  const orderedStrategyCards = updatedStrategyCards.sort(
    (a, b) => strategyCardOrder[a.name] - strategyCardOrder[b.name]
  );

  let firstCard = true;
  const finalStrategyCards = orderedStrategyCards.map((card) => {
    const naalu = (factions ?? {})["Naalu Collective"];
    if (naalu && haveAllFactionsPicked() && firstCard) {
      const gift = subState["Gift of Prescience"];
      if (
        (gift && card.faction === gift) ||
        (!gift && card.faction === "Naalu Collective")
      ) {
        card.order = 0;
        firstCard = false;
      }
    }
    return card;
  });

  const activefaction = factions
    ? factions[state?.activeplayer ?? ""]
    : undefined;
  const cab = (agendas ?? {})["Checks and Balances"];

  const checksAndBalances = !!cab && !!cab.passed;

  return (
    <React.Fragment>
      {finalStrategyCards.map((card) => {
        return (
          <StrategyCardElement
            key={card.name}
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
                : () => pickStrategyCard(card, activefaction)
            }
            fontSize={mobile ? 20 : 24}
          >
            <ChecksAndBalancesMenu
              faction={activefaction}
              factions={factions ?? {}}
              strategyCards={finalStrategyCards}
              mobile={mobile}
              agendas={agendas ?? {}}
              onSelect={(factionName) => {
                const faction = (factions ?? {})[factionName];
                if (!faction) {
                  return;
                }
                pickStrategyCard(card, faction);
              }}
            />
          </StrategyCardElement>
        );
      })}
    </React.Fragment>
  );
}

export function advanceToActionPhase(
  gameid: string,
  strategyCards: Record<string, StrategyCard>,
  subState: SubState
) {
  finalizeSubState(gameid, subState);

  const data: StateUpdateData = {
    action: "ADVANCE_PHASE",
  };
  let minCard: { order: number; faction?: string } = {
    order: Number.MAX_SAFE_INTEGER,
  };
  let naalu = false;
  for (const strategyCard of Object.values(strategyCards)) {
    const updatedCard = structuredClone(strategyCard);
    for (const cardObj of subState.strategyCards ?? []) {
      if (cardObj.cardName === strategyCard.name) {
        updatedCard.faction = cardObj.factionName;
      }
    }
    if (updatedCard.faction === "Naalu Collective") {
      naalu = true;
    }
    if (updatedCard.faction && updatedCard.order < minCard.order) {
      minCard = updatedCard;
    }
  }
  if (!minCard.faction) {
    throw Error("Transition to ACTION phase w/o selecting cards?");
  }

  if (naalu) {
    if (subState["Gift of Prescience"]) {
      minCard.faction = subState["Gift of Prescience"];
    } else {
      minCard.faction = "Naalu Collective";
    }
  }

  mutate(
    `/api/${gameid}/state`,
    async () => await poster(`/api/${gameid}/stateUpdate`, data),
    {
      optimisticData: (state: GameState) => {
        const updatedState = structuredClone(state);

        updatedState.phase = "ACTION";
        updatedState.activeplayer = minCard.faction;

        return updatedState;
      },
      revalidate: false,
    }
  );

  readyAllFactions(gameid);
}

export default function StrategyPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const { data: subState = {} }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );
  const {
    data: strategyCards = getDefaultStrategyCards(),
  }: { data?: Record<string, StrategyCard> } = useSWR(
    gameid ? `/api/${gameid}/strategycards` : null,
    fetcher
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
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
    advanceToActionPhase(gameid, strategyCards, subState);
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
    let abilities: Record<string, Ability[]> = {};
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
      if (faction.name === "Council Keleres") {
        factionAbilities.push({
          name: "Council Patronage",
          description: "Replenish your commodities, then gain 1 trade good",
        });
      }
      if (factionAbilities.length > 0) {
        abilities[getFactionName(faction)] = factionAbilities;
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
    let numPicked = (subState.strategyCards ?? []).length;
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }

  if (!state) {
    return null;
  }

  const activefaction = factions
    ? factions[state?.activeplayer ?? ""]
    : undefined;
  const onDeckFaction = getOnDeckFaction(
    state,
    factions ?? {},
    strategyCards,
    subState
  );

  function undoPick() {
    if (!gameid) {
      return;
    }
    undoSubStateStrategyCard(gameid);
    prevPlayer(gameid, factions ?? {}, subState);
  }

  function canUndo() {
    return (subState.strategyCards ?? []).length > 0;
  }

  function giftOfPrescience(factionName: string | undefined) {
    if (!gameid) {
      return;
    }
    if (!factionName || subState["Gift of Prescience"] === factionName) {
      setSubStateOther(gameid, "Gift of Prescience", undefined);
    } else {
      setSubStateOther(gameid, "Gift of Prescience", factionName);
    }
  }

  let firstCard = true;

  const updatedStrategyCards = Object.values(strategyCards).map((card) => {
    const updatedCard = structuredClone(card);
    for (const cardObj of subState?.strategyCards ?? []) {
      if (cardObj.cardName === card.name) {
        updatedCard.faction = cardObj.factionName;
      }
    }

    return updatedCard;
  });

  const orderedStrategyCards = updatedStrategyCards.sort(
    (a, b) => strategyCardOrder[a.name] - strategyCardOrder[b.name]
  );

  const finalStrategyCards = orderedStrategyCards.map((card) => {
    const naalu = (factions ?? {})["Naalu Collective"];
    if (naalu && haveAllFactionsPicked() && firstCard) {
      const gift = subState["Gift of Prescience"];
      if (
        (gift && card.faction === gift) ||
        (!gift && card.faction === "Naalu Collective")
      ) {
        card.order = 0;
        firstCard = false;
      }
    }
    return card;
  });

  return (
    <div
      className="flexRow"
      style={{
        alignItems: "center",
        height: "100svh",
        width: "100%",
        justifyContent: "space-between",
        gap: responsivePixels(20),
      }}
    >
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
      <div
        className="flexColumn"
        style={{ alignItems: "center", width: responsivePixels(280) }}
      >
        {hasStartOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            Start of Strategy Phase
            <ol className="flexColumn" style={{ alignItems: "stretch" }}>
              {Object.entries(getStartOfStrategyPhaseAbilities()).map(
                ([factionName, abilities]) => {
                  if (abilities.length === 0) {
                    return null;
                  }
                  const label =
                    factions && factionName !== "Every Player"
                      ? getFactionName(factions[factionName])
                      : factionName;
                  return (
                    <NumberedItem key={factionName}>
                      <LabeledDiv
                        label={label}
                        color={
                          factions
                            ? getFactionColor(factions[factionName])
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
              <Selector
                hoverMenuLabel="Gift of Prescience"
                selectedLabel="Gift of Prescience"
                options={Object.values(factions ?? {})
                  .map((faction) => faction.name)
                  .filter((name) => name !== "Naalu Collective")}
                toggleItem={(factionName, add) => {
                  const localFactionName = add ? factionName : undefined;
                  giftOfPrescience(localFactionName);
                }}
                selectedItem={subState["Gift of Prescience"]}
              />
            ) : null}
            <QuantumDatahubNode
              faction={(factions ?? {})["Emirates of Hacan"]}
              strategyCards={finalStrategyCards}
            />
            <QuantumDatahubNode
              faction={(factions ?? {})["Nekro Virus"]}
              strategyCards={finalStrategyCards}
            />
            <ImperialArbiter strategyCards={finalStrategyCards} />
          </div>
        ) : null}
      </div>
      <div
        className="flexColumn"
        style={{
          justifyContent: "flex-start",
          marginTop: responsivePixels(28),
        }}
      >
        <div
          className="flexRow"
          style={{ position: "relative", maxWidth: "100%" }}
        >
          {activefaction ? (
            <div className="flexColumn" style={{ alignItems: "center" }}>
              Active Player
              <FactionCard
                faction={activefaction}
                style={{ height: responsivePixels(80) }}
                opts={{
                  iconSize: responsivePixels(68),
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
                  <FactionTimer
                    factionName={activefaction.name}
                    style={{ fontSize: responsivePixels(28) }}
                  />
                </div>
              </FactionCard>
            </div>
          ) : (
            <div
              style={{
                fontSize: responsivePixels(30),
                paddingTop: responsivePixels(24),
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
                style={{ height: responsivePixels(50) }}
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
                    factionName={onDeckFaction.name}
                    style={{
                      fontSize: responsivePixels(18),
                      width: responsivePixels(140),
                    }}
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
            width: responsivePixels(420),
          }}
        >
          <StrategyCardSelectList mobile={false} />
        </div>
        {canUndo() ? (
          <button onClick={() => undoPick()}>Undo SC Pick</button>
        ) : null}
        {activefaction ? null : (
          <button
            style={{ fontSize: responsivePixels(20) }}
            onClick={() => nextPhase()}
          >
            Advance to Action Phase
          </button>
        )}
      </div>
      <div
        className="flexColumn"
        style={{ height: "100svh", width: responsivePixels(280) }}
      >
        <SummaryColumn />
      </div>
    </div>
  );
}
