"use client";

import RelicMenuSVG from "../../icons/ui/RelicMenu";
import { rem } from "../../util/util";

export default function RelicPlanetIcon() {
  return (
    <>
      <div
        className="flexRow"
        style={{
          borderRadius: "100%",
          height: rem(16),
          width: rem(16),
          boxShadow: `0px 0px ${rem(2)} ${rem(1.5)} #efe383`,
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
          <RelicMenuSVG color="#efe383" />
        </div>
      </div>
    </>
  );
}
