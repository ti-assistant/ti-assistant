import React, { useContext, useState } from "react";
import BorderedDiv from "../components/BorderedDiv/BorderedDiv";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import { GameIdContext } from "../context/Context";
import { responsivePixels } from "../util/util";
import { GameLog } from "../GameLog";

export default function ResultsPhase() {
  const gameId = useContext(GameIdContext);
  const [viewing, setViewing] = useState("Game Log");

  return (
    <React.Fragment>
      <div className="flexColumn" style={{ height: "100svh", width: "25%" }}>
        <LabeledDiv label="View">
          <button
            className={viewing === "Game Log" ? "selected" : ""}
            onClick={() => setViewing("Game Log")}
          >
            Game Log
          </button>
        </LabeledDiv>
        <a
          href={`/api/${gameId}/download`}
          download={`${gameId}_data`}
          style={{ textAlign: "center" }}
        >
          <BorderedDiv>Download Game Data</BorderedDiv>
        </a>
      </div>
      <div style={{ marginTop: responsivePixels(144), width: "100%" }}>
        {viewing === "Game Log" ? (
          <LabeledDiv label="Game Log (Beta)">
            <GameLog />
          </LabeledDiv>
        ) : null}
      </div>
    </React.Fragment>
  );
}
