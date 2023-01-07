export function LabeledDiv({label, children, onClick, style = {}, color = "#999", labelSize = 16, content}) {
  const divStyle = {
    position: "relative",
    gap: "8px",
    border: `2px solid ${color}`,
    borderRadius: "5px",
    width: "100%",
    boxSizing: "border-box",
    marginTop: `${labelSize - 4}px`,
    padding: `${!!label ? labelSize - 4 : 8}px 8px 8px 8px`,
    alignItems: "flex-start",
    cursor: onClick ? "pointer" : "cursor",
    ...style,
  };
  const labelStyle = {
    position: "absolute",
    whiteSpace: "nowrap",
    left: "8px",
    top: `-${Math.floor(labelSize * .75)}px`,
    fontSize: `${labelSize}px`,
    backgroundColor: "#222",
    borderRadius: "5px",
    padding: "2px 4px",
    color: `${color === "Black" ? "#999" : color}`
  };
  return (
    <div
      className="flexColumn"
      style={divStyle}
      onClick={onClick}>
      {!!label ? <div
        style={labelStyle}
      >
        {label}
      </div> : null}
      {content}
      {children}
    </div>);
}