import { useIntl } from "react-intl";
import { OUTER_BLACK_BORDER_GLOW } from "../../../src/util/borderGlow";
import styles from "./PlayerNameInput.module.scss";

export interface PlayerNameInputParams {
  color?: string;
  updatePlayerName: (name: string) => void;
  playerName?: string;
  tabIndex?: number;
}

export default function PlayerNameInput({
  color,
  updatePlayerName,
  playerName,
  tabIndex,
}: PlayerNameInputParams) {
  const intl = useIntl();

  function updateName(element: HTMLInputElement) {
    if (element.value === "") {
      element.value = playerName ?? "";
      return;
    }
    if (element.value === playerName) {
      return;
    }

    updatePlayerName(element.value);
  }

  return (
    <input
      defaultValue={playerName}
      tabIndex={tabIndex}
      type="textbox"
      spellCheck={false}
      placeholder={intl.formatMessage({
        id: "4n1LQO",
        description: "Initial text in a textbox used to input a player's name",
        defaultMessage: "Enter Player Name...",
      })}
      className={styles.PlayerNameInput}
      style={{
        borderColor: color,
        boxShadow: color === "Black" ? OUTER_BLACK_BORDER_GLOW : undefined,
      }}
      onFocus={(e) => (e.currentTarget.value = "")}
      onClick={(e) => (e.currentTarget.value = "")}
      onBlur={(e) => updateName(e.currentTarget)}
    />
  );
}
