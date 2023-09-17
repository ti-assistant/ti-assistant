import { useRouter } from "next/router";
import { PropsWithChildren, useCallback, useEffect, useState } from "react";
import QRCode from "qrcode";
import { responsivePixels, validateMapString } from "./util/util";
import { GameTimer } from "./Timer";
import { ClientOnlyHoverMenu } from "./HoverMenu";
import { LabeledDiv } from "./LabeledDiv";
import { computeVPs, UpdatePlanets } from "./FactionSummary";
import React from "react";
import { AgendaRow } from "./AgendaRow";
import Head from "next/head";
import { getFactionColor } from "./util/factions";
import { Map } from "./util/Map";
import Link from "next/link";
import Image from "next/image";
import Logo from "../public/images/android-chrome-512x512.png";
import { FactionSelectRadialMenu } from "./components/FactionSelect";
import { GenericModal } from "./Modal";
import { TechPanel } from "./components/TechPanel";
import { ObjectivePanel } from "./components/ObjectivePanel";
import { useGameData } from "./data/GameData";
import { undo } from "./util/api/data";
import { ActionLogEntry } from "./util/api/util";
import { setSpeaker } from "./util/api/setSpeaker";
import { continueGame, endGame } from "./util/api/endGame";
import { repealAgenda } from "./util/api/resolveAgenda";
import { getDefaultStrategyCards } from "./util/api/defaults";
import { PlanetPanel } from "./components/PlanetPanel";
import { FactionPanel } from "./components/FactionPanel";

export function ResponsiveLogo({ size }: { size: number }) {
  return (
    <div
      style={{
        position: "relative",
        width: responsivePixels(size),
        height: responsivePixels(size),
        borderRadius: "100%",
      }}
    >
      <Image src={Logo} alt="" layout="fill" objectFit="contain" />
    </div>
  );
}

function getUndoButtonText(logEntry: ActionLogEntry) {
  // switch (logEntry.data.action) {
  //   case "ASSIGN_STRATEGY_CARD": {
  //     return "Undo SC Pick";
  //   }
  //   case "SET_SPEAKER": {
  //     return "Undo Speaker Change";
  //   }
  // }
  return "Undo";
}

export function UndoButton({ gameId }: { gameId?: string }) {
  const gameData = useGameData(gameId, ["actionLog"]);

  const actionLog = gameData.actionLog;

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!gameId || !actionLog || actionLog.length === 0) {
        return;
      }
      if (event.ctrlKey && event.key === "z") {
        undo(gameId);
      }
    },
    [gameId, actionLog]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  if (!gameId || !actionLog || actionLog.length === 0) {
    return null;
  }

  const latestEntry = actionLog.at(actionLog.length - 1);
  if (!latestEntry) {
    return null;
  }

  return (
    <button
      onKeyDown={(event) => {
        if (event.ctrlKey && event.key === "z") {
          undo(gameId);
        }
      }}
      style={{ fontSize: responsivePixels(20) }}
      onClick={() => undo(gameId)}
    >
      {getUndoButtonText(latestEntry)}
    </button>
  );
}

export interface SidebarProps {
  side: string;
}

export function Sidebar({ side, children }: PropsWithChildren<SidebarProps>) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{ letterSpacing: responsivePixels(3) }}>
      {children}
    </div>
  );
}

const BASE_URL =
  process.env.GAE_SERVICE === "dev"
    ? "https://dev-dot-twilight-imperium-360307.wm.r.appspot.com"
    : "https://ti-assistant.com";

export function NonGameHeader({
  leftSidebar,
  rightSidebar,
  gameId,
}: {
  leftSidebar?: string;
  rightSidebar?: string;
  gameId?: string;
}) {
  const [qrCode, setQrCode] = useState<string>();
  const [qrCodeSize, setQrCodeSize] = useState(164);

  useEffect(() => {
    setQrCodeSize(
      Math.max(
        164 + (328 - 164) * ((window.innerWidth - 1280) / (2560 - 1280)),
        164
      )
    );
  }, []);

  if (!qrCode && gameId) {
    QRCode.toDataURL(
      `${BASE_URL}/game/${gameId}`,
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
  return (
    <div
      className="flexRow"
      style={{
        top: 0,
        position: "fixed",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        zIndex: 1,
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <div
        className="flex"
        style={{
          top: 0,
          width: "100vw",
          position: "fixed",
          justifyContent: "space-between",
        }}
      >
        {leftSidebar ? <Sidebar side="left">{leftSidebar}</Sidebar> : null}
        {rightSidebar ? <Sidebar side="right">{rightSidebar}</Sidebar> : null}

        <Link href={"/"}>
          <a
            className="flexRow extraLargeFont nonMobile"
            style={{
              cursor: "pointer",
              position: "fixed",
              justifyContent: "center",
              top: responsivePixels(16),
              left: responsivePixels(96),
            }}
          >
            <ResponsiveLogo size={32} />
            {/* <Image src={Logo} alt="" width="32px" height="32px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
        <Link href={"/"}>
          <a
            className="flexRow hugeFont mobileOnly"
            style={{
              cursor: "pointer",
              position: "fixed",
              textAlign: "center",
              justifyContent: "center",
              zIndex: 4,
              paddingTop: responsivePixels(12),
              paddingBottom: responsivePixels(12),
              width: "100%",
              left: 0,
              backgroundColor: "#222",
              boxSizing: "border-box",
            }}
          >
            <ResponsiveLogo size={28} />
            {/* <Image src={Logo} alt="" width="28px" height="28px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>

        {gameId ? (
          <Link href={`/game/${gameId}`}>
            <a>
              <ClientOnlyHoverMenu
                label={`Game: ${gameId}`}
                buttonStyle={{
                  position: "fixed",
                  top: responsivePixels(24),
                  right: responsivePixels(120),
                }}
              >
                <div
                  className="flexColumn"
                  style={{
                    position: "relative",
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
        ) : null}
      </div>
    </div>
  );
}

export function Header() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, [
    "agendas",
    "factions",
    "objectives",
    "options",
    "planets",
    "state",
  ]);
  const agendas = gameData.agendas;
  const factions = gameData.factions;
  const objectives = gameData.objectives;
  const options = gameData.options;
  const planets = gameData.planets;
  const state = gameData.state;

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

  function endGameLocal() {
    if (!gameid) {
      return;
    }
    endGame(gameid);
  }

  function backToGameLocal() {
    if (!gameid) {
      return;
    }
    continueGame(gameid);
  }

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
  function removeAgenda(agendaName: string) {
    if (!gameid) {
      return;
    }
    const target = (agendas ?? {})[agendaName]?.target;
    if (!target) {
      return;
    }
    repealAgenda(gameid, agendaName, target);
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
            computeVPs(factions, faction.name, objectives ?? {}) +
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
            computeVPs(factions, faction.name, objectives ?? {}) >=
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
            computeVPs(factions, faction.name, objectives ?? {}) >=
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
              top: responsivePixels(state.phase === "SETUP" ? 64 : 104),
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
      {state ? (
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
        ) : (
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
        )
      ) : null}
      {/* {gameFinished || state?.phase === "END" ? ( */}
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
              onClick={backToGameLocal}
            >
              Back to Game
            </button>
          ) : (
            <button
              style={{ fontFamily: "Slider", fontSize: responsivePixels(32) }}
              onClick={endGameLocal}
            >
              End Game
            </button>
          )
        ) : null}
      </div>
      {/* ) : null} */}
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
                key={agenda.name}
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
            {/* <Image src={Logo} alt="" width="32px" height="32px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
        {state && state.phase !== "SETUP" ? (
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
            {/* <Image src={Logo} alt="" width="28px" height="28px" /> */}
            Twilight Imperium Assistant
          </a>
        </Link>
      </div>
    </React.Fragment>
  );
}

export function Footer({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["factions", "state", "strategycards"]);
  const factions = gameData.factions;
  const state = gameData.state;
  const strategyCards = gameData.strategycards ?? getDefaultStrategyCards();

  const [showTechModal, setShowTechModal] = useState(false);
  const [showObjectiveModal, setShowObjectiveModal] = useState(false);
  const [showPlanetModal, setShowPlanetModal] = useState(false);

  function shouldBlockSpeakerUpdates() {
    if (state?.phase === "END") {
      return true;
    }
    if (state?.phase !== "STRATEGY") {
      return false;
    }

    const selectedCards = Object.values(strategyCards).filter(
      (card) => !!card.faction
    );

    return selectedCards.length !== 0;
  }

  const orderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.order - b.order
  );

  const speakerButtonPosition =
    state?.phase === "STRATEGY" || state?.phase === "STATUS"
      ? "top"
      : orderedFactions.length > 7
      ? "bottom"
      : "top";

  return (
    <div
      className="flex"
      style={{
        bottom: 0,
        width: "100vw",
        position: "fixed",
        justifyContent: "space-between",
      }}
    >
      {state ? (
        <div
          style={{
            position: "fixed",
            bottom: responsivePixels(16),
            left: responsivePixels(96),
          }}
        >
          <LabeledDiv label={state.phase === "END" ? "View" : "Update"}>
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              {speakerButtonPosition === "top" &&
              !shouldBlockSpeakerUpdates() ? (
                <div className="flexRow">
                  Speaker:
                  <FactionSelectRadialMenu
                    allowNone={false}
                    borderColor={
                      state?.speaker
                        ? getFactionColor((factions ?? {})[state.speaker])
                        : undefined
                    }
                    selectedFaction={state?.speaker}
                    options={orderedFactions
                      .filter((faction) => faction.name !== state?.speaker)
                      .map((faction) => faction.name)}
                    onSelect={(factionName, _) => {
                      if (!gameid || !factionName) {
                        return;
                      }
                      setSpeaker(gameid, factionName);
                    }}
                  />
                </div>
              ) : null}
              <div
                className="flexRow"
                style={{ width: "100%", alignItems: "center" }}
              >
                <GenericModal
                  visible={showTechModal}
                  closeMenu={() => setShowTechModal(false)}
                >
                  <div
                    className="flexColumn"
                    style={{
                      justifyContent: "flex-start",
                      maxHeight: `calc(100dvh - ${responsivePixels(24)})`,
                    }}
                  >
                    <div
                      className="centered extraLargeFont"
                      style={{
                        backgroundColor: "#222",
                        padding: `${responsivePixels(4)} ${responsivePixels(
                          8
                        )}`,
                        borderRadius: responsivePixels(4),
                        width: "min-content",
                      }}
                    >
                      Techs
                    </div>
                    <div
                      className="flexColumn largeFont"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: `clamp(80vw, 960px, calc(100vw - ${responsivePixels(
                          24
                        )}))`,
                        justifyContent: "flex-start",
                        overflow: "auto",
                      }}
                    >
                      <TechPanel />
                    </div>
                  </div>
                </GenericModal>
                <button onClick={() => setShowTechModal(true)}>Techs</button>
                <GenericModal
                  visible={showObjectiveModal}
                  closeMenu={() => setShowObjectiveModal(false)}
                >
                  <div
                    className="flexColumn"
                    style={{
                      justifyContent: "flex-start",
                      height: `calc(100dvh - ${responsivePixels(24)})`,
                    }}
                  >
                    <div
                      className="centered extraLargeFont"
                      style={{
                        backgroundColor: "#222",
                        padding: `${responsivePixels(4)} ${responsivePixels(
                          8
                        )}`,
                        borderRadius: responsivePixels(4),
                        width: "min-content",
                      }}
                    >
                      Objectives
                    </div>
                    <div
                      className="flexColumn largeFont"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(
                          24
                        )}))`,
                        justifyContent: "flex-start",
                        overflow: "auto",
                        height: "fit-content",
                        paddingBottom: responsivePixels(24),
                      }}
                    >
                      <ObjectivePanel />
                    </div>
                  </div>
                </GenericModal>
                <button onClick={() => setShowObjectiveModal(true)}>
                  Objectives
                </button>
                <GenericModal
                  visible={showPlanetModal}
                  closeMenu={() => setShowPlanetModal(false)}
                >
                  <div
                    className="flexColumn"
                    style={{
                      justifyContent: "flex-start",
                      maxHeight: `calc(100dvh - ${responsivePixels(24)})`,
                    }}
                  >
                    <div
                      className="centered extraLargeFont"
                      style={{
                        backgroundColor: "#222",
                        padding: `${responsivePixels(4)} ${responsivePixels(
                          8
                        )}`,
                        borderRadius: responsivePixels(4),
                        width: "min-content",
                      }}
                    >
                      Planets
                    </div>
                    <div
                      className="flexColumn largeFont"
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        width: `clamp(80vw, 1200px, calc(100vw - ${responsivePixels(
                          24
                        )}))`,
                        justifyContent: "flex-start",
                        overflow: "auto",
                        height: "100%",
                      }}
                    >
                      <PlanetPanel />
                    </div>
                  </div>
                </GenericModal>
                <button onClick={() => setShowPlanetModal(true)}>
                  Planets
                </button>
                {/* <ClientOnlyHoverMenu label="Planets" shift={{ left: 195 }}>
                  <div
                    className="flexColumn largeFont"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <UpdatePlanets />
                  </div>
                </ClientOnlyHoverMenu> */}
                {speakerButtonPosition === "bottom" &&
                !shouldBlockSpeakerUpdates() ? (
                  <div className="flexRow">
                    Speaker:
                    <FactionSelectRadialMenu
                      allowNone={false}
                      borderColor={
                        state?.speaker
                          ? getFactionColor((factions ?? {})[state.speaker])
                          : undefined
                      }
                      selectedFaction={state?.speaker}
                      options={orderedFactions
                        .filter((faction) => faction.name !== state?.speaker)
                        .map((faction) => faction.name)}
                      onSelect={(factionName, _) => {
                        if (!gameid || !factionName) {
                          return;
                        }
                        setSpeaker(gameid, factionName);
                      }}
                    />
                  </div>
                ) : null}
              </div>
            </div>
          </LabeledDiv>
        </div>
      ) : null}
    </div>
  );
}
