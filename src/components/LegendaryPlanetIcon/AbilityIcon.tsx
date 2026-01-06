"use client";

import AbilitySVG from "../../icons/twilightsfall/ability";
import { rem } from "../../util/util";

export default function AbilityIcon() {
  return (
    <>
      <div
        className="flexRow"
        style={{
          borderRadius: "100%",
          height: rem(16),
          width: rem(16),
          boxShadow: `0px 0px ${rem(2)} ${rem(1.5)} #eee`,
          backgroundColor: "black",
        }}
      >
        <div
          className="flexRow"
          style={{
            position: "relative",
            width: rem(12),
            height: rem(12),
          }}
        >
          <AbilitySVG />
        </div>
      </div>
    </>
  );
}
