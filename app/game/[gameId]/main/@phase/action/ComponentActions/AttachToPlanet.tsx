import PlanetRow from "../../../../../../../src/components/PlanetRow/PlanetRow";
import { Selector } from "../../../../../../../src/components/Selector/Selector";
import {
  useAttachments,
  useGameId,
  usePlanets,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import {
  addAttachmentAsync,
  removeAttachmentAsync,
} from "../../../../../../../src/dynamic/api";
import { applyAllPlanetAttachments } from "../../../../../../../src/util/planets";
import { Optional } from "../../../../../../../src/util/types/types";

const AttachToPlanet = {
  LeftLabel,
  Content,
};

export default AttachToPlanet;

function LeftLabel({ attachmentId }: { attachmentId: AttachmentId }) {
  const planets = usePlanets();

  let attachedPlanet: Optional<Planet>;
  Object.values(planets).forEach((planet) => {
    if ((planet.attachments ?? []).includes(attachmentId)) {
      attachedPlanet = planet;
    }
  });

  if (!attachedPlanet) {
    return null;
  }
  return "Attached to";
}

function Content({
  attachmentId,
  factionId,
  planetFilter,
}: {
  attachmentId: AttachmentId;
  factionId: FactionId;
  planetFilter: (planet: Planet) => boolean;
}) {
  const attachments = useAttachments();
  const gameId = useGameId();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  const updatedPlanets = applyAllPlanetAttachments(
    Object.values(planets),
    attachments
  );

  const possiblePlanets = updatedPlanets.filter(planetFilter);

  let attachedPlanet: Optional<Planet>;
  Object.values(planets).forEach((planet) => {
    if ((planet.attachments ?? []).includes(attachmentId)) {
      attachedPlanet = planet;
    }
  });

  if (attachedPlanet) {
    possiblePlanets.push(attachedPlanet);
  }

  return (
    <div
      className="flexColumn"
      style={{ width: "100%", alignItems: "flex-start" }}
    >
      <Selector
        hoverMenuLabel="Attach to Planet"
        options={possiblePlanets}
        renderItem={(planetId) => {
          const planet = updatedPlanets.find(
            (planet) => planet.id === planetId
          );
          if (!planet) {
            return null;
          }
          return (
            <PlanetRow
              planet={planet}
              factionId={factionId}
              removePlanet={
                viewOnly
                  ? undefined
                  : () => removeAttachmentAsync(gameId, planetId, attachmentId)
              }
              opts={{ hideAttachButton: true }}
            />
          );
        }}
        selectedItem={attachedPlanet?.id}
        toggleItem={(planetId, add) => {
          if (add) {
            addAttachmentAsync(gameId, planetId, attachmentId);
          } else {
            removeAttachmentAsync(gameId, planetId, attachmentId);
          }
        }}
        viewOnly={viewOnly}
      />
    </div>
  );
}
