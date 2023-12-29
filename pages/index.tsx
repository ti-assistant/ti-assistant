import Link from "next/link";
import { useEffect, useState } from "react";
import BorderedDiv from "../src/components/BorderedDiv/BorderedDiv";
import NonGameHeader from "../src/components/NonGameHeader/NonGameHeader";
import { getGameId } from "../src/util/api/util";
import { responsivePixels } from "../src/util/util";

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
          <BorderedDiv>
            <div
              className="flexColumn"
              style={{
                width: "100%",
                fontSize: responsivePixels(44),
              }}
            >
              New Game
            </div>
          </BorderedDiv>
        </Link>
        {!!currentGame ? (
          <Link href={`/game/${getGameId()}`}>
            <BorderedDiv>
              <div
                className="flexColumn"
                style={{
                  width: "100%",
                  fontSize: responsivePixels(32),
                }}
              >
                Continue Game
              </div>
            </BorderedDiv>
          </Link>
        ) : null}

        <div className="flexRow" style={{ gap: "8px" }}>
          {validGameId() ? (
            <Link
              href={validGameId() ? `/game/${gameId}` : {}}
              onClick={(event) =>
                !validGameId() ? event.preventDefault() : null
              }
            >
              <BorderedDiv>
                <div
                  className="flexColumn"
                  style={{
                    width: "100%",
                  }}
                >
                  Join Game
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
                Join Game
              </div>
            </BorderedDiv>
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
            <Link href={`/supporters`}>
              <BorderedDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  Supporters
                </div>
              </BorderedDiv>
            </Link>
            <Link href={`/FAQ`}>
              <BorderedDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  FAQ
                </div>
              </BorderedDiv>
            </Link>
            <a href={`https://patreon.com/TIAssistant`}>
              <BorderedDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  Donate Trade Goods
                </div>
              </BorderedDiv>
            </a>
            <a href={`https://github.com/ti-assistant/issues/issues`}>
              <BorderedDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  Report Issue
                </div>
              </BorderedDiv>
            </a>
          </div>
        </div>
      </div>
      <div
        className="flexColumn"
        style={{
          position: "absolute",
          bottom: responsivePixels(8),
          fontSize: responsivePixels(10),
          textAlign: "center",
          gap: responsivePixels(4),
        }}
      >
        <div>
          Twilight Imperium Assistant is not affiliated with{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.fantasyflightgames.com/en/index/"
          >
            Fantasy&nbsp;Flight&nbsp;Games®
          </a>
        </div>
        <div>
          Twilight Imperium™ and all associated images are the property of{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href="https://www.fantasyflightgames.com/en/index/"
          >
            Fantasy&nbsp;Flight&nbsp;Games®
          </a>
        </div>
      </div>
    </div>
  );
}
