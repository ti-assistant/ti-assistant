import { use } from "react";
import { FormattedMessage } from "react-intl";
import { AddPlanetList } from "../../../../../../../src/AddPlanetList";
import { ModalContent } from "../../../../../../../src/components/Modal/Modal";
import PlanetRow from "../../../../../../../src/components/PlanetRow/PlanetRow";
import { ModalContext } from "../../../../../../../src/context/contexts";
import {
  useAttachments,
  useGameId,
  usePlanets,
  useViewOnly,
} from "../../../../../../../src/context/dataHooks";
import { useDataUpdate } from "../../../../../../../src/util/api/dataUpdate";
import { Events } from "../../../../../../../src/util/api/events";
import {
  applyAllPlanetAttachments,
  filterToClaimedPlanets,
} from "../../../../../../../src/util/planets";
import { rem } from "../../../../../../../src/util/util";

export default function PlanetTab({ factionId }: { factionId: FactionId }) {
  const attachments = useAttachments();
  const dataUpdate = useDataUpdate();
  const gameId = useGameId();
  const planets = usePlanets();
  const viewOnly = useViewOnly();
  const { openModal } = use(ModalContext);

  const claimedPlanets = filterToClaimedPlanets(planets, factionId);
  const updatedPlanets = applyAllPlanetAttachments(claimedPlanets, attachments);

  return (
    <>
      <div className="flexRow" style={{ height: rem(40) }}>
        <button
          onClick={() =>
            openModal(
              <ModalContent
                title={
                  <FormattedMessage
                    id="PrGqwQ"
                    description="Label for adding a planet."
                    defaultMessage="Add Planet"
                  />
                }
              >
                <AddPlanetList
                  factionId={factionId}
                  planets={planets}
                  addPlanet={(planetId) =>
                    dataUpdate(Events.ClaimPlanetEvent(factionId, planetId))
                  }
                />
              </ModalContent>,
            )
          }
          disabled={viewOnly}
        >
          <FormattedMessage
            id="PrGqwQ"
            description="Label for adding a planet."
            defaultMessage="Add Planet"
          />
        </button>
      </div>
      <div
        className="largeFont"
        style={{
          boxSizing: "border-box",
          paddingBottom: rem(4),
        }}
      >
        {updatedPlanets.map((planet) => {
          return (
            <PlanetRow
              key={planet.id}
              factionId={factionId}
              planet={planet}
              removePlanet={(planetId) =>
                dataUpdate(Events.UnclaimPlanetEvent(factionId, planetId))
              }
            />
          );
        })}
      </div>
    </>
  );
}
