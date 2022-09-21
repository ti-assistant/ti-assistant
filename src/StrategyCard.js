import Image from 'next/image';
import { useRouter } from 'next/router'
import useSWR, { mutate, useSWRConfig } from 'swr'
import { FactionTile } from '/src/FactionCard.js'

import { TechRow } from '/src/TechRow.js'

export function StrategyCard({ name, card, faction, onClick, opts = {} }) {
  const border = "3px solid " + (faction ? "grey" : card.color);
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
        <div style={{flexBasis: "14%", fontSize: "32px", display: "flex", justifyContent: "center"}}>{card.order}</div>
        <div style={{flexBasis: "50%"}}>{card.name}</div>
        {faction ? 
          <div style={{maxWidth: "140px", flexGrow: 4}}>
            <FactionTile faction={faction} opts={{fontSize: "16px"}} />
          </div>
        : null}
      </div>
    </div>
  );
}