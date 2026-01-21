"use client";

import { FormattedMessage } from "react-intl";
import ObjectivesMenuSVG from "../../icons/ui/ObjectivesMenu";
import PlanetMenuSVG from "../../icons/ui/PlanetMenu";
import RelicMenuSVG from "../../icons/ui/RelicMenu";
import ThundersEdgeMenuSVG from "../../icons/ui/ThundersEdgeMenu";
import { rem } from "../../util/util";
import FactionCircle from "../FactionCircle/FactionCircle";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { Strings } from "../strings";
import TechSkipIcon from "../TechSkipIcon/TechSkipIcon";
import styles from "./Footer.module.scss";

export default function LoadingFooter() {
  return (
    <>
      <button
        className={styles.MobileMenuButton}
        style={{
          backgroundColor: "#333",
        }}
      >
        <div className={styles.MenuBar}></div>
        <div className={styles.MenuBar}></div>
        <div className={styles.MenuBar}></div>
      </button>
      <LabeledDiv
        className={styles.UpdateBox}
        innerClass={styles.UpdateBoxContent}
        label={
          <FormattedMessage
            id="VjlCY0"
            description="Text specifying a section that includes update operations."
            defaultMessage="Update"
          />
        }
      >
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <FactionCircle size={40} />
          <span className={styles.ButtonLabel}>
            <Strings.Speaker />
          </span>
        </div>
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            style={{
              width: rem(34),
              padding: rem(2),
              aspectRatio: 1,
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <TechSkipIcon size={28} outline />
            </div>
          </button>
          <span className={styles.ButtonLabel}>Techs</span>
        </div>
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            style={{
              width: rem(34),
              padding: rem(2),
              aspectRatio: 1,
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <ObjectivesMenuSVG />
            </div>
          </button>
          <span className={styles.ButtonLabel}>Objectives</span>
        </div>
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            style={{
              width: rem(34),
              padding: rem(2),
              aspectRatio: 1,
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <PlanetMenuSVG />
            </div>
          </button>
          <span className={styles.ButtonLabel}>Planets</span>
        </div>
        <div className={styles.UpdateBoxElement} style={{ gap: 0 }}>
          <button
            style={{
              width: rem(34),
              padding: rem(2),
              aspectRatio: 1,
              borderRadius: "100%",
            }}
          >
            <div
              className="flexRow"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gridAutoFlow: "row",
                position: "relative",
                width: rem(30),
                height: rem(30),
                gap: rem(1),
              }}
            >
              <div
                style={{
                  width: "calc(1.875rem / 2)",
                  height: "100%",
                  gridColumn: "2 / 4",
                }}
              >
                <RelicMenuSVG />
              </div>
              <div
                style={{
                  width: "calc(1.875rem / 2)",
                  height: "100%",
                  gridColumn: "3 / 4",
                }}
              >
                <ThundersEdgeMenuSVG />
              </div>
            </div>
          </button>
          <span className={styles.ButtonLabel} style={{ whiteSpace: "wrap" }}>
            Other
          </span>
        </div>
      </LabeledDiv>
    </>
  );
}
