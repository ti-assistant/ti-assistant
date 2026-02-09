import { PropsWithChildren, ReactNode } from "react";

import InfoModal from "./InfoModal";

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
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "0.5rem",
        alignItems: "center",
      }}
    >
      {children}
      <InfoModal title={infoTitle}>{infoContent}</InfoModal>
    </div>
  );
}
