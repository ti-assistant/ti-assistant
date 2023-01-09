import { getResponsiveFormula, responsiveNegativePixels, responsivePixels } from "./util/util"

export function LabeledDiv({label, children, onClick, style = {}, color = "#999", labelSize = 16, content}) {
  const padding = `${responsivePixels(12)} ${responsivePixels(8)} ${responsivePixels(8)} ${responsivePixels(8)}`;
  console.log(padding);
  const divStyle = {
    position: "relative",
    gap: responsivePixels(8),
    border: `${responsivePixels(2)} solid ${color}`,
    borderRadius: "5px",
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
    borderRadius: "5px",
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
      {content}
      {children}
    </div>);
}