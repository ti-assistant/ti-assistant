import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useState } from "react";
import QRCode from "qrcode";
import useSWR from "swr";
import { responsiveNegativePixels, responsivePixels } from "./util/util";
import { fetcher } from "./util/api/util";
import { GameTimer } from "./Timer";
import { ClientOnlyHoverMenu } from "./HoverMenu";
import { LabeledDiv } from "./LabeledDiv";
import {
  computeVPs,
  UpdateObjectives,
  UpdatePlanets,
  UpdateTechs,
} from "./FactionSummary";
import React from "react";
import { AgendaRow } from "./AgendaRow";
import { Agenda, repealAgenda } from "./util/api/agendas";
import {
  continueGame,
  finishGame,
  GameState,
  setSpeaker,
} from "./util/api/state";
import Head from "next/head";
import { getFactionName } from "./util/factions";
import { Map } from "./util/Map";
import { Options } from "./util/api/options";
import { Faction } from "./util/api/factions";
import { Objective } from "./util/api/objectives";
import { Planet } from "./util/api/planets";
import { SubState } from "./util/api/subState";

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

export function Header() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: agendas }: { data?: Record<string, Agenda> } = useSWR(
    gameid ? `/api/${gameid}/agendas` : null,
    fetcher
  );
  const { data: options }: { data?: Options } = useSWR(
    gameid ? `/api/${gameid}/options` : null,
    fetcher
  );
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: objectives }: { data?: Record<string, Objective> } = useSWR(
    gameid ? `/api/${gameid}/objectives` : null,
    fetcher
  );
  const { data: planets }: { data?: Record<string, Planet> } = useSWR(
    gameid ? `/api/${gameid}/planets` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
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

  if (!qrCode && gameid) {
    QRCode.toDataURL(
      `https://ti-assistant.com/game/${gameid}`,
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

  function endGame() {
    if (!gameid) {
      return;
    }
    finishGame(gameid);
  }

  function backToGame() {
    if (!gameid) {
      return;
    }
    continueGame(gameid);
  }

  const mapOrderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );
  let mallice;
  if (options && (options["expansions"] ?? []).includes("pok")) {
    mallice = "A";
    if (planets && ((planets["Mallice"] ?? {}).owners ?? []).length > 0) {
      mallice = "B";
    }
  }

  const passedLaws = Object.values(agendas ?? {}).filter((agenda) => {
    return agenda.passed && agenda.type === "law";
  });
  function removeAgenda(agendaName: string) {
    if (!gameid) {
      return;
    }
    repealAgenda(gameid, agendaName);
  }

  let gameFinished = false;
  if (options && factions) {
    Object.values(factions).forEach((faction) => {
      if (
        computeVPs(factions, faction.name, objectives ?? {}) >=
        options["victory-points"]
      ) {
        gameFinished = true;
      }
    });
  }

  return (
    <React.Fragment>
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      {((options ?? {})["map-string"] ?? []).length > 0 && state ? (
        <ClientOnlyHoverMenu
          label="View Map"
          buttonStyle={{
            position: "fixed",
            top: responsivePixels(state.phase === "SETUP" ? 60 : 100),
            left: `${responsivePixels(120)}`,
          }}
        >
          <div
            className="flexRow"
            style={{ zIndex: 10000, width: "81vw", height: "78vh" }}
          >
            <div
              style={{
                marginTop: responsiveNegativePixels(-40),
                width: "90vh",
                height: "90vh",
              }}
            >
              <Map
                factions={mapOrderedFactions}
                mapString={options ? options["map-string"] ?? "" : ""}
                mapStyle={options ? options["map-style"] ?? "" : ""}
                mallice={mallice}
              />
            </div>
          </div>
        </ClientOnlyHoverMenu>
      ) : null}
      {state ? (
        state.phase === "SETUP" ? (
          <div
            className="flexRow nonMobile"
            style={{
              position: "fixed",
              top: `${responsivePixels(20)}`,
              right: `${responsivePixels(120)}`,
              alignItems: "flex-start",
              justifyContent: "center",
            }}
          >
            <div style={{ marginTop: `${responsivePixels(16)}` }}>
              Game ID: {gameid}
            </div>
            {qrCode ? (
              <img src={qrCode} alt="QR Code for joining game" />
            ) : null}
          </div>
        ) : (
          <ClientOnlyHoverMenu
            label="View QR Code"
            buttonStyle={{
              position: "fixed",
              top: responsivePixels(60),
              left: responsivePixels(120),
            }}
          >
            <div
              className="flexColumn"
              style={{
                position: "relative",
                zIndex: 10000,
                marginTop: responsivePixels(16),
              }}
            >
              Game ID: {gameid}
              {qrCode ? (
                <img src={qrCode} alt="QR Code for joining game" />
              ) : null}
            </div>
          </ClientOnlyHoverMenu>
        )
      ) : null}
      {gameFinished || state?.phase === "END" ? (
        <div
          className="flexRow extraLargeFont"
          style={{
            position: "fixed",
            top: responsivePixels(20),
            left: responsivePixels(490),
          }}
        >
          {state?.phase === "END" ? (
            <button
              style={{ fontSize: responsivePixels(24) }}
              onClick={backToGame}
            >
              Back to Game
            </button>
          ) : (
            <button
              style={{ fontFamily: "Slider", fontSize: responsivePixels(32) }}
              onClick={endGame}
            >
              End Game
            </button>
          )}
        </div>
      ) : null}
      {passedLaws.length > 0 ? (
        <ClientOnlyHoverMenu
          label="Laws in Effect"
          buttonStyle={{
            position: "fixed",
            top: responsivePixels(20),
            right: responsivePixels(440),
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
          paddingTop: responsivePixels(20),
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
        <div
          className="extraLargeFont nonMobile"
          style={{
            cursor: "pointer",
            position: "fixed",
            backgroundColor: "#222",
            top: `${responsivePixels(20)}`,
            left: `${responsivePixels(120)}`,
          }}
          onClick={() => router.push(gameid ? `/game/${gameid}` : "/")}
        >
          Twilight Imperium Assistant
        </div>
        {state && state.phase !== "SETUP" ? (
          <div
            className="flexRow nonMobile"
            style={{
              position: "fixed",
              top: responsivePixels(60),
              left: responsivePixels(280),
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <GameTimer frozen={state.phase === "END"} />
          </div>
        ) : null}
        <div
          className="flexColumn extraLargeFont mobileOnly"
          style={{
            cursor: "pointer",
            position: "fixed",
            backgroundColor: "#222",
            textAlign: "center",
            top: `${responsivePixels(20)}`,
            width: "100%",
          }}
          onClick={() => router.push("/")}
        >
          Twilight Imperium Assistant
        </div>
      </div>
    </React.Fragment>
  );
}

export function Footer({}) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: factions }: { data?: Record<string, Faction> } = useSWR(
    gameid ? `/api/${gameid}/factions` : null,
    fetcher
  );
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher
  );
  const { data: subState }: { data?: SubState } = useSWR(
    gameid ? `/api/${gameid}/subState` : null,
    fetcher
  );

  function shouldBlockSpeakerUpdates() {
    if (state?.phase !== "STRATEGY") {
      return false;
    }

    return (subState?.strategyCards ?? []).length !== 0;
  }

  const orderedFactions = Object.values(factions ?? {}).sort(
    (a, b) => a.order - b.order
  );

  const speakerButtonPosition =
    state?.phase === "STRATEGY"
      ? "top"
      : orderedFactions.length === 4 || orderedFactions.length > 7
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
      {state && state.phase !== "SETUP" && state.phase !== "END" ? (
        <div
          style={{
            position: "fixed",
            bottom: responsivePixels(12),
            left: responsivePixels(108),
          }}
        >
          <LabeledDiv label="Update">
            <div className="flexColumn" style={{ alignItems: "flex-start" }}>
              {speakerButtonPosition === "top" &&
              !shouldBlockSpeakerUpdates() ? (
                <ClientOnlyHoverMenu label="Speaker">
                  <div
                    className="flexColumn"
                    style={{
                      padding: responsivePixels(8),
                      gap: responsivePixels(4),
                      alignItems: "stretch",
                    }}
                  >
                    {orderedFactions.map((faction) => {
                      return (
                        <button
                          key={faction.name}
                          disabled={state?.speaker === faction.name}
                          onClick={() => {
                            if (!gameid) {
                              return;
                            }
                            setSpeaker(gameid, faction.name);
                          }}
                        >
                          {getFactionName(faction)}
                        </button>
                      );
                    })}
                  </div>
                </ClientOnlyHoverMenu>
              ) : null}
              <div
                className="flexRow"
                style={{ width: "100%", alignItems: "stretch" }}
              >
                <ClientOnlyHoverMenu label="Techs">
                  <div
                    className="flexColumn"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <UpdateTechs />
                  </div>
                </ClientOnlyHoverMenu>
                <ClientOnlyHoverMenu label="Objectives" shift={{ left: 78 }}>
                  <div
                    className="flexColumn"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <UpdateObjectives />
                  </div>
                </ClientOnlyHoverMenu>
                <ClientOnlyHoverMenu label="Planets" shift={{ left: 195 }}>
                  <div
                    className="flexColumn largeFont"
                    style={{ height: "90vh", width: "82vw" }}
                  >
                    <UpdatePlanets />
                  </div>
                </ClientOnlyHoverMenu>
                {speakerButtonPosition === "bottom" &&
                !shouldBlockSpeakerUpdates() ? (
                  <ClientOnlyHoverMenu label="Speaker">
                    <div
                      className="flexColumn"
                      style={{
                        padding: responsivePixels(8),
                        gap: responsivePixels(4),
                        alignItems: "stretch",
                      }}
                    >
                      {orderedFactions.map((faction) => {
                        return (
                          <button
                            key={faction.name}
                            disabled={state?.speaker === faction.name}
                            onClick={() => {
                              if (!gameid) {
                                return;
                              }
                              setSpeaker(gameid, faction.name);
                            }}
                          >
                            {getFactionName(faction)}
                          </button>
                        );
                      })}
                    </div>
                  </ClientOnlyHoverMenu>
                ) : null}
              </div>
            </div>
          </LabeledDiv>
        </div>
      ) : null}
    </div>
  );
}
