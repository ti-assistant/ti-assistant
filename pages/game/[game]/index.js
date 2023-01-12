import { useRouter } from 'next/router'
import useSWR, { useSWRConfig } from 'swr'
import { useEffect, useState } from "react";
import { FactionCard } from '/src/FactionCard.js'
import QRCode from "qrcode";
import { fetcher } from '../../../src/util/api/util';
import { LabeledDiv } from '../../../src/LabeledDiv';
import { getFactionColor, getFactionName } from '../../../src/util/factions';
import { responsivePixels } from '../../../src/util/util';
import { FactionSymbol, FullFactionSymbol } from '../../../src/FactionCard';

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
        className="flexColumn"
        style={{
          alignItems: "stretch",
          maxWidth: `${responsivePixels(500)}`,
          width: "100%",
        }}
      >
        <div
          onClick={goToMainPage}
          style={{
            border: `${responsivePixels(3)} solid grey`,
            borderRadius: responsivePixels(5),
            height: `10vh`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: `${responsivePixels(24)}`,
            cursor: "pointer",
          }}
        >
          Main Screen
        </div>
        {orderedFactions.map(([name, faction]) => {
          return (
            <LabeledDiv key={faction.name} color={getFactionColor(faction)}
              onClick={() => selectFaction(name)}>
              <div className="flexRow" style={{zIndex: -1, opacity: "40%", position: "absolute", width: "100%", height: "100%"}}>
                <FullFactionSymbol faction={faction.name} />
              </div>
              <div className='flexColumn' style={{height: "5vh", fontSize: responsivePixels(20), width: '100%'}}>
                {getFactionName(faction)}
              </div>
            </LabeledDiv>
            // <FactionCard
            //   key={name}
            //   faction={faction}
            //   onClick={() => selectFaction(name)}
            // ></FactionCard>
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
  const { data: state, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

  const qrCodeSize = Math.max(164 + (328 - 164) * (( window.innerWidth - 1280 )/(2560 - 1280)), 164);
  const qrMarginSize = Math.max(4 + (8 - 4) * (( window.innerWidth - 1280 )/(2560 - 1280)), 4);
  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
      width: qrCodeSize,
      height: qrCodeSize,
      margin: 0,
    }, (err, url) => {
      if (err) {
        throw err;
      }
      setQrCode(url);
    });
  }

  const round = state ? `ROUND ${state.round}` : "";

  // return <div className="flexRow" style={{top: 0, width: "100vw", position: "fixed", justifyContent: "space-evenly"}}>
  //   <Sidebar side="left" content={`SELECT FACTION`} />
  //   <Sidebar side="right" content={round} />

  //   <div style={{cursor: "pointer", backgroundColor: "#222", fontSize: responsivePixels(24)}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>

  //   {/* <div style={{position: "fixed", paddingBottom: "20px", transform: "rotate(-90deg)", left: "0",  top: "50%", borderBottom: "1px solid grey", fontSize: "40px", transformOrigin: "0 0"}}>
  //     SETUP PHASE
  //   </div> */}
  //   {/* <h2>Twilight Imperium Assistant</h2> */}
  //   <div className="flexRow" style={{alignItems: "center", justifyContent: "center"}}>
  //     <div>Game ID: {gameid}</div>
  //     {qrCode ? <img src={qrCode} /> : null}
  //   </div>
  // </div>

  return <div className="flex" style={{top: 0, width: "100vw", position: "fixed", justifyContent: "space-between"}}>
    <Sidebar side="left" content={`SELECT FACTION`} />
    <Sidebar side="right" content={round} />
    <div className="extraLargeFont nonMobile" style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", top: `${responsivePixels(12)}`, left: `${responsivePixels(150)}`}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
    <div className="flexColumn extraLargeFont mobileOnly" style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", textAlign: "center", top: `${responsivePixels(12)}`, width: "100%"}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
    <div className="flexColumn nonMobile" style={{position: "fixed", top: `${responsivePixels(12)}`, right: `${responsivePixels(150)}`, alignItems: "center", justifyContent: "center"}}>
      <div>Game ID: {gameid}</div>
      {qrCode ? <img src={qrCode} /> : null}
    </div>
  </div>
}