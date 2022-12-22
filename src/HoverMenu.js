import React from "react";

export function HoverMenu({label, style, content, position = "left", borderColor = "#aaa"}) {
  const hoverMenuStyle = {
    ...style,
    position: "absolute",
    zIndex: 1000,
    alignItems: "flex-start",
    justifyContent: "flex-start", 
    top: "0",
    border: `2px solid ${borderColor}`,
    borderRadius: "5px",
    minWidth: "160px",
    backgroundColor: "#222",
  };

  return (
    <div className="hoverParent">
      <div style={{
        border: `2px solid ${borderColor}`,
        borderRadius: "5px",
        padding: "4px 8px",
        fontSize: "18px",
        pointer: "pointer",
      }}>{label}</div>
      <div className="flexColumn hoverInfo" style={hoverMenuStyle}>
        <div style={{
          padding: "4px 8px",
          fontSize: "18px",
          pointer: "pointer",
        }}>{label}</div>
        {content}
      </div>
    </div>);
}