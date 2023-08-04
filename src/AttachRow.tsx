import { useRouter } from "next/router";
import { PlanetAttributes } from "./PlanetRow";
import { ResponsiveResources } from "./Resources";
import { Attachment } from "./util/api/attachments";
import { responsivePixels } from "./util/util";
import { addAttachment, removeAttachment } from "./util/api/addAttachment";
import { Planet } from "./util/api/planets";

export interface AttachRowProps {
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
    if ((planet.attachments ?? []).includes(attachment.name)) {
      removeAttachment(gameid, planet.name, attachment.name);
    } else {
      addAttachment(gameid, planet.name, attachment.name);
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
            (planet.attachments ?? []).includes(attachment.name)
              ? "selected"
              : ""
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
