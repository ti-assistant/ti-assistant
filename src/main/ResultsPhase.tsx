import React, { useState } from "react";
import { GameLog } from "../GameLog";
import { responsivePixels } from "../util/util";
import { LabeledDiv } from "../LabeledDiv";

export default function ResultsPhase() {
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
