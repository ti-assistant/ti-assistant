"use client";

import UpgradeSVG from "../../icons/twilightsfall/upgrade";
import { rem } from "../../util/util";

export default function UpgradeIcon() {
  return (
    <>
      <div
        className="flexRow"
        style={{
          borderRadius: "100%",
          height: rem(18),
          width: rem(16),
          boxShadow: `0px 0px ${rem(2)} ${rem(1.5)} #eee`,
          backgroundColor: "black",
        }}
      >
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
      </div>
    </>
  );
}
