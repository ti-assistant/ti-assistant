import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard } from '/src/FactionCard.js'
import QRCode from "qrcode";

const fetcher = async (url) => {
  const res = await fetch(url)
  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }
  return data
};

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: gameState, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
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

  if (error) {
    return (<div>Failed to load game</div>);
  }
  if (!gameState) {
    return (<div>Loading...</div>);
  }

  function selectFaction(faction) {
    router.push(`/game/${gameid}/${faction}`);
  }

  function goToMainPage() {
    router.push(`/game/${gameid}/main`);
  }

  const factions = Object.entries(gameState.factions).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <div className="flexColumn" style={{alignItems: "center"}}>
      <h2>Twilight Imperium Assistant</h2>
      <div className="flexRow">
      <h3>Game ID: {gameid}</h3>
      {qrCode ? <img src={qrCode} /> : null}
      </div>
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
        {factions.map(([name, faction]) => {
          return (
            <FactionCard
              key={name}
              faction={faction}
              onClick={() => selectFaction(name)}
              speaker={name === gameState.state.speaker}
            />
          );
        })}
      </div>
    </div>
  );
}