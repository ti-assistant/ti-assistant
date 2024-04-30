"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import stableHash from "stable-hash";
import useSWR from "swr";
import { fetcher } from "../util/api/util";
import {
  ActionLogContext,
  AgendaContext,
  AttachmentContext,
  ComponentContext,
  FactionContext,
  GameIdContext,
  LeaderContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  RelicContext,
  StateContext,
  StrategyCardContext,
  SystemContext,
  TechContext,
} from "./Context";
import { buildCompleteGameData } from "../data/gameDataBuilder";

function useStableValue<Type>(value: Type, defaultValue: Type): Type {
  const prevValue = useRef<Type>(defaultValue);

  useEffect(() => {
    if (stableHash(prevValue.current) !== stableHash(value)) {
      prevValue.current = value;
    }
  }, [value]);

  if (stableHash(prevValue.current) === stableHash(value)) {
    return prevValue.current;
  }

  return value;
}

export default function DataProvider({
  children,
  gameId,
  baseData,
  seedData,
}: PropsWithChildren<{
  gameId: string;
  baseData: BaseData;
  seedData: GameData;
}>) {
  const { data: storedGameData }: { data?: StoredGameData } = useSWR(
    gameId ? `/api/${gameId}/data` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  let gameData = seedData;
  if (storedGameData) {
    gameData = buildCompleteGameData(storedGameData, baseData);
  }

  const actionLog = useStableValue(
    gameData.actionLog ?? [],
    seedData.actionLog ?? []
  );
  const agendas = useStableValue(
    gameData.agendas ?? {},
    seedData.agendas ?? {}
  );
  const attachments = useStableValue(
    gameData.attachments ?? {},
    seedData.attachments ?? {}
  );
  const components = useStableValue(
    gameData.components ?? {},
    seedData.components ?? {}
  );
  const factions = useStableValue(gameData.factions, {});
  const leaders = useStableValue(gameData.leaders, {});
  const objectives = useStableValue(
    gameData.objectives ?? {},
    seedData.objectives ?? {}
  );
  const options = useStableValue(gameData.options, seedData.options);
  const planets = useStableValue(
    gameData.planets ?? {},
    seedData.planets ?? {}
  );
  const relics = useStableValue(gameData.relics ?? {}, seedData.relics ?? {});
  const state = useStableValue(gameData.state, seedData.state);
  const strategycards = useStableValue(
    gameData.strategycards ?? {},
    seedData.strategycards ?? {}
  );
  const systems = useStableValue(
    gameData.systems ?? {},
    seedData.systems ?? {}
  );
  const techs = useStableValue(gameData.techs ?? {}, seedData.techs ?? {});

  return (
    <ActionLogContext.Provider value={actionLog}>
      <AgendaContext.Provider value={agendas}>
        <AttachmentContext.Provider value={attachments}>
          <ComponentContext.Provider value={components}>
            <FactionContext.Provider value={factions}>
              <GameIdContext.Provider value={gameId}>
                <LeaderContext.Provider value={leaders}>
                  <ObjectiveContext.Provider value={objectives}>
                    <OptionContext.Provider value={options}>
                      <PlanetContext.Provider value={planets}>
                        <RelicContext.Provider value={relics}>
                          <StateContext.Provider value={state}>
                            <StrategyCardContext.Provider value={strategycards}>
                              <SystemContext.Provider value={systems}>
                                <TechContext.Provider value={techs}>
                                  {children}
                                </TechContext.Provider>
                              </SystemContext.Provider>
                            </StrategyCardContext.Provider>
                          </StateContext.Provider>
                        </RelicContext.Provider>
                      </PlanetContext.Provider>
                    </OptionContext.Provider>
                  </ObjectiveContext.Provider>
                </LeaderContext.Provider>
              </GameIdContext.Provider>
            </FactionContext.Provider>
          </ComponentContext.Provider>
        </AttachmentContext.Provider>
      </AgendaContext.Provider>
    </ActionLogContext.Provider>
  );
}
