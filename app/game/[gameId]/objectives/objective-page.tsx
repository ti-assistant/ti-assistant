"use client";

import { useEffect } from "react";
import ObjectivePanel from "../../../../src/components/ObjectivePanel/ObjectivePanel";
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
      style={{ height: "100%", alignItems: "center" }}
    >
      {/* <Updater /> */}
      <div
        style={{
          position: "relative",
          margin: `${rem(64)} 0 0 0`,
          padding: `0 0 ${rem(24)} 0`,
          height: `calc(100dvh - ${rem(64)})`,
        }}
      >
        <ObjectivePanel />
      </div>
    </div>
  );
}
