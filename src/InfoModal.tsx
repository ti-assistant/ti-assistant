import { CSSProperties, PropsWithChildren, ReactNode, use } from "react";
import { ModalContent } from "./components/Modal/Modal";
import { ModalContext } from "./context/contexts";
import styles from "./InfoModal.module.scss";

export default function InfoModal({
  children,
  style,
  title,
}: PropsWithChildren<{ title: ReactNode; style?: CSSProperties }>) {
  const { openModal } = use(ModalContext);

  return (
    <div
      className={styles.infoIcon}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        openModal(
          <ModalContent title={title}>
            <div className={styles.infoContent}>{children}</div>
          </ModalContent>
        );
      }}
    >
      &#x24D8;
    </div>
  );
}
