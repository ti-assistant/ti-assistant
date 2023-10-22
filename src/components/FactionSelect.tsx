import {
  CSSProperties,
  PropsWithChildren, useRef,
  useState
} from "react";
import { SymbolX } from "../icons/svgs";
import { responsivePixels } from "../util/util";
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
    borderRadius: responsivePixels(Math.floor(size / 2)),
    border: `${responsivePixels(2)} solid #444`,
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
            <SymbolX />
          </div>
        </div>
        {options.map((factionId) => {
          return (
            <div
              key={factionId}
              className={`flexRow ${styles.oldFactionSelect}`}
              style={{
                width: responsivePixels(size - 4),
                height: responsivePixels(size - 4),
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
