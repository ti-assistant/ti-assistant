import React, {
  CSSProperties,
  PropsWithChildren,
  ReactNode,
  useEffect,
} from "react";
import { ClientOnlyHoverMenu, HoverMenu } from "./HoverMenu";
import { LabeledDiv } from "./LabeledDiv";
import { SelectableRow } from "./SelectableRow";
import { responsivePixels } from "./util/util";

export interface SelectorProps {
  autoSelect?: boolean;
  hoverMenuLabel: ReactNode;
  numToSelect?: number;
  options: string[];
  toggleItem: (itemName: string, add: boolean) => void;
  renderItem?: (itemName: string) => ReactNode;
  renderButton?: (
    itemName: string,
    toggleItem: (itemName: string, add: boolean) => void
  ) => ReactNode;
  selectedItem?: string;
  selectedLabel?: ReactNode;
  style?: CSSProperties;
}

export function Selector({
  autoSelect,
  hoverMenuLabel,
  selectedLabel,
  options,
  toggleItem,
  selectedItem,
  renderItem,
  renderButton,
  style,
}: SelectorProps) {
  useEffect(() => {
    if (autoSelect && options.length === 1) {
      const option = options[0];
      if (!option) {
        return;
      }
      toggleItem(option, true);
    }
  }, [options, toggleItem, autoSelect]);

  if (selectedItem) {
    const renderedItem = renderItem ? renderItem(selectedItem) : undefined;
    if (renderedItem) {
      return <React.Fragment>{renderedItem}</React.Fragment>;
    }

    const removeItem =
      options.length === 1 ? undefined : () => toggleItem(selectedItem, false);

    const innerValue = (
      <SelectableRow itemName={selectedItem} removeItem={removeItem}>
        {selectedItem}
      </SelectableRow>
    );
    if (selectedLabel) {
      return (
        <LabeledDiv label={selectedLabel} noBlur={true}>
          {innerValue}
        </LabeledDiv>
      );
    }
    return innerValue;
  }

  const innerStyle = {
    padding: responsivePixels(8),
    gap: responsivePixels(4),
    alignItems: "stretch",
    justifyContent: "flex-start",
    maxWidth: "88vw",
    overflowX: "auto",
    ...(style ?? {}),
  };

  if (options.length > 10) {
    innerStyle.display = "grid";
    innerStyle.gridAutoFlow = "column";
    innerStyle.gridTemplateRows = "repeat(10, auto)";
  }

  return (
    <ClientOnlyHoverMenu
      label={hoverMenuLabel}
      renderProps={(closeFn) => (
        <div className="flexColumn" style={innerStyle}>
          {options.map((option) => {
            if (renderButton) {
              return renderButton(option, toggleItem);
            }
            return (
              <button
                key={option}
                style={{ fontSize: responsivePixels(14) }}
                onClick={() => {
                  closeFn();
                  toggleItem(option, true);
                }}
              >
                {option}
              </button>
            );
          })}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
