import CarrierSVG from "../../icons/units/Carrier";
import CruiserSVG from "../../icons/units/Cruiser";
import DestroyerSVG from "../../icons/units/Destroyer";
import DreadnoughtSVG from "../../icons/units/Dreadnought";
import FighterSVG from "../../icons/units/Fighter";
import FlagshipSVG from "../../icons/units/Flagship";
import InfantrySVG from "../../icons/units/Infantry";
import MechSVG from "../../icons/units/Mech";
import PDSSVG from "../../icons/units/PDS";
import SpaceDockSVG from "../../icons/units/SpaceDock";
import WarSunSVG from "../../icons/units/WarSun";

export default function UnitIcon({
  color = "#eee",
  type,
  size = 14,
}: {
  color?: string;
  type: UnitType;
  size?: number | string;
}) {
  switch (type) {
    case "Carrier":
      return <CarrierSVG size={size} color={color} />;
    case "Cruiser":
      return <CruiserSVG size={size} color={color} />;
    case "Destroyer":
      return <DestroyerSVG size={size} color={color} />;
    case "Dreadnought":
      return <DreadnoughtSVG size={size} color={color} />;
    case "Fighter":
      return <FighterSVG size={size} color={color} />;
    case "Flagship":
      return <FlagshipSVG size={size} color={color} />;
    case "Infantry":
      return <InfantrySVG size={size} color={color} />;
    case "Mech":
      return <MechSVG size={size} color={color} />;
    case "PDS":
      return <PDSSVG size={size} color={color} />;
    case "Space Dock":
      return <SpaceDockSVG size={size} color={color} />;
    case "War Sun":
      return <WarSunSVG size={size} color={color} />;
  }
}
