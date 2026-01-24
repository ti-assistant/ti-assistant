"use client";

import GenomeSVG from "../../icons/twilightsfall/genome";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function GenomeIcon() {
  return (
    <PlanetIconWrapper style={{ height: rem(18) }}>
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: rem(9),
          height: rem(16),
        }}
      >
        <GenomeSVG />
      </div>
    </PlanetIconWrapper>
  );
}
