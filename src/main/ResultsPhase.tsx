import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Loader } from "../Loader";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import { responsivePixels } from "../util/util";

const GameLog = dynamic(
  import("../GameLog").then((mod) => mod.GameLog),
  {
    loading: () => <Loader />,
  }
);

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
