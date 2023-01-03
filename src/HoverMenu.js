import React from "react";

export function HoverMenu({label, style, children, content, direction = "down", borderColor = "#aaa"}) {
  const hoverMenuStyle = {
    position: "absolute",
    zIndex: 1000,
    alignItems: "flex-start",
    justifyContent: "flex-start", 
    top: direction === "down" ? 0 : "auto",
    bottom: direction === "up" ? 0 : "auto",
    border: `2px solid ${borderColor}`,
    borderRadius: "5px",
    minWidth: "160px",
    maxHeight: "620px",
    backgroundColor: "#222",
    overflow: "visible",
    whiteSpace: "nowrap",
    ...style,
  };

  const classNames = "flexColumn hoverInfo" + (direction === "up" ? " up" : "");

  return (
    <div className="hoverParent">
      <div style={{
        border: `2px solid ${borderColor}`,
        borderRadius: "5px",
        padding: "4px 8px",
        fontSize: "18px",
        pointer: "pointer",
        whiteSpace: "nowrap",
      }}>{label}</div>
      <div className={classNames} style={hoverMenuStyle}>
        {direction === "down" ? <div style={{
          padding: "4px 8px",
          fontSize: "18px",
          pointer: "pointer",
        }}>{label}</div> : null}
        {children}
        {content}
        {direction === "up" ? <div style={{
          padding: "4px 8px",
          fontSize: "18px",
          pointer: "pointer",
        }}>{label}</div> : null}
      </div>
    </div>);
}