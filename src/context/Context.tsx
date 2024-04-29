import { createContext } from "react";
import { BASE_OPTIONS } from "../../server/data/options";

export const ActionLogContext = createContext<ActionLogEntry[]>([]);
export const AgendaContext = createContext<Partial<Record<AgendaId, Agenda>>>(
  {}
);
export const AttachmentContext = createContext<
  Partial<Record<AttachmentId, Attachment>>
>({});
export const ComponentContext = createContext<Record<string, Component>>({});
export const FactionContext = createContext<
  Partial<Record<FactionId, Faction>>
>({});
export const GameIdContext = createContext<string>("");
export const LeaderContext = createContext<Partial<Record<LeaderId, Leader>>>(
  {}
);
export const ObjectiveContext = createContext<
  Partial<Record<ObjectiveId, Objective>>
>({});
export const OptionContext = createContext<Options>(BASE_OPTIONS);
export const PlanetContext = createContext<Partial<Record<PlanetId, Planet>>>(
  {}
);
export const RelicContext = createContext<Partial<Record<RelicId, Relic>>>({});
export const StateContext = createContext<GameState>({
  phase: "UNKNOWN",
  round: 1,
  speaker: "Vuil'raith Cabal",
});
export const StrategyCardContext = createContext<
  Partial<Record<StrategyCardId, StrategyCard>>
>({});
export const SystemContext = createContext<Partial<Record<SystemId, System>>>(
  {}
);
export const TechContext = createContext<Partial<Record<TechId, Tech>>>({});
