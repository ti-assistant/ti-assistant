import { PropsWithChildren, ReactNode, useState } from "react";

import Modal, { ModalContent } from "./components/Modal/Modal";
import { useSharedModal } from "./data/SharedModal";

interface InfoRowProps {
  infoContent: ReactNode;
  infoTitle: ReactNode;
}

export function InfoRow({
  children,
  infoTitle,
  infoContent,
}: PropsWithChildren<InfoRowProps>) {
  const { openModal } = useSharedModal();

  return (
    <div
      className="flexRow"
      style={{ width: "100%", justifyContent: "stretch" }}
    >
      {children}
      <div
        className="popupIcon"
        style={{
          fontSize: "1rem",
        }}
        onClick={() =>
          openModal(
            <ModalContent title={infoTitle}>
              <div
                className="myriadPro"
                style={{
                  boxSizing: "border-box",
                  maxWidth: "50rem",
                  width: "100%",
                  minWidth: "20rem",
                  padding: "0.25rem",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  fontSize: "2rem",
                }}
              >
                {infoContent}
              </div>
            </ModalContent>
          )
        }
      >
        &#x24D8;
      </div>
    </div>
  );
}
