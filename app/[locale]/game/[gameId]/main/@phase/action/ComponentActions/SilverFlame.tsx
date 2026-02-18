import {
  useCurrentTurn,
  useGameId,
} from "../../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../../src/context/factionDataHooks";
import { useObjective } from "../../../../../../../../src/context/objectiveDataHooks";
import {
  purgeSystemAsync,
  scoreObjectiveAsync,
  unpurgeSystemAsync,
  unscoreObjectiveAsync,
} from "../../../../../../../../src/dynamic/api";
import { SelectableRow } from "../../../../../../../../src/SelectableRow";
import { getLogEntries } from "../../../../../../../../src/util/actionLog";
import { getFactionSystemId } from "../../../../../../../../src/util/map";

const SilverFlame = {
  Content,
};

export default SilverFlame;

function Content({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  const gameId = useGameId();
  const silverFlame = useObjective("The Silver Flame");

  let factionHomeSystem = faction ? getFactionSystemId(faction) : undefined;

  if (!factionHomeSystem) {
    return null;
  }

  const purgedSystem = getLogEntries<PurgeSystemData>(
    currentTurn,
    "PURGE_SYSTEM",
  )[0];

  if (purgedSystem) {
    return (
      <SelectableRow
        removeItem={() => {
          unpurgeSystemAsync(gameId, factionHomeSystem);
        }}
        itemId={"The Silver Flame"}
      >
        Purged Home System
      </SelectableRow>
    );
  }

  if (silverFlame && silverFlame.scorers?.includes(factionId)) {
    return (
      <SelectableRow
        removeItem={() =>
          unscoreObjectiveAsync(gameId, factionId, "The Silver Flame")
        }
        itemId={"The Silver Flame"}
      >
        +1 VP from Silver Flame
      </SelectableRow>
    );
  }
  return (
    <div
      className="flexRow"
      style={{ width: "100%", justifyContent: "space-evenly" }}
    >
      <button
        onClick={() =>
          scoreObjectiveAsync(gameId, factionId, "The Silver Flame")
        }
      >
        Gain 1 VP
      </button>
      <button onClick={() => purgeSystemAsync(gameId, factionHomeSystem)}>
        Purge Home System
      </button>
    </div>
  );
}
