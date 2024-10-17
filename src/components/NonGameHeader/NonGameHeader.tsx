"use client";

import Sidebars from "../Sidebars/Sidebars";
import styles from "./NonGameHeader.module.scss";

export default function NonGameHeader({
  leftSidebar,
  rightSidebar,
  mobileSidebars = false,
}: {
  leftSidebar: string;
  rightSidebar: string;
  mobileSidebars?: boolean;
}) {
  return (
    <>
      {mobileSidebars ? (
        <Sidebars left={leftSidebar} right={rightSidebar} />
      ) : (
        <div className={`flexRow ${styles.NonGameHeader}`}>
          <div
            className="flex"
            style={{
              top: 0,
              width: "100vw",
              position: "fixed",
              justifyContent: "space-between",
            }}
          >
            <div className="nonMobile">
              <Sidebars left={leftSidebar} right={rightSidebar} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
