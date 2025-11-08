import { use, useEffect, useState } from "react";
import stableHash from "stable-hash";
import { BASE_OPTIONS } from "../../server/data/options";
import { getLogEntries, isPrimaryComplete } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { ActionLog, Optional } from "../util/types/types";
import { DataContext } from "./contexts";
import { DataStore } from "./dataStore";

export function useGameDataValue<Type>(path: string, defaultValue: Type): Type {
  const [value, setValue] = useState<Type>(
    DataStore.getValue(path) ?? defaultValue
  );
  const subscribe = use(DataContext);

  useEffect(() => {
    setValue(DataStore.getValue(path) ?? defaultValue);
    return subscribe((data) => {
      setValue(data ?? defaultValue);
    }, path);
  }, [path, subscribe]);

  return value;
}

export function useMemoizedGameDataValue<BaseType, Type>(
  path: string,
  defaultValue: Type,
  fn: (value: BaseType) => Type
) {
  const initialValue = DataStore.getValue<BaseType>(path);
  const baseVal = initialValue ? fn(initialValue) : defaultValue;
  const [value, setValue] = useState<Type>(baseVal);
  const subscribe = use(DataContext);

  let valueHash = stableHash(value);
  if (value instanceof Set) {
    valueHash = stableHash(Array.from(value));
  }

  useEffect(() => {
    const newVal = DataStore.getValue<BaseType>(path);
    if (newVal) {
      const newValue = fn(newVal);
      let newHash = stableHash(newValue);
      if (newValue instanceof Set) {
        newHash = stableHash(Array.from(newValue));
      }
      if (valueHash !== newHash) {
        setValue(newValue);
      }
    }
    return subscribe((newVal) => {
      if (!newVal) {
        return;
      }
      const newValue = fn(newVal);
      let newHash = stableHash(newValue);
      if (newValue instanceof Set) {
        newHash = stableHash(Array.from(newValue));
      }
      if (valueHash === newHash) {
        return;
      }
      setValue(newValue);
    }, path);
  }, [path, fn, valueHash, subscribe]);

  return value;
}

export function useGameId() {
  return useGameDataValue<string>("gameId", "");
}

export function useViewOnly() {
  return useGameDataValue<boolean>("viewOnly", false);
}

export function useActionLog() {
  return useGameDataValue<ActionLog>("actionLog", []);
}
export function useCurrentTurn() {
  return useMemoizedGameDataValue<ActionLog, ActionLog>(
    "actionLog",
    [],
    (log) => getCurrentTurnLogEntries(log)
  );
}
export function usePrimaryCompleted() {
  return useMemoizedGameDataValue<ActionLog, boolean>(
    "actionLog",
    false,
    (log) => isPrimaryComplete(getCurrentTurnLogEntries(log))
  );
}
export function useLogEntries<DataType extends GameUpdateData>(
  type: DataType["action"],
  filters?: (type: ActionLogEntry<DataType>) => boolean
) {
  return useMemoizedGameDataValue<ActionLog, ActionLogEntry<DataType>[]>(
    "actionLog",
    [],
    (log) => {
      const currentTurn = getCurrentTurnLogEntries(log);
      const entries = getLogEntries<DataType>(currentTurn, type);
      if (filters) {
        return entries.filter(filters);
      }
      return entries;
    }
  );
}

export function useActionCards() {
  return useGameDataValue<ActionCards>("actionCards", {});
}
export function useActionCard(actionCardId: ActionCardId) {
  return useGameDataValue<Optional<ActionCard>>(
    `actionCards.${actionCardId}`,
    undefined
  );
}

type Agendas = Partial<Record<AgendaId, Agenda>>;
export function useAgendas() {
  return useGameDataValue<Agendas>("agendas", {});
}
export function useAgenda(agendaId: AgendaId) {
  return useGameDataValue<Optional<Agenda>>(`agendas.${agendaId}`, undefined);
}

type Attachments = Partial<Record<AttachmentId, Attachment>>;
export function useAttachments() {
  return useGameDataValue<Attachments>("attachments", {});
}

type Components = Record<string, Component>;
export function useComponents() {
  return useGameDataValue<Components>("components", {});
}

type Leaders = Partial<Record<LeaderId, Leader>>;
export function useLeaders() {
  return useGameDataValue<Leaders>("leaders", {});
}
export function useLeader(leaderId: LeaderId) {
  return useGameDataValue<Optional<Leader>>(`leaders.${leaderId}`, undefined);
}

export function useOptions() {
  return useGameDataValue<Options>("options", BASE_OPTIONS);
}

type Planets = Partial<Record<PlanetId, Planet>>;
export function usePlanets() {
  return useGameDataValue<Planets>("planets", {});
}
export function usePlanet(planetId: PlanetId) {
  return useGameDataValue<Optional<Planet>>(`planets.${planetId}`, undefined);
}

// Includes purged planets.
export function useAllPlanets() {
  return useGameDataValue<Planets>("allPlanets", {});
}

type Relics = Partial<Record<RelicId, Relic>>;
export function useRelics() {
  return useGameDataValue<Relics>("relics", {});
}
export function useRelic(relicId: RelicId) {
  return useGameDataValue<Optional<Relic>>(`relics.${relicId}`, undefined);
}

type StrategyCards = Partial<Record<StrategyCardId, StrategyCard>>;
export function useStrategyCards() {
  return useGameDataValue<StrategyCards>("strategycards", {});
}

type Systems = Partial<Record<SystemId, System>>;
export function useSystems() {
  return useGameDataValue<Systems>("systems", {});
}
export function useSystem(systemId: SystemId) {
  return useGameDataValue<Optional<System>>(`systems.${systemId}`, undefined);
}

type Techs = Partial<Record<TechId, Tech>>;
export function useTechs() {
  return useGameDataValue<Techs>("techs", {});
}

export function useTech(techId: TechId) {
  return useGameDataValue<Optional<Tech>>(`techs.${techId}`, undefined);
}

export function useTimers() {
  return useGameDataValue<Timers>("timers", {});
}

export function useExpedition() {
  return useGameDataValue<Expedition>("expedition", {});
}
