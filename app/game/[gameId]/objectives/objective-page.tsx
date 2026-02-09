"use client";

import { useEffect } from "react";
import ObjectivePanel from "../../../../src/components/ObjectiveModal/ObjectivePanel";
import { useGameId } from "../../../../src/context/dataHooks";
import { setGameId } from "../../../../src/util/api/util";
import { rem } from "../../../../src/util/util";

export default function ObjectivesPage() {
  return <InnerObjectivesPage />;
}

function InnerObjectivesPage() {
  const gameId = useGameId();

  useEffect(() => {
    if (!!gameId) {
      setGameId(gameId);
    }
  }, [gameId]);

  return (
    <div
      className="flexColumn"
      style={{ height: "100%", alignItems: "flex-start", width: "100%" }}
    >
      <div
        style={{
          position: "relative",
          padding: `0 0 ${rem(24)} 0`,
          height: `calc(100dvh - 4rem})`,
          width: "100%",
        }}
      >
        <ObjectivePanel />
      </div>
    </div>
  );
}
