import React, { CSSProperties, ReactNode, useEffect } from "react";
import { ClientOnlyHoverMenu } from "../../HoverMenu";
import { SelectableRow } from "../../SelectableRow";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { rem } from "../../util/util";

interface SelectorProps<Id extends string, Name extends string> {
  autoSelect?: boolean;
  borderless?: boolean;
  hoverMenuLabel: ReactNode;
  hoverMenuStyle?: CSSProperties;
  icon?: ReactNode;
  itemsPerColumn?: number;
  numToSelect?: number;
  options: { id: Id; name: Name }[];
  fadedOptions?: Id[];
  toggleItem: (itemId: Id, add: boolean) => void;
  renderItem?: (itemId: Id, itemName: Name) => ReactNode;
  selectedItem?: Id;
  selectedLabel?: ReactNode;
  style?: CSSProperties;
  viewOnly?: boolean;
}

interface TypeWithId {
  id: string;
}

function getItemWithId<Type extends TypeWithId>(id: string, items: Type[]) {
  for (const item of items) {
    if (item.id === id) {
      return item;
    }
  }
  return null;
}

export function Selector<Id extends string, Name extends string>({
  autoSelect,
  borderless,
  hoverMenuLabel,
  hoverMenuStyle = {},
  icon,
  itemsPerColumn = 10,
  fadedOptions = [],
  selectedLabel,
  options,
  toggleItem,
  selectedItem,
  renderItem,
  style,
  viewOnly,
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
        viewOnly={viewOnly}
      >
        {selectedOption.name}
      </SelectableRow>
    );
    if (selectedLabel) {
      return (
        <LabeledDiv label={selectedLabel} icon={icon}>
          {innerValue}
        </LabeledDiv>
      );
    }
    return innerValue;
  }

  const innerStyle: CSSProperties = {
    padding: rem(8),
    gap: rem(4),
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
      label={hoverMenuLabel}
      borderless={borderless}
      style={{ minWidth: "100%" }}
      buttonStyle={hoverMenuStyle}
      renderProps={(closeFn) => (
        <div className="flexColumn" style={innerStyle}>
          {options.map((option) => {
            return (
              <button
                key={option.id}
                className={fadedOptions.includes(option.id) ? "faded" : ""}
                style={{ fontSize: rem(14) }}
                onClick={() => {
                  closeFn();
                  toggleItem(option.id, true);
                }}
                disabled={viewOnly}
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
