import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import {
  useAttachments,
  useExpedition,
  useViewOnly,
} from "../../context/dataHooks";
import { SymbolX } from "../../icons/svgs";
import { Optional } from "../../util/types/types";
import { objectKeys, rem } from "../../util/util";
import Circle from "../Circle/Circle";
import ExpeditionIcon from "../Expedition/ExpeditionIcon";
import styles from "./ExpeditionSelectRadialMenu.module.scss";

interface ExpeditionSelectRadialMenuProps {
  selectedExpedition?: ExpeditionId;
  expeditions: ExpeditionId[];
  fadedExpeditions?: ExpeditionId[];
  invalidExpeditions?: ExpeditionId[];
  onSelect: (
    expeditionId: Optional<ExpeditionId>,
    prevExpedition: Optional<ExpeditionId>
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

interface ExpeditionSelectRadialMenuCSS extends CSSProperties {
  "--border-color": string;
  "--size": string;
}

interface ExpeditionSelectCSS extends CSSProperties {
  "--opacity": number;
  "--x-pos": string;
  "--y-pos": string;
  "--initial-x": string;
  "--initial-y": string;
}

export default function ExpeditionSelectRadialMenu({
  selectedExpedition,
  expeditions,
  fadedExpeditions = [],
  invalidExpeditions = [],
  onSelect,
  size = 44,
  tag,
  tagBorderColor = "var(--neutral-border)",
}: ExpeditionSelectRadialMenuProps) {
  const attachmentData = useAttachments();
  const expedition = useExpedition();
  const viewOnly = useViewOnly();

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

  const hoverParentStyle: ExpeditionSelectRadialMenuCSS = {
    "--border-color": borderColor,
    "--size": rem(size),
  };

  const expeditionOptions = expeditions;

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
      {!viewOnly && expeditionOptions.length > 0 ? (
        <React.Fragment>
          <div className={styles.hoverBackground}></div>
          <div className={`flexRow ${styles.hoverRadial}`} ref={innerMenu}>
            {expeditionOptions.map((expeditionId, index) => {
              const isInvalid =
                invalidExpeditions.includes(expeditionId) &&
                expeditionId !== selectedExpedition;
              const color =
                isInvalid && expeditionId !== selectedExpedition
                  ? "#555"
                  : "#eee";
              const factionSelectStyle: ExpeditionSelectCSS = {
                "--opacity": 1,
                color: color,
                width: rem(size - 4),
                height: rem(size - 4),
                pointerEvents: isInvalid ? "none" : undefined,
                ...getRadialPosition(index, expeditionOptions.length, size),
              };
              return (
                <div
                  key={expeditionId}
                  className={`flexRow ${styles.factionSelect}`}
                  style={factionSelectStyle}
                  onClick={() => {
                    closeFn();
                    if (expeditionId === selectedExpedition) {
                      onSelect(undefined, selectedExpedition);
                      return;
                    }
                    onSelect(expeditionId, selectedExpedition);
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
                    {expeditionId === selectedExpedition ? (
                      <SymbolX />
                    ) : (
                      <ExpeditionIcon
                        expedition={expeditionId}
                        faded={color === "#555"}
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
                  <div
                    className="flexRow"
                    style={{
                      width: "100%",
                      height: "100%",
                      justifyContent: "center",
                      gap: 0,
                    }}
                  >
                    {selectedExpedition ? (
                      <ExpeditionIcon expedition={selectedExpedition} />
                    ) : (
                      <SymbolX />
                    )}
                  </div>
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
        <div
          className="flexRow"
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            gap: 0,
          }}
        >
          {selectedExpedition ? (
            <ExpeditionIcon expedition={selectedExpedition} />
          ) : (
            <SymbolX />
          )}
        </div>
      </Circle>
    </div>
  );
}
