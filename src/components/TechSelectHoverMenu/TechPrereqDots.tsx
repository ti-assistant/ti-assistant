import { CSSProperties } from "react";
import { getTechTypeColor } from "../../util/techs";
import { rem } from "../../util/util";
import styles from "./TechPrereqDots.module.scss";

interface TechPrereqProperties extends CSSProperties {
  "--width": string;
}

interface TechDotProperties extends CSSProperties {
  "--color": string;
}

export default function TechPrereqDots({
  prereqs,
  width = 4,
}: {
  prereqs: TechType[];
  width?: number;
}) {
  if (prereqs.length === 0) {
    return null;
  }

  const style: TechPrereqProperties = {
    "--width": rem(width),
    gap: rem(width / 2),
  };

  if (prereqs.length > 3) {
    return (
      <div className={styles.TechPrereqGrid} style={style}>
        {prereqs.map((prereq, index) => {
          const style: TechDotProperties = {
            "--color": getTechTypeColor(prereq),
          };
          return (
            <div key={index} className={styles.TechDot} style={style}></div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={styles.TechPrereqColumn} style={style}>
      {prereqs.map((prereq, index) => {
        const style: TechDotProperties = {
          "--color": getTechTypeColor(prereq),
        };
        return <div key={index} className={styles.TechDot} style={style}></div>;
      })}
    </div>
  );
}
