import useSWR from "swr";
import { fetcher } from "../util/api/util";

export function useTimers(gameid: string | undefined): Record<string, number> {
  const { data: timers }: { data?: Record<string, number> } = useSWR(
    gameid ? `/api/${gameid}/timers` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  if (!timers) {
    return {};
  }

  return timers;
}
