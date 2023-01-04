export function SelectableRow({itemName, children, content, selectItem, removeItem, style}) {
  const iconStyle = {};
  if (style && style.fontSize) {
    const size = parseInt(style.fontSize.replace("px", "")) + 12;
    iconStyle.fontSize = `${size}px`;
    iconStyle.width = `${size}px`;
    iconStyle.height = `${size}px`;
    iconStyle.lineHeight = `${size}px`;
  }
  
  return (
    <div className="selectableRow" style={style}>
      {selectItem ? 
        <div
          className="icon clickable positive"
          style={iconStyle}
          onClick={() => selectItem(itemName)}
        >
          &#x2713;
        </div>
      : null}
      {removeItem ? 
        <div
          className="icon clickable negative"
          style={iconStyle}
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