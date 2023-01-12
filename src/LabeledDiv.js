import { getResponsiveFormula, responsiveNegativePixels, responsivePixels } from "./util/util"

export function LabeledDiv({label, rightLabel, children, onClick, style = {}, color = "#999", labelSize = 16, content}) {
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
    left: responsivePixels(8),
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
    right: responsivePixels(8),
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