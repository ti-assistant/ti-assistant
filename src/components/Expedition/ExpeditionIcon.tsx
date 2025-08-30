import Image from "next/image";
import { CSSProperties } from "react";
import ActionCardsSVG from "../../icons/expedition/ActionCards";
import SecretIconSVG from "../../icons/expedition/SecretIcon";
import { rem } from "../../util/util";

import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import styles from "./Expedition.module.scss";
import InfluenceSVG from "../../icons/planets/Influence";
import ResourcesSVG from "../../icons/planets/Resources";

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
      innerContent = (
        <div
          className="flexRow"
          style={{ position: "relative", width: rem(32) }}
        >
          <InfluenceSVG influence={5} />
        </div>
      );
      break;
    case "resources":
      const resourcesStyle: AvailableVotesStyle = {
        "--height": rem(32),
        "--width": rem(28),
      };
      innerContent = (
        <div
          className="flexRow"
          style={{ position: "relative", width: rem(32) }}
        >
          <ResourcesSVG resources={5} />
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
