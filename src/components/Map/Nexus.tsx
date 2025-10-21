import { OverlayDetails } from "./PlanetOverlay";
import SystemImage from "./SystemImage";

export type NexusPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export default function Nexus({
  systemNumber,
  position,
  overlayDetails,
  planetInfo,
  selectable,
  onClick,
  tilePercentage,
  hexRatio,
  fractureVisible,
}: {
  systemNumber: string;
  position: NexusPosition;
  overlayDetails: OverlayDetails;
  planetInfo: Partial<Record<PlanetId, Planet>>;
  selectable: boolean;
  onClick?: (systemId: string) => void;
  tilePercentage: number;
  hexRatio: number;
  fractureVisible: boolean;
}) {
  const right = position.includes("right") ? 0 : undefined;
  const left = position.includes("left") ? 0 : undefined;
  const top = position.includes("top")
    ? fractureVisible
      ? "-10%"
      : 0
    : undefined;
  const bottom = position.includes("bottom") ? 0 : undefined;
  return (
    <div
      style={{
        position: "absolute",
        right,
        left,
        bottom,
        top,
        width: `${tilePercentage * hexRatio}%`,
        height: `${tilePercentage * hexRatio}%`,
      }}
    >
      <SystemImage
        overlayDetails={overlayDetails}
        planets={planetInfo}
        systemNumber={systemNumber}
        selectable={selectable}
        onClick={onClick}
      />
    </div>
  );
}
