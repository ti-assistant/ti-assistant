import { use } from "react";
import { SettingsContext } from "../../../context/contexts";
import { useGameId, useViewOnly } from "../../../context/dataHooks";
import { hideObjectiveAsync } from "../../../dynamic/api";
import InfoModal from "../../../InfoModal";
import { Optional } from "../../../util/types/types";
import { rem } from "../../../util/util";
import FormattedDescription from "../../FormattedDescription/FormattedDescription";
import GridHeader from "./GridHeader";
import ScorableFactionIcon from "./ScorableFactionIcon";

function InfoContent({ objective }: { objective: Objective }) {
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        maxWidth: rem(800),
        width: "100%",
        minWidth: rem(320),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      <FormattedDescription description={objective.description} />
    </div>
  );
}

export default function ObjectiveColumn({
  objective,
  orderedFactionIds,
}: {
  objective: Optional<Objective>;
  orderedFactionIds: FactionId[];
}) {
  const gameId = useGameId();
  const viewOnly = useViewOnly();

  const { settings } = use(SettingsContext);

  if (!objective) {
    return (
      <>
        <GridHeader>???</GridHeader>
        {orderedFactionIds.map((name) => {
          return <div key={name}></div>;
        })}
      </>
    );
  }

  const description = settings["display-objective-description"];

  const numScorers = (objective.scorers ?? []).length;

  return (
    <>
      <GridHeader>
        <div
          className="flexColumn"
          style={{
            height: "100%",
            justifyContent: "space-between",
            gap: rem(2),
            position: "relative",
            fontFamily: description ? "Myriad Pro" : undefined,
            fontSize: description ? rem(12) : undefined,
          }}
        >
          {numScorers === 0 && !viewOnly ? (
            <div
              className="icon clickable negative"
              onClick={() => {
                hideObjectiveAsync(gameId, objective.id);
              }}
            >
              &#x2715;
            </div>
          ) : null}
          {description ? (
            <div
              style={{
                display: "flex",
                height: "100%",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <FormattedDescription description={objective.description} />
            </div>
          ) : (
            objective.name
          )}
          {description ? null : (
            <InfoModal title={objective.name}>
              <InfoContent objective={objective} />
            </InfoModal>
          )}
        </div>
      </GridHeader>
      {orderedFactionIds.map((factionId) => {
        return (
          <ScorableFactionIcon
            key={factionId}
            factionId={factionId}
            inGrid
            objective={objective}
          />
        );
      })}
    </>
  );
}
