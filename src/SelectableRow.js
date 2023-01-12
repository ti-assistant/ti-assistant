import { responsivePixels } from "./util/util";

export function SelectableRow({itemName, children, content, selectItem, removeItem, style}) {
  const iconStyle = {};
  if (style && style.fontSize) {
    const baseSize = parseInt(style.fontSize.replace("px", ""));
    const size = parseInt(style.fontSize.replace("px", "")) + 8;
    iconStyle.fontSize = responsivePixels(size);
    iconStyle.width = responsivePixels(size);
    iconStyle.height = responsivePixels(size);
    iconStyle.lineHeight = responsivePixels(size);
    style = {
      ...style,
      fontSize: responsivePixels(baseSize),
    }
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