import { CSSProperties, PropsWithChildren, useRef, useState } from "react";
import { SymbolX } from "../icons/svgs";
import FactionCircle from "./FactionCircle/FactionCircle";
import FactionIcon from "./FactionIcon/FactionIcon";
import styles from "./FactionSelect.module.scss";

interface FactionSelectProps {
  options: FactionId[];
  onSelect: (
    factionId: FactionId | undefined,
    prevFaction: FactionId | undefined
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
    borderRadius: `${Math.floor(size / 2)}px`,
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
            width: `${size - 4}px`,
            height: `${size - 4}px`,
            fontSize: `${size - 8}px`,
            color: "#777",
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
            <SymbolX />
          </div>
        </div>
        {options.map((factionId) => {
          return (
            <div
              key={factionId}
              className={`flexRow ${styles.oldFactionSelect}`}
              style={{
                width: `${size - 4}px`,
                height: `${size - 4}px`,
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
