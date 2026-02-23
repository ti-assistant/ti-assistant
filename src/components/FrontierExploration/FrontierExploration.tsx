import { FormattedMessage } from "react-intl";
import {
  useCurrentTurn,
  usePlanets,
  useViewOnly,
} from "../../context/dataHooks";
import { getClaimedPlanets, getGainedRelic } from "../../util/actionLog";
import { useDataUpdate } from "../../util/api/dataUpdate";
import { Events } from "../../util/api/events";
import { Optional } from "../../util/types/types";
import GainRelic from "../Actions/GainRelic";
import { ClaimedPlanetRow } from "../ClaimPlanetsSection/ClaimPlanetsSection";
import Conditional from "../Conditional/Conditional";

export default function FrontierExploration({
  factionId,
}: {
  factionId: FactionId;
}) {
  const currentTurn = useCurrentTurn();
  const dataUpdate = useDataUpdate();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const gainedRelic = getGainedRelic(currentTurn);
  const claimedPlanets = getClaimedPlanets(currentTurn, factionId);
  const mirageClaimed: Optional<ClaimPlanetEvent> = claimedPlanets.reduce(
    (event, planet) => {
      if (planet.planet === "Mirage") {
        return planet;
      }
      return event;
    },
    undefined as Optional<ClaimPlanetEvent>,
  );
  const mirage = planets["Mirage"];

  if (mirageClaimed) {
    return <ClaimedPlanetRow event={mirageClaimed} />;
  }

  const mirageFound = mirage?.owner;
  return (
    <div className="flexRow" style={{ width: "100%" }}>
      <GainRelic factionId={factionId} />
      <Conditional appSection="PLANETS">
        {!mirageFound && !gainedRelic ? (
          <button
            onClick={() => {
              dataUpdate(Events.ClaimPlanetEvent(factionId, "Mirage"));
            }}
            disabled={viewOnly}
          >
            <FormattedMessage
              id="iFF5UN"
              description="Text on a button that allows a player to claim a planet."
              defaultMessage="Claim {planet}"
              values={{ planet: "Mirage" }}
            />
          </button>
        ) : null}
      </Conditional>
    </div>
  );
}
