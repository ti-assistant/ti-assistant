import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { getGameId } from "../src/util/api/util";
import { responsivePixels } from "../src/util/util";
import Head from "next/head";
import Link from "next/link";
import { LabeledDiv } from "../src/LabeledDiv";
import Image from "next/image";
import { NonGameHeader, ResponsiveLogo } from "../src/Header";

export default function HomePage() {
  const [gameId, setGameId] = useState("Game ID");

  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const prevGameId = getGameId();

  useEffect(() => {
    if (!!prevGameId) {
      setCurrentGame(prevGameId);
    }
  }, [prevGameId]);

  function maybeClearGameId() {
    if (gameId === "Game ID") {
      setGameId("");
    }
  }

  function validGameId() {
    if (gameId === "Game Id") {
      return false;
    }
    if (gameId === "") {
      return false;
    }
    return gameId.length === 6;
  }

  return (
    <div className="flexColumn" style={{ gap: "16px" }}>
      <NonGameHeader leftSidebar="TI ASSISTANT" rightSidebar="TI ASSISTANT" />
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          textAlign: "center",
          marginTop: "10svh",
          height: "80svh",
          gap: "20px",
        }}
      >
        <Link href={"/setup"}>
          <a>
            <LabeledDiv>
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  fontSize: responsivePixels(44),
                }}
              >
                New Game
              </div>
            </LabeledDiv>
          </a>
        </Link>
        {!!currentGame ? (
          <Link href={`/game/${getGameId()}`}>
            <a>
              <LabeledDiv>
                <div
                  className="flexColumn"
                  style={{
                    width: "100%",
                    fontSize: responsivePixels(32),
                  }}
                >
                  Continue Game
                </div>
              </LabeledDiv>
            </a>
          </Link>
        ) : null}

        <div className="flexRow" style={{ gap: "8px" }}>
          {validGameId() ? (
            <Link href={validGameId() ? `/game/${gameId}` : {}}>
              <a
                onClick={(event) =>
                  !validGameId() ? event.preventDefault() : null
                }
              >
                <LabeledDiv>
                  <div
                    className="flexColumn"
                    style={{
                      width: "100%",
                    }}
                  >
                    Join Game
                  </div>
                </LabeledDiv>
              </a>
            </Link>
          ) : (
            <LabeledDiv color="#555">
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  color: "#555",
                }}
              >
                Join Game
              </div>
            </LabeledDiv>
          )}
          <input
            value={gameId}
            onFocus={maybeClearGameId}
            onInput={(e) => setGameId(e.currentTarget.value)}
          />
        </div>
        <div className="flexColumn" style={{ width: "100%" }}>
          <div
            className="flexColumn"
            style={{ width: "75%", alignItems: "stretch" }}
          >
            <Link href={`/help`}>
              <a>
                <LabeledDiv>
                  <div
                    className="flexColumn mediumFont"
                    style={{
                      width: "100%",
                    }}
                  >
                    Help
                  </div>
                </LabeledDiv>
              </a>
            </Link>
            <Link href={`/FAQ`}>
              <a>
                <LabeledDiv>
                  <div
                    className="flexColumn mediumFont"
                    style={{
                      width: "100%",
                    }}
                  >
                    FAQ
                  </div>
                </LabeledDiv>
              </a>
            </Link>
            <a href={`https://patreon.com/TIAssistant`}>
              <LabeledDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  Donate Trade Goods
                </div>
              </LabeledDiv>
            </a>
            <a href={`https://github.com/ti-assistant/issues/issues`}>
              <LabeledDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  Report Issue
                </div>
              </LabeledDiv>
            </a>
          </div>
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: responsivePixels(24),
          fontSize: responsivePixels(10),
        }}
      >
        Twilight Imperium Assistant is not affiliated with{" "}
        <a target="_blank" href="https://www.fantasyflightgames.com/en/index/">
          Fantasy Flight Games®
        </a>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: responsivePixels(8),
          fontSize: responsivePixels(10),
        }}
      >
        Twilight Imperium™ and all associated images are the property of{" "}
        <a target="_blank" href="https://www.fantasyflightgames.com/en/index/">
          Fantasy Flight Games®
        </a>
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
  return (
    <div
      className="flexColumn"
      style={{
        top: 0,
        position: "fixed",
        justifyContent: "flex-start",
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <Link href={"/"}>
        <a
          className="nonMobile flexRow extraLargeFont"
          style={{
            cursor: "pointer",
            position: "fixed",
            textAlign: "center",
            justifyContent: "center",
            marginTop: `${responsivePixels(16)}`,
            width: "100%",
          }}
        >
          <ResponsiveLogo size={32} />
          Twilight Imperium Assistant
        </a>
      </Link>
      <Link href={"/"}>
        <a
          className="mobileOnly flexRow hugeFont"
          style={{
            cursor: "pointer",
            position: "fixed",
            textAlign: "center",
            justifyContent: "center",
            marginTop: `${responsivePixels(12)}`,
            width: "100%",
          }}
        >
          <ResponsiveLogo size={28} />
          Twilight Imperium Assistant
        </a>
      </Link>
      <Sidebar side="left">TI ASSISTANT</Sidebar>
      <Sidebar side="right">TI ASSISTANT</Sidebar>
    </div>
  );
}
