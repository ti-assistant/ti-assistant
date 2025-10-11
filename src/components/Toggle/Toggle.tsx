import { CSSProperties, PropsWithChildren, ReactNode, use } from "react";
import { ModalContext } from "../../context/contexts";
import { rem } from "../../util/util";
import { ModalContent } from "../Modal/Modal";
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
  const { openModal } = use(ModalContext);

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
        <div
          className="popupIcon"
          style={{
            fontSize: rem(16),
          }}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            openModal(
              <ModalContent
                title={
                  <div
                    className="flexRow"
                    style={{ fontSize: rem(40), gap: rem(20) }}
                  >
                    {info.title}
                  </div>
                }
              >
                <InfoContent description={info.description} />
              </ModalContent>
            );
          }}
        >
          &#x24D8;
        </div>
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
