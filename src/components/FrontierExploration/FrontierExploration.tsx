import { useContext } from "react";
import {
  ActionLogContext,
  AttachmentContext,
  GameIdContext,
  PlanetContext,
  RelicContext,
} from "../../context/Context";
import { getCurrentTurnLogEntries } from "../../util/api/actionLog";
import {
  getAttachments,
  getClaimedPlanets,
  getGainedRelic,
} from "../../util/actionLog";
import { applyPlanetAttachments } from "../../util/planets";
import PlanetRow from "../PlanetRow/PlanetRow";
import {
  addAttachmentAsync,
  claimPlanetAsync,
  gainRelicAsync,
  loseRelicAsync,
  removeAttachmentAsync,
  unclaimPlanetAsync,
} from "../../dynamic/api";
import AttachmentSelectRadialMenu from "../AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import { Selector } from "../Selector/Selector";
import { FormattedMessage } from "react-intl";
import { SelectableRow } from "../../SelectableRow";
import { InfoRow } from "../../InfoRow";

export default function FrontierExploration({
  factionId,
}: {
  factionId: FactionId;
}) {
  const actionLog = useContext(ActionLogContext);
  const attachments = useContext(AttachmentContext);
  const gameId = useContext(GameIdContext);
  const planets = useContext(PlanetContext);
  const relics = useContext(RelicContext);
  const currentTurn = getCurrentTurnLogEntries(actionLog);

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
          ((adjustedPlanet.type === "ALL" && attachment.required.type) ||
            attachment.required.type === adjustedPlanet.type) &&
          (attachment.id === currentAttachment ||
            !claimedAttachments.has(attachment.id))
      )
      .map((attachment) => attachment.id);
    return (
      <div className="flexRow" style={{ width: "100%" }}>
        <PlanetRow
          factionId={factionId}
          planet={adjustedPlanet}
          removePlanet={() => {
            unclaimPlanetAsync(gameId, factionId, "Mirage");
          }}
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
              tag={
                adjustedPlanet.type === "ALL" ? undefined : (
                  <PlanetIcon type={adjustedPlanet.type} size="60%" />
                )
              }
            />
          </div>
        ) : null}
      </div>
    );
  }

  const mirageFound = !mirageClaimed && mirage?.owner;
  const unownedRelics = Object.values(relics).filter(
    (relic) => !relic.owner || gainedRelic === relic.id
  );
  return (
    <div className="flexRow" style={{ width: "100%" }}>
      {unownedRelics.length > 0 ? (
        <Selector
          hoverMenuLabel={
            <FormattedMessage
              id="Components.Gain Relic.Title"
              description="Title of Component: Gain Relic"
              defaultMessage="Gain Relic"
            />
          }
          options={unownedRelics}
          renderItem={(itemId, _) => {
            const relic = relics[itemId];
            if (!relic) {
              return null;
            }
            return (
              <div className="flexColumn" style={{ gap: 0, width: "100%" }}>
                <SelectableRow
                  itemId={relic.id}
                  removeItem={(relicId) => {
                    loseRelicAsync(gameId, factionId, relicId);
                  }}
                >
                  <InfoRow
                    infoTitle={relic.name}
                    infoContent={relic.description}
                  >
                    {relic.name}
                  </InfoRow>
                </SelectableRow>
                {relic.id === "Shard of the Throne" ? <div>+1 VP</div> : null}
              </div>
            );
          }}
          selectedItem={gainedRelic}
          toggleItem={(relicId, add) => {
            if (add) {
              gainRelicAsync(gameId, factionId, relicId);
            } else {
              loseRelicAsync(gameId, factionId, relicId);
            }
          }}
        />
      ) : null}
      {!mirageFound && !gainedRelic ? (
        <button
          onClick={() => {
            claimPlanetAsync(gameId, factionId, "Mirage");
          }}
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
