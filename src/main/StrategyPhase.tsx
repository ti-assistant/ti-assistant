import { useRouter } from "next/router";
import useSWR, { mutate } from "swr";
import { StrategyCardElement } from "../StrategyCard";
import { getOnDeckFaction } from "../util/helpers";
import {
  strategyCardOrder,
  unassignStrategyCard,
  swapStrategyCards,
  setFirstStrategyCard,
  assignStrategyCard,
  StrategyCard,
} from "../util/api/cards";
import { Faction, readyAllFactions } from "../util/api/factions";
import { getNextIndex, responsivePixels } from "../util/util";
import { fetcher, poster } from "../util/api/util";
import { BasicFactionTile } from "../FactionTile";
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
import { GameState, nextPlayer, StateUpdateData } from "../util/api/state";

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

export function advanceToActionPhase(
  gameid: string,
  strategyCards: Record<string, StrategyCard>
) {
  const data: StateUpdateData = {
    action: "ADVANCE_PHASE",
  };
  let minCard: { order: number; faction?: string } = {
    order: Number.MAX_SAFE_INTEGER,
  };
  for (const strategyCard of Object.values(strategyCards)) {
    if (strategyCard.faction && strategyCard.order < minCard.order) {
      minCard = strategyCard;
    }
  }
  if (!minCard.faction) {
    throw Error("Transition to ACTION phase w/o selecting cards?");
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
  const { data: strategyCards }: { data?: Record<string, StrategyCard> } =
    useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
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
    advanceToActionPhase(gameid, strategyCards ?? {});
  }

  function showInfoModal(title: string, content: ReactNode) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }
  function pickStrategyCard(card: StrategyCard, faction: Faction) {
    if (!gameid) {
      return;
    }
    assignStrategyCard(gameid, card.name, faction.name);
    nextPlayer(gameid, factions ?? {}, strategyCards ?? {});
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
    for (const factionName of Object.keys(factions ?? {})) {
      const factionAbilities: Ability[] = [];
      if (factionName === "Council Keleres") {
        factionAbilities.push({
          name: "Council Patronage",
          description: "Replenish your commodities, then gain 1 trade good",
        });
      }
      if (factionAbilities.length > 0) {
        abilities[factionName] = factionAbilities;
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

  function getEndOfStrategyPhaseAbilities() {
    let abilities: Record<string, Ability[]> = {};
    for (const factionName of Object.keys(factions ?? {})) {
      abilities[factionName] = [];
    }
    return abilities;
  }

  function hasEndOfStrategyPhaseAbilities() {
    for (const abilities of Object.values(getEndOfStrategyPhaseAbilities())) {
      if (abilities.length > 0) {
        return true;
      }
    }
    return false;
  }

  function didFactionJustGo(factionName: string) {
    const numFactions = Object.keys(factions ?? {}).length;
    const faction = factions ? factions[factionName] : undefined;
    if (!faction) {
      return false;
    }
    if (numFactions === 3 || numFactions === 4) {
      let numPicked = 0;
      for (const card of Object.values(strategyCards ?? {})) {
        if (card.faction) {
          ++numPicked;
        }
      }
      if (numPicked === numFactions) {
        return faction.order === numFactions;
      }
      if (numPicked > numFactions) {
        const nextOrder = numFactions - (numPicked - numFactions) + 1;
        return faction.order === nextOrder;
      }
    }
    if (state?.activeplayer === "None") {
      return faction.order === numFactions;
    }
    const activeFaction = factions
      ? factions[state?.activeplayer ?? ""]
      : undefined;
    if (!activeFaction) {
      return;
    }
    return (
      getNextIndex(faction.order, numFactions + 1, 1) === activeFaction.order
    );
  }

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions ?? {}).length;
    let numPicked = 0;
    for (const card of Object.values(strategyCards ?? {})) {
      if (card.faction) {
        ++numPicked;
      }
    }
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
    strategyCards ?? {}
  );

  function undoPick() {
    if (!gameid) {
      return;
    }
    let cardName;

    orderedStrategyCards.map(([name, card]) => {
      if (card.faction) {
        if (didFactionJustGo(card.faction)) {
          cardName = name;
        }
      }
    });
    if (!cardName) {
      return;
    }
    unassignStrategyCard(gameid, cardName);
  }

  function publicDisgrace(cardName: string) {
    if (!gameid) {
      return;
    }
    unassignStrategyCard(gameid, cardName);
  }

  function imperialArbiterFn(factionName: string) {
    if (!gameid) {
      return;
    }
    const imperialArbiter = agendas
      ? agendas["Imperial Arbiter"]?.target
      : undefined;
    if (!imperialArbiter) {
      return;
    }
    const factionCard = Object.values(strategyCards ?? {}).find(
      (card) => card.faction === factionName
    );
    const arbiterCard = Object.values(strategyCards ?? {}).find(
      (card) => card.faction === imperialArbiter
    );
    if (!factionCard || !arbiterCard) {
      return;
    }
    swapStrategyCards(gameid, factionCard, arbiterCard);
    repealAgenda(gameid, "Imperial Arbiter");
  }

  function quantumDatahubNode(factionName: string) {
    if (!gameid) {
      return;
    }
    const factionCard = Object.values(strategyCards ?? {}).find(
      (card) => card.faction === factionName
    );
    const hacanCard = Object.values(strategyCards ?? {}).find(
      (card) => card.faction === "Emirates of Hacan"
    );
    if (!factionCard || !hacanCard) {
      return;
    }
    swapStrategyCards(gameid, factionCard, hacanCard);
  }

  function giftOfPrescience(cardName: string) {
    if (!gameid) {
      return;
    }
    setFirstStrategyCard(gameid, cardName);
  }

  const orderedStrategyCards = Object.entries(strategyCards ?? {}).sort(
    (a, b) => strategyCardOrder[a[1].name] - strategyCardOrder[b[1].name]
  );
  return (
    <div
      className="flexRow"
      style={{
        alignItems: "center",
        height: "100vh",
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
                  const label = factions
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
                      {/* <div className="flexRow">
                <BasicFactionTile faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: responsivePixels(16)}}/>
                <div className="flexColumn">
                {abilities.map((ability) => {
                  return (
                    <div className="flexRow">
                      {ability.name}
                      <div className="popupIcon" onClick={() => showInfoModal(ability.name, ability.description)}>
                        &#x24D8;
                      </div>
                    </div>);
                })}
                </div>
              </div> */}
                    </NumberedItem>
                  );
                }
              )}
            </ol>
          </div>
        ) : null}
        {hasEndOfStrategyPhaseAbilities() ? (
          <div className="flexColumn">
            End of Strategy Phase
            <ol>
              {Object.entries(getEndOfStrategyPhaseAbilities()).map(
                ([factionName, abilities]) => {
                  if (abilities.length === 0) {
                    return null;
                  }
                  const faction = factions ? factions[factionName] : undefined;
                  if (!faction) {
                    return null;
                  }
                  return (
                    <li key={factionName}>
                      <div className="flexRow">
                        <BasicFactionTile
                          faction={faction}
                          opts={{ fontSize: responsivePixels(16) }}
                        />
                        <div className="flexColumn">
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
                      </div>
                    </li>
                  );
                }
              )}
            </ol>
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
          {orderedStrategyCards.map(([name, card]) => {
            const factionActions = [];
            if (card.faction) {
              if (didFactionJustGo(card.faction)) {
                factionActions.push({
                  text: "Public Disgrace",
                  action: () => publicDisgrace(name),
                });
              }
              if (haveAllFactionsPicked()) {
                const hacan = factions
                  ? factions["Emirates of Hacan"]
                  : undefined;
                if (
                  hacan &&
                  card.faction !== "Emirates of Hacan" &&
                  hasTech(hacan, "Quantum Datahub Node")
                ) {
                  factionActions.push({
                    text: "Quantum Datahub Node",
                    action: () => {
                      if (!card.faction) {
                        return;
                      }
                      quantumDatahubNode(card.faction);
                    },
                  });
                }
                const naalu = factions
                  ? factions["Naalu Collective"]
                  : undefined;
                if (naalu && card.faction !== "Naalu Collective") {
                  factionActions.push({
                    text:
                      card.order === 0
                        ? "Undo Gift of Prescience"
                        : "Gift of Prescience",
                    action: () => giftOfPrescience(name),
                  });
                }
                const imperialArbiter = agendas
                  ? agendas["Imperial Arbiter"]
                  : undefined;
                if (
                  imperialArbiter &&
                  imperialArbiter.resolved &&
                  card.faction !== imperialArbiter.target
                ) {
                  factionActions.push({
                    text: "Imperial Arbiter",
                    action: () => {
                      if (!card.faction) {
                        return;
                      }
                      imperialArbiterFn(card.faction);
                    },
                  });
                }
              }
            }
            return (
              <StrategyCardElement
                key={name}
                card={card}
                active={
                  card.faction || !activefaction || card.invalid ? false : true
                }
                onClick={
                  card.faction || !activefaction || card.invalid
                    ? undefined
                    : () => pickStrategyCard(card, activefaction)
                }
                factionActions={factionActions}
              />
            );
          })}
        </div>
        {!activefaction || activefaction.name !== state.speaker ? (
          <button onClick={() => undoPick()}>Undo</button>
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
        style={{ height: "100vh", width: responsivePixels(280) }}
      >
        <SummaryColumn />
      </div>
    </div>
  );
}
