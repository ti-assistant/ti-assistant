import React from "react";
import Footer from "../../../../src/components/Footer/Footer";
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
          maxWidth: "800px",
        }}
      >
        <FactionsSection />
        {children}
      </div>
      <Footer />
    </>
  );
}
