"use client";

import { useEffect } from "react";
import { StaticFactionTimer } from "../../../../../src/Timer";
import FactionCard from "../../../../../src/components/FactionCard/FactionCard";
import { useGameId } from "../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../src/context/factionDataHooks";
import { setGameId } from "../../../../../src/util/api/util";
import { rem } from "../../../../../src/util/util";
import FactionContent from "./elements/FactionContent";

export default function FactionPage({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);
  const gameId = useGameId();

  useEffect(() => {
    setGameId(gameId);
  }, [gameId]);

  if (!faction) {
    return null;
  }

  return (
    <>
      <div style={{ width: "100%", margin: rem(4) }}>
        <FactionCard
          factionId={faction.id}
          hideIcon
          style={{ width: "100%" }}
          rightLabel={
            <StaticFactionTimer
              active={false}
              factionId={factionId}
              width={80}
              style={{
                fontSize: rem(16),
              }}
            />
          }
        >
          <FactionContent factionId={factionId} />
        </FactionCard>
      </div>
    </>
  );
}
