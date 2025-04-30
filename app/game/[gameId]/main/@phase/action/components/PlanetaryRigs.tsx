import { useState } from "react";
import { FormattedMessage } from "react-intl";
import AttachmentSelectRadialMenu from "../../../../../../../src/components/AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import PlanetIcon from "../../../../../../../src/components/PlanetIcon/PlanetIcon";
import PlanetRow from "../../../../../../../src/components/PlanetRow/PlanetRow";
import {
  useActionLog,
  useAttachments,
  useGameId,
  usePlanets,
} from "../../../../../../../src/context/dataHooks";
import {
  addAttachmentAsync,
  removeAttachmentAsync,
} from "../../../../../../../src/dynamic/api";
import { ClientOnlyHoverMenu } from "../../../../../../../src/HoverMenu";
import { getAttachments } from "../../../../../../../src/util/actionLog";
import { getCurrentTurnLogEntries } from "../../../../../../../src/util/api/actionLog";
import { applyPlanetAttachments } from "../../../../../../../src/util/planets";
import { Optional } from "../../../../../../../src/util/types/types";
import { rem } from "../../../../../../../src/util/util";

export default function PlanetaryRigs({ factionId }: { factionId: FactionId }) {
  const attachments = useAttachments();
  const actionLog = useActionLog();
  const currentTurn = getCurrentTurnLogEntries(actionLog);
  const gameId = useGameId();
  const planets = usePlanets();
  const [selectedPlanet, setSelectedPlanet] = useState<Optional<PlanetId>>();

  if (selectedPlanet) {
    const planet = planets[selectedPlanet];
    if (!planet) {
      return null;
    }
    const claimedAttachments = new Set<AttachmentId>();
    for (const planet of Object.values(planets)) {
      for (const attachment of planet.attachments ?? []) {
        claimedAttachments.add(attachment);
      }
    }
    const adjustedPlanet = applyPlanetAttachments(planet, attachments);
    const currentAttachment = getAttachments(currentTurn, planet.id)[0];
    const availableAttachments = Object.values(attachments)
      .filter(
        (attachment) =>
          ((adjustedPlanet.type === "ALL" && attachment.required.type) ||
            attachment.required.type === adjustedPlanet.type) &&
          (attachment.id === currentAttachment ||
            !claimedAttachments.has(attachment.id))
      )
      .map((attachment) => attachment.id);
    return (
      <div
        className="flexRow"
        style={{ width: "100%", justifyContent: "space-between" }}
      >
        <PlanetRow
          planet={planet}
          removePlanet={(planetId) => {
            if (currentAttachment) {
              removeAttachmentAsync(gameId, planetId, currentAttachment);
            }
            setSelectedPlanet(undefined);
          }}
          opts={{ hideAttachButton: true }}
        />
        <AttachmentSelectRadialMenu
          attachments={availableAttachments}
          hasSkip={adjustedPlanet.attributes.reduce((hasSkip, attribute) => {
            if (attribute.includes("skip")) {
              if (
                currentAttachment &&
                attachments[currentAttachment]?.attribute === attribute
              ) {
                return planet.attributes.reduce((hasSkip, attribute) => {
                  if (attribute.includes("skip")) {
                    return true;
                  }
                  return hasSkip;
                }, false);
              }
              return true;
            }
            return hasSkip;
          }, false)}
          onSelect={(attachmentId, prevAttachment) => {
            if (prevAttachment) {
              removeAttachmentAsync(gameId, planet.id, prevAttachment);
            }
            if (attachmentId) {
              addAttachmentAsync(gameId, planet.id, attachmentId);
            }
          }}
          selectedAttachment={currentAttachment}
          tag={
            adjustedPlanet.type === "ALL" ? undefined : (
              <PlanetIcon type={adjustedPlanet.type} size="60%" />
            )
          }
        />
      </div>
    );
  }

  const availablePlanets = Object.values(planets).filter(
    (planet) =>
      planet.owner === factionId && !planet.home && planet.id !== "Mecatol Rex"
  );
  const maxPlanets = availablePlanets.length > 50 ? 15 : 12;

  return (
    <ClientOnlyHoverMenu
      label={
        <FormattedMessage
          id="fpD/Z6"
          description="Text on a menu allowing a player to select a planet."
          defaultMessage="Choose Planet"
        />
      }
      renderProps={(closeFn) => (
        <div
          className="flexRow"
          style={{
            fontFamily: "Myriad Pro",
            padding: rem(8),
            display: "grid",
            gridAutoFlow: "column",
            gridTemplateRows: `repeat(${Math.min(
              maxPlanets,
              availablePlanets.length
            )}, auto)`,
            gap: rem(4),
            justifyContent: "flex-start",
            overflowX: "auto",
            maxWidth: "85vw",
          }}
        >
          {availablePlanets.map((planet) => {
            return (
              <button
                key={planet.id}
                style={{
                  width: availablePlanets.length > 50 ? rem(72) : rem(90),
                  fontSize: availablePlanets.length > 50 ? rem(14) : undefined,
                }}
                onClick={() => {
                  closeFn();
                  setSelectedPlanet(planet.id);
                }}
              >
                {planet.name}
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
