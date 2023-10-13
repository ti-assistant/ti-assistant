import { mutate } from "swr";
import { poster } from "./util";
import { EndTurnHandler } from "../model/endTurn";
import { BASE_GAME_DATA } from "../../../server/data/data";
import { updateGameData } from "./handler";
import { updateActionLog } from "./update";
import { getCurrentTurnLogEntries } from "./actionLog";

export function endTurn(gameId: string, samePlayer?: boolean) {
  const data: GameUpdateData = {
    action: "END_TURN",
    event: {
      samePlayer,
    },
  };

  mutate(
    `/api/${gameId}/data`,
    async () => await poster(`/api/${gameId}/dataUpdate`, data),
    {
      optimisticData: (currentData?: StoredGameData) => {
        if (!currentData) {
          return BASE_GAME_DATA;
        }
        const selectedAction = getSelectedAction(currentData);
        data.event.prevFaction = currentData.state.activeplayer;
        if (!selectedAction) {
          return currentData;
        }
        data.event.selectedAction = selectedAction;
        const secondaries: Record<string, Secondary> = {};
        for (const faction of Object.values(currentData.factions)) {
          secondaries[faction.name] = faction.secondary ?? "PENDING";
        }
        data.event.secondaries = secondaries;

        const handler = new EndTurnHandler(currentData, data);

        if (!handler.validate()) {
          return currentData;
        }

        updateGameData(currentData, handler.getUpdates());

        updateActionLog(currentData, handler);

        return structuredClone(currentData);
      },
      revalidate: false,
    }
  );
}

function isSelectActionData(data: GameUpdateData): data is SelectActionData {
  return data.action === "SELECT_ACTION";
}

function getSelectedAction(gameData: StoredGameData) {
  const currentTurn = getCurrentTurnLogEntries(gameData.actionLog ?? []);

  const entry = getLogEntry(currentTurn, "SELECT_ACTION");

  if (!entry || !isSelectActionData(entry.data)) {
    return undefined;
  }

  return entry.data.event.action;
}

function getLogEntry(actionLog: ActionLogEntry[], action: string) {
  for (const logEntry of actionLog) {
    if (logEntry.data.action === action) {
      return logEntry;
    }
  }
  return null;
}
