import { useRouter } from "next/router";
import { useState } from "react";
import QRCode from "qrcode";
import useSWR from "swr";
import { responsivePixels } from "./util/util";
import { fetcher } from "./util/api/util";
import { GameTimer } from "./Timer";
import { HoverMenu } from "./HoverMenu";
import { Map } from "../pages/setup";

export function Sidebar({side, content}) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{letterSpacing: responsivePixels(3)}}>
      {content}
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: state, error } = useSWR(gameid ? `/api/${gameid}/state` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

  if (!qrCode && gameid) {
    QRCode.toDataURL(`https://twilight-imperium-360307.wm.r.appspot.com/game/${gameid}`, {
      color: {
        dark: "#eeeeeeff",
        light: "#222222ff",
      },
      width: responsivePixels(120),
      height: responsivePixels(120),
      margin: 4,
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

  return <div className="flex" style={{top: 0, width: "100vw", paddingTop: responsivePixels(12), position: "fixed", justifyContent: "space-between"}}>
    <Sidebar side="left" content={`${state.phase} PHASE`} />
    <Sidebar side="right" content={round} />
    <div className="extraLargeFont nonMobile" style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", top: `${responsivePixels(12)}`, left: `${responsivePixels(150)}`}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
    <div className="flexRow" style={{alignItems: "center", justifyContent: "center"}}>
        <GameTimer />
    </div>
    <div className="flexColumn extraLargeFont mobileOnly" style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", textAlign: "center", top: `${responsivePixels(12)}`, width: "100%"}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div>
    <div className="flexRow nonMobile" style={{position: "fixed", top: `${responsivePixels(12)}`, right: `${responsivePixels(150)}`, alignItems: "flex-start", justifyContent: "center"}}>
      <div style={{marginTop: `${responsivePixels(16)}`}}>Game ID: {gameid}</div>
      {qrCode ? <img src={qrCode} /> : null}
    </div>
  </div>
}

export function Footer({}) {
  const router = useRouter();
  const { game: gameid } = router.query;
  const { data: factions } = useSWR(gameid ? `/api/${gameid}/factions` : null, fetcher);
  const { data: options, error } = useSWR(gameid ? `/api/${gameid}/options` : null, fetcher);
  const [ qrCode, setQrCode ] = useState(null);

  if (!options || !factions) {
    return null;
  }

  console.log(options);

  const mapOrderedFactions = Object.values(factions).sort((a, b) => a.mapPosition - b.mapPosition);

  return <div className="flex" style={{bottom: 0, width: "100vw", paddingBottom: responsivePixels(12), position: "fixed", justifyContent: "space-between"}}>
    {options['map-string'].length > 0 ? <div style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", bottom: `${responsivePixels(12)}`, left: `${responsivePixels(150)}`}}><HoverMenu label="View Map">
      <div style={{zIndex: 10000, width: "85vh", height: "85vh"}}>
        <Map factions={mapOrderedFactions} mapString={options['map-string']} mapStyle={options['map-style']} />
      </div>
    </HoverMenu></div> : null}
  </div>
}