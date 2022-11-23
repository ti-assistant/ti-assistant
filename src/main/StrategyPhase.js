import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { StrategyCard } from '../StrategyCard';
import { getOnDeckFaction } from '../util/helpers';
import { strategyCardOrder, unassignStrategyCard, swapStrategyCards, setFirstStrategyCard } from '../util/api/cards';
import { readyAllFactions } from '../util/api/factions';
import { getNextIndex } from '../util/util';
import { fetcher, poster } from '../util/api/util';
import { BasicFactionTile } from '../FactionTile';
import { FactionTimer } from '../Timer';
import SummaryColumn from '../main/SummaryColumn';
import { FactionCard } from '../FactionCard';

export default function StrategyPhase() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { mutate } = useSWRConfig();
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const { data: strategyCards } = useSWR(gameid ? `/api/${gameid}/strategycards` : null, fetcher);
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  function nextPhase(skipAgenda = false) {
    const data = {
      action: "ADVANCE_PHASE",
      skipAgenda: skipAgenda,
    };
    const phase = "ACTION";
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
    const activeFactionName = minCard.faction;

    const updatedState = {...state};
    state.phase = phase;
    state.activeplayer = activeFactionName;

    const options = {
      optimisticData: updatedState,
    };

    mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);

    readyAllFactions(mutate, gameid, factions);
  }

  async function nextPlayer() {
    const data = {
      action: "ADVANCE_PLAYER",
    };
    
    const updatedState = {...state};
    const onDeckFaction = getOnDeckFaction(state, factions, strategyCards);
    state.activeplayer = onDeckFaction ? onDeckFaction.name : "None";

    const options = {
      optimisticData: updatedState,
    };
    return mutate(`/api/${gameid}/state`, poster(`/api/${gameid}/stateUpdate`, data), options);
  }

  function showInfoModal(title, content) {
    setInfoModal({
      show: true,
      title: title,
      content: content,
    });
  }
  async function assignStrategyCard(card, faction) {
    const data = {
      action: "ASSIGN_STRATEGY_CARD",
      card: card.name,
      faction: faction.name,
    };

    const updatedCards = {...strategyCards};
    updatedCards[card.name].faction = faction.name;
    for (const [name, card] of Object.entries(updatedCards)) {
      if (card.invalid) {
        delete updatedCards[name].invalid;
      }
    }
    if (faction.name === "Naalu Collective") {
      updatedCards[card.name].order = 0;
    }

    const options = {
      optimisticData: updatedCards,
    };
    await nextPlayer();
    mutate(`/api/${gameid}/strategycards`, poster(`/api/${gameid}/cardUpdate`, data), options);
  }

  function getStartOfStrategyPhaseAbilities() {
    let abilities = {};
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
    unassignStrategyCard(mutate, gameid, strategyCards, cardName, state);
  }

  function publicDisgrace(cardName) {
    unassignStrategyCard(mutate, gameid, strategyCards, cardName, state);
  }

  function quantumDatahubNode(factionName) {
    const factionCard = Object.values(strategyCards).find((card) => card.faction === factionName);
    const hacanCard = Object.values(strategyCards).find((card) => card.faction === "Emirates of Hacan");
    swapStrategyCards(mutate, gameid, strategyCards, factionCard, hacanCard);
  }

  function giftOfPrescience(cardName) {
    setFirstStrategyCard(mutate, gameid, strategyCards, cardName);
  }

  const orderedStrategyCards = Object.entries(strategyCards).sort((a, b) => strategyCardOrder[a[0]] - strategyCardOrder[b[0]]);
  return (
    <div className="flexRow" style={{height: "100vh", width: "100%", alignItems: "center", justifyContent: "space-between"}}>
      <Modal closeMenu={() => setInfoModal({show: false})} visible={infoModal.show} title={infoModal.title} content={
        <InfoContent content={infoModal.content} />
      } top="30%" />
      <div className="flexColumn" style={{flexBasis: "25%"}}>
      {hasStartOfStrategyPhaseAbilities() ? 
        <div className="flexColumn">
          Start of Strategy Phase
          <ol>
          {Object.entries(getStartOfStrategyPhaseAbilities()).map(([factionName, abilities]) => {
            if (abilities.length === 0) {
              return null;
            }
            return (
            <li key={factionName}>
              <div className="flexRow" style={{gap: "8px"}}>
                <BasicFactionTile faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>
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
                <div className="flexRow" style={{gap: "8px"}}>
                  <BasicFactionTile faction={factions[factionName]} speaker={factionName === state.speaker} opts={{fontSize: "16px"}}/>
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
      </div>
      <div className="flexColumn" style={{flexBasis: "30%", gap: "8px"}}>
        <div className="flexRow" style={{gap: "8px"}}>
          {activefaction ?
            <div className="flexColumn" style={{alignItems: "center"}}>
              Active Player
              <FactionCard faction={activefaction} content={
                <div style={{paddingBottom: "4px"}}>
                  <FactionTimer key={activefaction.name} factionName={activefaction.name} />
                </div>
              } opts={{iconSize: 60, fontSize: "24px"}} />
            </div>
          : <div style={{fontSize: "36px"}}>Strategy Phase Complete</div>}
          {onDeckFaction ? 
            <div className="flexColumn" style={{alignItems: "center"}}>
              On Deck
              <BasicFactionTile faction={onDeckFaction} opts={{fontSize: "20px"}}/>
            </div>
          : null}
        </div>
        <div className="flexColumn" style={{gap: "4px", alignItems: "stretch", width: "100%", maxWidth: "500px", marginTop: "8px"}}>
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
              if (factions['Emirates of Hacan'] && card.faction !== "Emirates of Hacan") {
                factionActions.push({
                  text: "Quantum Datahub Node",
                  action: () => quantumDatahubNode(card.faction),
                });
              }
              if (factions['Naalu Collective'] && card.faction !== "Naalu Collective") {
                factionActions.push({
                  text: "Gift of Prescience",
                  action: () => giftOfPrescience(name),
                });
              }
            }
          }
          return (
            <StrategyCard key={name} card={card} active={card.faction || !activefaction || card.invalid ? false : true} onClick={card.faction || !activefaction || card.invalid ? null : () => assignStrategyCard(card, activefaction)} factionActions={factionActions} />);
        })}
      </div>
      {!activefaction || activefaction.name !== state.speaker ?
        <button onClick={() => undoPick()}>Undo</button>
      : null}
      {activefaction ? null :
        <button onClick={() => nextPhase()}>Advance to Action Phase</button>
      }
      </div>
      <div className="flexColumn" style={{flexBasis: "33%", maxwidth: "400px"}}>
        <SummaryColumn />
      </div>
    </div>
  );
}