import { useRouter } from 'next/router'

const Stage = {
  MainMenu: 'MainMenu',
  Game: 'Game'
};

// index.html
import Link from 'next/link'
import React, { useState } from 'react';
function Header({ title }) {
  return <h1>{title ? title : 'Default title'}</h1>;
}

export default function HomePage() {
  const [likes, setLikes] = useState(0);

  const [gameId, setGameId] = useState("Game ID");

  const router = useRouter();

  function startGame() {
    router.push("/setup");
  }

  function joinGame() {
    // TODO: Check for game's existence before allowing to join.
    router.push(`/game/${gameId}`);
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
      <h2
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        Twilight Imperium Assistant
      </h2>

      <button onClick={startGame}>Start Game</button>
      <div>
        <button onClick={joinGame} disabled={!validGameId()}>Join Game</button>
        <input value={gameId} onFocus={maybeClearGameId} onInput={(e) => setGameId(e.target.value)}/>
      </div>
    </div>
  );
}