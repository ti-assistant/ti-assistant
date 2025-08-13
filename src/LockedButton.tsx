import { CSSProperties, useState } from "react";

export function LockedButtons({
  buttons,
  style = {},
  unlocked,
  viewOnly,
}: {
  buttons: {
    text: string;
    style?: CSSProperties;
    onClick: () => void;
  }[];
  buttonStyle?: CSSProperties;
  style?: CSSProperties;
  unlocked: boolean;
  viewOnly?: boolean;
}) {
  const [locked, setLocked] = useState(true);

  return (
    <div className="flexRow" style={style}>
      {!unlocked && !viewOnly ? (
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
            disabled={(!unlocked && locked) || viewOnly}
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
