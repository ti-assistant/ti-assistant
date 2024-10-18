import { CSSProperties, PropsWithChildren } from "react";
import styles from "./SelectableRow.module.scss";
import { rem } from "./util/util";

interface SelectableRowProps<Type extends string> {
  itemId: Type;
  selectItem?: (itemId: Type) => void;
  removeItem?: (itemId: Type) => void;
  style?: CSSProperties;
}

export function SelectableRow<Type extends string>({
  children,
  itemId,
  selectItem,
  removeItem,
  style,
}: PropsWithChildren<SelectableRowProps<Type>>) {
  const iconStyle: CSSProperties = {
    textShadow: "none",
  };
  if (style && style.fontSize) {
    const fontSizeValue = style.fontSize.valueOf();
    if (typeof fontSizeValue === "string") {
      style.fontSize.valueOf();
      const baseSize = parseInt(fontSizeValue.replace("px", ""));
      const size = parseInt(fontSizeValue.replace("px", ""));
      if (baseSize !== 0) {
        iconStyle.fontSize = rem(size);
        iconStyle.width = rem(size);
        iconStyle.height = rem(size);
        iconStyle.lineHeight = rem(size);
        iconStyle.marginRight = rem(3);
        iconStyle.marginLeft = 0;
        style = {
          ...style,
          fontSize: rem(baseSize),
        };
      }
    }
  }

  return (
    <div className={styles.SelectableRow} style={style}>
      {selectItem ? (
        <div
          className="icon clickable positive"
          style={iconStyle}
          onClick={() => selectItem(itemId)}
        >
          +
        </div>
      ) : null}
      {removeItem ? (
        <div
          className="icon clickable negative"
          style={iconStyle}
          onClick={() => removeItem(itemId)}
        >
          &#x2715;
        </div>
      ) : null}
      {children}
    </div>
  );
}
