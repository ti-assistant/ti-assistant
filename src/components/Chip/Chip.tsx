import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Chip.module.scss";

interface SelectedCSSProperties extends CSSProperties {
  "--border-color": "#eee";
  "--background-color": "#444";
  "--font-size": string;
}

interface UnselectedCSSProperties extends CSSProperties {
  "--border-color": "#111";
  "--background-color": "#333";
  "--font-size": string;
}

type ChipCSSProperties = SelectedCSSProperties | UnselectedCSSProperties;

function getChipStyle(selected: boolean, fontSize: string): ChipCSSProperties {
  if (selected) {
    return {
      "--border-color": "#eee",
      "--background-color": "#444",
      "--font-size": fontSize,
    };
  }
  return {
    "--border-color": "#111",
    "--background-color": "#333",
    "--font-size": fontSize,
  };
}

interface ChipProps {
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
  fontSize?: string;
}

export default function Chip({
  selected,
  toggleFn,
  fontSize = "12px",
  children,
}: PropsWithChildren<ChipProps>) {
  let chipStyle = getChipStyle(selected, fontSize);
  return (
    <label className={styles.ChipContainer} style={chipStyle}>
      <input
        type="radio"
        onChange={() => toggleFn(selected)}
        checked={selected}
      ></input>
      {children}
    </label>
  );
}
