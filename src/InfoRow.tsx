import { PropsWithChildren, ReactNode, useState } from "react";

import Modal from "./components/Modal/Modal";

interface InfoRowProps {
  infoContent: ReactNode;
  infoTitle: ReactNode;
}

export function InfoRow({
  children,
  infoTitle,
  infoContent,
}: PropsWithChildren<InfoRowProps>) {
  const [showInfoModal, setShowInfoModal] = useState(false);

  function displayInfo() {
    setShowInfoModal(true);
  }

  return (
    <div
      className="flexRow"
      style={{ width: "100%", justifyContent: "stretch" }}
    >
      <Modal
        closeMenu={() => setShowInfoModal(false)}
        level={2}
        visible={showInfoModal}
        title={infoTitle}
      >
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
      </Modal>
      {children}
      <div
        className="popupIcon"
        style={{
          fontSize: "1rem",
        }}
        onClick={displayInfo}
      >
        &#x24D8;
      </div>
    </div>
  );
}
