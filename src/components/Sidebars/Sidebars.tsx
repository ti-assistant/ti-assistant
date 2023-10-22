import { PropsWithChildren, ReactNode } from "react";
import styles from "./Sidebars.module.scss";
import LabeledLine from "../LabeledLine/LabeledLine";

interface SidebarsProps {
  left: ReactNode;
  right: ReactNode;
}

export default function Sidebars({ left, right }: SidebarsProps) {
  return (
    <>
      <Sidebar side="left">{left}</Sidebar>
      <Sidebar side="right">{right}</Sidebar>
      <div className={styles.SidebarLine}>
        <LabeledLine leftLabel={left} rightLabel={right} />
      </div>
    </>
  );
}

interface SidebarProps {
  side: "left" | "right";
}

function Sidebar({ side, children }: PropsWithChildren<SidebarProps>) {
  const sideClass = side === "left" ? styles.left : styles.right;
  return <div className={`${styles.Sidebar} ${sideClass}`}>{children}</div>;
}
