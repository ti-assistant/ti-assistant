"use client";

import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function UpgradeIcon() {
  return (
    <PlanetIconWrapper style={{ height: rem(18) }}>
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: rem(8),
          height: rem(12),
        }}
      >
        <UpgradeSVG />
      </div>
    </PlanetIconWrapper>
  );
}
