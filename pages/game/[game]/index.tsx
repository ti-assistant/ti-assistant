import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import { useContext, useEffect, useState } from "react";
import { Loader } from "../../../src/Loader";
import BorderedDiv from "../../../src/components/BorderedDiv/BorderedDiv";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import ResponsiveLogo from "../../../src/components/ResponsiveLogo/ResponsiveLogo";
import { FactionContext, StateContext } from "../../../src/context/Context";
import DataProvider from "../../../src/context/DataProvider";
import { setGameId } from "../../../src/util/api/util";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { responsivePixels } from "../../../src/util/util";
import Sidebars from "../../../src/components/Sidebars/Sidebars";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default function SelectFactionPage() {
  return (
    <DataProvider>
      <InnerSelectFactionPage />
    </DataProvider>
  );
}

function InnerSelectFactionPage({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
  const state = useContext(StateContext);

  const [qrCode, setQrCode] = useState<string | undefined>();

  if (!qrCode && gameid) {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameid}`,
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

  if (state.phase !== "UNKNOWN" && Object.keys(factions).length === 0) {
    console.log("Forcing redirect!");
    setGameId("");
    router.push("/");
    return null;
  }

  const orderedFactions = Object.values(factions ?? {}).sort((a, b) => {
    if (a.order > b.order) {
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
      {state.phase === "UNKNOWN" ? (
        <Loader />
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
          <Link href={`/game/${gameid}/objectives`}>
            <a>
              <div
                style={{
                  border: `${responsivePixels(3)} solid grey`,
                  borderRadius: responsivePixels(5),
                  height: `8vh`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: `${responsivePixels(24)}`,
                  cursor: "pointer",
                }}
              >
                Objective View
              </div>
            </a>
          </Link>
          {orderedFactions.map((faction) => {
            return (
              <Link href={`/game/${gameid}/${faction.id}`} key={faction.id}>
                <a>
                  <BorderedDiv color={getFactionColor(faction)}>
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
                      <FactionIcon factionId={faction.id} size="100%" />
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
                  </BorderedDiv>
                </a>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Header() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const state = useContext(StateContext);

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
      `${BASE_URL}/game/${gameid}`,
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
      </Head>
      <Sidebars left="SELECT FACTION" right={round} />

      <Link href={`/`}>
        <a
          className="flexRow extraLargeFont nonMobile"
          style={{
            cursor: "pointer",
            position: "fixed",
            justifyContent: "center",
            top: `${responsivePixels(16)}`,
            left: `${responsivePixels(96)}`,
          }}
        >
          <ResponsiveLogo size={32} />
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
          <ResponsiveLogo size={28} />
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
