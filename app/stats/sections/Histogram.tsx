import { HistogramData } from "./types";
import styles from "./Histogram.module.scss";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";

export function Histogram({ histogram }: { histogram: HistogramData }) {
  const [maxVal, minVal] = Object.values(histogram).reduce(
    ([maxVal, minVal], curr) => {
      return [Math.max(maxVal, curr), Math.min(minVal, curr)];
    },
    [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER]
  );

  return (
    <div className={styles.Histogram}>
      {Object.entries(histogram).map(([key, value]) => {
        let height: number;
        if (minVal === 0) {
          height = (value / maxVal) * 100;
        } else {
          height = 25 + (75 / (maxVal - minVal)) * (value - minVal);
        }
        return (
          <div
            key={key}
            className="flexColumn"
            style={{ height: "100%", gap: "2px" }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                height: "100%",
                width: "16px",
                alignItems: "flex-end",
              }}
            >
              <div
                className="flexRow"
                style={{
                  height: `${height}%`,
                  width: "20px",
                  backgroundColor: "#666",
                  borderTopLeftRadius: "4px",
                  borderTopRightRadius: "4px",
                }}
              ></div>
            </div>
            <div
              className="flexRow"
              style={{
                color: "#666",
                width: "16px",
              }}
            >
              {key}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function PointsHistogram({
  histogram,
  points,
  suffix,
}: {
  histogram: Record<number, number>;
  points: number;
  suffix: string;
}) {
  let maxVal = Number.MIN_SAFE_INTEGER;
  let minVal = Number.MAX_SAFE_INTEGER;
  let sum = 0;
  let total = 0;
  const fullHistogram: HistogramData = {};
  for (let i = 0; i <= points; i++) {
    const val = histogram[i] ?? 0;
    minVal = Math.min(val, minVal);
    maxVal = Math.max(val, maxVal);
    total += val;
    sum += val * i;
    fullHistogram[i] = val;
  }

  return (
    <div
      className="flexColumn"
      style={{ gap: "2px", width: "fit-content", alignItems: "flex-start" }}
    >
      <div>
        Average points{suffix ? ` ${suffix}` : ""}:{" "}
        {Math.round((sum / total) * 100) / 100}
      </div>
      <Histogram histogram={fullHistogram} />
    </div>
  );
}

export function FactionHistogram({
  histogram,
}: {
  histogram: Partial<Record<FactionId, number>>;
}) {
  let maxVal = Number.MIN_SAFE_INTEGER;
  let minVal = Number.MAX_SAFE_INTEGER;
  let total = 0;
  for (const val of Object.values(histogram)) {
    minVal = Math.min(val, minVal);
    maxVal = Math.max(val, maxVal);
    total += val;
  }
  const orderedHistogram = Object.entries(histogram).sort(([a, _], [b, __]) => {
    if (a < b) {
      return -1;
    }
    return 1;
  });

  return (
    <div className={styles.OuterHistogram}>
      <div className={styles.FactionHistogram}>
        {orderedHistogram.map(([key, value]) => {
          let height: number;
          if (minVal === 0) {
            height = (value / maxVal) * 100;
          } else {
            height = 10 + (90 / (maxVal - minVal)) * (value - minVal);
          }
          return (
            <div
              key={key}
              className="flexColumn"
              style={{ height: "100%", gap: "2px" }}
            >
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  height: "100%",
                  width: "16px",
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    height: `${height}%`,
                    width: "20px",
                    backgroundColor: "#666",
                    borderTopLeftRadius: "4px",
                    borderTopRightRadius: "4px",
                  }}
                ></div>
              </div>
              <div
                className="flexRow"
                style={{
                  color: "#666",
                  width: "16px",
                }}
              >
                <FactionIcon factionId={key as FactionId} size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
