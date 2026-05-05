"use client";

import { useState } from "react";
import { TechRow } from "../../../../../src/TechRow";
import { rem } from "../../../../../src/util/util";
import ObjectiveRow from "../../../../../src/components/ObjectiveRow/ObjectiveRow";
import Card, { FactionCard } from "../../../../../src/components/Card/Card";
import FormattedDescription from "../../../../../src/components/FormattedDescription/FormattedDescription";
import ability from "../../../../../src/icons/twilightsfall/ability";
import { InfoRow } from "../../../../../src/InfoRow";
import Reminder from "../../../../../src/components/Card/Reminder";
import FactionIcon from "../../../../../src/components/FactionIcon/FactionIcon";

const SIZES = ["0.25rem", "0.875rem", "1rem", "2rem", "4rem"];

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
      <div
        className="flexColumn"
        style={{ fontSize, alignItems: "flex-start" }}
      >
        <Card label="End of Turn">
          <div
            className="flexColumn"
            style={{ gap: "0.25em", alignItems: "flex-start" }}
          >
            <Reminder text="Mirage" type="LEGENDARY" />
            <Reminder text="Hope's End" type="LEGENDARY" />
            <Reminder text="Bio-Stims" type="TECH" subType="GREEN" />
          </div>
        </Card>
        <div
          className="flexColumn"
          style={{ gap: "0.25em", alignItems: "flex-start" }}
        >
          <Reminder text="Mirage" type="LEGENDARY" />
          <Reminder text="Hope's End" type="LEGENDARY" />
          <Reminder text="Bio-Stims" type="TECH" subType="GREEN" />
        </div>
      </div>
    </>
  );
}
