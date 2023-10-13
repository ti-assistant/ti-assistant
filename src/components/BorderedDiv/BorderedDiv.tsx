import { CSSProperties, PropsWithChildren } from "react";
import styles from "./BorderedDiv.module.scss";

interface BorderedDivProps {
  color?: string;
  style?: CSSProperties;
}

interface BorderedDivCSS extends CSSProperties {
  "--color": string;
}

export default function BorderedDiv({
  color = "#999",
  children,
  style = {},
}: PropsWithChildren<BorderedDivProps>) {
  const borderedDivStyle: BorderedDivCSS = {
    "--color": color,
    ...style,
  };
  return (
    <div
      className={`flexColumn ${styles.BorderedDiv}`}
      style={borderedDivStyle}
    >
      {children}
    </div>
  );
}
