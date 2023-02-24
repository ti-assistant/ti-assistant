import { CSSProperties, PropsWithChildren, ReactNode, useEffect } from "react";
import { HoverMenu } from "./HoverMenu";
import { LabeledDiv } from "./LabeledDiv";
import { SelectableRow } from "./SelectableRow";
import { responsivePixels } from "./util/util";

export interface SelectorProps {
  hoverMenuLabel: ReactNode;
  options: string[];
  selectItem: (itemName: string | undefined) => void;
  selectedItem?: string;
  selectedLabel?: ReactNode;
  style?: CSSProperties;
}

export function Selector({
  hoverMenuLabel,
  selectedLabel,
  options,
  selectItem,
  selectedItem,
  style,
}: SelectorProps) {
  useEffect(() => {
    if (options.length === 1) {
      selectItem(options[0]);
    }
  }, [options, selectItem]);

  let removeItem =
    options.length === 1 ? undefined : () => selectItem(undefined);

  if (selectedItem) {
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

  return (
    <HoverMenu label={hoverMenuLabel}>
      <div
        className="flexColumn"
        style={{
          padding: responsivePixels(8),
          gap: responsivePixels(4),
          alignItems: "stretch",
          ...(style ?? {}),
        }}
      >
        {options.map((option) => {
          return (
            <button key={option} onClick={() => selectItem(option)}>
              {option}
            </button>
          );
        })}
      </div>
    </HoverMenu>
  );
}
