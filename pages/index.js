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

  const [stage, setStage] = useState(Stage.MainMenu);

  function handleClick() {
    setLikes(likes + 1);
  }

  const router = useRouter();

  function startGame() {
    router.push("/setup");
  }

  function joinGame() {

  }

  switch (stage) {
    case Stage.MainMenu:
      return (
        <div>
          <Header title="Main Menu" />

          <Link href="/setup">
            <a>Start Game</a>
          </Link>
    
          <button onClick={startGame}>Start Game</button>
          <button onClick={joinGame}>Join Game</button>
        </div>
      );
    case Stage.Game:
      return (
        <div>
          <Header title="Develop. Preview. Ship. 🚀" />
          <ul>
            {names.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
    
          <button onClick={() => setStage(Stage.MainMenu)}>Back</button>
        </div>
      );
  }

  return (
    <div>
      <Header title="Develop. Preview. Ship. 🚀" />
    </div>
  );
}