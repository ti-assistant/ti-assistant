import Image from 'next/image';
import { useRouter } from 'next/router'
import useSWR, { mutate, useSWRConfig } from 'swr'
import { FactionTile } from '/src/FactionCard.js'

import { TechRow } from '/src/TechRow.js'

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

export function StrategyCard({ card, active, onClick, opts = {} }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: faction, factionError } = useSWR(gameid && card.faction ? `/api/${gameid}/factions/${card.faction}` : null, fetcher);
  
  if (factionError) {
    return (<div>Failed to load faction info</div>);
  }
  if (card.faction && !faction) {
    return (<div>Loading...</div>);
  }

  const border = "3px solid " + (active ? card.color : "grey");
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
        border: border,
        fontSize: opts.fontSize ?? "24px",
        position: "relative",
        cursor: onClick ? "pointer" : "auto",
        height: "54px",
        justifyContent: "center",
      }}
    >
      <div className="flexRow" style={{padding: "4px 4px 4px 0px", justifyContent: "flex-start", alignItems: "center"}}>
        <div style={{flexBasis: "14%", minWidth: "50px", fontSize: "32px", display: "flex", justifyContent: "center"}}>{card.order}</div>
        {opts.hideName ? null : <div style={{flexBasis: "50%"}}>{card.name}</div>}
        {faction ? 
          <div style={{maxWidth: "140px", flexGrow: 4}}>
            <FactionTile faction={faction} opts={{fontSize: "16px"}} />
          </div>
        : null}
      </div>
    </div>
  );
}