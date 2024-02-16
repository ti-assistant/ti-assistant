import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import FactionCircle from "../FactionCircle/FactionCircle";
import FactionIcon from "../FactionIcon/FactionIcon";
import styles from "./FactionSelectRadialMenu.module.scss";

interface FactionSelectRadialMenuProps {
  selectedFaction?: FactionId;
  factions: FactionId[];
  fadedFactions?: FactionId[];
  invalidFactions?: FactionId[];
  onSelect: (
    factionId: FactionId | undefined,
    prevFaction: FactionId | undefined
  ) => void;
  size?: number;
  tag?: ReactNode;
  borderColor?: string;
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
  borderColor = "#444",
  tagBorderColor = "#444",
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
      {factions.length > 0 ? (
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
                width: `${size - 4}px`,
                height: `${size - 4}px`,
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
                      width: `${size - 10}px`,
                      height: `${size - 10}px`,
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
                  {selectedFaction ? (
                    <FactionIcon factionId={selectedFaction} size="100%" />
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
                      width: "24px",
                      height: "24px",
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
