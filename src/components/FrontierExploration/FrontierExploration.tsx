import { FormattedMessage } from "react-intl";
import {
  useAttachments,
  useCurrentTurn,
  useGameId,
  usePlanets,
  useViewOnly,
} from "../../context/dataHooks";
import {
  addAttachmentAsync,
  claimPlanetAsync,
  removeAttachmentAsync,
  unclaimPlanetAsync,
} from "../../dynamic/api";
import {
  getAttachments,
  getClaimedPlanets,
  getGainedRelic,
} from "../../util/actionLog";
import { applyPlanetAttachments } from "../../util/planets";
import GainRelic from "../Actions/GainRelic";
import AttachmentSelectRadialMenu from "../AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import PlanetRow from "../PlanetRow/PlanetRow";

export default function FrontierExploration({
  factionId,
}: {
  factionId: FactionId;
}) {
  const attachments = useAttachments();
  const gameId = useGameId();
  const planets = usePlanets();
  const currentTurn = useCurrentTurn();
  const viewOnly = useViewOnly();

  const gainedRelic = getGainedRelic(currentTurn);
  const claimedPlanets = getClaimedPlanets(currentTurn, factionId);
  const mirageClaimed = claimedPlanets.reduce((claimed, planet) => {
    if (planet.planet === "Mirage") {
      return true;
    }
    return claimed;
  }, false);
  const mirage = planets["Mirage"];

  if (mirageClaimed) {
    if (!mirage) {
      return null;
    }
    const adjustedPlanet = applyPlanetAttachments(mirage, attachments);
    const currentAttachment = getAttachments(currentTurn, "Mirage")[0];
    const claimedAttachments = new Set<AttachmentId>();
    for (const planet of Object.values(planets)) {
      for (const attachment of planet.attachments ?? []) {
        claimedAttachments.add(attachment);
      }
    }
    const availableAttachments = Object.values(attachments)
      .filter(
        (attachment) =>
          (!attachment.required.type ||
            adjustedPlanet.types.includes(attachment.required.type)) &&
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
          factionId={factionId}
          planet={adjustedPlanet}
          removePlanet={() => {
            unclaimPlanetAsync(gameId, factionId, "Mirage");
          }}
          opts={{ hideAttachButton: true }}
        />
        {availableAttachments.length > 0 ? (
          <div className="flexRow" style={{ justifyContent: "center" }}>
            <AttachmentSelectRadialMenu
              attachments={availableAttachments}
              hasSkip={adjustedPlanet.attributes.reduce(
                (hasSkip, attribute) => {
                  if (attribute.includes("skip")) {
                    if (
                      currentAttachment &&
                      attachments[currentAttachment]?.attribute === attribute
                    ) {
                      return mirage.attributes.reduce((hasSkip, attribute) => {
                        if (attribute.includes("skip")) {
                          return true;
                        }
                        return hasSkip;
                      }, false);
                    }
                    return true;
                  }
                  return hasSkip;
                },
                false
              )}
              onSelect={(attachmentId, prevAttachment) => {
                if (prevAttachment) {
                  removeAttachmentAsync(gameId, "Mirage", prevAttachment);
                }
                if (attachmentId) {
                  addAttachmentAsync(gameId, "Mirage", attachmentId);
                }
              }}
              selectedAttachment={currentAttachment}
              tag={<PlanetIcon types={adjustedPlanet.types} size="75%" />}
            />
          </div>
        ) : null}
      </div>
    );
  }

  const mirageFound = !mirageClaimed && mirage?.owner;
  return (
    <div className="flexRow" style={{ width: "100%" }}>
      <GainRelic factionId={factionId} />
      {!mirageFound && !gainedRelic ? (
        <button
          onClick={() => {
            claimPlanetAsync(gameId, factionId, "Mirage");
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
    </div>
  );
}
