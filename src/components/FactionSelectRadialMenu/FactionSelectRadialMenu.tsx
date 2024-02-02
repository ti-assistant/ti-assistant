import React, { CSSProperties, ReactNode, useRef, useState } from "react";
import { SymbolX } from "../../icons/svgs";
import { responsivePixels } from "../../util/util";
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
    "--y-pos": responsivePixels(
      center - size * Math.cos(radians) - size / 2 + 2
    ),
    "--x-pos": responsivePixels(
      center - size * -Math.sin(radians) - size / 2 + 2
    ),
    "--initial-y": responsivePixels(size + 2),
    "--initial-x": responsivePixels(size + 2),
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
    "--size": responsivePixels(size),
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
                width: responsivePixels(size - 4),
                height: responsivePixels(size - 4),
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
                      width: responsivePixels(size - 10),
                      height: responsivePixels(size - 10),
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
                width: responsivePixels(size - 2),
                height: responsivePixels(size - 2),
              }}
            >
              <div
                className="flexRow"
                style={{
                  width: responsivePixels(size - 4),
                  height: responsivePixels(size - 4),
                  fontSize: responsivePixels(size - 8),
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    position: "relative",
                    width: responsivePixels(size - 10),
                    height: responsivePixels(size - 10),
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
                      border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                      boxShadow: `${responsivePixels(1)} ${responsivePixels(
                        1
                      )} ${responsivePixels(4)} black`,
                      width: responsivePixels(24),
                      height: responsivePixels(24),
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
