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
import { FormattedMessage, useIntl } from "react-intl";
import LanguageSelectRadialMenu from "../../../src/components/LanguageSelectRadialMenu/LanguageSelectRadialMenu";
import Cookies from "js-cookie";

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
              <FormattedMessage
                id="yBACfb"
                description="Text on a button that opens the main screen of the assistant."
                defaultMessage="Main Screen"
              />
            </div>
          </Link>
          <Link href={`/game/${gameid}/objectives`}>
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
              <FormattedMessage
                id="9m91nk"
                description="Text on a button that opens the objective view of the assistant."
                defaultMessage="Objective View"
              />
            </div>
          </Link>
          {orderedFactions.map((faction) => {
            return (
              <Link href={`/game/${gameid}/${faction.id}`} key={faction.id}>
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
  const intl = useIntl();

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
      <Sidebars
        left={intl
          .formatMessage({
            id: "c6uq+j",
            description:
              "Instruction telling the user to select their faction.",
            defaultMessage: "Select Faction",
          })
          .toUpperCase()}
        right={intl
          .formatMessage(
            {
              id: "hhm3kX",
              description: "The current round of the game.",
              defaultMessage: "Round {value}",
            },
            { value: state.round }
          )
          .toUpperCase()}
      />

      <Link
        href={`/`}
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
      </Link>
      <div
        className="nonMobile"
        style={{
          position: "fixed",
          top: responsivePixels(32),
          left: responsivePixels(30),
          zIndex: 2,
        }}
      >
        <LanguageSelectRadialMenu
          selectedLocale={router.locale ?? "en"}
          locales={["en"]}
          invalidLocales={[router.locale ?? "en"]}
          onSelect={(locale) => {
            if (!locale) {
              return;
            }
            Cookies.set("NEXT_LOCALE", locale);
            router.push(
              { pathname: router.pathname, query: router.query },
              router.asPath,
              {
                locale: locale,
              }
            );
          }}
          size={28}
        />
      </div>
      <Link
        href={`/`}
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
      </Link>
      <div
        className="mobileOnly"
        style={{
          position: "fixed",
          bottom: responsivePixels(36),
          right: responsivePixels(36),
          zIndex: 2,
        }}
      >
        <LanguageSelectRadialMenu
          selectedLocale={router.locale ?? "en"}
          locales={["en"]}
          invalidLocales={[router.locale ?? "en"]}
          onSelect={(locale) => {
            if (!locale) {
              return;
            }
            Cookies.set("NEXT_LOCALE", locale);
            router.push(
              { pathname: router.pathname, query: router.query },
              router.asPath,
              {
                locale: locale,
              }
            );
          }}
          size={28}
        />
      </div>
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
        <div>
          <FormattedMessage
            id="FHUFoZ"
            description="Label for the ID used to identify a specific game."
            defaultMessage="Game ID"
          />
          : {gameid}
        </div>
        {qrCode ? <img src={qrCode} alt="QR Code for joining game" /> : null}
      </div>
    </div>
  );
}
