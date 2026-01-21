import { PropsWithChildren } from "react";
import { rem } from "../../../util/util";

export default function GridHeader({ children }: PropsWithChildren) {
  return (
    <div
      className="flexColumn"
      style={{
        height: "100%",
        justifyContent: "flex-end",
        fontSize: rem(14),
        minWidth: rem(62),
        maxWidth: rem(92),
        padding: `0 ${rem(2)}`,
        whiteSpace: "normal",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: rem(84), height: "100%" }}>{children}</div>
    </div>
  );
}
