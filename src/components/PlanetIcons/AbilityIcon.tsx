"use client";

import AbilitySVG from "../../icons/twilightsfall/ability";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function AbilityIcon() {
  return (
    <PlanetIconWrapper>
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
    </PlanetIconWrapper>
  );
}
