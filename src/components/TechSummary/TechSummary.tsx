import { FormattedMessage } from "react-intl";
import { rem } from "../../util/util";
import TechIcon from "../TechIcon/TechIcon";
import TechTree from "../TechTree/TechTree";
import styles from "./TechSummary.module.scss";

export function FullTechSummary({
  techs,
  factionId,
  viewOnly,
}: {
  techs: Tech[];
  factionId: FactionId;
  viewOnly?: boolean;
}) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of techs) {
    switch (tech.type) {
      case "RED":
        redTechs.push(tech);
        break;
      case "YELLOW":
        yellowTechs.push(tech);
        break;
      case "GREEN":
        greenTechs.push(tech);
        break;
      case "BLUE":
        blueTechs.push(tech);
        break;
      case "UPGRADE":
        upgradeTechs.push(tech);
        break;
    }
  }

  const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

  techs.sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff: number = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  const numberWidth = rem(10.75 * 1.2);
  const techTreeSize = 6;
  const iconSize = 20;

  return (
    <>
      <div className={`${styles.TechSummaryGrid} ${styles.Horizontal}`}>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {greenTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"GREEN"} size={iconSize} />
        </div>
        <TechTree
          type="GREEN"
          factionId={factionId}
          size={techTreeSize}
          viewOnly={viewOnly}
        />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {blueTechs.length || "-"}
        </div>

        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"BLUE"} size={iconSize} />
        </div>
        <TechTree
          type="BLUE"
          factionId={factionId}
          size={techTreeSize}
          viewOnly={viewOnly}
        />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {yellowTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"YELLOW"} size={iconSize} />
        </div>
        <TechTree
          type="YELLOW"
          factionId={factionId}
          size={techTreeSize}
          viewOnly={viewOnly}
        />
        <div>&nbsp;</div>
        <div
          className="flexRow centered"
          style={{ height: "100%", width: numberWidth }}
        >
          {redTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"RED"} size={iconSize} />
        </div>
        <TechTree
          type="RED"
          factionId={factionId}
          size={techTreeSize}
          viewOnly={viewOnly}
        />
        <div
          className={styles.UnitUpgradeText}
          style={{ whiteSpace: "nowrap" }}
        >
          {upgradeTechs.length || "-"}{" "}
          <FormattedMessage
            id="lGDH2d"
            description="Unit upgrade techs."
            defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
            values={{ count: upgradeTechs.length }}
          />
        </div>
        <div className={styles.UnitUpgradeTree}>
          <TechTree
            type="UPGRADE"
            factionId={factionId}
            size={techTreeSize}
            viewOnly={viewOnly}
          />
        </div>
        <div className={styles.FactionTechTree}>
          <TechTree
            type="FACTION"
            factionId={factionId}
            size={techTreeSize}
            viewOnly={viewOnly}
          />
        </div>
      </div>
    </>
  );
}

export default function TechSummary({ techs }: { techs: Tech[] }) {
  let blueTechs = [];
  let yellowTechs = [];
  let greenTechs = [];
  let redTechs = [];
  let upgradeTechs = [];
  for (const tech of techs) {
    switch (tech.type) {
      case "RED":
        redTechs.push(tech);
        break;
      case "YELLOW":
        yellowTechs.push(tech);
        break;
      case "GREEN":
        greenTechs.push(tech);
        break;
      case "BLUE":
        blueTechs.push(tech);
        break;
      case "UPGRADE":
        upgradeTechs.push(tech);
        break;
    }
  }

  const techOrder: TechType[] = ["GREEN", "BLUE", "YELLOW", "RED", "UPGRADE"];

  techs.sort((a, b) => {
    const typeDiff = techOrder.indexOf(a.type) - techOrder.indexOf(b.type);
    if (typeDiff !== 0) {
      return typeDiff;
    }
    const prereqDiff: number = a.prereqs.length - b.prereqs.length;
    if (prereqDiff !== 0) {
      return prereqDiff;
    }
    if (a.name < b.name) {
      return -1;
    } else {
      return 1;
    }
  });

  const numberWidth = rem(10.75);

  return (
    <>
      <div className={`${styles.TechSummaryGrid}`}>
        <div className="flexRow centered" style={{ width: numberWidth }}>
          {greenTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"GREEN"} size={16} />
        </div>
        <div></div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"BLUE"} size={16} />
        </div>
        <div className="flexRow centered" style={{ width: numberWidth }}>
          {blueTechs.length || "-"}
        </div>
        <div className="flexRow centered" style={{ width: numberWidth }}>
          {yellowTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"YELLOW"} size={16} />
        </div>
        <div></div>
        <div className="flexRow" style={{ height: "100%" }}>
          <TechIcon type={"RED"} size={16} />
        </div>
        <div className="flexRow centered" style={{ width: numberWidth }}>
          {redTechs.length || "-"}
        </div>
        <div className="flexRow centered" style={{ width: numberWidth }}>
          {upgradeTechs.length || "-"}
        </div>
        <div className="flexRow" style={{ fontSize: rem(12) }}>
          <FormattedMessage
            id="lGDH2d"
            description="Unit upgrade techs."
            defaultMessage="{count, plural, =0 {Upgrades} one {Upgrade} other {Upgrades}}"
            values={{ count: upgradeTechs.length }}
          />
        </div>
      </div>
    </>
  );
}
