import { useEffect, useState } from "react";
import stableHash from "stable-hash";
import { BASE_OPTIONS } from "../../server/data/options";
import { getLogEntries } from "../util/actionLog";
import { getCurrentTurnLogEntries } from "../util/api/actionLog";
import { ActionLog, Optional } from "../util/types/types";
import DataManager from "./DataManager";

export function useGameDataValue<Type>(path: string, defaultValue: Type): Type {
  const [value, setValue] = useState<Type>(
    DataManager.getValue(path) ?? defaultValue
  );

  useEffect(() => {
    setValue(DataManager.getValue(path) ?? defaultValue);
    return DataManager.subscribe(setValue, path);
  }, [path]);

  return value;
}

export function useMemoizedGameDataValue<BaseType, Type>(
  path: string,
  defaultValue: Type,
  fn: (value: BaseType) => Type
) {
  const initialValue = DataManager.getValue<BaseType>(path);
  const baseVal = initialValue ? fn(initialValue) : defaultValue;
  const [value, setValue] = useState<Type>(baseVal);

  const valueHash = stableHash(value);

  useEffect(() => {
    const newVal = DataManager.getValue<BaseType>(path);
    if (newVal) {
      const newValue = fn(newVal);
      if (valueHash !== stableHash(newValue)) {
        setValue(newValue);
      }
    }
    return DataManager.subscribe((newVal) => {
      if (!newVal) {
        return;
      }
      const newValue = fn(newVal);
      if (valueHash === stableHash(newValue)) {
        return;
      }
      setValue(newValue);
    }, path);
  }, [path, fn, valueHash]);

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

type Techs = Partial<Record<TechId, Tech>>;
export function useTechs() {
  return useGameDataValue<Techs>("techs", {});
}

type Timers = Record<string, number>;
export function useTimers() {
  return useGameDataValue<Timers>("timers", {});
}

export function useExpedition() {
  return useGameDataValue<Expedition>("expedition", {});
}
