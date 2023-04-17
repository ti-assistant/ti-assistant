import {
  ReactNode,
  PropsWithChildren,
  useRef,
  useState,
  CSSProperties,
} from "react";
import { FullFactionSymbol } from "../FactionCard";
import { BLACK_BORDER_GLOW } from "../LabeledDiv";
import { responsivePixels } from "../util/util";
import { FactionCircle } from "./FactionCircle";
import styles from "./FactionSelect.module.scss";

export interface FactionSelectProps {
  allowNone?: boolean;
  direction?: "up" | "down" | "left" | "right";
  selectedFaction?: string;
  options: string[];
  onSelect: (
    factionName: string | undefined,
    prevFaction: string | undefined
  ) => void;
  size?: number;
  tag?: ReactNode;
  borderColor?: string;
  tagBorderColor?: string;
}

export function FactionSelectHoverMenu({
  allowNone = true,
  direction = "right",
  selectedFaction,
  options,
  onSelect,
  size = 44,
  tag,
  borderColor = "#444",
  tagBorderColor = "#444",
}: PropsWithChildren<FactionSelectProps>) {
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [closing, setClosing] = useState(false);

  function closeFn() {
    if (!menu.current) {
      return;
    }
    menu.current.classList.remove("hover");
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  const hoverMenuStyle: CSSProperties = {
    left: direction === "right" ? 0 : undefined,
    right: direction === "left" ? 0 : undefined,
    borderRadius: responsivePixels(Math.floor(size / 2)),
    border: `${responsivePixels(2)} solid ${borderColor}`,
  };

  return (
    <div
      className={`hoverParent largeFont`}
      onMouseEnter={() => {
        if (!menu.current || closing) {
          return;
        }
        menu.current.classList.add("hover");
      }}
      onMouseLeave={() => {
        if (!menu.current) {
          return;
        }
        menu.current.classList.remove("hover");
      }}
      ref={menu}
    >
      <FactionCircle
        borderColor={borderColor}
        factionName={selectedFaction}
        tag={tag}
        tagBorderColor={tagBorderColor}
        size={size}
      />
      <div
        className={`flexRow hoverRadio ${styles.hoverMenu} ` + direction}
        style={hoverMenuStyle}
        ref={innerMenu}
      >
        {selectedFaction && direction === "left" && allowNone ? (
          <div
            className={`flexRow ${styles.factionSelect}`}
            style={{
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
            }}
            onClick={() => {
              closeFn();
              onSelect(undefined, selectedFaction);
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
              ⤬
            </div>
          </div>
        ) : null}
        {direction === "right" ? (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
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
                <FullFactionSymbol faction={selectedFaction} />
              ) : (
                "⤬"
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
        ) : null}
        {options.map((factionName) => {
          if (factionName === selectedFaction) {
            return null;
          }
          return (
            <div
              key={factionName}
              className={`flexRow ${styles.factionSelect}`}
              style={{
                width: responsivePixels(size - 4),
                height: responsivePixels(size - 4),
              }}
              onClick={() => {
                closeFn();
                onSelect(factionName, selectedFaction);
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: responsivePixels(size - 10),
                  height: responsivePixels(size - 10),
                }}
              >
                <FullFactionSymbol faction={factionName} />
              </div>
            </div>
          );
        })}
        {selectedFaction && direction === "right" && allowNone ? (
          <div
            className={`flexRow ${styles.factionSelect}`}
            style={{
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
            }}
            onClick={() => {
              closeFn();
              onSelect(undefined, selectedFaction);
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
              ⤬
            </div>
          </div>
        ) : null}
        {direction === "left" ? (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(size - 8),
              color: "#777",
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
                <FullFactionSymbol faction={selectedFaction} />
              ) : (
                "⤬"
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
        ) : null}
      </div>
    </div>
  );
}
