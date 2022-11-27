export function SelectableRow({itemName, content, selectItem, removeItem}) {
  return (
    <div className="selectableRow">
      <div className="flexRow" style={{ height: "30px"}}>
      {selectItem ? 
          <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "darkgreen",
            cursor: "pointer",
            fontSize: "20px",
            zIndex: 100,
            marginRight: "8px",
          }}
          onClick={() => selectItem(itemName)}
        >
          &#x2713;
        </div>
        : null}
        {removeItem ? 
          <div
            style={{
              display: "flex",
              alignItems: "center",
              color: "darkred",
              cursor: "pointer",
              fontSize: "20px",
              zIndex: 100,
              marginRight: "8px",
            }}
            onClick={() => removeItem(itemName)}
          >
            &#x2715;
          </div>
        : null}
        {content}
      </div>
    </div>);
}