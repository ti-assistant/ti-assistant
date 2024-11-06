import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import { useAttachments } from "../../context/dataHooks";
import { SymbolX } from "../../icons/svgs";
import { getTechTypeColor } from "../../util/techs";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import AttachmentIcon from "../AttachmentIcon/AttachmentIcon";
import Circle from "../Circle/Circle";
import styles from "./AttachmentSelectRadialMenu.module.scss";

interface AttachmentSelectRadialMenuProps {
  selectedAttachment?: AttachmentId;
  attachments: AttachmentId[];
  fadedAttachments?: AttachmentId[];
  hasSkip?: boolean;
  onSelect: (
    attachmentId: Optional<AttachmentId>,
    prevAttachment: Optional<AttachmentId>
  ) => void;
  size?: number;
  tag?: ReactNode;
  tagBorderColor?: string;
}

function getRadialPosition(index: number, numOptions: number, size: number) {
  const radians = ((Math.PI * 2) / numOptions) * index;

  const center = (size * 3) / 2;
  const pos = {
    "--y-pos": rem(center - size * Math.cos(radians) - size / 2 + 2),
    "--x-pos": rem(center - size * -Math.sin(radians) - size / 2 + 2),
    "--initial-y": rem(size + 2),
    "--initial-x": rem(size + 2),
  };
  return pos;
}

interface AttachmentSelectRadialMenuCSS extends CSSProperties {
  "--border-color": string;
  "--size": string;
}

interface AttachmentSelectCSS extends CSSProperties {
  "--opacity": number;
  "--x-pos": string;
  "--y-pos": string;
  "--initial-x": string;
  "--initial-y": string;
}

export default function AttachmentSelectRadialMenu({
  selectedAttachment,
  attachments,
  fadedAttachments = [],
  hasSkip = false,
  onSelect,
  size = 44,
  tag,
  tagBorderColor = "var(--neutral-border)",
}: AttachmentSelectRadialMenuProps) {
  const attachmentData = useAttachments();

  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  function closeFn() {
    if (!menu.current || !styles.hover) {
      return;
    }
    menu.current.classList.remove(styles.hover);
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  let borderColor = "var(--neutral-border)";
  if (
    selectedAttachment &&
    attachmentData[selectedAttachment]?.attribute?.includes("-skip")
  ) {
    const techType = attachmentData[selectedAttachment]?.attribute
      ?.replace("-skip", "")
      .toUpperCase() as TechType;

    borderColor = getTechTypeColor(techType);
  }

  const hoverParentStyle: AttachmentSelectRadialMenuCSS = {
    "--border-color": borderColor,
    "--size": rem(size),
  };

  return (
    <div
      className={styles.hoverParent}
      style={hoverParentStyle}
      onMouseEnter={() => {
        if (!menu.current || closing || !styles.hover) {
          return;
        }
        menu.current.classList.add(styles.hover);
      }}
      onMouseLeave={() => {
        if (!menu.current || !styles.hover) {
          return;
        }
        menu.current.classList.remove(styles.hover);
      }}
      ref={menu}
    >
      {attachments.length > 0 ? (
        <React.Fragment>
          <div className={styles.hoverBackground}></div>
          <div className={`flexRow ${styles.hoverRadial}`} ref={innerMenu}>
            {attachments.map((attachmentId, index) => {
              const attachment = attachmentData[attachmentId];
              if (!attachment) {
                return null;
              }
              const opacity =
                fadedAttachments.includes(attachmentId) &&
                attachmentId !== selectedAttachment
                  ? 0.25
                  : 1;
              const factionSelectStyle: AttachmentSelectCSS = {
                "--opacity": opacity,
                width: rem(size - 4),
                height: rem(size - 4),
                ...getRadialPosition(index, attachments.length, size),
              };
              return (
                <div
                  key={attachmentId}
                  className={`flexRow ${styles.factionSelect}`}
                  style={factionSelectStyle}
                  onClick={() => {
                    closeFn();
                    if (attachmentId === selectedAttachment) {
                      onSelect(undefined, selectedAttachment);
                      return;
                    }
                    onSelect(attachmentId, selectedAttachment);
                  }}
                >
                  <div
                    className="flexRow"
                    style={{
                      position: "relative",
                      width: rem(size - 8),
                      height: rem(size - 8),
                      whiteSpace: "pre-wrap",
                      gap: 0,
                    }}
                  >
                    {attachmentId === selectedAttachment ? (
                      <SymbolX />
                    ) : (
                      <AttachmentIcon
                        attachment={attachment}
                        hasSkip={hasSkip}
                        size={size - 8}
                      />
                    )}
                  </div>
                </div>
              );
            })}
            <div
              className={`flexRow ${styles.centerCircle}`}
              style={{
                width: rem(size - 2),
                height: rem(size - 2),
              }}
            >
              <div
                className="flexRow"
                style={{
                  width: rem(size - 4),
                  height: rem(size - 4),
                  fontSize: rem(size - 8),
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: rem(size - 10),
                    height: rem(size - 10),
                  }}
                >
                  {selectedAttachment ? (
                    <AttachmentIcon
                      attachment={attachmentData[selectedAttachment]}
                      hasSkip={hasSkip}
                      hideBorder
                      size={size - 8}
                    />
                  ) : (
                    <SymbolX />
                  )}
                </div>

                {tag ? (
                  <div
                    className={`flexRow ${styles.tag}`}
                    style={{
                      border: `${"1px"} solid ${tagBorderColor}`,
                      boxShadow: `${"1px"} ${"1px"} ${"4px"} black`,
                      width: rem(size / 2),
                      height: rem(size / 2),
                    }}
                  >
                    {tag}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : null}
      <Circle
        borderColor={borderColor}
        tag={tag}
        tagBorderColor={tagBorderColor}
        size={size}
      >
        <AttachmentIcon
          attachment={
            selectedAttachment ? attachmentData[selectedAttachment] : undefined
          }
          hasSkip={hasSkip}
          hideBorder
          size={size - 8}
        />
      </Circle>
    </div>
  );
}
