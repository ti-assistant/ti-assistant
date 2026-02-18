import { FormattedMessage } from "react-intl";
import GainTFCard from "../../../../../../../../src/components/Actions/GainSplicedCard";
import FactionComponents from "../../../../../../../../src/components/FactionComponents/FactionComponents";
import LabeledDiv from "../../../../../../../../src/components/LabeledDiv/LabeledDiv";
import ObjectiveRow from "../../../../../../../../src/components/ObjectiveRow/ObjectiveRow";
import ObjectiveSelectHoverMenu from "../../../../../../../../src/components/ObjectiveSelectHoverMenu/ObjectiveSelectHoverMenu";
import {
  useCurrentTurn,
  useGameId,
  usePlanet,
} from "../../../../../../../../src/context/dataHooks";
import { useFaction } from "../../../../../../../../src/context/factionDataHooks";
import { useOrderedFactionIds } from "../../../../../../../../src/context/gameDataHooks";
import { useObjectives } from "../../../../../../../../src/context/objectiveDataHooks";
import {
  scoreObjectiveAsync,
  unscoreObjectiveAsync,
} from "../../../../../../../../src/dynamic/api";
import {
  getGainedTFCardsByType,
  getScoredObjectives,
} from "../../../../../../../../src/util/actionLog";
import { getColorForFaction } from "../../../../../../../../src/util/factions";
import { rem } from "../../../../../../../../src/util/util";

const Aeterna = {
  Primary,
  Secondary,
  AllSecondaries,
};

export default Aeterna;

function Primary({ factionId }: { factionId: FactionId }) {
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const objectives = useObjectives();
  const mecatol = usePlanet("Mecatol Rex");

  let hasImperialPoint = false;
  if (mecatol && mecatol.owner === factionId) {
    hasImperialPoint = true;
  }
  const scoredObjectives = getScoredObjectives(currentTurn, factionId);
  scoredObjectives.forEach((objective) => {
    if (objective === "Imperial Point") {
      hasImperialPoint = true;
    }
  });
  const availablePublicObjectives = Object.values(objectives).filter(
    (objective) => {
      if ((objective.scorers ?? []).includes(factionId)) {
        return false;
      }
      if (!objective.selected) {
        return false;
      }
      return objective.type === "STAGE ONE" || objective.type === "STAGE TWO";
    },
  );
  const scoredPublics = scoredObjectives.filter((objective) => {
    const objectiveObj = objectives[objective];
    if (!objectiveObj) {
      return false;
    }
    return (
      objectiveObj.type === "STAGE ONE" || objectiveObj.type === "STAGE TWO"
    );
  });
  const gainedTFCards = getGainedTFCardsByType(currentTurn, factionId);
  const gainedParadigm = gainedTFCards.paradigms.length > 0;
  return (
    <>
      <div
        style={{
          backdropFilter: `blur(${rem(4)})`,
          padding: `${rem(2)} 0`,
        }}
      >
        {hasImperialPoint ? (
          <FormattedMessage
            id="a1rHE+"
            description="Message telling a player that they get a victory point."
            defaultMessage="+1 VP for controlling Mecatol Rex"
          />
        ) : (
          <FormattedMessage
            id="dd3UAo"
            description="Message telling a player to draw a secret objective."
            defaultMessage="Draw 1 secret objective"
          />
        )}
      </div>
      <div className="flexRow">
        {gainedParadigm ? null : (
          <LabeledDiv
            label={
              <FormattedMessage
                id="73882v"
                description="Message telling a player to score a public objective."
                defaultMessage="Score Public Objective"
              />
            }
          >
            <>
              {scoredPublics.length > 0 ? (
                <div className="flexColumn" style={{ alignItems: "stretch" }}>
                  {scoredPublics.map((objective) => {
                    if (!objectives) {
                      return null;
                    }
                    const objectiveObj = objectives[objective];
                    if (!objectiveObj) {
                      return null;
                    }
                    return (
                      <ObjectiveRow
                        key={objective}
                        objective={objectiveObj}
                        removeObjective={() =>
                          unscoreObjectiveAsync(gameId, factionId, objective)
                        }
                        hideScorers={true}
                      />
                    );
                  })}
                </div>
              ) : null}
              {scoredPublics.length < 1 ? (
                availablePublicObjectives.length > 0 ? (
                  <ObjectiveSelectHoverMenu
                    action={(_, objectiveId) =>
                      scoreObjectiveAsync(gameId, factionId, objectiveId)
                    }
                    label={
                      <FormattedMessage
                        id="73882v"
                        description="Message telling a player to score a public objective."
                        defaultMessage="Score Public Objective"
                      />
                    }
                    objectives={availablePublicObjectives}
                  />
                ) : (
                  "No unscored public objectives"
                )
              ) : null}
            </>
          </LabeledDiv>
        )}
        {scoredPublics.length < 1 && !gainedParadigm ? <>OR</> : null}
        {scoredPublics.length < 1 ? (
          <GainTFCard factionId={factionId} numToGain={{ paradigms: 1 }} />
        ) : null}
      </div>
    </>
  );
}

function Secondary({ factionId }: { factionId: FactionId }) {
  const faction = useFaction(factionId);

  if (faction?.secondary === "SKIPPED") {
    return null;
  }

  return (
    <LabeledDiv
      key={factionId}
      label={<FactionComponents.Name factionId={factionId} />}
      color={getColorForFaction(factionId)}
      opts={{ fixedWidth: true }}
      blur
    >
      <>
        <GainTFCard factionId={factionId} numToGain={{ paradigms: 1 }} />
      </>
    </LabeledDiv>
  );
}

function AllSecondaries({ activeFactionId }: { activeFactionId: FactionId }) {
  const orderedFactionIds = useOrderedFactionIds(
    "SPEAKER",
    undefined,
    activeFactionId,
  );

  return (
    <div
      className="flexRow mediumFont"
      style={{
        paddingTop: rem(4),
        width: "100%",
        flexWrap: "wrap",
      }}
    >
      {orderedFactionIds.map((factionId) => {
        if (factionId === activeFactionId) {
          return null;
        }
        return (
          <div key={factionId} style={{ width: "48%" }}>
            <Secondary factionId={factionId} />
          </div>
        );
      })}
    </div>
  );
}
