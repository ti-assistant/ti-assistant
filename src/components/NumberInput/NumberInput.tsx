import { CSSProperties } from "react";
import { responsivePixels } from "../../util/util";
import styles from "./NumberInput.module.scss";

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
}: {
  onChange: (value: number) => void;
  maxValue?: number;
  softMax?: number;
  softMin?: number;
  minValue?: number;
  value: number;
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
      {value > minValue ? (
        <div
          className={`${styles.arrow} ${styles.arrowDown}`}
          onClick={() => onChange(value - 1)}
        ></div>
      ) : (
        <div style={{ width: responsivePixels(12) }}></div>
      )}
      <div
        className={styles.InputBox}
        contentEditable
        suppressContentEditableWarning
        onClick={(e) => {
          e.currentTarget.innerText = "";
        }}
        onBlur={(e) => updateValue(e.currentTarget)}
      >
        {value}
      </div>
      {value < maxValue ? (
        <div
          className={`${styles.arrow} ${styles.arrowUp}`}
          onClick={() => onChange(value + 1)}
        ></div>
      ) : (
        <div style={{ width: responsivePixels(12) }}></div>
      )}
    </div>
  );
}
