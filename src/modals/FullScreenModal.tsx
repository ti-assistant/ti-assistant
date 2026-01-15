import { CSSProperties, PropsWithChildren, ReactNode } from "react";
import styles from "./Modal.module.scss";

export default function FullScreenModal({
  title,
  settings,
  children,
  bodyClass,
}: PropsWithChildren<{
  title: ReactNode;
  settings?: ReactNode;
  bodyClass?: string;
}>) {
  return (
    <div className={styles.Modal}>
      <div className={styles.ModalTitleSection}>
        <div className={styles.ModalTitle}>{title}</div>
        {settings ? (
          <div
            className={`${styles.ModalTitle} ${styles.ModalSettings}`}
            onClick={(e) => e.stopPropagation()}
          >
            {settings}
          </div>
        ) : null}
      </div>
      <div
        className={`${styles.ModalBody} ${bodyClass ?? ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
