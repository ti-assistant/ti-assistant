import { useRouter } from "next/router";
import useSWR from "swr";
import { PropsWithChildren, useEffect, useState } from "react";
import QRCode from "qrcode";
import { fetcher, setGameId } from "../../../src/util/api/util";
import { LabeledDiv } from "../../../src/LabeledDiv";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { responsivePixels } from "../../../src/util/util";
import { FullFactionSymbol } from "../../../src/FactionCard";
import Head from "next/head";
import { Faction } from "../../../src/util/api/factions";
import { GameState } from "../../../src/util/api/state";

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );

  const [qrCode, setQrCode] = useState<string | undefined>();

  if (!qrCode && gameid) {
    QRCode.toDataURL(
      `https://ti-assistant.com/game/${gameid}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        setQrCode(url);
      }
    );
  }

  useEffect(() => {
    if (!!gameid) {
      setGameId(gameid);
    }
  }, [gameid]);

  function selectFaction(factionName: string) {
    router.push(`/game/${gameid}/${factionName}`);
  }

  function goToMainPage() {
    router.push(`/game/${gameid}/main`);
  }

  const orderedFactions = Object.entries(factions ?? {}).sort((a, b) => {
    if (a[1].order > b[1].order) {
      return 1;
    } else {
      return -1;
    }
  });

  return (
    <div
      className="flexColumn"
      style={{ alignItems: "center", height: "100vh" }}
    >
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
            <LabeledDiv
              key={faction.name}
              color={getFactionColor(faction)}
              onClick={() => selectFaction(name)}
            >
              <div
                className="flexRow"
                style={{
                  zIndex: -1,
                  opacity: "40%",
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              >
                <FullFactionSymbol faction={faction.name} />
              </div>
              <div
                className="flexColumn"
                style={{
                  height: "5vh",
                  fontSize: responsivePixels(20),
                  width: "100%",
                }}
              >
                {getFactionName(faction)}
              </div>
            </LabeledDiv>
          );
        })}
      </div>
    </div>
  );
}

function Sidebar({ side, children }: PropsWithChildren<{ side: string }>) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{ letterSpacing: "3px" }}>
      {children}
    </div>
  );
}

function Header() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const [qrCode, setQrCode] = useState<string | undefined>();
  const [qrCodeSize, setQrCodeSize] = useState(164);

  useEffect(() => {
    setQrCodeSize(
      Math.max(
        164 + (328 - 164) * ((window.innerWidth - 1280) / (2560 - 1280)),
        164
      )
    );
  }, []);
  if (!qrCode && gameid) {
    QRCode.toDataURL(
      `https://ti-assistant.com/game/${gameid}`,
      {
        color: {
          dark: "#eeeeeeff",
          light: "#222222ff",
        },
        width: qrCodeSize,
        margin: 0,
      },
      (err, url) => {
        if (err) {
          throw err;
        }
        setQrCode(url);
      }
    );
  }

  const round = state ? `ROUND ${state.round}` : "LOADING...";

  return (
    <div
      className="flex"
      style={{
        top: 0,
        width: "100vw",
        position: "fixed",
        justifyContent: "space-between",
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
        {/* <link rel="icon" type="image/png" href="/public/images/favicon.png"></link> */}
      </Head>
      <Sidebar side="left">{state ? "SELECT FACTION" : "LOADING..."}</Sidebar>
      <Sidebar side="right">{round}</Sidebar>
      <div
        className="extraLargeFont nonMobile"
        style={{
          cursor: "pointer",
          position: "fixed",
          backgroundColor: "#222",
          top: `${responsivePixels(12)}`,
          left: `${responsivePixels(150)}`,
        }}
        onClick={() => router.push("/")}
      >
        Twilight Imperium Assistant
      </div>
      <div
        className="flexColumn extraLargeFont mobileOnly"
        style={{
          cursor: "pointer",
          position: "fixed",
          backgroundColor: "#222",
          textAlign: "center",
          top: `${responsivePixels(12)}`,
          width: "100%",
        }}
        onClick={() => router.push("/")}
      >
        Twilight Imperium Assistant
      </div>
      <div
        className="flexColumn nonMobile"
        style={{
          position: "fixed",
          top: `${responsivePixels(12)}`,
          right: `${responsivePixels(150)}`,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>Game ID: {gameid}</div>
        {qrCode ? <img src={qrCode} alt="QR Code for joining game" /> : null}
      </div>
    </div>
  );
}