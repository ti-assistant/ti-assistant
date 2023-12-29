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
import UndoButton from "../UndoButton/UndoButton";
import Sidebars from "../Sidebars/Sidebars";
import styles from "./Header.module.scss";

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
            mapStyle={options ? options["map-style"] ?? "standard" : "standard"}
            mallice={mallice}
          />
        </div>
      </GenericModal>
      {validateMapString((options ?? {})["map-string"] ?? "") ? (
        <div className={styles.Map}>
          <button onClick={() => setShowMap(true)}>View Map</button>
        </div>
      ) : null}
      <div className={styles.QRCode}>
        <ClientOnlyHoverMenu label={`Game: ${gameid}`}>
          <div className="flexColumn">
            <Link href={`/game/${gameid}`}>
              {qrCode ? (
                <img src={qrCode} alt="QR Code for joining game" />
              ) : null}
            </Link>
          </div>
        </ClientOnlyHoverMenu>
      </div>
      <Link href={"/"} className={styles.HomeLink}>
        <div>
          <ResponsiveLogo size={"100%"} />
        </div>
        Twilight Imperium Assistant
      </Link>
      {state.phase !== "SETUP" ? (
        <div className={styles.GameTimer}>
          <GameTimer frozen={state.phase === "END"} />
        </div>
      ) : null}
      <Sidebars
        left={state.phase === "END" ? "END OF GAME" : `${state.phase} PHASE`}
        right={round}
      />
      <div className={styles.ControlButtons}>
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
        <div className={styles.PassedLaws}>
          <ClientOnlyHoverMenu label="Laws in Effect">
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
        </div>
      ) : null}
    </React.Fragment>
  );
}
