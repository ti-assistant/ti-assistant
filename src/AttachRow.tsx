import Image from "next/image";
import { FormattedMessage } from "react-intl";
import LegendaryPlanetIcon from "./components/LegendaryPlanetIcon/LegendaryPlanetIcon";
import PlanetIcon from "./components/PlanetIcon/PlanetIcon";
import ResourcesIcon from "./components/ResourcesIcon/ResourcesIcon";
import { useGameId } from "./context/dataHooks";
import { addAttachmentAsync, removeAttachmentAsync } from "./dynamic/api";
import { rem } from "./util/util";
import DemilitarizedZoneSVG from "./icons/attachments/DemilitarizedZone";
import GreenTechSVG from "./icons/techs/GreenTech";
import BlueTechSVG from "./icons/techs/BlueTech";
import YellowTechSVG from "./icons/techs/YellowTech";
import RedTechSVG from "./icons/techs/RedTech";

interface AttachRowProps {
  attachment: Attachment;
  planet: Planet;
}

export function AttachRow({ attachment, planet }: AttachRowProps) {
  const gameId = useGameId();

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
      <div style={{ flexBasis: "60%" }}>
        <button
          style={{ fontSize: rem(14) }}
          onClick={toggleAttachment}
          className={
            (planet.attachments ?? []).includes(attachment.id) ? "selected" : ""
          }
        >
          {attachment.name}
        </button>
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
      case "all-types":
        return <PlanetIcon type="ALL" size={16} />;
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
