import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { FullFactionSymbol } from "./FactionCard";
import { ResponsiveLogo } from "./Header";
import { BLACK_BORDER_GLOW } from "./LabeledDiv";
import { responsiveNegativePixels, responsivePixels } from "./util/util";

export function ClientOnlyHoverMenu({
  label,
  style,
  borderless,
  shift = {},
  buttonStyle = {},
  children,
  renderProps,
  borderColor = "#aaa",
}: PropsWithChildren<HoverMenuProps>) {
  const [onClient, setOnClient] = useState(false);

  useEffect(() => {
    setOnClient(true);
  }, []);

  if (!onClient) {
    return (
      <div className="hoverParent largeFont" style={buttonStyle}>
        <div
          style={{
            border: borderless
              ? undefined
              : `${responsivePixels(2)} solid ${borderColor}`,
            borderRadius: responsivePixels(5),
            padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
            whiteSpace: "nowrap",
            backgroundColor: "#222",
          }}
        >
          {label}
        </div>
      </div>
    );
  }

  return (
    <HoverMenu
      label={label}
      style={style}
      borderless={borderless}
      shift={shift}
      buttonStyle={buttonStyle}
      borderColor={borderColor}
      renderProps={renderProps}
    >
      {children}
    </HoverMenu>
  );
}

interface Shift {
  left?: number;
  right?: number;
}

export interface HoverMenuProps {
  renderProps?: (closeFn: () => void) => ReactNode;
  label?: ReactNode;
  style?: CSSProperties;
  borderless?: boolean;
  shift?: Shift;
  buttonStyle?: CSSProperties;
  borderColor?: string;
}

export function HoverMenu({
  label,
  style,
  borderless,
  shift = {},
  buttonStyle = {},
  children,
  renderProps,
  borderColor = "#aaa",
}: PropsWithChildren<HoverMenuProps>) {
  const menu = useRef<HTMLDivElement>(null);
  const innerMenu = useRef<HTMLDivElement>(null);
  const [direction, setDirection] = useState("down");
  const [side, setSide] = useState("right");
  const [closing, setClosing] = useState(false);

  const rect = menu.current?.getBoundingClientRect();
  const innerHeight = innerMenu.current?.clientHeight;
  const innerWidth = innerMenu.current?.clientWidth;

  useLayoutEffect(() => {
    // For some reason, need to grab the current here rather than using the
    // "cached version" above.
    const menuCurrent = menu.current as HTMLDivElement;
    const innerCurrent = innerMenu.current as HTMLDivElement;
    const rect = menuCurrent.getBoundingClientRect();
    if (
      rect.top + innerCurrent.clientHeight > window.innerHeight - 4 &&
      rect.bottom - innerCurrent.clientHeight > 0
    ) {
      setDirection("up");
    } else {
      setDirection("down");
    }
    if (
      rect.left + innerCurrent.clientWidth > window.innerWidth - 4 &&
      rect.right - innerCurrent.clientWidth > 0
    ) {
      setSide("left");
    } else {
      setSide("right");
    }
  }, [rect, innerHeight, innerWidth]);

  useEffect(() => {
    function determineDirection() {
      // For some reason, need to grab the current here rather than using the
      // "cached version" above.
      const menuCurrent = menu.current as HTMLDivElement;
      const innerCurrent = innerMenu.current as HTMLDivElement;
      const rect = menuCurrent.getBoundingClientRect();
      if (
        rect.top + innerCurrent.clientHeight > window.innerHeight - 4 &&
        rect.bottom - innerCurrent.clientHeight > 0
      ) {
        setDirection("up");
      } else {
        setDirection("down");
      }
      if (
        rect.left + innerCurrent.clientWidth > window.innerWidth - 4 &&
        rect.right - innerCurrent.clientWidth > 0
      ) {
        setSide("left");
      } else {
        setSide("right");
      }
    }
    window.addEventListener("resize", determineDirection);

    return () => {
      window.removeEventListener("resize", determineDirection);
    };
  }, []);

  function closeFn() {
    if (!menu.current) {
      return;
    }
    menu.current.classList.remove("hover");
    setClosing(true);
    setTimeout(() => setClosing(false), 200);
  }

  const hoverMenuStyle: CSSProperties = {
    position: "absolute",
    zIndex: 1000,
    alignItems: side === "left" ? "flex-end" : "flex-start",
    justifyContent: side === "left" ? "flex-end" : "flex-start",
    top: direction === "down" ? 0 : "auto",
    bottom: direction === "up" ? 0 : "auto",
    border: borderless
      ? undefined
      : `${responsivePixels(2)} solid ${borderColor}`,
    borderRadius: responsivePixels(5),
    backgroundColor: "#222",
    overflow: "visible",
    whiteSpace: "nowrap",
    gap: 0,
    left: shift.left
      ? responsiveNegativePixels(-shift.left)
      : side === "right"
      ? 0
      : "auto",
    right: shift.right ?? side === "left" ? 0 : "auto",
    ...style,
  };

  const classNames =
    "flexColumn hoverInfo" +
    (direction === "up" ? " up" : "") +
    (side === "left" ? " left" : "");

  return (
    <div
      className="hoverParent largeFont"
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
      style={buttonStyle}
    >
      <div
        style={{
          border: borderless
            ? undefined
            : `${responsivePixels(2)} solid ${borderColor}`,
          borderRadius: responsivePixels(5),
          padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
          whiteSpace: "nowrap",
          backgroundColor: "#222",
        }}
      >
        {label}
      </div>
      <div className={classNames} style={hoverMenuStyle} ref={innerMenu}>
        {direction === "down" ? (
          <div
            style={{
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              marginLeft: shift.left ? responsivePixels(shift.left) : 0,
              marginRight: shift.right ? responsivePixels(shift.right) : 0,
            }}
          >
            {label}
          </div>
        ) : null}
        {renderProps ? renderProps(closeFn) : children}
        {direction === "up" ? (
          <div
            style={{
              padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
              marginLeft: shift.left ? responsivePixels(shift.left) : 0,
              marginRight: shift.right ? responsivePixels(shift.right) : 0,
            }}
          >
            {label}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export interface FactionSelectProps {
  direction?: "up" | "down" | "left" | "right";
  selectedFaction?: string;
  options: string[];
  onSelect: (factionName: string | undefined) => void;
  size?: number;
  tag?: ReactNode;
  borderColor?: string;
  tagBorderColor?: string;
}

export function FactionSelectHoverMenu({
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
    position: "absolute",
    zIndex: 1000,
    top: 0,
    left: direction === "right" ? 0 : undefined,
    right: direction === "left" ? 0 : undefined,
    backgroundColor: "#222",
    borderRadius: responsivePixels(Math.floor(size / 2)),
    border: `${responsivePixels(2)} solid ${borderColor}`,
    height: responsivePixels(size),
    overflow: "visible",
    whiteSpace: "nowrap",
  };

  return (
    <div
      className="hoverParent largeFont"
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
      <div
        className="flexRow"
        style={{
          backgroundColor: "#222",
          borderRadius: "100%",
          border: `${responsivePixels(2)} solid ${borderColor}`,
          width: responsivePixels(size),
          height: responsivePixels(size),
          fontSize: responsivePixels(14),
          zIndex: 2,
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: responsivePixels(size - 4),
            height: responsivePixels(size - 4),
          }}
        >
          {selectedFaction ? (
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
                "None"
              )}
            </div>
          ) : (
            "None"
          )}
          {tag ? (
            <div
              className="flexRow"
              style={{
                position: "absolute",
                backgroundColor: "#222",
                borderRadius: "100%",
                border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                marginLeft: "60%",
                top: 0,
                left: 0,
                marginTop: "58%",
                boxShadow: `${responsivePixels(1)} ${responsivePixels(
                  1
                )} ${responsivePixels(4)} black`,
                width: responsivePixels(24),
                height: responsivePixels(24),
                zIndex: 2,
              }}
            >
              {tag}
            </div>
          ) : null}
        </div>
      </div>
      <div
        className={"flexRow hoverRadio " + direction}
        style={hoverMenuStyle}
        ref={innerMenu}
      >
        {selectedFaction && direction === "left" ? (
          <div
            className="flexRow factionSelect"
            style={{
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(14),
            }}
            onClick={() => {
              closeFn();
              onSelect(undefined);
            }}
          >
            None
          </div>
        ) : null}
        {direction === "right" ? (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(14),
            }}
          >
            {selectedFaction ? (
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: responsivePixels(size - 10),
                  height: responsivePixels(size - 10),
                }}
              >
                <FullFactionSymbol faction={selectedFaction} />
              </div>
            ) : (
              "None"
            )}
            {tag ? (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "#222",
                  borderRadius: "100%",
                  border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                  marginLeft: "60%",
                  top: 0,
                  left: 0,
                  marginTop: "58%",
                  boxShadow: `${responsivePixels(1)} ${responsivePixels(
                    1
                  )} ${responsivePixels(4)} black`,
                  width: responsivePixels(24),
                  height: responsivePixels(24),
                  zIndex: 2,
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
              className="flexRow factionSelect"
              style={{
                width: responsivePixels(size - 4),
                height: responsivePixels(size - 4),
              }}
              onClick={() => {
                closeFn();
                onSelect(factionName);
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
        {selectedFaction && direction === "right" ? (
          <div
            className="flexRow factionSelect"
            style={{
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(14),
            }}
            onClick={() => {
              closeFn();
              onSelect(undefined);
            }}
          >
            None
          </div>
        ) : null}
        {direction === "left" ? (
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: responsivePixels(size - 4),
              height: responsivePixels(size - 4),
              fontSize: responsivePixels(14),
            }}
          >
            {selectedFaction ? (
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  width: responsivePixels(size - 10),
                  height: responsivePixels(size - 10),
                }}
              >
                <FullFactionSymbol faction={selectedFaction} />
              </div>
            ) : (
              "None"
            )}
            {tag ? (
              <div
                className="flexRow"
                style={{
                  position: "absolute",
                  backgroundColor: "#222",
                  borderRadius: "100%",
                  border: `${responsivePixels(1)} solid ${tagBorderColor}`,
                  marginLeft: "60%",
                  top: 0,
                  left: 0,
                  marginTop: "58%",
                  boxShadow: `${responsivePixels(1)} ${responsivePixels(
                    1
                  )} ${responsivePixels(4)} black`,
                  width: responsivePixels(24),
                  height: responsivePixels(24),
                  zIndex: 2,
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
