import { use } from "react";
import { FormattedMessage } from "react-intl";
import { ModalContext } from "../../context/contexts";
import {
  useAttachments,
  useGameId,
  usePlanet,
  useTechs,
  useViewOnly,
} from "../../context/dataHooks";
import { useFactions } from "../../context/factionDataHooks";
import {
  addAttachmentAsync,
  removeAttachmentAsync,
  toggleStructureAsync,
} from "../../dynamic/api";
import ArcaneCitadelSVG from "../../icons/attachments/ArcaneCitadel";
import CouncilPreserveSVG from "../../icons/attachments/CouncilPreserve";
import DemilitarizedZoneSVG from "../../icons/attachments/DemilitarizedZone";
import OrbitalFoundriesSVG from "../../icons/attachments/OrbitalFoundries";
import TombOfEmphidiaSVG from "../../icons/attachments/TombOfEmphidia";
import BlueTechSVG from "../../icons/techs/BlueTech";
import GreenTechSVG from "../../icons/techs/GreenTech";
import RedTechSVG from "../../icons/techs/RedTech";
import YellowTechSVG from "../../icons/techs/YellowTech";
import HitSVG from "../../icons/ui/Hit";
import { SelectableRow } from "../../SelectableRow";
import { hasTech } from "../../util/api/techs";
import { getFactionColor } from "../../util/factions";
import { applyPlanetAttachments } from "../../util/planets";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import LegendaryPlanetIcon from "../LegendaryPlanetIcon/LegendaryPlanetIcon";
import RelicPlanetIcon from "../LegendaryPlanetIcon/RelicPlanetIcon";
import { ModalContent } from "../Modal/Modal";
import PlanetIcon from "../PlanetIcon/PlanetIcon";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import Toggle from "../Toggle/Toggle";
import UnitIcon from "../Units/Icons";

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
  const gameId = useGameId();
  const techs = useTechs();
  const viewOnly = useViewOnly();

  const { openModal } = use(ModalContext);

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
        if (planet.locked) {
          return false;
        }
        if (planet.id === "Mecatol Rex" && attachment.id !== "Nano-Forge") {
          return false;
        }
        if (attachment.id === "Terraform" && factionId === "Titans of Ul") {
          return false;
        }
        if (attachment.required.type) {
          if (!planet.types.includes(attachment.required.type)) {
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

  function showSpaceDockToggle() {
    if (planet.attributes.includes("space-station")) {
      return false;
    }
    if (!planet.owner) {
      return false;
    }
    if (planet.owner === "Last Bastion") {
      return true;
    }
    const owner = factions[planet.owner];
    if (!owner) {
      return false;
    }
    const bastionSpaceDock = techs["4X4IC Helios V2"];
    return hasTech(owner, bastionSpaceDock);
  }

  return (
    <SelectableRow
      itemId={planet.id}
      selectItem={planet.locked ? undefined : addPlanet}
      removeItem={planet.locked ? undefined : removePlanet}
      viewOnly={viewOnly}
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
              types={planet.types}
              factionId={planet.faction}
              size={28}
              relic={planet.id === "The Triad"}
            />
          </div>
        </div>
        {showSpaceDockToggle() ? (
          <Toggle
            selected={!!planet.spaceDock}
            toggleFn={(prevValue) =>
              toggleStructureAsync(
                gameId,
                planet.id,
                "Space Dock",
                prevValue ? "Remove" : "Add"
              )
            }
          >
            <UnitIcon type="Space Dock" size={14} />
          </Toggle>
        ) : null}
        {!opts.showAttachButton ? (
          <div
            className="flexRow"
            style={{
              width: showSpaceDockToggle() ? "fit-content" : rem(40),
              paddingLeft: showSpaceDockToggle() ? rem(2) : undefined,
              paddingRight: rem(6),
            }}
          >
            {canAttach() ? (
              <button
                style={{
                  fontSize: rem(16),
                  width: rem(16),
                  height: rem(16),
                  padding: rem(2),
                  borderRadius: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="hiddenButton"
                onClick={() => openModal(<AttachMenu planetId={planet.id} />)}
              >
                ⎗
              </button>
            ) : null}
          </div>
        ) : null}
        {/* 
        TODO: Add ability to mark bastion space docks and adjust The Triad.
        {factionId === "Last Bastion" || previousOwner === "Last Bastion" ? (
          <Toggle
            selected={!!planet.bastionSpaceDock}
            toggleFn={(prevValue: boolean) => {}}
          >
            <UnitIcon type="Space Dock" />
          </Toggle>
        ) : null} */}
        <div style={{ flexShrink: 0 }}>
          <ResourcesIcon
            resources={planet.resources}
            influence={planet.influence}
            height={36}
          />
        </div>
        <div
          style={{
            // margin: `0 ${rem(4)} ${rem(8)}`,
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
                  onClick={() => openModal(<AttachMenu planetId={planet.id} />)}
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
        return <RedTechSVG />;
      case "yellow-skip":
        return <YellowTechSVG />;
      case "blue-skip":
        return <BlueTechSVG />;
      case "green-skip":
        return <GreenTechSVG />;
      case "demilitarized":
        return <DemilitarizedZoneSVG />;
      case "tomb":
        return <TombOfEmphidiaSVG />;
      case "extra-votes":
        return <CouncilPreserveSVG />;
      case "infantry":
        return <ArcaneCitadelSVG />;
      case "production":
        return <OrbitalFoundriesSVG />;
      case "space-cannon":
        return (
          <div
            className="flexRow"
            style={{
              gap: 0,
              width: rem(36),
              height: rem(22),
            }}
          >
            <HitSVG />
            <HitSVG />
            <HitSVG />
          </div>
        );
      case "relic":
        return <RelicPlanetIcon />;
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
  planetId: PlanetId;
}

function AttachMenu({ planetId }: AttachMenuProps) {
  const attachments = useAttachments();
  const planet = usePlanet(planetId);

  if (!planet) {
    return null;
  }
  const updatedPlanet = applyPlanetAttachments(planet, attachments);

  function availableAttachments(): Partial<Record<AttachmentId, Attachment>> {
    const planetAttachments = updatedPlanet.attachments ?? [];
    let available = Object.values(attachments)
      .filter((attachment) => {
        // If attached to this planet, always show.
        if (planetAttachments.includes(attachment.id)) {
          return true;
        }
        if (
          updatedPlanet.id === "Mecatol Rex" &&
          attachment.id !== "Nano-Forge"
        ) {
          return false;
        }
        if (
          attachment.id === "Terraform" &&
          updatedPlanet.owner === "Titans of Ul"
        ) {
          return false;
        }
        if (attachment.required.type !== undefined) {
          if (!updatedPlanet.types.includes(attachment.required.type)) {
            return false;
          }
        }
        if (attachment.required.id !== undefined) {
          if (attachment.required.id !== updatedPlanet.id) {
            return false;
          }
        }
        if (attachment.required.home !== undefined) {
          if (attachment.required.home !== (updatedPlanet.home ?? false)) {
            return false;
          }
        }
        if (attachment.required.legendary !== undefined) {
          if (
            attachment.required.legendary !==
            updatedPlanet.attributes.includes("legendary")
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
          justifyContent: "flex-start",
        }}
      >
        {Object.entries(availableAttachments()).map(([name, attachment]) => {
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
  const viewOnly = useViewOnly();

  function isSkip() {
    return (attachment.attribute ?? "").includes("skip");
  }

  function toggleAttachment() {
    if (!gameId) {
      return;
    }
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
            disabled={viewOnly}
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
