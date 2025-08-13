import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Chip.module.scss";
import { rem } from "../../util/util";

interface SelectedCSSProperties extends CSSProperties {
  "--border-color": "#b8b8b8";
  "--background-color": "var(--selected-bg)";
  "--font-size": string;
}

interface UnselectedCSSProperties extends CSSProperties {
  "--border-color": "#111";
  "--background-color": "var(--interactive-bg)";
  "--font-size": string;
}

type ChipCSSProperties = SelectedCSSProperties | UnselectedCSSProperties;

function getChipStyle(selected: boolean, fontSize: number): ChipCSSProperties {
  if (selected) {
    return {
      "--border-color": "#b8b8b8",
      "--background-color": "var(--selected-bg)",
      "--font-size": rem(fontSize),
    };
  }
  return {
    "--border-color": "#111",
    "--background-color": "var(--interactive-bg)",
    "--font-size": rem(fontSize),
  };
}

interface ChipProps {
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
  fontSize?: number;
  style?: CSSProperties;
  disabled?: boolean;
}

export default function Chip({
  selected,
  toggleFn,
  fontSize = 12,
  style = {},
  children,
  disabled,
}: PropsWithChildren<ChipProps>) {
  let chipStyle = getChipStyle(selected, fontSize);
  return (
    <label
      className={`${styles.ChipContainer}  ${disabled ? styles.disabled : ""}`}
      style={{ ...chipStyle, ...style }}
    >
      <input
        type="radio"
        onChange={() => toggleFn(selected)}
        checked={selected}
        disabled={disabled}
      ></input>
      {children}
    </label>
  );
}
