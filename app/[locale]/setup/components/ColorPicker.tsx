import { FormattedMessage } from "react-intl";
import { BASE_COLORS } from "../../../../server/data/colors";
import { ClientOnlyHoverMenu } from "../../../../src/HoverMenu";
import { convertToFactionColor } from "../../../../src/util/factions";
import styles from "./ColorPicker.module.scss";

export interface ColorPickerParams {
  pickedColor?: string;
  selectedColors: string[];
  updateColor: (color: FactionColor) => void;
}

export default function ColorPicker({
  pickedColor,
  selectedColors,
  updateColor,
}: ColorPickerParams) {
  return (
    <ClientOnlyHoverMenu
      label={
        <FormattedMessage
          id="Lm8L7/"
          description="Text on a hover menu for picking a player's color."
          defaultMessage="Color"
        />
      }
      renderProps={(closeFn) => {
        return (
          <div className={styles.ColorPicker}>
            {BASE_COLORS.map((color) => {
              const factionColor = convertToFactionColor(color);
              const alreadySelected = selectedColors.includes(color);
              return (
                <button
                  key={color}
                  style={{
                    backgroundColor: factionColor,
                    color: factionColor,
                    opacity:
                      pickedColor !== color && alreadySelected
                        ? 0.25
                        : undefined,
                  }}
                  className={pickedColor === color ? "selected" : ""}
                  onClick={() => {
                    closeFn();
                    updateColor(color);
                  }}
                ></button>
              );
            })}
          </div>
        );
      }}
    ></ClientOnlyHoverMenu>
  );
}
