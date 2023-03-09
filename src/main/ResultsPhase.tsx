import { useRouter } from "next/router";
import useSWR from "swr";
import React from "react";
import { fetcher } from "../util/api/util";
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
    </React.Fragment>
  );
}
