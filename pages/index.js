import { useRouter } from 'next/router'

const Stage = {
  MainMenu: 'MainMenu',
  Game: 'Game'
};

// index.html
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { getGameId } from '../src/util/api/util';
import { continueGame } from '../src/util/api/state';
import { responsivePixels } from '../src/util/util';
import Head from 'next/head';

export default function HomePage() {
  const [likes, setLikes] = useState(0);

  const [gameId, setGameId] = useState("Game ID");

  const [currentGame, setCurrentGame] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!!getGameId()) {
      setCurrentGame(getGameId());
    }
  });

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
    <div className="flexColumn" style={{gap: "16px"}}>
      <Header />
      <div className="flexColumn" style={{alignItems: "stretch", textAlign: "center", height: "100vh", gap: "20px"}}>

        <button style={{fontSize: responsivePixels(54)}} onClick={startGame}>New Game</button>
        {!!currentGame ? 
          <button style={{fontSize: responsivePixels(36)}} onClick={() => continueGame()}>Continue Game</button> 
        : null}
        <div className="flexRow" style={{gap: "8px"}}>
          <button onClick={joinGame} disabled={!validGameId()}>Join Game</button>
          <input value={gameId} onFocus={maybeClearGameId} onInput={(e) => setGameId(e.target.value)}/>
        </div>
      </div>
    </div>
  );
}

function Sidebar({side, content}) {
  const className = `${side}Sidebar`;
  return (
    <div className={className} style={{letterSpacing: "3px"}}>
      {content}
    </div>
  );
}

function Header() {
  const router = useRouter();

  return <div className="flexColumn" style={{top: 0, position: "fixed", alignItems: "flex-start", justifyContent: "flex-start"}}>
    <Head>
      <title>Twilight Imperium Assistant</title>
      <link rel="shortcut icon" href="/images/favicon.ico"></link>
    </Head>
    <div className="mobileTitle">TWILIGHT IMPERIUM ASSISTANT</div>
    <Sidebar side="left" content={`TI ASSISTANT`} />
    <Sidebar side="right" content={`TI ASSISTANT`} />

    {/* <div style={{position: "fixed", paddingBottom: "20px", transform: "rotate(-90deg)", left: "0",  top: "50%", borderBottom: "1px solid grey", fontSize: "40px", transformOrigin: "0 0"}}>
      SETUP PHASE
    </div> */}
    {/* <div style={{cursor: "pointer", position: "fixed", backgroundColor: "#222", top: "12px", left: "150px", fontSize: "24px"}} onClick={() => router.push("/")}>Twilight Imperium Assistant</div> */}
    {/* <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", left: "144px", top: "8px"}}>
      {qrCode ? <img src={qrCode} /> : null}
      <div>Game ID: {gameid}</div>
    </div>
    <div className="flexRow" style={{alignItems: "center", justifyContent: "center", position: "fixed", right: "288px", top: "16px"}}>
      <GameTimer />
    </div> */}
  </div>
}