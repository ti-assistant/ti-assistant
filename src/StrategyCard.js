import { useRouter } from 'next/router'
import useSWR from 'swr'

import { fetcher } from './util/api/util';
import { FactionTile } from '/src/FactionCard.js'

export function StrategyCard({ card, active, onClick, factionActions, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: faction, factionError } = useSWR(gameid && card.faction ? `/api/${gameid}/factions/${card.faction}` : null, fetcher);
  
  if (factionError) {
    return (<div>Failed to load faction info</div>);
  }
  if (card.faction && !faction) {
    return (<div>Loading...</div>);
  }

  const color = (active ? card.color : "#555");
  const textColor = (active ? "#eee" : "#555");
  // const victory_points = (faction.victory_points ?? []).reduce((prev, current) => {
  //   return prev + current.amount;
  // }, 0);
  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: "5px",
        display: "flex",
        flexDirection: "column",
        border: `3px solid ${color}`,
        fontSize: opts.fontSize ?? "24px",
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        height: "64px",
        justifyContent: "center",
      }}
    >
      <div className="flexRow" style={{padding: "4px 4px 4px 0px", justifyContent: "flex-start", alignItems: "center"}}>
        <div style={{flexBasis: "14%", minWidth: "50px", fontSize: "32px", display: "flex", justifyContent: "center", color: textColor}}>{card.order}</div>
        {opts.hideName ? null : <div style={{flexBasis: "40%", color: textColor}}>{card.name}</div>}
        {faction ? 
          <div style={{flexGrow: 4, whiteSpace: "nowrap"}}>
            <FactionTile faction={faction} menu={true} opts={{fontSize: "16px"}} />
          </div>
        : null}
      </div>
    </div>
  );
}