export function LabeledDiv({label, content}) {
  return (
    <div
      className="flexColumn"
      style={{
        position: "relative",
        gap: "8px",
        border: "2px solid #999",
        borderRadius: "5px",
        width: "90%",
        boxSizing: "border-box",
        margin: "8px 0px",
        padding: "8px 8px",
        alignItems: "flex-start"
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
          color: "#aaa"}}
      >
        {label}
      </div>
      {content}
    </div>);
}