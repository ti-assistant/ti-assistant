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
import Link from "next/link";
import { FullScreenLoader, Loader } from "../../../src/Loader";
import Image from "next/image";

export default function SelectFactionPage() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
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

  if (factions && Object.keys(factions).length === 0) {
    setGameId("");
    router.push("/");
    return;
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
      style={{ alignItems: "center", height: "100svh" }}
    >
      <Header />
      {!factions ? (
        <FullScreenLoader />
      ) : (
        <div
          className="flexColumn"
          style={{
            alignItems: "stretch",
            maxWidth: `${responsivePixels(500)}`,
            width: "100%",
          }}
        >
          <Link href={`/game/${gameid}/main`}>
            <a>
              <div
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
            </a>
          </Link>
          {orderedFactions.map(([name, faction]) => {
            return (
              <Link href={`/game/${gameid}/${name}`} key={faction.name}>
                <a>
                  <LabeledDiv
                    color={getFactionColor(faction)}
                    // onClick={() => selectFaction(name)}
                  >
                    <div
                      className="flexRow"
                      style={{
                        zIndex: 0,
                        opacity: "40%",
                        position: "absolute",
                        left: 0,
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
                        zIndex: 1,
                      }}
                    >
                      {getFactionName(faction)}
                    </div>
                  </LabeledDiv>
                </a>
              </Link>
            );
          })}
        </div>
      )}
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
    fetcher,
    {
      revalidateIfStale: false,
    }
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
        <Preloads />
      </Head>
      <Sidebar side="left">{state ? "SELECT FACTION" : "LOADING..."}</Sidebar>
      <Sidebar side="right">{round}</Sidebar>

      <Link href={`/`}>
        <a
          className="flexRow extraLargeFont nonMobile"
          style={{
            cursor: "pointer",
            position: "fixed",
            justifyContent: "center",
            top: `${responsivePixels(12)}`,
            left: `${responsivePixels(120)}`,
          }}
        >
          <Image
            src="/images/android-chrome-512x512.png"
            alt="Background Image"
            width="32px"
            height="32px"
          />
          Twilight Imperium Assistant
        </a>
      </Link>
      <Link href={`/`}>
        <a
          className="flexRow hugeFont mobileOnly"
          style={{
            cursor: "pointer",
            position: "fixed",
            justifyContent: "center",
            textAlign: "center",
            left: 0,
            paddingTop: `${responsivePixels(12)}`,
            width: "100%",
          }}
        >
          <Image
            src="/images/android-chrome-512x512.png"
            alt="Background Image"
            width="28px"
            height="28px"
          />
          Twilight Imperium Assistant
        </a>
      </Link>
      <div
        className="flexColumn nonMobile"
        style={{
          position: "fixed",
          top: `${responsivePixels(12)}`,
          right: `${responsivePixels(120)}`,
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
