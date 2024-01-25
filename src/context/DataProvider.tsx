import { useRouter } from "next/router";
import { PropsWithChildren, useEffect, useRef } from "react";
import stableHash from "stable-hash";
import useSWR from "swr";
import { BASE_OPTIONS } from "../../server/data/options";
import { buildCompleteGameData } from "../data/GameData";
import { fetcher } from "../util/api/util";
import {
  ActionLogContext,
  AgendaContext,
  AttachmentContext,
  ComponentContext,
  FactionContext,
  ObjectiveContext,
  OptionContext,
  PlanetContext,
  RelicContext,
  StateContext,
  StrategyCardContext,
  SystemContext,
  TechContext,
} from "./Context";
import { IntlShape, useIntl } from "react-intl";

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

let getBaseAgendas: DataFunction<AgendaId, BaseAgenda> = () => {
  return {};
};
import("../../server/data/agendas").then((module) => {
  getBaseAgendas = module.getBaseAgendas;
});

let getBaseAttachments: DataFunction<AttachmentId, BaseAttachment> = () => {
  return {};
};
import("../../server/data/attachments").then((module) => {
  getBaseAttachments = module.getBaseAttachments;
});

let BASE_COMPONENTS: Partial<
  Record<ComponentId, BaseComponent | BaseTechComponent>
> = {};
import("../../server/data/components").then((module) => {
  BASE_COMPONENTS = module.BASE_COMPONENTS;
});

let getBaseObjectives: DataFunction<ObjectiveId, BaseObjective> = () => {
  return {};
};
import("../../server/data/objectives").then((module) => {
  getBaseObjectives = module.getBaseObjectives;
});

let BASE_PLANETS: Partial<Record<PlanetId, BasePlanet>> = {};
import("../../server/data/planets").then((module) => {
  BASE_PLANETS = module.BASE_PLANETS;
});

let BASE_RELICS: Partial<Record<RelicId, BaseRelic>> = {};
import("../../server/data/relics").then((module) => {
  BASE_RELICS = module.BASE_RELICS;
});

let BASE_STRATEGY_CARDS: Partial<Record<StrategyCardId, BaseStrategyCard>> = {};
import("../../server/data/strategyCards").then((module) => {
  BASE_STRATEGY_CARDS = module.BASE_STRATEGY_CARDS;
});

let BASE_SYSTEMS: Partial<Record<SystemId, BaseSystem>> = {};
import("../../server/data/systems").then((module) => {
  BASE_SYSTEMS = module.BASE_SYSTEMS;
});

let BASE_TECHS: Partial<Record<TechId, BaseTech>> = {};
import("../../server/data/techs").then((module) => {
  BASE_TECHS = module.BASE_TECHS;
});

export default function DataProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  const { data: storedGameData }: { data?: StoredGameData } = useSWR(
    gameid ? `/api/${gameid}/data` : null,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const intl = useIntl();

  const baseAgendas = getBaseAgendas(intl);
  const baseAttachments = getBaseAttachments(intl);
  const baseObjectives = getBaseObjectives(intl);

  let gameData: GameData = {
    agendas: baseAgendas,
    attachments: baseAttachments,
    components: BASE_COMPONENTS,
    factions: {},
    objectives: baseObjectives,
    options: BASE_OPTIONS,
    planets: BASE_PLANETS,
    relics: BASE_RELICS,
    state: {
      phase: "UNKNOWN",
      round: 1,
      speaker: "Vuil'raith Cabal",
    },
    strategycards: BASE_STRATEGY_CARDS,
    systems: BASE_SYSTEMS,
    techs: BASE_TECHS,
  };
  if (storedGameData) {
    gameData = buildCompleteGameData(storedGameData, intl);
  }

  const actionLog = useStableValue(gameData.actionLog ?? [], []);
  const agendas = useStableValue(gameData.agendas ?? {}, baseAgendas);
  const attachments = useStableValue(
    gameData.attachments ?? {},
    baseAttachments
  );
  const components = useStableValue(gameData.components ?? {}, BASE_COMPONENTS);
  const factions = useStableValue(gameData.factions, {});
  const objectives = useStableValue(gameData.objectives ?? {}, baseObjectives);
  const options = useStableValue(gameData.options, BASE_OPTIONS);
  const planets = useStableValue(gameData.planets ?? {}, BASE_PLANETS);
  const relics = useStableValue(gameData.relics ?? {}, BASE_RELICS);
  const state = useStableValue(gameData.state, {
    phase: "UNKNOWN",
    round: 1,
    speaker: "Vuil'raith Cabal",
  });
  const strategycards = useStableValue(
    gameData.strategycards ?? {},
    BASE_STRATEGY_CARDS
  );
  const systems = useStableValue(gameData.systems ?? {}, BASE_SYSTEMS);
  const techs = useStableValue(gameData.techs ?? {}, BASE_TECHS);

  return (
    <ActionLogContext.Provider value={actionLog}>
      <AgendaContext.Provider value={agendas}>
        <AttachmentContext.Provider value={attachments}>
          <ComponentContext.Provider value={components}>
            <FactionContext.Provider value={factions}>
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
            </FactionContext.Provider>
          </ComponentContext.Provider>
        </AttachmentContext.Provider>
      </AgendaContext.Provider>
    </ActionLogContext.Provider>
  );
}
