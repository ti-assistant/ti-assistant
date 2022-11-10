import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard } from '/src/FactionCard.js'
import QRCode from "qrcode";
import { fetcher } from '../../../src/util/api/util';

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions, factionsError } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);

  const [ qrCode, setQrCode ] = useState(null);
  
  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
    }, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  if (factionsError) {
    return (<div>Failed to load game</div>);
  }
  if (!factions) {
    return (<div>Loading...</div>);
  }

  function selectFaction(faction) {
    router.push(`/game/${gameid}/${faction}`);
  }

  function goToMainPage() {
    router.push(`/game/${gameid}/main`);
  }

  const orderedFactions = Object.entries(factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <div className="flexColumn" style={{alignItems: "center", height: "100vh"}}>
      <Header />
      <div
        style={{
          display: "flex",
          flexFlow: "column wrap",
          gap: "10px",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        <div
          onClick={goToMainPage}
          style={{
            border: "3px solid grey",
            borderRadius: "5px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            cursor: "pointer",
          }}
        >
          Main Screen
        </div>
        {orderedFactions.map(([name, faction]) => {
          return (
            <FactionCard
              key={name}
              faction={faction}
              onClick={() => selectFaction(name)}
            />
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({side, content}) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{letterSpacing: "3px"}}>
      {content}
    </div>
  );
}

function Header() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: state, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher, { 
    refreshInterval: 5000,
  });
  const [ qrCode, setQrCode ] = useState(null);

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
      width: 120,
      height: 120,
      margin: 4,
    }, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  const round = state ? `ROUND ${state.round}` : "Loading...";

  return <div className="flexColumn" style={{top: 0, position: "fixed", alignItems: "center", justifyContent: "center"}}>
    <Sidebar side="left" content={`SELECT FACTION`} />
    <Sidebar side="right" content={round} />

    {/* <div style={{position: "fixed", paddingBottom: "20px", transform: "rotate(-90deg)", left: "0",  top: "50%", borderBottom: "1px solid grey", fontSize: "40px", transformOrigin: "0 0"}}>
      SETUP PHASE
    </div> */}
    <h2>Twilight Imperium Assistant</h2>
    <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", left: "144px", top: "44px"}}>
      {qrCode ? <img src={qrCode} /> : null}
      <div>Game ID: {gameid}</div>
    </div>
  </div>
}