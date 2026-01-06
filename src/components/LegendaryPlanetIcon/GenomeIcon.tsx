"use client";

import GenomeSVG from "../../icons/twilightsfall/genome";
import { rem } from "../../util/util";

export default function GenomeIcon() {
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
            width: rem(9),
            height: rem(16),
          }}
        >
          <GenomeSVG />
        </div>
      </div>
    </>
  );
}
