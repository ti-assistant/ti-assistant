import CodexSVG from "../../icons/ui/Codex";
import ProphecyofKingsSVG from "../../icons/ui/ProphecyOfKings";
import ThundersEdgeMenuSVG from "../../icons/ui/ThundersEdgeMenu";
import TwilightsFallSVG from "../../icons/ui/TwilightsFall";
import { rem } from "../../util/util";

export default function ExpansionIcon({
  color = "#eee",
  expansion,
  size,
}: {
  color?: string;
  expansion: Expansion;
  size: number;
}) {
  let innerContent;
  switch (expansion) {
    case "BASE":
      return null;
    case "POK":
      innerContent = <ProphecyofKingsSVG color={color} />;
      break;
    case "CODEX ONE":
    case "CODEX TWO":
    case "CODEX THREE":
    case "CODEX FOUR":
      innerContent = <CodexSVG color={color} />;
      break;
    case "THUNDERS EDGE":
      innerContent = <ThundersEdgeMenuSVG color={color} />;
      break;
    case "TWILIGHTS FALL":
      innerContent = <TwilightsFallSVG color={color} />;
      break;
    case "DISCORDANT STARS":
      // TODO: Add DS icon.
      return null;
  }
  return (
    <div className="flexRow" style={{ width: rem(size) }}>
      {innerContent}
    </div>
  );
}
