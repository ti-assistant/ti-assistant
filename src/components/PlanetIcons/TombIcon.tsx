import TombOfEmphidiaSVG from "../../icons/attachments/TombOfEmphidia";
import { rem } from "../../util/util";
import { PlanetIconWrapper } from "./Wrapper";

export default function TombIcon() {
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
        <TombOfEmphidiaSVG />
      </div>
    </PlanetIconWrapper>
  );
}
