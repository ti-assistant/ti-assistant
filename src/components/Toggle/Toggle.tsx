import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Toggle.module.scss";

interface SelectedCSSProperties extends CSSProperties {
  "--border-color": "var(--background-color)";
  "--toggle-color": "var(--selected-bg)";
}

interface UnselectedCSSProperties extends CSSProperties {
  "--border-color": "var(--background-color)";
  "--toggle-color": "var(--interactive-bg)";
}

type ToggleCSSProperties = SelectedCSSProperties | UnselectedCSSProperties;

function getToggleStyle(selected: boolean): ToggleCSSProperties {
  if (selected) {
    return {
      "--border-color": "var(--background-color)",
      "--toggle-color": "var(--selected-bg)",
    };
  }
  return {
    "--border-color": "var(--background-color)",
    "--toggle-color": "var(--interactive-bg)",
  };
}

interface ToggleProps {
  disabled?: boolean;
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
}

export default function Toggle({
  selected,
  toggleFn,
  children,
  disabled,
}: PropsWithChildren<ToggleProps>) {
  let toggleStyle = getToggleStyle(selected);
  return (
    <label
      className={`${styles.ToggleContainer} ${disabled ? styles.disabled : ""}`}
      style={toggleStyle}
    >
      <input
        type="checkbox"
        onChange={() => toggleFn(selected)}
        checked={selected}
        disabled={disabled}
      ></input>
      {children}
    </label>
  );
}
