import React, { PropsWithChildren } from "react";
import styles from "./main.module.scss";
import Footer from "../../../../src/components/Footer/Footer";

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
      <Footer />
    </>
  );
}
