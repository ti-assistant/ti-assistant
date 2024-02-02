"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Loader } from "../../../src/Loader";
import BorderedDiv from "../../../src/components/BorderedDiv/BorderedDiv";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import {
  FactionContext,
  GameIdContext,
  StateContext,
} from "../../../src/context/Context";
import { setGameId } from "../../../src/util/api/util";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { responsivePixels } from "../../../src/util/util";

export default function SelectFactionPage() {
  const router = useRouter();
  // const { game: gameid }: { game?: string } = router.query;
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const state = useContext(StateContext);

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

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

  // TODO: Fix height on mobile.
  return (
    <div
      className="flexColumn"
      style={{ alignItems: "center", height: "100svh" }}
    >
      {/* <Header /> */}
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          maxWidth: `${responsivePixels(500)}`,
          width: "100%",
        }}
      >
        <Link href={`/game/${gameId}/main`}>
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
        <Link href={`/game/${gameId}/objectives`}>
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
            <Link href={`/game/${gameId}/${faction.id}`} key={faction.id}>
              <BorderedDiv color={getFactionColor(faction)}>
                <div
                  className="flexRow"
                  style={{
                    opacity: "40%",
                    position: "absolute",
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
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
                    zIndex: 0,
                  }}
                >
                  {getFactionName(faction)}
                </div>
              </BorderedDiv>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function Header() {
  const gameId = useContext(GameIdContext);
  const state = useContext(StateContext);
  const intl = useIntl();

  // const [qrCode, setQrCode] = useState<string | undefined>();
  // const [qrCodeSize, setQrCodeSize] = useState(164);

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
      {/* <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head> */}
      {/* <Sidebars
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
      /> */}

      {/* <Link
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
      </Link> */}
      {/* <div
        className="nonMobile"
        style={{
          position: "fixed",
          top: responsivePixels(32),
          left: responsivePixels(30),
          zIndex: 2,
        }}
      >
        <LanguageSelectRadialMenu
          selectedLocale={intl.locale}
          locales={["en", "fr"]}
          invalidLocales={[]}
          onSelect={(locale) => {
            if (!locale) {
              return;
            }
            Cookies.set("TI_LOCALE", locale);
            window.location.reload();
          }}
          size={28}
        />
      </div> */}
      {/* <Link
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
      </Link> */}
      {/* <div
        className="mobileOnly"
        style={{
          position: "fixed",
          bottom: responsivePixels(36),
          right: responsivePixels(36),
          zIndex: 2,
        }}
      >
        <LanguageSelectRadialMenu
          selectedLocale={intl.locale}
          locales={["en", "fr"]}
          invalidLocales={[]}
          onSelect={(locale) => {
            if (!locale) {
              return;
            }
            Cookies.set("TI_LOCALE", locale);
            window.location.reload();
          }}
          size={28}
        />
      </div> */}
      {/* <div
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
          : {gameId}
        </div>
        <img src={qrCode} alt="QR Code for joining game" />
      </div> */}
    </div>
  );
}
