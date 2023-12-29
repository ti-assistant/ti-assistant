import Image from "next/image";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { CustomSizeResources, ResponsiveResources } from "../../Resources";
import { SelectableRow } from "../../SelectableRow";
import { AttachmentContext, FactionContext } from "../../context/Context";
import { addAttachmentAsync, removeAttachmentAsync } from "../../dynamic/api";
import { getFactionColor } from "../../util/factions";
import { responsivePixels } from "../../util/util";
import LegendaryPlanetIcon from "../LegendaryPlanetIcon/LegendaryPlanetIcon";
import Modal from "../Modal/Modal";
import PlanetIcon from "../PlanetIcon/PlanetIcon";

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
  const attachments = useContext(AttachmentContext);
  const factions = useContext(FactionContext);
  // const [{ isDragging }, dragRef] = useDrag(
  //   () => ({
  //     type: "PLANET",
  //     item: { id: planet.id },
  //     collect: (monitor) => ({
  //       isDragging: !!monitor.isDragging(),
  //     }),
  //   }),
  //   []
  // );

  const [showAttachModal, setShowAttachModal] = useState(false);

  if (!attachments || !factions) {
    return <div>Loading...</div>;
  }

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

  function displayAttachMenu() {
    setShowAttachModal(!showAttachModal);
  }

  const previousOwner = prevOwner ?? planet.owner;
  let claimed: string | undefined =
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
          paddingTop: responsivePixels(4),
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
              backgroundColor: "#222",
              borderRadius: responsivePixels(5),
              border: `${responsivePixels(1)} solid ${claimedColor}`,
              padding: `0 ${responsivePixels(4)}`,
              fontSize: responsivePixels(12),
              bottom: responsivePixels(0),
              left: responsivePixels(24),
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
              top: responsivePixels(-4),
              marginLeft: responsivePixels(-12),
              opacity: "60%",
              height: responsivePixels(28),
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
              width: responsivePixels(40),
              paddingRight: responsivePixels(6),
            }}
          >
            {canAttach() ? (
              <button
                style={{ fontSize: responsivePixels(10) }}
                className="hiddenButton"
                onClick={displayAttachMenu}
              >
                Attach
              </button>
            ) : null}
          </div>
        ) : null}
        <CustomSizeResources
          resources={planet.resources}
          influence={planet.influence}
          height={36}
        />
        <div
          style={{
            margin: `0 ${responsivePixels(4)} 0 ${responsivePixels(8)}`,
            width: responsivePixels(24),
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
            <div style={{ width: responsivePixels(56) }}>
              {canAttach() ? (
                <button onClick={() => displayAttachMenu()}>Attach</button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
      <AttachMenu
        visible={showAttachModal}
        planet={planet}
        attachments={availableAttachments()}
        closeMenu={displayAttachMenu}
      />
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
              width: responsivePixels(36),
              height: responsivePixels(22),
            }}
          >
            ✹✹✹
          </div>
        );
      case "all-types":
        return <PlanetIcon type="ALL" size={36} />;
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

interface AttachMenuProps {
  planet: Planet;
  attachments: Partial<Record<AttachmentId, Attachment>>;
  visible: boolean;
  closeMenu: () => void;
}

function AttachMenu({
  planet,
  attachments,
  visible,
  closeMenu,
}: AttachMenuProps) {
  return (
    <Modal
      closeMenu={closeMenu}
      visible={visible}
      level={2}
      title={"Attachments for " + planet.name}
    >
      <div
        className="flexColumn"
        style={{
          boxSizing: "border-box",
          padding: responsivePixels(4),
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
    </Modal>
  );
}

interface AttachRowProps {
  attachment: Attachment;
  planet: Planet;
}

function AttachRow({ attachment, planet }: AttachRowProps) {
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
