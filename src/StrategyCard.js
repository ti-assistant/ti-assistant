import { useRouter } from 'next/router'
import useSWR from 'swr'
import { BasicFactionTile } from './FactionTile';
import { LabeledDiv } from './LabeledDiv';

import { fetcher } from './util/api/util';
import { getFactionColor, getFactionName } from './util/factions';
import { responsivePixels } from './util/util';

export function StrategyCard({ card, active, onClick, factionActions, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions, factionError } = useSWR(gameid && card.faction ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  
  if (factionError || stateError) {
    return (<div>Failed to load faction info</div>);
  }

  const faction = card.faction ? factions[card.faction] : null;

  const color = (active && !opts.noColor ? card.color : "#555");
  const textColor = (active ? "#eee" : "#555");
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: responsivePixels(5),
        display: "flex",
        flexDirection: "column",
        border: `${responsivePixels(3)} solid ${color}`,
        fontSize: opts.fontSize ?? responsivePixels(24),
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        height: responsivePixels(48),
        justifyContent: "center",
      }}
    >
      <div className="flexRow" style={{padding: `${responsivePixels(4)} ${responsivePixels(4)} ${responsivePixels(4)} 0`, justifyContent: "flex-start", alignItems: "center"}}>
        <div style={{flexBasis: "14%", minWidth: responsivePixels(32), fontSize: responsivePixels(32), display: "flex", justifyContent: "center", color: textColor}}>{card.order}</div>
        {opts.hideName ? null : <div style={{flexBasis: "40%", color: textColor}}>{card.name}</div>}
        {faction ? 
          <div style={{flexGrow: 4, whiteSpace: "nowrap"}}>
            <BasicFactionTile faction={faction} speaker={state.speaker === faction.name} menuButtons={factionActions} opts={{fontSize: responsivePixels(16), iconSize: 32}} />
          </div>
        : null}
      </div>
    </div>
  );
}

export function SmallStrategyCard({ card, active }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions, factionError } = useSWR(gameid && card.faction ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state, stateError } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  
  if (factionError || stateError) {
    return (<div>Failed to load faction info</div>);
  }

  const faction = card.faction ? factions[card.faction] : null;

  const borderColor = (!faction.passed ? getFactionColor(faction) : "#555");
  const textColor = (active ? "#eee" : "#555");
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);
  return (
    <LabeledDiv label={getFactionName(faction)} color={borderColor} style={{
      display: "flex",
      flexDirection: "column",
      fontSize: responsivePixels(24),
      height: responsivePixels(54),
    }}>


    {/* <div
      onClick={onClick}
      style={{
        borderRadius: responsivePixels(5),
        display: "flex",
        flexDirection: "column",
        border: `${responsivePixels(3)} solid ${color}`,
        fontSize: opts.fontSize ?? responsivePixels(24),
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        height: responsivePixels(54),
        justifyContent: "center",
      }}
    > */}
      <div className="flexRow" style={{padding: `${responsivePixels(4)} ${responsivePixels(4)} ${responsivePixels(4)} 0`, justifyContent: "flex-start", alignItems: "center"}}>
        <div style={{flexBasis: "14%", minWidth: responsivePixels(32), fontSize: responsivePixels(32), display: "flex", justifyContent: "center", color: textColor}}>{card.order}</div>
        <div style={{flexBasis: "40%", color: textColor}}>{card.name}</div>
      </div>
    </LabeledDiv>
  );
}