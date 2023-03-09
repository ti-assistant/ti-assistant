import { useRouter } from "next/router";
import useSWR from "swr";
import React from "react";
import { fetcher } from "../util/api/util";
import SummaryColumn from "./SummaryColumn";
import { responsivePixels } from "../util/util";
import { GameState } from "../util/api/state";

export default function ResultsPhase() {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const { data: state }: { data?: GameState } = useSWR(
    gameid ? `/api/${gameid}/state` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  return (
    <React.Fragment>
      <div className="flexColumn" style={{ height: "100svh" }}>
        Game Log
      </div>
      <div className="flexColumn" style={{ height: "100svh" }}>
        Game Over
      </div>

      {/* <div
        className="flexRow"
        style={{
          gap: responsivePixels(20),
          height: "100svh",
          width: "100%",
          alignItems: "flex-start",
          justifyContent: "center",
        }}
      >
        <div
          className="flexColumn"
          style={{
            height: "100svh",
            flexShrink: 0,
            width: responsivePixels(280),
          }}
        >
          <SummaryColumn
            order="VICTORY_POINTS"
            subOrder={
              state?.finalPhase === "ACTION" || state?.finalPhase === "STATUS"
                ? "INITIATIVE"
                : "SPEAKER"
            }
          />
        </div>
      </div> */}
    </React.Fragment>
  );
}
