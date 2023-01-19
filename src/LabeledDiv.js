import React from "react";
import { getResponsiveFormula, responsiveNegativePixels, responsivePixels } from "./util/util"

export function LabeledDiv({label, rightLabel, children, blur, onClick, style = {}, color = "#999", labelSize = 16, content}) {
  const padding = `${!!label ? responsivePixels(10) : responsivePixels(6)} ${responsivePixels(6)} ${responsivePixels(6)} ${responsivePixels(6)}`;
  const divStyle = {
    position: "relative",
    gap: responsivePixels(8),
    border: `${responsivePixels(2)} solid ${color}`,
    borderRadius: responsivePixels(5),
    width: "100%",
    boxSizing: "border-box",
    padding: `${padding}`,
    alignItems: "flex-start",
    cursor: onClick ? "pointer" : "cursor",
    marginTop: !!label ? responsivePixels(4) : 0,
    ...style,
  };
  // console.log(getResponsiveFormula(8, 36));
  const labelStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    left: responsivePixels(6),
    // top: "calc(8px + (36 - 8) * ((100vw - 1280px) / (3000 - 1280))",
    top: responsiveNegativePixels(-12),
    // top: `-${Math.floor(labelSize * .75)}px`,
    // fontSize: `${labelSize}px`,
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color === "Black" ? "#999" : color}`
  };
  const rightLabelStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    right: responsivePixels(6),
    // top: "calc(8px + (36 - 8) * ((100vw - 1280px) / (3000 - 1280))",
    top: responsiveNegativePixels(-12),
    // top: `-${Math.floor(labelSize * .75)}px`,
    // fontSize: `${labelSize}px`,
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color === "Black" ? "#999" : color}`
  };
  return (
    <div
      className="flexColumn"
      style={divStyle}
      onClick={onClick}>
      <div style={{zIndex: "-2",  boxSizing: "border-box", left: 0, top: 0, borderRadius: "5px", position: "absolute", width: "100%", height: "100%", backdropFilter: "blur(4px)"}}></div>
      {!!label ? <div className="mediumFont"
        style={labelStyle}
      >
        {label}
      </div> : null}
      {!!rightLabel ? <div className="mediumFont"
        style={rightLabelStyle}
      >
        {rightLabel}
      </div> : null}
      {content}
      {children}
    </div>);
}

export function LabeledLine({leftLabel, label, rightLabel, style = {}, color = "#999", labelSize = 16}) {
  const padding = `${!!label ? responsivePixels(10) : responsivePixels(6)} ${responsivePixels(6)} ${responsivePixels(6)} ${responsivePixels(6)}`;
  const divStyle = {
    position: "relative",
    // gap: responsivePixels(8),
    // border: `${responsivePixels(2)} solid ${color}`,
    borderRadius: responsivePixels(5),
    width: "100%",
    // boxSizing: "border-box",
    // padding: `${padding}`,
    alignItems: "flex-start",
    marginTop: !!label ? responsivePixels(4) : 0,
    ...style,
  };
  // console.log(getResponsiveFormula(8, 36));
  const labelStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    // left: responsivePixels(6),
    // top: "calc(8px + (36 - 8) * ((100vw - 1280px) / (3000 - 1280))",
    // top: responsiveNegativePixels(-12),
    top: responsiveNegativePixels(-1),
    // top: `-${Math.floor(labelSize * .75)}px`,
    // fontSize: `${labelSize}px`,
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color === "Black" ? "#999" : color}`
  };
  const leftLabelStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    left: responsivePixels(6),
    // top: "calc(8px + (36 - 8) * ((100vw - 1280px) / (3000 - 1280))",
    top: responsiveNegativePixels(-2),
    // top: `-${Math.floor(labelSize * .75)}px`,
    // fontSize: `${labelSize}px`,
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color === "Black" ? "#999" : color}`
  };
  const rightLabelStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    right: responsivePixels(6),
    // top: "calc(8px + (36 - 8) * ((100vw - 1280px) / (3000 - 1280))",
    top: responsiveNegativePixels(-12),
    // top: `-${Math.floor(labelSize * .75)}px`,
    // fontSize: `${labelSize}px`,
    backgroundColor: "#222",
    borderRadius: responsivePixels(5),
    padding: `${responsivePixels(2)} ${responsivePixels(4)}`,
    color: `${color === "Black" ? "#999" : color}`
  };
  return (
    <div style={divStyle}>
      <hr style={{width: "100%", border: `${responsivePixels(1)} solid ${color}`, marginTop: responsivePixels(8), marginBottom: responsivePixels(8)}} />
      {!!leftLabel ? <div className="mediumFont leftLabel" style={{color: color === "Black" ? "#999" : color}}
      >{leftLabel}</div> : null}
      
      {!!label ? <div className="flexRow" style={{width: "100%"}}><div className="mediumFont centerLabel"
        style={{color: color === "Black" ? "#999" : color}}
      >{label}</div></div> : null}
    </div>
    );
}