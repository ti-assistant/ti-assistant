"use client";

import { useEffect } from "react";
import FancyFactionDiv from "../../../../../../src/components/FactionCard/FactionCard";
import { useGameId } from "../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../src/context/factionDataHooks";
import { StaticFactionTimer } from "../../../../../../src/Timer";
import { setGameId } from "../../../../../../src/util/api/util";
import { rem } from "../../../../../../src/util/util";
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
        <FancyFactionDiv
          factionId={faction.id}
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
        </FancyFactionDiv>
      </div>
    </>
  );
}
