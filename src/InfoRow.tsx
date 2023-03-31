import { PropsWithChildren, ReactNode, useState } from "react";

import { Modal } from "./Modal";
import { responsivePixels } from "./util/util";

export interface InfoRowProps {
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
            maxWidth: responsivePixels(800),
            width: "100%",
            minWidth: responsivePixels(320),
            padding: responsivePixels(4),
            whiteSpace: "pre-line",
            textAlign: "center",
            fontSize: responsivePixels(32),
          }}
        >
          {infoContent}
        </div>
      </Modal>
      {children}
      <div
        className="popupIcon"
        style={{
          fontSize: responsivePixels(16),
        }}
        onClick={displayInfo}
      >
        &#x24D8;
      </div>
    </div>
  );
}
