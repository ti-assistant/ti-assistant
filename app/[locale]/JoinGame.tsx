"use client";

import Link from "next/link";
import { useState } from "react";
import { useIntl } from "react-intl";
import BorderedDiv from "../../src/components/BorderedDiv/BorderedDiv";
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
          href={validGameId() ? `/game/${gameId}` : {}}
          onClick={(event) => (!validGameId() ? event.preventDefault() : null)}
        >
          <BorderedDiv>
            <div
              className="flexColumn"
              style={{
                width: "100%",
              }}
            >
              {intl.formatMessage({
                id: "QFhw/l",
                defaultMessage: "Join Game",
                description:
                  "A button that will join the game with a specified ID.",
              })}
            </div>
          </BorderedDiv>
        </Link>
      ) : (
        <BorderedDiv color="#555">
          <div
            className="flexColumn"
            style={{
              width: "100%",
              color: "#555",
            }}
          >
            {intl.formatMessage({
              id: "QFhw/l",
              defaultMessage: "Join Game",
              description:
                "A button that will join the game with a specified ID.",
            })}
          </div>
        </BorderedDiv>
      )}
      <input
        value={gameId}
        placeholder={placeholder}
        onFocus={maybeClearGameId}
        onInput={(e) => setGameId(e.currentTarget.value)}
      />
    </div>
  );
}
