export function SelectableRow({itemName, children, content, selectItem, removeItem, style}) {
  return (
    <div className="selectableRow" style={style}>
      {selectItem ? 
        <div
          className="icon clickable positive"
          onClick={() => selectItem(itemName)}
        >
          &#x2713;
        </div>
      : null}
      {removeItem ? 
        <div
          className="icon clickable negative"
          onClick={() => removeItem(itemName)}
        >
          &#x2715;
        </div>
      : null}
      {children}
      {content}
    </div>
  );
}