import { CSSProperties } from "react";
import { rem } from "../../util/util";

interface TimerDisplayProps {
  time: number;
  width?: number;
  style?: CSSProperties;
}

export default function TimerDisplay({
  time,
  width = 152,
  style = {},
}: TimerDisplayProps) {
  let hours = Math.min(Math.floor(time / 3600), 99);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  let template =
    "repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr))";

  const tenHours = Math.floor(hours / 10);

  if (tenHours === 0) {
    template =
      "minmax(0, 2fr) minmax(0, 1fr) repeat(2, minmax(0, 2fr)) minmax(0, 1fr) repeat(2, minmax(0, 2fr))";
    width = Math.floor((width * 9) / 10);
  }

  const timerStyle = {
    width: rem(width),
    gap: 0,
    fontFamily: "Slider",
    justifyContent: "center",
    display: "grid",
    gridTemplateColumns: template,
    ...style,
  };
  const oneHours = hours % 10;
  const tenMinutes = Math.floor(minutes / 10);
  const oneMinutes = minutes % 10;
  const tenSeconds = Math.floor(seconds / 10);
  const oneSeconds = seconds % 10;

  const numberStyle: CSSProperties = {
    textAlign: "center",
  };

  return (
    <div className="flexRow" style={timerStyle}>
      {tenHours > 0 ? <span style={numberStyle}>{tenHours}</span> : null}
      <span style={numberStyle}>{oneHours}</span>
      <span style={numberStyle}>:</span>
      <span style={numberStyle}>{tenMinutes}</span>
      <span style={numberStyle}>{oneMinutes}</span>
      <span style={numberStyle}>:</span>
      <span style={numberStyle}>{tenSeconds}</span>
      <span style={numberStyle}>{oneSeconds}</span>

      {tenHours === 0 ? null : null}
    </div>
  );
}
