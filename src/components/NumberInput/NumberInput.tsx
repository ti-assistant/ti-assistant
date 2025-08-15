import { CSSProperties } from "react";
import styles from "./NumberInput.module.scss";
import { rem } from "../../util/util";

interface NumberInputCSS extends CSSProperties {
  "--up-arrow-color": string;
  "--down-arrow-color": string;
}

export default function NumberInput({
  value,
  maxValue = Number.MAX_SAFE_INTEGER,
  softMax = Number.MAX_SAFE_INTEGER,
  softMin = Number.MIN_SAFE_INTEGER,
  minValue = Number.MIN_SAFE_INTEGER,
  onChange,
  viewOnly,
}: {
  onChange: (value: number) => void;
  maxValue?: number;
  softMax?: number;
  softMin?: number;
  minValue?: number;
  value: number;
  viewOnly?: boolean;
}) {
  function updateValue(element: HTMLDivElement) {
    if (element.innerText !== "") {
      const numerical = parseInt(element.innerText);
      if (!isNaN(numerical) && numerical <= maxValue && numerical >= minValue) {
        onChange(numerical);
        element.innerText = numerical.toString();
        return;
      }
    }
    element.innerText = value.toString();
  }

  const numberInputStyle: NumberInputCSS = {
    "--down-arrow-color": value <= softMin ? "#555" : "#ddd",
    "--up-arrow-color": value >= softMax ? "#555" : "#ddd",
  };

  return (
    <div className={styles.NumberInput} style={numberInputStyle}>
      {!viewOnly && value > minValue ? (
        <div
          className={`${styles.arrow} ${styles.arrowDown}`}
          onClick={() => onChange(value - 1)}
        ></div>
      ) : (
        <div style={{ width: rem(12) }}></div>
      )}
      <div
        className={styles.InputBox}
        contentEditable={!viewOnly}
        suppressContentEditableWarning
        onClick={
          viewOnly
            ? undefined
            : (e) => {
                e.currentTarget.innerText = "";
              }
        }
        onBlur={(e) => updateValue(e.currentTarget)}
      >
        {value}
      </div>
      {!viewOnly && value < maxValue ? (
        <div
          className={`${styles.arrow} ${styles.arrowUp}`}
          onClick={() => onChange(value + 1)}
        ></div>
      ) : (
        <div style={{ width: rem(12) }}></div>
      )}
    </div>
  );
}
