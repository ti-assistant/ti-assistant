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
            maxWidth: "800px",
            width: "100%",
            minWidth: "320px",
            padding: "4px",
            whiteSpace: "pre-line",
            textAlign: "center",
            fontSize: "32px",
          }}
        >
          {infoContent}
        </div>
      </Modal>
      {children}
      <div
        className="popupIcon"
        style={{
          fontSize: "16px",
        }}
        onClick={displayInfo}
      >
        &#x24D8;
      </div>
    </div>
  );
}
