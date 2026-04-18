"use client";

import { PropsWithChildren, ReactNode, use } from "react";
import { ModalContent } from "./components/Modal/Modal";
import { ModalContext } from "./context/contexts";
import styles from "./InfoModal.module.scss";

interface InfoRowProps {
  infoContent: ReactNode;
  infoTitle: ReactNode;
}

export function InfoRow({
  children,
  infoTitle,
  infoContent,
}: PropsWithChildren<InfoRowProps>) {
  const { openModal } = use(ModalContext);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "0.5rem",
        alignItems: "center",
        cursor: "zoom-in",
        fontFamily: "var(--main-font)",
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openModal(
          <ModalContent title={infoTitle}>
            <div className={styles.infoContent}>{infoContent}</div>
          </ModalContent>,
        );
      }}
    >
      {children}
      {/* <InfoModal title={infoTitle}>{infoContent}</InfoModal> */}
    </div>
  );
}
