import React from "react";
import styles from "./main.module.scss";

export default async function Layout({
  children,
  phase,
  summary,
}: {
  children: React.ReactNode;
  phase: React.ReactNode;
  summary: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.Main}>
        {phase}
        {summary}
      </div>
      {children}
    </>
  );
}
