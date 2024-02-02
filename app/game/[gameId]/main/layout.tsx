import React, { PropsWithChildren } from "react";
import styles from "./main.module.scss";
import Footer from "../../../../src/components/Footer/Footer";

export default async function Layout({
  children,
  summary,
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.Main}>
        {children}
        {summary}
      </div>
      <Footer />
    </>
  );
}
