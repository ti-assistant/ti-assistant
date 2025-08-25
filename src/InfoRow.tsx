import { PropsWithChildren, ReactNode } from "react";

import { ModalContent } from "./components/Modal/Modal";
import { useSharedModal } from "./data/SharedModal";
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
  const { openModal } = useSharedModal();

  return (
    <div
      className="flexRow"
      style={{ width: "100%", justifyContent: "stretch", gap: 0 }}
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
                className="myriadPro flexColumn"
                style={{
                  boxSizing: "border-box",
                  maxWidth: "50rem",
                  width: "100%",
                  minWidth: "20rem",
                  padding: "0.25rem",
                  whiteSpace: "pre-line",
                  textAlign: "center",
                  fontSize: rem(32),
                  gap: rem(32),
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
