import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getResponsiveFormula, responsivePixels } from "./util/util";

export function HoverMenu({label, style, children, content, directin = "down", borderColor = "#aaa"}) {
  const menu = useRef(null);
  const innerMenu = useRef(null);
  const [ direction, setDirection ] = useState("down");
  const [ side, setSide ] = useState("right");

  useLayoutEffect(() => {
    const rect = menu.current.getBoundingClientRect();
    if (rect.top + innerMenu.current.clientHeight > window.innerHeight &&
        rect.top - innerMenu.current.clientHeight > 0) {
      setDirection("up");
    } else {
      setDirection("down");
    }
    if (rect.left + innerMenu.current.clientWidth > window.innerWidth) {
      setSide("left");
    } else {
      setSide("right");
    }
  });

  const hoverMenuStyle = {
    position: "absolute",
    zIndex: 1000,
    alignItems: side === "left" ? "flex-end" : "flex-start", 
    justifyContent: side === "left" ? "flex-end" : "flex-start", 
    top: direction === "down" ? 0 : "auto",
    bottom: direction === "up" ? 0 : "auto",
    right: side === "left" ? 0 : "auto",
    border: `2px solid ${borderColor}`,
    borderRadius: "5px",
    minWidth: "160px",
    // maxHeight: "620px",
    backgroundColor: "#222",
    overflow: "visible",
    whiteSpace: "nowrap",
    ...style,
  };

  const classNames = "flexColumn hoverInfo" + (direction === "up" ? " up" : "") + (side === "left" ? " left" : "");

  return (
    <div className="hoverParent largeFont" ref={menu}>
      <div style={{
        border: `2px solid ${borderColor}`,
        borderRadius: "5px",
        padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
        pointer: "pointer",
        whiteSpace: "nowrap",
      }}>{label}</div>
      <div className={classNames} style={hoverMenuStyle} ref={innerMenu}>
        {direction === "down" ? <div style={{
          padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
          pointer: "pointer",
        }}>{label}</div> : null}
        {children}
        {content}
        {direction === "up" ? <div style={{
          padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
          pointer: "pointer",
        }}>{label}</div> : null}
      </div>
    </div>);
}