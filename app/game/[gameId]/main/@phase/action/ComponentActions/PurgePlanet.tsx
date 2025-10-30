import { FormattedMessage } from "react-intl";
import PlanetRow from "../../../../../../../src/components/PlanetRow/PlanetRow";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useAllPlanets,
  useAttachments,
  useCurrentTurn,
  useGameId,
  usePlanets,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { updatePlanetStateAsync } from "../../../../../../../src/dynamic/api";
import { getPurgedPlanet } from "../../../../../../../src/util/actionLog";
import { applyAllPlanetAttachments } from "../../../../../../../src/util/planets";

const PurgePlanet = {
  Content,
  Label,
};

export default PurgePlanet;

function Label() {
  const currentTurn = useCurrentTurn();
  const destroyedPlanet = getPurgedPlanet(currentTurn);

  if (destroyedPlanet) {
    return (
      <FormattedMessage
        id="8/FTsP"
        defaultMessage="Purged Planet"
        description="Label for a planet that has been purged."
      />
    );
  }

  return (
    <FormattedMessage
      id="fVAave"
      description="Label for a section containing additional details."
      defaultMessage="Details"
    />
  );
}

function Content({
  planetFilter,
}: {
  planetFilter?: (planet: Planet) => boolean;
}) {
  const allPlanets = useAllPlanets();
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const gameId = useGameId();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets),
    attachments
  );

  const fullPlanetFilter = (planet: Planet) => {
    if (
      planet.attributes.includes("ocean") ||
      planet.attributes.includes("space-station")
    ) {
      return false;
    }
    if (planetFilter) {
      return planetFilter(planet);
    }
    return true;
  };

  const validPlanets = updatedPlanets
    .filter(fullPlanetFilter)
    .sort((a, b) => (a.name > b.name ? 1 : -1));

  const purgedPlanet = getPurgedPlanet(currentTurn);
  if (purgedPlanet) {
    validPlanets.push({
      id: purgedPlanet,
      name: purgedPlanet,
    } as Planet);
  }

  return (
    <div
      className="flexColumn"
      style={{ width: "100%", alignItems: "flex-start" }}
    >
      <Selector
        hoverMenuLabel={
          <FormattedMessage
            id="bPVF6s"
            description="Label for a selector for choosing a planet to purge."
            defaultMessage="Purge Planet"
          />
        }
        options={validPlanets}
        selectedItem={purgedPlanet}
        itemsPerColumn={12}
        toggleItem={(planetId, add) => {
          if (add) {
            updatePlanetStateAsync(gameId, planetId, "PURGED");
          } else {
            updatePlanetStateAsync(gameId, planetId, "READIED");
          }
        }}
        renderItem={(planetId) => {
          const planet = allPlanets[planetId];
          if (!planet) {
            return <>{planetId}</>;
          }
          return (
            <div style={{ width: "100%" }}>
              <PlanetRow
                planet={planet}
                removePlanet={() =>
                  updatePlanetStateAsync(gameId, planetId, "READIED")
                }
                opts={{ hideAttachButton: true }}
                prevOwner={planet.owner}
              />
            </div>
          );
        }}
        viewOnly={viewOnly}
      />
    </div>
  );
}
