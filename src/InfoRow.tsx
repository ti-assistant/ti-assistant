import { PropsWithChildren, ReactNode } from "react";

import InfoModal from "./InfoModal";
import { rem } from "./util/util";

interface InfoRowProps {
  infoContent: ReactNode;
  infoTitle: ReactNode;
}

export function InfoRow({
  children,
  infoTitle,
  infoContent,
}: PropsWithChildren<InfoRowProps>) {
  return (
    <div
      className="flexRow"
      style={{ width: "100%", justifyContent: "stretch" }}
    >
      {children}
      <InfoModal title={infoTitle} style={{ marginLeft: rem(8) }}>
        {infoContent}
      </InfoModal>
    </div>
  );
}
