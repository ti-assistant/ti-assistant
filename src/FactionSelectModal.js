import { useRouter } from 'next/router'
import useSWR from 'swr'

import { fetcher } from './util/api/util'
import { Modal } from "/src/Modal.js";
import { BasicFactionTile } from './FactionTile';

export function FactionSelectModal({ excludeFactions, title, visible, onComplete, level }) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: state } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);

  if (!factions || !state) {
    return (<div>Loading...</div>);
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
  <Modal closeMenu={onComplete} visible={visible} level={level} title={title}
    content={
      <div className="flexRow" style={{flexWrap: "wrap", gap: "8px", alignItems: "center", justifyContent: "space-evenly", padding: "40px"}}>
        {orderedFactions.map(([factionName, faction]) => {
          if ((excludeFactions ?? []).includes(factionName)) {
            return null;
          }
          return (
            <BasicFactionTile
              key={factionName}
              faction={faction}
              onClick={() => onComplete(factionName)}
            />
          );
        })}
      </div>
  } />
  );
}