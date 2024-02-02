"use client";

import { useContext, useEffect } from "react";
import { useIntl } from "react-intl";
import { ObjectivePanel } from "../../../../src/components/ObjectivePanel";
import Updater from "../../../../src/components/Updater/Updater";
import { setGameId } from "../../../../src/util/api/util";
import { responsivePixels } from "../../../../src/util/util";
import { GameIdContext } from "../../../../src/context/Context";

export default function ObjectivesPage() {
  return <InnerObjectivesPage />;
}

function InnerObjectivesPage() {
  const gameId = useContext(GameIdContext);
  const intl = useIntl();

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
      <Updater />
      <div
        style={{
          position: "relative",
          margin: `${responsivePixels(64)} 0 0 0`,
          padding: `0 0 ${responsivePixels(24)} 0`,
          height: `calc(100dvh - ${responsivePixels(64)})`,
        }}
      >
        <ObjectivePanel />
      </div>
    </div>
  );
}
