import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import InfoModal from "../../InfoModal";
import { rem } from "../../util/util";
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

interface ToggleInfo {
  title: ReactNode;
  description: ReactNode;
}

interface ToggleProps {
  disabled?: boolean;
  info?: ToggleInfo;
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
  style?: CSSProperties;
}

export default function Toggle({
  selected,
  toggleFn,
  children,
  style = {},
  disabled,
  info,
}: PropsWithChildren<ToggleProps>) {
  let toggleStyle = getToggleStyle(selected);
  return (
    <label
      className={`${styles.ToggleContainer} ${disabled ? styles.disabled : ""}`}
      style={{ ...toggleStyle, ...style }}
    >
      <input
        type="checkbox"
        onChange={() => toggleFn(selected)}
        checked={selected}
        disabled={disabled}
      ></input>
      {children}
      {info ? (
        <InfoModal title={info.title} style={{ marginLeft: rem(8) }}>
          <InfoContent description={info.description} />
        </InfoModal>
      ) : null}
    </label>
  );
}

function InfoContent({ description }: { description: ReactNode }) {
  return (
    <div className={styles.ToggleInfo}>
      <div className="flexColumn" style={{ gap: rem(32) }}>
        {description}
      </div>
    </div>
  );
}
