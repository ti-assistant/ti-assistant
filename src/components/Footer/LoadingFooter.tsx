"use client";

import { FormattedMessage } from "react-intl";
import FactionCircle from "../FactionCircle/FactionCircle";
import LabeledDiv from "../LabeledDiv/LabeledDiv";
import { Strings } from "../strings";
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
      <div className={styles.UpdateBox}>
        <LabeledDiv
          label={
            <FormattedMessage
              id="VjlCY0"
              description="Text specifying a section that includes update operations."
              defaultMessage="Update"
            />
          }
        >
          <div className="flexColumn" style={{ alignItems: "flex-start" }}>
            <div className="flexRow">
              <Strings.Speaker />:
              <FactionCircle />
            </div>
            <div
              className="flexRow"
              style={{ width: "100%", alignItems: "center" }}
            >
              <button>
                <FormattedMessage
                  id="ys7uwX"
                  description="Shortened version of technologies."
                  defaultMessage="Techs"
                />
              </button>

              <button>
                <FormattedMessage
                  id="5Bl4Ek"
                  description="Cards that define how to score victory points."
                  defaultMessage="Objectives"
                />
              </button>
              <button>
                <FormattedMessage
                  id="1fNqTf"
                  description="Planets."
                  defaultMessage="Planets"
                />
              </button>
            </div>
          </div>
        </LabeledDiv>
      </div>
    </>
  );
}
