import { useRouter } from "next/router";
import { ResponsiveResources } from "./Resources";
import Image from "next/image";
import { addAttachmentAsync, removeAttachmentAsync } from "./dynamic/api";
import { responsivePixels } from "./util/util";
import LegendaryPlanetIcon from "./components/LegendaryPlanetIcon/LegendaryPlanetIcon";
import PlanetIcon from "./components/PlanetIcon/PlanetIcon";

interface AttachRowProps {
  attachment: Attachment;
  planet: Planet;
}

export function AttachRow({ attachment, planet }: AttachRowProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;

  function isSkip() {
    return (attachment.attribute ?? "").includes("skip");
  }

  function toggleAttachment() {
    if (!gameid) {
      return;
    }
    if ((planet.attachments ?? []).includes(attachment.id)) {
      removeAttachmentAsync(gameid, planet.id, attachment.id);
    } else {
      addAttachmentAsync(gameid, planet.id, attachment.id);
    }
  }

  return (
    <div
      className="flexRow"
      style={{
        width: "100%",
        height: responsivePixels(72),
        justifyContent: "flex-start",
        fontSize: responsivePixels(14),
        position: "relative",
        gap: responsivePixels(4),
        whiteSpace: "nowrap",
      }}
    >
      <div style={{ flexBasis: "60%" }}>
        <button
          style={{ fontSize: responsivePixels(14) }}
          onClick={toggleAttachment}
          className={
            (planet.attachments ?? []).includes(attachment.id) ? "selected" : ""
          }
        >
          {attachment.name}
        </button>
      </div>
      <ResponsiveResources
        resources={attachment.resources ?? 0}
        influence={attachment.influence ?? 0}
      />
      {isSkip() ? (
        <div style={{ marginRight: responsivePixels(6) }}>OR</div>
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
              width: responsivePixels(36),
              height: responsivePixels(22),
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
        width: responsivePixels(36),
        flexWrap: "wrap",
        gap: responsivePixels(4),
      }}
    >
      {attributes.map((attribute, index) => {
        return (
          <div
            key={index}
            style={{
              width: responsivePixels(16),
              height: responsivePixels(16),
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
