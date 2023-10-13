import { PropsWithChildren } from "react";
import styles from "./Sidebar.module.scss";

interface SidebarProps {
  side: "left" | "right";
}

export default function Sidebar({
  side,
  children,
}: PropsWithChildren<SidebarProps>) {
  const sideClass = side === "left" ? styles.left : styles.right;
  return <div className={`${styles.Sidebar} ${sideClass}`}>{children}</div>;
}
