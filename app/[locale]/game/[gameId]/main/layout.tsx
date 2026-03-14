import React, { Suspense } from "react";
import { Loader } from "../../../../../src/Loader";
import styles from "./main.module.scss";
import PhaseSection from "./phase/phase-section";
import LoadingSummaryColumn from "./summary-column/LoadingSummaryColumn";
import SummaryColumn from "./summary-column/SummaryColumn";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={styles.Main}>
        <Suspense fallback={<Loader />}>
          <PhaseSection />
        </Suspense>
        <Suspense fallback={<LoadingSummaryColumn />}>
          <SummaryColumn />
        </Suspense>
      </div>
      {children}
    </>
  );
}
