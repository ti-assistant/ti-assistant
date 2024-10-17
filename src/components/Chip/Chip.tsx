import { CSSProperties, PropsWithChildren } from "react";
import styles from "./Chip.module.scss";
import { rem } from "../../util/util";

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

function getChipStyle(selected: boolean, fontSize: number): ChipCSSProperties {
  if (selected) {
    return {
      "--border-color": "#eee",
      "--background-color": "#444",
      "--font-size": rem(fontSize),
    };
  }
  return {
    "--border-color": "#111",
    "--background-color": "#333",
    "--font-size": rem(fontSize),
  };
}

interface ChipProps {
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
  fontSize?: number;
  style?: CSSProperties;
}

export default function Chip({
  selected,
  toggleFn,
  fontSize = 12,
  style = {},
  children,
}: PropsWithChildren<ChipProps>) {
  let chipStyle = getChipStyle(selected, fontSize);
  return (
    <label className={styles.ChipContainer} style={{ ...chipStyle, ...style }}>
      <input
        type="radio"
        onChange={() => toggleFn(selected)}
        checked={selected}
      ></input>
      {children}
    </label>
  );
}
