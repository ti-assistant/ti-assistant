"use client";

import { useEffect, useRef } from "react";
import useSWR from "swr";
import { fetcher } from "./api/util";

export function useIsGameDataValidating(gameid: string | undefined) {
  const { isValidating }: { isValidating?: boolean } = useSWR(
    gameid ? `/api/${gameid}/data` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  return isValidating;
}

export function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef<() => void>(() => {});

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
