"use client";

import Link from "next/link";
import BorderedDiv from "../../../../src/components/BorderedDiv/BorderedDiv";
import FactionComponents from "../../../../src/components/FactionComponents/FactionComponents";
import { useGameId } from "../../../../src/context/dataHooks";
import { useFactionColor } from "../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../src/context/gameDataHooks";
import { BLACK_BORDER_GLOW } from "../../../../src/util/borderGlow";
import { rem } from "../../../../src/util/util";

export default function FactionLinks() {
  const orderedFactionIds = useOrderedFactionIds("MAP");
  return (
    <>
      {orderedFactionIds.map((factionId) => {
        return <FactionLink key={factionId} factionId={factionId} />;
      })}
    </>
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
