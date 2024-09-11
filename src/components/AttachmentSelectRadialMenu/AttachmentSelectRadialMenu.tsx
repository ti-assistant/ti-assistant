import React, {
  CSSProperties,
  ReactNode,
  useContext,
  useRef,
  useState,
} from "react";
import { SymbolX } from "../../icons/svgs";
import styles from "./AttachmentSelectRadialMenu.module.scss";
import AttachmentIcon from "../AttachmentIcon/AttachmentIcon";
import Circle from "../Circle/Circle";
import { getTechTypeColor } from "../../util/techs";
import { useAttachments } from "../../context/dataHooks";
import { Optional } from "../../util/types/types";

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
    "--y-pos": `${center - size * Math.cos(radians) - size / 2 + 2}px`,
    "--x-pos": `${center - size * -Math.sin(radians) - size / 2 + 2}px`,
    "--initial-y": `${size + 2}px`,
    "--initial-x": `${size + 2}px`,
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
  tagBorderColor = "#444",
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

  let borderColor = "#444";
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
    "--size": `${size}px`,
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
                width: `${size - 4}px`,
                height: `${size - 4}px`,
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
                      width: `${size - 8}px`,
                      height: `${size - 8}px`,
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
                width: `${size - 2}px`,
                height: `${size - 2}px`,
              }}
            >
              <div
                className="flexRow"
                style={{
                  width: `${size - 4}px`,
                  height: `${size - 4}px`,
                  fontSize: `${size - 8}px`,
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: `${size - 10}px`,
                    height: `${size - 10}px`,
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
                      width: `${size / 2}px`,
                      height: `${size / 2}px`,
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
