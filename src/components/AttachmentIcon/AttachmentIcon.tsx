import Image from "next/image";
import { CSSProperties, useMemo } from "react";
import { SymbolX } from "../../icons/svgs";
import styles from "./AttachmentIcon.module.scss";
import TechIcon from "../TechIcon/TechIcon";
import { CustomSizeResources } from "../../Resources";
import { getTechTypeColor } from "../../util/techs";

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

    if (attachment.attribute === "demilitarized") {
      return (
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: `${size - 10}px`,
            height: `${size - 10}px`,
          }}
        >
          <Image
            src={`/images/demilitarized_zone.svg`}
            alt={`Demilitarized Zone`}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
      );
    }

    if (attachment.attribute?.includes("-skip")) {
      const techType = attachment.attribute
        .replace("-skip", "")
        .toUpperCase() as TechType;
      // if (!hasSkip) {
      //   return <TechIcon type={techType} size={size - 10} />;
      // }
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
              : `2px solid ${getTechTypeColor(techType)}`,
            borderRadius: "100%",
            paddingTop: hasSkip ? "4px" : undefined,
            paddingLeft: hasSkip ? "1px" : undefined,
          }}
        >
          {hasSkip ? (
            <CustomSizeResources
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
          style={{ width: `${size}px`, aspectRatio: 1, gap: 0 }}
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
          <CustomSizeResources
            resources={attachment.resources ?? 0}
            influence={attachment.influence ?? 0}
            height={size - 8}
          />
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
          paddingTop: "4px",
          paddingLeft: "1px",
        }}
      >
        <CustomSizeResources
          resources={attachment.resources ?? 0}
          influence={attachment.influence ?? 0}
          height={size}
        />
      </div>
    );

    // const adjustedFactionName = factionId.replace("'", "");

    // return (
    //   <Image
    //     src={`/images/factions/${adjustedFactionName}.webp`}
    //     alt={`${factionId} Icon`}
    //     fill
    //     style={{ objectFit: "contain" }}
    //   />
    // );
  }, [attachment, hasSkip, hideBorder, size]);

  const attachmentIconStyle: AttachmentIconCSS = {
    "--size": typeof size === "string" ? size : `${size}px`,
    // border: `${"1px"} solid red`,
    // borderRadius: "100%",
  };
  return (
    <div className={styles.AttachmentIcon} style={attachmentIconStyle}>
      {innerContent}
    </div>
  );
}
