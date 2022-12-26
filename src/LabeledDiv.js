export function LabeledDiv({label, children, style = {}, color = "#999", content}) {
  return (
    <div
      className="flexColumn"
      style={{
        position: "relative",
        gap: "8px",
        border: `2px solid ${color}`,
        borderRadius: "5px",
        width: "100%",
        boxSizing: "border-box",
        margin: "8px 0px",
        padding: "8px 8px",
        alignItems: "flex-start",
        paddingTop: "12px",
        ...style,
    }}>
      <div
        style={{
          position: "absolute",
          left: "8px",
          top: "-12px",
          fontSize: "16px",
          backgroundColor: "#222",
          borderRadius: "5px",
          padding: "2px 4px",
          color: `${color}`}}
      >
        {label}
      </div>
      {content}
      {children}
    </div>);
}