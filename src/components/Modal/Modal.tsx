import { PropsWithChildren, ReactNode } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./Modal.module.scss";

interface ModalProps {
  closeMenu?: () => void;
  level?: number;
  title?: ReactNode;
  visible: boolean;
}

export default function Modal({
  children,
  closeMenu,
  level,
  title,
  visible,
}: PropsWithChildren<ModalProps>) {
  const zIndex = 900 * (level ?? 1);

  function onExited(node: HTMLElement) {
    node.style.display = "none";
  }
  function onEnter(node: HTMLElement) {
    node.style.display = "flex";
  }
  function closeModal(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    if (closeMenu) {
      closeMenu();
    }
  }
  return (
    <CSSTransition
      in={visible}
      timeout={500}
      classNames="fade"
      onEnter={onEnter}
      onExited={onExited}
    >
      <div
        className={`${styles.Modal} ${visible ? styles.shown : ""}`}
        style={{ zIndex: zIndex + 3 }}
      >
        <div className={styles.Overlay} onClick={closeModal}></div>
        <CSSTransition in={visible} timeout={500} classNames="modal">
          <div className={styles.Content}>
            <div className={styles.Header}>
              {closeMenu ? (
                <div
                  className={styles.CloseButton}
                  style={{
                    zIndex: zIndex + 3,
                  }}
                  onClick={closeModal}
                >
                  &#x2715;
                </div>
              ) : null}
              <div className={styles.Title}>{title}</div>
            </div>
            <div
              className={styles.Body}
              onClick={(event) => event.stopPropagation()}
            >
              {children}
            </div>
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
}
