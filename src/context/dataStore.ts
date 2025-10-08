import { buildCompleteGameData } from "../data/gameDataBuilder";
import { poster } from "../util/api/util";
import { Optional } from "../util/types/types";

type UpdateSource = "CLIENT" | "SERVER";

export namespace DataStore {
  let gameId: Optional<string>;
  let data: Optional<GameData>;

  let baseData: Optional<BaseData>;
  let storedData: Optional<StoredGameData>;
  let latestServerData: Optional<StoredGameData>;

  let lastLocalSequenceNum: number = 0;

  const listeners: Record<string, () => void> = {};

  export function init(
    seedGameId: string,
    seedData: GameData,
    seedBaseData: BaseData,
    seedStoredData: StoredGameData
  ) {
    console.log("Init called");
    gameId = seedGameId;
    data = seedData;

    baseData = seedBaseData;
    storedData = seedStoredData;
    storedData.timers = data.timers;
    latestServerData = seedStoredData;
    latestServerData.timers = data.timers;

    lastLocalSequenceNum = 0;
  }

  export function listen(callback: () => void) {
    const id = makeUniqueId(listeners, 12);

    listeners[id] = callback;

    return () => {
      delete listeners[id];
    };
  }

  export function notify() {
    for (const callback of Object.values(listeners)) {
      callback();
    }
  }

  export function reset() {
    if (!data) return;
    if (!latestServerData) return;
    if (!baseData) return;
    const viewOnly = data.viewOnly;
    storedData = structuredClone(latestServerData);
    data = buildCompleteGameData(storedData, baseData);

    data.viewOnly = viewOnly;
    data.gameId = gameId;

    lastLocalSequenceNum = storedData?.sequenceNum;

    notify();
  }

  export function getValue<Type>(path: string): Optional<Type> {
    if (!data) {
      if (path === "timers") {
        console.log("No data yet");
      }
      return;
    }
    const value = getValueAtPath<Type>(data, path);
    return value;
  }

  function getValueAtPath<Type>(currentData: GameData, path: string) {
    const pathSections = path.split(".");
    if (path === "") {
      return currentData as Type;
    }
    let dataRef: any = currentData;
    for (const section of pathSections) {
      if (!dataRef[section]) {
        return undefined;
      }
      dataRef = dataRef[section];
    }
    return dataRef as Type;
  }

  export function update(
    updateFn: (storedData: StoredGameData) => StoredGameData,
    updateSource: UpdateSource
  ) {
    if (!storedData || !data || !baseData || !latestServerData) {
      return;
    }

    if (updateSource === "SERVER") {
      console.log("Server update");
      latestServerData = structuredClone(updateFn(latestServerData));

      // If we are ahead of the server, don't update.
      if (lastLocalSequenceNum > latestServerData.sequenceNum) {
        return;
      }

      storedData = structuredClone(updateFn(storedData));
      const viewOnly = data.viewOnly;
      data = buildCompleteGameData(storedData, baseData);
      data.gameId = gameId;
      data.viewOnly = viewOnly;
    } else {
      console.log("Client update");
      storedData = structuredClone(updateFn(storedData));

      const viewOnly = data.viewOnly;
      data = buildCompleteGameData(storedData, baseData);
      data.gameId = gameId;
      data.viewOnly = viewOnly;

      lastLocalSequenceNum = storedData.sequenceNum;
    }

    notify();
  }

  export function setViewOnly(viewOnly: boolean) {
    if (!data) {
      return;
    }
    data.viewOnly = viewOnly;
    notify();
  }

  export function saveTimers() {
    if (!data || !data.timers) {
      return;
    }
    const timerUpdateData: TimerUpdateData = {
      timers: data.timers,
    };

    const now = Date.now();
    poster(`/api/${gameId}/timerUpdate`, timerUpdateData, now);
  }
}

// TODO: Move to shared location.
function makeId(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function makeUniqueId(record: Record<string, any>, length: number) {
  let id = makeId(length);
  while (!!record[id]) {
    id = makeId(length);
  }
  return id;
}
