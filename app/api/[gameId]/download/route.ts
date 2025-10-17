import {
  getFullActionLog,
  getGameData,
  getTimers,
} from "../../../../server/util/fetch";
import { ActionLog } from "../../../../src/util/types/types";

function buildSetupGameData(gameData: StoredGameData): {
  factions: SetupFaction[];
  speaker: number;
  options: Options;
} {
  const actionLog: ActionLog = gameData.actionLog ?? [];
  let speaker = 0;
  for (let i = actionLog.length - 1; i >= 0; i--) {
    const entry = actionLog[i];
    if (entry?.data.action === "ASSIGN_STRATEGY_CARD") {
      const initialSpeaker = gameData.factions[entry.data.event.pickedBy];
      if (initialSpeaker) {
        speaker = initialSpeaker.mapPosition;
        break;
      }
    }
  }

  const factions: SetupFaction[] = [];
  for (const faction of Object.values(gameData.factions)) {
    factions[faction.mapPosition] = {
      color: faction.color,
      id: faction.id,
      playerName: faction.playerName,
    };
  }

  return {
    factions: factions,
    speaker: speaker,
    options: gameData.options,
  };
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;

  const fullActionLog = await getFullActionLog(gameId);

  const storedGameData = await getGameData(gameId);

  storedGameData.actionLog = fullActionLog;

  const setupData = buildSetupGameData(storedGameData);

  const storedTimers = await getTimers(gameId);

  return new Response(
    JSON.stringify({
      data: setupData,
      timers: storedTimers,
      actionLog: fullActionLog,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
