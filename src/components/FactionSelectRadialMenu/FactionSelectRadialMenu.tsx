import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./FactionSelectRadialMenu.module.scss";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";

interface FactionSelectRadialMenuProps {
  selectedFaction?: FactionId;
  factions: FactionId[];
  fadedFactions?: FactionId[];
  invalidFactions?: FactionId[];
  onSelect: (
    factionId: Optional<FactionId>,
    prevFaction: Optional<FactionId>
  ) => void;
  size?: number;
  tag?: ReactNode;
  borderColor?: string;
  tagBorderColor?: string;
  viewOnly?: boolean;
}

function getRadialPosition(index: number, numOptions: number, size: number) {
  const radians = ((Math.PI * 2) / numOptions) * index;

  const center = (size * 3) / 2;
  const pos = {
    "--y-pos": rem(
      Math.round(100 * (center - size * Math.cos(radians) - size / 2 + 2)) / 100
    ),
    "--x-pos": rem(
      Math.round(100 * (center - size * -Math.sin(radians) - size / 2 + 2)) /
        100
    ),
    "--initial-y": rem(size + 2),
    "--initial-x": rem(size + 2),
  };
  return pos;
}

interface FactionSelectRadialMenuCSS extends CSSProperties {
  "--border-color": string;
  "--size": string;
}

interface FactionSelectCSS extends CSSProperties {
  "--opacity": number;
  "--x-pos": string;
  "--y-pos": string;
  "--initial-x": string;
  "--initial-y": string;
}

export default function FactionSelectRadialMenu({
  selectedFaction,
  factions,
  fadedFactions = [],
  invalidFactions = [],
  onSelect,
  size = 44,
  tag,
  borderColor = "var(--neutral-border)",
  tagBorderColor = "var(--neutral-border)",
  viewOnly,
}: FactionSelectRadialMenuProps) {
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

  const hoverParentStyle: FactionSelectRadialMenuCSS = {
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
        menu.current.classList.add("hover");
      }}
      onMouseLeave={() => {
        if (!menu.current || !styles.hover) {
          return;
        }
        menu.current.classList.remove(styles.hover);
        menu.current.classList.remove("hover");
      }}
      ref={menu}
    >
      {factions.length > 0 && !viewOnly ? (
        <React.Fragment>
          <div className={styles.hoverBackground}></div>
          <div className={`flexRow ${styles.hoverRadial}`} ref={innerMenu}>
            {factions.map((factionId, index) => {
              const isInvalid = invalidFactions.includes(factionId);
              const opacity =
                (fadedFactions.includes(factionId) &&
                  factionId !== selectedFaction) ||
                isInvalid
                  ? 0.2
                  : 1;
              const factionSelectStyle: FactionSelectCSS = {
                "--opacity": opacity,
                width: rem(size - 4),
                height: rem(size - 4),
                pointerEvents: isInvalid ? "none" : undefined,
                ...getRadialPosition(index, factions.length, size),
              };
              return (
                <div
                  key={factionId}
                  className={`flexRow ${styles.factionSelect}`}
                  style={factionSelectStyle}
                  onClick={() => {
                    closeFn();
                    if (factionId === selectedFaction) {
                      onSelect(undefined, selectedFaction);
                      return;
                    }
                    onSelect(factionId, selectedFaction);
                  }}
                >
                  <div
                    style={{
                      width: rem(size - 10),
                      height: rem(size - 10),
                    }}
                  >
                    {factionId === selectedFaction && !isInvalid ? (
                      <SymbolX />
                    ) : (
                      <FactionIcon factionId={factionId} size="100%" />
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
                  {selectedFaction ? (
                    <FactionIcon factionId={selectedFaction} size="100%" />
                  ) : (
                    <SymbolX />
                  )}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      ) : null}
      <FactionCircle
        borderColor={borderColor}
        factionId={selectedFaction}
        tag={tag}
        tagBorderColor={tagBorderColor}
        size={size}
      />
    </div>
  );
}
