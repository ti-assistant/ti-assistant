import { PropsWithChildren, useRef } from "react";
import { CSSTransition } from "react-transition-group";
import styles from "./GenericModal.module.scss";

interface ModalProps {
  closeMenu?: () => void;
  level?: number;
  visible: boolean;
}

export default function GenericModal({
  children,
  closeMenu,
  level,
  visible,
}: PropsWithChildren<ModalProps>) {
  const zIndex = 1200 * (level ?? 1);
  const nodeRef = useRef<HTMLDivElement>(null);

  function onExited() {
    if (!nodeRef.current) {
      return;
    }
    nodeRef.current.style.visibility = "hidden";
  }
  function onEnter() {
    if (!nodeRef.current) {
      return;
    }
    nodeRef.current.style.visibility = "visible";
  }
  return (
    <CSSTransition
      in={visible}
      timeout={300}
      classNames="fade"
      onEnter={onEnter}
      onExited={onExited}
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        className={`${styles.Modal} ${visible ? styles.shown : ""}`}
        style={{
          zIndex: zIndex + 3,
        }}
      >
        <div className={styles.Overlay} onClick={closeMenu}></div>
        <CSSTransition in={visible} timeout={300} classNames="modal">
          <div className={styles.Content} onClick={closeMenu}>
            <div className={styles.Button} onClick={closeMenu}>
              <div>&#x2715;</div>
            </div>
            {children}
          </div>
        </CSSTransition>
      </div>
    </CSSTransition>
  );
}
