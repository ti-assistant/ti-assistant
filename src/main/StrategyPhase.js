import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { StrategyCard } from '../StrategyCard';
import { getOnDeckFaction } from '../util/helpers';
import { strategyCardOrder, unassignStrategyCard, swapStrategyCards, setFirstStrategyCard, assignStrategyCard } from '../util/api/cards';
import { readyAllFactions } from '../util/api/factions';
import { getNextIndex, responsivePixels } from '../util/util';
import { fetcher, poster } from '../util/api/util';
import { BasicFactionTile } from '../FactionTile';
import { FactionTimer, StaticFactionTimer } from '../Timer';
import { FactionCard, FullFactionSymbol } from '../FactionCard';
import { Modal } from '../Modal';
import { useRef, useState } from 'react';
import SummaryColumn from './SummaryColumn';
import { LawsInEffect } from '../LawsInEffect';
import { useSharedUpdateTimes } from '../Updater';
import { LabeledDiv } from '../LabeledDiv';
import { getFactionColor, getFactionName } from '../util/factions';
import { NumberedItem } from '../NumberedItem';
import { hasTech } from '../util/api/techs';
import { repealAgenda } from '../util/api/agendas';
import { nextPlayer } from '../util/api/state';

function InfoContent({content}) {
  return (
    <div className="myriadPro" style={{minWidth: "320px", padding: "4px", whiteSpace: "pre-line", textAlign: "center", fontSize: responsivePixels(32)}}>
      {content}
    </div>
  );
}

export function advanceToActionPhase(mutate, gameid, strategyCards, state, factions) {
  const data = {
    action: "ADVANCE_PHASE",
  };
  let minCard = {
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

  mutate(`/api/${gameid}/state`, async () =>
    await poster(`/api/${gameid}/stateUpdate`, data), {
    optimisticData: state => {
      const updatedState = structuredClone(state);

      updatedState.phase = "ACTION";
      updatedState.activeplayer = minCard.faction;

      return updatedState;
    },
    revalidate: false,
  });

  readyAllFactions(mutate, gameid);
}

export default function StrategyPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: agendas } = useSWR(gameid ? `/api/${gameid}/agendas` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const [ infoModal, setInfoModal ] = useState({
    show: false,
  });
  


  if (!factions || !state || !strategyCards) {
    return <div>Loading...</div>;
  }

  function nextPhase() {
    advanceToActionPhase(mutate, gameid, strategyCards, state, factions);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }
  function pickStrategyCard(card, faction) {
    assignStrategyCard(mutate, gameid, card.name, faction.name);
    nextPlayer(mutate, gameid, factions, strategyCards);
  }

  function getStartOfStrategyPhaseAbilities() {
    let abilities = {};
    abilities['Every Player'] = [];
    const aiRevolution = agendas['Anti-Intellectual Revolution'] ?? {};
    if (aiRevolution.resolved &&
        aiRevolution.target === "Against" &&
        aiRevolution.activeRound === state.round) {
      abilities['Every Player'].push({
        name: "Anti-Intellectual Revolution [Against]",
        description: aiRevolution.failedText,
      });
    }
    const armsReduction = agendas['Arms Reduction'] ?? {};
    if (armsReduction.resolved &&
        armsReduction.target === "Against" &&
        armsReduction.activeRound === state.round) {
      abilities['Every Player'].push({
        name: "Arms Reduction [Against]",
        description: armsReduction.failedText,
      });
    }
    const newConstitution = agendas['New Constitution'] ?? {};
    if (newConstitution.resolved &&
        newConstitution.target === "For" &&
        newConstitution.activeRound === state.round) {
      abilities['Every Player'].push({
        name: "New Constitution [For]",
        description: newConstitution.passedText,
      });
    }
    if (abilities['Every Player'].length === 0) {
      delete abilities['Every Player'];
    }
    for (const [name, faction] of Object.entries(factions)) {
      abilities[name] = [];
      if (name === "Council Keleres") {
        abilities[name].push({
          name: "Council Patronage",
          description: "Replenish your commodities, then gain 1 trade good",
        });
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
    let abilities = {};
    for (const [name, faction] of Object.entries(factions)) {
      abilities[name] = [];
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

  function didFactionJustGo(factionName) {
    const numFactions = Object.keys(factions).length;
    const faction = factions[factionName];
    if (numFactions === 3 || numFactions === 4) {
      let numPicked = 0;
      for (const card of Object.values(strategyCards)) {
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
    if (state.activeplayer === "None") {
      return faction.order === numFactions;
    }
    return getNextIndex(faction.order, numFactions + 1, 1) === factions[state.activeplayer].order;
  }

  function haveAllFactionsPicked() {
    const numFactions = Object.keys(factions).length;
    let numPicked = 0;
    for (const card of Object.values(strategyCards)) {
      if (card.faction) {
        ++numPicked;
      }
    }
    if (numFactions === 3 || numFactions === 4) {
      return numFactions * 2 === numPicked;
    }
    return numFactions === numPicked;
  }

  const activefaction = factions[state.activeplayer] ?? null;
  const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);

  function undoPick() {

    let cardName;

    orderedStrategyCards.map(([name, card]) => {
      if (card.faction) {
        if (didFactionJustGo(card.faction)) {
          cardName = name;
        }
      }
    });
    unassignStrategyCard(mutate, gameid, cardName);
  }

  function publicDisgrace(cardName) {
    unassignStrategyCard(mutate, gameid, cardName);
  }

  function imperialArbiterFn(factionName) {
    const imperialArbiter = agendas['Imperial Arbiter'].target;
    const factionCard = Object.values(strategyCards).find((card) => card.faction === factionName);
    const arbiterCard = Object.values(strategyCards).find((card) => card.faction === imperialArbiter);
    swapStrategyCards(mutate, gameid, factionCard, arbiterCard);
    repealAgenda(mutate, gameid, "Imperial Arbiter");
  }

  function quantumDatahubNode(factionName) {
    const factionCard = Object.values(strategyCards).find((card) => card.faction === factionName);
    const hacanCard = Object.values(strategyCards).find((card) => card.faction === "Emirates of Hacan");
    swapStrategyCards(mutate, gameid, factionCard, hacanCard);
  }

  function giftOfPrescience(cardName) {
    setFirstStrategyCard(mutate, gameid, cardName);
  }

  const orderedStrategyCards = Object.entries(strategyCards).sort((a, b) => strategyCardOrder[a[0]] - strategyCardOrder[b[0]]);
  return (
    <div className="flexRow" style={{alignItems: "center", height: "100vh", width: "100%", justifyContent: "space-between", gap: responsivePixels(20)}}>
      <Modal closeMenu={() => setInfoModal({show: false})} visible={infoModal.show} title={<div style={{fontSize: responsivePixels(40)}}>{infoModal.title}</div>} content={
        <InfoContent content={infoModal.content} />
      } top="30%" />
      <div className="flexColumn" style={{alignItems: "center", width: responsivePixels(280)}}>
      {hasStartOfStrategyPhaseAbilities() ? 
        <div className="flexColumn">
          Start of Strategy Phase
          <ol className="flexColumn" style={{alignItems: "stretch"}}>
          {Object.entries(getStartOfStrategyPhaseAbilities()).map(([factionName, abilities]) => {
            if (abilities.length === 0) {
              return null;
            }
            const label = !factions[factionName] ? factionName : getFactionName(factions[factionName]); 
            return (
            <NumberedItem key={factionName}>
              <LabeledDiv label={label} color={getFactionColor(factions[factionName])}>
                <div className="flexColumn" style={{width: "100%", alignItems: "flex-start"}}>
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
            </NumberedItem>);
          })}
          </ol> 
        </div> : null}
      {hasEndOfStrategyPhaseAbilities() ? 
        <div className="flexColumn">
          End of Strategy Phase
          <ol>
          {Object.entries(getEndOfStrategyPhaseAbilities()).map(([factionName, abilities]) => {
            if (abilities.length === 0) {
              return null;
            }
            return (
              <li key={factionName}>
                <div className="flexRow">
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
                </div>
              </li>);
          })}
          </ol> 
        </div> : null}
        {/* <LawsInEffect /> */}
      </div>
      <div className="flexColumn" style={{justifyContent: "flex-start", marginTop: responsivePixels(28)}}>
        <div className="flexRow" style={{position: "relative", maxWidth: "100%"}}>
          {activefaction ?
            <div className="flexColumn" style={{alignItems: "center"}}>
              Active Player
              <FactionCard faction={activefaction} content={
                <div className="flexColumn" style={{paddingBottom: responsivePixels(4), height: "100%"}}>
                  <FactionTimer factionName={activefaction.name} style={{fontSize: responsivePixels(28)}} />
                </div>
              } style={{height: responsivePixels(80)}} opts={{iconSize: responsivePixels(68), fontSize: responsivePixels(24)}} />
            </div>
          : <div style={{fontSize: responsivePixels(30), paddingTop: responsivePixels(24)}}>Strategy Phase Complete</div>}
          {onDeckFaction ? 
            <div className="flexColumn" style={{alignItems: "center"}}>
              On Deck
              <FactionCard faction={onDeckFaction} content={
                <div className="flexColumn" style={{paddingBottom: responsivePixels(4), height: "100%"}}>
                  <StaticFactionTimer factionName={onDeckFaction.name} style={{fontSize: responsivePixels(18), width: responsivePixels(140)}} />
                </div>
              } style={{height: responsivePixels(50)}} opts={{iconSize: responsivePixels(44), fontSize: responsivePixels(24)}} />
            </div>
          : null}
        </div>
        <div className="flexColumn" style={{gap: responsivePixels(4), alignItems: "stretch", width: "100%", marginTop: responsivePixels(8), width: responsivePixels(420)}}>
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
              if (factions['Emirates of Hacan'] &&
                  card.faction !== "Emirates of Hacan" &&
                  hasTech(factions['Emirates of Hacan'], "Quantum Datahub Node")) {
                factionActions.push({
                  text: "Quantum Datahub Node",
                  action: () => quantumDatahubNode(card.faction),
                });
              }
              if (factions['Naalu Collective'] && card.faction !== "Naalu Collective") {
                factionActions.push({
                  text: (card.order === 0 ? "Undo Gift of Prescience" : "Gift of Prescience"),
                  action: () => giftOfPrescience(name),
                });
              }
              const imperialArbiter = agendas['Imperial Arbiter'];
              if (imperialArbiter.resolved &&
                  card.faction !== imperialArbiter.target) {
                factionActions.push({
                  text: "Imperial Arbiter",
                  action: () => imperialArbiterFn(card.faction),
                });
              }
            }
          }
          return (
            <StrategyCard key={name} card={card} active={card.faction || !activefaction || card.invalid ? false : true} onClick={card.faction || !activefaction || card.invalid ? null : () => pickStrategyCard(card, activefaction)} factionActions={factionActions} />);
        })}
      </div>
      {!activefaction || activefaction.name !== state.speaker ?
        <button onClick={() => undoPick()}>Undo</button>
      : null}
      {activefaction ? null :
        <button style={{fontSize: responsivePixels(20)}} onClick={() => nextPhase()}>Advance to Action Phase</button>
      }
      </div>
      <div className="flexColumn" style={{height: "100vh", width: responsivePixels(280)}}>
        <SummaryColumn />
      </div>
    </div>
  );
}