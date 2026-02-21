import { useOptions, useViewOnly } from "../../../context/dataHooks";
import { useFactionColors } from "../../../context/factionDataHooks";
import { useObjective } from "../../../context/objectiveDataHooks";
import InfoModal from "../../../InfoModal";
import { useDataUpdate } from "../../../util/api/dataUpdate";
import { Events } from "../../../util/api/events";
import { rem } from "../../../util/util";
import FactionSelectRadialMenu from "../../FactionSelectRadialMenu/FactionSelectRadialMenu";

function getNumPotentialScorers(objective: Objective, options: Options) {
  const includesPoK = options.expansions.includes("POK");
  const includesTE = options.expansions.includes("THUNDERS EDGE");
  switch (objective.id) {
    case "Imperial Rider":
      return includesTE ? 4 : includesPoK ? 2 : 1;
    case "Shard of the Throne":
    case "The Crown of Emphidia":
    case "Holy Planet of Ixth":
      return includesPoK ? 1 : 2;
  }
  return 1;
}

export default function SimpleScorable({
  objectiveId,
  orderedFactionIds,
  info,
}: {
  objectiveId: ObjectiveId;
  orderedFactionIds: FactionId[];
  info?: string;
}) {
  const dataUpdate = useDataUpdate();
  const factionColors = useFactionColors();
  const objective = useObjective(objectiveId);
  const options = useOptions();
  const viewOnly = useViewOnly();

  if (!objective) {
    return null;
  }

  let numScorers = getNumPotentialScorers(objective, options);

  const objectiveScorers = objective.scorers ?? [];

  if (viewOnly) {
    numScorers = Math.max(1, objectiveScorers.length);
  }

  const possibleScorers = new Array(numScorers).fill(0);

  const size =
    objectiveScorers.length > 0 && possibleScorers.length > 1 ? 32 : undefined;

  return (
    <>
      <div
        className="flexColumn"
        style={{
          textAlign: "center",
          whiteSpace: "normal",
          height: "100%",
          width: "100%",
        }}
      >
        {objective.name}
        <div
          className="flexRow"
          style={{ flexWrap: "wrap", gap: rem(4), justifyContent: "center" }}
        >
          {possibleScorers.map((_, index) => {
            const prevScored =
              index === 0 ? true : !!objectiveScorers[index - 1];
            if (!prevScored) {
              return null;
            }
            const showTag = true;
            const scorer = objectiveScorers[index];
            return (
              <FactionSelectRadialMenu
                key={index}
                selectedFaction={scorer}
                factions={orderedFactionIds}
                onSelect={(factionId) => {
                  if (scorer) {
                    dataUpdate(
                      Events.UnscoreObjectiveEvent(scorer, objective.id),
                    );
                  }
                  if (factionId) {
                    dataUpdate(
                      Events.ScoreObjectiveEvent(factionId, objective.id),
                    );
                  }
                }}
                borderColor={scorer ? factionColors[scorer] : undefined}
                size={size}
                tag={
                  showTag ? (
                    <InfoModal title={objective.name}>
                      {info ?? objective.description}
                    </InfoModal>
                  ) : undefined
                }
                viewOnly={viewOnly}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}
