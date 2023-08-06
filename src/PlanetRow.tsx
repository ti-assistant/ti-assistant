import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { AttachRow } from "./AttachRow";
import { Modal } from "./Modal";
import { SelectableRow } from "./SelectableRow";
import { responsiveNegativePixels, responsivePixels } from "./util/util";
import { CustomSizeResources, ResponsiveResources } from "./Resources";
import { FullFactionSymbol } from "./FactionCard";
import React from "react";
import { Planet, PlanetAttribute, PlanetType } from "./util/api/planets";
import { Attachment } from "./util/api/attachments";
import { getFactionColor } from "./util/factions";
import { useGameData } from "./data/GameData";
import { useDrag } from "react-dnd";

export interface PlanetSymbolProps {
  type: PlanetType;
  faction?: string;
  size: string;
}

export function PlanetSymbol({
  type,
  faction,
  size = "36px",
}: PlanetSymbolProps) {
  switch (type) {
    case "INDUSTRIAL":
      return (
        <Image
          src="/images/industrial_icon.svg"
          alt="Industrial Planet Icon"
          width={size}
          height={size}
        />
      );
    case "CULTURAL":
      return (
        <Image
          src="/images/cultural_icon.svg"
          alt="Cultural Planet Icon"
          width={size}
          height={size}
        />
      );
    case "HAZARDOUS":
      return (
        <Image
          src="/images/hazardous_icon.svg"
          alt="Hazardous Planet Icon"
          width={size}
          height={size}
        />
      );
    case "ALL":
      return (
        <div style={{ marginLeft: "8px", width: "36px", height: "36px" }}>
          <Image
            src="/images/industrial_icon.svg"
            alt="Industrial Planet Icon"
            width="18px"
            height="18px"
          />
          <Image
            src="/images/cultural_icon.svg"
            alt="Cultural Planet Icon"
            width="18px"
            height="18px"
          />
          <Image
            src="/images/hazardous_icon.svg"
            alt="Hazardous Planet Icon"
            width="18px"
            height="18px"
          />
        </div>
      );
    case "NONE":
      if (faction === undefined) {
        return null;
      }
      return <FullFactionSymbol faction={faction} />;
    default:
      return null;
  }
}

export interface FullPlanetSymbolProps {
  type: PlanetType;
  faction?: string;
  size: number;
}

export function FullPlanetSymbol({
  type,
  faction,
  size,
}: FullPlanetSymbolProps) {
  let image;
  switch (type) {
    case "INDUSTRIAL":
      image = (
        <Image
          src="/images/industrial_icon.svg"
          alt="Industrial Planet Icon"
          layout="fill"
          objectFit="contain"
        />
      );
      break;
    case "CULTURAL":
      image = (
        <Image
          src="/images/cultural_icon.svg"
          alt="Cultural Planet Icon"
          layout="fill"
          objectFit="contain"
        />
      );
      break;
    case "HAZARDOUS":
      image = (
        <Image
          src="/images/hazardous_icon.svg"
          alt="Hazardous Planet Icon"
          layout="fill"
          objectFit="contain"
        />
      );
      break;
    case "ALL":
      return (
        <div style={{ marginLeft: "8px", width: "36px", height: "36px" }}>
          <Image
            src="/images/industrial_icon.svg"
            alt="Industrial Planet Icon"
            width="18px"
            height="18px"
          />
          <Image
            src="/images/cultural_icon.svg"
            alt="Cultural Planet Icon"
            width="18px"
            height="18px"
          />
          <Image
            src="/images/hazardous_icon.svg"
            alt="Hazardous Planet Icon"
            width="18px"
            height="18px"
          />
        </div>
      );
    case "NONE":
      if (faction === undefined || !size) {
        return null;
      }
      return (
        <div
          style={{
            position: "relative",
            width: responsivePixels(size),
            height: responsivePixels(size),
          }}
        >
          <FullFactionSymbol faction={faction} />
        </div>
      );
    default:
      return null;
  }
  return (
    <div
      style={{
        position: "relative",
        height: responsivePixels(size),
        width: responsivePixels(size),
      }}
    >
      {image}
    </div>
  );
}

export function FullPlanetTypeSymbol({ type }: { type: PlanetType }) {
  let image;
  switch (type) {
    case "INDUSTRIAL":
      image = (
        <Image
          src="/images/industrial_icon.svg"
          alt="Industrial Planet Icon"
          layout="fill"
          objectFit="contain"
        />
      );
      break;
    case "CULTURAL":
      image = (
        <Image
          src="/images/cultural_icon.svg"
          alt="Cultural Planet Icon"
          layout="fill"
          objectFit="contain"
        />
      );
      break;
    case "HAZARDOUS":
      image = (
        <Image
          src="/images/hazardous_icon.svg"
          alt="Hazardous Planet Icon"
          layout="fill"
          objectFit="contain"
        />
      );
      break;
    case "ALL":
      image = (
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            gap: "1px",
          }}
        >
          <div
            className="flexColumn"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              gap: "1px",
            }}
          >
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src="/images/cultural_icon.svg"
                alt="Cultural Planet Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
            <div
              style={{ position: "relative", width: "100%", height: "100%" }}
            >
              <Image
                src="/images/hazardous_icon.svg"
                alt="Hazardous Planet Icon"
                layout="fill"
                objectFit="contain"
              />
            </div>
          </div>
          <div style={{ position: "relative", width: "100%", height: "100%" }}>
            <Image
              src="/images/industrial_icon.svg"
              alt="Industrial Planet Icon"
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      );
      break;
    default:
      return null;
  }
  return image;
}

function InfoContent({ ability }: { ability: string }) {
  const description = ability.replaceAll("\\n", "\n");
  return (
    <div
      className="myriadPro"
      style={{
        width: "100%",
        padding: responsivePixels(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: responsivePixels(32),
      }}
    >
      {description}
    </div>
  );
}

export function LegendaryPlanetIcon({
  planetName,
  ability,
}: {
  planetName?: string;
  ability?: string;
}) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const cursor = ability ? "pointer" : "auto";
  return (
    <React.Fragment>
      {planetName && ability ? (
        <Modal
          closeMenu={() => setShowInfoModal(false)}
          level={2}
          visible={showInfoModal}
          title={
            <div style={{ fontSize: responsivePixels(40) }}>{planetName}</div>
          }
        >
          <InfoContent ability={ability} />
        </Modal>
      ) : null}
      <div
        onClick={() => setShowInfoModal(true)}
        style={{
          cursor: cursor,
          display: "flex",
          alignItems: "flex-start",
          borderRadius: responsivePixels(22),
          height: responsivePixels(16),
          width: responsivePixels(16),
          paddingTop: responsivePixels(2),
          paddingLeft: responsivePixels(2),
          boxShadow: `0px 0px ${responsivePixels(2)} ${responsivePixels(
            1
          )} purple`,
          backgroundColor: "black",
        }}
      >
        <div
          style={{
            position: "relative",
            width: responsivePixels(12),
            height: responsivePixels(12),
          }}
        >
          <Image
            src="/images/legendary_planet.svg"
            alt="Legendary Planet Icon"
            layout="fill"
            objectFit="contain"
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export interface PlanetAttributesProps {
  planetName?: string;
  attributes: PlanetAttribute[];
  ability?: string;
}

export function PlanetAttributes({
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
            layout="fill"
            objectFit="contain"
          />
        );
      case "yellow-skip":
        return (
          <Image
            src="/images/yellow_tech.webp"
            alt="Yellow Tech Skip"
            layout="fill"
            objectFit="contain"
          />
        );
      case "blue-skip":
        return (
          <Image
            src="/images/blue_tech.webp"
            alt="Blue Tech Skip"
            layout="fill"
            objectFit="contain"
          />
        );
      case "green-skip":
        return (
          <Image
            src="/images/green_tech.webp"
            alt="Green Tech Skip"
            layout="fill"
            objectFit="contain"
          />
        );
      case "demilitarized":
        return (
          <Image
            src="/images/demilitarized_zone.svg"
            alt="Demilitarized Zone"
            layout="fill"
            objectFit="contain"
          />
        );
      case "tomb":
        return (
          <Image
            src="/images/tomb_symbol.webp"
            alt="Tomb of Emphidia"
            layout="fill"
            objectFit="contain"
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
        return <FullPlanetSymbol type="ALL" size={16} />;
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
  attachments: Record<string, Attachment>;
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

export interface PlanetRowOpts {
  hideAttachButton?: boolean;
  showAttachButton?: boolean;
  showSelfOwned?: boolean;
}

export interface PlanetRowProps {
  planet: Planet;
  factionName: string;
  addPlanet?: (planetName: string) => void;
  removePlanet?: (planetName: string) => void;
  opts?: PlanetRowOpts;
  prevOwner?: string;
}

export function PlanetRow({
  planet,
  factionName,
  removePlanet,
  addPlanet,
  opts = {},
  prevOwner,
}: PlanetRowProps) {
  const router = useRouter();
  const { game: gameid }: { game?: string } = router.query;
  const gameData = useGameData(gameid, ["attachments", "factions"]);
  const attachments = gameData.attachments;
  const factions = gameData.factions;
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: "PLANET",
      item: { id: planet.name },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );

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
        if (planetAttachments.includes(attachment.name)) {
          return true;
        }
        if (planet.name === "Mecatol Rex" && attachment.name !== "Nano-Forge") {
          return false;
        }
        if (attachment.name === "Terraform" && factionName === "Titans of Ul") {
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
        if (attachment.required.name !== undefined) {
          if (attachment.required.name !== planet.name) {
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
          [attachment.name]: attachment,
        };
      }, {});
    return available;
  }

  function displayAttachMenu() {
    setShowAttachModal(!showAttachModal);
  }

  const previousOwner = prevOwner ?? planet.owner;
  let claimed: string | undefined =
    previousOwner !== factionName || opts.showSelfOwned
      ? previousOwner
      : undefined;
  let claimedColor = getFactionColor(factions[previousOwner ?? ""]);
  if (claimedColor === "Black") {
    claimedColor = "#999";
  }

  return (
    <SelectableRow
      itemName={planet.name}
      selectItem={planet.locked ? undefined : addPlanet}
      removeItem={planet.locked ? undefined : removePlanet}
    >
      <div
        ref={dragRef}
        className="flexRow hiddenButtonParent"
        style={{
          gap: 0,
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: responsivePixels(4),
          boxSizing: "border-box",
          opacity: isDragging ? 0.25 : undefined,
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
              top: responsiveNegativePixels(-4),
              marginLeft: responsiveNegativePixels(-12),
              opacity: "60%",
              height: responsivePixels(28),
              zIndex: -1,
            }}
          >
            <FullPlanetSymbol
              type={planet.type}
              faction={planet.faction}
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
