import { CSSProperties, PropsWithChildren } from "react";
import { rem } from "../../util/util";
import styles from "./Chip.module.scss";

interface SelectedCSSProperties extends CSSProperties {
  "--border-color": "var(--neutral-border)";
  "--background-color": "var(--selected-bg)";
  "--font-size": string;
}

interface UnselectedCSSProperties extends CSSProperties {
  "--border-color": "var(--background-color)";
  "--background-color": "var(--interactive-bg)";
  "--font-size": string;
}

type ChipCSSProperties = SelectedCSSProperties | UnselectedCSSProperties;

function getChipStyle(selected: boolean, fontSize: number): ChipCSSProperties {
  if (selected) {
    return {
      "--border-color": "var(--neutral-border)",
      "--background-color": "var(--selected-bg)",
      "--font-size": rem(fontSize),
    };
  }
  return {
    "--border-color": "var(--background-color)",
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
      style={{ "--font-size": rem(fontSize), ...style } as CSSProperties}
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
