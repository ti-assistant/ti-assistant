import { Dispatch, SetStateAction } from "react";
import { FormattedMessage } from "react-intl";
import { rem } from "../../util/util";
import Chip from "../Chip/Chip";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import styles from "./GameMap.module.scss";
import { OverlayDetails } from "./PlanetOverlay";

export default function OverlayLegend({
  overlayDetails,
  setOverlayDetails,
}: {
  overlayDetails: OverlayDetails;
  setOverlayDetails: Dispatch<SetStateAction<OverlayDetails>>;
}) {
  return (
    <div className={styles.Legend} onClick={(e) => e.stopPropagation()}>
      <LabeledDiv
        label={
          <FormattedMessage
            id="5rR4S2"
            description="Label for a section that includes map details."
            defaultMessage="View Details"
          />
        }
        style={{
          width: "fit-content",
          backgroundColor: "var(--background-color)",
        }}
        innerStyle={{
          justifyContent: "stretch",
          alignItems: "stretch",
          paddingTop: rem(16),
        }}
      >
        <div className={styles.LegendContent}>
          <Chip
            fontSize={16}
            selected={overlayDetails === "NONE"}
            toggleFn={() => setOverlayDetails("NONE")}
          >
            <FormattedMessage
              id="n8jSwp"
              description="Text on a button that will show no overlay."
              defaultMessage="None"
            />
          </Chip>
          <Chip
            fontSize={16}
            selected={overlayDetails === "OWNERS"}
            toggleFn={() => setOverlayDetails("OWNERS")}
          >
            <FormattedMessage
              id="FhKQXR"
              description="Text on a button that will show planet ownership."
              defaultMessage="Owners"
            />
          </Chip>
          <Chip
            fontSize={16}
            selected={overlayDetails === "TYPES"}
            toggleFn={() => setOverlayDetails("TYPES")}
          >
            <FormattedMessage
              id="wDLqxZ"
              description="Text on a button that will show planet types."
              defaultMessage="Types"
            />
          </Chip>
          <Chip
            fontSize={16}
            selected={overlayDetails === "TECH_SKIPS"}
            toggleFn={() => setOverlayDetails("TECH_SKIPS")}
          >
            <FormattedMessage
              id="j3n7Nr"
              description="Text on a button that will show planets with tech skips."
              defaultMessage="Tech Skips"
            />
          </Chip>
          <Chip
            fontSize={16}
            selected={overlayDetails === "ATTACHMENTS"}
            toggleFn={() => setOverlayDetails("ATTACHMENTS")}
          >
            <FormattedMessage
              id="1odgd1"
              description="Text on a button that will show planet attachments."
              defaultMessage="Attachments"
            />
          </Chip>
        </div>
      </LabeledDiv>
    </div>
  );
}
