import {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
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

interface HoverMenuProps {
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
