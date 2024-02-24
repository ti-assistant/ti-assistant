import Image from "next/image";
import { useContext } from "react";
import { FormattedMessage } from "react-intl";
import LegendaryPlanetIcon from "./components/LegendaryPlanetIcon/LegendaryPlanetIcon";
import PlanetIcon from "./components/PlanetIcon/PlanetIcon";
import ResourcesIcon from "./components/ResourcesIcon/ResourcesIcon";
import { GameIdContext } from "./context/Context";
import { addAttachmentAsync, removeAttachmentAsync } from "./dynamic/api";

interface AttachRowProps {
  attachment: Attachment;
  planet: Planet;
}

export function AttachRow({ attachment, planet }: AttachRowProps) {
  const gameId = useContext(GameIdContext);

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
        height: "72px",
        justifyContent: "flex-start",
        fontSize: "14px",
        position: "relative",
        gap: "4px",
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ flexBasis: "60%" }}>
        <button
          style={{ fontSize: "14px" }}
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
        <div style={{ marginRight: "6px" }}>
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
              width: "36px",
              height: "22px",
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
        width: "36px",
        flexWrap: "wrap",
        gap: "4px",
      }}
    >
      {attributes.map((attribute, index) => {
        return (
          <div
            key={index}
            style={{
              width: "16px",
              height: "16px",
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
