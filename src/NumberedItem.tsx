import { PropsWithChildren } from "react";

export function NumberedItem({ children }: PropsWithChildren) {
  return (
    <li>
      <div style={{ fontWeight: "normal" }}>{children}</div>
    </li>
  );
}
