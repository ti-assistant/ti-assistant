import { CSSProperties, PropsWithChildren } from "react";
import { rem } from "../../util/util";

export function PlanetIconWrapper({
  children,
  color = "#eee",
  style,
}: PropsWithChildren<{
  color?: string;
  style?: CSSProperties;
}>) {
  return (
    <div
      className="flexRow"
      style={{
        borderRadius: "100%",
        height: rem(16),
        width: rem(16),
        boxShadow: `0px 0px ${rem(2)} ${rem(1.5)} ${color}`,
        backgroundColor: "black",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
