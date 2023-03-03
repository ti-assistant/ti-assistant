import { CSSProperties, useState } from "react";

export function LockedButtons({
  buttons,
  style = {},
  unlocked,
}: {
  buttons: {
    text: string;
    style?: CSSProperties;
    onClick: () => void;
  }[];
  buttonStyle?: CSSProperties;
  style?: CSSProperties;
  unlocked: boolean;
}) {
  const [locked, setLocked] = useState(true);

  return (
    <div className="flexRow" style={style}>
      {!unlocked ? (
        locked ? (
          <div style={{ cursor: "pointer" }} onClick={() => setLocked(false)}>
            &#128274;
          </div>
        ) : (
          <div style={{ cursor: "pointer" }} onClick={() => setLocked(true)}>
            &#128275;
          </div>
        )
      ) : null}
      {buttons.map((button) => {
        return (
          <button
            key={button.text}
            disabled={!unlocked && locked}
            onClick={button.onClick}
            style={button.style ?? {}}
          >
            {button.text}
          </button>
        );
      })}
    </div>
  );
}
