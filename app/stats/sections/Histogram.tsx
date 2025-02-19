import { FormattedMessage } from "react-intl";
import FactionIcon from "../../../src/components/FactionIcon/FactionIcon";
import { objectEntries, rem } from "../../../src/util/util";
import styles from "./Histogram.module.scss";
import { HistogramData } from "./types";

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
            style={{ height: "100%", gap: rem(2) }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                height: "100%",
                width: rem(16),
                alignItems: "flex-end",
              }}
            >
              <div
                className="flexRow"
                style={{
                  height: `${height}%`,
                  width: rem(20),
                  backgroundColor: "#666",
                  borderTopLeftRadius: rem(4),
                  borderTopRightRadius: rem(4),
                }}
              ></div>
            </div>
            <div
              className="flexRow"
              style={{
                color: "#666",
                width: rem(16),
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
}: {
  histogram: Record<number, number>;
  points: number;
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
      style={{ gap: rem(2), width: "fit-content", alignItems: "flex-start" }}
    >
      <div>
        <FormattedMessage
          id="+zFNH+"
          defaultMessage="Average VPs"
          description="Label for a section describing the average number of VPs."
        />
        : {Math.round((sum / total) * 100) / 100}
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
  const orderedHistogram = objectEntries(histogram).sort(([a, _], [b, __]) => {
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
            height = 25 + (90 / (maxVal - minVal)) * (value - minVal);
          }
          return (
            <div
              key={key}
              className="flexColumn"
              style={{ height: "100%", gap: rem(2) }}
            >
              <div
                className="flexRow"
                style={{
                  position: "relative",
                  height: "100%",
                  width: rem(16),
                  alignItems: "flex-end",
                }}
              >
                <div
                  className="flexRow"
                  style={{
                    height: `${height}%`,
                    width: rem(20),
                    backgroundColor: "#666",
                    borderTopLeftRadius: rem(4),
                    borderTopRightRadius: rem(4),
                  }}
                ></div>
              </div>
              <div
                className="flexRow"
                style={{
                  color: "#666",
                  width: rem(16),
                }}
              >
                <FactionIcon factionId={key} size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
