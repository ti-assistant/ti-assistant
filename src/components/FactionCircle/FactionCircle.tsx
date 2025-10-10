import { CSSProperties, ReactNode } from "react";
import { SymbolX } from "../../icons/svgs";
import Circle from "../Circle/Circle";
import FactionIcon from "../FactionIcon/FactionIcon";

interface FactionCircleProps {
  blur?: boolean;
  borderColor?: string;
  factionId?: FactionId;
  fade?: boolean;
  onClick?: () => void;
  size?: number;
  style?: CSSProperties;
  tag?: ReactNode;
  tagBorderColor?: string;
}

export default function FactionCircle({
  blur,
  borderColor = "var(--neutral-border)",
  factionId,
  fade = false,
  onClick,
  size = 44,
  style = {},
  tag,
  tagBorderColor = "var(--neutral-border)",
}: FactionCircleProps) {
  return (
    <Circle
      blur={blur}
      borderColor={borderColor}
      fade={fade}
      onClick={onClick}
      size={size}
      style={style}
      tag={tag}
      tagBorderColor={tagBorderColor}
    >
      {factionId ? (
        <FactionIcon factionId={factionId} size="100%" />
      ) : (
        <SymbolX color={style.color} />
      )}
    </Circle>
  );
}
