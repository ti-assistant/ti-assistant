import { CSSProperties } from "react";
import { FormattedMessage } from "react-intl";
import {
  useAttachments,
  useCurrentTurn,
  useGameId,
  useLeader,
  useOptions,
  usePlanets,
  useViewOnly,
} from "../../context/dataHooks";
import { useClaimedPlanetEvents } from "../../context/planetDataHooks";
import {
  addAttachmentAsync,
  claimPlanetAsync,
  removeAttachmentAsync,
  unclaimPlanetAsync,
} from "../../dynamic/api";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { getAttachments } from "../../util/actionLog";
import { applyPlanetAttachments } from "../../util/planets";
import { rem } from "../../util/util";
import GainRelic from "../Actions/GainRelic";
import AttachmentSelectRadialMenu from "../AttachmentSelectRadialMenu/AttachmentSelectRadialMenu";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import PlanetRow from "../PlanetRow/PlanetRow";
import styles from "./ClaimPlanetsSection.module.scss";

export default function ClaimPlanetsSection({
  availablePlanets,
  factionId,
  numPlanets,
  hideWrapper,
}: {
  availablePlanets: Planet[];
  factionId: FactionId;
  numPlanets?: number;
  hideWrapper?: boolean;
}) {
  const claimedPlanetEvents = useClaimedPlanetEvents(factionId);
  const gameId = useGameId();
  const options = useOptions();
  const planets = usePlanets();
  const viewOnly = useViewOnly();

  if (options.hide?.includes("PLANETS")) {
    return null;
  }

  const claimedAttachments = new Set<AttachmentId>();
  for (const planet of Object.values(planets)) {
    for (const attachment of planet.attachments ?? []) {
      claimedAttachments.add(attachment);
    }
  }

  const maxPlanets = availablePlanets.length > 50 ? 15 : 12;
  const targetButtonStyle: CSSProperties = {
    fontFamily: "Myriad Pro",
    padding: rem(8),
    display: "grid",
    gridAutoFlow: "column",
    gridTemplateRows: `repeat(${Math.min(
      maxPlanets,
      availablePlanets.length,
    )}, auto)`,
    gap: rem(4),
    justifyContent: "flex-start",
    overflowX: "auto",
    maxWidth: "85vw",
  };

  let complete = false;
  if (numPlanets) {
    complete = numPlanets === claimedPlanetEvents.length;
  }

  return (
    <div
      className={`flexColumn ${styles.ClaimPlanetsSection}`}
      style={{ width: "100%" }}
    >
      <ClaimedPlanetsSection factionId={factionId} hideWrapper={hideWrapper} />
      {!complete && availablePlanets.length > 0 ? (
        <ClientOnlyHoverMenu
          label={
            <FormattedMessage
              id="+8kwFc"
              description="Text on a hover menu allowing a player to take control of planets."
              defaultMessage="Take Control of Planet"
            />
          }
          renderProps={(closeFn) => (
            <div className="flexRow" style={targetButtonStyle}>
              {availablePlanets.map((planet) => {
                return (
                  <button
                    key={planet.id}
                    style={{
                      minWidth:
                        availablePlanets.length > 50 ? rem(72) : rem(90),
                      fontSize:
                        availablePlanets.length > 50 ? rem(14) : undefined,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                    onClick={() => {
                      closeFn();
                      claimPlanetAsync(gameId, factionId, planet.id);
                    }}
                    disabled={viewOnly}
                  >
                    {planet.name}
                  </button>
                );
              })}
            </div>
          )}
        ></ClientOnlyHoverMenu>
      ) : null}
    </div>
  );
}

function ClaimedPlanetsSection({
  factionId,
  hideWrapper,
}: {
  factionId: FactionId;
  hideWrapper?: boolean;
}) {
  const claimedPlanetEvents = useClaimedPlanetEvents(factionId);

  if (claimedPlanetEvents.length === 0) {
    return null;
  }

  if (hideWrapper) {
    return (
      <div className={styles.ClaimedPlanetsSection}>
        {claimedPlanetEvents.map((event) => {
          return <ClaimedPlanetRow key={event.planet} event={event} />;
        })}
      </div>
    );
  }

  return (
    <LabeledDiv
      label={
        <FormattedMessage
          id="E9UhAA"
          description="Label for section of newly controlled planets."
          defaultMessage="Newly Controlled {count, plural, one {Planet} other {Planets}}"
          values={{ count: claimedPlanetEvents.length }}
        />
      }
      blur
      innerClass={styles.ClaimedPlanetsSection}
    >
      {claimedPlanetEvents.map((event) => {
        return <ClaimedPlanetRow key={event.planet} event={event} />;
      })}
    </LabeledDiv>
  );
}

export function ClaimedPlanetRow({ event }: { event: ClaimPlanetEvent }) {
  const attachments = useAttachments();
  const gameId = useGameId();
  const planets = usePlanets();
  const planet = planets[event.planet];

  if (!planet) {
    return null;
  }

  const adjustedPlanet = applyPlanetAttachments(planet, attachments);

  return (
    <div key={event.planet} className={styles.ClaimedPlanetRow}>
      <div
        className="flexRow"
        style={{
          display: "grid",
          gridTemplateColumns: "subgrid",
          gridColumn: "span 2",
          justifyItems: "flex-start",
          alignItems: "flex-start",
        }}
      >
        <div style={{ width: "100%" }}>
          <PlanetRow
            key={event.planet}
            factionId={event.faction}
            planet={adjustedPlanet}
            removePlanet={() =>
              unclaimPlanetAsync(gameId, event.faction, event.planet)
            }
            prevOwner={event.prevOwner}
            opts={{
              hideAttachButton: true,
            }}
          />
        </div>
        <AddAttachment event={event} />
      </div>
      {!event.prevOwner && adjustedPlanet.attributes.includes("relic") ? (
        <div style={{ marginLeft: rem(16) }}>
          <GainRelic
            factionId={event.faction}
            planetId={event.planet}
            style={{ fontSize: rem(12) }}
          />
        </div>
      ) : null}
    </div>
  );
}

function AddAttachment({ event }: { event: ClaimPlanetEvent }) {
  const attachments = useAttachments();
  const currentTurn = useCurrentTurn();
  const dartAndTai = useLeader("Dart and Tai");
  const gameId = useGameId();
  const planets = usePlanets();

  const planet = planets[event.planet];
  const currentAttachment = getAttachments(currentTurn, event.planet)[0];
  const claimedAttachments = new Set<AttachmentId>();

  const hasNRACommander =
    event.faction === "Naaz-Rokha Alliance" && dartAndTai?.state === "readied";

  if (!planet) {
    return null;
  }

  // Planets only get explored when claimed from the deck or with NRA's commander.
  if (event.prevOwner && !hasNRACommander) {
    return null;
  }

  const adjustedPlanet = applyPlanetAttachments(planet, attachments);
  for (const planet of Object.values(planets)) {
    for (const attachment of planet.attachments ?? []) {
      claimedAttachments.add(attachment);
    }
  }
  const availableAttachments = Object.values(attachments)
    .filter(
      (attachment) =>
        attachment.required.type &&
        adjustedPlanet.types.includes(attachment.required.type) &&
        (attachment.id === currentAttachment ||
          !claimedAttachments.has(attachment.id)),
    )
    .map((attachment) => attachment.id);

  if (availableAttachments.length === 0) {
    return null;
  }

  let planetHasSkip = false;
  for (const attribute of planet.attributes) {
    if (attribute.includes("skip")) {
      planetHasSkip = true;
      break;
    }
  }
  for (const attribute of adjustedPlanet.attributes) {
    if (!attribute.includes("skip")) {
      continue;
    }
    if (
      currentAttachment &&
      attachments[currentAttachment]?.attribute === attribute
    ) {
      continue;
    }
    planetHasSkip = true;
    break;
  }

  return (
    <div className="flexRow" style={{ justifyContent: "center" }}>
      <AttachmentSelectRadialMenu
        attachments={availableAttachments}
        size={40}
        hasSkip={planetHasSkip}
        onSelect={(attachmentId, prevAttachment) => {
          if (prevAttachment) {
            removeAttachmentAsync(gameId, event.planet, prevAttachment);
          }
          if (attachmentId) {
            addAttachmentAsync(gameId, event.planet, attachmentId);
          }
        }}
        selectedAttachment={currentAttachment}
        tag={<PlanetIcon types={adjustedPlanet.types} size="75%" />}
      />
    </div>
  );
}
