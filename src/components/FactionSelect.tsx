import { CSSProperties, PropsWithChildren, useRef, useState } from "react";
import { SymbolX } from "../icons/svgs";
import { Optional } from "../util/types/types";
import { em, rem } from "../util/util";
import FactionCircle from "./FactionCircle/FactionCircle";
import FactionComponents from "./FactionComponents/FactionComponents";
import styles from "./FactionSelect.module.scss";

interface FactionSelectProps {
  options: FactionId[];
  onSelect: (
    factionId: Optional<FactionId>,
    prevFaction: Optional<FactionId>,
  ) => void;
  size: number;
  forceDirection?: "column" | "row";
}

export function FactionSelectHoverMenu({
  options,
  onSelect,
  size,
  forceDirection,
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
    left: 0,
    borderRadius: em(Math.floor(size / 2)),
    border: `var(--border-size) solid var(--interactive-bg)`,
    flexDirection: forceDirection,
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
        borderColor="var(--interactive-bg)"
        tagBorderColor="var(--interactive-bg)"
        size={size}
      />
      <div
        className={`flexRow hoverRadio ${styles.hoverMenu}`}
        style={hoverMenuStyle}
        ref={innerMenu}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: `calc(${em(size)} - 4px)`,
            height: `calc(${em(size)} - 4px)`,
            color: "var(--interactive-bg)",
          }}
        >
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: em(size - 10),
              height: em(size - 10),
            }}
          >
            <SymbolX />
          </div>
        </div>
        {options.map((factionId) => {
          return (
            <div
              key={factionId}
              className={`flexRow ${styles.oldFactionSelect}`}
              style={{
                width: `calc(${em(size)} - 4px)`,
                height: `calc(${em(size)} - 4px)`,
              }}
              onClick={() => {
                closeFn();
                onSelect(factionId, undefined);
              }}
            >
              <FactionComponents.Icon factionId={factionId} size={size - 10} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
