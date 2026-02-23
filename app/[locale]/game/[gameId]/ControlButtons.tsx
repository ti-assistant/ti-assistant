"use client";

import { useRef } from "react";
import { useGameId, useViewOnly } from "../../../../src/context/dataHooks";
import { useEnterPassword } from "../../../../src/util/api/enterPassword";
import styles from "./game-page.module.scss";

export default function ControlButtons() {
  const gameId = useGameId();
  const enterPassword = useEnterPassword();
  const viewOnly = useViewOnly();
  const passwordRef = useRef<HTMLInputElement>(null);

  if (!viewOnly) {
    return null;
  }

  return (
    <div className={styles.ControlButtons}>
      <div className="flexRow">
        <input
          ref={passwordRef}
          type="textbox"
          placeholder="Enter Password"
        ></input>
        <button
          onClick={() => {
            const password = passwordRef.current?.value;
            if (!password) {
              return;
            }
            enterPassword(gameId, password);
          }}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
