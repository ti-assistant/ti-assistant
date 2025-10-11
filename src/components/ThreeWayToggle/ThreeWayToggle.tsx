import { CSSProperties, PropsWithChildren, ReactNode, use } from "react";
import { ModalContext } from "../../context/contexts";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import { ModalContent } from "../Modal/Modal";
import styles from "./ThreeWayToggle.module.scss";

interface SelectedCSSProperties extends CSSProperties {
  "--toggle-color": "var(--selected-bg)";
}

interface UnselectedCSSProperties extends CSSProperties {
  "--toggle-color": "var(--interactive-bg)";
}

type ToggleCSSProperties = SelectedCSSProperties | UnselectedCSSProperties;

function getToggleClass(selected?: ToggleOptions) {
  if (!selected) {
    return "";
  }
  return selected === "Positive" ? styles.Positive : styles.Negative;
}

type ToggleOptions = Optional<"Positive" | "Negative">;

interface ToggleInfo {
  title: ReactNode;
  description: ReactNode;
}

interface ToggleProps {
  disabled?: boolean;
  info?: ToggleInfo;
  selected: ToggleOptions;
  toggleFn: (newVal: ToggleOptions) => void;
  style?: CSSProperties;
}

export default function ThreeWayToggle({
  selected,
  toggleFn,
  children,
  style = {},
  disabled,
  info,
}: PropsWithChildren<ToggleProps>) {
  const { openModal } = use(ModalContext);

  return (
    <label
      className={`${styles.ToggleContainer} ${getToggleClass(selected)} ${
        disabled ? styles.disabled : ""
      }`}
      style={{ ...style }}
    >
      <input
        className={styles.Positive}
        type="checkbox"
        onChange={() => {
          const newVal = selected === "Positive" ? undefined : "Positive";
          toggleFn(newVal);
        }}
        checked={selected === "Positive"}
        disabled={disabled}
      ></input>
      <span
        onClick={(e) => {
          let newVal: ToggleOptions;
          if (!selected) {
            newVal = "Positive";
          }
          if (selected === "Positive") {
            newVal = "Negative";
          }
          e.preventDefault();
          toggleFn(newVal);
        }}
      >
        {children}
      </span>
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
      <input
        className={styles.Negative}
        type="checkbox"
        onChange={() => {
          const newVal = selected === "Negative" ? undefined : "Negative";
          toggleFn(newVal);
        }}
        checked={selected === "Negative"}
        disabled={disabled}
      ></input>
    </label>
  );
}

function InfoContent({ description }: { description: ReactNode }) {
  return (
    <div
      className="myriadPro"
      style={{
        boxSizing: "border-box",
        width: "100%",
        minWidth: rem(320),
        padding: rem(4),
        whiteSpace: "pre-line",
        textAlign: "center",
        fontSize: rem(32),
      }}
    >
      <div className="flexColumn" style={{ gap: rem(32) }}>
        {description}
      </div>
    </div>
  );
}
