import { useCurrentTurn } from "../../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../../src/context/factionDataHooks";
import { useObjective } from "../../../../../../../../src/context/objectiveDataHooks";
import { SelectableRow } from "../../../../../../../../src/SelectableRow";
import { getLogEntries } from "../../../../../../../../src/util/actionLog";
import { useDataUpdate } from "../../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../../src/util/api/events";
import { getFactionSystemId } from "../../../../../../../../src/util/map";

const SilverFlame = {
  Content,
};

export default SilverFlame;

function Content({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const faction = useFaction(factionId);
  const dataUpdate = useDataUpdate();
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
          dataUpdate(Events.UnpurgeSystemEvent(factionHomeSystem));
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
          dataUpdate(
            Events.UnscoreObjectiveEvent(factionId, "The Silver Flame"),
          )
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
          dataUpdate(Events.ScoreObjectiveEvent(factionId, "The Silver Flame"))
        }
      >
        Gain 1 VP
      </button>
      <button
        onClick={() => dataUpdate(Events.PurgeSystemEvent(factionHomeSystem))}
      >
        Purge Home System
      </button>
    </div>
  );
}
