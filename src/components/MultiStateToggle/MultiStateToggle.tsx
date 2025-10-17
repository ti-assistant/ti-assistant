import { CSSProperties, PropsWithChildren, ReactNode, use } from "react";
import { ModalContext } from "../../context/contexts";
import { Optional } from "../../util/types/types";
import { rem } from "../../util/util";
import { ModalContent } from "../Modal/Modal";
import styles from "./MultiStateToggle.module.scss";

interface PositiveCSSProperties extends CSSProperties {
  "--border-color": "var(--background-color)";
  "--toggle-color": "var(--selected-bg)";
}

interface NegativeCSSProperties extends CSSProperties {
  "--border-color": "var(--background-color)";
  "--toggle-color": "var(--light-bg)";
}

interface UnselectedCSSProperties extends CSSProperties {
  "--border-color": "var(--background-color)";
  "--toggle-color": "var(--interactive-bg)";
}

type ToggleCSSProperties =
  | PositiveCSSProperties
  | NegativeCSSProperties
  | UnselectedCSSProperties;

function getToggleStyle(selected: ToggleOptions): ToggleCSSProperties {
  if (selected === "Positive") {
    return {
      "--border-color": "var(--background-color)",
      "--toggle-color": "var(--selected-bg)",
    };
  }
  if (selected === "Negative") {
    return {
      "--border-color": "var(--background-color)",
      "--toggle-color": "var(--light-bg)",
    };
  }
  return {
    "--border-color": "var(--background-color)",
    "--toggle-color": "var(--interactive-bg)",
  };
}
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

function getNextValue(value: ToggleOptions): ToggleOptions {
  if (!value) {
    return "Positive";
  }
  switch (value) {
    case "Positive":
      return "Negative";
    case "Negative":
      return;
  }
}

export default function MultiStateToggle({
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
      style={{ ...getToggleStyle(selected), ...style }}
    >
      <input
        type="checkbox"
        onChange={() => toggleFn(getNextValue(selected))}
        checked={!!selected}
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
