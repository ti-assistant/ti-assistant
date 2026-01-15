import { CSSProperties } from "react";
import { useOptions } from "../../context/dataHooks";
import { rem } from "../../util/util";
import MobileObjectiveGrid from "./elements/MobileObjectiveGrid";
import ObjectiveGrid from "./elements/ObjectiveGrid";
import OtherObjectivesGrid from "./elements/OtherObjectivesGrid";

interface ExtendedCSS extends CSSProperties {
  "--color": string;
}

export default function ObjectivePanel({ asModal }: { asModal?: boolean }) {
  const options = useOptions();

  return (
    <>
      <div className="tabletOnly">
        <MobileObjectiveGrid />
      </div>
      <div
        className="flexColumn nonTablet"
        style={{
          justifyContent: "flex-start",
          alignItems: "flex-start",
          width: "100%",
          padding: rem(8),
          paddingLeft: (options["game-variant"] ?? "normal").startsWith(
            "alliance"
          )
            ? rem(24)
            : rem(8),
          height: "100%",
          gap: rem(24),
          isolation: "isolate",
          backgroundColor: "var(--background-color)",
          borderRadius: rem(8),
        }}
      >
        <ObjectiveGrid asModal={asModal} />
        <OtherObjectivesGrid />
      </div>
    </>
  );
}
