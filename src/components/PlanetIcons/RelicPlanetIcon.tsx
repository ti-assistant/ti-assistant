"use client";

import RelicMenuSVG from "../../icons/ui/RelicMenu";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function RelicPlanetIcon() {
  return (
    <PlanetIconWrapper color="#efe383">
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: rem(12),
          height: rem(12),
        }}
      >
        <RelicMenuSVG color="#efe383" />
      </div>
    </PlanetIconWrapper>
  );
}
