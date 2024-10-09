import React from "react";
import Footer from "../../../../src/components/Footer/Footer";
import { rem } from "../../../../src/util/util";
import FactionsSection from "./factions-section";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div
        className="flexColumn"
        style={{
          position: "relative",
          width: "100%",
          maxWidth: rem(800),
        }}
      >
        <FactionsSection />
        {children}
      </div>
      <Footer />
    </>
  );
}
