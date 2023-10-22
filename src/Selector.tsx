import React, { CSSProperties, ReactNode, useEffect } from "react";
import { ClientOnlyHoverMenu } from "./HoverMenu";
import { SelectableRow } from "./SelectableRow";
import LabeledDiv from "./components/LabeledDiv/LabeledDiv";
import { responsivePixels } from "./util/util";

interface SelectorProps<Type extends string> {
  autoSelect?: boolean;
  borderColor?: string;
  buttonStyle?: CSSProperties;
  hoverMenuLabel: ReactNode;
  itemsPerColumn?: number;
  numToSelect?: number;
  options: Type[];
  fadedOptions?: Type[];
  toggleItem: (itemId: Type, add: boolean) => void;
  renderItem?: (itemId: Type) => ReactNode;
  renderButton?: (
    itemId: Type,
    toggleItem: (itemId: Type, add: boolean) => void
  ) => ReactNode;
  selectedItem?: Type;
  selectedLabel?: ReactNode;
  style?: CSSProperties;
}

export function Selector<Type extends string>({
  autoSelect,
  buttonStyle = {},
  hoverMenuLabel,
  itemsPerColumn = 10,
  borderColor,
  fadedOptions = [],
  selectedLabel,
  options,
  toggleItem,
  selectedItem,
  renderItem,
  renderButton,
  style,
}: SelectorProps<Type>) {
  const shouldAutoSelect = !!autoSelect && options.length <= 1;

  useEffect(() => {
    if (shouldAutoSelect) {
      const option = options[0];
      if (!option) {
        return;
      }
      toggleItem(option, true);
    }
  }, [options, toggleItem, shouldAutoSelect]);

  if (selectedItem) {
    const renderedItem = renderItem ? renderItem(selectedItem) : undefined;
    if (renderedItem) {
      return <React.Fragment>{renderedItem}</React.Fragment>;
    }

    const removeItem = shouldAutoSelect
      ? undefined
      : () => toggleItem(selectedItem, false);

    const innerValue = (
      <SelectableRow itemId={selectedItem} removeItem={removeItem}>
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

  const innerStyle: CSSProperties = {
    padding: responsivePixels(8),
    gap: responsivePixels(4),
    alignItems: "stretch",
    justifyContent: "flex-start",
    maxWidth: "88vw",
    overflowX: "auto",
    ...(style ?? {}),
  };

  if (options.length > itemsPerColumn) {
    innerStyle.display = "grid";
    innerStyle.gridAutoFlow = "column";
    innerStyle.gridTemplateRows = `repeat(${itemsPerColumn}, auto)`;
  }

  return (
    <ClientOnlyHoverMenu
      buttonStyle={buttonStyle}
      borderColor={borderColor}
      label={hoverMenuLabel}
      style={{ minWidth: "100%" }}
      renderProps={(closeFn) => (
        <div className="flexColumn" style={innerStyle}>
          {options.map((option) => {
            if (renderButton) {
              return renderButton(option, toggleItem);
            }
            return (
              <button
                key={option}
                className={fadedOptions.includes(option) ? "faded" : ""}
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
          {options.length === 0 ? "No options available" : null}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
