import { Fragment } from "react";
import { lerp, rem } from "../../../../../../src/util/util";

export interface Line {
  points: Point[];
  color: string;
}

export interface Point {
  x: number;
  y: number;
}

export default function Graph({
  xAxis,
  yAxis,
  lines,
}: {
  xAxis: number;
  yAxis: number;
  lines: Line[];
}) {
  const xGrid = new Array(xAxis + 1).fill(0);
  const yGrid = new Array(yAxis + 1).fill(0);
  return (
    <svg
      viewBox="-4 -4 128 108"
      style={{
        height: "100%",
        backgroundColor: "var(--light-bg)",
        borderRadius: rem(4),
      }}
    >
      {xGrid.map((_, index) => {
        const x = 4 + lerp(0, xAxis, index) * 116;
        return (
          <Fragment key={index}>
            <text
              fill="#eee"
              font-size="4"
              font-family="Slider"
              x={x}
              y="102"
              textAnchor="middle"
            >
              {index}
            </text>
            <line
              stroke="#eee"
              opacity={0.25}
              strokeWidth={0.1}
              x1={x}
              x2={x}
              y1="-2"
              y2="97"
            />
          </Fragment>
        );
      })}
      {yGrid.map((_, index) => {
        const y = 98 - lerp(0, yAxis, index) * 97;
        return (
          <Fragment key={index}>
            <text
              fill="#eee"
              font-size="4"
              font-family="Slider"
              x="0"
              y={y}
              textAnchor="middle"
            >
              {index}
            </text>
            <line
              stroke="#eee"
              opacity={0.25}
              strokeWidth={0.1}
              x1="4"
              x2="132"
              y1={y - 1}
              y2={y - 1}
            />
          </Fragment>
        );
      })}
      {lines.map((line, index) => {
        return (
          <Fragment key={index}>
            {line.points.map((point, index) => {
              const x = 4 + lerp(0, xAxis, point.x) * 116;
              const y = 97 - lerp(0, yAxis, point.y) * 97;
              const nextPoint = line.points[index + 1];
              const nextX = nextPoint
                ? 4 + lerp(0, xAxis, nextPoint.x) * 116
                : 0;
              const nextY = nextPoint
                ? 97 - lerp(0, yAxis, nextPoint.y) * 97
                : 0;

              return (
                <Fragment key={index}>
                  {nextPoint ? (
                    <path
                      d={`M ${x},${y} ${nextX},${nextY}`}
                      fill="none"
                      style={{ transition: "d 150ms" }}
                      stroke={line.color}
                      strokeWidth={0.5}
                    />
                  ) : null}
                  <circle
                    style={{ transition: "cx 150ms, cy 150ms" }}
                    cx={x}
                    cy={y}
                    r={1}
                    fill={line.color}
                  />
                </Fragment>
              );
            })}
          </Fragment>
        );
      })}
    </svg>
  );
}
