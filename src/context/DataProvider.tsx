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

let getBaseComponents: DataFunction<
  ComponentId,
  BaseComponent | BaseTechComponent
> = () => {
  return {};
};
import("../../server/data/components").then((module) => {
  getBaseComponents = module.getBaseComponents;
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

let getBaseRelics: DataFunction<RelicId, BaseRelic> = () => {
  return {};
};
import("../../server/data/relics").then((module) => {
  getBaseRelics = module.getBaseRelics;
});

let getBaseStrategyCards: DataFunction<
  StrategyCardId,
  BaseStrategyCard
> = () => {
  return {};
};
import("../../server/data/strategyCards").then((module) => {
  getBaseStrategyCards = module.getBaseStrategyCards;
});

let BASE_SYSTEMS: Partial<Record<SystemId, BaseSystem>> = {};
import("../../server/data/systems").then((module) => {
  BASE_SYSTEMS = module.BASE_SYSTEMS;
});

let getBaseTechs: DataFunction<TechId, BaseTech> = () => {
  return {};
};
import("../../server/data/techs").then((module) => {
  getBaseTechs = module.getBaseTechs;
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
  const baseComponents = getBaseComponents(intl);
  const baseObjectives = getBaseObjectives(intl);
  const baseRelics = getBaseRelics(intl);
  const baseStrategyCards = getBaseStrategyCards(intl);
  const baseTechs = getBaseTechs(intl);

  let gameData: GameData = {
    agendas: baseAgendas,
    attachments: baseAttachments,
    components: baseComponents,
    factions: {},
    objectives: baseObjectives,
    options: BASE_OPTIONS,
    planets: BASE_PLANETS,
    relics: baseRelics,
    state: {
      phase: "UNKNOWN",
      round: 1,
      speaker: "Vuil'raith Cabal",
    },
    strategycards: baseStrategyCards,
    systems: BASE_SYSTEMS,
    techs: baseTechs,
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
  const components = useStableValue(gameData.components ?? {}, baseComponents);
  const factions = useStableValue(gameData.factions, {});
  const objectives = useStableValue(gameData.objectives ?? {}, baseObjectives);
  const options = useStableValue(gameData.options, BASE_OPTIONS);
  const planets = useStableValue(gameData.planets ?? {}, BASE_PLANETS);
  const relics = useStableValue(gameData.relics ?? {}, baseRelics);
  const state = useStableValue(gameData.state, {
    phase: "UNKNOWN",
    round: 1,
    speaker: "Vuil'raith Cabal",
  });
  const strategycards = useStableValue(
    gameData.strategycards ?? {},
    baseStrategyCards
  );
  const systems = useStableValue(gameData.systems ?? {}, BASE_SYSTEMS);
  const techs = useStableValue(gameData.techs ?? {}, baseTechs);

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
