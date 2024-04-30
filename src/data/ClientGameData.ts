"use client";

import { useIntl } from "react-intl";
import stableHash from "stable-hash";
import useSWR from "swr";
import { getBaseAgendas } from "../../server/data/agendas";
import { getBaseAttachments } from "../../server/data/attachments";
import { getBaseComponents } from "../../server/data/components";
import { getBaseLeaders } from "../../server/data/leaders";
import { getBaseObjectives } from "../../server/data/objectives";
import { BASE_OPTIONS } from "../../server/data/options";
import { BASE_PLANETS } from "../../server/data/planets";
import { getBaseRelics } from "../../server/data/relics";
import { getBaseStrategyCards } from "../../server/data/strategyCards";
import { BASE_SYSTEMS } from "../../server/data/systems";
import { getBaseTechs } from "../../server/data/techs";
import { fetcher } from "../util/api/util";
import { buildCompleteGameData } from "./GameData";

export function useGameData(
  gameid: string | undefined,
  paths: string[]
): GameData {
  const { data: storedGameData }: { data?: StoredGameData } = useSWR(
    gameid ? `/api/${gameid}/data` : null,
    () => fetcher(`/api/${gameid}/data`),
    {
      compare: (a?: StoredGameData, b?: StoredGameData) => {
        if (paths && paths.length > 0 && a && b) {
          for (const path of paths) {
            if (stableHash(a[path]) !== stableHash(b[path])) {
              return false;
            }
          }
          return true;
        }
        return stableHash(a) === stableHash(b);
      },
      revalidateIfStale: false,
    }
  );

  const intl = useIntl();

  if (!storedGameData) {
    return {
      agendas: getBaseAgendas(intl),
      attachments: getBaseAttachments(intl),
      components: getBaseComponents(intl),
      factions: {},
      leaders: getBaseLeaders(intl),
      objectives: getBaseObjectives(intl),
      options: BASE_OPTIONS,
      planets: BASE_PLANETS,
      relics: getBaseRelics(intl),
      state: {
        phase: "UNKNOWN",
        round: 1,
        speaker: "Vuil'raith Cabal",
      },
      strategycards: getBaseStrategyCards(intl),
      systems: BASE_SYSTEMS,
      techs: getBaseTechs(intl),
    };
  }
  return buildCompleteGameData(storedGameData, intl);
}
