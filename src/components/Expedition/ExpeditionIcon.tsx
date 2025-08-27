import Image from "next/image";
import { CSSProperties } from "react";
import ActionCardsSVG from "../../icons/expedition/ActionCards";
import SecretIconSVG from "../../icons/expedition/SecretIcon";
import { rem } from "../../util/util";

import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import styles from "./Expedition.module.scss";

interface AvailableVotesStyle extends CSSProperties {
  "--width": string;
  "--height": string;
}

export default function ExpeditionIcon({
  expedition,
  faded,
}: {
  expedition: ExpeditionId;
  faded?: boolean;
}) {
  let innerContent;

  switch (expedition) {
    case "actionCards":
      innerContent = (
        <>
          <div className="flexRow" style={{ width: rem(14) }}>
            2
          </div>
          <div
            className="flexRow"
            style={{ position: "relative", width: rem(20) }}
          >
            <ActionCardsSVG color={faded ? "#555" : undefined} />
          </div>
        </>
      );
      break;
    case "influence":
      const availableVotesStyle: AvailableVotesStyle = {
        "--height": rem(32),
        "--width": rem(26),
      };
      innerContent = (
        <div className={styles.AvailableVotes} style={availableVotesStyle}>
          <div
            className={`${styles.InfluenceIcon} ${faded ? styles.Faded : ""}`}
          >
            &#x2B21;
          </div>
          <div className={styles.InfluenceText}>5</div>
        </div>
      );
      break;
    case "resources":
      const resourcesStyle: AvailableVotesStyle = {
        "--height": rem(32),
        "--width": rem(28),
      };
      innerContent = (
        <div className={styles.AvailableVotes} style={resourcesStyle}>
          <div
            className={`${styles.ResourcesIcon} ${faded ? styles.Faded : ""}`}
          >
            &#9711;
          </div>
          <div className={styles.InfluenceText}>5</div>
        </div>
      );
      break;
    case "secrets":
      innerContent = (
        <>
          <div className="flexRow" style={{ width: rem(14) }}>
            1
          </div>
          <div
            className="flexRow"
            style={{ position: "relative", width: rem(20) }}
          >
            <SecretIconSVG color={faded ? "#555" : undefined} />
          </div>
        </>
      );
      break;
    case "techSkip":
      innerContent = (
        <TechSkipIcon
          size={24}
          outline={faded}
          color={faded ? "#555" : undefined}
        />
      );
      break;
    case "tradeGoods":
      // TODO: Create triple TG icon.
      innerContent = (
        <>
          <div className="flexRow" style={{ width: rem(14) }}>
            3
          </div>
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(20),
              height: rem(20),
              filter: faded ? "grayscale(1)" : undefined,
            }}
          >
            <Image
              sizes={rem(48)}
              src="/images/trade_good.png"
              alt="TGs"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </>
      );
      break;
  }
  return innerContent;
}
