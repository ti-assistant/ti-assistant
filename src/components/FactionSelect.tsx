import { CSSProperties, PropsWithChildren, useRef, useState } from "react";
import { SymbolX } from "../icons/svgs";
import { Optional } from "../util/types/types";
import FactionCircle from "./FactionCircle/FactionCircle";
import FactionIcon from "./FactionIcon/FactionIcon";
import styles from "./FactionSelect.module.scss";
import { rem } from "../util/util";

interface FactionSelectProps {
  options: FactionId[];
  onSelect: (
    factionId: Optional<FactionId>,
    prevFaction: Optional<FactionId>
  ) => void;
  size: number;
}

export function FactionSelectHoverMenu({
  options,
  onSelect,
  size,
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
    borderRadius: rem(Math.floor(size / 2)),
    border: `${"2px"} solid #444`,
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
      <FactionCircle borderColor="#444" tagBorderColor="#444" size={size} />
      <div
        className={`flexRow hoverRadio ${styles.hoverMenu}`}
        style={hoverMenuStyle}
        ref={innerMenu}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: rem(size - 4),
            height: rem(size - 4),
            fontSize: rem(size - 8),
            color: "#777",
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
            <SymbolX />
          </div>
        </div>
        {options.map((factionId) => {
          return (
            <div
              key={factionId}
              className={`flexRow ${styles.oldFactionSelect}`}
              style={{
                width: rem(size - 4),
                height: rem(size - 4),
              }}
              onClick={() => {
                closeFn();
                onSelect(factionId, undefined);
              }}
            >
              <FactionIcon factionId={factionId} size={size - 10} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
