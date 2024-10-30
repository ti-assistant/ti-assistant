import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Toggle.module.scss";

interface SelectedCSSProperties extends CSSProperties {
  "--border-color": "#999";
  "--background-color": "#444";
}

interface UnselectedCSSProperties extends CSSProperties {
  "--border-color": "#222";
  "--background-color": "#333";
}

type ToggleCSSProperties = SelectedCSSProperties | UnselectedCSSProperties;

function getToggleStyle(selected: boolean): ToggleCSSProperties {
  if (selected) {
    return {
      "--border-color": "#999",
      "--background-color": "#444",
    };
  }
  return {
    "--border-color": "#222",
    "--background-color": "#333",
  };
}

interface ToggleProps {
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
}

export default function Toggle({
  selected,
  toggleFn,
  children,
}: PropsWithChildren<ToggleProps>) {
  let toggleStyle = getToggleStyle(selected);
  return (
    <label className={styles.ToggleContainer} style={toggleStyle}>
      <input
        type="checkbox"
        onChange={() => toggleFn(selected)}
        checked={selected}
      ></input>
      {children}
    </label>
  );
}
