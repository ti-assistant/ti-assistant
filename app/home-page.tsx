"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import BorderedDiv from "../src/components/BorderedDiv/BorderedDiv";
import LabeledDiv from "../src/components/LabeledDiv/LabeledDiv";
import NonGameHeader from "../src/components/NonGameHeader/NonGameHeader";
import { getGameId } from "../src/util/api/util";
import { gameIdString } from "../src/util/strings";
import styles from "./home-page.module.scss";

export default function HomePage() {
  const intl = useIntl();
  const [gameId, setGameId] = useState(gameIdString(intl));

  const [currentGame, setCurrentGame] = useState<string | null>(null);

  const prevGameId = getGameId();

  useEffect(() => {
    if (!!prevGameId) {
      setCurrentGame(prevGameId);
    }
  }, [prevGameId]);

  function maybeClearGameId() {
    if (gameId === gameIdString(intl)) {
      setGameId("");
    }
  }

  function validGameId() {
    if (gameId === gameIdString(intl)) {
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
      <div className={styles.CenterColumn}>
        <Link href={"/setup"}>
          <BorderedDiv>
            <div
              className="flexColumn"
              style={{
                width: "100%",
                fontSize: "44px",
              }}
            >
              <FormattedMessage
                id="+HPhsr"
                defaultMessage="New Game"
                description="A button that will start a new game."
              />
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
                  fontSize: "32px",
                }}
              >
                <FormattedMessage
                  id="+/Qpw/"
                  defaultMessage="Continue Game"
                  description="A button that will rejoin the previous game."
                />
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
                  <FormattedMessage
                    id="QFhw/l"
                    defaultMessage="Join Game"
                    description="A button that will join the game with a specified ID."
                  />
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
                <FormattedMessage
                  id="QFhw/l"
                  defaultMessage="Join Game"
                  description="A button that will join the game with a specified ID."
                />
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
            style={{ width: "85%", alignItems: "stretch" }}
          >
            <Link href={`/supporters`}>
              <BorderedDiv>
                <div
                  className="flexColumn mediumFont"
                  style={{
                    width: "100%",
                  }}
                >
                  <FormattedMessage
                    id="4Z//RZ"
                    defaultMessage="Supporters"
                    description="A button that will open the supporters page."
                  />
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
                  <FormattedMessage
                    id="pKlkVZ"
                    defaultMessage="FAQ"
                    description="A button that will open the Frequently Asked Questions page."
                  />
                </div>
              </BorderedDiv>
            </Link>
            <LabeledDiv
              label={
                <FormattedMessage
                  id="X7zR7a"
                  description="Label for a section about helping TI Assistant"
                  defaultMessage="Help support TI Assistant"
                />
              }
            >
              <a
                href={`https://patreon.com/TIAssistant`}
                style={{ width: "100%" }}
              >
                <BorderedDiv>
                  <div
                    className="flexRow mediumFont"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Image
                      src="/images/patreon-icon.svg"
                      alt="icon"
                      width={18}
                      height={18}
                      style={{ width: "20%" }}
                    />
                    <div style={{ width: "80%" }}>
                      <FormattedMessage
                        id="wOb6Wx"
                        defaultMessage="Become a Patron"
                        description="A button that will open the Patreon page."
                      />
                    </div>
                  </div>
                </BorderedDiv>
              </a>
              <a
                href={`https://www.buymeacoffee.com/tiassistant`}
                style={{ width: "100%" }}
              >
                <BorderedDiv>
                  <div
                    className="flexRow mediumFont"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Image
                      src="/images/bmc-icon.svg"
                      alt="icon"
                      width={18}
                      height={18}
                      style={{ width: "20%" }}
                    />
                    <div style={{ width: "80%" }}>
                      <FormattedMessage
                        id="Alcp4i"
                        defaultMessage="Buy me a coffee"
                        description="A button that will open the Buy me a coffee page."
                      />
                    </div>
                  </div>
                </BorderedDiv>
              </a>
              <a
                href={`https://github.com/ti-assistant/issues/issues`}
                style={{ width: "100%" }}
              >
                <BorderedDiv>
                  <div
                    className="flexRow mediumFont"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Image
                      src="/images/github-icon.svg"
                      alt="icon"
                      width={18}
                      height={18}
                      style={{ width: "20%" }}
                    />
                    <div style={{ width: "80%" }}>
                      <FormattedMessage
                        id="A5p5qF"
                        defaultMessage="Report Issue"
                        description="A button that will open the Github issues page."
                      />
                    </div>
                  </div>
                </BorderedDiv>
              </a>
            </LabeledDiv>
          </div>
        </div>
      </div>
      <div
        className="flexColumn"
        style={{
          position: "absolute",
          bottom: "8px",
          fontSize: "10px",
          textAlign: "center",
          gap: "4px",
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
