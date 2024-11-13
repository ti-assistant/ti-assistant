"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FormattedMessage } from "react-intl";
import BorderedDiv from "../../../src/components/BorderedDiv/BorderedDiv";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import {
  useFactions,
  useGameId,
  useGameState,
} from "../../../src/context/dataHooks";
import { setGameId } from "../../../src/util/api/util";
import { BLACK_BORDER_GLOW } from "../../../src/util/borderGlow";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { rem } from "../../../src/util/util";
import styles from "./game-page.module.scss";

export default function SelectFactionPage() {
  const router = useRouter();
  const factions = useFactions();
  const gameId = useGameId();
  const state = useGameState();

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  if (state.phase !== "UNKNOWN" && Object.keys(factions).length === 0) {
    console.log("Forcing redirect!");
    setGameId("");
    router.push("/");
    return null;
  }

  const orderedFactions = Object.values(factions).sort(
    (a, b) => a.mapPosition - b.mapPosition
  );

  // TODO: Fix height on mobile.
  return (
    <div className={styles.GamePage}>
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          maxWidth: rem(500),
          width: "100%",
        }}
      >
        <Link href={`/game/${gameId}/main`}>
          <div
            style={{
              border: `${"3px"} solid grey`,
              borderRadius: rem(5),
              height: `10vh`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: rem(24),
              cursor: "pointer",
            }}
          >
            <FormattedMessage
              id="yBACfb"
              description="Text on a button that opens the main screen of the assistant."
              defaultMessage="Main Screen"
            />
          </div>
        </Link>
        <Link href={`/game/${gameId}/objectives`}>
          <div
            style={{
              border: `${"3px"} solid grey`,
              borderRadius: rem(5),
              height: `8vh`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: rem(24),
              cursor: "pointer",
            }}
          >
            <FormattedMessage
              id="9m91nk"
              description="Text on a button that opens the objective view of the assistant."
              defaultMessage="Objective View"
            />
          </div>
        </Link>
        {orderedFactions.map((faction) => {
          const factionColor = getFactionColor(faction);
          return (
            <Link href={`/game/${gameId}/${faction.id}`} key={faction.id}>
              <BorderedDiv
                color={factionColor}
                style={{
                  boxShadow:
                    factionColor === "Black" ? BLACK_BORDER_GLOW : undefined,
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    opacity: "40%",
                    position: "absolute",
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 0,
                  }}
                >
                  <FactionIcon factionId={faction.id} size="100%" />
                </div>
                <div
                  className="flexColumn"
                  style={{
                    height: "5vh",
                    fontSize: rem(20),
                    width: "100%",
                    zIndex: 0,
                  }}
                >
                  {getFactionName(faction)}
                </div>
              </BorderedDiv>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
