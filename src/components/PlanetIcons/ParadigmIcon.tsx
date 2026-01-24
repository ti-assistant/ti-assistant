"use client";

import ParadigmSVG from "../../icons/twilightsfall/paradigm";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function ParadigmIcon() {
  return (
    <PlanetIconWrapper style={{ height: rem(18) }}>
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: rem(10),
          height: rem(16),
        }}
      >
        <ParadigmSVG />
      </div>
    </PlanetIconWrapper>
  );
}
