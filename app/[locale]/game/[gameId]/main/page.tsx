import { Suspense } from "react";
import Footer from "../../../../../src/components/Footer/Footer";
import Header from "../../../../../src/components/Header/Header";
import { Loader } from "../../../../../src/Loader";
import styles from "./main.module.scss";
import PhaseSection from "./phase/phase-section";
import LoadingSummaryColumn from "./summary-column/LoadingSummaryColumn";
import SummaryColumn from "./summary-column/SummaryColumn";

export default async function Page() {
  return (
    <>
      <Header />
      <div className={styles.Main}>
        <Suspense fallback={<Loader />}>
          <PhaseSection />
        </Suspense>
        <Suspense fallback={<LoadingSummaryColumn />}>
          <SummaryColumn />
        </Suspense>
      </div>
      <Footer />
    </>
  );
}
