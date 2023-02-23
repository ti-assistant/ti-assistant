import { useRouter } from "next/router";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { getGameId } from "../src/util/api/util";
import { responsivePixels } from "../src/util/util";
import Head from "next/head";

export default function HomePage() {
  const [gameId, setGameId] = useState("Game ID");

  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const router = useRouter();

  const prevGameId = getGameId();

  useEffect(() => {
    if (!!prevGameId) {
      setCurrentGame(prevGameId);
    }
  }, [prevGameId]);

  function startGame() {
    router.push("/setup");
  }

  function joinGame() {
    // TODO: Check for game's existence before allowing to join.
    router.push(`/game/${gameId}`);
  }

  function continueGame() {
    router.push(`/game/${getGameId()}`);
  }

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
      <Header />
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          textAlign: "center",
          height: "100vh",
          gap: "20px",
        }}
      >
        <button style={{ fontSize: responsivePixels(54) }} onClick={startGame}>
          New Game
        </button>
        {!!currentGame ? (
          <button
            style={{ fontSize: responsivePixels(36) }}
            onClick={() => continueGame()}
          >
            Continue Game
          </button>
        ) : null}
        <div className="flexRow" style={{ gap: "8px" }}>
          <button onClick={joinGame} disabled={!validGameId()}>
            Join Game
          </button>
          <input
            value={gameId}
            onFocus={maybeClearGameId}
            onInput={(e) => setGameId(e.currentTarget.value)}
          />
        </div>
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
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <Head>
        <title>Twilight Imperium Assistant</title>
        <link rel="shortcut icon" href="/images/favicon.ico"></link>
      </Head>
      <div className="mobileTitle">TWILIGHT IMPERIUM ASSISTANT</div>
      <Sidebar side="left">TI ASSISTANT</Sidebar>
      <Sidebar side="right">TI ASSISTANT</Sidebar>
    </div>
  );
}
