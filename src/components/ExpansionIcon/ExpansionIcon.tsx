import CodexSVG from "../../icons/ui/Codex";
import ProphecyofKingsSVG from "../../icons/ui/ProphecyOfKings";
import ThundersEdgeMenuSVG from "../../icons/ui/ThundersEdgeMenu";
import { rem } from "../../util/util";

export default function ExpansionIcon({
  expansion,
  size,
}: {
  expansion: Expansion;
  size: number;
}) {
  let innerContent;
  switch (expansion) {
    case "BASE":
    case "BASE ONLY":
      return null;
    case "POK":
      innerContent = <ProphecyofKingsSVG />;
      break;
    case "CODEX ONE":
    case "CODEX TWO":
    case "CODEX THREE":
    case "CODEX FOUR":
      innerContent = <CodexSVG />;
      break;
    case "THUNDERS EDGE":
      innerContent = <ThundersEdgeMenuSVG />;
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
