import dynamic from "next/dynamic";
import React, { useState } from "react";
import { Loader } from "../Loader";
import LabeledDiv from "../components/LabeledDiv/LabeledDiv";
import { responsivePixels } from "../util/util";
import { useRouter } from "next/router";
import BorderedDiv from "../components/BorderedDiv/BorderedDiv";

const GameLog = dynamic(
  import("../GameLog").then((mod) => mod.GameLog),
  {
    loading: () => <Loader />,
  }
);

export default function ResultsPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
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
          href={`/api/${gameid}/download`}
          download={`${gameid}_data`}
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
