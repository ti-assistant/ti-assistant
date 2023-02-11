import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { getResponsiveFormula, responsiveNegativePixels, responsivePixels } from "./util/util";

export function HoverMenu({label, style, borderless, shift = {}, buttonStyle = {}, children, content, directin = "down", borderColor = "#aaa"}) {
  const menu = useRef(null);
  const innerMenu = useRef(null);
  const [ forceRefresh, setForceRefresh ] = useState(false);
  const [ direction, setDirection ] = useState("down");
  const [ side, setSide ] = useState("right");

  useLayoutEffect(() => {
    const lastChild = innerMenu.current.children.item(1);
    // const newWidth = lastChild.position().left - innerMenu.current.position().left + lastChild.outerWidth(true);

    // console.log(lastChild);
  })

  useLayoutEffect(() => {
    const rect = menu.current.getBoundingClientRect();
    const innerRect = innerMenu.current.getBoundingClientRect();
    if (rect.top + innerMenu.current.clientHeight > window.innerHeight - 4 &&
        rect.bottom - innerMenu.current.clientHeight > 0) {
      setDirection("up");
    } else {
      setDirection("down");
    }
    if (rect.left + innerMenu.current.clientWidth > window.innerWidth - 4 &&
        rect.right - innerMenu.current.clientWidth > 0) {
      setSide("left");
    } else {
      setSide("right");
    }
    if (label === "Pick Faction") {
      console.log(innerMenu.current.clientWidth);
      console.log("Updating...");
    }

    if (innerMenu.current.clientWidth === 0) {
      setForceRefresh(true);
    }
    // Seems to be required to get Firefox to treat this correctly.
    if (!forceRefresh) {
      setForceRefresh(true);
      setDirection("up");
    }
  });

  // const top = direction === "down" ? 0 : "auto";
  // const bottom = direction === "up" ? 0 : "auto";
  // const left = side === "right" ? 0 : "auto";
  // const right = side === "left" ? 0 : "auto";

  const hoverMenuStyle = {
    // inset: `${direction === "down" ? 0 : "auto"} ${side === "left" ? 0 : "auto"} ${direction === "up" ? 0 : "auto"} ${side === "right" ? 0 : "auto"}`,
    position: "absolute",
    zIndex: 1000,
    alignItems: side === "left" ? "flex-end" : "flex-start", 
    justifyContent: side === "left" ? "flex-end" : "flex-start",
    width: "fit-content", 
    top: direction === "down" ? 0 : "auto",
    bottom: direction === "up" ? 0 : "auto",
    right: side === "left" ? 0 : "auto",
    left: side === "right" ? 0 : "auto",
    border: borderless ? null : `${responsivePixels(2)} solid ${borderColor}`,
    borderRadius: responsivePixels(5),
    backgroundColor: "#222",
    overflow: "visible",
    whiteSpace: "nowrap",
    gap: 0,
    left: shift.left ? responsiveNegativePixels(-shift.left) : "auto",
    right: shift.right ?? side === "left" ? 0 : "auto",
    ...style,
  };

  const classNames = "flexColumn hoverInfo" + (direction === "up" ? " up" : "") + (side === "left" ? " left" : "");

  return (
    <div className="hoverParent largeFont"
      onMouseEnter={() => menu.current.classList.add("hover")}
      onMouseLeave={() => menu.current.classList.remove("hover")}
      ref={menu} style={buttonStyle}>
      <div style={{
        border: borderless ? null : `${responsivePixels(2)} solid ${borderColor}`,
        borderRadius: responsivePixels(5),
        padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
        pointer: "pointer",
        whiteSpace: "nowrap",
        backgroundColor: "#222",
      }}>{label}</div>
      <div className={classNames} style={hoverMenuStyle} ref={innerMenu}>
        {direction === "down" ? <div style={{
          padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
          pointer: "pointer",
          marginLeft: shift.left ? responsivePixels(shift.left) : 0,
          marginRight: shift.right ? responsivePixels(shift.right) : 0,
        }}>{label}</div> : null}
        {children}
        {content}
        {direction === "up" ? <div style={{
          padding: `${responsivePixels(4)} ${responsivePixels(8)}`,
          pointer: "pointer",
          marginLeft: shift.left ? responsivePixels(shift.left) : 0,
          marginRight: shift.right ? responsivePixels(shift.right) : 0,
        }}>{label}</div> : null}
      </div>
    </div>);
}