import { CSSProperties, PropsWithChildren } from "react";
import { responsivePixels } from "./util/util";

export interface SelectableRowProps {
  itemName: string;
  selectItem?: (itemName: string) => void;
  removeItem?: (itemName: string) => void;
  style?: CSSProperties;
}

export function SelectableRow({
  children,
  itemName,
  selectItem,
  removeItem,
  style,
}: PropsWithChildren<SelectableRowProps>) {
  const iconStyle: CSSProperties = {};
  if (style && style.fontSize) {
    const fontSizeValue = style.fontSize.valueOf();
    if (typeof fontSizeValue === "string") {
      style.fontSize.valueOf();
      const baseSize = parseInt(fontSizeValue.replace("px", ""));
      const size = parseInt(fontSizeValue.replace("px", "")) + 8;
      iconStyle.fontSize = responsivePixels(size);
      iconStyle.width = responsivePixels(size);
      iconStyle.height = responsivePixels(size);
      iconStyle.lineHeight = responsivePixels(size);
      style = {
        ...style,
        fontSize: responsivePixels(baseSize),
      };
    }
  }

  return (
    <div className="selectableRow" style={style}>
      {selectItem ? (
        <div
          className="icon clickable positive"
          style={iconStyle}
          onClick={() => selectItem(itemName)}
        >
          +
        </div>
      ) : null}
      {removeItem ? (
        <div
          className="icon clickable negative"
          style={iconStyle}
          onClick={() => removeItem(itemName)}
        >
          &#x2715;
        </div>
      ) : null}
      {children}
    </div>
  );
}
