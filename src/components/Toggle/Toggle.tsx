import { PropsWithChildren } from "react";
import styles from "./Toggle.module.scss";

interface ToggleProps {
  selected: boolean;
  toggleFn: (prevValue: boolean) => void;
}

export default function Toggle({
  selected,
  toggleFn,
  children,
}: PropsWithChildren<ToggleProps>) {
  const border = `1px solid ${selected ? "green" : "red"}`;
  const backgroundColor = selected ? "#444" : "#333";
  return (
    <div
      className={styles.ToggleContainer}
      style={{
        border,
        backgroundColor,
      }}
      onClick={() => toggleFn(selected)}
    >
      <input type="checkbox" checked={selected}></input>
      <label
        style={{
          cursor: "pointer",
        }}
      >
        {children}
      </label>
    </div>
  );
}
