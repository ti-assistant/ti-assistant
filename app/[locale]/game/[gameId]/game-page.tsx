"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { FormattedMessage } from "react-intl";
import BorderedDiv from "../../../../src/components/BorderedDiv/BorderedDiv";
import Conditional from "../../../../src/components/Conditional/Conditional";
import FactionComponents from "../../../../src/components/FactionComponents/FactionComponents";
import { useGameId, useViewOnly } from "../../../../src/context/dataHooks";
import { useFactionColor } from "../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../src/context/gameDataHooks";
import { usePhase } from "../../../../src/context/stateDataHooks";
import { enterPassword } from "../../../../src/util/api/enterPassword";
import { setGameId } from "../../../../src/util/api/util";
import { BLACK_BORDER_GLOW } from "../../../../src/util/borderGlow";
import { rem } from "../../../../src/util/util";
import styles from "./game-page.module.scss";

export default function SelectFactionPage() {
  const router = useRouter();
  const orderedFactionIds = useOrderedFactionIds("MAP");
  const gameId = useGameId();
  const phase = usePhase();
  const viewOnly = useViewOnly();

  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  if (phase !== "UNKNOWN" && orderedFactionIds.length === 0) {
    setGameId("");
    router.push("/");
    return null;
  }

  // TODO: Fix height on mobile.
  return (
    <div className={styles.GamePage}>
      {viewOnly ? (
        <div className={styles.ControlButtons}>
          <div className="flexRow">
            <input
              ref={passwordRef}
              type="textbox"
              placeholder="Enter Password"
            ></input>
            <button
              onClick={() => {
                const password = passwordRef.current?.value;
                if (!password) {
                  return;
                }
                enterPassword(gameId, password);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      ) : null}
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
        <Conditional appSection="OBJECTIVES">
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
        </Conditional>
        {orderedFactionIds.map((factionId) => {
          return <FactionLink key={factionId} factionId={factionId} />;
        })}
      </div>
    </div>
  );
}

function FactionLink({ factionId }: { factionId: FactionId }) {
  const gameId = useGameId();
  const factionColor = useFactionColor(factionId);

  return (
    <Link href={`/game/${gameId}/${factionId}`}>
      <BorderedDiv
        color={factionColor}
        style={{
          boxShadow: factionColor === "Black" ? BLACK_BORDER_GLOW : undefined,
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
          <FactionComponents.Icon factionId={factionId} size="100%" />
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
          {<FactionComponents.Name factionId={factionId} />}
        </div>
      </BorderedDiv>
    </Link>
  );
}
