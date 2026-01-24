import { getTechTypeColor } from "../../util/techs";
import { rem } from "../../util/util";
import TechIcon from "../TechIcon/TechIcon";
import { PlanetIconWrapper } from "./Wrapper";

export default function TechPlanetIcon({ techType }: { techType: TechType }) {
  const color = getTechTypeColor(techType);

  return (
    <PlanetIconWrapper color={color}>
      <div
        className="flexRow"
        style={{
          position: "relative",
          width: rem(12),
          height: rem(12),
          paddingTop: techType === "YELLOW" ? rem(1) : undefined,
        }}
      >
        <TechIcon type={techType} size={12} />
      </div>
    </PlanetIconWrapper>
  );
}
