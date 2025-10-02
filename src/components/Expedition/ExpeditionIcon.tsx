import { CSSProperties } from "react";
import ActionCardsSVG from "../../icons/expedition/ActionCards";
import SecretIconSVG from "../../icons/expedition/SecretIcon";
import { rem } from "../../util/util";

import InfluenceSVG from "../../icons/planets/Influence";
import ResourcesSVG from "../../icons/planets/Resources";
import TripleTradeGoodSVG from "../../icons/ui/TripleTradeGood";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";

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
          <div
            className="flexRow"
            style={{ width: rem(14), fontSize: rem(18) }}
          >
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
          <InfluenceSVG influence={5} color={faded ? "#555" : undefined} />
        </div>
      );
      break;
    case "resources":
      innerContent = (
        <div
          className="flexRow"
          style={{ position: "relative", width: rem(32) }}
        >
          <ResourcesSVG resources={5} color={faded ? "#555" : undefined} />
        </div>
      );
      break;
    case "secrets":
      innerContent = (
        <>
          <div
            className="flexRow"
            style={{ width: rem(14), fontSize: rem(18) }}
          >
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
      innerContent = (
        <>
          <div
            className="flexRow"
            style={{
              width: rem(14),
              fontSize: rem(18),
            }}
          >
            3
          </div>
          <div
            className="flexRow"
            style={{
              position: "relative",
              width: rem(20),
              filter: faded ? "grayscale(1)" : undefined,
            }}
          >
            <TripleTradeGoodSVG color={faded ? "#555" : undefined} />
          </div>
        </>
      );
      break;
  }
  return innerContent;
}
