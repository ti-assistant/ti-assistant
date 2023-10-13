import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import QRCode from "qrcode";
import React, { useContext, useEffect, useState } from "react";
import { AgendaRow } from "../../AgendaRow";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import {
  AgendaContext,
  FactionContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  StateContext,
} from "../../context/Context";
import {
  continueGameAsync,
  endGameAsync,
  repealAgendaAsync,
} from "../../dynamic/api";
import { computeVPs } from "../../util/factions";
import { responsivePixels, validateMapString } from "../../util/util";
import GameTimer from "../GameTimer/GameTimer";
import GenericModal from "../GenericModal/GenericModal";
import Map from "../Map/Map";
import ResponsiveLogo from "../ResponsiveLogo/ResponsiveLogo";
import Sidebar from "../Sidebar/Sidebar";
import UndoButton from "../UndoButton/UndoButton";

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export default function Header() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const agendas = useContext(AgendaContext);
  const factions = useContext(FactionContext);
  const objectives = useContext(ObjectiveContext);
  const options = useContext(OptionContext);
  const planets = useContext(PlanetContext);
  const state = useContext(StateContext);

  const [qrCode, setQrCode] = useState<string>();

  const [qrCodeSize, setQrCodeSize] = useState(164);

  const [showMap, setShowMap] = useState(false);

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
        margin: 4,
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

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let mallice;
  if (options && (options["expansions"] ?? []).includes("POK")) {
    mallice = "A";
    if (planets && (planets["Mallice"] ?? {}).owner) {
      mallice = "B";
    }
  }

  const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "LAW";
  });
  async function removeAgenda(agendaId: AgendaId) {
    if (!gameid) {
      return;
    }
    const target = (agendas ?? {})[agendaId]?.target;
    if (!target) {
      return;
    }
    repealAgendaAsync(gameid, agendaId, target);
  }

  let gameFinished = false;
  if (options && factions) {
    switch (options["game-variant"]) {
      case "alliance-combined":
        Object.values(factions).forEach((faction) => {
          if (!faction.alliancePartner) {
            return;
          }
          if (
            computeVPs(factions, faction.id, objectives ?? {}) +
              computeVPs(factions, faction.alliancePartner, objectives ?? {}) >=
            options["victory-points"]
          ) {
            gameFinished = true;
          }
        });
        break;
      case "alliance-separate":
        Object.values(factions).forEach((faction) => {
          if (
            computeVPs(factions, faction.id, objectives ?? {}) >=
              options["secondary-victory-points"] &&
            faction.alliancePartner
          ) {
            if (
              computeVPs(factions, faction.alliancePartner, objectives ?? {}) >=
              options["victory-points"]
            ) {
              gameFinished = true;
            }
          }
        });
        break;
      default:
      case "normal":
        Object.values(factions).forEach((faction) => {
          if (
            computeVPs(factions, faction.id, objectives ?? {}) >=
            options["victory-points"]
          ) {
            gameFinished = true;
          }
        });
        break;
    }
  }

  return (
    <React.Fragment>
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      {validateMapString((options ?? {})["map-string"] ?? "") && state ? (
        <>
          <button
            style={{
              position: "fixed",
              top: responsivePixels(/**state.phase === "SETUP" ? 64 :*/ 104),
              left: responsivePixels(96),
            }}
            onClick={() => setShowMap(true)}
          >
            View Map
          </button>
          <GenericModal closeMenu={() => setShowMap(false)} visible={showMap}>
            <div
              style={{
                position: "relative",
                width: "min(100dvh, 100dvw)",
                height: "min(100dvh, 100dvw)",
              }}
            >
              <Map
                factions={mapOrderedFactions}
                mapString={options ? options["map-string"] ?? "" : ""}
                mapStyle={
                  options ? options["map-style"] ?? "standard" : "standard"
                }
                mallice={mallice}
              />
            </div>
          </GenericModal>
        </>
      ) : null}
      {/* {state ? (
        state.phase === "SETUP" ? (
          <div
            className="flexRow nonMobile"
            style={{
              position: "fixed",
              top: responsivePixels(16),
              right: responsivePixels(96),
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div style={{ marginTop: responsivePixels(16) }}>
              Game ID: {gameid}
            </div>
            {qrCode ? (
              <img src={qrCode} alt="QR Code for joining game" />
            ) : null}
          </div>
        ) : ( */}
      <Link href={`/game/${gameid}`}>
        <a>
          <ClientOnlyHoverMenu
            label={`Game: ${gameid}`}
            buttonStyle={{
              position: "fixed",
              top: responsivePixels(64),
              left: responsivePixels(96),
            }}
          >
            <div
              className="flexColumn"
              style={{
                position: "relative",
                zIndex: 10000,
                marginTop: responsivePixels(8),
              }}
            >
              {qrCode ? (
                <img src={qrCode} alt="QR Code for joining game" />
              ) : null}
            </div>
          </ClientOnlyHoverMenu>
        </a>
      </Link>
      {/* ) */}
      {/* ) : null} */}
      <div
        className="flexRow extraLargeFont"
        style={{
          position: "fixed",
          top: responsivePixels(16),
          left: responsivePixels(470),
        }}
      >
        <UndoButton gameId={gameid} />
        {gameFinished ? (
          state?.phase === "END" ? (
            <button
              style={{ fontSize: responsivePixels(24) }}
              onClick={() => {
                if (!gameid) {
                  return;
                }
                continueGameAsync(gameid);
              }}
            >
              Back to Game
            </button>
          ) : (
            <button
              style={{ fontFamily: "Slider", fontSize: responsivePixels(32) }}
              onClick={() => {
                if (!gameid) {
                  return;
                }
                endGameAsync(gameid);
              }}
            >
              End Game
            </button>
          )
        ) : null}
      </div>
      {passedLaws.length > 0 ? (
        <ClientOnlyHoverMenu
          label="Laws in Effect"
          buttonStyle={{
            position: "fixed",
            top: responsivePixels(20),
            right: responsivePixels(420),
          }}
        >
          <div
            className="flexColumn"
            style={{ alignItems: "flex-start", padding: responsivePixels(8) }}
          >
            {passedLaws.map((agenda) => (
              <AgendaRow
                key={agenda.id}
                agenda={agenda}
                removeAgenda={removeAgenda}
              />
            ))}
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      <div
        className="flex"
        style={{
          top: 0,
          width: "100vw",
          position: "fixed",
          justifyContent: "space-between",
        }}
      >
        <Sidebar side="left">
          {!state
            ? "LOADING..."
            : state.phase === "END"
            ? "END OF GAME"
            : `${state.phase} PHASE`}
        </Sidebar>
        <Sidebar side="right">{round}</Sidebar>
        <Link href={"/"}>
          <a
            className="extraLargeFont flexRow nonMobile"
            style={{
              cursor: "pointer",
              position: "fixed",
              justifyContent: "center",
              backgroundColor: "#222",
              top: responsivePixels(16),
              left: responsivePixels(96),
            }}
          >
            <ResponsiveLogo size={32} />
            Twilight Imperium Assistant
          </a>
        </Link>
        {state.phase !== "SETUP" ? (
          <div
            className="flexRow nonMobile"
            style={{
              position: "fixed",
              top: responsivePixels(64),
              left: responsivePixels(256),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GameTimer frozen={state.phase === "END"} />
          </div>
        ) : null}
        <Link href={"/"}>
          <a
            className="flexRow hugeFont mobileOnly"
            style={{
              cursor: "pointer",
              position: "fixed",
              backgroundColor: "#222",
              textAlign: "center",
              zIndex: 4,
              justifyContent: "center",
              paddingTop: responsivePixels(12),
              paddingBottom: responsivePixels(12),
              left: 0,
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <ResponsiveLogo size={28} />
            Twilight Imperium Assistant
          </a>
        </Link>
      </div>
    </React.Fragment>
  );
}
