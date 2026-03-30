"use client";

import Link from "next/link";
import { useState } from "react";
import { useIntl } from "react-intl";
import { gameIdString } from "../../src/util/strings";
import { rem } from "../../src/util/util";

export default function JoinGame() {
  const intl = useIntl();
  const placeholder = gameIdString(intl);
  const [gameId, setGameId] = useState("");

  function maybeClearGameId() {
    if (gameId === placeholder) {
      setGameId("");
    }
  }

  function validGameId() {
    if (gameId === placeholder) {
      return false;
    }
    if (gameId === "") {
      return false;
    }
    return gameId.length === 6;
  }
  return (
    <div className="flexRow" style={{ gap: rem(8) }}>
      {validGameId() ? (
        <Link
          className="outline"
          href={validGameId() ? `/game/${gameId}` : {}}
          onClick={(event) => (!validGameId() ? event.preventDefault() : null)}
          style={{ fontSize: "1.25rem" }}
        >
          {intl.formatMessage({
            id: "QFhw/l",
            defaultMessage: "Join Game",
            description:
              "A button that will join the game with a specified ID.",
          })}
        </Link>
      ) : (
        <button className="outline" disabled style={{ fontSize: "1.25rem" }}>
          {intl.formatMessage({
            id: "QFhw/l",
            defaultMessage: "Join Game",
            description:
              "A button that will join the game with a specified ID.",
          })}
        </button>
      )}
      <input
        type="textbox"
        value={gameId}
        placeholder={placeholder}
        onFocus={maybeClearGameId}
        onInput={(e) => setGameId(e.currentTarget.value)}
      />
    </div>
  );
}
