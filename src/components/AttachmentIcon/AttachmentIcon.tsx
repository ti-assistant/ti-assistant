import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import ArcaneCitadelSVG from "../../icons/attachments/ArcaneCitadel";
import CouncilPreserveSVG from "../../icons/attachments/CouncilPreserve";
import DemilitarizedZoneSVG from "../../icons/attachments/DemilitarizedZone";
import OrbitalFoundriesSVG from "../../icons/attachments/OrbitalFoundries";
import { SymbolX } from "../../icons/svgs";
import { getTechTypeColor } from "../../util/techs";
import { rem } from "../../util/util";
import ResourcesIcon from "../ResourcesIcon/ResourcesIcon";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./AttachmentIcon.module.scss";

interface AttachmentIconProps {
  attachment?: Attachment;
  hasSkip?: boolean;
  hideBorder?: boolean;
  size: number;
}

interface AttachmentIconCSS extends CSSProperties {
  "--size": string;
}

export default function AttachmentIcon({
  attachment,
  hasSkip = false,
  hideBorder = false,
  size,
}: AttachmentIconProps) {
  let innerContent = useMemo(() => {
    if (!attachment) {
      return <SymbolX />;
    }

    if (attachment.attribute?.includes("-skip")) {
      const techType = attachment.attribute
        .replace("-skip", "")
        .toUpperCase() as TechType;
      return (
        <div
          className="flexRow"
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            aspectRatio: 1,
            border: hideBorder
              ? undefined
              : `var(--border-size) solid ${getTechTypeColor(techType)}`,
            borderRadius: "100%",
            paddingTop: hasSkip ? rem(4) : undefined,
            paddingLeft: hasSkip ? rem(1) : undefined,
          }}
        >
          {hasSkip ? (
            <ResourcesIcon
              resources={attachment.resources ?? 0}
              influence={attachment.influence ?? 0}
              height={hideBorder ? size : size - 8}
            />
          ) : (
            <TechIcon
              type={techType}
              size={hideBorder ? size - 12 : size - 16}
            />
          )}
        </div>
      );
    }

    if (attachment.attribute === "tomb") {
      return (
        <div
          className="flexRow"
          style={{ width: rem(size), aspectRatio: 1, gap: 0 }}
        >
          <div
            style={{
              width: "33%",
              height: "100%",
              position: "relative",
              flexShrink: 0,
            }}
          >
            <Image
              src={`/images/tomb_symbol.webp`}
              alt={`Tomb`}
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <ResourcesIcon
            resources={attachment.resources ?? 0}
            influence={attachment.influence ?? 0}
            height={size - 8}
          />
        </div>
      );
    }

    let iconSize = size;
    switch (attachment.id) {
      case "Arcane Citadel":
        return (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(iconSize),
              height: rem(iconSize),
            }}
          >
            <ArcaneCitadelSVG />
          </div>
        );
      case "Council Preserve":
        return (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(iconSize),
              height: rem(iconSize),
            }}
          >
            <CouncilPreserveSVG />
          </div>
        );
      case "Demilitarized Zone":
        return (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(size - 4),
              height: rem(size - 4),
            }}
          >
            <DemilitarizedZoneSVG />
          </div>
        );
      case "Orbital Foundries":
        return (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(iconSize),
              height: rem(iconSize),
            }}
          >
            <OrbitalFoundriesSVG />
          </div>
        );
    }

    return (
      <div
        className="flexRow"
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          aspectRatio: 1,
          paddingTop: rem(4),
          paddingLeft: rem(1),
        }}
      >
        <ResourcesIcon
          resources={attachment.resources ?? 0}
          influence={attachment.influence ?? 0}
          height={size}
        />
      </div>
    );
  }, [attachment, hasSkip, hideBorder, size]);

  const attachmentIconStyle: AttachmentIconCSS = {
    "--size": typeof size === "string" ? size : rem(size),
  };
  return (
    <div className={styles.AttachmentIcon} style={attachmentIconStyle}>
      {innerContent}
    </div>
  );
}
