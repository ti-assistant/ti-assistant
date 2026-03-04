"use client";

import { useState } from "react";
import { TechRow } from "../../../../../src/TechRow";
import { rem } from "../../../../../src/util/util";
import ObjectiveRow from "../../../../../src/components/ObjectiveRow/ObjectiveRow";

const SIZES = ["0.25rem", "0.5rem", "1rem", "2rem", "4rem"];

export default function DemoPage() {
  const [fontSize, setFontSize] = useState("1rem");
  return (
    <>
      <div
        className="flexRow"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        {SIZES.map((size) => {
          return (
            <button key={size} onClick={() => setFontSize(size)}>
              {size}
            </button>
          );
        })}
      </div>
      <div className="flexColumn" style={{ fontSize }}>
        <ObjectiveRow objectiveId="Lead from the Front" />
        <ObjectiveRow
          addObjective={() => {}}
          objectiveId="Lead from the Front"
        />
        <ObjectiveRow
          removeObjective={() => {}}
          objectiveId="Lead from the Front"
        />
        <ObjectiveRow
          scoreObjective={() => {}}
          objectiveId="Lead from the Front"
          factionId="Vuil'raith Cabal"
        />
      </div>
    </>
  );
}
