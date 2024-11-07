import Image from "next/image";
import { FormattedMessage } from "react-intl";
import { SelectableRow } from "../../SelectableRow";
import {
  useAttachments,
  useFactions,
  useGameId,
} from "../../context/dataHooks";
import { useSharedModal } from "../../data/SharedModal";
import { addAttachmentAsync, removeAttachmentAsync } from "../../dynamic/api";
import { getFactionColor } from "../../util/factions";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import LegendaryPlanetIcon from "../LegendaryPlanetIcon/LegendaryPlanetIcon";
import { ModalContent } from "../Modal/Modal";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import Toggle from "../Toggle/Toggle";

interface PlanetRowOpts {
  hideAttachButton?: boolean;
  showAttachButton?: boolean;
  showSelfOwned?: boolean;
}

interface PlanetRowProps {
  planet: Planet;
  factionId?: FactionId;
  addPlanet?: (planetId: PlanetId) => void;
  removePlanet?: (planetId: PlanetId) => void;
  opts?: PlanetRowOpts;
  prevOwner?: FactionId;
}

export default function PlanetRow({
  planet,
  factionId,
  removePlanet,
  addPlanet,
  opts = {},
  prevOwner,
}: PlanetRowProps) {
  const attachments = useAttachments();
  const factions = useFactions();

  const { openModal } = useSharedModal();

  function canAttach() {
    return (
      !opts.hideAttachButton && Object.keys(availableAttachments()).length !== 0
    );
  }

  function availableAttachments() {
    if (!attachments) {
      return {};
    }
    const planetAttachments = planet.attachments ?? [];
    let available = Object.values(attachments)
      .filter((attachment) => {
        // If attached to this planet, always show.
        if (planetAttachments.includes(attachment.id)) {
          return true;
        }
        if (planet.id === "Mecatol Rex" && attachment.id !== "Nano-Forge") {
          return false;
        }
        if (attachment.id === "Terraform" && factionId === "Titans of Ul") {
          return false;
        }
        if (attachment.required.type !== undefined) {
          if (
            attachment.required.type !== planet.type &&
            planet.type !== "ALL"
          ) {
            return false;
          }
        }
        if (attachment.required.id !== undefined) {
          if (attachment.required.id !== planet.id) {
            return false;
          }
        }
        if (attachment.required.home !== undefined) {
          if (attachment.required.home !== (planet.home ?? false)) {
            return false;
          }
        }
        if (attachment.required.legendary !== undefined) {
          if (
            attachment.required.legendary !==
            planet.attributes.includes("legendary")
          ) {
            return false;
          }
        }
        return true;
      })
      .reduce((result, attachment) => {
        return {
          ...result,
          [attachment.id]: attachment,
        };
      }, {});
    return available;
  }

  const previousOwner = prevOwner ?? planet.owner;
  let claimed: Optional<string> =
    previousOwner !== factionId || opts.showSelfOwned
      ? previousOwner
      : undefined;
  let claimedColor = getFactionColor(
    previousOwner ? factions[previousOwner] : undefined
  );
  if (claimedColor === "Black") {
    claimedColor = "#999";
  }

  return (
    <SelectableRow
      itemId={planet.id}
      selectItem={planet.locked ? undefined : addPlanet}
      removeItem={planet.locked ? undefined : removePlanet}
    >
      <div
        // ref={dragRef}
        className="flexRow hiddenButtonParent"
        style={{
          gap: 0,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: rem(4),
          boxSizing: "border-box",
          // opacity: isDragging ? 0.25 : undefined,
        }}
      >
        {claimed ? (
          <div
            style={{
              fontFamily: "Myriad Pro",
              position: "absolute",
              color: claimedColor,
              backgroundColor: "var(--background-color)",
              borderRadius: rem(5),
              border: `${"1px"} solid ${claimedColor}`,
              padding: `0 ${rem(4)}`,
              fontSize: rem(12),
              bottom: 0,
              left: rem(24),
              userSelect: "none",
            }}
          >
            Controlled by {claimed}
          </div>
        ) : null}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexBasis: "50%",
            alignItems: "center",
            isolation: "isolate",
          }}
        >
          <div>{planet.name}</div>
          <div
            style={{
              position: "relative",
              top: rem(-4),
              marginLeft: rem(-12),
              opacity: "60%",
              height: rem(28),
              zIndex: -1,
            }}
          >
            <PlanetIcon
              type={planet.type}
              factionId={planet.faction}
              size={28}
            />
          </div>
        </div>
        {!opts.showAttachButton ? (
          <div
            className="flexRow"
            style={{
              width: rem(40),
              paddingRight: rem(6),
            }}
          >
            {canAttach() ? (
              <button
                style={{ fontSize: rem(10) }}
                className="hiddenButton"
                onClick={() =>
                  openModal(
                    <AttachMenu
                      planet={planet}
                      attachments={availableAttachments()}
                    />
                  )
                }
              >
                Attach
              </button>
            ) : null}
          </div>
        ) : null}
        <ResourcesIcon
          resources={planet.resources}
          influence={planet.influence}
          height={36}
        />
        <div
          style={{
            margin: `0 ${rem(4)} ${rem(8)}`,
            width: rem(24),
          }}
        >
          <PlanetAttributes
            planetName={planet.name}
            attributes={planet.attributes ?? []}
            ability={planet.ability}
          />
        </div>
        <div className="flexColumn" style={{ height: "100%" }}>
          {opts.showAttachButton ? (
            <div style={{ width: rem(56) }}>
              {canAttach() ? (
                <button
                  onClick={() =>
                    openModal(
                      <AttachMenu
                        planet={planet}
                        attachments={availableAttachments()}
                      />
                    )
                  }
                >
                  <FormattedMessage
                    id="Kqms7v"
                    defaultMessage="Attach"
                    description="Text on a button that displays the attachment menu for a planet."
                  />
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </SelectableRow>
  );
}

interface PlanetAttributesProps {
  planetName?: string;
  attributes: PlanetAttribute[];
  ability?: string;
}

function PlanetAttributes({
  planetName,
  attributes,
  ability,
}: PlanetAttributesProps) {
  if (attributes.length === 0) {
    return null;
  }
  function getAttributeIcon(attribute: PlanetAttribute) {
    switch (attribute) {
      case "legendary":
        return (
          <LegendaryPlanetIcon planetName={planetName} ability={ability} />
        );
      case "red-skip":
        return (
          <Image
            src="/images/red_tech.webp"
            alt="Red Tech Skip"
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "yellow-skip":
        return (
          <Image
            src="/images/yellow_tech.webp"
            alt="Yellow Tech Skip"
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "blue-skip":
        return (
          <Image
            src="/images/blue_tech.webp"
            alt="Blue Tech Skip"
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "green-skip":
        return (
          <Image
            src="/images/green_tech.webp"
            alt="Green Tech Skip"
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "demilitarized":
        return (
          <Image
            src="/images/demilitarized_zone.svg"
            alt="Demilitarized Zone"
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "tomb":
        return (
          <Image
            src="/images/tomb_symbol.webp"
            alt="Tomb of Emphidia"
            fill
            style={{ objectFit: "contain" }}
          />
        );
      case "space-cannon":
        return (
          <div
            style={{
              width: rem(36),
              height: rem(22),
            }}
          >
            ✹✹✹
          </div>
        );
      default:
        return null;
    }
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        width: rem(36),
        flexWrap: "wrap",
        gap: rem(4),
      }}
    >
      {attributes.map((attribute, index) => {
        return (
          <div
            key={index}
            style={{
              width: rem(16),
              height: rem(16),
              position: "relative",
            }}
          >
            {getAttributeIcon(attribute)}
          </div>
        );
      })}
    </div>
  );
}

interface AttachMenuProps {
  planet: Planet;
  attachments: Partial<Record<AttachmentId, Attachment>>;
}

function AttachMenu({ planet, attachments }: AttachMenuProps) {
  return (
    <ModalContent title={"Attachments for " + planet.name}>
      <div
        className="flexColumn"
        style={{
          boxSizing: "border-box",
          padding: rem(4),
          overflowY: "auto",
          width: "100%",
          maxHeight: "75vh",
        }}
      >
        {Object.entries(attachments).map(([name, attachment]) => {
          return (
            <AttachRow key={name} attachment={attachment} planet={planet} />
          );
        })}
      </div>
    </ModalContent>
  );
}

interface AttachRowProps {
  attachment: Attachment;
  planet: Planet;
}

function AttachRow({ attachment, planet }: AttachRowProps) {
  const gameId = useGameId();

  function isSkip() {
    return (attachment.attribute ?? "").includes("skip");
  }

  function toggleAttachment() {
    if (!gameId) {
      return;
    }
    console.log("Attache");
    if ((planet.attachments ?? []).includes(attachment.id)) {
      removeAttachmentAsync(gameId, planet.id, attachment.id);
    } else {
      addAttachmentAsync(gameId, planet.id, attachment.id);
    }
  }

  return (
    <div
      className="flexRow"
      style={{
        width: "100%",
        height: rem(72),
        justifyContent: "flex-start",
        fontSize: rem(14),
        position: "relative",
        gap: rem(4),
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ flexBasis: "60%", fontSize: rem(14) }}>
        <div style={{ width: "fit-content" }}>
          <Toggle
            toggleFn={() => toggleAttachment()}
            selected={(planet.attachments ?? []).includes(attachment.id)}
          >
            {attachment.name}
          </Toggle>
        </div>
      </div>
      <ResourcesIcon
        resources={attachment.resources ?? 0}
        influence={attachment.influence ?? 0}
        height={50}
      />
      {isSkip() ? (
        <div style={{ marginRight: rem(6) }}>
          <FormattedMessage
            id="PnNSxg"
            description="Text between two fields linking them together."
            defaultMessage="OR"
          />
        </div>
      ) : null}
      {attachment.attribute ? (
        <PlanetAttributes attributes={[attachment.attribute]} />
      ) : null}
    </div>
  );
}
