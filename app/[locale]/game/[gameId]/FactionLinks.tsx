"use client";

import Link from "next/link";
import { CSSProperties } from "react";
import FactionComponents from "../../../../src/components/FactionComponents/FactionComponents";
import { useGameId } from "../../../../src/context/dataHooks";
import { useFactionColors } from "../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../src/context/gameDataHooks";
import { rem } from "../../../../src/util/util";

export default function FactionLinks() {
  const orderedFactionIds = useOrderedFactionIds("MAP");
  return (
    <div className="flexColumn" style={{ alignItems: "stretch" }}>
      {orderedFactionIds.map((factionId) => {
        return <FactionLink key={factionId} factionId={factionId} />;
      })}
    </div>
  );
}

function FactionLink({ factionId }: { factionId: FactionId }) {
  const gameId = useGameId();
  const colors = useFactionColors(factionId);

  return (
    <Link
      className="outline"
      href={`/game/${gameId}/${factionId}`}
      style={
        {
          "--border-color": colors.border,
          "--hover-color": colors.color,
          position: "relative",
        } as CSSProperties
      }
    >
      <div
        className="flexRow"
        style={{
          height: "5vh",
          fontSize: rem(20),
          width: "100%",
        }}
      >
        <FactionComponents.Icon factionId={factionId} size={28} />
        <div style={{ marginInline: "auto" }}>
          <FactionComponents.Name factionId={factionId} />
        </div>
        <FactionComponents.Icon factionId={factionId} size={28} />
      </div>
    </Link>
  );
}
