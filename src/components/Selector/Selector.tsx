import React, { CSSProperties, ReactNode, useEffect } from "react";
import { SelectableRow } from "../../SelectableRow";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { ClientOnlyHoverMenu } from "../../HoverMenu";

interface SelectorProps<Id extends string, Name extends string> {
  autoSelect?: boolean;
  borderColor?: string;
  buttonStyle?: CSSProperties;
  hoverMenuLabel: ReactNode;
  itemsPerColumn?: number;
  numToSelect?: number;
  options: { id: Id; name: Name }[];
  fadedOptions?: Id[];
  toggleItem: (itemId: Id, add: boolean) => void;
  renderItem?: (itemId: Id, itemName: Name) => ReactNode;
  renderButton?: (
    itemId: Id,
    itemName: Name,
    toggleItem: (itemId: Id, add: boolean) => void
  ) => ReactNode;
  selectedItem?: Id;
  selectedLabel?: ReactNode;
  style?: CSSProperties;
}

interface IdType {
  id: string;
}

function getItemWithId<Type extends IdType>(id: string, items: Type[]) {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}

export function Selector<Id extends string, Name extends string>({
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
}: SelectorProps<Id, Name>) {
  const shouldAutoSelect = !!autoSelect && options.length <= 1;

  useEffect(() => {
    if (shouldAutoSelect && !selectedItem) {
      const option = options[0];
      if (!option) {
        return;
      }
      toggleItem(option.id, true);
    }
  }, [options, toggleItem, shouldAutoSelect, selectedItem]);

  if (selectedItem) {
    const selectedOption = getItemWithId(selectedItem, options);
    if (!selectedOption) {
      console.warn("Missing selected option from list of options.");
      return <React.Fragment>{selectedItem}</React.Fragment>;
    }
    const renderedItem = renderItem
      ? renderItem(selectedItem, selectedOption.name)
      : undefined;
    if (renderedItem) {
      return <React.Fragment>{renderedItem}</React.Fragment>;
    }

    const removeItem = shouldAutoSelect
      ? undefined
      : () => toggleItem(selectedItem, false);

    const innerValue = (
      <SelectableRow
        itemId={selectedItem}
        removeItem={removeItem}
        style={style}
      >
        {selectedOption.name}
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
    padding: "8px",
    gap: "4px",
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
              return renderButton(option.id, option.name, toggleItem);
            }
            return (
              <button
                key={option.id}
                className={fadedOptions.includes(option.id) ? "faded" : ""}
                style={{ fontSize: "14px" }}
                onClick={() => {
                  closeFn();
                  toggleItem(option.id, true);
                }}
              >
                {option.name}
              </button>
            );
          })}
          {options.length === 0 ? "No options available" : null}
        </div>
      )}
    ></ClientOnlyHoverMenu>
  );
}
