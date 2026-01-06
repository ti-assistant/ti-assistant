import { CSSProperties } from "react";
import TechIcon from "../TechIcon/TechIcon";
import styles from "./TFCardIcon.module.scss";
import { rem } from "../../util/util";
import AbilitySVG from "../../icons/twilightsfall/ability";
import GenomeSVG from "../../icons/twilightsfall/genome";
import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import ParadigmSVG from "../../icons/twilightsfall/paradigm";

interface TFCardIconCSS extends CSSProperties {
  "--size": string;
}

export default function TFCardIcon({
  size,
  color = "#eee",
}: {
  size: number;
  color?: string;
}) {
  const iconCSS: TFCardIconCSS = {
    "--size": rem(size),
  };

  return (
    <div className={styles.TFCardIcon} style={iconCSS}>
      <div className="flexColumn" style={{ width: "100%" }}>
        <div style={{ width: rem(size * 0.45) }}>
          <AbilitySVG />
        </div>
      </div>
      <div className="flexColumn" style={{ width: "100%" }}>
        <div style={{ width: rem(size * 0.304) }}>
          <GenomeSVG />
        </div>
      </div>
      <div className="flexColumn" style={{ width: "100%" }}>
        <div style={{ width: rem(size * 0.319) }}>
          <ParadigmSVG />
        </div>
      </div>
      <div className="flexColumn" style={{ width: "100%" }}>
        <div style={{ width: rem(size * 0.262) }}>
          <UpgradeSVG />
        </div>
      </div>
    </div>
  );
}
