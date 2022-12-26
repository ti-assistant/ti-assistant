export function SelectableRow({itemName, children, content, selectItem, removeItem}) {
  return (
    <div className="selectableRow">
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