import { PropsWithChildren } from "react";

export function NumberedItem({ children }: PropsWithChildren) {
  return (
    <li style={{ fontFamily: "Myriad Pro", fontWeight: "bold" }}>
      <div style={{ fontFamily: "Slider", fontWeight: "normal" }}>
        {children}
      </div>
    </li>
  );
}
