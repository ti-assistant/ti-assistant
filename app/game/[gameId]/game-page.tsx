"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useEffect } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Loader } from "../../../src/Loader";
import BorderedDiv from "../../../src/components/BorderedDiv/BorderedDiv";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import {
  FactionContext,
  GameIdContext,
  StateContext,
} from "../../../src/context/Context";
import { setGameId } from "../../../src/util/api/util";
import { getFactionColor, getFactionName } from "../../../src/util/factions";
import { responsivePixels } from "../../../src/util/util";

export default function SelectFactionPage() {
  const router = useRouter();
  const factions = useContext(FactionContext);
  const gameId = useContext(GameIdContext);
  const state = useContext(StateContext);

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

  const orderedFactions = Object.values(factions ?? {}).sort((a, b) => {
    if (a.order > b.order) {
      return 1;
    } else {
      return -1;
    }
  });

  // TODO: Fix height on mobile.
  return (
    <div
      className="flexColumn"
      style={{ alignItems: "center", height: "100svh" }}
    >
      <div
        className="flexColumn"
        style={{
          alignItems: "stretch",
          maxWidth: `${responsivePixels(500)}`,
          width: "100%",
        }}
      >
        <Link href={`/game/${gameId}/main`}>
          <div
            style={{
              border: `${responsivePixels(3)} solid grey`,
              borderRadius: responsivePixels(5),
              height: `10vh`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${responsivePixels(24)}`,
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
              border: `${responsivePixels(3)} solid grey`,
              borderRadius: responsivePixels(5),
              height: `8vh`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: `${responsivePixels(24)}`,
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
          return (
            <Link href={`/game/${gameId}/${faction.id}`} key={faction.id}>
              <BorderedDiv color={getFactionColor(faction)}>
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
                    fontSize: responsivePixels(20),
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
