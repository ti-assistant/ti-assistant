import DemilitarizedZoneSVG from "../../icons/attachments/DemilitarizedZone";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function DMZIcon() {
  return (
    <PlanetIconWrapper color="red">
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: rem(12),
          height: rem(12),
        }}
      >
        <DemilitarizedZoneSVG />
      </div>
    </PlanetIconWrapper>
  );
}
